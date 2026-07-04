# C2 / C4ISR overlay — frontend-agent

> Active only when `domain-c4i` is in `active_packs`. Read **after** `frontend-agent.md`.
> Scope: **operator UI/UX for command-and-control applications** — what operators see and do. Rendering engines, codecs, and transports are NOT here (see adjacent stack/platform packs). Full catalog: `references/c4i-ux.md`.

## Hard rules (C2 operator UX)

- **Map-first COP.** The common operating picture (map canvas) is the primary surface. Minimize chrome; use focus-plus-context and detail-on-demand — never bury essential state behind modals during active operations.
- **Saved role/phase layouts.** Screen layouts ("perspectives") are per role and mission phase, reproducible from saved state, and restorable after reconnect or crash. Never require operators to re-arrange each shift. Define a single-screen collapse order so a multi-screen COP still works degraded.
- **Canonical zones.** Keep a consistent zone model: COP canvas · entity/track tree · inspector · command bar · status/alert ticker · tool palette. Same entity → same verbs everywhere (consistent object→action model). Provide context/marking menus and a command palette; menu sets are role-based.
- **Symbology correctness (MIL-STD-2525D / NATO APP-6D).** Affiliation, dimension, status, echelon and amplifiers must be correct; hostile/unknown/friendly must be distinguishable **without relying on color alone** — affiliation is carried by **frame shape** too (friend rounded-rect, hostile diamond, neutral square, unknown quatrefoil), friendly-fire-safe. Build symbols by **composing** independent flags (frame + icon + status + echelon/HQ/TF), never by enumerating; **status = solid frame (present) vs dashed (planned)** on the stroke only; **validate SIDC modifier slots against the JMSML schema**; keep the echelon glyph offset above the frame and render frame+icon on the same integer pixel grid. Depth: `references/symbology-sidc.md`. Auto-declutter/cluster by density and zoom.
- **Never rely on color alone.** Encode affiliation and urgency with shape/label/pattern too. Ship a low-light/night COP theme and a day theme; palettes must be color-blind-safe and legible at viewing distance / on a video wall.
- **Freshness is visible.** Every track/feed shows age/staleness; stale data is visually distinct from live; latency/link loss degrades visibly, never silently.
- **Map UX, not map engine.** Provide north-up/track-up, 2D/3D, MGRS/lat-long/UTM grids, layered overlays, measurement, and an explicit, operator-selectable coordinate-readout format (coordinates must never be ambiguous). The rendering library itself is `stack-geospatial`.
- **Video is an in-app COP citizen.** See `references/c4i-video.md` and the video rules below — video UX lives in the application layer (this pack), only the raw codec/transport primitive is adjacent.
- **Attributable actions.** Any operator action that changes shared state is attributable, timestamped, and replayable (after-action).
- **All-domain COP.** Let operators view/filter/fuse by operational domain (land/air/maritime/space/cyber) in one picture; domain drives symbology battle-dimension. Don't assume a ground-only map.
- **AI recommendations, not verdicts.** Present predictive/AI aids as clearly-marked **suggestions** with confidence and a "why" (inputs/provenance); operator can accept/reject/override; never let the UI auto-commit a restricted or lethal action (human on/in the loop).
- **Design to the SA pipeline + cognitive load.** Support Perception → Comprehension → **Projection**, not just raw display; cap a view at **~5–7 widgets/data-groups** (split or progressively disclose beyond that). Depth: `references/c4i-cognition.md`.
- **Fitts' Law both ways.** Critical, time-sensitive controls: **large (~2–3×) and near the primary view**. Destructive/irreversible actions (abort/delete/shutdown): **smaller, off the main path, or behind a guard** — plus **neutral colours** (not green/red) so the operator reads the text; require explicit confirm and offer **Undo**.
- **Interruption saves task state.** A high-priority alert must never silently discard an operator's in-flight task — save its state so it can be resumed (distinct from saved layouts).
- **Dual-code, never fake "normal".** Affiliation/urgency/status are colour **plus** shape/text (dual-coded); an offline sensor / dropped stream shows an obvious missing-data signal — never a nominal all-clear.

## Video-in-application UX (domain)
- Feeds are first-class entities that dock into the zone system and correlate to what they watch.
- Video-on-map + map-in-video: sensor field-of-view/footprint/look-point drawn on the COP; KLV/MISB metadata overlaid and geo-registered.
- Slew-to-cue (click track → camera slews) and click-in-video → drop/hand-off a point onto the map.
- Multi-feed grid + saved video layouts; DVR/replay synced to the mission timeline; snapshot→track, clip→annotate→share to COP.
- A lost/late feed shows last-good-frame + staleness; DIL-aware quality fallback.

## Review lens
- Color-only encoding of affiliation/urgency → reject.
- Coordinate readouts without explicit format/datum.
- Layouts that can't be saved/restored per role; state lost on reconnect.
- Alerts/tracks with no freshness indicator; silent feed loss.
- Symbology that misrepresents affiliation/status/echelon.
- Video metadata that doesn't reconcile with the COP (same target, different place).
