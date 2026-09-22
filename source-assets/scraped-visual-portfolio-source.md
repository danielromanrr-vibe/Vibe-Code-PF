# Scraped visual portfolio source — danielromandesign.com

**Platform:** Adobe Portfolio (`cdn.myportfolio.com`), not Wix.
**Scraped:** 2026-09-14
**Ignored:** OnlyJewels (per PO)

## Discovery notes (Alexa / DBS)
- Work grid has **one** Amazon tile: “Production design for Amazon Devices” → `/copy-of-traffic-assets-for-amazoncom`
- Tried `/alexa`, `/dbs`, `/amazon`, `/amazon-devices`, `/production-design-for-amazon-devices` → all 404 (Wix/Adobe soft 404 returns Work page HTML)
- `/copy-of-basecamp` is the **About/home** page, not a project. Mentions: “Visual/production designer for Amazon DBS / Alexa teams.”
- **No separate Alexa project URL.** Treat Alexa as same engagement as DBS under Amazon Devices unless local assets split them.
- Keep Alexa and DBS as separate projects in the new portfolio only if local source assets warrant it; live site does not.

## CDN URL conventions
- Highest-res artwork: bare `{uuid}.png|.jpg|.gif` (no `_rw_` / `_car_`) when Content-Length is large
- Responsive: `{uuid}_rw_{600|1200|1920}.ext`
- Grid covers: `{uuid}_carw_4x3x{640..5120}.png` — prefer **5120** when present
- Kamau cover uses `_rwc_` crop params instead of `_car_`
- Many tiny ~1097B `.jpg` “ORIGINAL” URLs between modules are **layout spacers** (HTTP 200 but not artwork) — excluded from image lists below
- All checked artwork URLs returned HTTP 200

## /work grid order (document order)
| # | Title | Tags | Href | Grid cover (prefer 5120 / max) |
|---|-------|------|------|--------------------------------|
| 1 | Production design for Amazon Devices | Composition • firefly image optimization • web ads • traffic adds | https://danielromandesign.com/copy-of-traffic-assets-for-amazoncom | https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/7da0c311-603b-453d-87ab-149a6a31b48e_carw_4x3x5120.png?h=c91e47ff397ae6d575130614c24f51ca |
| 2 | Visual Identity & Website for Ajediam.com | Rebranding • design systems • ux/ui • design strategy | https://danielromandesign.com/visual-design-for-ajediam | https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/856cbc25-510f-4c9f-8458-1f9bd90f156b_carw_4x3x5120.png?h=bdcc3d1c8c9d75ca7b65d26b59c31117 |
| 3 | Website for Covantis.io | Web design • art direction • ux/ui | https://danielromandesign.com/copy-of-ajediam-uxui-design-system | https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/1cd959e4-436d-48ea-8709-890190c6c0fa_carw_4x3x5120.png?h=ad870f23d91696e2283e979259320d40 |
| 4 | Visual Identity for Spice Angel | Rebranding • editorial design • packaging design | https://danielromandesign.com/spice-angel | https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/40f3bfd9-b31a-4c9d-ba27-2b3bf695fddb_carw_4x3x5120.png?h=a3cb8d342db02926d4761e919ca20d83 |
| 5 | Visual Identity for Kamau & The Wolf | Logomark • wordmark • branding | https://danielromandesign.com/kamau-and-the-wolf | https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/baacc9c0-476a-47ef-8c2d-e293ae7c1cbe_rwc_122x0x1680x1260x1920.png?h=8764d558634603732529428005fa4647 |
| 6 | Editorial and Illustration for OnlyJewels **IGNORE** | Editorial • illustration • Infographic | https://danielromandesign.com/onlyjewels | https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/72b7dd50-49bd-4a79-8c7a-64b5993b2628_carw_4x3x5120.jpg?h=de84bdbfd5b580fed6e0921ef9ef7694 |

Work page intro: “Before moving pixels around, I ask the right questions, letting insights shape design.”

---
## Project: amazon-devices
- **Canonical URL:** https://danielromandesign.com/copy-of-traffic-assets-for-amazoncom
- **Page title / H1:** Production design for Amazon Devices
- **Client one-liner:** Amazon - Contract through BeyondSoft agency
- **My role:** Production designer
- **Impact highlights:**
  - Created digital assets for Prime Day 2024 and Big Deal Days, ensuring consistent design across placements and integrations that supported record-breaking results ($12.9B sales, 375M+ items sold)
  - Improved visuals with lifestyle imagery AI Firefly optimisation and scalable systems thinking, contributing to conversion lifts of up to 20% during events with 3–5× traffic spikes
  - Tested and provided support for the implementation of a new production workflow transition from Photoshop to Figma. This new workflow is at least 50% faster
