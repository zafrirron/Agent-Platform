# C2 / C4ISR — operator cognition & interaction design (application layer)

> Human-factors depth for C2 operator applications: how to design for a stressed, time-pressured operator managing asynchronous, semi-autonomous systems. This is **domain UI/UX** — pairs with `c4i-ux.md` (layout/symbology/map/video). Ingested from an internal C2 engineering submission (2026-07-04). Rendering tech is adjacent (`stack-geospatial`).

## Situation Awareness (SA) pipeline — design to all three levels
Endsley's SA model. Every component should support:
- **Perception** — the operator can *see* the relevant data (salient, uncluttered, legible).
- **Comprehension** — the operator *understands its meaning* (context, relationships, status).
- **Projection** — the operator can *predict future state* (trends, closure, time-to-event).
A view that shows raw data but not meaning or projection has failed at SA even if it's "pretty."

## Cognitive load
- **Widget/data-group limit:** cap a single view at **~5–7 widgets or data groups**. Beyond that, split views or use progressive disclosure — data overload destroys SA.
- **Reduce working memory:** surface what the operator would otherwise have to remember (recent actions, current mode, pending tasks).

## Alert design — fight habituation & alert fatigue
- **Routine blends, critical breaks focus.** Routine/nominal updates must be quiet and peripheral; only genuinely critical alerts may actively seize attention (temporary, major visual change).
- **Avoid tunnel vision & fatigue.** Don't cry wolf — if everything alarms, operators habituate and miss the real one. Prioritize, deduplicate, and rate-limit (pairs with the alerting capability in `c4i-capabilities.md` §8).
- Every alert is acknowledgeable and explains *why it fired*.

## Interaction design — Fitts' Law (both directions)
- **Forward (efficiency for good actions):** enlarge the clickable target (**~2–3× normal**) for critical, time-sensitive controls and place them **close to the primary viewing area** to minimize travel/time.
- **Reverse (friction for dangerous actions):** for destructive/irreversible actions (abort, delete, exit, shutdown), **increase difficulty** — smaller targets, placed away from the normal workflow, or behind a secondary menu/guard — to prevent accidental activation.

## Stress & single-tasking workflows
- **Single-task under stress.** Humans can't effectively multitask under pressure — break complex operations into **linear, wizard-like sequences**, one decision at a time.
- **Sensible defaults.** Pre-fill forms/entries with the most likely value to cut working-memory and input load (operator confirms/adjusts rather than authoring from scratch).
- **Interruption management.** When a high-priority alert interrupts a task, **save the in-flight task state** so the operator can resume gracefully afterward — never silently discard half-finished work. (Distinct from saved *layouts* in `c4i-ux.md`; this is per-task state.)

## Forgiveness & transparency
- **Forgiveness.** Errors are inevitable under stress — provide **reversible actions (Undo)** and require **explicit confirmation** for actions with severe, unnoticed, or tangential consequences.
- **Neutral destructive choices.** For serious actions (e.g. "Shut Down System"), standard green/red conflicts with psychological expectation and invites reflexive clicks — use **neutral colours (grey/black/white)** so the operator must *read the text* before acting.
- **Agent/autonomy transparency.** When the system acts or recommends autonomously, show the **reasoning and confidence level** and keep the operator on/in the loop (pairs with predictive decision support, `c4i-capabilities.md` §16).

## Implementation patterns (application layer)
- **Separate domain state from UI state.** Keep backend/domain state (tracks, tasks, entities) strictly separate from UI state (active tab, modal visibility, selection) so degraded data never corrupts the picture and UI churn never mutates the mission model.
- **Graceful degradation — never fake "normal".** On dropped streams/missing sensor data, show a clear, obvious *missing/offline* signal. The operator must never mistake an offline sensor for a nominal, all-clear state.
- **UX-enforcing components.** Build reusable components that *bake in* these rules — e.g. `CriticalAlertButton` (Fitts-forward + neutral destructive + confirm), `StatusBadge` (dual-coded, freshness-aware), `DualCodedIcon` (colour + shape/text). This makes the correct behaviour the default, not a per-screen decision.

## Related
- Layout / zones / symbology / map / video → `c4i-ux.md`
- Capabilities (alerting §8, all-domain §15, decision support §16) → `c4i-capabilities.md`
- Always-on hard rules → `frontend-agent.overlay.md`
