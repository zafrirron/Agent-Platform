# Playbook: Performance budget

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] Feature or endpoint scope is identified (new or changed hot path)
- [ ] Read `.agent/context/nfr-log.md` — extend Performance rows if empty

## Steps

1. **Define budget** — with user, set measurable targets and record in `nfr-log.md`:
   - API: p50/p95 latency, max RPS, max payload size
   - UI: LCP / INP / CLS or task-completion time (if frontend)
   - Data: max rows per query, query timeout, index requirements
   Each row: threshold · measure (APM, k6, Lighthouse) · verify path · Priority

2. **Design check** — before code, confirm approach meets budget:
   - List endpoints: pagination required? Caching layer? Async job for heavy work?
   - Unbounded loops, full-table scans, or sync external calls on hot path → redesign or user-approved exception

3. **Implement** — load relevant expert (`backend-agent.md` / `frontend-agent.md` / `data-agent.md`). Apply pagination, indexes, memoisation per budget.

4. **Verify** — Test agent:
   - Run `{{TEST_RUNNER}}` (must stay green)
   - Add or run a **budget check**: smoke load (e.g. 50 concurrent requests), or document why N/A for trivial change
   - Compare result to `nfr-log.md` threshold — pass or log gap in `CURRENT.md`

4b. **Measure-first (UI / CWV)** — when frontend changed:
   - **Profile before optimising** — no guessing; capture baseline (Lighthouse, DevTools Performance, or APM)
   - Default targets unless `nfr-log.md` overrides: **LCP ≤ 2.5s**, **INP ≤ 200ms**, **CLS ≤ 0.1**
   - Bundle analysis for new deps — flag regressions in `CURRENT.md`
   - See `.agent/references/performance-checklist.md`

5. **Critic review** ← mandatory
   Load `critic-agent.md`. Scope: `[PERFORMANCE] [CORRECTNESS] [TEST] [DESIGN]`
   Output: `▶ Critic review — APPROVED` or findings line.
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`

6. **Handoff** — update `CURRENT.md` with NFR IDs verified. Do not run session-end.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "It feels fast enough" | Step 1 requires numbers in `nfr-log.md` — feelings are not budgets. |
| "Optimise without measuring" | Step 4b: baseline required before UI perf changes. |
| "Skip load test — small app" | Step 4 smoke load or documented N/A — unbounded assumptions fail in production. |

## Rules
- Budget without numbers is invalid — reject "make it fast"
- If budget cannot be met: DEFER to user with tradeoff options (scale hardware, reduce scope, async)
- Incident/debug of existing slowness → use `debug-pipeline.md` instead
<!-- PLATFORM:END -->
