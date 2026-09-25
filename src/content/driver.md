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

## Spatial map
& emergency decision support

### Automated Monday RSVP loop

Hoyt initiates the weekly dispatch cycle with a single click. The system manages individual volunteer communication, tracking confirmations and car capacity updates in real time.

### Wednesday 12:00 PM at-risk gap map

At Wednesday noon, unconfirmed or canceled routes transition into visual at-risk gaps on the spatial map. The tier-based overlay automatically filters off-duty drivers nearby who have the required vehicle trunk capacity and high flexibility ratings.

### One-click high-trust dispatch

Hoyt selects a suggested replacement driver on the map, reviews their past route history, and sends a targeted emergency request — resolving logistics bottlenecks in seconds while preserving direct human contact.

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
