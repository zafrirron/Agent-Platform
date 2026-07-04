# Per-pack dedup ledgers

> Maintainer-only. One file per pack: `MAINTAINER/scan-results/packs/<pack-id>.md`.
> This is the **pack-scoped mirror of `../registry.md`** — it stops any source or finding
> from being processed twice across iterations (`build-pack=` → `pack=` → `repo=…pack=` →
> Mode 3 ingest `pack=`). Every pack-scoped scan **reads this file first** and **updates it
> after**. These files are **not shipped** to consumer repos (rejected findings and reasons
> must never leak into installed packs; consumer-facing provenance lives in the pack's own
> `pack.json.reference_sources[]` + `attribution` and in `docs/INTELLIGENCE-SOURCES.md`).

## Why this exists

The base platform's four modes dedup beautifully via `registry.md` + the NEW / ENHANCE /
DUPLICATE / COVERED classification + "Do not re-propose" lists. Packs need the same memory
at pack granularity, otherwise a second iteration (new source, re-scan, user submission) can
re-surface something already adopted **or something the maintainer deliberately rejected**.

## Read-first / write-after contract

- **Read first (every pack-scoped scan):** load `packs/<id>.md`. Skip sources in **Sources
  consumed**. Classify each new candidate against **Findings**:
  - **NEW** — not present → propose.
  - **ENHANCE** — strengthens an `Adopted` finding → propose as an enhancement.
  - **DUPLICATE** — already `Adopted` → drop silently.
  - **REJECTED-BEFORE** — in **Do-not-re-propose** → only re-raise if materially changed, and quote the prior reason.
- **Write after (on any selection):** append new sources, set dispositions, refresh the
  Do-not-re-propose list, and record adjacent-pack candidate outcomes.

## Ledger format

```markdown
# Pack ledger — <pack-id>

**Kind:** language | stack | platform | domain
**Created:** YYYY-MM-DD (build-pack)   **Last updated:** YYYY-MM-DD
**Pack version at last update:** X.Y.Z

## Sources consumed
| Date | Source (URL) | License | Scan | Contribution | Disposition |
|------|--------------|---------|------|--------------|-------------|
| 2026-07-04 | https://… | Apache-2.0 | build-pack | rule/pitfall | Adopted → security-agent.overlay.md |
| 2026-07-04 | https://… | AGPL-3.0 | build-pack | reference app | Adopted → reference_sources[] (study-only) |

## Findings
| ID | Summary | Class | Disposition | Landed in |
|----|---------|-------|-------------|-----------|
| B001 | … | NEW | Adopted | references/<topic>.md |
| B002 | … | NEW | Rejected | (see Do-not-re-propose) |
| B003 | … | NEW | Deferred | backlog |

## Do-not-re-propose
- B002 — <reason it was rejected> (rejected 2026-07-04)

## Adjacent pack candidates (other axes seen)
| Candidate id | Exists? | Outcome | Evidence |
|--------------|---------|---------|----------|
| language-cpp | yes | routed via add-rule | https://… |
| platform-jetson-orin | no | chained build-pack (pending) | https://… |
| stack-ros2 | no | skipped this pass | https://… |

## Next iteration hints
- Sources/releases to re-check after ~6 months: …
- Adjacent candidates still open: …
```

New ledgers prepend nothing — they are per-pack, edited in place.
