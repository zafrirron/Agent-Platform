# Pack ledger — domain-c4i

**Kind:** domain
**Created:** 2026-07-04 (build-pack, dry-run → real build)   **Last updated:** 2026-07-04 (Mode 3 ingest — internal C2 engineer UI/UX skill, v1.3.0)
**Pack version at last update:** 1.3.0

## Sources consumed
| Date | Source (URL) | License | Scan | Contribution | Disposition |
|------|--------------|---------|------|--------------|-------------|
| 2026-07-04 | https://github.com/deptofdefense/AndroidTacticalAssaultKit-CIV | **GPL-3.0** (verified — copyleft, study-only; archived read-only May 2025) | build-pack | operator COP UX, MIL-STD-2525 symbology, saved layouts, plugin model | Adopted → reference_sources[] (study-only) + c4i-ux.md |
| 2026-07-04 | https://github.com/FreeTAKTeam/FreeTakServer | **EPL-2.0** (verified — copyleft, study-only) | build-pack | COP entity/track data model, SA-state federation, mission/data packages | Adopted → reference_sources[] (study-only) + c4i-capabilities.md |
| 2026-07-04 | MIL-STD-2525D / NATO APP-6(D) — https://www.jcs.mil/portals/36/documents/doctrine/other_pubs/ms_2525d.pdf | US DoD public standard | web-scan enrich | 20-digit SIDC, frame/icon/status/echelon composition, JMSML validation, pixel-alignment pitfalls | Adopted → references/symbology-sidc.md + frontend overlay |
| 2026-07-04 | MISB ST 0601 / STANAG 4609 (KLV/SMPTE ST 336) — https://nsgreg.nga.mil/doc/view?i=5093 | public standard | web-scan enrich | FMV geo-metadata fields (sensor lat/lon/alt, attitude, HFOV) → footprint/target-location; MPEG-2 TS mux; sync = designer responsibility | Adopted → references/c4i-video.md + frontend video rules |
| 2026-07-04 | Cursor on Target (CoT) base schema — https://freetakteam-freetakserver.mintlify.app/concepts/cot-messages | open format (spec) | web-scan enrich | event(uid/type/time/start/stale/how)+point+detail; stale-driven confidence decay; access/sharing marker | Adopted as SEMANTICS → backend + security overlays (wire format → adjacent stack-cot-tak) |
| 2026-07-04 | https://www.imarcgroup.com/blog/top-c4isr-companies | proprietary (market blog — inspiration-only) | `url=` site scan | **breadth/gap signals only** (marketing-level): all-domain C2, AI/predictive decision support, ISR PED, commander roll-up, unmanned C2, cyber/EW | Partial-adopt (U001–U003); no list/wording copied |
| 2026-07-04 | Internal C2 engineering submission — `c2_ui_ux_skill.md` | internal contribution (owned) | Mode 3 ingest (PACK-CANDIDATE) | operator cognition & interaction design (SA pipeline, cognitive load, Fitts' Law, stress single-tasking, forgiveness, alert fatigue) | Adopted → references/c4i-cognition.md + frontend overlay |

**License correction (v1.1.0):** ATAK-CIV was mislabeled `Apache-2.0 (verify)` in the v1.0.0 author-derived draft. Web scan verified it is **GPL-3.0** (copyleft, study-only) and the repo is **archived read-only since May 2025**. Corrected in `pack.json`, `reference-architecture.md`, and `docs/INTELLIGENCE-SOURCES.md`.

## Findings (domain axis = application capabilities + UI/UX + C2 semantics)
| ID | Summary | Class | Disposition | Landed in |
|----|---------|-------|-------------|-----------|
| B001 | Single COP truth; all surfaces derive from it | NEW | Adopted | architect-agent.overlay.md, reference-architecture.md |
| B002 | Explicit C2 information model (entities/tracks/tasks/plans/geom/events, datum+time) | NEW | Adopted | backend-agent.overlay.md, c4i-capabilities.md |
| B003 | Track management (correlation/de-dup, identity, confidence, conflict surfacing) | NEW | Adopted | backend-agent.overlay.md, c4i-capabilities.md |
| B004 | Tasking/orders lifecycle state machine + attribution | NEW | Adopted | backend-agent.overlay.md, c4i-capabilities.md |
| B005 | DIL tolerance / offline-first / degrade-gracefully | NEW | Adopted | architect-agent.overlay.md, reference-architecture.md |
| B006 | Freshness & uncertainty as first-class, always visible | NEW | Adopted | overlays, c4i-capabilities.md, c4i-ux.md |
| B007 | Symbology MIL-STD-2525 / APP-6; never color-alone; friendly-fire-safe | NEW | Adopted | frontend-agent.overlay.md, c4i-ux.md |
| B008 | Screen layout/perspectives, canonical zones, menus, multi-monitor/video-wall | NEW | Adopted | frontend-agent.overlay.md, c4i-ux.md |
| B009 | Map UX (grids/coord readout/3D/measure/declutter) — capability, engine adjacent | NEW | Adopted | frontend-agent.overlay.md, c4i-ux.md |
| B010 | Alerting & decision support (why-it-fired, prioritized, ack) | NEW | Adopted | c4i-capabilities.md, c4i-ux.md |
| B011 | Multi-echelon sharing + releasability/marking (default-deny) | NEW | Adopted | security-agent.overlay.md, c4i-capabilities.md |
| B012 | After-action replay & attribution/audit | NEW | Adopted | architect/backend overlays, c4i-capabilities.md |
| B013 | Collaboration/chat/voice anchored to COP objects | NEW | Adopted | c4i-capabilities.md, c4i-ux.md |
| B014 | Accessibility & ops-center ergonomics (legibility at distance, night themes) | NEW | Adopted | c4i-ux.md |
| B015 | Full-motion video integration — first-class COP UX (slew-to-cue, video-on-map, DVR) | NEW | Adopted | frontend-agent.overlay.md, c4i-video.md, c4i-capabilities.md |
| B016 | Planning & COA authoring/compare against COP | NEW | Adopted | c4i-capabilities.md |
| B017 | Sensor/report fusion — capability & data contract (algorithms adjacent) | NEW | Adopted | c4i-capabilities.md |
| B018 | MIL-STD-2525D SIDC depth (20-digit positional; compose frame/icon/status/echelon/HQ/TF; JMSML validation; echelon offset + frame/icon pixel-grid pitfalls; status solid/dashed) | NEW (web-verified) | Adopted | references/symbology-sidc.md, frontend-agent.overlay.md |
| B019 | CoT entity semantics — persistent uid, time/start/stale validity, **stale→confidence decay**, access/sharing marker, how/qos hint (semantics only; wire format adjacent) | ENHANCE (strengthens B002/B006/B011) | Adopted | backend-agent.overlay.md, security-agent.overlay.md |
| B020 | MISB ST 0601 / STANAG 4609 KLV depth — geo-metadata fields for footprint/target-location; MPEG-2 TS mux; metadata↔imagery sync is designer responsibility; klvdata/misb.js parsers | ENHANCE (strengthens B015) | Adopted | references/c4i-video.md, frontend-agent.overlay.md |
| B021 | License verification of reference apps (ATAK GPL-3.0 archived; FTS EPL-2.0) | NEW (correction) | Adopted | pack.json, reference-architecture.md, INTELLIGENCE-SOURCES.md |
| U001 | All-domain / multi-domain C2 (land/air/maritime/space/cyber; JADC2; joint interop by contract) | NEW (site scan) | Adopted | c4i-capabilities.md §15, architect + frontend overlays |
| U002 | Predictive decision support — AI recommendations w/ confidence+provenance, human-on/in-the-loop (models adjacent) | ENHANCE (B010) | Adopted | c4i-capabilities.md §16, backend + frontend overlays |
| U003 | ISR collection management + PED (tasking→coverage/gap; Processing/Exploitation/Dissemination→intel products) | NEW (site scan) | Adopted | c4i-capabilities.md §17, backend overlay |
| U004 | Commander-level SA / big-data roll-up dashboards (executive vs operator SA) | NEW | Deferred (backlog) | — |
| U005 | Unmanned-systems (UxV) C2 integrated into the COP | NEW | Deferred (backlog) | — |
| U006 | Cyber-ops C2 + Electronic Warfare (bundled with C4ISR everywhere) | NEW | Rejected for this pack → adjacent | (see Adjacent + Do-not-re-propose) |
| U007 | Integrated-systems / interoperability across sensors & platforms | DUPLICATE | Already covered (B002, architect overlay) | no action |
| C001 | SA pipeline — Perception → Comprehension → Projection (Endsley) | NEW | Adopted | references/c4i-cognition.md, frontend overlay |
| C002 | Cognitive load — ~5–7 widgets/data-groups per view; reduce working memory | NEW | Adopted | references/c4i-cognition.md, frontend overlay |
| C003 | Fitts' Law — forward (enlarge critical, near view) + reverse (destructive smaller/guarded) | NEW | Adopted | references/c4i-cognition.md, frontend overlay |
| C004 | Stress single-tasking (linear wizard) + sensible defaults | NEW | Adopted | references/c4i-cognition.md |
| C005 | Interruption management — save in-flight task state, resume gracefully | NEW | Adopted | references/c4i-cognition.md, frontend overlay |
| C006 | Forgiveness (Undo + explicit confirm) + neutral destructive colours | NEW | Adopted | references/c4i-cognition.md, frontend overlay |
| C007 | Alert fatigue / habituation — routine blends, critical breaks focus | ENHANCE (B010/§8) | Adopted | references/c4i-cognition.md |
| C008 | UX-enforcing components + domain/UI state separation | NEW | Adopted | references/c4i-cognition.md |
| C009 | Dual-coding (colour + shape/text) | DUPLICATE (B007) | Aligned wording only | frontend overlay |
| C010 | Agent transparency (reasoning + confidence, in-loop) | DUPLICATE (U002) | Already covered | — |
| C011 | Graceful degradation — don't fake "normal" when offline | ENHANCE (B006) | Aligned wording | frontend overlay |

## Do-not-re-propose (routed off-axis on purpose)
- CoT/TAK wire protocol & serialization — **not domain** → adjacent `stack-cot-tak` (routed 2026-07-04).
- DDS / pub-sub middleware — **not domain** → adjacent `stack-dds` (routed 2026-07-04).
- Map rendering engine/library — **not domain** → adjacent `stack-geospatial` (routed 2026-07-04).
- Video codec/decoder/container + RTP/RTSP/SRT transport — **not domain** → adjacent `stack-fmv-decode` (routed 2026-07-04). *(Video UI/UX stays domain — see B015.)*
- Edge hardware / OS-RTOS / drivers — **not domain** → adjacent `platform-tactical-edge` (routed 2026-07-04).
- Implementation language (C++) — **not domain** → adjacent `language-cpp` (routed 2026-07-04).
- Cyber-operations C2 & Electronic Warfare (U006) — **own domain/stack, not C4ISR-COP domain** → adjacent `domain-cyber-ops` / `stack-ew` (routed 2026-07-04).
- ML/inference engines & predictive models (behind U002) — **not domain** → adjacent stack/ML; only the recommendation *capability + UX* is domain.

## Adjacent pack candidates (other axes seen — Phase B2)
| Candidate id | Exists? | Outcome | Evidence |
|--------------|---------|---------|----------|
| stack-cot-tak | no | proposed, not built this pass | ATAK/FreeTAKServer CoT transport |
| stack-dds | no | proposed, not built this pass | pub/sub SA middleware |
| stack-geospatial | no | proposed, not built this pass | map rendering engines |
| stack-fmv-decode | no | proposed, not built this pass | FMV codec/MISB transport |
| platform-tactical-edge | no | proposed, not built this pass | rugged/edge SoC+MCU deployment |
| language-cpp | yes | route via `add rule to pack language-cpp` when a real C4I C++ source is scanned | common C4I implementation language |
| core-security | yes (core) | route crypto/accreditation primitives to core, not pack | classification/crypto is cross-cutting |
| domain-cyber-ops | no | proposed (U006) — cyber-ops C2 is its own domain | ecosystem bundles cyber with C4ISR |
| stack-ew | no | proposed (U006) — electronic-warfare processing | ecosystem bundles EW with C4ISR |
| stack-ml (inference) | no | proposed (behind U002) — decision-support models/engines | AI/ML repeatedly cited across C4ISR vendors |

## Next iteration hints
- Re-check ATAK-CIV / FreeTAKServer releases (~6 months) and **verify licenses** before any code reuse.
- Open adjacent candidates to consider building next: `stack-cot-tak`, `platform-tactical-edge`, `domain-cyber-ops`.
- **Deepen the site-scan breadth signals with real depth** (they are marketing-level): U001 all-domain → JADC2 reference/doctrine scan; U003 ISR PED → STANAG collection-management / intel-cycle standards scan.
- Deferred backlog: U004 (commander roll-up UX), U005 (unmanned-systems C2 in COP).
- Enrich `reference-architecture.md` from a concrete open C2 app via `repo=<app> pack=domain-c4i`.
