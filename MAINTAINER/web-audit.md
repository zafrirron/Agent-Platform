# Mode 2 — Web Ecosystem Audit

> **Trigger:** `Read MAINTAINER/web-audit.md and execute it.`
> **Trigger (pack-scoped refresh — freshen an *existing* pack):** `Read MAINTAINER/web-audit.md and execute it. pack=<pack-id>`
> **Trigger (pack ecosystem build — greenfield, web-wide scan to author a *new* pack brain):** `Read MAINTAINER/web-audit.md and execute it. build-pack=<pack-id>`
> **Requires:** Maintainer agent loaded — `Read MAINTAINER/platform-maintainer-agent.md`
> **Scope:** Security (OWASP, CVEs, CWEs) + Engineering best practices (stack-specific) + **Agent skill packs & playbook ecosystems**
> **Output:** Structured findings report → maintainer selects what to add

> **Default (no `pack=`):** stack-specific research is **generalized to universal** platform rules (the historical bar). Findings that are too stack/domain-narrow are skipped.
> **Pack-scoped (`pack=<id>`):** research targets one pack's technology/domain — keep the specificity and land it in the pack (see **Pack-scoped refresh** below).

---

## Before you start

```
Read MAINTAINER/scan-results/registry.md
Read MAINTAINER/scan-results/REPORT-SCHEMA.md
```

Skip F/E findings already **Implemented** or **Skipped**. Note prior **Next scan hints**.

Read the current state of all experts and conventions:
1. Read all files in `AGENT-PLATFORM-TEMPLATES/.agent/agents/`
2. Read all files in `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/`
3. Read `AGENT-PLATFORM-TEMPLATES/.agent/skills/*/SKILL.md` — lifecycle skill modules
4. Read `AGENT-PLATFORM-MANIFEST.json` — `skills_catalog`, profiles, slash commands
5. Read `MAINTAINER/ingest/agent-skills-p0-SOURCES.md` — already-ingested skill-pack patterns
6. Read `AGENT-PLATFORM-TEMPLATES/.agent/CONVENTIONS.md`
7. Build a mental map of what is already covered — you will need this to classify each finding as COVERED / PARTIALLY / NOT COVERED

---

## Phase 1 — Security sources

### 1A — OWASP

Fetch and analyse:
- `https://owasp.org/www-project-top-ten/` — OWASP Top 10 Web (current year)
- `https://owasp.org/API-Security/editions/2023/en/0x11-t10/` — OWASP API Security Top 10 2023
- `https://owasp.org/www-project-testing-guide/` — OWASP Testing Guide (latest key items)

For each item in OWASP Top 10 and API Security Top 10:
- Is it covered by an existing PLATFORM rule? (check security-agent.md, CONVENTIONS.md, backend-agent.md)
- If NOT COVERED or PARTIALLY COVERED: create a finding

### 1B — CWE Top 25

Fetch: `https://cwe.mitre.org/top25/archive/2024/2024_cwe_top25.html`

For each of the top 10 most dangerous (CWE-89, CWE-79, CWE-78, CWE-416, CWE-20, CWE-125, CWE-22, CWE-352, CWE-434, CWE-862):
- Is there a corresponding platform rule?
- If not: create a finding

### 1C — Recent CVE patterns

Search: `"common vulnerability pattern 2024 web application"`
Search: `"API security vulnerability 2024 best practices"`
Search: `"authentication bypass pattern 2024"`

Extract recurring vulnerability patterns (not specific CVEs, but classes of vulnerability). Create findings for any class not covered.

---

## Phase 2 — Engineering best practices

### 2A — Backend practices

Search: `"backend API best practices 2024 security"`
Search: `"REST API design best practices 2024"`
Search: `"microservices security checklist 2024"`

Look for: rate limiting patterns, idempotency requirements, pagination best practices, error response standards, correlation IDs, circuit breaker patterns.

Compare against backend-agent.md and api-patterns.md.

### 2B — Testing best practices

Search: `"software testing best practices 2024"`
Search: `"test quality metrics engineering 2024"`
Search: `"mutation testing property-based testing 2024"`

Look for: mutation testing, property-based testing, contract testing tools, snapshot testing dangers, test pyramid ratios.

Compare against test-agent.md and CONVENTIONS.md.

### 2C — DevOps / CI-CD practices

