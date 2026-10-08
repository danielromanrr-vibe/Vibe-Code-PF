<!-- HERO: # = H1. Next paragraph = regular body. -->
<!-- Opening: image → H1 → body → fact cards → H3 → story cards. Same slots as adopt.md. -->
# Map-Aid: Spatial Dispatch
& Driver Coordination

Extracting 12 years of implicit founder knowledge into a high-trust spatial dispatch system for Backpack Brigade.

<!-- SECTION 0 — fact cards sit with the body. ## is a slot group, not shown. -->
<!-- ### = floating bold-slab label. Keep Role, Context, Scope, Impact. -->
## Project Overview

### Role

Lead Product & Systems Designer — user research, systems architecture, vibe-code prototyping, on-site usability testing

### Context

Backpack Brigade (Seattle & King County, WA). Weekly dispatch sat in 12 years of founder memory across 90+ drivers.

### Scope

Spatial dispatch map, volunteer capacity engine, two-station information pipeline, interactive Next.js prototypes

### Impact

Re-architected weekly dispatch from a manual, memory-dependent bottleneck into an automated RSVP pulse backed by an 80/20 spatial decision-support map for emergency route gaps.

<!-- SECTION 1 — ## renders as H3. Its cards sit with this heading. -->
## From problem to outcome

### This

A shared spatial desk for the week: Monday RSVP pulse, coverage on a map, and a loading slip on the dock.

### Problem

Dispatch relied on Nichelle Hilton's 12-year memory. When Sam Hoyt took the week, he messaged 90+ drivers from a spreadsheet and fell back on her whenever someone canceled.

### Decision

Tokenize informal volunteer capability into a shared map. Hoyt rejected auto-dispatch — the screen is 80% map and 20% data. Options surface. He keeps the call.

### Outcome

An automated Monday RSVP and a Wednesday 12:00 PM risk horizon. Nearby volunteers show when a route drops. The coordinator still makes the call.

## Key system insights

### Tokenizing
implicit capability

- Context: Interviews with Loyalist drivers, and with the Juggler coordinators Sam Hoyt and Duncan Rowe.
- Insight: Drivers wanted a routine and the flexibility to keep it. That preference was unrecorded, so the coordinators spent 15–20 hours a week placing 40+ routes from spreadsheets and from memory.
- System shift: Twelve years of availability, preferences, and capacity become profiles a coordinator can read, instead of a memory they have to keep.

### The Wednesday 12:00 PM
risk horizon

- Context: Mapped the strict weekly operational timeline from Monday RSVP dispatch to Friday physical school drop-offs.
- Insight: Coordination is not static — it is defined by a hard time deadline.
- System shift: An automated Monday RSVP trigger collects driver responses passively, and Wednesday at 12:00 PM becomes the risk horizon — missing or declined RSVPs surface as visual at-risk gaps.

### The pivot to
spatial decision support

- Context: Live, unguided usability testing with Sam Hoyt inside the active warehouse during packing sessions. Nichelle approved automated RSVP messaging. Hoyt rejected autonomous route assignment.
- Insight: A system that dispatched for him would have taken the judgment, and the direct contact, he trusted. He needed proximity, and he needed to make the call.
- System shift: The architecture leaves full auto-dispatch behind. The screen is 80% spatial map and 20% data. Options surface. The coordinator keeps the decision.

### What the coordinator said

- Product value: The only hard part is knowing who's nearby and whether they can take the route. That's what this solves.
- Trust and adoption: At first, I'd want to double-check everything — not because it's wrong, but because it's new.
- Human in the loop: The decision is still mine. The system shows me options, but I make the call.

## The physical-to-digital
dispatch pipeline

To support Backpack Brigade's real-world warehouse logistics, Map-Aid was structured around a seamless two-station information flow.

### Station 1

Digital RSVP & capacity engine

Monday – Wednesday

Sam Hoyt triggers an automated weekly RSVP pulse. Drivers confirm their availability, vehicle capacity, and willingness to take on extra school drop-offs directly through automated messaging loops.

### Station 2

Physical warehouse loading dock

Thursday – Friday

Confirmed digital RSVPs automatically generate physical, color-coded warehouse loading slips. As volunteer drivers queue outside the warehouse loading bay, warehouse staff inspect the loading slip to instantly verify how many food bags, color codes, and school routes to pack directly into each driver's car trunk.

### Handoff

Wednesday 12:00 PM Risk Horizon

## The working prototype

The warehouse-tested Map-Aid desk. Request the Monday pulse, read coverage, pick a gap, and keep the call.

## Process overview
Rapid prototyping in the field

Three stages, run in the warehouse rather than in a design tool: audit the founder-to-coordinator gap, build working prototypes in hours, then stress-test them during live packing sessions.

## Map-Aid
The dispatch lifecycle

Monday’s RSVP pulse, the Wednesday 12:00 PM risk horizon, and the loading slip on the dock — one Map-Aid surface, read one object at a time.

### Weekly launch
Automated RSVP

The week starts with routes still tentative. Hoyt sends one RSVP pulse to the pool of 90 volunteers, instead of calling through the list.

Confirmations fill a meter. Routes that stay quiet are marked for the Wednesday 12:00 PM risk horizon.

- SMS broadcast
- Confirmation meter
- Risk detection

### High-altitude scan
Progressive disclosure

Every school and driver at once was too much to read. Map-Aid shows a neighborhood’s health first, then school pins, then a route only when the view is close.

A cluster reads as a count and a gap. Opening it splits the count into pins, and one pin can name the school that still needs a driver.

- Neighborhood health
- School pins
- Route on zoom

### Crisis recovery
Proximity tiers

When a driver drops a route, the hard part is knowing who is close enough to take it. Hoyt put it plainly: the only hard part is knowing who is close and can take the route.

Selecting the gap draws three driving radii and lists the nearest volunteers who can carry the load.

- Within 3 miles
- Within 6 miles
- Within 10 miles

### Dispatch decision
An added stop

Taking the gap does not pull a driver off the route they already have. They take an extra stop, if the vehicle can hold it.

Before the request is sent, Map-Aid shows the added school, the pack count, and that the first route stays covered.

- Consequence line
- Cargo check
- First route stays

### Human touch
A direct note

These drivers are neighbors and long-time volunteers. The card keeps tenure, the vehicle, and the neighborhood they already run.

A drafted text sits on that card, ready for Hoyt to send in his own voice.

- Tenure and vehicle
- Drafted text
- Direct call

### Warehouse handoff
The route sheet

The week ends on the dock, where a driver needs a sheet, not the map. Settled routes become a manifest: crate count, dock notes, and a number to call.

One action compiles that sheet from the schedule closed at Wednesday noon.

- Crate count
- Dock notes
- One-sheet print

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

## Closing reflection

Map-Aid does not auto-dispatch the week. An 80% map and a 20% data panel turn founder memory into proximity and status: who is available, which routes are at risk, and who is close enough to take a gap. The coordinator still makes the call, and still keeps the contact that the call depends on.
