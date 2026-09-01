/* ==========================================================================
   KREATED V2 — HERO MARK, TRUE 3D

   Same approved concept as the Canvas 2D renderer it supersedes: the Kreated
   mark IS the artwork, nothing in front of it, nothing around it. Only the
   rendering model changes.

   What the 2D version could not do, and why that forced this rewrite:

     · no self-occlusion — separated pieces read as coplanar cutouts, because
       a 2D painter has no depth buffer
     · no true normals — side walls were shaded by SCREEN POSITION, so the
       concave notches where the arrow meets the stem were lit as if convex
     · no real perspective — near and far edges foreshortened equally
     · no environment response — every surface answered one synthetic key
     · stamped extrusion banded at 2x DPR

   All five are properties of the rendering model, not tuning parameters.

   Geometry comes from assets/img/kreated-mark.svg at runtime, so the approved
   file is the single source of truth — the 2D renderer had to carry a copy of
   the path data inline, which could drift from the asset.
   ========================================================================== */
import * as THREE from 'three';
import { SVGLoader } from 'three/SVGLoader';

export function mount(canvas, host, opts) {
  var reduce = !!opts.reduce;
  var fine = !!opts.fine;
  var tier = opts.tier || 'full';          /* 'full' | 'lite'                */

  var renderer, scene, camera, group, env, pmrem, baseScale = 1;
  var pieces = [];
  var raf = 0, last = 0, visible = true, disposed = false;
  var pointerX = null, pointerY = null, curX = 0, curY = 0;

  var DPR_CAP = tier === 'lite' ? 1.4 : 1.75;
  var FRAME_MS = tier === 'lite' ? 50 : 33;   /* the motion is slow; 20–30fps
                                                 is visually indistinguishable
                                                 here and much cheaper        */

  /* ---- the studio environment ------------------------------------------
     A polished metal mostly shows what is AROUND it, not what shines on it.
     Directional lights give a smooth metal only a pinpoint highlight, which
     is why an earlier pass here had a cobalt rim light at high intensity and
     no visible cobalt at all. So the cobalt lives in the environment: a dark
     room with one broad cool-white softbox and one cobalt strip, which the
     side walls and bevels then genuinely reflect.

     This is also why three's stock RoomEnvironment was dropped — it is a
     neutral white room, and the brand accent has to be in the reflection. */
  function buildEnvScene() {
    var s = new THREE.Scene();
    s.background = new THREE.Color(0x04060b);

    /* A flat emitter reflects as a flat block; a gradient reflects as falloff.
       Only the key needs it — the rest are small and hard on purpose. */
    function gradTex() {
      var c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      var g = c.getContext('2d');
      var rg = g.createRadialGradient(32, 24, 2, 32, 32, 40);
      rg.addColorStop(0, '#ffffff');
      rg.addColorStop(0.55, '#8fa2bd');
      rg.addColorStop(1, '#000000');
      g.fillStyle = rg; g.fillRect(0, 0, 64, 64);
      var t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    function panel(hex, intensity, w, h, x, y, z, rx, ry, tex) {
      var mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
      mat.color = new THREE.Color(hex).multiplyScalar(intensity);
      if (tex) mat.map = tex;
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      m.position.set(x, y, z);
      m.rotation.set(rx || 0, ry || 0, 0);
      s.add(m);
    }

    /* Five elements, down from eight. The three that were cut — a second
       cobalt bounce, a rear cool bounce and a graded ceiling — could not be
       told apart in side-by-side captures, and each one costs a face in every
       PMREM sample. Simplification, not compromise. */

    /* 1 · key softbox, upper-front-left, broad and graded */
    panel(0xffffff, 26.0, 15, 12, -8.0, 5.6, 5.0, 0, Math.PI * 0.28, gradTex());
    /* 2 · narrow hard white strip — the crisp bevel catches */
    panel(0xf6faff, 70.0, 0.8, 11, 2.4, 7.4, 3.4, Math.PI * 0.42, 0);
    /* a second hard strip, crossed against the first — glass needs more than
       one bright edge or the caustics all run the same direction */
    panel(0xeaf3ff, 58.0, 0.6, 10, -5.2, -3.0, 2.6, 0, Math.PI * 0.16);
    /* 3 · cobalt strip, rear-right. Narrow: cobalt lands on edges, not faces */
    panel(0x0a47f0, 30.0, 1.5, 13, 8.6, -0.4, -1.4, 0, -Math.PI * 0.5);
    /* 4 · THE FRONT DIFFUSER — replaces the black negative-fill flag that
           used to stand here. A flag is right for metal, where killing one
           side is what makes the other read as lit. For GLASS it is fatal:
           the mark's faces point at the camera, so they were reflecting a
           black card and the whole object went dark. Product glass is shot
           against a large bright diffuser for exactly this reason. */
    panel(0xf2f8ff, 12.0, 17, 15, 6.4, 1.0, 6.2, 0, -Math.PI * 0.40);
    /* a smaller dark card stays, well off to one side, so the form still has
       a shadow side and does not flatten into a slab of light */
    panel(0x02040a, 1.0, 7, 12, -9.2, -1.6, 1.4, 0, Math.PI * 0.46);
    /* extra hard strips at varied angles — one light source gives one
       highlight direction; glass needs several to read as glass */
    panel(0xffffff, 64.0, 0.5, 12, -1.4, 6.2, -3.2, Math.PI * 0.30, 0);
    panel(0xdCEBFF, 50.0, 0.45, 10, 6.0, 2.4, 4.2, 0, -Math.PI * 0.34);
    panel(0xbfd8ff, 44.0, 0.4, 11, -6.6, 0.6, -1.0, 0, Math.PI * 0.40);
    /* 5 · dark floor, grounds the reflection */
    panel(0x05070d, 1.0, 26, 26, 0, -10, 0, -Math.PI / 2, 0);
    return s;
  }

  var sweep = null;

  function buildLights() {
    /* Four lights, down from seven. The off-axis fill, the soft neutral fill
       and the second cool rim were each removable without a visible
       difference once the environment was doing the reflection work — they
       were adding shader cost and three more numbers to tune. */

    /* the key: frontal, so the small yaw swing cannot swing it into darkness */
    var key = new THREE.DirectionalLight(0xeef2fa, 3.6);
    key.position.set(-2.1, 2.5, 5.8);
    scene.add(key);

    /* The cobalt source sits BEHIND the mark now. At z:0.6 it was almost in
       the camera plane and washed the front faces blue — the returns already
       carry cobalt as their own base colour and do not need a blue key. From
       behind it only rakes the turn-away walls, which is where it belongs. */
    var rim = new THREE.DirectionalLight(0x0a47f0, 2.6);
    rim.position.set(4.4, -0.9, -2.6);
    scene.add(rim);

    /* THE SIGNATURE SWEEP. One light, tracking slowly across the front on a
       long period, its colour running cool white -> cobalt as it travels so
       the brand accent is part of the event rather than a separate channel. */
    sweep = new THREE.DirectionalLight(0xf4f8ff, 0);
    sweep.position.set(0, 1.4, 5.0);
    scene.add(sweep);

    scene.add(new THREE.AmbientLight(0x2a2f38, 0.62));
  }

  /* ---- material -------------------------------------------------------
     Dark graphite / black chrome. Metallic enough to answer the environment,
     rough enough never to look wet or liquid. */
  /* ---- material: THE MARK IS GLASS -------------------------------------
     Reflective glass, not transmissive glass — and that choice is forced by
     the canvas, not by preference.

     `transmission` re-renders the scene behind the object into a target and
     refracts THAT. This canvas is alpha:true over the page, so the scene
     behind the mark is empty: the transmission target came back transparent,
     there was nothing to bend, and the mark rendered as a flat opaque sheen.
     Giving the scene a background would fix the refraction and simultaneously
     paint that background over the navy page, which is worse.

     So the look is built the way the reference photograph actually reads:
     mostly SPECULAR. The studio strips gather along the bevels into bright
     caustic lines, low opacity lets the page show through the body, thin-film
     iridescence supplies the faint violet at grazing angles, and cobalt sits
     in the sheen rather than in a transmitted tint.
     ---------------------------------------------------------------------- */
  function glassMaterial(opts) {
    return new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: opts.rough,
      /* real refraction now that the scene has a background to bend */
      transmission: 1,
      thickness: opts.thickness,
      ior: 1.5,
      /* the chromatic fringing on the reference's edges — physical, not a
         post effect, so it only appears where the glass is actually thick */
      dispersion: opts.dispersion,
      attenuationColor: opts.tint,
      attenuationDistance: opts.dist,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      iridescence: 0.18,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [120, 420],
      envMapIntensity: opts.env,
      side: THREE.DoubleSide
    });
  }
  function faceMaterial() {
    return glassMaterial({ rough: 0.015, thickness: 0.9, dispersion: 3.0,
                           tint: 0xe8f4ff, dist: 14.0, env: 6.5 });
  }
  function wallMaterial() {
    /* the long axis through the tube — deepest colour, strongest dispersion */
    return glassMaterial({ rough: 0.03, thickness: 1.8, dispersion: 4.5,
                           tint: 0xbcdcf5, dist: 8.0, env: 7.5 });
  }

  function buildGeometry(svgText) {
    var data = new SVGLoader().parse(svgText);
    var shapes = [];
    /* Each SVG path is one logical piece — the mark's own structure. Nothing
       is merged, split, redrawn or invented. */
    data.paths.forEach(function (p) {
      var s = SVGLoader.createShapes(p);
      if (s.length) shapes.push(s);
    });
    if (!shapes.length) throw new Error('no shapes in mark');

    /* Glass needs CURVATURE — caustics come from curved surfaces gathering a
       light source into a line. A 3.4-unit bevel on a 600-unit viewBox is a
       hard edge with nothing to gather, which is why the first glass pass
       read as flat translucent plastic. A fat, well-tessellated bevel turns
       every edge of the mark into a rounded rim that behaves like the rims in
       the reference. */
    /* The reference's links are ROUND — highlights travel through volume
       instead of tracing an outline. An extruded plate cannot do that however
       big its bevel, so the profile is inverted here: almost no straight
       depth, and a deep bevel that consumes the whole cross-section. The
       strokes come out as rounded tubes rather than flat slabs. */
    var depth = 5;                     /* in SVG units (viewBox is 600)      */
    var bevel = 12;

    group = new THREE.Group();

    shapes.forEach(function (shapeSet, i) {
      var geo = new THREE.ExtrudeGeometry(shapeSet, {
        depth: depth,
        bevelEnabled: true,
        bevelThickness: bevel * 1.5,
        bevelSize: bevel,
        bevelSegments: tier === 'lite' ? 5 : 12,
        curveSegments: tier === 'lite' ? 8 : 18
      });
      /* SVG runs Y-down, three runs Y-up. Doing that with a negative scale
         MIRRORS the object, and a mirror inverts the normals: every front
         face then lights as though it points away from the camera, which
         renders the whole mark near-black no matter how bright the studio is.
         So the flip is baked into the geometry and the winding is reversed to
         match, which keeps the transform a proper rotation. */
      geo.scale(1, -1, 1);
      var pos = geo.getAttribute('position');
      if (!geo.index) {
        var arr = pos.array, j, tmp;
        for (var v = 0; v < arr.length; v += 9) {      /* swap verts 0 and 2 */
          for (j = 0; j < 3; j++) {
            tmp = arr[v + j]; arr[v + j] = arr[v + 6 + j]; arr[v + 6 + j] = tmp;
          }
        }
        pos.needsUpdate = true;
      }
      geo.computeVertexNormals();
      var mesh = new THREE.Mesh(geo, [faceMaterial(), wallMaterial()]);
      group.add(mesh);
      pieces.push({ mesh: mesh, index: i });
    });

    /* centre on the real ink bounds and normalise scale */
    var box = new THREE.Box3().setFromObject(group);
    var size = new THREE.Vector3(); box.getSize(size);
    var mid = new THREE.Vector3(); box.getCenter(mid);
    group.children.forEach(function (m) {
      m.geometry.translate(-mid.x, -mid.y, -mid.z);
    });
    /* mobile frames tighter and larger — a branded closing moment, not a
       shrunken desktop canvas */
    /* signage scale: the mark is the hero's dominant object, not a logo in
       the right column. Mobile goes larger still and crops at both edges. */
    var s = (tier === 'lite' ? 3.55 : 3.05) / Math.max(size.x, size.y);
    baseScale = s;
    group.scale.setScalar(s);
    scene.add(group);
  }

  /* ---- deconstruction --------------------------------------------------
     Same envelope as the approved 2D behaviour: flat, smooth open, hold,
     smooth settle, flat. Now the separation runs mostly along Z, so pieces
     genuinely pass in front of one another and the depth buffer does the
     occlusion that the 2D version had to fake and could not. */
  /* p is 0..1 across SEP_S (20s). The event occupies the first ~10% of it:
       0.000–0.040   separate, 0.8s, eased
       0.040–0.060   hold, 0.4s
       0.060–0.085   rejoin, 0.5s — deliberately faster than the separation
     …and the mark sits perfectly composed for the remaining 18 seconds. */
  function sepEnv(p) {
    var a;
    if (p >= 0.085) return 0;
    if (p < 0.040) { a = p / 0.040; return a * a * (3 - 2 * a); }
    if (p < 0.060) return 1;
    a = 1 - (p - 0.060) / 0.025;
    return a * a * (3 - 2 * a);
  }
  /* a barely-there overshoot as the pieces seat — 1.5%, once, on the rejoin */
  function settleScale(p) {
    if (p < 0.085 || p > 0.125) return 1;
    return 1 + 0.015 * Math.sin(((p - 0.085) / 0.040) * Math.PI);
  }
  /* ONE pass, ~1s, fired on the settle. No ambient shimmer between events. */
  function sweepEnv(p) {
    if (p < 0.070 || p > 0.120) return 0;
    return Math.sin(((p - 0.070) / 0.050) * Math.PI);
  }

  var SEP_S = 20, YAW_S = 14, PITCH_S = 17;

  /* the sweep envelope: flat for most of the period, one smooth rise and
     fall. Same shape language as the separation, deliberately out of phase
     with it (29 vs 19) so the two events never coincide. */
  function sweepEnv(p) {
    if (p < 0.10 || p > 0.62) return 0;
    var a = (p - 0.10) / 0.52;
    return Math.sin(a * Math.PI);
  }

  function pose(t, sepScale) {
    /* biased negative: that is the side facing the key, so the mark is well
       lit across the whole loop instead of only half of it */
    /* was ±3.0° / ±2.2° over 23s and 31s — measurably animating, but small
       enough that a glance read it as static. Now ±7.0° / ±2.6° over 14s. */
    var yaw = -0.030 + Math.sin(t * Math.PI * 2 / YAW_S) * 0.122 + curX * 0.052;
    var pitch = Math.sin(t * Math.PI * 2 / PITCH_S) * 0.045 + curY * 0.038;
    group.rotation.y = yaw;
    group.rotation.x = pitch;
    var ss = settleScale((t % SEP_S) / SEP_S);
    group.scale.setScalar(baseScale * ss);

    /* THE SPECULAR EVENT — a real light crossing the object, not an overlay */
    if (sweep) {
      var sp = (t % SEP_S) / SEP_S;
      var e = sweepEnv(sp);
      sweep.intensity = e * 4.2;
      /* travels left to right across the front, dipping slightly as it goes */
      /* the pass travels across the front during its ~1s window only */
      var w = Math.min(1, Math.max(0, (sp - 0.070) / 0.050));
      var ang = (-1.05 + w * 2.1);
      sweep.position.set(Math.sin(ang) * 5.4, 1.9 - w * 1.4, Math.cos(ang) * 5.0);
      /* and cools from white into cobalt as it crosses, so the brand accent
         is part of the one event instead of a second moving light */
      var m = Math.min(1, Math.max(0, (sp - 0.085) / 0.035));
      sweep.color.setRGB(1 - m * 0.86, 1 - m * 0.62, 1);
    }

    var sep = sepScale * sepEnv((t % SEP_S) / SEP_S);
    for (var i = 0; i < pieces.length; i++) {
      var m = pieces[i].mesh;
      /* alternate direction so pieces pull apart THROUGH each other in depth;
         the XY component stays tiny so the silhouette never breaks up */
      var dir = i % 2 === 0 ? 1 : -1;
      /* ~10px lateral at the new scale (≈178px per world unit), with a
         modest depth term so the pieces pass rather than slide. */
      m.position.z = dir * sep * 0.20;
      m.position.x = dir * sep * 0.060;
    }
  }

  function render() { renderer.render(scene, camera); }

  function loop(now) {
    if (disposed) return;
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    if (now - last < FRAME_MS) return;
    last = now;
    if (fine && pointerX !== null) {
      curX += ((pointerX - 0.5) - curX) * 0.015;
      curY += ((pointerY - 0.5) - curY) * 0.015;
    } else {
      curX += (0 - curX) * 0.015; curY += (0 - curY) * 0.015;
    }
    pose(now / 1000, tier === 'lite' ? 0.72 : 1);
    render();
  }

  function resize() {
    var r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    var dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    renderer.setPixelRatio(dpr);
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    if (reduce) render();
  }

  var rt = null;
  function onResize() { clearTimeout(rt); rt = setTimeout(resize, 160); }
  function onPointer(e) {
    var r = host.getBoundingClientRect();
    pointerX = (e.clientX - r.left) / r.width;
    pointerY = (e.clientY - r.top) / r.height;
  }
  function onLeave() { pointerX = null; pointerY = null; }

  /* ---- boot ------------------------------------------------------------ */
  return fetch('assets/img/kreated-mark.svg')
    .then(function (r) {
      if (!r.ok) throw new Error('mark fetch ' + r.status);
      return r.text();
    })
    .then(function (svgText) {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas, antialias: true, alpha: false, powerPreference: 'high-performance'
      });
      renderer.setClearColor(0x0b1220, 1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.55;

      scene = new THREE.Scene();
      /* THE FIX THAT MAKES REAL GLASS POSSIBLE.
         transmission refracts whatever the transmission render target
         contains, and on an alpha canvas that target is empty — which is why
         the first attempt rendered as a flat opaque sheen. The canvas is now
         OPAQUE in exactly the page's --navy (#0B1220), so it is seamless
         against the page and refraction finally has a ground to bend. */
      scene.background = new THREE.Color(0x0b1220);

      /* Restrained perspective. A narrow FOV keeps the mark close to front-on
         and avoids the wide-angle look that instantly reads as a 3D demo. */
      camera = new THREE.PerspectiveCamera(19, 1, 0.1, 100);
      camera.position.set(0, 0, 10.4);

      /* dark room environment, at low intensity — enough for the metal to
         have something to reflect, not enough to light the scene */
      pmrem = new THREE.PMREMGenerator(renderer);
      env = pmrem.fromScene(buildEnvScene(), 0.028).texture;
      scene.environment = env;

      buildLights();
      buildGeometry(svgText);
      resize();

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; },
          { rootMargin: '120px' }).observe(host);
      }
      window.addEventListener('resize', onResize, { passive: true });

      if (reduce) {
        /* a designed still: fully assembled, turned just enough to show the
           bevel and the side walls, cobalt on the rim */
        curX = 0; curY = 0;
        /* Chosen, not frozen. t = 4.6 catches the specular event on its rise
           — about a third of the way up — so the bevels and the upper faces
           are described without the mark flaring toward chrome, which the
           peak does. The second argument forces separation to exactly 0, so
           the silhouette is the approved mark, fully assembled. */
        pose(4.6, 0);
        render();
      } else {
        if (fine) {
          host.addEventListener('pointermove', onPointer, { passive: true });
          host.addEventListener('pointerleave', onLeave, { passive: true });
        }
        raf = requestAnimationFrame(loop);
      }

      return {
        dispose: function () {
          disposed = true;
          if (raf) cancelAnimationFrame(raf);
          clearTimeout(rt);
          window.removeEventListener('resize', onResize);
          host.removeEventListener('pointermove', onPointer);
          host.removeEventListener('pointerleave', onLeave);
          pieces.forEach(function (p) {
            p.mesh.geometry.dispose();
            p.mesh.material.forEach(function (m) { m.dispose(); });
          });
          if (env) env.dispose();
          if (pmrem) pmrem.dispose();
          renderer.dispose();
        }
      };
    });
}
