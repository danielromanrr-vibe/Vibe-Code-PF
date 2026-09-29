# Map-Aid: Spatial Dispatch
& Driver Coordination

Extracting 12 years of implicit founder knowledge into a high-trust spatial dispatch system for Backpack Brigade.

## Project Overview

### Role

Lead Product & Systems Designer — user research, systems architecture, vibe-code prototyping, on-site usability testing

### Context

Backpack Brigade (Seattle & King County, WA)

### Deliverables

Spatial dispatch map, volunteer capacity engine, two-station information pipeline, interactive Next.js prototypes

### Core Shift

Re-architected weekly dispatch from a manual, memory-dependent bottleneck into an automated RSVP pulse backed by an 80/20 spatial decision-support map for emergency route gaps.

## The bottleneck
of 12 years of founder knowledge

Backpack Brigade set an ambitious goal: triple their weekend food delivery impact across King County schools without increasing operational overhead. Their core dispatch logistics engine relied on an invisible, fragile foundation: CEO Nichelle Hilton's memory.

Over 12 years of organic growth, Nichelle had mentally categorized all 90+ volunteer drivers. She knew their vehicle capacities, home locations, availability patterns, and personality traits — implicitly knowing exactly who to call in an emergency and who would say yes.

When Program Coordinator Sam Hoyt took over weekly operations, he was forced to execute an impossible manual SOP: individually messaging all 90+ drivers from Monday through Thursday using a basic contact spreadsheet. Whenever a driver canceled or went dark, Hoyt had no system data to rely on. He was forced to fall back on Nichelle to manually solve every coordination gap.

Scaling food delivery meant decoupling operations from Nichelle's mental memory — tokenizing informal volunteer capabilities into a shared, visible, and actionable system capability.

## Key system insights

### Tokenizing
implicit capability

- Context: Contextual research and interviews with coordinators and volunteer driver archetypes — the Loyalist and the Juggler.
- Insight: Drivers valued flexibility, but managing that unrecorded flexibility created weekly crisis-level anxiety for the program manager.
- System shift: Nichelle's mental intuition became explicit system tokens — vehicle trunk capacity, emergency flexibility tier, and preferred school radius.

### The Wednesday 12:00 PM
risk horizon

- Context: Mapped the strict weekly operational timeline from Monday RSVP dispatch to Friday physical school drop-offs.
- Insight: Coordination is not static — it is defined by a hard time deadline.
- System shift: An automated Monday RSVP trigger collects driver responses passively, and Wednesday at 12:00 PM becomes the risk horizon — missing or declined RSVPs surface as visual at-risk gaps.

### The pivot to
spatial decision support

- Context: Live, unguided usability testing with Sam Hoyt inside the active warehouse during packing sessions.
- Insight: CEO Nichelle approved automated RSVP messaging. Hoyt rejected autonomous route assignment during emergencies. He needed to verify driver proximity and keep personal volunteer relationships intact.
- System shift: Interface real estate moved from heavy data tables to 80% spatial map / 20% data panel — high-trust decision support, with the coordinator in complete control.

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

- Before: Trapped in CEO Nichelle's head — 12 years of unwritten memory
- After: Tokenized system profiles — flexibility tiers and car capacities

### Weekly RSVP loop

- Before: Manual SMS and calls to 90+ volunteers by Hoyt, Monday through Thursday
- After: Automated Monday RSVP pulse with real-time status collection

### Emergency trigger

- Before: Reactive panic when drivers canceled on Thursday morning
- After: Wednesday 12:00 PM risk horizon surfacing visual gaps

### Emergency resolution

- Before: Paper map cross-referencing and direct calls to Nichelle
- After: Tier-based spatial map matching nearby available drivers

### Warehouse dock flow

- Before: Fragmented verbal instructions during driver loading
- After: Automated physical loading slips matching car trunk capacity

## Closing reflection

Map-Aid proved that operational software for non-profits does not need full automation to scale impact — it needs spatial clarity and human trust. Converting founder intuition into an actionable spatial overlay lets Backpack Brigade expand food security programs across King County with complete operational confidence.