- **Scope:**
  - Delivered high-volume, pixel-perfect assets on tight timelines, partnered seamlessly with PMs, art directors, and engineers, upheld a rigorous QA bar
- **Skills:** Figma, Creative cloud, Adobe Firefly, Design system / workflow development, stakeholder management
- **Grid title:** Production design for Amazon Devices
- **Grid tags:** Composition, firefly image optimization, web ads, traffic adds
- **Grid cover URL:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/7da0c311-603b-453d-87ab-149a6a31b48e_carw_4x3x5120.png?h=c91e47ff397ae6d575130614c24f51ca
- **og:image:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/bd4efdcd-216e-4094-9d8c-dc3f1bff37d4_car_4x3.png?h=1921463555c10979607796081c9f1263
- **Notes:** Covers DBS work under Amazon Devices umbrella. No separate Alexa project URL exists on site. About page mentions “Amazon DBS / Alexa teams” as experience line only.

### Sections (post meta)
#### Creatives done as part of Amazon's AI foundation project
These creatives feature new, custom made device UI's and the use of Adobe Firefly to optimise lifestyle imagery for different web ad formats

#### Detail page production
This special edition tablet detail page required custom render compositions and detail page construction against tight deadlines

#### Print material made for offsite event navigation
Although rare, this request entailed a custom design for a banner used to guide employees in an on-site event.

#### Creatives using custom backgrounds
a rough version for this background was handed over for production. Had to be edited manually to optimize accessibiilty and the concept

#### Production of creatives for Prime Big Deal Days and Game events
Notoriosuly tight deadlines. In this case, the last 3 examples feature bespoke render compositions that where done compositing render files. in the first example, the only design input was the copy.

#### Customized templates for ads with messaging over-arching multiple ideas
Some of the assets done needed new UI, now in use.

### Images (document order, spacers excluded)
**Section: [hero / intro]**
1. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/d8c4f50c-ad10-4c58-93a1-9d9294892e49.jpg?h=fa30f8ee8a5edc055d90d026dc352fdf
2. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/8cbcfc98-54a9-4912-9487-7a37a9479fcd.png?h=36ec10015d80d5044a2a152e5703da14

**Section: Creatives done as part of Amazon's AI foundation project**
3. [ORIGINAL] **label:** Creatives done as part of Amazon's AI foundation project
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/43826f52-45c1-4c57-910a-92c27a21f1f7.png?h=a1d8b25949ea8b06fe7fd541833452eb

**Section: Detail page production**
4. [ORIGINAL] **label:** Detail page production
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/925c93a7-86b5-42b7-b404-377c913a673e.png?h=e5316673bc5e3eec991d6ff1d30e867a

**Section: Print material made for offsite event navigation**
5. [ORIGINAL] **label:** Print material made for offsite event navigation
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/6309f3c8-b206-4b41-bfb9-cc179341bb0d.png?h=42228a318bd0905d558d7281bc888e45

**Section: Creatives using custom backgrounds**
6. [ORIGINAL] **label:** Creatives using custom backgrounds
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/298cc104-1fa2-4705-9646-a44e29b916af.png?h=fbd6b9db9342212623f19e1de3e9c2c8

**Section: Production of creatives for Prime Big Deal Days and Game events**
7. [ORIGINAL] **label:** Production of creatives for Prime Big Deal Days and Game events
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/01d92a0f-c85e-4d34-9deb-56fd5e9b9ce9.png?h=89ab29669c4e413c11e01129c9b72085

**Section: Customized templates for ads with messaging over-arching multiple ideas**
8. [ORIGINAL] **label:** Customized templates for ads with messaging over-arching multiple ideas
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/27afcacd-46f9-4f68-8930-5d3b1aeb4f4d.png?h=bf5bcc04e1c75f6fd590723252fd40aa


---
## Project: ajediam
- **Canonical URL:** https://danielromandesign.com/visual-design-for-ajediam
- **Page title / H1:** Visual Identity & Website for Ajediam.com
- **Client one-liner:** Ajediam.com - Boutique jewelry & diamond retailer
- **My role:** Visual ux / brand designer
- **Impact highlights:**
  - Increased user engagement through a refreshed user experience, which boosted daily users from 150 to 400+ by 2024 and +24.62% average user retention.
