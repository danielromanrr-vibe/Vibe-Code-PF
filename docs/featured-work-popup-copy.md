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

1. **My contribution** — Collaborated with art director and cross-functional team:

   • Extend brand guidelines while pushing the creative envelope  
   • Apply simple, recognizable UX patterns for clarity and speed  
   • Maintain and optimize core UI components (e.g., speech bubbles)

2. **My contribution** —

   • Expanded lifestyle imagery use across traffic ad placements  
   • Built AI-assisted workflows with Firefly and internal tools  
   • Enabled scalable visual variation while preserving quality

3. **My contribution** —  

   • Defined agile roadmaps aligning stakeholders on high-visibility campaigns while scaling emerging production workflows.  
   • Advocated for stronger visual direction through clear design rationale and cross-team dialogue.

---

## Covantis

**Scope** (bulleted paragraphs)

1. I aligned stakeholders on a creative direction that reinforced the company’s tech-forward value proposition by extending the existing brand system for the website redesign.

2. Following this, I collaborated with peers to evolve their Figma design system to respond to the first part of my work.

3. Developed interaction techniques that strengthen user experience.

**Impact**

1. 75% improvement in core UX metrics (e.g. usability, task completion, satisfaction).

2. SEO + UX saw organic traffic rise ~85% in 3 months after adopting improved usability and page experience.

3. By integrating visual storytelling and brand cohesion into the product experience, I helped reinforce trust in the platform and supported faster adoption across some of the world’s largest agricultural companies, improving demo-to-adoption conversion rates by ~20% through clearer navigation and storytelling in the platform’s web presence.

**Skills**

Figma, Design system maintenance and evolution, rapid on-boarding, stakeholder management, user experience, clearly articulating objective design choices to stakeholders to positively impact project outcomes.

**Media block (note + caption)**

1. **Product suite & platform** — Website redesign, design system evolution, and key product interfaces.

---

## Ajediam

**Scope** (bulleted paragraphs)

1. Directed company-wide rebranding, defining visual language, typography, and brand strategy.

2. Designed and implemented a scalable design system, enabling consistent experiences across product interfaces, marketing artifacts, and the rebranded website.

**Impact**

✨ Led a comprehensive brand and product experience redesign that increased daily active users from 150 to 400+ by 2024 and improved average user retention by +24.62%.

**Media blocks (note + caption)**

1. **The Koh-i-Noor Diamond (detail)** — Merges former storefront + diamond blocks. Body combines both hero captions (diamond first, then storefront).

2. **Get in touch with our experts** — Hero: website and responsive views — Antwerp experts, CTAs, world map.

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
