# MORROW COFFEE CO.
## Creative Direction — v1.0
*A fictional brand concept by Kreated. Raleigh, NC.*

> **LOCKED.** This is the authoritative design specification for the Morrow homepage and
> case study. Saved beside the build on 2026-09-03 exactly as supplied. Do not casually
> reinterpret section order, brand concept, typography, colours, motion, copy, menu or the
> mobile recomposition. Every decision below is final unless production photography forces
> a crop change.

---

## 1. BRAND CONCEPT

**Central creative idea**

Morrow is built around the first hour of the day — the one most people skip. The name is old English for "morning" and modern shorthand for "tomorrow," and the brand lives in that overlap: a place that treats the start of the day as the point, not the obstacle. Everything — the light in the room, the pace at the bar, the fact that the bakery is done by six — is designed to make one hour feel worth having. It is a coffee bar that argues, quietly, for going slower.

**Brand idea (one line):** *The first hour, taken seriously.*

**Positioning:** Raleigh's modern neighborhood coffee bar and bakery — precise coffee, a beautifully lit room, pastries baked that morning, and a pace that doesn't rush you out.

**Personality:** Composed. Warm. Exacting about coffee, relaxed about everything else. Dry sense of humor. Speaks in short sentences. Never explains itself twice.

**Target customer:** 26–45, lives or works inside the Beltline — Oakwood, Boylan Heights, Glenwood South, Five Points. Architects, designers, nurses coming off shift, remote workers, NC State faculty, people walking a dog at 7am. They know what a cortado is and don't need it explained. They'd rather pay $5.50 for something correct than $4 for something forgettable.

**Emotional feeling:** Clear-headed. Unhurried. Like the ten minutes after you wake up on a day with nothing scheduled.

**Brand voice:** Understated, confident, slightly cultured, human. Uses plain words. Comfortable with a period at the end of a three-word sentence. Occasionally funny, never cute. No exclamation points, ever.

**What makes Morrow distinctive:**
- The morning is the product. Most cafés sell coffee; Morrow sells the first hour.
- Bakery is genuinely a co-lead, not an afterthought — everything is out by 6:30am and it sells out.
- North Carolina ingredients used quietly (sorghum, local dairy, NC honey) without a farm-to-table sermon.
- The room is designed around light. East-facing, long windows, and the website behaves the same way.
- Restraint as a signature: one serif, one grotesk, one accent color, no illustrations of coffee beans.

---

## 2. VISUAL IDENTITY

### Palette

Caramel is removed from the UI palette — it lives only in the photography (crema, laminated pastry, oak). Using it as a UI color is what makes coffee sites look like beige templates. Clay does the accent work instead.

**Backgrounds**
| Name | HEX | Use |
|---|---|---|
| Morrow Ivory | `#F2ECE1` | Primary page background |
| Bone | `#E7DFCF` | Secondary panels, menu backgrounds, hover states |
| Espresso | `#231B16` | Dark sections (statement, sourcing, footer) |

**Text**
| Name | HEX | Use |
|---|---|---|
| Espresso | `#231B16` | Primary text on light |
| Roast | `#5C4F45` | Secondary text, captions, prices on light |
| Ivory | `#F2ECE1` | Primary text on dark |
| Ash | `#B8AFA1` | Secondary text on dark |

**Accents**
| Name | HEX | Use |
|---|---|---|
| Olive | `#6E7358` | Seasonal section background, active nav state, tags |
| Clay | `#B3623F` | The single accent. Link underlines, "Sold out / Now" labels, focus rings, one word per section maximum |
| Steel | `#A6A8A3` | Hairline dividers on dark, icon strokes. Never a background |

Rule: Clay appears no more than once per viewport. If it's everywhere, it's nowhere.

### Typography

**Display — Editorial serif.** Recommended: **PP Editorial New** (Pangram Pangram). Free/close alternative for build: **Instrument Serif** (Google Fonts). High-contrast, slightly sharp, reads as magazine not as bakery.

**Text / UI — Neutral grotesk.** Recommended: **Söhne** (Klim). Free alternative: **Inter Tight** at `letter-spacing: -0.01em`. Neutral enough to disappear behind the serif.

**Labels / data — Monospace.** **JetBrains Mono** (free). Used for hours, prices, coordinates, section indices ("02 / THE BAR"). This is what gives the site an editorial-architectural edge instead of a café edge.

**Headline rules**
- Display serif, uppercase, tracking `-0.02em`, line-height `0.92`.
- Scale: hero `clamp(4rem, 11vw, 12rem)`; section statements `clamp(3rem, 7vw, 8rem)`; section titles `clamp(2rem, 3.5vw, 3.75rem)`.
- One italic word per headline maximum, lowercase, used for the emotional beat: COFFEE FOR *slower* MORNINGS.
- Headlines are never centered above 768px. Left-aligned or bottom-anchored.
- Never bold the serif. Weight comes from size.

