# Reference: Performance checklist

> Condensed from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) `references/performance-checklist.md` (MIT). Use with `performance-budget.md` and NFR-P* rows in `nfr-log.md`.

## Measure first
- [ ] Baseline captured before optimising (p50/p95 latency, throughput, bundle size)
- [ ] Target tied to `nfr-log.md` ID — not "make it faster"

## Frontend (when UI changed)
- [ ] LCP, INP, CLS targets from NFR or project SLO documented
- [ ] Bundle size delta checked — no unbounded dependency growth
- [ ] Images/assets lazy-loaded or sized appropriately

## Backend / API
- [ ] List endpoints paginated — no unbounded queries
- [ ] N+1 queries eliminated (profile or log query count)
- [ ] Hot paths avoid synchronous external calls without timeout

## Anti-patterns (flag in Critic `[PERFORMANCE]`)
- Unbounded loops, recursion, or in-memory growth
- Missing pagination on collections
- Caching without invalidation strategy
- Optimising without measurement data

## Evidence
- Before/after metrics or profiler output cited in `CURRENT.md`
- NFR-P* row updated with verification path when threshold met