Search: `"CI CD security best practices 2024"`
Search: `"supply chain security software 2024"`
Search: `"container security checklist 2024"`

Look for: SBOM requirements, supply chain attacks, dependency pinning, container hardening, secrets rotation.

Compare against devops-agent.md.

### 2D — Data and migration practices

Search: `"database migration best practices 2024"`
Search: `"zero downtime migration patterns"`
Search: `"data pipeline reliability 2024"`

Compare against data-agent.md.

### 2E — Agentic development patterns

Search: `"agentic AI development best practices 2024"`
Search: `"LLM application security 2024"`
Search: `"prompt injection prevention 2024"`
Search: `"multi-agent system patterns 2024"`

Look for: prompt injection risks, LLM output validation, agent memory security, tool use safety, hallucination prevention in code generation.

Compare against ALL expert files — these are new patterns that may not be covered anywhere.

### 2F — Agent skill packs & playbook ecosystems *(required — monthly)*

> **Why this phase exists:** Popular skill packs (e.g. `addyosmani/agent-skills`) were missed by
> OWASP/best-practice searches and by governance-only GitHub scans. They encode workflow patterns,
> rationalization gates, and lifecycle commands — not CVE classes.

**GitHub / web searches (run ≥6, rotate each audit):**
- `"agent skills" "SKILL.md" GitHub [current year]`
- `"AI coding agent skills pack" site:github.com`
- `"claude code" marketplace skills plugin`
- `"cursor" agent skills rules workflow`
- `addyosmani agent-skills` *(baseline diff — always check README + skills/ index)*
- `"slash commands" "/spec" "/plan" agent development workflow"`
- `"rationalization" "red flags" agent skill workflow"`
- `"interview me" skill specification agent`
- `"test-driven development" skill agent Beyoncé DAMP`
- `"agent playbook" "quality gate" steps verification"`
- `"SKILL.md" frontmatter "Use when" agent`

**Seed repos — always fetch README + skills index (even if search rank is low):**
| Repo | Check for |
|------|-----------|
| `https://github.com/addyosmani/agent-skills` | New skills since last ingest; `/build auto`; hooks; plugin.json changes |
| `https://github.com/anthropics/skills` | Official Anthropic skill anatomy updates |
| Community packs surfaced by searches above | Novel workflow steps, checklists, command parity |

**For each candidate skill or playbook pattern found, compare against:**
- `.agent/skills/*/SKILL.md` — do we have an equivalent module?
- `.agent/playbooks/*.md` — is the workflow covered with same verification gates?
- `.agent/references/` — are checklists missing items?
- `.claude/commands/` + `.cursor/commands/` — lifecycle command parity
- `AGENT-PLATFORM-MANIFEST.json` `skills_catalog` — catalog gap?

**Create a finding when:**
- A skill pack teaches a **specific verifiable workflow** we lack (NOT COVERED)
- Our playbook/skill covers the topic but **weaker gates** (PARTIALLY COVERED — rationalization table, verification evidence, anti-skip rules)
- A **new distribution pattern** (plugin install, cherry-pick flag, IDE-specific setup) we don't document

**Finding target mapping:**
| Pattern type | Target |
|--------------|--------|
| Universal workflow step | Relevant `.agent/skills/*/SKILL.md` or playbook |
| Expert-specific rule inside a skill | Matching `*-agent.md` PLATFORM section |
| Reference checklist | `.agent/references/` |
| Slash command / lifecycle entry point | `.claude/commands/`, `.cursor/commands/`, manifest |
| Install/distribution UX | `docs/DISTRIBUTION.md`, `docs/cursor-setup.md`, `apply.js` |

**Do NOT create findings for:** skills already logged in `MAINTAINER/ingest/` as Done unless the upstream repo added **new** steps since ingest date.

---

## Phase 3 — Full Ecosystem Horizon Scan *(Option C — run only when scope=full)*

> Skip this phase for the default monthly audit.
> Run when maintainer says: `"Run full scope web audit"` or `"include horizon scan"`

### 3A — Emerging AI / Agentic patterns

Search: `"agentic AI engineering patterns [current year]"`
Search: `"multi-agent system architecture best practices [current year]"`
Search: `"LLM prompt injection attack patterns [current year]"`
Search: `"AI agent tool use security risks [current year]"`
Search: `"LLM application security checklist [current year]"`

