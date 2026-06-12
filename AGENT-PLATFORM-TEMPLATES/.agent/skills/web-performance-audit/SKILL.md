---
name: web-performance-audit
description: Core Web Vitals and API latency audit with Quick/Deep modes. Metric-honesty rule — report measured values only. Use for /webperf.
attribution: Inspired by addyosmani/agent-skills web-performance-auditor (MIT)
---

## Overview

Measure-first performance audit — UI (LCP/INP/CLS) and/or API latency. No optimisation without baseline.

## When to use

- User types `/webperf` or asks for CWV / Lighthouse / performance audit
- Suspected frontend regression or slow API hot path
- Before claiming a perf fix is done

## Modes

| Mode | When | Scope |
|------|------|-------|
| **Quick** | Single page or one endpoint | Lighthouse or DevTools snapshot + one API smoke timing |
| **Deep** | Release gate or repeated complaints | Full CWV pass, bundle analysis, p95 on hot paths, compare to `nfr-log.md` |

Ask user if unclear: *"Quick snapshot or deep audit?"*

## Process

1. **Scope** — page URL(s), route(s), or API endpoints under test.
2. **Baseline** — capture **measured** metrics before any code change:
   - UI: LCP, INP, CLS (Lighthouse, DevTools Performance, or RUM if available)
   - API: p50/p95 on identified hot path (APM, `curl` timing, or load smoke)
3. **Metric honesty** — report only numbers from tools; if a metric cannot be measured, say `NOT MEASURED` — never invent targets met.
4. **Compare** — defaults unless `nfr-log.md` overrides: **LCP ≤ 2.5s**, **INP ≤ 200ms**, **CLS ≤ 0.1**; API targets from NFR rows if present.
5. **Findings** — list regressions with evidence (screenshot path, trace link, timing log).
6. **Fix path** — if gaps found: load `.agent/playbooks/performance-budget.md` (full profile) or apply `.agent/references/performance-checklist.md` slices; involve `frontend-agent.md` / `backend-agent.md` as needed.
7. **Verify** — re-measure after changes; diff before/after in handoff.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Feels fast" | Step 2 requires tool output — feelings are not metrics. |
| "Lighthouse once is enough" | Deep mode needs hot-path API timing too if backend involved. |
| "Close enough to target" | Report actual vs threshold; user decides accept or fix. |

## Verification

- [ ] Baseline captured with tool names and timestamps
- [ ] Every cited metric has a measured value or `NOT MEASURED`
- [ ] Regressions linked to specific routes/assets/queries
- [ ] Re-measure after fixes if implementation was in scope
