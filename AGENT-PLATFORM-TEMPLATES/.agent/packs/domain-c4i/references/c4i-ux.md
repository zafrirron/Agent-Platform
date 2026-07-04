# C2 / C4ISR — operator UI/UX (application layer)

> UI/UX catalog for C2 operator applications. This is **domain** work: what operators see and do. The rendering library, GPU, and display drivers are adjacent (`stack-geospatial` / `platform-tactical-edge`).

## Screen layout & perspectives
- **Role/phase perspectives.** Named, saved layouts per operator role and mission phase; restorable after reconnect/crash; never require manual re-arrangement each shift.
- **Single-screen collapse order.** Define how a multi-panel COP collapses to one screen so the app stays usable on a laptop or a downgraded station.
- **Multi-monitor / video wall.** Layouts span displays; a shareable "wall" view; consistent scaling and legibility at distance.

## Screen zones (canonical model)
COP map canvas · entity/track tree · inspector/details · command bar · status & alert ticker · tool/tasking palette. Same entity → same verbs in every zone.

## Menus & interaction
- Context/marking menus on COP objects; global command palette; role-based menu sets (hide what a role can't do).
- Consistent object→action model; keyboard-first for high-tempo operators; large hit targets for touch/gloved use where relevant.

## Map UX (capability; engine is adjacent)
- North-up / track-up; 2D/3D; MGRS / UTM / lat-long with an explicit, operator-selectable coordinate-readout format (coordinates never ambiguous).
- Layered overlays with visibility/opacity control; measurement/ranging; declutter & clustering by density/zoom; focus-plus-context.

## Symbology (MIL-STD-2525 / NATO APP-6)
- Correct affiliation, dimension, status, echelon, and amplifiers.
- Friendly / hostile / unknown distinguishable **without color alone** (shape + label + pattern); friendly-fire-safe defaults.
- Density-aware auto-declutter; consistent icon scale across zoom.

## Color, contrast & night use
- Day and low-light/night COP themes; color-blind-safe palettes; legible on a video wall and in a bright ops center.
- Color never the sole carrier of affiliation or urgency.

## Freshness, latency & degraded UX
- Every track/feed shows age/staleness; stale ≠ live visually.
- Link latency/loss degrades visibly (never silent); DIL states are explicit in the UI.

## Alerting & decision support UX
- Prioritized, deduplicated, acknowledgeable alerts in a persistent ticker/queue; alert explains *why* it fired; click-through to the COP object.

## Collaboration UX
- Chat/annotations/voice anchored to COP objects (track/area/task); shared markups converge to COP truth; presence/attribution visible.

## Accessibility & ergonomics (ops center)
- Legibility at viewing distance; scalable text/icons; reduced-motion option; keyboard navigation; sustained-shift ergonomics (contrast, glare, fatigue).

## Attribution & after-action UX
- Operator actions that change shared state are attributable, timestamped, and replayable; a timeline/scrubber to review past COP state.