Fetch top 5 results per query. Look for patterns that do NOT map to any existing expert rule. These are not gaps — they are new practices the community is developing.

### 3B — Developer community signals

Fetch: `https://news.ycombinator.com/best` (top 30 stories — filter to software engineering / security)
Search: `"software engineering emerging practice [current year]"`
Search: `"developer best practice changed [current year]"`

Look for recurring themes across multiple top posts — patterns the community is converging on that the platform does not yet encode.

### 3C — New tooling that changes best practices

Search: `"new developer security tooling [current year]"`
Search: `"deprecated security practice replaced [current year]"`
Search: `"SBOM software bill of materials requirements [current year]"`
Search: `"supply chain attack software [current year]"`

Look for: tools that make old patterns obsolete, new standards replacing old ones, practices that used to be optional and are now required.

### 3D — Conference and research findings

Search: `"OWASP AppSec [current year] new vulnerability class"`
Search: `"Black Hat [current year] web application new attack"`
Search: `"DEF CON [current year] software security finding"`
Search: `"arxiv agentic LLM security [current year]"`

**Agent skill-pack horizon (add to every scope=full run):**
Search: `"agent skills ecosystem [current year] trending"`
Search: `"AI agent workflow pack" "SKILL.md" [current year]"`
Search: `"claude code plugin marketplace skills [current year]"`
Fetch README or docs from top 3 GitHub results. Compare skill count and lifecycle coverage vs our manifest.

Look for: newly disclosed attack classes not yet reflected in OWASP top lists, academic research on AI/agent security that practitioners haven't encoded yet, **and skill packs gaining adoption faster than governance frameworks**.

> **Horizon scan findings** use the `E-prefix` (E001, E002...) and the `EMERGING PRACTICE` classification — see Phase 4.

---

## Phase 4 — Build the findings report

For each finding, create an entry using the format from `MAINTAINER/web-audit-report-template.md`.

### Classify each finding

| Classification | Meaning | Prefix |
|---------------|---------|--------|
| NOT COVERED | No existing PLATFORM rule addresses this | F |
| PARTIALLY COVERED | A related rule exists but is too vague or incomplete | F |
| CONTRADICTED | An existing rule conflicts with the finding | F |
| EMERGING PRACTICE | New pattern with no existing rule — practice itself is new, not a gap (Phase 3 only) | E |

Skip findings that are FULLY COVERED by an existing specific rule.

`F-prefixed` findings = gap analysis (Phases 1 + 2)
`E-prefixed` findings = horizon discoveries (Phase 3 only — scope=full)

### Assign impact

| Impact | Criteria |
|--------|---------|
| **High** | Directly prevents a security vulnerability or production failure |
| **Medium** | Improves reliability, testability, or reduces tech debt |
| **Low** | Stylistic improvement, minor optimisation, emerging practice |

### Assign target

For each finding, identify which expert file or playbook should receive the rule:
- Security vulnerability → security-agent.md
- API design → backend-agent.md + api-patterns.md
- Testing practice → test-agent.md + CONVENTIONS.md
- DevOps/CI → devops-agent.md
- Data/migration → data-agent.md
- Agentic patterns → applicable expert(s) + CONVENTIONS.md
- Skill-pack workflow / rationalization / lifecycle command → relevant `.agent/skills/`, playbook, or `docs/DISTRIBUTION.md`

---

## Pack-scoped refresh (`pack=<id>`)

When `pack=<id>` is set, this becomes a **freshness pass for one stack/domain pack** rather than a universal audit.