**Body rules**
- Grotesk, 17px base desktop / 16px mobile, line-height `1.55`, max-width `38ch`.
- Paragraphs are short. Two to three sentences. If it needs four, cut one.
- Mono labels: 11–12px, uppercase, tracking `0.08em`, Roast or Ash color.

### Spacing philosophy
Generous, architectural, and consistent. 8px base grid; section padding `clamp(96px, 12vw, 200px)` vertical. Horizontal margins are wide (`clamp(24px, 6vw, 120px)`). Twelve-column grid, but most sections use only 6–8 of them — asymmetry is deliberate. Whitespace is the most-used element on the site.

### Border / radius philosophy
**Radius: 0.** Everything is square. Images, buttons, panels. The only curve on the site is the logomark and the physical cups in photos. Buttons are text with a 1px underline or a 1px-bordered rectangle. Hairlines (`1px`, Espresso at 15% opacity on light / Steel at 30% on dark) separate menu rows and footer columns. No shadows, no cards, no glass.

### Photographic treatment
Natural directional light only, 7–9am quality. Warm but not orange. Shadows are long, soft-edged, and welcome — they are a compositional element. Slight underexposure (–0.3 EV) to keep ivory from blowing out. Full palette detail in Section 7.

### Texture / grain
Fine film grain (ISO 400 look, ~4% opacity) applied to all photography via CSS overlay, not baked in. Ivory backgrounds get a barely-visible paper noise (`opacity: 0.025`). No gradients anywhere except the natural falloff inside photographs.

### Iconography
Almost none. Where needed (hours, location, arrow), 1.25px stroke, square caps, Steel or Espresso. Arrows are a simple `→`. No coffee cup, bean, or steam icons. Ever.

### Logo direction
**Mark:** A circle bisected by a horizontal line at roughly 40% from the bottom — the sun at the horizon. Read twice: sunrise (morrow), and a cup seen from directly above with the saucer edge. Geometric, single weight, works at 12px favicon and 3m signage. Shown in Espresso on Ivory, Ivory on Espresso, or debossed into paper.

**Wordmark:** MORROW set in the display serif, uppercase, tracking `0.14em`. "COFFEE CO." set beneath in mono at 30% the cap height, tracked `0.3em`. Lockup is left-aligned by default; a stacked centered version exists for cups and signage only. Website nav uses the wordmark alone; footer uses mark + wordmark.

---

## 3. WEBSITE ART DIRECTION — HOMEPAGE, SECTION BY SECTION

The page reads as one morning, in order: light → intent → coffee → the season → bread → where it came from → the room → come in. Eight sections plus footer.

---

### 01 — HERO: "FIRST LIGHT"
*(Full detail in Section 4.)*

### 02 — THE STATEMENT
**Purpose:** Establish the idea before selling anything. This is the brand's manifesto in ~30 words.

**Layout:** Espresso background, full viewport height. Oversized statement occupies columns 1–9, bottom-left anchored. Top-right: mono index "02 / THE IDEA". A single narrow vertical photograph (columns 10–12) of morning light on a plaster wall — no product, just light.

**Copy:**
> THE DAY CAN WAIT *an* HOUR.

> Most mornings get skipped — coffee in the car, breakfast at the desk. Morrow was built for the hour before that. Good coffee, bread that came out of the oven at six, and a room that gets the first light in the neighborhood.

**Visual treatment:** Ivory type on Espresso. The photograph is the only warm element. No decoration.

**Interaction:** Statement lines reveal on scroll via clip-path, bottom-to-top, 80ms stagger. Photo is fixed within its column and drifts 8% slower than scroll.

**Mobile:** Photo moves above the text as a short 4:5 band. Statement drops to `7vw`... no — `13vw`, so it still feels oversized on a phone. Body copy max 3 lines per paragraph.

---

### 03 — THE BAR
**Purpose:** Core menu. Prove the coffee is serious without a lecture.

**Layout:** Ivory background. Left column (cols 1–4, sticky): section title "THE BAR" with a short paragraph and the current roast note in mono. Right column (cols 6–12): the menu as an editorial list — three groups (Espresso / Filter / Cold), each row: item name (grotesk), one-line descriptor (Roast color), price (mono, right-aligned). Hairline between rows. No photos in this section — the restraint is the point.

**Copy:**
> **THE BAR**
> Two espressos on the grinders, one filter that changes every few weeks, and cold coffee we actually think about. We'll tell you what's in the hopper if you ask.
>
> *Now on espresso:* Guatemala, Huehuetenango — washed, dark cherry, cocoa.