- **Scope:**
  - 1) company rebranding
  - 2) design system creation, design of branded artefacts —implementing in cohesive user experiences across tools and layouts of the rebranded website
- **Skills:** Figma, Creative Cloud, typography and layout, atomic design, story-telling, brand strategy, product design thinking, responsive design
- **Grid title:** Visual Identity & Website for Ajediam.com
- **Grid tags:** Rebranding, design systems, ux/ui, design strategy
- **Grid cover URL:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/856cbc25-510f-4c9f-8458-1f9bd90f156b_carw_4x3x5120.png?h=bdcc3d1c8c9d75ca7b65d26b59c31117
- **og:image:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/e2ea929e-9ab0-4692-933a-e679698198f7_car_4x3.png?h=ca035be83cc5ac2b23b9f336e7189cd4
- **Notes:** PO note: maps to branding elsewhere in new portfolio — still capture copy. Short-form content section references MP4 sample (image/gif embeds on page; no separate video URL found in static HTML).

### Sections (post meta)
#### Ideation and Inspiration / Symbols of flemish excellence
Ajediam's re-branding was started by identifying core values—legacy, trust, and establishment—and connecting them to the city's diamond trading heritage through typography and visual cues, bringing the rebrand's spirit to life.

#### Color palette
A benchmark study showed that these colors would both differentiate us in the Antwerp diamond industry and reinforce the brand's established identity.

#### Primary colors

#### Secondary colors

#### Setting creative direction: Photography
We established a distinct product photography and image style to be used throughout our multiple touch-points

#### Setting creative direction: Branded short form content
I directed these pieces from storyboard to final MP4, prototyping a visual style that resonated with the brand I was building — a framework vendors could easily replicate and I could oversee to produce short-form content that drives website traffic. below is a sample

#### Typography: font pairing
Typefaces with belgian roots form a flexible design system to produce editorial quality, diamond educational material and other articles.

#### Typography: Wordmark
Guyot typography, a modern reinterpretation of Plantin with a ligature to enhance rhythm and render an identifiable word-mark

#### Design system: UI components
These are examples of user interfaces and visual treatments, where we can appreciate the rebranding applied to the UI

#### Design system: atomic design elements
The small pieces that conform the system used to build new pages and revamp older ones in Ajediam's refreshed website.

### Images (document order, spacers excluded)
**Section: [hero / intro]**
1. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/1e9626fb-dbc1-4b49-b11a-3dad397ad131.png?h=52b1c173381e3a4f67062cf665340e09
2. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/838e6433-1337-40f5-809f-8f0e3b794237.png?h=92220b058d9156a200cd39adb6386b95
3. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/fc442dbe-156f-4457-9ada-95cbf8ad3140.png?h=5d7a17d57752a7b92efc2f5628e14a38
4. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/d88ebb57-4861-497a-b95b-916a3a476a60.png?h=5ea11980b1e721bcf124fcbbac267816

**Section: Symbols of flemish excellence**
5. [ORIGINAL] **label:** Symbols of flemish excellence
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/6a23a374-70bf-4e35-81dc-5a2b48dc0b47.png?h=408ec399e141196e3543fe855ebd250a

**Section: Color palette**
6. [ORIGINAL] **label:** Color palette
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/d02a089f-94bd-4813-8001-9a3411c7fad8.png?h=f2d581b10e62c06c808e5918453ce5dc

**Section: Primary colors**
7. [ORIGINAL] **label:** Primary colors
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/afd7eb40-4f31-4366-82f8-0e8da8667f7a.png?h=b31b8f0d38ca5fac71b824aa6a2603a0

**Section: Setting creative direction: Photography**
8. [ORIGINAL] **label:** Setting creative direction: Photography
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/b8c6fdda-8f89-4447-a017-14ffc37e2254.png?h=378f3ddd79db3959ca755fdd324ff930

**Section: Typography: font pairing**
9. [ORIGINAL] **label:** Typography: font pairing
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/ebe16783-c58b-441a-86c6-e9cec61e58a8.png?h=db3026e9fd702cd708b842abc1b4493e

**Section: Typography: Wordmark**
10. [ORIGINAL] **label:** Typography: Wordmark
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/2301c5a5-7c5c-4a92-bb31-527e8ff8bc2a.png?h=471a33fe3846b8a86a6fe9f289403aee