1. **Preconditions:** verify `<id>` exists in `packs_catalog`; read the pack (`.agent/packs/<id>/pack.json`, overlays, `references/*`, `routing.md`) and its `last_verified` date. **Read the per-pack ledger `MAINTAINER/scan-results/packs/<id>.md` first** — skip any source already consumed and any finding already `Adopted`/`Rejected` (classify new candidates NEW / ENHANCE / DUPLICATE / REJECTED-BEFORE).
2. **Research targeted at the pack's technology/domain:** e.g. framework major/minor changes and new pitfalls (React 19 idioms, Django release notes), or domain/compliance updates (PCI-DSS, HIPAA revisions) — sourced from official docs, OWASP, CWE, and release notes.
3. **Findings land in the pack** (non-universal bar): `Suggested path` points at `.agent/packs/<id>/references/…`, `<expert>.overlay.md`, or (domain) `reference-architecture.md`. Do **not** generalize into core. Off-axis discoveries → **Adjacent pack candidates** (Phase B2), never merged into this pack.
4. **On selection:** write to the pack, bump `pack.json` `version` + **`last_verified`**, keep `routing.md` consistent, run the **pack PSG lane** (see `platform-maintainer-agent.md` § PSG — pack lane), log provenance pack-tagged (`platform-improvements.md` + registry `Scope: pack` · `Pack: <id>`), and **append the new sources + dispositions to `MAINTAINER/scan-results/packs/<id>.md`**.
5. **Archive:** `MAINTAINER/scan-results/web-audit/YYYY-MM-DD-pack-<id>-report.md`.

Use this on a cadence to fight pack staleness (the `last_verified` signal surfaced by the internal audit).

---

## Pack ecosystem build scan (`build-pack=<id>`)

> **Greenfield.** Where `pack=<id>` *freshens* an existing pack from a repo/release, `build-pack=<id>` **authors a new pack brain from the whole ecosystem** — it casts a wide net across the web (standards, specs, reference apps, threat models, compliance, community know-how), not one repo. This is the answer to *"build a domain expert by scanning the domain's ecosystem, same for any axis."*
>
> **It does not require the pack to exist yet.** It ends by scaffolding + filling the pack, then running the PSG pack lane. It **never** auto-writes — the maintainer selects findings first.

### Phase A — Parse the target

From `build-pack=<id>` derive `kind` and `name` (`domain-drone-autonomy` → kind `domain`, name `drone-autonomy`). If ambiguous, ask the maintainer for `kind`. Read `.agent/packs/README.md` (pack model) and `MAINTAINER/adr/ADR-001-stack-domain-packs.md` (design bar). If the id already exists in `packs_catalog`, stop and tell the maintainer to use `pack=<id>` (freshness) instead.

**Read the dedup memory first (mandatory):**
- `MAINTAINER/scan-results/packs/README.md` — the per-pack ledger schema.
- `MAINTAINER/scan-results/packs/<id>.md` — this pack's ledger, **if it exists** (a prior aborted build or a re-run). It records every source already consumed and every finding disposition (`Adopted` / `Rejected` / `Deferred`) + a **Do-not-re-propose** list. Skip re-surfacing anything already `Adopted` or `Rejected` there — exactly like `registry.md` for core scans.
- `MAINTAINER/scan-results/registry.md` — cross-mode context.

### Phase B — Ecosystem discovery (axis-aware source matrix)

Run a **wide** discovery keyed to the pack `kind` (≥6 searches, rotate; fetch top results; capture URL + license for every source):

| Kind | Source classes to scan |
|------|------------------------|
| **domain** | standards bodies & official specs; **reference OSS applications** (for the reference architecture); domain threat models / attack surfaces; compliance & regulatory frameworks; canonical papers/textbooks; active communities (forums, RFCs). *(drone-autonomy → PX4/ArduPilot/MAVLink specs, DO-178C/DO-278A, airspace regs, perception/planning literature, OSS autopilots.)* |
| **stack** | official framework docs; release notes & migration guides; RFCs/design docs; top libraries in the ecosystem; community "pitfalls/gotchas" write-ups; perf/benchmark reports. |
| **platform** | vendor docs & datasheets; SoC/board reference manuals; SDK/driver/BSP docs; OS/RTOS docs; cross-compile toolchain guides; real-time/power/memory budget references. |
| **language** | the language specification; official style guides; footgun/anti-pattern catalogs; memory/concurrency model docs; idiomatic-code references. |

For each source, classify what it contributes: **rule/pitfall** (→ overlay), **architecture pattern** (→ reference-architecture), or **linkable source app/spec** (→ `reference_sources[]`).

### Phase B2 — Cross-axis signal capture (keep axes orthogonal)

A real ecosystem scan on one axis **always** surfaces signals belonging to *other* axes — a `domain` scan reveals the language it's written in, the platform/hardware it targets, and the stacks it builds on. **Do not bake these into the primary pack** (that duplicates knowledge and breaks reusability — a C++ rule found while scanning drones belongs in `language-cpp`, not `domain-drone-autonomy`). Instead, **capture them separately** as *adjacent pack candidates*.