**Visual treatment:** Pure typography. Prices in mono make it feel like a menu board designed by an architect.

**Interaction:** Hovering a row shifts the whole row 6px right (ease-out, 250ms) and turns the price Clay. On hover, a small square image (240px) of that drink fades in, following the cursor at 60% lag — desktop only.

**Mobile:** Title stacks above. Sticky column becomes a static heading. Rows stay as rows; descriptor wraps beneath the name; price stays right. No cursor image.

---

### 04 — THIS SEASON
**Purpose:** The one section that changes. Gives regulars a reason to return and the site a reason to feel alive.

**Layout:** Olive background — the only colored section on the page. Horizontal scroll strip on desktop (scroll-snap), four drinks, each a tall 3:4 photograph with the name in serif beneath and a one-line note. Section header top-left: "THIS SEASON" + mono "SEPT — NOV".

**Copy:**
> **THIS SEASON**
> Four drinks for the part of the year when mornings get cold before the afternoons do.

**Visual treatment:** Photography on olive — the clay of the cups and the ivory of foam against green. This is the most "fashion editorial" moment on the page.

**Interaction:** Horizontal drag/scroll with inertia. Images have a slow 1.0→1.04 scale on hover. A mono counter "01 / 04" updates at the bottom right.

**Mobile:** Becomes a native horizontal swipe with peek (85vw cards). Header stays fixed above the strip. No drag physics needed — native scroll-snap.

---

### 05 — BAKERY: "OUT BY SIX"
**Purpose:** Elevate the bakery to a co-lead. Create urgency without a countdown timer.

**Layout:** Ivory. Two large photographs, deliberately mismatched in size: one 4:5 (cols 1–6) of laminated pastry in raking light, one 1:1 (cols 8–12, offset 20% lower) of hands scoring a loaf. Headline runs across both images as an oversized statement, partially overlapping the top of the first photo.

**Copy:**
> OUT BY *six.* GONE BY *ten.*

> Croissants, morning buns, a seeded sourdough, and one thing that changes with the market. Baked here, starting at 4am. We don't hold anything back for the afternoon — when it's gone, it's gone.

**Visual treatment:** The overlapping headline over photography is the signature editorial move of the page. Photos are unframed, no shadow.

**Interaction:** Images reveal with a horizontal mask (left to right, 900ms, `cubic-bezier(0.76, 0, 0.24, 1)`). Headline reveals after. The two photos parallax at slightly different rates (0.9x / 1.05x) so they drift apart on scroll.

**Mobile:** Photos stack, but keep the offset — the second image is inset 20px from the right so they don't become a plain column. Headline sits between them instead of over them.

---

### 06 — SOURCING: "WHERE IT'S FROM"
**Purpose:** Trust and provenance, without the plantation photography cliché.

**Layout:** Espresso background. A three-column typographic table: Origin / Producer / What it tastes like. Beneath, a single wide 21:9 photograph of green coffee in a burlap-lined crate, or a roaster's drum — materials, not landscapes. Small mono paragraph on relationships.

**Copy:**
> **WHERE IT'S FROM**
> We buy from two importers who can tell us the name of the farm, and one roaster in Durham who tells us when we're wrong. That's the whole supply chain. Milk is from Homeland Creamery in Julian. Sorghum is from the mountains.

Table rows: `GUATEMALA / Finca El Injerto / cherry, cocoa` · `ETHIOPIA / Kayon Mountain / apricot, jasmine` · `COLOMBIA / Huila co-op / caramel, red apple`

**Visual treatment:** Ivory and Ash type on Espresso. Table hairlines in Steel. The photograph is warm and material — burlap, steel drum, paper tags.

**Interaction:** Table rows fade up sequentially. Photo has a subtle slow zoom (1.0→1.05 over the scroll distance). No parallax here — this section is meant to feel still.

**Mobile:** Table collapses to stacked cards-without-cards: origin in serif, producer and notes beneath, hairline between. Photo goes to 4:3.

---

### 07 — THE ROOM
**Purpose:** Sell the space. This is where people decide to come.

**Layout:** Ivory. An asymmetric editorial gallery — five photographs of the interior in an irregular grid (one large 3:2, two portrait, two square) with generous gaps. Captions in mono beneath each ("EAST WINDOW, 7:40AM"). Section title small, top-left: "THE ROOM". One oversized statement mid-gallery.

**Copy:**
> **THE ROOM**
> Long windows, east-facing. Oak, plaster, brushed steel. Thirty-two seats and one long table for people who work better around other people.

> Statement: *MOST OF THIS IS WORTH* SITTING *FOR.*

