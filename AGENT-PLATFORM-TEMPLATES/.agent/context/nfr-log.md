# Non-functional requirements log — {{PROJECT_NAME}}

> Living register of measurable quality requirements (ISO 25010 / 14-category model).
> Every NFR must have: **threshold**, **measurement method**, **verification path**.
> Architect maintains this file; feature playbooks reference it at design gate.

## How to use

- **Before significant features:** confirm relevant NFR rows apply; add rows for new quality targets.
- **At design gate:** cite NFR IDs in acceptance criteria (e.g. `NFR-P01`).
- **At release / production-readiness:** every `Priority: P0` row must be verified or explicitly deferred with user approval.

## Priority key

| Priority | Meaning |
|----------|---------|
| **P0** | Blocks production deploy if unverified |
| **P1** | Must be verified before next major release |
| **P2** | Backlog / best-effort |

## NFR register

| ID | Category | Requirement | Threshold | Measure | Verify | Priority | Owner | Status |
|----|----------|-------------|-----------|---------|--------|----------|-------|--------|
| *(none yet)* | | | | | | | | |

### Category reference (14-category model)

1. Performance · 2. Scalability · 3. Availability · 4. Reliability · 5. Security · 6. Compliance · 7. Usability · 8. Maintainability · 9. Portability · 10. Interoperability · 11. Recoverability · 12. Observability · 13. Cost efficiency · 14. Developer productivity

## Example rows (delete when real NFRs are added)

```
| NFR-P01 | Performance | API read latency | p95 < 250 ms under 500 RPS | APM or k6 on staging | load test in CI on release candidate | P0 | Backend | proposed |
| NFR-A01 | Availability | Uptime | 99.9% monthly | uptime monitor | SLA dashboard + incident log | P1 | DevOps | proposed |
| NFR-O01 | Observability | Request tracing | 100% of API requests have correlation ID in logs | grep sample + log schema review | production-readiness checklist | P0 | DevOps | proposed |
| NFR-U01 | Usability | Accessibility | WCAG 2.2 AA on public UI | axe-core + manual keyboard pass | accessibility-audit playbook | P1 | Frontend | proposed |
| NFR-C01 | Compliance | Vulnerability remediation SLA | Critical CVE ≤ 7 days; High ≤ 30 days to patch or mitigated | CI audit + known-issues.md ages | compliance-review + production-readiness 6b | P0 | Security | proposed |
| NFR-C02 | Compliance | Change authorization evidence | 100% prod changes have PR + green CI | git log + CI status API | compliance-evidence-log CE-SOC-01 | P1 | DevOps | proposed |
| NFR-DP01 | Developer productivity | Change failure rate (DORA) | < 15% of deploys cause P0/P1 incident | incident-log.md ÷ deploy count | org-maturity-assessment quarterly | P1 | DevOps | proposed |
| NFR-DP02 | Developer productivity | Failed deployment recovery (DORA MTTR) | p50 < 60 min for change-related incidents | incident-log.md MTTR column | incident-postmortem + maturity assessment | P1 | DevOps | proposed |
| NFR-DP03 | Developer productivity | Deployment frequency (DORA) | ≥ 1 production deploy per 2 weeks | deploy log / CI history | org-maturity-assessment | P2 | DevOps | proposed |
| NFR-DP04 | Developer productivity | Lead time for changes (DORA) | p50 < 24 h commit → production | git + deploy timestamps | org-maturity-assessment | P2 | DevOps | proposed |
```
