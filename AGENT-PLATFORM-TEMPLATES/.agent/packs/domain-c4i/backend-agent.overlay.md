# C2 / C4ISR overlay — backend-agent

> Active only when `domain-c4i` is in `active_packs`. Read **after** `backend-agent.md`.
> Scope: **C2 information model & capability services** — the meaning and lifecycle of C2 data. Serialization/transport (CoT/DDS) is a stack concern.

## Hard rules (C2 information & services)

- **Explicit C2 information model.** Represent the domain entities — units/assets, tracks, tasks/orders, plans, areas/geometries, events — with explicit identity, position (datum), and time. Model semantics first; wire format later (adjacent stack pack).
- **Track management.** Correlate and de-duplicate entity reports into stable tracks; keep track identity across updates; expose confidence/uncertainty and source. Never silently merge conflicting reports — surface the conflict.
- **Tasking/orders lifecycle.** Tasks and orders have an explicit state machine (proposed → tasked → acknowledged → in-progress → complete/aborted) with attribution and timestamps at each transition.
- **ISR collection & PED.** Model **collection management** (requirement → sensor/collection tasking → coverage/gap tracking, reusing the tasking lifecycle) and the **PED workflow** (Processing → Exploitation → Dissemination) that produces **intelligence products** disseminated with releasability/marking. Collected reports feed correlation/fusion and the COP; sensor hardware and exploitation algorithms are adjacent — the workflow, products, and their semantics are yours.
- **AI/decision-support outputs are provenanced data.** Any predictive/AI-derived item (projected track, suggested COA, anomaly) is stored as a **recommendation** with confidence, provenance, and the inputs it used — never as ground truth and never auto-applied. The model must let a human accept/reject/override, and record who decided (attribution). Inference engines/models are adjacent (stack/ML).
- **Freshness & uncertainty are data.** Every entity/track carries age and, where relevant, positional/identity uncertainty — so the UI can show staleness and confidence (never present stale/uncertain data as fresh/certain).
- **Entity report semantics (validated against Cursor-on-Target).** A situational-awareness report has: a **persistent `uid`** (same entity keeps its id across all reports — correlation depends on this); an explicit **`time` (generated) + `start`/`stale` validity window**; a **type taxonomy**; a location with error estimates (`ce`/`le`); and a **quality/source hint** (`how`). **When now > `stale`, stop displaying the entity or drop its confidence** — do not let a far-future stale time linger a dead track on the COP indefinitely. A sharing/`access` marker (security level + intended audience) travels with the report → feeds releasability (see `security-agent.overlay.md`). *The CoT wire format itself is adjacent (`stack-cot-tak`); these are the **semantics** your model must honor regardless of format.*
- **Idempotent, ordered updates.** Situational-awareness updates may arrive out of order or duplicated (DIL). Apply idempotently and resolve by authoritative timestamp; last-writer-wins only with explicit rules.
- **Replay integrity.** Persist enough event history to reconstruct the COP at any past time (after-action). Attribution (who/what/when) on every state-changing operation.
- **Track↔video reconciliation.** When a sensor/video feed reports geo-metadata, it must reconcile to the same track/place the COP holds (single truth across map and video).

## Review lens
- Entities without explicit datum/time/identity.
- Track updates that overwrite without correlation/conflict handling.
- Tasking flows with no explicit state machine or attribution.
- Stale/uncertain data exposed as fresh/certain.
- Update handlers that break on out-of-order/duplicate delivery.
