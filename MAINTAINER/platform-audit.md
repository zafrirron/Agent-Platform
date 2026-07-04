# Mode 1 — Internal Platform Audit

> **This is the INTERNAL audit** — checks consistency and quality of existing rules.
> For web ecosystem updates, use: `Read MAINTAINER/web-audit.md and execute it.`

> Load with maintainer agent: `Read MAINTAINER/platform-maintainer-agent.md`
> Then: `Read MAINTAINER/platform-audit.md and execute it.`

Produces a full capability matrix, identifies gaps, flags weak rules, and checks for duplicates.
All findings use Mode 1 commands to fix: `"add rule to <expert>: <rule>"` etc.

---

## Before you start

```
Read MAINTAINER/scan-results/registry.md
Read MAINTAINER/scan-results/REPORT-SCHEMA.md
```

---

## Steps

### Step 1 — Expert capability matrix

Read every file in `AGENT-PLATFORM-TEMPLATES/.agent/agents/`.

Produce a table with one row per expert:

| Expert | Domain | Rule count | Rules summary | Done-when items | Gaps flagged |
|--------|--------|-----------|--------------|-----------------|-------------|

Flag as **undertrained** if:
- Fewer than 5 rules in the PLATFORM section
- No done-when checklist
- No "before any task" reading list

### Step 2 — Playbook step matrix

Read every file in `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/`.

Produce a table:

| Playbook | Trigger | Step count | Hard quality gates | Weak steps | Expert assignments |
|---------|---------|-----------|-------------------|-----------|-------------------|

Flag as **weak** if:
- Any step has no verifiable outcome ("test the code" with no specific requirement)
- No hard quality gate that blocks progress
- No expert assignments on domain-specific steps

### Step 3 — Cross-file duplicate check

Search for rules that appear in multiple files. Common candidates:
- "no secrets in source" — appears in Security, DevOps, CONVENTIONS — is it consistent?
- "parameterised queries" — should be in Backend, Data, Security
- "update CURRENT.md" — should be universal, not repeated per expert

Report: rule text | files it appears in | consistent or contradictory

### Step 4 — Coverage gap analysis

Check which of these common failure categories have NO rule covering them:

| Failure category | Covered by | Gap? |
|-----------------|-----------|------|
| SQL injection | | |
| Broken object-level auth | | |
| Sensitive data exposure | | |
| Missing rate limiting | | |
| Regression test quality | | |
| API contract drift | | |
| Deployment with red tests | | |
| Secrets in CI config | | |
| Missing migration rollback | | |
| Unbounded database queries | | |

### Step 5 — Rule quality check

For each rule in the PLATFORM sections, evaluate:
- **Specific?** Can an agent know with certainty whether it has followed this rule?
- **Verifiable?** Can the user confirm it was followed without asking the agent?
- **Traceable?** Does `MAINTAINER/platform-improvements.md` have an entry explaining what failure this rule prevents?

Flag any rule that fails the specificity or verifiability check.

### Step 6 — Documentation & presentation sync check

Verify that user-facing documentation and the product presentation reflect the platform's actual current state.

**Check each of the following:**

| Document | What to verify |
|----------|---------------|
| `README.md` — "What you get" table | Every capability row matches a real feature. No rows for removed features. New features since last release have a row. |
| `AGENT-PLATFORM-FRAMEWORK-README.md` — capability table | Same as README — in sync with actual installed capabilities |
| `.agent/PLATFORM-HELP.md` | Sections match actual platform features. No references to deprecated commands. All playbook names current. |
| `.agent/QUICK-REF.md` | Playbook list matches actual playbooks in `.agent/playbooks/`. Expert list matches actual agents. |
| `presentation/agent-platform-beta.html` | Slide count, feature claims, and version badge match current release. No slides describing removed features. Key new features have representation. |
| `CHANGELOG.md` | Top entry version matches `package.json` version (or is the next planned version). |
| Agent `.manifest.json` files | All `capabilities` arrays reflect rules in the corresponding `.md` file. No stale or missing capabilities. |

**Flag as OUT OF SYNC if:**
- A capability mentioned in docs/presentation doesn't exist in the installed files
- A significant feature added in recent releases has no doc coverage
- The presentation version badge doesn't match the latest release
- A manifest lists capabilities not found in the agent's PLATFORM section

### Step 6b — Pack-health check (language / stack / platform / domain packs)

If `AGENT-PLATFORM-MANIFEST.json` has a `packs_catalog`, audit each pack under `.agent/packs/*` across all four kinds — `language:*`, `stack:*`, `platform:*`, `domain:*` (independent of core — packs never block a core release, but staleness/drift should be surfaced). Also flag any *gap* — a language/stack/platform/domain the platform should cover but has no pack yet → recommend authoring one via `Mode 2 build-pack=<id>` (greenfield web-wide ecosystem scan):

| Check | Flag if… |
|-------|----------|
| **Staleness** | `pack.json.last_verified` older than ~6 months → recommend a `Mode 2 pack=<id>` freshness pass or `Mode 4 repo=… pack=<id>` refresh |
| **Missing pack (coverage gap)** | a common language/stack/platform/domain in consumer repos has no pack → recommend `Mode 2 build-pack=<id>` to author one from scratch |
| **Overlay ↔ routing drift** | an overlay in `provides.agent_overlays` has no matching `routing.md` row (or vice-versa); overlay references an expert id that doesn't exist |
| **Missing files** | any path in `provides.references` / `agent_overlays` / `routing_rows` not present on disk |
| **Reference sources (domain)** | `reference_sources[]` missing `license`, or a URL that 404s / repo archived → flag for re-source |
| **Manifest registration** | a pack file on disk not registered in `files[]` as `kind:"pack"`, or a `packs_catalog` id with no `pack.json` |
| **Provenance** | a domain pack whose sources aren't reflected in `docs/INTELLIGENCE-SOURCES.md` |

Report pack findings with a `PK` sub-list (e.g. `PK-stack-react-01: last_verified 8 months old`). These are advisory — do not gate core work on them.

### Step 7 — Report

Produce:
1. Summary: X experts audited, Y playbooks audited, Z doc/presentation checks, P packs health-checked
2. Undertrained experts list (if any)
3. Weak playbooks list (if any)
4. Duplicate rules that need consolidation (if any)
5. Gap list — failure categories with no coverage
6. Rule quality issues — vague or unverifiable rules
7. **Documentation sync issues** — features in docs not in platform, or features in platform not in docs
8. **Presentation sync issues** — slides that need updating
9. **Pack-health issues** — stale packs (`last_verified`), overlay/routing drift, dead `reference_sources`, unregistered pack files (advisory)
10. Recommended next improvements (priority-ordered)

### Step 8 — Archive and registry

1. Write `MAINTAINER/scan-results/internal/YYYY-MM-DD-report.md` per `REPORT-SCHEMA.md` (use P-prefix for findings)
2. Prepend summary to `MAINTAINER/scan-results/registry.md`
3. If fixes applied: run **PSG**