**Section: Design system: UI components**
11. [ORIGINAL] **label:** Design system: UI components
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/425b1296-6c79-4a0f-bbff-8d3f340e4a26.png?h=1d8bb7927c9fbd3ae5a8a168b28cec7a
12. [ORIGINAL] **label:** Design system: UI components
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/863b6052-6cdb-4628-a1df-e5e5d64bf72c.gif?h=6fc904c34c67618d2fb93c86f3e36b71
13. [ORIGINAL] **label:** Design system: UI components
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/1b6e9c57-4458-4bcb-ad0f-3ef381384029.png?h=c0b1d520be21b0e8ddd82f5583d55698
14. [ORIGINAL] **label:** Design system: UI components
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/08bb2a4c-e606-4a39-a7e3-2e2895079ffd.png?h=24d09d5f926485739843fd0eb5205ec9
15. [ORIGINAL] **label:** Design system: UI components
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/813ab05a-3675-47b1-b027-bdf6e00b61a3.gif?h=05c14348c4bf1d019c60ff9529d3ae35
16. [ORIGINAL] **label:** Design system: UI components
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/50d3d847-c680-46c9-b42d-4e35ba5aeeb8.png?h=1312e0e068136ab62d11d6379e050b30
17. [ORIGINAL] **label:** Design system: UI components
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/31cb9fd0-5014-4ab1-8001-d33492862534.gif?h=3af0fd87691e63018d6d6c585c345076

**Section: Design system: atomic design elements**
18. [ORIGINAL] **label:** Design system: atomic design elements
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/83ea2307-06e0-4f9b-b213-a5263a69d210.png?h=649da491c2677aad61c20f2555a401ee


---
## Project: covantis
- **Canonical URL:** https://danielromandesign.com/copy-of-ajediam-uxui-design-system
- **Page title / H1:** Website for Covantis.io
- **Client one-liner:** Covantis.io - modern technology geared to agri-commodity industry
- **My role:** UX/UI designer
- **Impact highlights:**
  - 75 % improvement in core UX metrics (e.g. usability, task completion, satisfaction)
  - SEO + UX saw organic traffic rise ~85 % in 3 months after adopting improved usability and page experience
  - Reduced onboarding time for new enterprise clients by 20–30% with clearer navigation and support flows.
  - Increased demo-to-adoption conversion by 15–25% through improved website messaging and UX clarity
- **Scope:**
  - 1) I aligned stakeholders on a creative direction that reinforced the company’s tech-forward value proposition by extending the existing brand system for the website redesign.
  - 2) Following this, I collaborated with peers to evolve their Figma design system to respond to the first part of my work.
  - 3) Developed interaction techniques that strengthen user experience
- **Skills:** Figma, Design system maintenance and evolution, rapid on-boarding, stakeholder management, user experience, clearly articulating objective design choices to stakeholders to positively impact project outcomes
- **Grid title:** Website for Covantis.io
- **Grid tags:** Web design, art direction, ux/ui
- **Grid cover URL:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/1cd959e4-436d-48ea-8709-890190c6c0fa_carw_4x3x5120.png?h=ad870f23d91696e2283e979259320d40
- **og:image:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/1cd959e4-436d-48ea-8709-890190c6c0fa_car_4x3.png?h=a7d4fd92ce88c7e0a1f9ee1d97dce124
- **Notes:** Slug is leftover “copy-of-ajediam-uxui-design-system” but page is Covantis.

### Sections (post meta)
#### Digital color palette
The palette increases legibility & flexibility for the design of UI components. Tints are meant for secondary or background elements

#### Primary digital palette

#### Secondary palette (tints)

#### Typography
The primary typeface is Poppins.

#### User interface and screens
Examples of visual interafaces and solutions for communicating the right information.

### Images (document order, spacers excluded)
**Section: [hero / intro]**
1. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/dbebae79-1502-4de5-898d-f9080ce1428d.png?h=b5440e9d1fbe543619c9a02ac3377be2
2. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/ed9f3587-6f44-4675-8f98-e671af3dd6d5.png?h=66c04c66733b9eeafff312a668841bab

**Section: Digital color palette**
3. [ORIGINAL] **label:** Digital color palette
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/2671ea26-cb74-4242-8e91-964d1c637292.png?h=519e3bccdf41770c317d67cc09988984

**Section: Primary digital palette**
4. [ORIGINAL] **label:** Primary digital palette
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/6cfd61ee-35a3-49f3-aae4-df7c16e3c78c.png?h=046e2365ab8a155eadcb852377a93384

