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
<!--   # H1 · first para = regular lede. **this** is bold. Later paras = body -->
<!--   §0 fact cards — ### = EYEBROW                             -->
<!--   §1 story cards — ## = H3, ### = EYEBROW                   -->
<!--   After Outcome: Hoyt tool tour (copy in driver.ts)         -->
<!--   §2 insights — ### = H3, then BODY / QUOTE                 -->
<!--   §3 pipeline · §4 prototype · §5 process                   -->
<!--   §6 lifecycle — first ### line = EYEBROW, next line = H3   -->
<!--   §7 transformation · §8 closing                            -->
<!-- =========================================================== -->

<!-- HERO — no eyebrows. # = H1. First para = regular lede. Wrap **words** to bold them. Next = BODY. -->
# Scaling Volunteer Driver
Dispatch for Scale

To scale Backpack Brigade—a non-profit delivering weekend meals to thousands of food-insecure children across King County—I designed a human-in-the-loop coordination platform that digitizes 12 years of founder knowledge into structured driver profiles, automated check-ins, and interactive dispatch maps. **This system reduces coordinator workload by an estimated 80% and ensures reliable operations across new warehouse locations without relying on the founder in the room.**

<!-- §0 FACT CARDS — ## is hidden. Each ### is the EYEBROW. Paras = BODY. -->
## Project Overview

<!-- EYEBROW -->
### Role

<!-- BODY -->
Lead Product & Systems Designer

(User research, systems architecture, rapid prototyping, on-site usability testing)

<!-- EYEBROW -->
### Context

<!-- BODY -->
Weekly dispatch relied on 12 years of unwritten founder memory and manual spreadsheet tracking across 90+ volunteer drivers, creating operational bottlenecks that blocked multi-warehouse expansion.

<!-- EYEBROW -->
### Scope

<!-- BODY -->
- Contact Management System: Tokenizes driver reliability, vehicle capacity, and route flexibility into structured data profiles.
- Automated Weekly Check-Ins: Collects driver RSVPs automatically while preserving human override for custom replies.
- Interactive Emergency Map: Surfacing nearby backup drivers to resolve sudden route dropouts in real time.
- Artifact Generation: Produces digital and physical dispatch passes automatically, eliminating manual paper preparation.

<!-- EYEBROW -->
### Impact

<!-- BODY -->
- 80% Workload Reduction: Saves 15–20 hours of weekly coordinator bandwidth by replacing spreadsheets with automated task flows.
- Human-in-the-Loop Control: An 80/20 spatial algorithm suggests optimal driver matches, leaving final dispatch authority with the coordinator.
- Instant Bottleneck Resolution: Identifies and assigns nearby backup drivers in seconds when emergency cancellations occur.
- Scalable Operating Framework: Codifies tacit founder knowledge into a standardized SOP ready for multi-warehouse expansion.

<!-- §1 STORY CARDS — ## = H3. Each ### is the EYEBROW. A list = bullets. -->
<!-- H3 -->
## From problem to outcome

<!-- EYEBROW -->
### Solution

<!-- BODY -->
A dedicated workspace for the full weekly dispatch lifecycle—combining automated driver RSVPs, physical artifact generation, and a spatial interface for emergency route coverage.

<!-- EYEBROW -->
### Problem

<!-- BODY -->
Weekly dispatch relied on 12 years of unwritten founder memory and manual spreadsheet tracking across 90+ volunteer drivers, creating operational bottlenecks that blocked multi-warehouse expansion.

<!-- EYEBROW -->
### Decision

<!-- BODY -->
An 80/20 spatial algorithm suggests optimal driver matches, leaving final dispatch authority with the coordinator.

<!-- EYEBROW -->
### Outcome

<!-- BODY -->
Dispatch now runs without the spreadsheet or the founder in the room. Coordinators get back 15–20 hours a week, a cancelled route is covered in seconds, and the same model can open the next warehouse.

<!-- Hoyt tool tour sits under these cards. Copy + stamps: driver.ts hoytToolTour. No ##. -->

<!-- §2 INSIGHTS — ## = H2. ### = H3. Then: BODY / QUOTE. -->
<!-- The line “quote from research” is hardcoded on the page, not edited here. -->
<!-- H2 -->
## What we had to change

<!-- H3 -->
### Digitizing 12 Years of Memory

<!-- BODY -->
Converted unrecorded coordinator habits and driver availability into structured, readable system profiles.

<!-- QUOTE (body) -->
The only hard part is knowing who's nearby and whether they can take the route. That's what this solves.

<!-- H3 -->
### The Wednesday Risk Horizon

<!-- BODY -->
Passive RSVP triggers collect responses automatically; missing or declined routes surface as visual gap alerts at noon.

<!-- QUOTE (body) -->
At first, I'd want to double-check everything—not because it's wrong, but because it's new.

<!-- H3 -->
### Spatial Decision Support

<!-- BODY -->
Abandoned full auto-dispatch to keep coordinator trust. System surfaces proximity options while the user retains final decision.

<!-- QUOTE (body) -->
The decision is still mine. The system shows me options, but I make the call.

<!-- §3 PIPELINE — ## = H2. No eyebrows on the page. Station ### is unused chrome. -->
<!-- First para after ### = H3. Last para = BODY. Middle para (days) is unused. -->
<!-- H2 -->
## From an email to the loading dock

<!-- LEDE -->
Each week, a volunteer replies to one email to say they can drive. That is all it asks of them, and they like it that way. At the dock, loading volunteers use the slip from that reply to pack the bags for that driver.

<!-- unused slot -->
### Station 1

<!-- H3 -->
The Monday to Thursday cycle

<!-- unused -->
Monday – Thursday

<!-- BODY -->
The program manager and volunteer coordinator send each RSVP by hand, one driver at a time, asking who is free and how much the car can carry. Map-Aid fits into that same stretch of the week, so the answers are collected before Thursday, when the drivers arrive.

<!-- unused slot -->
### Station 2

<!-- H3 -->
When drivers arrive

<!-- unused -->
Thursday

<!-- BODY -->
This slip is produced by the current spreadsheet and the RSVPs collected from Monday to Thursday. Drivers show up and use it. **This slip, and the other artifacts for this moment, including a whiteboard, are currently done manually.**

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

<!-- §6 LIFECYCLE — ## stays so later slots do not shift. The H2 and lede are not shown. -->
<!-- Phases render under the working prototype player, in this order. -->
<!-- H2 (hidden) -->
## Map-Aid
The dispatch lifecycle

<!-- LEDE (hidden) -->
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
