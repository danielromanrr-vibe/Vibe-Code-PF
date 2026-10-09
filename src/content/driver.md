<!-- =========================================================== -->
<!-- MAP-AID / DRIVER — read by driver.ts                        -->
<!-- ## order IS the page scroll. Top of this file = top of the  -->
<!-- page. Do not add or delete a "##" or the slots shift.       -->
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
<!--   # H1 · first para = bold lede · later paras = body        -->
<!--   §0 fact cards — ### = EYEBROW                             -->
<!--   §1 story cards — ## = H3, ### = EYEBROW                   -->
<!--   After Outcome: Hoyt tool tour (copy in driver.ts)         -->
<!--   §2 insights — ### = H3, first para = EYEBROW              -->
<!--   §3 pipeline · §4 prototype · §5 process                   -->
<!--   §6 lifecycle — first ### line = EYEBROW, next line = H3   -->
<!--   §7 transformation · §8 closing                            -->
<!-- =========================================================== -->

<!-- HERO — no eyebrows. # = H1. First para = LEDE. Next = BODY. -->
# Scaling Volunteer Driver
Dispatch for Multi-Site Expansion

Backpack Brigade packages and delivers weekend meals to thousands of food-insecure children across King County. As the team expands to new warehouse sites, incoming coordinators run into a major hurdle: they don't have direct access to the founder’s 12 years of institutional memory covering 90+ volunteer drivers. Basic spreadsheet lists missed the nuanced human details that actually make dispatch work—like vehicle trunk size, true schedule flexibility, and predictability (knowing who will reliably step up when a last-minute emergency route opens).

To solve this while protecting human-in-the-loop trust, the platform translates years of driver history into structured spatial profiles. By pairing automated RSVP check-ins with visual map layers and smart outreach prompts, the system catches route gaps early and shows coordinators exactly who to call when things go sideways—freeing project managers from hours of repetitive admin tasks so they can focus on higher-impact work, cutting workload by around 80%, while ensuring weekend meals reach kids on time without the founder in the room.

<!-- §0 FACT CARDS — ## is hidden. Each ### is the EYEBROW. Paras = BODY. -->
## Project Overview

<!-- EYEBROW -->
### Role

<!-- BODY -->
Lead Product & Systems Designer — user research, systems architecture, vibe-code prototyping, on-site usability testing

<!-- EYEBROW -->
### Context

<!-- BODY -->
Weekly dispatch depended on 12 years of unwritten founder memory to manage 90+ volunteer drivers, blocking multi-warehouse expansion.

<!-- EYEBROW -->
### Scope

<!-- BODY -->
Interactive Map: Visual tool to find backup drivers near open routes.

Smart Contact System: Profiles tracking driver reliability, vehicle size, and schedule.

Automated Check-Ins: System that collects driver RSVPs automatically each week.

Printable Route Passes: Physical paperwork generated for drivers on the warehouse floor.

<!-- EYEBROW -->
### Impact

<!-- BODY -->
Automated routine check-ins without losing the personal touch that keeps drivers engaged.

Built a clear onboarding system to capture essential driver details right from the start.

Streamlined bottleneck management, making it fast and easy to fill sudden route gaps.

Eliminated tedious admin work by replacing manual spreadsheet tasks and paper tracking.

<!-- §1 STORY CARDS — ## = H3. Each ### is the EYEBROW. Paras = BODY. -->
<!-- H3 -->
## From problem to outcome

<!-- EYEBROW -->
### This

<!-- BODY -->
A digital workspace, that unifies the weekly dispatch lifecycle: automated RSVP collection, a map-based geographical layer to streamline emergency decision-making, and automated production of physical dispatch artifacts for volunteer drivers.

<!-- EYEBROW -->
### Problem

<!-- BODY -->
To scale, the informal, empirical dispatch process needed to move out of static spreadsheets and founder memory into a dedicated interface. Freeing coordinators from repetitive tasks and facilitating that anyone could run the workflow.

<!-- EYEBROW -->
### Decision

<!-- BODY -->
Upgrade the contact management system to track vehicle size, flexibility, and reliability on a live map. Instead of full automation, an 80/20 map interface suggests backup drivers while leaving the final choice with the coordinator.

<!-- EYEBROW -->
### Outcome

<!-- BODY -->
Automated check-ins and instant print passes cut 80% of manual work—eliminating tedious spreadsheet entry and paper prep. When a driver cancels, nearby backups surface on the map so coordinators can fix bottlenecks in seconds, embedding tribal knowledge into a system built to onboard new drivers as the team scales.

<!-- Hoyt tool tour sits under these cards. Copy + stamps: driver.ts hoytToolTour. No ##. -->

<!-- §2 INSIGHTS — ## = H2. ### = H3 (not an eyebrow). Then: EYEBROW / BODY / QUOTE. -->
<!-- The line “quote from research” is hardcoded on the page, not edited here. -->
<!-- H2 -->
## Key system insights

<!-- H3 -->
### Digitizing 12 Years of Memory

<!-- EYEBROW -->
Spent manually placing 40+ routes

<!-- BODY -->
Converted unrecorded coordinator habits and driver availability into structured, readable system profiles.

<!-- QUOTE (body) -->
The only hard part is knowing who's nearby and whether they can take the route. That's what this solves.