**Visual treatment:** The most photographic section. Interiors with visible sunlight paths across floors. Steel bar hardware. No people looking at camera.

**Interaction:** Images fade in as they enter viewport (opacity + 24px rise, 700ms). Clicking opens a minimal lightbox — full-bleed image, caption bottom-left, mono counter, ESC/arrow keys. No thumbnails, no carousel dots.

**Mobile:** Gallery becomes a single column with alternating alignment (image 1 full width, image 2 at 80% right-aligned, image 3 full, etc.) to preserve rhythm.

---

### 08 — VISIT
**Purpose:** Conversion. Address, hours, directions. Make coming in feel like the natural next step.

**Layout:** Bone background. Split: left (cols 1–6) is typography — address in serif, hours in a mono table, one CTA "GET DIRECTIONS →". Right (cols 7–12) is a full-height photograph of the exterior at first light — the door, the signage mark, long shadow of a street tree. Below hours: "Also: we're open on Sundays. We're not open late. Both on purpose."

**Copy:**
> **VISIT**
> 412 E. Hargett Street
> Raleigh, NC 27601
>
> MON–FRI 6:30 — 15:00
> SAT–SUN 7:00 — 15:00
>
> Also: we're open on Sundays. We're not open late. Both on purpose.
>
> `GET DIRECTIONS →`

**Visual treatment:** Warmest section on the page. The photo should feel like arriving.

**Interaction:** Hours rows highlight the current day in Clay (read from client clock). CTA underline draws in from left on hover. If currently open, a small mono "OPEN NOW" appears beside the hours.

**Mobile:** Photo moves to top as a 3:2 band. Address and hours stack below. CTA becomes full-width bordered button.

---

### 09 — FOOTER: "UNTIL MORROW"
**Purpose:** Close the page with the brand, not a sitemap.

**Layout:** Espresso. The largest typographic moment on the page: "UNTIL *morrow.*" at `clamp(5rem, 14vw, 16rem)`, bottom-anchored, cropped slightly by the viewport bottom edge so it feels like it continues. Above it: four narrow mono columns — Menu / Visit / Instagram / Email — plus the logomark. Bottom line: "© 2026 Morrow Coffee Co. · A concept by Kreated."

**Copy:**
> Morrow Coffee Co. · Raleigh, North Carolina
> Menu · Visit · Instagram · hello@morrowcoffee.co
> UNTIL *morrow.*
> A fictional brand concept by Kreated. Not a real café — yet.

**Interaction:** Footer statement reveals with the same clip-path as the hero — the page ends the way it began. Email link copies address on click with a mono "COPIED" that replaces the text for 1.5s.

**Mobile:** Columns become a two-row grid. Statement stays cropped at the bottom edge.

---

## 4. HOMEPAGE HERO — "FIRST LIGHT"

**Headline (kept, refined typographically):**
> COFFEE FOR
> *slower*
> MORNINGS.

Three lines. Lines 1 and 3 uppercase serif; line 2 lowercase italic serif at the same size, indented one column right. The italic line is the only "soft" thing on the screen.

**Supporting copy** (mono-labeled, grotesk body, max 2 lines, positioned bottom-right, cols 9–12):
> A coffee bar and bakery in Raleigh, open from first light. Espresso, filter, pastries out by six.

**CTA:** Text link, not a button. `SEE THE MENU →` with a 1px underline. Sits directly beneath the supporting copy. A second, quieter mono link beneath it: `412 E. HARGETT ST`.

**Nav structure:** Fixed, transparent over hero, becomes Ivory with a hairline after 80px scroll.
- Left: `MORROW` wordmark
- Center: nothing
- Right: `Menu · Bakery · Visit` in grotesk 14px, plus a mono `06:30 — 15:00` that reads as an editorial detail. No hamburger on desktop. Mobile: wordmark + a single "Menu" word that opens a full-screen Espresso overlay with the three links in serif at `12vw`.

**Photography direction:** Full-bleed, 16:9 crop, shot at 7:15am. A long oak-and-stone counter edge running diagonally from bottom-left to upper-right. One cortado in a clay cup, off-center right, at the point where a shaft of window light hits the counter. The rest of the frame is soft shadow. A brushed steel portafilter handle enters the frame from the top right, out of focus. No people. Camera at counter height, 50mm, f/2.8. The image is 60% shadow, 40% light. Slight underexposure so the ivory type reads on it.

**Composition:** Headline bottom-left, occupying ~55% of the viewport width, baseline 8vh from the bottom. Supporting copy + CTA bottom-right. Top-right: mono metadata `RALEIGH, NC · 35.78°N` and `EST. 2026`. The cortado in the photo sits in the visual gap between the headline and the supporting copy — the type frames the cup.

