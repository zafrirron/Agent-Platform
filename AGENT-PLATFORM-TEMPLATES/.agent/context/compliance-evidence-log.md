# Compliance evidence log — {{PROJECT_NAME}}

> Maps SDLC artifacts to compliance control objectives (SOC 2, ISO 27001 Annex A, GDPR where applicable).
> Security and DevOps maintain this file; `compliance-review` and `production-readiness` verify P0 rows.
> **Auditor rule:** evidence must be system-generated or traceable — policy text alone is not evidence.

## How to use

- **Before compliance review:** read all rows; mark `Last verified` and `Status`.
- **At production-readiness:** every **P0** evidence row must be `verified` or user-approved `deferred`.
- **After incidents:** update `incident-log.md` and link postmortem evidence rows here.

## Status key

| Status | Meaning |
|--------|---------|
| `verified` | Evidence exists at `Location` and was checked this cycle |
| `gap` | Control applies but evidence missing or stale |
| `deferred` | User-approved skip with reason in `Notes` |
| `n/a` | Control not in scope for this project |

## Evidence register

| ID | Framework | Control | Evidence required | Location / source | Retention | Owner | Last verified | Status |
|----|-----------|---------|-------------------|-------------------|-----------|-------|---------------|--------|
| *(none yet)* | | | | | | | | |

### Control reference (common SDLC mappings)

| ID prefix | Framework | Typical control | Platform artifact |
|-----------|-----------|-----------------|-------------------|
| `CE-SOC-*` | SOC 2 TSC | CC8.1 Change management | PR history, CI logs, `CURRENT.md`, release tags |
| `CE-SOC-*` | SOC 2 TSC | CC7.1 Vulnerability mgmt | `npm audit` / CI scan results, `known-issues.md` |
| `CE-ISO-*` | ISO 27001 | A.8.25 Secure SDLC | Security gate, `security-audit.md` output |
| `CE-ISO-*` | ISO 27001 | A.8.32 Change management | `release.md` + rollback doc in `WORKFLOWS.md` |
| `CE-ISO-*` | ISO 27001 | A.8.28 Component security | SBOM, dependency lock files, CVE scan in CI |
| `CE-GDPR-*` | GDPR | Art. 32 Security of processing | Encryption, access control, breach procedure (PROJECT) |

## Example rows (delete when real evidence is registered)

```
| CE-SOC-01 | SOC 2 | CC8.1 — changes authorized | PR reviews + green CI before merge | GitHub PR list / git log main | 12 months | DevOps | *(date)* | proposed |
| CE-SOC-02 | SOC 2 | CC7.1 — vulnerability remediation | No Critical CVEs open > 7 days | CI audit artifact + known-issues.md | 12 months | Security | *(date)* | proposed |
| CE-ISO-01 | ISO 27001 | A.8.25 — secure SDLC | Security gate on auth/API changes | CURRENT.md Critic + security gate lines | 12 months | Security | *(date)* | proposed |
| CE-ISO-02 | ISO 27001 | A.8.32 — rollback tested | Documented rollback executed on staging | WORKFLOWS.md + release.md rollback step | 12 months | DevOps | *(date)* | proposed |
| CE-ISO-03 | ISO 27001 | A.8.28 — SBOM retained | CycloneDX/SPDX per release | CI artifact / releases page | 12 months | DevOps | *(date)* | proposed |
```

## Adding a row

```
| CE-{FRAME}-{nn} | SOC 2 / ISO 27001 / GDPR | {control ref} — {short name} | {what auditor samples} | {path, URL, or tool} | {retention period} | {Owner expert} | YYYY-MM-DD | proposed |
```
