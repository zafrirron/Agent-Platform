# C2 / C4ISR overlay — architect-agent

> Active only when `domain-c4i` is in `active_packs`. Read **after** `architect-agent.md`.
> Scope: **system-of-systems architecture for C2 applications** at the capability level. Concrete middleware/transport/hardware choices belong to adjacent stack/platform packs.

## Hard rules (C2 system architecture)

- **DIL-tolerant by design.** Assume Disconnected, Intermittent, Limited-bandwidth links. Operator capability must degrade gracefully, not fail: offline-first state, store-and-forward, conflict resolution on reconnect. Availability under DIL is a *requirement*, not a nice-to-have.
- **Single source of COP truth.** The common operating picture is one logical, correlated truth; every surface (map, tables, video overlays) derives from it. No divergent per-panel state.
- **Time & geo are first-class invariants.** Every entity carries an explicit position (with datum) and timestamp/staleness. Never mix datums or assume local time; use a single reference frame and convert at the edges.
- **Interoperability by contract.** Cross-system information exchange is via an explicit, versioned model (see `references/c4i-capabilities.md` — C2 information model). Do not couple to another system's internals; the wire format/middleware is a stack concern (stack-cot-tak / stack-dds).
- **Multi-echelon information sharing.** Design for information flowing across echelons/roles with releasability and filtering built into the model, not bolted on.
- **All-domain by default.** Partition the model by operational domain (land / air / maritime surface+subsurface / space / cyber) and design for **joint / all-domain (JADC2-style)** operation — one correlated picture and tasking flow spanning domains. Entities carry their domain; cross-domain coordination is explicit and releasability-aware; joint/coalition interop is by versioned exchange contract, never point-to-point coupling. Do **not** hard-wire a single-domain (ground-only) COP.
- **Replay & attribution as architecture.** State changes are event-sourced enough to reconstruct and replay the COP over time (after-action). Attribution/timestamps are non-negotiable.
- **Multi-display & performance.** Support multi-monitor/video-wall layouts and high entity counts without UI stalls; heavy rendering is offloaded (engine = stack-geospatial) but the architecture must keep the COP responsive under load.

## Review lens
- A design that assumes always-on connectivity.
- Per-panel state that can diverge from the COP truth.
- Implicit datum/time assumptions; mixed reference frames.
- Point-to-point coupling to another system's internals instead of a versioned exchange model.
- No ability to reconstruct/replay historical COP state.