While running Phase B, whenever a source implies a different axis, record it in a side list keyed by axis:

| Off-axis signal seen | Belongs in kind | Action to recommend |
|----------------------|-----------------|---------------------|
| A programming language's own footguns/idioms | `language` | route to existing `language-<x>` (`add rule to pack`) **or** `build-pack=language-<x>` if none |
| A hardware/board/SoC/OS/RTOS/runtime constraint | `platform` | `build-pack=platform-<x>` (usually new) |
| A framework/library idiom or pitfall | `stack` | route to existing `stack-<x>` **or** `build-pack=stack-<x>` |
| Another business domain overlapping this one | `domain` | separate `build-pack=domain-<x>` (do not merge) |

For each candidate record: the off-axis `id`, whether a matching pack **already exists** in `packs_catalog` (→ route) or not (→ spin off), the evidence (source URL), and a one-line rationale. **These are proposals only** — the primary build never creates a second pack automatically. They surface in the report's **Adjacent pack candidates** section (Phase E) so the maintainer can chain a follow-up `build-pack=` or `add rule to pack`. The primary pack merely **references** them (e.g. a domain reference-architecture cites the platform/stack), it does not copy their rules.

### Phase C — License & provenance triage

Deduplicate across sources. Tag each candidate source app with its license and mark **reusable** vs **study-only (copyleft)** — distilled patterns are fine, copied code is not (mirror the `domain-fintech` `reference_sources[]` notes). Drop anything unreachable or unverifiable.

### Phase D — Synthesize a candidate pack brain (in the report, not on disk yet)

Roll findings into the proposed pack contents:
- `<expert>-agent.overlay.md` (or shared `code.overlay.md` for `language`) — distilled hard rules, review lens, version/config awareness.
- `references/reference-architecture.md` (domain/platform) — cross-component design citing the discovered real apps.
- `references/<topic>-pitfalls.md` — failure catalog.
- `pack.json` draft — `kind`, `detect{}` (axis-appropriate signals), `provides{}`, and for domain `reference_sources[]`.

### Phase E — Present findings → maintainer selects

Present using the standard report format (findings prefixed, impact-rated, each with source URL). Reuse the Phase 5 selection UX (`Add F001…`, `Skip`, `Defer`, `Modify`, `Explain`). **Write nothing until the maintainer selects.**

Classify every primary-axis finding against the pack ledger read in Phase A: **NEW** (not in ledger) · **ENHANCE** (strengthens an `Adopted` item) · **DUPLICATE** (already `Adopted`, drop) · **REJECTED-BEFORE** (in the Do-not-re-propose list — only re-raise with the prior reason quoted). This is the pack-scoped mirror of the base platform's `registry.md` dedup.

The report **must** end with an **Adjacent pack candidates** section (from Phase B2), separate from the primary findings:

```
━━━ Adjacent pack candidates (other axes discovered during this scan) ━━━
  ▸ language-cpp     EXISTS  → route: "add rule to pack language-cpp: …"   (evidence: <url>)
  ▸ platform-jetson-orin  NEW → spin off: build-pack=platform-jetson-orin   (evidence: <url>)
  ▸ stack-ros2       NEW → spin off: build-pack=stack-ros2                  (evidence: <url>)
  These are proposals. The current build touches ONLY <primary-id>.
  Chain a follow-up build-pack= / add-rule-to-pack, or say "skip adjacents".
```

### Phase F — Scaffold, fill, validate

On selection:
1. Run the Mode 1 **`add pack <id>`** scaffold (`platform-maintainer-agent.md` § "add pack <id>").
2. Write the selected synthesized files into `.agent/packs/<id>/`.
3. Set `pack.json` `version` `1.0.0`, `last_verified` = today, `confidence` `curated`.
4. Run **PSG — pack lane** (manifest registration, references reachable, pack test, provenance in `platform-improvements.md` + `docs/INTELLIGENCE-SOURCES.md` for domain + scan registry `Scope: pack`).
5. **Write the dedup ledger** `MAINTAINER/scan-results/packs/<id>.md` (schema: `MAINTAINER/scan-results/packs/README.md`): every source consumed (URL + license + date), every finding disposition (`Adopted`→file / `Rejected`→reason / `Deferred`), and the **Do-not-re-propose** list. Also record the **Adjacent pack candidates** and whether each was chained, routed, or skipped.
6. **Archive:** `MAINTAINER/scan-results/web-audit/YYYY-MM-DD-build-pack-<id>-report.md`.

