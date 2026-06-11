# Playbook: Observability setup

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] Service or app has runnable entry point (API server, worker, or batch job)
- [ ] Read `.agent/context/nfr-log.md` — Observability category rows

## Steps

1. **Baseline audit** — what exists today?
   - Logging: format (JSON vs plain), levels, request correlation
   - Metrics: any RED metrics (rate, errors, duration)?
   - Traces: distributed tracing wired?
   - Health: `/health` or `/ready` endpoint?
   Document gaps in `CURRENT.md`.

2. **Structured logging** (Backend + DevOps)
   - JSON or key=value structured logs to stdout
   - **Correlation ID**: middleware propagates `X-Request-Id` or generates UUID; include in every log line for API services
   - No secrets, tokens, or full PII in logs — redact or hash

3. **Health checks**
   - Liveness: process up
   - Readiness: critical dependencies reachable (DB, cache) — return non-200 when not ready
   - Document paths in README and `api-contracts.md` if HTTP

4. **Metrics minimum** (DevOps)
   - Counters: request count, error count by status class
   - Histogram or summary: request duration (p50/p95 derivable)
   - Prefer OpenTelemetry, Prometheus client, or platform-native (CloudWatch, Datadog) — match PROJECT stack
   - Register SLI targets in `nfr-log.md` (e.g. `NFR-O01`)

5. **Alerting hooks** — document (even if manual for demo):
   - Elevated 5xx rate
   - Auth failure spike
   - Latency p95 breach vs `nfr-log.md`
   Note integration point (PagerDuty, email, log query) in README or `WORKFLOWS.md`

6. **Tests** — add smoke test for health endpoint; optional test that correlation ID appears in log output (mock/spy)

7. **Critic review** ← mandatory
   Load `critic-agent.md`. Scope: `[OPERABILITY] [SECURITY] [COMPLETENESS]`
   Output: `▶ Critic review — APPROVED` or findings line.
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`

8. **Handoff** — update `nfr-log.md` Observability rows to `verified` or `gap`. Do not run session-end.

## Rules
- Observability follows code — instrument real paths, not aspirational dashboards
- Full APM vendor choice is PROJECT-specific — playbook defines minimum bar, not vendor mandate
- Pair with `production-readiness.md` before first deploy
<!-- PLATFORM:END -->
