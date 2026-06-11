# Playbook: Production readiness review (PRR)

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] Feature set is functionally complete for the target release
- [ ] `{{TEST_RUNNER}}` green; `{{COVERAGE_CMD}}` meets `{{COVERAGE_THRESHOLD}}` or gap documented
- [ ] Read `.agent/context/nfr-log.md` — all **P0** NFRs must be verified or user-approved deferral
- [ ] Read `.agent/context/compliance-evidence-log.md` — all **P0** evidence rows verified or deferred

## Steps

1. **NFR verification** — for each P0 row in `nfr-log.md`: confirm threshold, measurement, and verification path are satisfied. Log pass/fail per ID in `CURRENT.md`.

1b. **Compliance evidence** — for each P0 row in `compliance-evidence-log.md`:
   - Evidence exists at stated `Location` (PR logs, CI artifacts, SBOM, scan reports)
   - `Last verified` within retention window or refreshed this PRR
   - If gaps: run `.agent/playbooks/compliance-review.md` or document user-approved deferral in `CURRENT.md`

2. **Security gate** ← mandatory
   Load `security-agent.md`. Run targeted review on all code changed since last release tag.
   Output: `▶ Security gate — production readiness review [files]`
   **BLOCKED if:** any Critical or High finding.

3. **Observability minimum bar** (DevOps + Backend)
   - If not yet instrumented: run `.agent/playbooks/observability-setup.md` first or verify equivalent in place
   - Structured logs (no secrets/PII); correlation ID on API requests where applicable
   - Health/readiness endpoint or equivalent process check documented
   - Error rate and latency measurable (APM, metrics, or log-derived)
   - Alerting path documented for auth failures and 5xx spikes (even if "manual log review" for demos)

4. **Recoverability** — document or verify: backup strategy, rollback procedure (`release.md` rollback step), RTO/RPO if stated in `nfr-log.md` (note N/A if in-memory demo).

5. **Operational docs** — README or runbook covers: how to start, env vars, deploy steps, known limits.

6. **Container / deploy hardening** (if Docker/K8s used)
   - Non-root user, pinned base image, no secrets in image layers
   - Image vulnerability scan run or noted why skipped

6b. **Supply chain & vuln SLA** (DevOps + Security)
   - Dependency CVE scan: zero open **Critical**; High CVEs patched or documented exception with expiry
   - `NFR-C01` remediation SLA satisfied (default: Critical ≤ 7 days, High ≤ 30 days — adjust per `nfr-log.md`)
   - SBOM retained for this release (CycloneDX/SPDX in CI artifact or release notes) — or N/A (library-only)
   - Signed artifacts per `devops-agent.md` if release build applies

6c. **Change management evidence** (DevOps)
   - This release's changes traceable: git log since last tag + PR/review reference (ticket ID or reviewer in merge commit)
   - Rollback procedure from `release.md` documented and **tested on staging** since last major release — or user confirms tested this cycle
   - No undeclared direct-to-production pushes (pipeline-only deploy)

7. **Critic review** ← mandatory
   Load `critic-agent.md`. Scope: `[SECURITY] [CORRECTNESS] [TEST] [COMPLETENESS] [PERFORMANCE] [DEPENDENCY]`
   Output: `▶ Critic review — APPROVED` or findings line.
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`

8. **Verdict** — output PRR summary table:

   | Area | Status |
   |------|--------|
   | P0 NFRs | pass / fail / deferred |
   | Compliance evidence | pass / gap / deferred |
   | Security | pass / blocked |
   | Vuln SLA & SBOM | pass / gap / N/A |
   | Change mgmt evidence | pass / gap |
   | Observability | pass / gap |
   | Recoverability | pass / N/A |
   | Tests & coverage | pass / fail |

   **BLOCKED:** Do not recommend production deploy if any P0 NFR fails, P0 compliance evidence is `gap`, Critical CVE open past SLA, tests red, or Critic reports Critical/High.

9. **Handoff** — update `CURRENT.md`. User must confirm deploy explicitly. Do not run session-end.

## Rules
- This playbook reviews readiness — it does not execute production deploy unless user explicitly requests after PRR pass
- Pair with `release.md` for version tag; PRR is the gate *before* go-live
- Windows-safe git if committing release artifacts: separate shell commands, no `&&`
<!-- PLATFORM:END -->
