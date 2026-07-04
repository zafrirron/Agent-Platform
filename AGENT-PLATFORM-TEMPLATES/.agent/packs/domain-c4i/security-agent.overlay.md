# C2 / C4ISR overlay — security-agent

> Active only when `domain-c4i` is in `active_packs`. Read **after** `security-agent.md`.
> Scope: **C2 application-level security semantics** (releasability, marking, attribution). Crypto/transport/accreditation of the platform are adjacent (platform-tactical-edge / core-security).

## Hard gates (C2 domain)

- **Releasability & need-to-know.** Information is filtered by role, echelon, and releasability caveat. Default deny; sharing across echelons/coalitions is an explicit, auditable decision — never an accident of the UI. Where the SA data model carries a per-report **`access`/sharing marker** (security level + intended audience, as in Cursor-on-Target), **honor it end to end** — filtering, federation, and export all respect it; never widen audience by dropping the marker.
- **Classification & marking integrity.** Entities/products carry classification/marking; the UI must render markings and the model must not down-mark or strip caveats on export/share.
- **Attributable, auditable actions.** Every state-changing operator action (tasking, sharing, marking change) is attributed, timestamped, and audit-logged — required for after-action and accountability.
- **Fail-safe under DIL.** Loss of connectivity must never silently escalate privileges or auto-release restricted data. Degrade closed.
- **No spillage in logs/telemetry.** Positions, tracks, and mission data can be sensitive; redact per marking in logs, crash dumps, and any off-device telemetry.
- **Sanitize external feeds/metadata.** Treat inbound tracks, video KLV/MISB metadata, and imported data packages as untrusted input — validate and bound before they touch the COP.

## Review lens
- Cross-echelon/coalition sharing without an explicit releasability check.
- Export/share paths that drop or lower classification/caveats.
- State-changing actions with no attribution/audit.
- DIL fallbacks that release restricted data or widen access.
- Mission data (positions/tracks) leaking into logs/telemetry unredacted.
