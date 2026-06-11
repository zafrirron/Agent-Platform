# Incident log — {{PROJECT_NAME}}

> Production and staging incidents affecting users or SLOs. Feeds DORA MTTR / change-failure tracking and compliance evidence.
> DevOps owns this file; `incident-postmortem` playbook appends rows.

## Severity key

| Severity | Definition |
|----------|------------|
| **P0** | Complete outage or data loss |
| **P1** | Major feature degraded; no workaround |
| **P2** | Partial degradation; workaround exists |
| **P3** | Minor; no user impact |

## Incident register

| ID | Date (UTC) | Severity | Summary | Detected | Mitigated | Resolved | MTTR | Change-related? | Postmortem | Status |
|----|------------|----------|---------|----------|-----------|----------|------|-----------------|------------|--------|
| *(none yet)* | | | | | | | | | | |

**MTTR** = minutes from `Detected` to `Resolved` (or `Mitigated` if service restored before root fix).

**Change-related?** = `yes` if incident followed a deploy within 24h (counts toward DORA change failure rate).

## DORA rollup (update quarterly or at `org-maturity-assessment`)

| Metric | Formula | Current period | Target (from nfr-log) |
|--------|---------|----------------|-------------------------|
| Change failure rate | change-related P0/P1 incidents ÷ production deploys | — | `NFR-DP01` |
| Failed deployment recovery | median MTTR for change-related incidents | — | `NFR-DP02` |
| Deployment frequency | deploys per week (production) | — | optional `NFR-DP03` |
| Lead time for changes | commit → prod deploy median hours | — | optional `NFR-DP04` |

## Example row (delete when real incidents logged)

```
| INC-001 | 2026-06-01 | P1 | 5xx spike after v1.2.0 deploy | 2026-06-01T14:00Z | 2026-06-01T14:22Z | 2026-06-01T15:10Z | 70 min | yes | `.agent/context/postmortems/INC-001.md` | closed |
```
