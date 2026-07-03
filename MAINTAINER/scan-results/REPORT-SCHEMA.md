# Scan report schema — all maintainer modes

Every scan **must** produce an archive file and update `registry.md`. Use this schema so the next scan can parse findings and skip completed work.

---

## Required sections (every mode)

```markdown
# [Mode name] Report — YYYY-MM-DD

## Meta
- **Mode:** internal | web-audit | ingest | mode4
- **Scan scope:** discovery | targeted | **pack** *(targeted = single `repo=owner/name`; pack = `pack=<id>` grows a language/stack/platform/domain pack brain — mode4, web-audit, or ingest)*
- **Pack:** <id> *(pack scope only)*
- **Trigger:** [command user ran]
- **Target repo:** owner/name *(targeted / pack mode4 only)*
- **Queries / sources:** [list — vary from previous run; use `N/A (targeted)` when repo= set]
- **Platform version:** [bootstrap_version at scan time]
- **Prior registry read:** YYYY-MM-DD entries skipped because already dispositioned

## Summary
| Metric | Count |
|--------|------:|
| Findings total | |
| Implemented | |
| Skipped | |
| Deferred | |
| COVERED (no finding) | |

## Findings
[Full entries — use mode-specific ID prefix]

## COVERED
[Capabilities already in platform — prevents re-finding]

## Actions taken (post-selection)
| ID | Action | Target files | Version / notes |

## Next scan
- **Queries to rotate:** …
- **Repos/skills to re-check after 6 months:** …
- **Do not re-propose:** [IDs marked Implemented]
```

---

## Finding entry format (by mode)

| Mode | ID | Extra fields |
|------|-----|--------------|
| Internal audit | P001 | Expert/playbook, weakness type |
| Web audit | F001 / E001 | Source URL, impact, proposed rule |
| Ingest | I001 | Submission file, classification NEW/ENHANCE/DUP |
| Mode 4 | R001 | Source repo URL, effort, impact, classification FEATURE/STRENGTHEN/ARCHITECTURE; targeted scans add **Recommended adoption** table |

**Mode 4 targeted archive path:** `mode4/YYYY-MM-DD-targeted-<repo-slug>-report.md`
**Pack-scoped archive path:** `mode4/YYYY-MM-DD-pack-<id>-<repo-slug>-report.md`, `web-audit/YYYY-MM-DD-pack-<id>-report.md`, or `ingest/YYYY-MM-DD-pack-<id>-report.md`. Pack findings' **Suggested path** points at `.agent/packs/<id>/…` (overlay / references / `reference_sources`), never core. Ingest pack findings carry status **PACK-CANDIDATE**.

Each finding **must** include disposition after maintainer selects:

`Pending` | `Implemented` | `Skipped` | `Deferred` | `Roadmapped`

---

## Registry update (mandatory after every scan)

1. Write full report → `MAINTAINER/scan-results/{mode}/YYYY-MM-DD-report.md`
2. Prepend summary block to `MAINTAINER/scan-results/registry.md` (Quick index + detail entry)
3. Update mode-specific log if applicable (`governance-scan/scan-log.md` for Mode 4)
4. Log implemented items in `platform-improvements.md`
5. If implementations shipped: run **PSG** + CHANGELOG `[Unreleased]`

---

## Before you start any scan

```
Read MAINTAINER/scan-results/registry.md
Read MAINTAINER/scan-results/REPORT-SCHEMA.md
```

Skip re-analysing repos/findings marked **Implemented** or **Skipped** within 6 months unless upstream changed materially.
