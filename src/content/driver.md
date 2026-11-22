<!-- =========================================================== -->
<!-- MAP-AID / DRIVER — read by driver.ts                        -->
<!-- ## order IS the page scroll. Top of this file = top of the  -->
<!-- page. Adding or deleting a "##" shifts the slots in         -->
<!-- driver.ts, so update the index there in the same edit.      -->
<!--                                                             -->
<!-- TYPE (comments name the slot; they do not print):           -->
<!--   EYEBROW  11px slab, uppercase. Card labels only.          -->
<!--   H1 / H2 / H3  headings.                                   -->
<!--   LEDE / BODY / QUOTE  regular reading text.                -->
<!--   A ### is NOT always an eyebrow — see each section.        -->
<!--                                                             -->
<!-- HEADINGS: consecutive lines after # / ## / ### (no blank)   -->
<!-- are a two-line title. A blank line ends the heading.        -->
<!--                                                             -->
<!-- SAFE:   reword any heading or paragraph.                    -->
<!-- BREAKS: add/remove a "##", or a required "###" shape.       -->
<!--                                                             -->
<!-- SCROLL:                                                     -->
<!--   # H1 · ### before the first ## = H3. Later paras = body. **words** are bold. -->
<!--   §0 fact cards — ### = EYEBROW                             -->
<!--   §1 story cards — ## = H3, ### = EYEBROW                   -->
<!--   After Outcome: Hoyt tool tour (copy in driver.ts)         -->
<!--   §2 insights — ### = H3, then BODY / QUOTE                 -->
<!--   §3 pipeline · §4 prototype · §5 process                   -->
<!--   §6 transformation · §7 closing                            -->
<!--                                                             -->
<!-- §4 Interactive Prototype contains:                          -->
<!--   first para = eyebrow above the H2                         -->
<!--   ### Components of the system = the h3                    -->
<!--   the next list-only ### are the three rows, rendered h4   -->
<!-- =========================================================== -->

<!-- HERO — no eyebrows. # = H1. ### before the first ## = H3. Paras = BODY. **words** are bold. -->
# Automating & Codifying
Volunteer Management

### Scaling operations through automated volunteer check-ins and streamlined emergency delivery coverage.

Backpack Brigade delivers weekend meals to 6,000+ food-insecure children. As the organization expands, the goal was to build scalable systems that reduce repetitive work, improve coordination, and support long-term growth.

<!-- §0 FACT CARDS — ## is hidden. Each ### is the EYEBROW. Paras = BODY. A list = bullets. -->
## Project Overview

<!-- EYEBROW -->
### Role

<!-- BODY -->
Lead Product & Systems Designer

<!-- EYEBROW -->
### Context

<!-- BODY -->
Weekly dispatch relied on 12 years of unwritten founder memory and manual spreadsheet tracking across 90+ volunteer drivers, creating operational bottlenecks that blocked multi-warehouse expansion.

<!-- EYEBROW -->
### Scope

<!-- BODY -->
End to end design:

- User research
- Systems architecture
- Rapid prototyping (ux/ui)
- On-site usability testing.

<!-- EYEBROW -->
### Impact

<!-- BODY -->
- Eliminated manual spreadsheet tracking to reduce weekly management workload by 80%
- Saving 15–20 hours per week
- Establishing a scalable SOP for multi-warehouse expansion.

<!-- §1 STORY CARDS — ## = H3. Each ### is the EYEBROW. A list = bullets. -->
<!-- H3 -->
## From problem to outcome

<!-- EYEBROW -->
### Solution

<!-- BODY -->
A dedicated workspace for the full weekly student meal delivery cycle.

Combining:

- Automated driver RSVPs
- Physical artifact generation
- A spatial interface for emergency route coverage.

<!-- EYEBROW -->
### Problem

<!-- BODY -->
To scale food distribution, dispatch had to transition from unwritten founder memory and chaotic spreadsheets to a structured, repeatable digital interface.

<!-- EYEBROW -->
### Decision

<!-- BODY -->
An 80/20 spatial algorithm suggests optimal driver matches, leaving final dispatch authority with the coordinator.

<!-- EYEBROW -->
### Outcome

<!-- BODY -->
Designed an end-to-end web interface to:

- Manage volunteers
- Automate RSVP messages
- Generate dispatch documents
- Visualize routes on an interactive map
- Solidified SOP for scalability.

<!-- Hoyt tool tour sits under these cards. Copy + stamps: driver.ts hoytToolTour. No ##. -->

<!-- §2 INSIGHTS — ## = H2. Next para = lede. ### = H3. Then: BODY / QUOTE. -->
<!-- Attribution “- volunteer coordinator Sam Hoyt” is added after each quote on the page. -->
<!-- H2 -->
## Key tensions surfaced early