> Lifecycle: **`build-pack=<id>` (greenfield, web-wide)** → `pack=<id>` (freshness) → Mode 4 `repo=… pack=<id>` (deep-dive one find) → Mode 3 `pack=<id>` (user field rules). All four write via the pack mechanics and the PSG pack lane, and **all four read + update the per-pack ledger** (`packs/<id>.md`) so no source or finding is ever processed twice.

---

## Phase 5 — Present report and wait for selection

Output the complete findings report using the format from `MAINTAINER/web-audit-report-template.md`.

If scope=full was run, the report has two sections:
- **F-findings** (gap analysis from Phases 1+2) — normal findings
- **E-findings** (horizon scan from Phase 3) — these offer an additional action: `"Create new expert for [domain]"` if the practice is broad enough to warrant a whole new expert

After the report, output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Audit complete: X gap findings (F001-Fxxx) + Y horizon findings (E001-Exxx)
  High: N  ·  Medium: N  ·  Low: N

  To implement findings, tell me:
  • "Add F001, F003" — add specific gap findings
  • "Add E002" — add an emerging practice finding
  • "Add all High" — add all High impact findings
  • "Modify F002 to: [new text]" — add with your modification
  • "Skip F005" — mark as reviewed, don't add
  • "Defer F007" — add to improvement backlog
  • "Explain F003" — fetch more context from source
  • "Create new expert from E001" — scaffold a new expert for an emerging domain
  • "Skip all" — log all as reviewed, nothing added
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Do NOT implement anything until maintainer explicitly selects.**

---

## Phase 6 — Implement selections

For each finding the maintainer selects to add:

1. Run the Mode 1 `add-rule` workflow (duplicate check → format → write → log)
2. Source URL must be recorded in `platform-improvements.md`
3. Rule text must be adapted to platform standard (specific + verifiable + action verb)

For skipped findings:
- Log in `MAINTAINER/platform-improvements.md` backlog section: "Reviewed [date] — skipped: [reason if given]"

For deferred findings:
- Add to `MAINTAINER/platform-improvements.md` backlog section with the proposed rule text

After all selections processed:
- If any findings were implemented: execute **Platform Sync Gate (PSG)** — `MAINTAINER/platform-maintainer-agent.md` § Platform Sync Gate (manifests, user docs, presentation, E2E, CHANGELOG `[Unreleased]`, `npm test`)
- Do **not** tell the maintainer to "also update docs/manifests" — PSG is automatic
- Output **PSG Report** + summary: "X rules added, Y skipped, Z deferred."
- Say `"Release"` only when the maintainer wants a version tag — not as part of audit completion

---

## Phase 7 — Archive and log

After Phase 5 presentation (and Phase 6 if selections made):

1. **Write archive:** `MAINTAINER/scan-results/web-audit/YYYY-MM-DD-report.md` per `REPORT-SCHEMA.md`
2. **Update registry:** Prepend to `MAINTAINER/scan-results/registry.md` — findings table, dispositions, actions taken, next scan hints
3. **Implementation log:** Append to report's **Actions taken** section; log in `platform-improvements.md`
4. If implemented: run **PSG** before marking complete

---

## Recommended audit schedule

| Frequency | Command | Phases |
|-----------|---------|--------|
| Monthly | `Read MAINTAINER/web-audit.md and execute it.` | 1 + 2 incl. **2F** (Option B) |
| Quarterly | `Read MAINTAINER/web-audit.md and execute it. scope=full` | 1 + 2 incl. **2F** + 3 (Option C) |
| Quarterly | `Read MAINTAINER/github-governance-scan.md and execute it.` | Mode 4 — coordination **+ skill packs** |
| After OWASP update | `Read MAINTAINER/web-audit.md and execute it.` phase=1 | Phase 1 only |
| After production incident | Mode 1 targeted addition (immediate) | N/A |
| After major framework release | `Read MAINTAINER/web-audit.md and execute it.` phase=2E | Phase 2E only |
| After skill-pack release (e.g. agent-skills v0.7+) | `Read MAINTAINER/web-audit.md and execute it.` phase=2F | Phase 2F only — diff against ingest log |