**Typography scale:** Headline `clamp(4rem, 11vw, 12rem)`, line-height `0.9`. Supporting `17px`. Mono `12px`. Total of three type sizes on screen.

**Entrance animation (1.8s total, once, on load):**
1. `0–600ms` — Photograph reveals via a horizontal mask expanding from a 2px line at 40% height outward (top and bottom simultaneously). It reads as a blind opening or a horizon brightening — this is the logomark's line, animated.
2. `400–1200ms` — Headline lines rise in via clip-path, 90ms stagger, `cubic-bezier(0.76, 0, 0.24, 1)`.
3. `1000–1500ms` — Supporting copy, CTA, and mono metadata fade in (opacity only, no movement).
4. `1200–1800ms` — Nav fades in last.
Respects `prefers-reduced-motion`: everything appears at 0ms.

**Scroll transition into Section 02:**
The hero photograph is pinned. As the user scrolls, the Espresso statement section slides up over it (the hero doesn't move; it's covered). During the first 100vh of scroll, the hero image scales 1.0→1.08 and the headline drifts up at 0.3x scroll speed and fades to 0 — the type moves, the photo stays, so it reads as the type sinking into the image. A 1px Ivory hairline leads the top edge of the incoming section. Total feeling: a page being laid over a photograph.

---

## 5. COPY SYSTEM

**Hero headline:** COFFEE FOR *slower* MORNINGS.

**Hero supporting:** A coffee bar and bakery in Raleigh, open from first light. Espresso, filter, pastries out by six.

**Menu language:**
> Two espressos on the grinders, one filter that changes every few weeks, and cold coffee we actually think about. We'll tell you what's in the hopper if you ask.

**Sourcing language:**
> We buy from two importers who can tell us the name of the farm, and one roaster in Durham who tells us when we're wrong. That's the whole supply chain.

**Bakery language:**
> Baked here, starting at 4am. We don't hold anything back for the afternoon — when it's gone, it's gone.

**Location language:**
> East Hargett, a block from Moore Square. Long windows, east-facing. We're open on Sundays. We're not open late. Both on purpose.

**Microcopy (8):**
1. `SEE THE MENU →`
2. `GET DIRECTIONS →`
3. `OPEN NOW` / `OPENS 6:30`
4. `SOLD OUT FOR TODAY` (bakery items after 10am)
5. `NOW ON ESPRESSO —`
6. `COPIED` (email)
7. `BACK TO TOP ↑`
8. `THIS ONE'S NEW` (seasonal tag, Clay)

**Footer language:**
> UNTIL *morrow.*
> Morrow Coffee Co. · Raleigh, North Carolina
> A fictional brand concept by Kreated. Not a real café — yet.

**Oversized editorial statements (5 — three are used on the homepage):**
1. THE DAY CAN WAIT *an* HOUR. *(Section 02)*
2. OUT BY *six.* GONE BY *ten.* *(Section 05)*
3. MOST OF THIS IS WORTH *sitting* FOR. *(Section 07)*
4. UNTIL *morrow.* *(Footer)*
5. EARLY, *by choice.* *(Reserve — for the About page or signage)*

---

## 6. MENU

Priced for a premium downtown Raleigh shop, 2026.

**ESPRESSO**
| Espresso | Double, always. | 3.75 |
| Macchiato | Espresso, a spoon of foam. | 4.25 |
| Cortado | Equal parts. The house drink. | 4.75 |
| Flat White | Two shots, velvet milk. | 5.25 |
| Cappuccino | The dry kind. | 5.00 |
| Latte | Ask for it small. | 5.50 |

**FILTER**
| Batch Brew | Whatever's on the counter. Refills are a dollar. | 3.50 |
| Pour-over | Single origin, 4 minutes. Rotates. | 6.00 |

**COLD**
| Cold Brew | 18-hour, on tap. | 5.00 |
| Flash-Chilled | Brewed hot, chilled over ice. Brighter than cold brew. | 5.50 |
| Iced Cortado | Yes, it works. | 5.25 |
| Espresso Tonic | Double shot, tonic, orange peel. | 6.25 |

**THIS SEASON (Sept–Nov)**
| Sorghum Cold Brew | Cold brew, NC sorghum syrup, a little cream. Not sweet, exactly. | 6.00 |
| Brown Butter Latte | Browned butter syrup made here. Tastes like the edge of a cookie. | 6.50 |
| Fig Leaf Cortado | Fig-leaf-infused milk. Green, faintly coconut. | 5.75 |
| Black Cardamom Chai | House-spiced, no syrup, oat by default. | 5.75 |

**NOT COFFEE**
| Matcha | Ceremonial grade, whisked to order. | 5.75 |
| Hot Chocolate | 70%, made with milk, not water. | 5.00 |
| Tea | Black, green, or herbal. Pot for one. | 4.50 |
| Orange Juice | Pressed in the morning. | 5.00 |