**Section: Typography**
5. [ORIGINAL] **label:** Typography
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/597e54d7-8ba3-4648-a423-a22b56680fd5.png?h=7c081bf0393c64972aa722bff68885fd

**Section: User interface and screens**
6. [ORIGINAL] **label:** User interface and screens
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/233d4d56-ea9a-4fdb-a4b5-9af27fb7034c.png?h=44b9491daf9489885fd20d355c684c55
7. [ORIGINAL] **label:** User interface and screens
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/7022bb11-2af3-4f95-a172-39ee3c6bfb2b.gif?h=1a42f653b832588bd08dc1c044e1b6de
8. [ORIGINAL] **label:** User interface and screens
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/3bd01f58-ce75-42e1-a230-c5ff55c1d744.png?h=03b8181b6aef41224ef6019520993d41
9. [ORIGINAL] **label:** User interface and screens
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/42d43c87-3558-4e5e-8d4b-e78520b01c65.gif?h=b61e8d14e15a8b7d6bb0528de23da57e
10. [ORIGINAL] **label:** User interface and screens
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/528eed8d-238e-4304-afb8-3d80a779b537.gif?h=d6461276686ba791deb3708a18d3c259
11. [ORIGINAL] **label:** User interface and screens
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/7be9c8c5-1cad-4f37-ba68-83fa4360dd98.png?h=1d33fccb2d6613d2caa8c270261403a4


---
## Project: spice-angel
- **Canonical URL:** https://danielromandesign.com/spice-angel
- **Page title / H1:** Visual Identity for Spice Angel
- **Client one-liner:** Spice Angel - An asian food product company
- **My role:** Graphic brand designer
- **Impact highlights:**
  - Thanks to this project, Spice Angel was able to formalize their product and join popular distributors in Geneva, Switzerland
- **Scope:**
  - Research to inform design decisions surrounding the wordmark
  - thinking of a scalable system that involved the use of illustration and image treatments to construct a brand world that Spice Angel could draw from for products, content creation and design artefacts
  - Design execution of packaging and editorial material using the established brand world
- **Skills:** Photoshop, Indesign, Illustrator, Adobe Fresco for illustration
- **Grid title:** Visual Identity for Spice Angel
- **Grid tags:** Rebranding, editorial design, packaging design
- **Grid cover URL:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/40f3bfd9-b31a-4c9d-ba27-2b3bf695fddb_carw_4x3x5120.png?h=a3cb8d342db02926d4761e919ca20d83
- **og:image:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/40f3bfd9-b31a-4c9d-ba27-2b3bf695fddb_car_4x3.png?h=c2fb8fc811d18f82abb6fd7015aaee6c

### Sections (post meta)
#### Ideation and inspiration
Sourcing from multiple traditional and contemporary asian typographyic styles to source visual elements that reinforce & communicate Spice Angel's spirit

#### Color palette
Bright colors are used to make the packaging stand out in the market.

#### Primary colors

#### Brand elements: Treated images and custom made illustration
Illustrations are accompanied by grainy/de-saturated, prime ingredients images. These are used in packaging and print material to support the brand world.

#### Typography: font pairing
The script font is used to provide a craftsy, warm, french boulangerie feeling. The sans serif provides legibility and structure. Both aim to support and compliment the wordmark in print.

#### Typography: wordmark
Custom made, visual queues from contemporary Vietnamese typography & brush strokes of classical Korean calligraphy techniques

### Images (document order, spacers excluded)
**Section: [hero / intro]**
1. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/6c47bbfe-c4cc-4f1c-8b9b-7ba514a7e7de.png?h=244263a4db5a52bd8820c9736d50f1ff
2. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/bcb6af5f-597c-40fc-976c-30747e341197.png?h=f50f46dde711514170da3affd7a53448
3. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/452de78c-e743-439d-b99d-ddd52e8b2ad4.png?h=aad3dc9e549eaa6238b8daeb44dc8657

**Section: Ideation and inspiration**
4. [ORIGINAL] **label:** Ideation and inspiration
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/657e47cc-bd8e-432c-9a48-1898a2d9071f.png?h=a78d6ed4388a7c8cd106d4ddf30d31b3

**Section: Color palette**
5. [ORIGINAL] **label:** Color palette
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/e32bac34-481e-4ee1-aca3-43083c66c7e2.png?h=91092b05364bc075e0154b39dd38ea55

**Section: Brand elements: Treated images and custom made illustration**
6. [ORIGINAL] **label:** Brand elements: Treated images and custom made illustration
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/e0ca576b-7a8e-470f-8036-dacc4d442bdf.png?h=e8d7a6437be3d5e40e0306e5895a7cd2

