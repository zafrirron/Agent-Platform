# C2 / C4ISR — domain capabilities (application layer)

> The capability catalog for the C2/C4ISR **domain**: what the application does and the information it reasons about. Strictly application-level — no transport, middleware, rendering engine, codec, hardware, or language here (those are adjacent packs).

## 1. Common operating picture (COP)
Single correlated truth shared across surfaces (map, tables, video overlays). Focus-plus-context; detail-on-demand; consistent object→action model.

## 2. C2 information model
Entities: units/assets, tracks, tasks/orders, plans, geometries/areas, events. Each has identity, position (explicit datum), and time. Semantics defined independently of any wire format.

## 3. Track management
Correlation and de-duplication of reports into stable tracks; persistent track identity across updates; confidence/uncertainty and source retained; conflicting reports surfaced, not silently merged.

## 4. Tasking & orders
Explicit lifecycle (proposed → tasked → acknowledged → in-progress → complete/aborted); attribution and timestamp on every transition; orders traceable to plans and to executing assets.

## 5. Planning & courses of action (COA)
Author/compare plans and COAs against the COP; overlays for phases, boundaries, control measures; branch/sequel awareness. (Analytics/optimizers, if any, are adjacent.)

## 6. Sensor & report fusion (capability)
Ingest heterogeneous reports/observations, associate to entities, expose fused state with provenance and confidence. (Fusion *algorithms/libraries* are a stack concern; the *capability and its data contract* are domain.)

## 7. Freshness & uncertainty
Age/staleness and positional/identity uncertainty are first-class attributes on every entity/track, so the app can represent "how old / how sure".

## 8. Alerting & decision support
Rule/threshold-based alerts on COP state (proximity, geofence breach, staleness, status change); prioritized, deduplicated, acknowledgeable; decision aids surface *why* an alert fired.

## 9. Multi-echelon information sharing & releasability
Information flows across roles/echelons/coalitions with releasability, caveats, and need-to-know filtering built into the model; default-deny.

## 10. After-action replay & audit
Reconstruct/replay COP state over any past interval; every state-changing action attributed and audit-logged.

## 11. Collaboration, chat & voice (in-context)
Operator-to-operator collaboration anchored to COP objects (chat/annotations/voice tied to a track/area/task), so communication carries situational context; shared markups converge to COP truth.

## 12. Mission data & data packages
Import/export mission data, overlays, and route/geometry packages between operators/systems; validated and marking-aware on import/export.

## 13. Full-motion video integration (capability)
Video feeds as first-class COP citizens correlated to what they observe; geo-registered sensor metadata; slew-to-cue and click-in-video→map. Full UX in `c4i-video.md`. (Codec/transport = adjacent `stack-fmv-decode`.)

## 14. Geospatial operator capability
North-up/track-up, 2D/3D, multiple grid/coordinate systems (MGRS/UTM/lat-long) with explicit readout format, measurement, layered overlays, declutter/clustering. (Rendering engine = adjacent `stack-geospatial`.)

## 15. All-domain / multi-domain C2
The COP and information model are **domain-partitioned** — land, air, maritime (surface/subsurface), **space**, and **cyber** — and support **joint / all-domain** operations (JADC2-style) where a single picture and tasking flow span domains. Entities carry their domain (it also drives symbology battle-dimension); operators filter and fuse by domain; cross-domain coordination is an explicit, releasability-aware capability, not a side effect. Coalition/joint interoperability is by **versioned exchange contract** (see architect overlay), never point-to-point coupling.

## 16. Predictive decision support (AI-assisted, human-on-the-loop)
Beyond threshold alerts (§8), the app surfaces **anticipatory / predictive** aids — projected tracks, likely COAs, anomaly flags — as **recommendations, not actions**. Every AI-derived item carries **provenance, confidence, and the inputs it used**, is **explainable**, and keeps a **human on/in the loop**: the system never auto-executes a restricted or lethal decision. Operators can accept/reject/override, and the decision is attributed (§10). *The ML models/inference engines are adjacent (stack/ML); the capability, its data contract, and its UX are domain.*

## 17. ISR collection management & PED
The "ISR" half of C4ISR: **collection management** (requirements → sensor/collection tasking → coverage/gap tracking) and the **PED workflow** (Processing → Exploitation → Dissemination) that turns raw sensor output into **intelligence products** disseminated with releasability/marking (§9). Tasking here reuses the orders lifecycle (§4); collected reports feed fusion (§6) and the COP (§1). Sensor hardware and exploitation algorithms are adjacent; the **collection/PED workflow, products, and their information semantics** are domain.

---

### Adjacent (NOT this pack — tracked as candidates)
`stack-cot-tak` (CoT/TAK transport) · `stack-dds` (pub/sub middleware) · `stack-geospatial` (map rendering) · `stack-fmv-decode` (video codec/transport) · `platform-tactical-edge` (edge HW/OS) · `language-cpp` · `core-security` (crypto/accreditation primitives) · **`domain-cyber-ops`** (cyber-operations C2 — its own domain) · **`stack-ew`** (electronic-warfare processing) · **ML/inference engine** for §16 (stack).
