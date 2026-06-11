# Playbook: Compliance review

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] User requested compliance audit, SOC 2 prep, ISO 27001 SDLC review, or GDPR technical check — not feature implementation
- [ ] Read `.agent/context/compliance-evidence-log.md` and `.agent/context/nfr-log.md` (Compliance + Security rows)
- [ ] Read `.agent/context/known-issues.md`

## Steps

1. **Scope declaration** — output immediately:
   `▶ Compliance review — scope: [SOC 2 TSC / ISO 27001 Annex A SDLC / GDPR Art. 32 / multi] · target: [whole repo / release candidate]`

2. **Framework selection** — confirm with user if unclear:
   - **SOC 2** — Trust Services Criteria CC6 (access), CC7 (vuln mgmt), CC8 (change mgmt); map to evidence log `CE-SOC-*`
   - **ISO 27001** — Annex A.8.25–A.8.33 secure development & change mgmt; map to `CE-ISO-*`
   - **GDPR** — technical measures Art. 32 (encryption, resilience, testing); PROJECT legal scope required

3. **SDLC control checklist** — assess each; record pass/gap/deferred:

   **Change management (CC8.1 / A.8.32)**
   - [ ] Production changes traceable to PR/commit with reviewer (not direct push to main)
   - [ ] CI required green before merge (branch protection or documented equivalent)
   - [ ] Rollback procedure documented and tested (`release.md`, `WORKFLOWS.md`)
   - [ ] Emergency change path documented if exists

   **Vulnerability management (CC7.1 / A.8.8)**
   - [ ] Dependency CVE scan in CI (`npm audit` / equivalent) — fails or flags High/Critical
   - [ ] Container image scan before prod if Docker used
   - [ ] Open Critical CVEs: none, or documented exception with expiry in `known-issues.md`
   - [ ] Remediation SLA row in `nfr-log.md` (`NFR-C01`) satisfied or proposed

   **Secure SDLC (A.8.25)**
   - [ ] Security gate on auth, endpoints, input-handling changes
   - [ ] Secrets scan clean; no tokens in source
   - [ ] Critic `[SECURITY]` on shipped application changes per platform gates

   **Evidence & retention (CC8.1 / A.8.32)**
   - [ ] `compliance-evidence-log.md` populated with real `Location` paths
   - [ ] SBOM generated per release (if DevOps rules apply)
   - [ ] `CURRENT.md` handoffs show gate execution (Critic, Security)

4. **Evidence gap table** — severity order:

   | Severity | Control | Gap | Remediation |
   | Critical | | | |
   | High | | | |
   | Medium | | | |

   **Critical** = would fail auditor sample (e.g. no PR review evidence, Critical CVE unpatched past SLA).
   **High** = control expected in scope but no artifact.

5. **Update registers**
   - Add or refresh rows in `compliance-evidence-log.md` with `Status` and `Last verified`
   - Add Compliance NFR rows to `nfr-log.md` if missing (`NFR-C01` vuln SLA minimum)
   - Log Critical/High gaps in `known-issues.md`

6. **Critic review** ← mandatory
   Load `critic-agent.md`. Scope: `[SECURITY] [COMPLETENESS] [OPERABILITY]`
   Output: `▶ Critic review — APPROVED` or findings line.
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`

7. **Report** — compliance summary:

   | Framework | Controls checked | Pass | Gap | Deferred |
   |-----------|------------------|------|-----|----------|
   | SOC 2 | | | | |
   | ISO 27001 | | | | |

   **Verdict:** `READY` (no Critical/High gaps) / `GAPS` (remediation required) / `OUT OF SCOPE` (document reason)

8. **Handoff** — tell user: *"Run `production-readiness` before go-live; re-run this playbook after remediation or quarterly."* Do not run session-end.

## Rules
- Review is read-only on application code unless user requests fixes
- Org-level controls (ISMS, HR access, physical security, vendor contracts) are **out of scope** — note as external dependencies
- Pair with `org-maturity-assessment.md` for quarterly process maturity + DORA KPI review
- Windows-safe git if committing evidence updates: separate shell commands, no `&&`
<!-- PLATFORM:END -->