<!-- LEDE -->
There where a few things that had to change. Research revealed that as users, the drivers where very happy, so nothing on their end. Operationally, there where lots of challenges to be overcome to have a formula for scalability in the driver coordination program.

<!-- H3 -->
### Relying on memory

<!-- BODY -->
Converted unrecorded driver availability, preferences, strengths, and limitations into a structured contact management system.

<!-- QUOTE (body) -->
The only hard part is knowing who's nearby and whether they can take the route. That's what this solves.

<!-- H3 -->
### Repetitive tasks

<!-- BODY -->
Coordinators spent valuable time collecting driver responses and manually creating logistics artifacts. We automated the process while keeping them in the loop.

<!-- QUOTE (body) -->
At first, I'd want to double-check everything—not because it's wrong, but because it's new.

<!-- H3 -->
### Edge-case crisis

<!-- BODY -->
When bottlenecks arose, coordinators lacked tools to make informed decisions, relying instead on founder knowledge and personal workarounds.

<!-- QUOTE (body) -->
The decision is still mine. The system shows me options, but I make the call.

<!-- §3 PIPELINE — ## = H2. First para = EYEBROW above the H2. Later paras = BODY. The list is the email confirm. -->
<!-- Station ### stays off the page. Paras under each station are the caption. Handoff stays unused. -->
<!-- H2 -->
## From an email to the loading dock

<!-- EYEBROW -->
Automating the weekly operations cycle

<!-- LIST — first line is the bullet. The next lines are the numbered confirms. -->
- Each week, a driver volunteer replies to one email to confirm:
- Load: their vehicle’s capacity - how many bags they can carry.
- RSVP: Showing up on Thursday and or Friday to load their car with bags with food for the children to take home on the weekend.
- The program coordinators log the answers and produce artefacts to guide the loader volunteers. In this way, the warehouse operation seamlessly “serves” the driver volunteers as they show up at the warehouse.

<!-- hidden key -->
### Station 1

<!-- CAPTION -->
Rsvps are collected through the week and logged into spreadsheet

(Now automated)

<!-- hidden key -->
### Station 2

<!-- CAPTION -->
Spreadsheet becomes a manually produced artefact.

(Now automated)

<!-- hidden key, not shown -->
### Handoff

Wednesday 12:00 PM Risk Horizon

<!-- §4 INTERACTIVE PROTOTYPE — ## = H2. Components of the system is the h3. -->
<!-- The three list ### are the rows, rendered as bold-body h4s. -->
<!-- H2 -->
## Interactive Prototype

<!-- EYEBROW above the H2 -->
4th iteration & final deliverable

<!-- H3 -->
### Components of the system

<!-- H4. Lists = the body under the row. -->
### Automation

- Automated RSVP tracking with custom email overrides to preserve the human touch when needed.
- One-click artifact generation once RSVPs are complete, eliminating manual prep.

### Onboarding & Contact Management

- Onboards new volunteers and coordinators using research-backed parameters—flexibility, load, and availability—codifying 12 years of success for scalable growth.

### Map Overlay Features

- **Progressive disclosure:** Information adapts to the map's zoom level.
- **Proximity tiers:** Surfaces the best-matched contacts for emergency coverage.
- **Additional route messaging:** Generates personalized follow-ups for volunteers covering extra routes.

<!-- §6 PROCESS — ## = H2. No body under the heading. Glance-card copy lives in code. -->
<!-- H2 -->
## Process overview

<!-- §7 TRANSFORMATION — ## = H2. Each ### is a row label (not an eyebrow). Lists = BODY. -->
<!-- H2 -->
## System transformation

A twelve-year operational process, held in one person's memory, rendered as a shared spatial layer.

### Knowledge base

- Before: Trapped in Nichelle's head and in coordinators' spreadsheets — 12 years unwritten
- After: Tokenized profiles — availability, preferences, flexibility, and trunk capacity

### Weekly RSVP loop

- Before: Fragmented texts and calls to 90+ volunteers, Monday through Thursday
- After: One Monday RSVP pulse, with availability visible in a single pane

### Emergency trigger

- Before: Reactive rerouting when a driver canceled, often by Thursday morning
- After: Wednesday 12:00 PM risk horizon, with real-time risk status

### Emergency resolution

- Before: A paper map, a call to Nichelle, and a reroute decided in the moment
- After: Nearby options on an 80% map and a 20% data panel — the coordinator still makes the call

### Warehouse dock flow

- Before: Paper clipboards and verbal instructions at the loading bay
- After: A printed loading slip matched to trunk capacity

<!-- §8 CLOSING — ## = H2. Paras = BODY. No eyebrow. -->
<!-- H2 -->
## Closing reflection

Map-Aid does not auto-dispatch the week. An 80% map and a 20% data panel turn founder memory into proximity and status: who is available, which routes are at risk, and who is close enough to take a gap. The coordinator still makes the call, and still keeps the contact that the call depends on.
