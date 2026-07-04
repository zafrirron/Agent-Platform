# C2 / C4ISR reference architecture — curated

> Read this when the user asks *"give me a reference architecture for a C2 / C4ISR / situational-awareness app"* (or similar). This is a distilled, opinionated starting point at the **domain / capability** level. The **linked source apps** are real, studyable implementations — point the user to them, respecting each license. Concrete transport/middleware/rendering/hardware choices are **adjacent packs**, not this domain.

## Source apps (study these real implementations)

| Repo | License | What to study (domain lens) |
|------|---------|------------------------------|
| [deptofdefense/AndroidTacticalAssaultKit-CIV](https://github.com/deptofdefense/AndroidTacticalAssaultKit-CIV) | **GPL-3.0** (verified 2026-07-04; **archived read-only May 2025**; some bundled libs Apache-2.0) | Map-centric operator COP UX, MIL-STD-2525 symbology rendering, saved layouts, plugin capability model, degraded-comms workflows. **Copyleft — study, don't copy.** |
| [FreeTAKTeam/FreeTakServer](https://github.com/FreeTAKTeam/FreeTakServer) | **EPL-2.0** (verified 2026-07-04) | COP entity/track data model, federation of situational-awareness state, mission/data-package capabilities. **Copyleft — study, don't copy.** |

> Licenses **verified 2026-07-04**. Both reference apps are **copyleft (GPL-3.0 / EPL-2.0) — safe to learn from, do not copy into a closed product.** What belongs to *this* domain pack is the **capability and UX**, not the wire protocol. Verified standards distilled into this pack: **MIL-STD-2525D / APP-6D** (`symbology-sidc.md`), **MISB ST 0601 / STANAG 4609** (`c4i-video.md`), **Cursor-on-Target** entity semantics (overlays).

## What is domain here (and what is not)

- **Domain (this pack):** operator capabilities, the common-operating-picture experience, C2 information semantics (entities/tracks/tasking/releasability), UI/UX including map UX and in-app video UX.
- **Not domain (adjacent packs):** CoT/TAK or DDS transport (`stack-cot-tak`, `stack-dds`), map rendering engine (`stack-geospatial`), video codec/transport (`stack-fmv-decode`), edge hardware/OS (`platform-tactical-edge`), implementation language (`language-cpp`). See `pack.json → attribution`.

## Core building blocks (capability level)

1. **Single COP truth.** One correlated common operating picture; every surface (map, tables, video overlays) derives from it — no divergent per-panel state.
2. **Explicit C2 information model.** Units/assets, tracks, tasks/orders, plans, geometries, events — each with identity, position (datum) and time. Model semantics first; wire format is a stack concern.
3. **Track management.** Correlate/de-dup reports into stable tracks with confidence/uncertainty and source; surface conflicts instead of silently merging.
4. **Tasking/orders lifecycle.** Explicit state machine with attribution and timestamps per transition.
5. **DIL tolerance.** Offline-first, store-and-forward, conflict resolution on reconnect; capability degrades gracefully, never fails silently.
6. **Freshness & uncertainty everywhere.** Age/staleness and confidence are data and are always visible.
7. **Replay & attribution.** Enough event history to reconstruct/replay the COP for after-action; every state change attributed.
8. **Releasability & marking.** Filtering by role/echelon/caveat built into the model; default-deny sharing.

## Reference shape (capability view)

```
[sensors/feeds/reports] → [ingest + validate] → [track correlation] → [COP truth store (event-sourced)]
                                                        │                          │
                                                        ▼                          ▼
                                             [tasking/orders engine]      [releasability/marking filter]
                                                        │                          │
                                                        ▼                          ▼
              [operator COP UI: map + entity tree + inspector + video + alerts + command bar]
                                                        │
                                                        ▼
                                           [after-action replay / audit]
```

## Non-negotiables (see also `c4i-capabilities.md`, `c4i-ux.md`, `c4i-video.md`)

- Every entity has explicit position (datum) + time; never mix datums or assume always-on comms.
- Affiliation/urgency never encoded by color alone; symbology per MIL-STD-2525 / APP-6.
- Stale/uncertain data is visibly distinct from fresh/certain.
- Cross-echelon/coalition sharing is an explicit, auditable, default-deny decision.

## How this grows

A maintainer enriches this file (and `reference_sources`) via pack-scoped scans:
- Bootstrap: `Read MAINTAINER/web-audit.md and execute it. build-pack=domain-c4i`
- From a repo: `Read MAINTAINER/github-governance-scan.md and execute it. repo=<c2-app> pack=domain-c4i`
- From a website: `Read MAINTAINER/web-audit.md and execute it. url=<https://site> pack=domain-c4i`