**BAKERY — out by 6:30, gone when it's gone**
| Croissant | | 4.50 |
| Morning Bun | Orange zest, cardamom sugar. | 5.00 |
| Sesame Kouign-Amann | | 5.50 |
| Olive Oil Cake | With whatever fruit is right this week. | 5.00 |
| Ham & Gruyère Croissant | | 7.50 |
| Seeded Sourdough Toast | Thick-cut, cultured butter, flaky salt. | 7.00 |
| Sourdough Loaf | Whole. Saturdays only. | 12.00 |

---

## 7. PHOTOGRAPHY DIRECTION

**Lighting:** Natural, directional, early. Every frame should look like it was shot between 7 and 9am with sun coming through a large east window. Hard light is fine — long shadows with soft edges are the signature. No overhead diffusion, no ring lights, no flat "Instagram bright." Shadow occupies 40–60% of every frame.

**Lens / framing:** 50mm and 85mm only. Apertures f/2–f/4 for product, f/5.6–f/8 for interiors. Camera at the subject's height (counter height, table height, eye height) — never top-down flat-lays, never dramatic low angles.

**Compositions:** Subjects off-center, sitting on the thirds or deliberately at the edge. Lots of negative space on the shadow side. Diagonals from counter edges, window mullions, and shadow lines. One subject per frame. Crops that cut objects at the frame edge are encouraged.

**Café interiors:** Wide, quiet, empty or nearly empty. Sunlight paths visible across the floor and up the wall. Materials in focus: white oak, lime plaster, brushed steel, terrazzo, clay tile. Show the long table, the window seat, the bar from the customer side.

**Drinks:** In clay or stoneware cups — ivory, olive-grey, terracotta. Never glass mugs, never paper cups with logos (one exception: a plain ivory takeaway cup with the logomark, shown once). Foam and crema are the caramel in the palette. Cortado is the hero drink. No latte art hearts — a plain rosetta or nothing.

**Pastries:** Laminated pastry in raking light so the layers read. On paper, on a wooden board, or directly on the steel counter. Torn open once. Crumbs allowed. Powdered sugar never.

**People / hands:** Hands only, or people from behind / in profile / out of focus. Forearms, a hand holding a cup, someone reading. Skin tones diverse and rendered warmly. No one looks at the camera. No laughing groups.

**Materials:** Close crops on oak grain, plaster texture, brushed steel edges, burlap, paper bags, linen. These are used as interstitial images and section backgrounds.

**Shadows:** Treated as subjects. Shadow of a cup, of a window mullion, of a plant on plaster, of a chair leg on terrazzo.

**Color grade:** Warm highlights, neutral-to-cool shadows (a touch of olive in the shadows, not blue). Blacks lifted slightly to `#231B16`, never true black. Whites held at ivory, never clipped. Saturation –10%. Contrast medium. Fine grain. A consistent LUT should be built and applied to every image.

**What NOT to photograph:** Latte art hearts. Coffee beans in a pile. Chalkboard menus. Fairy lights. Reclaimed wood walls. Exposed Edison bulbs. Baristas in aprons smiling at camera. Top-down flat-lays. Neon signs. Marble with gold. Plants as the subject. Anything with "but first, coffee" energy.