<!-- H3 -->
### The Wednesday Risk Horizon

<!-- EYEBROW -->
operational risk cutoff

<!-- BODY -->
Passive RSVP triggers collect responses automatically; missing or declined routes surface as visual gap alerts at noon.

<!-- QUOTE (body) -->
At first, I'd want to double-check everything—not because it's wrong, but because it's new.

<!-- H3 -->
### Spatial Decision Support

<!-- EYEBROW -->
human-in-the-loop layout

<!-- BODY -->
Abandoned full auto-dispatch to keep coordinator trust. System surfaces proximity options while the user retains final decision.

<!-- QUOTE (body) -->
The decision is still mine. The system shows me options, but I make the call.

<!-- §3 PIPELINE — ## = H2. No eyebrows on the page. Station ### is unused chrome. -->
<!-- First para after ### = H3. Last para = BODY. Middle para (days) is unused. -->
<!-- H2 -->
## The physical-to-digital
dispatch pipeline

<!-- LEDE -->
To support Backpack Brigade's real-world warehouse logistics, Map-Aid was structured around a seamless two-station information flow.

<!-- unused slot -->
### Station 1

<!-- H3 -->
Digital RSVP & capacity engine

<!-- unused -->
Monday – Wednesday

<!-- BODY -->
Sam Hoyt triggers an automated weekly RSVP pulse. Drivers confirm their availability, vehicle capacity, and willingness to take on extra school drop-offs directly through automated messaging loops.

<!-- unused slot -->
### Station 2

<!-- H3 -->
Physical warehouse loading dock

<!-- unused -->
Thursday – Friday

<!-- BODY -->
Confirmed digital RSVPs automatically generate physical, color-coded warehouse loading slips. As volunteer drivers queue outside the warehouse loading bay, warehouse staff inspect the loading slip to instantly verify how many food bags, color codes, and school routes to pack directly into each driver's car trunk.

<!-- unused slot -->
### Handoff

<!-- unused -->
Wednesday 12:00 PM Risk Horizon

<!-- §4 LIVE PROTOTYPE — ## = H2. First para = LEDE. No eyebrow. -->
<!-- H2 -->
## The working prototype

<!-- LEDE -->
The warehouse-tested Map-Aid desk. Request the Monday pulse, read coverage, pick a gap, and keep the call.

<!-- §5 PROCESS — ## = H2. Paras = BODY. Glance-card EYEBROWS live in code, not here. -->
<!-- H2 -->
## Process overview

<!-- BODY -->
Rapid prototyping in the field

Three stages, run in the warehouse rather than in a design tool: audit the founder-to-coordinator gap, build working prototypes in hours, then stress-test them during live packing sessions.

<!-- §6 LIFECYCLE — ## = H2. First ### line = EYEBROW. Next line (no blank) = H3. -->
<!-- H2 -->
## Map-Aid
The dispatch lifecycle

<!-- LEDE -->
Monday’s RSVP pulse, the Wednesday 12:00 PM risk horizon, and the loading slip on the dock — one Map-Aid surface, read one object at a time.

<!-- EYEBROW -->
### Weekly launch
<!-- H3 -->
Automated RSVP

The week starts with routes still tentative. Hoyt sends one RSVP pulse to the pool of 90 volunteers, instead of calling through the list.

Confirmations fill a meter. Routes that stay quiet are marked for the Wednesday 12:00 PM risk horizon.

- SMS broadcast
- Confirmation meter
- Risk detection

<!-- EYEBROW -->
### High-altitude scan
<!-- H3 -->
Progressive disclosure

Every school and driver at once was too much to read. Map-Aid shows a neighborhood’s health first, then school pins, then a route only when the view is close.

A cluster reads as a count and a gap. Opening it splits the count into pins, and one pin can name the school that still needs a driver.

- Neighborhood health
- School pins
- Route on zoom

<!-- EYEBROW -->
### Crisis recovery
<!-- H3 -->
Proximity tiers

When a driver drops a route, the hard part is knowing who is close enough to take it. Hoyt put it plainly: the only hard part is knowing who is close and can take the route.

Selecting the gap draws three driving radii and lists the nearest volunteers who can carry the load.

- Within 3 miles
- Within 6 miles
- Within 10 miles

<!-- EYEBROW -->
### Dispatch decision
<!-- H3 -->
An added stop

Taking the gap does not pull a driver off the route they already have. They take an extra stop, if the vehicle can hold it.

Before the request is sent, Map-Aid shows the added school, the pack count, and that the first route stays covered.

- Consequence line
- Cargo check
- First route stays

<!-- EYEBROW -->
### Human touch
<!-- H3 -->
A direct note

These drivers are neighbors and long-time volunteers. The card keeps tenure, the vehicle, and the neighborhood they already run.

A drafted text sits on that card, ready for Hoyt to send in his own voice.

- Tenure and vehicle
- Drafted text
- Direct call

<!-- EYEBROW -->
### Warehouse handoff
<!-- H3 -->
The route sheet

The week ends on the dock, where a driver needs a sheet, not the map. Settled routes become a manifest: crate count, dock notes, and a number to call.

One action compiles that sheet from the schedule closed at Wednesday noon.

- Crate count
- Dock notes
- One-sheet print

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
