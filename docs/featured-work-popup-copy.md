# Featured work popup — front-facing copy

Snapshot of user-visible strings in the **Featured work** modal (`openFeaturedPopup` in `src/App.tsx`).  
Generated from the current codebase.

---

## Modal chrome

| Element | Copy |
|--------|------|
| Tab list (accessibility) | Featured projects |
| Close button (accessibility) | Close |
| Tab labels | Amazon · Covantis · Ajediam |

---

## Shared definition list labels

These labels appear above the corresponding body copy when a project has that field.

| Label |
|-------|
| My role |
| Scope |
| Tools |
| Impact |
| Skills |

---

## Amazon

**Scope**

Partnered cross-functionally with product managers, marketers, and engineers to align design direction with business goals, ensuring campaigns were scalable, impactful, and user-centered.

**Impact**
• Boosted production efficiency by 50% at DBS by supporting the testing and rollout of Figma adoption under tight deadlines.
• Delivered creatives across multiple digital formats by evolving templates and style guides for diverse product lines and high-visibility campaigns (Prime Day 2024, Big Deal Days).
• Tested, validated, and piloted new production workflows as part of the AI Foundation team.

**Media blocks (note + caption)**

1. **My contribution (Alexa+, 2025)** — Collaborated with art director and cross-functional team:

   • Extend brand guidelines while pushing the creative envelope  
   • Apply simple, recognizable UX patterns for clarity and speed  
   • Maintain and optimize core UI components (e.g., speech bubbles)

2. **My contribution (DBS, 2024)** —

   • Expanded lifestyle imagery use across traffic ad placements  
   • Built AI-assisted workflows with Firefly and internal tools  
   • Enabled scalable visual variation while preserving quality

3. **My contribution (DBS, 2024)** —  

   • Defined agile roadmaps aligning stakeholders on high-visibility campaigns while scaling emerging production workflows.  
   • Advocated for stronger visual direction through clear design rationale and cross-team dialogue.

---

## Covantis

**Scope** (single body, newline-separated bullets)

• Aligned stakeholders on a creative direction that reinforced the company’s tech-forward positioning  
• Extended the existing brand system to support the website redesign  
• Collaborated with peers to evolve the Figma design system and maintain consistency across the product

**Impact**

• Evolved the platform’s design system and website UX architecture.  
• Improved demo-to-adoption conversion ~20% through clearer product storytelling.  
• SEO + UX saw organic traffic rise ~85% in 3 months after adopting improved usability and page experience.

**Media block (note + caption)**

1. **My contribution** — Led the website redesign for look and feel and interaction techniques, and collaborated with copywriters to align design with SEO strategy.

---

## Ajediam

**Scope** (bulleted paragraphs)

- Established the core design foundations, including visual language, typography system, and brand framework—as part of the company-wide rebrand
- Built a scalable design system supporting consistent experiences across product interfaces, marketing surfaces, and the redesigned website
- Defined reusable UI patterns and interaction standards to support product scalability

**Impact**

Led a brand and product experience redesign that grew daily active users from 150 to 400+ by 2024 and improved average user retention by +24.62%

- Introduced a shared design system that unified product, marketing, and web experiences under a single visual framework
- Enabled faster design and development cycles through reusable design foundations and standardized UI patterns

**Media blocks (note + caption)**

1. **My contribution** — Wordmark and brand identity. Hero: `hero-2.png`.

2. **My contribution** — Established creative direction for product photoshoots and digital artifacts used across multiple user interfaces.

3. **My contribution** — Bullets on brand system and UX prototypes; third window gallery includes hero `hero-1.png`, `hero-3.png`, and video `comp-4.mp4`.

---

## Media UI (Zoom-in windows & static blocks)

| Context | Copy |
|---------|------|
| Missing hero / fallback in media window | Project visual placeholder |
| Expand gallery control (accessibility) | View more / View less |
| Grid placeholder tile | Work in progress |

---

## Notes

- `projectTitle` / `subtitle` props are passed to `ZoomInWindow` in code but are **not rendered** in the current `ZoomInWindow` component; only the **caption** block (note + label per media item) is visible under each window.
- Image `alt` attributes in this modal are empty (`""`) for gallery images; not listed as copy.