**The 10 images the homepage needs:**
1. **Hero** — Counter edge diagonal, cortado in clay cup at the point of light, portafilter out of focus top-right. 16:9.
2. **Statement** — Morning light and a mullion shadow on a lime plaster wall. Nothing else. 2:5 portrait.
3. **Seasonal 01** — Sorghum cold brew in a stoneware tumbler on the steel counter, condensation, hard side light. 3:4.
4. **Seasonal 02** — Brown butter latte in an olive cup, held by a hand in a wool sleeve. 3:4.
5. **Seasonal 03** — Fig leaf cortado beside an actual fig leaf on paper. 3:4.
6. **Seasonal 04** — Black cardamom chai, steam visible against a dark window. 3:4.
7. **Bakery A** — Torn croissant on parchment on oak, raking light through the layers. 4:5.
8. **Bakery B** — Hands scoring a sourdough loaf, flour on forearms, 4am tungsten light (the one warm-artificial exception). 1:1.
9. **Sourcing** — Green coffee in a burlap-lined crate with a paper tag, or the drum of a roaster. 21:9.
10. **Room / Exterior** — Five interior frames (long table from the end, window seat with a sun patch, the bar from a customer's seat, oak stair detail, terrazzo floor with a chair shadow) and one exterior: the door and signage mark at 6:45am with a street tree shadow. 3:2 and mixed.

---

## 8. MOTION SYSTEM

Principle: motion is physical and weighted. Things reveal, slide, and settle. Nothing floats, bounces, pulses, or glows. One easing curve for the whole site: `cubic-bezier(0.76, 0, 0.24, 1)`. Durations 250ms (micro) / 700ms (reveals) / 900ms (masks). Everything respects `prefers-reduced-motion`.

| Effect | Where | Spec |
|---|---|---|
| **Typography reveals** | All oversized statements, hero, footer | Clip-path rise per line, 80–90ms stagger, triggered at 20% viewport entry. Once only. |
| **Image masks** | Bakery, Seasonal, Room | Horizontal wipe left→right, 900ms. Hero uses the vertical "horizon" mask (unique). |
| **Parallax** | Statement photo, Bakery photos | Subtle only: 0.9x–1.05x scroll rate. Never on text. Never on mobile. |
| **Hero pin & cover** | Hero → Statement | Hero pinned; next section slides over. Image scales to 1.08; headline drifts up at 0.3x and fades. |
| **Navigation** | Global | Transparent → Ivory with hairline after 80px. Hides on scroll-down after 400px, returns on scroll-up. Link hover: 1px underline draws in from left, 250ms. |
| **Menu row hover** | The Bar | Row shifts 6px right; price turns Clay; cursor-following 240px image fades in with 60% lag. Desktop only. |
| **Seasonal strip** | This Season | Drag-scroll with inertia; images scale 1.04 on hover; mono counter updates. |
| **Gallery** | The Room | Fade + 24px rise on entry. Lightbox: full-bleed, keyboard nav, no thumbnails. Image crossfade 400ms. |
| **Cursor** | Desktop only | Default cursor everywhere except: over gallery images it becomes a small mono "VIEW" label; over the seasonal strip it becomes "DRAG". No custom cursor elsewhere. |
| **Page transitions** | Between routes | 400ms Espresso curtain wipe upward, new page reveals beneath. Skipped for hash links. |
| **Hours** | Visit | Current day highlights in Clay on load. No animation. |
| **Smooth scroll** | Global | Lenis or equivalent, lerp 0.1. Disabled on touch. |

**Explicitly excluded:** WebGL, image distortion shaders, marquee/ticker text, floating elements, scroll-jacking beyond the hero pin, loading screens longer than the hero entrance, hover glow, animated gradients, number counters.

---

## 9. MOBILE EXPERIENCE

Mobile is not the desktop stacked. It is the same brand at a different distance — closer, more vertical, more photographic.

**Global changes:**
- Type stays oversized. Statements at `12–13vw` so a phone still gets the editorial shock. Line-height tightens to `0.88`.
- All parallax, cursor effects, and drag physics removed. Reveals and masks stay (they're cheap).
- Horizontal margins `20px`. Section padding `80px` vertical.
- Hairlines and mono labels carry more of the structure since there's less whitespace.
- Nav: wordmark + "Menu" → full-screen Espresso overlay, three serif links at `12vw`, hours in mono at the bottom.

**Sections that materially change composition:**
- **Hero:** Crop shifts to 4:5 portrait, re-centered on the cortado. Headline moves to the top third (so it reads before the user scrolls), supporting copy + CTA to the bottom. The type no longer frames the cup — it brackets it top and bottom.
- **The Bar:** Sticky intro becomes a static heading. Menu rows remain rows — this is the one place stacking is correct.
- **This Season:** Native horizontal swipe with 85vw cards and peek. This section is arguably better on mobile.
- **Bakery:** The overlapping-headline device is dropped (it doesn't survive at phone widths). Photos stack with a 20px inset offset; headline sits between them.
- **The Room:** Alternating-alignment single column instead of a grid, preserving rhythm without shrinking images to thumbnails.
- **Visit:** Photo first, then address, then hours, then a full-width bordered CTA — the only button-shaped element on mobile.
- **Footer:** Statement stays cropped at the viewport bottom. Columns become 2×2.

**Performance targets:** LCP under 2.0s on 4G (hero image AVIF, ~180KB, preloaded). Fonts subset and preloaded. No JS required for first paint.

---

## 10. KREATED CASE STUDY

**Project title:** Morrow Coffee Co.

**Project descriptor:** Brand identity & website concept — Hospitality / Raleigh, NC · 2026

**Introduction:**
> Morrow is a fictional neighborhood coffee bar we designed to show what a hospitality brand looks like when it's art-directed rather than templated. No client, no brief but our own — just an argument that a café in Raleigh could look like this. Every part of it, from the logomark to the seasonal menu, was built as if it were going to open next spring.

**Services:** Brand strategy · Naming & voice · Visual identity · Art direction · Photography direction · Web design · Motion design · Front-end development

**Brand identity presentation:**
- Opening spread: the logomark alone, Espresso on Ivory, full-bleed.
- The horizon concept explained in one diagram: sun / cup, one line.
- Wordmark lockups on Ivory and Espresso.
- Palette as a vertical stack of five bars with hex values in mono.
- Type specimen: the three families, showing the uppercase/italic headline rule.
- Applications: takeaway cup, a paper bag, a menu board, an A-frame sign, a window vinyl at 6:45am.

**Website presentation:**
- Full-page scroll capture of the homepage, tall, on Bone background.
- Three "moments" isolated at large scale: the hero entrance, the bakery overlapping headline, the footer statement.
- A short looping video of the hero mask reveal and the hero → statement transition.
- The Bar hover interaction as a 6-second loop.

**Mobile presentation:** Three phone frames side by side — hero, seasonal swipe, footer — on Espresso. No device bezels, just rounded-corner screens floating on the dark field with long soft shadows (the one place shadows are allowed, because it's a mockup, not the site).

**Mockups:** Signage mark on a brick façade; cup in hand in morning light; the menu board on plaster; a business card set in the mono. All rendered with the Morrow photography grade so the case study and the brand share one look.

**Closing section:**
> Morrow doesn't exist. That's the point. If we can make a café you'd walk into from a brand that isn't real, imagine what we can do with one that is.
>
> `START A PROJECT →`
>
> *Morrow Coffee Co. is a self-initiated concept by Kreated. It is not a client engagement and no such business operates in Raleigh.*

---

## FINAL CREATIVE DIRECTION

**Build this, exactly:**

Morrow Coffee Co. is a Raleigh coffee bar and bakery whose entire brand is the first hour of the day. The site is one continuous morning, told in eight sections plus a footer: **Hero (First Light) → The Statement → The Bar → This Season → Bakery (Out by Six) → Where It's From → The Room → Visit → Footer (Until Morrow).**

**Identity:** Ivory `#F2ECE1` / Bone `#E7DFCF` / Espresso `#231B16` backgrounds. Espresso and Roast `#5C4F45` text on light; Ivory and Ash `#B8AFA1` on dark. Olive `#6E7358` for the seasonal section only. Clay `#B3623F` is the single accent, once per viewport. Steel `#A6A8A3` for hairlines on dark. No caramel in the UI. Radius 0 everywhere. No cards, no shadows, no gradients, no icons beyond `→`.

**Type:** Instrument Serif (upgrade path: PP Editorial New) for all headlines — uppercase, tracking `-0.02em`, line-height `0.9`, one lowercase italic word per headline. Inter Tight (upgrade: Söhne) for body at 17px. JetBrains Mono for every label, price, hour, and index. Three sizes per viewport, maximum.

**Hero:** Full-bleed 7am photograph of a cortado at the point of window light on a diagonal oak-and-stone counter. Headline bottom-left: COFFEE FOR / *slower* / MORNINGS. Supporting copy and `SEE THE MENU →` bottom-right. Mono coordinates top-right. Entrance: horizon mask opens the image, headline rises, copy fades, nav last — 1.8s. On scroll the hero pins, scales to 1.08, and the Espresso statement section slides over it.

**Signature moves:** The horizon-mask hero reveal. The oversized statement with one italic word (THE DAY CAN WAIT *an* HOUR / OUT BY *six.* GONE BY *ten.* / MOST OF THIS IS WORTH *sitting* FOR / UNTIL *morrow.*). The headline overlapping photography in the bakery section. The typographic menu with cursor-following images. The footer statement cropped by the viewport edge.

**Motion:** One easing (`cubic-bezier(0.76, 0, 0.24, 1)`), three durations (250 / 700 / 900ms), clip-path reveals, horizontal image masks, subtle parallax on two sections only, smooth scroll on desktop. Nothing floats, pulses, or glows. Full `prefers-reduced-motion` support.

**Photography:** Early directional sunlight, 50–85mm at subject height, shadow as 40–60% of every frame, clay and stoneware cups, laminated pastry in raking light, hands not faces, materials as texture. Warm highlights, olive-tinted shadows, lifted blacks, –10% saturation, fine grain. Ten specified images.

**Mobile:** Same brand at closer range — oversized type kept, hero recropped to 4:5 with type bracketing the cup, seasonal strip as native swipe, bakery overlap dropped, gallery as alternating-alignment column, parallax and cursor effects removed.

**Positioning in the Kreated portfolio:** Presented as a self-initiated concept, stated plainly in the footer and the case study close. The tagline that carries it: *"Morrow doesn't exist. That's the point."*

Hand this document to Claude Code as-is. Every decision above is final unless production photography forces a crop change.