**Section: Typography: font pairing**
7. [ORIGINAL] **label:** Typography: font pairing
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/31ba3930-aeb3-4088-adff-3322729315fc.png?h=222eb808ded097af4342f5cf5705b2dc

**Section: Typography: wordmark**
8. [ORIGINAL] **label:** Typography: wordmark
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/c8d16a35-6491-4c57-9997-a1310beb0a0f.png?h=eb46806e331bf9f7d84f47d9b5a28671


---
## Project: kamau-and-the-wolf
- **Canonical URL:** https://danielromandesign.com/kamau-and-the-wolf
- **Page title / H1:** Visual Identity for Kamau & The Wolf
- **Client one-liner:** Kamau&thewolf - up and coming hip hop duo from Geneva, Switzerland
- **My role:** Brand Identity designer
- **Impact highlights:**
  - The hip hop duo was invited to a radio talk show, where their brand was complimented. Meaning there was heavy impact in awareness and engagement with core audience
  - With this brand, Kamau&thewolf could expect an increase in follower growth after shows / merch drops and increase in revenue from their concerts and events.
- **Scope:**
  - Bringing together stakeholders to constantly check on the development of the wordmark, logomark and visualisation of how this brand would look
- **Skills:** Adobe illustrator, Photoshop and Indesign, manual sketching
- **Grid title:** Visual Identity for Kamau & The Wolf
- **Grid tags:** Logomark, wordmark, branding
- **Grid cover URL:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/baacc9c0-476a-47ef-8c2d-e293ae7c1cbe_rwc_122x0x1680x1260x1920.png?h=8764d558634603732529428005fa4647
- **og:image:** https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/baacc9c0-476a-47ef-8c2d-e293ae7c1cbe_rwc_122x0x1680x1260x1680.png?h=b6deb640cdd589ee08a7f30e708ed774
- **Notes:** /kamau 404s. Canonical slug is /kamau-and-the-wolf.

### Sections (post meta)
#### Ideation and inspiration
The concept blends Princess Mononoke with Ralph Lauren—drawing on Kamau and the wolf as symbolic anchors to create a visual world that feels whimsical yet grounded, echoing the tone of their music.

#### Color Palette
Earthy tones connect the duo to their African inspiration

#### Primary colors

#### Secondary colors

#### Typography: font pairing
Appropriate choices to address the contemporary and fantastical brand values.

#### Wordmark and logomark
In the wordmark, the use of the Adobe Caslon Pro ampersand speaks to the core values of the rap duo. The logomark is a result of the driving inspiration for the project. That is, a logo that would work well on clothes and lockups.

### Images (document order, spacers excluded)
**Section: [hero / intro]**
1. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/218a118a-a9da-49e0-a6ae-f747914683e4.png?h=dd7fefa77ae34e500b54359635761f33
2. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/d1c8b5d4-db65-4eac-86c3-6f16a22c51b1.png?h=0eb2536b27a04c385a707f50ea37a39f
3. [ORIGINAL] **label:** [hero / intro]
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/a5fa3b26-b7a8-4bac-8249-332205bafaed.png?h=97bc6424ed76c35b9da02b6a1a75a543

**Section: Ideation and inspiration**
4. [ORIGINAL] **label:** Ideation and inspiration
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/2737cccc-1c79-4761-b084-423ec80f8ebe.png?h=567d46683346222ab8e249bf27744eb1

**Section: Color Palette**
5. [ORIGINAL] **label:** Color Palette
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/c329df20-8932-49ac-a2ed-5421be5288c9.png?h=203fbe53ed91c45893fb85781abb6928

**Section: Primary colors**
6. [ORIGINAL] **label:** Primary colors
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/48e61083-0272-48fc-adf7-f108ccd28cf7.png?h=bb9e823880f0dc110fd8a92648588be8

**Section: Typography: font pairing**
7. [ORIGINAL] **label:** Typography: font pairing
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/6f85f0d3-370b-4203-a912-7e503bca39e3.png?h=f30dfa0c37cfac3f5f1612128c696b1f

**Section: Wordmark and logomark**
8. [ORIGINAL] **label:** Wordmark and logomark
   - https://cdn.myportfolio.com/2cb7a76a-d314-46a4-b37b-3e7271be1e4d/bc92b1ef-678e-4f3b-a14f-aefc73d9211f.png?h=bad5f672b8e13130fca8422dda2d93c5

