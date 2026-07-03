# Changelog

All notable changes to **Agent Platform Bootstrap** are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Fixed
- **Pack detection false positive — `stack-react` proposed for every Node repo** — `stack-react`'s `detect` listed the generic `package.json` as a file signal, and `detectPacks` treats signals as match-any, so any project with a `package.json` (e.g. a plain Express API) was wrongly offered the React pack. Removed the `package.json` signal; React now detects via its `react`/`react-dom` **dependency** or `**/*.tsx`/`**/*.jsx` **globs**. Also made `detectPacks` actually **honour `globs`** (previously declared in the catalog but silently ignored — bounded, path-based scan reusing the extension walk) and removed the unused fuzzy `keywords` field from `domain-fintech` (it was never evaluated; `stripe`/`plaid`/… deps remain the trigger). +2 regression tests (245 total): a non-React Node project must not suggest `stack-react`; a `.jsx` file must suggest it via glob.

---

## [2.44.0] — 2026-07-03

### Changed
- **Packs promoted to a headline, first-class product capability across user-facing surfaces** — the packs layer is now highly visible to potential users instead of a mid-doc section. `README.md` gains packs in the **"What it is" hero** + a jump-link; both presentation decks (`agent-platform-beta.html`, `team-adoption.html`) get a **hero Packs badge** and a **dedicated Packs slide** (4 axes — language/stack/domain shipping + `platform` labelled *Roadmap*); `AGENT-PLATFORM-FRAMEWORK-README.md` gains a full **"Language, technology-stack & domain packs"** capability section + a "When to use what" row. Fixed stale beta-deck counts (tests → 243). Docs/presentation only; no template or behaviour change.
- **Mode 3 ingest → pack lane (maintainer-only)** — user submissions can now feed **pack brains**, not just core. `platform-ingest.md` gains a `pack=<id>` scope + a new **PACK-CANDIDATE** classification (a rule specific to a language/stack/platform/domain that maps to a pack, distinct from repo-tied PROJECT-SPECIFIC). PACK-CANDIDATE findings route to `.agent/packs/<id>/…` under the non-universal bar via the **PSG pack lane** (never blocks a core release), with pack-tagged provenance + registry `Scope: pack`. Dedup now also searches `.agent/packs/**`; new selection commands (`Add all packs`, `Add I003 to pack <id>`, `New pack from … as <id>`). Closes the last "how does each maintainer mode grow packs" gap (Modes 1/2/4 already had a pack path). Also updated `GUIDE.md`, `REPORT-SCHEMA.md`, `registry.md`, and the maintainer "grow packs" note. No consumer template/behavior change.
- **Packs model formalized to 4 axes — new `platform` kind (design only, no curated packs yet)** — added an execution/deployment-target axis alongside `language`/`stack`/`domain`. `platform` covers hardware (SoC/board/MCU), OS/RTOS + drivers/toolchains, and container/orchestration runtime (Docker, k8s) — distinct from `stack` (an app framework built in a language) because that knowledge is reusable across languages/frameworks/domains. Clarified that a `kind` does **not** restrict composition (a heterogeneous system, e.g. a drone's Linux SoC + MCU, activates several `platform` packs at once), so hardware and OS need not be separate kinds. Tightened the `stack` boundary: a *language* runtime (Node/JVM) stays with language/stack; a *container/OS* runtime is `platform`. Formalized in `ADR-001`, `platform-governance-roadmap.md`, the pack spec `.agent/packs/README.md`, and the maintainer `add pack platform-<name>` command. No consumer template/behavior change; end-user README/DISTRIBUTION/QUICK-REF/PLATFORM-HELP stay at the 3 shipping kinds, while the decks + FRAMEWORK-README show `platform` only as a labelled *Roadmap* teaser until curated `platform-*` packs ship.

### Added
- **Programming-language packs (Phase 2) — new `language` pack kind** — the `stack` axis is split so packs now span **three** orthogonal, composable kinds: `language:*`, `stack:*`, `domain:*`. A **language** pack is the language itself (reusable across every framework in it) and overlays *every* code-writing expert via one shared `code.overlay.md`; a **stack** pack is a framework/library *built in* a language and overlays one expert. No combo packs.
  - **v1 language packs** — `language-typescript`, `language-java`, `language-cpp` (shared code overlay + curated pitfalls reference + routing rows). Curated from the official language guidance (TS handbook / Effective Java / C++ Core Guidelines) + failure-derived platform pitfalls.
  - **Extension-based detection** — `detect.extensions` (e.g. `.cpp`, `.ts`, `.java`) is now honoured by the installer via a bounded, shallow source scan, so language-only repos with no dependency manifest (e.g. a C++ project with just `*.cpp`/`*.hpp`) are still suggested. Marker files (`tsconfig.json`, `pom.xml`, `CMakeLists.txt`) also detect.
  - **Overlay loader made map-driven** — the routed expert's overlay is resolved from `pack.json` → `provides.agent_overlays[<expert>]` (not a hardcoded filename), so a language pack can map several experts to one shared file. Wired in `AGENTS.md` Step 3b, `AGENTS-lite.md`, `session-start-shared.md`, `using-platform`.
  - Docs/presentation updated to the three-kind model: README, `docs/DISTRIBUTION.md`, QUICK-REF (+lite), PLATFORM-HELP, `.agent/packs/README.md`, ADR-001, both presentation decks. Manifest `packs_catalog` + `kind:"pack"` files for the 3 language packs. 8 new tests (243 total).
- **Packs maintainer growth loop (Phase 3, maintainer-only)** — how the platform *grows* stack/domain pack brains over time. `github-governance-scan.md` (Mode 4) gains `repo=owner/name pack=<id>` (deep-read a repo/app → land findings in the pack's overlay/references + `reference_sources`, non-universal bar); `web-audit.md` (Mode 2) gains a `pack=<id>` freshness pass; `platform-maintainer-agent.md` gains `add pack <id>` / `add rule to pack <id>` commands + a **PSG pack lane** (packs versioned/tested independently — never block a core release); `platform-audit.md` gains a Step 6b pack-health check (stale `last_verified`, overlay/routing drift, dead `reference_sources`); registry + REPORT-SCHEMA gain `Scope: pack`. No consumer-facing template change.
- **Technology-stack & domain Packs layer (Phase 1)** — opt-in overlays that add curated stack/domain knowledge on top of the agnostic core, without modifying it. Design: `MAINTAINER/adr/ADR-001-stack-domain-packs.md`.
  - **Two orthogonal kinds** — `stack:*` (React, Django) and `domain:*` (fintech); composable, no combo packs.
  - **Overlay model** — packs refine generic experts via `<expert>.overlay.md` read only when the pack is active (`.agent/platform.json` → `active_packs`); core files untouched; zero cost when none active.
  - **Opt-in install** — packs never install by profile; only via `--mode=add --add=pack:<id>`. New `--mode=list --list=packs`. **Detect-and-suggest** at install/upgrade (never auto-installs).
  - **v1 packs** — `stack-react`, `stack-django`, `domain-fintech` (overlays + curated references + routing).
  - **Domain reference architectures** — domain packs carry `reference_sources` (real source-app repos, license-aware) and a `reference-architecture.md`; user can ask *"reference architecture for a fintech app"* → agent surfaces the distilled architecture + linked repos.
  - Wired into `AGENTS.md` (routing Step 3b + reference-architecture row), `AGENTS-lite.md`, `session-start-shared.md`, and `using-platform` skill.
  - Docs: `docs/DISTRIBUTION.md`, README, QUICK-REF (+lite), PLATFORM-HELP, presentation decks. Manifest `packs_catalog` + `kind:"pack"` files. 15 new tests incl. detect-and-suggest proposal (235 total); E2E Phase 1p added.

---

## [2.43.0] — 2026-07-03

### Added
- **Mode 4 targeted repo scan** — `repo=owner/name` skips discovery/triage; deep-reads one GitHub repo for skills/workflow/platform adoption ideas + Recommended adoption table
- **`ux-research` optional skill** — user research / usability / journey mapping / a11y research (cherry-pick `--mode=add --add=skill:ux-research`); adapted from `gemini-agent-skills` ux-researcher (Mode 4 R013). Wired into `AGENTS.md` routing (user-research keywords → `ux-research`) and a formal Step 0 "behavior-gap gate" in `requirements-clarification` playbook
- **Gemini CLI interoperability docs** — `docs/DISTRIBUTION.md` section on copying platform skills to `.gemini/skills/` (Mode 4 R016)
- **Cross-IDE skills-path matrix** — `docs/DISTRIBUTION.md` "Portable skills" table for 8 hosts (Antigravity/Claude/Codex/Cursor/Gemini/Copilot/OpenCode/Windsurf) with project + global paths (Mode 4 R019)
- **Skill quality checklist** — authoring bar in `PLATFORM-HELP.md` (progressive disclosure, scoped tools, no absolute paths, keyworded description) (Mode 4 R020)
- **Skill-ingest security vetting** — user-facing checklist in `docs/DISTRIBUTION.md` + maintainer Step 1b quarantine gate in `MAINTAINER/platform-ingest.md` (prompt injection / tool poisoning / exfiltration screening) (Mode 4 R021)
- **`npx skills` installer interop** — DISTRIBUTION note that platform `SKILL.md` modules are consumable by the community `npx skills add` installer (Mode 4 R025)

### Changed
- **frontend-agent** — added "avoid the generic AI aesthetic" design principle (distinctive, production-grade UI without overriding accessibility) (Mode 4 R028)
- **Skill quality checklist** — added "verify before ship" (dry-run/subagent test a new skill before cataloguing) (Mode 4 R029)
- **code-simplification** — now proactive: added the "minimalism ladder" (need→reuse→stdlib→native→dep→one-line→minimum) + safety floor, plus an over-engineering **delete-list** review mode; `incremental-implementation` gains a pre-build minimalism gate (Mode 4 R031/R032, from ponytail)
- **Critic `[DESIGN]` dimension** — now explicitly flags over-engineering / premature abstraction with a delete-list (corrected stale "all nine" → "all ten" in critic prose) (Mode 4 R032)
- **Roadmap** — multi-agent coordination patterns backlog entry added to `platform-governance-roadmap.md` (Mode 4 R014; tied to external team-coordination server concept)

### Adopted from (brain sources this release)
This release's intelligence was sourced from targeted Mode 4 scans of these MIT-licensed repos — now catalogued in the new provenance ledger [`docs/INTELLIGENCE-SOURCES.md`](docs/INTELLIGENCE-SOURCES.md):
- [saeed-vayghan/gemini-agent-skills](https://github.com/saeed-vayghan/gemini-agent-skills) → `ux-research` skill, Gemini interop, coordination roadmap (R013/R016/R014)
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) → cross-IDE path matrix, skill quality bar, ingest security vetting (R019/R020/R021)
- [thedesignproject/agent-skills](https://github.com/thedesignproject/agent-skills) → `npx skills` interop, anti "AI aesthetic", verify-before-ship (R025/R028/R029)
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) → proactive minimalism ladder + over-engineering delete-list (R031/R032)
- **New:** [`docs/INTELLIGENCE-SOURCES.md`](docs/INTELLIGENCE-SOURCES.md) — provenance ledger of every open-source repo the platform has learned from + a README "Where the intelligence comes from" section

---

## [2.42.1] — 2026-06-09

### Fixed
- **Install banner** — consolidated Notes footer (no repeated separator blocks); guard against duplicate summary if `apply.js` loads twice; corrected Quick reference line (on-demand, not streamed at session start)

---

## [2.42.0] — 2026-06-09

### Added
- **Install profiles** — `--profile=lite|core|full`; lite = skills pack without handoff/enterprise layer; `profile-filter.mjs` + `AGENTS-lite.md` + `QUICK-REF-lite.md`
- **Cherry-pick install** — `--mode=add --add=skill:id` and `--mode=list --list=skills`
- **11 lifecycle skills** — modular `SKILL.md` pack including `context-engineering` (`/context`) and `verification-before-completion` (`/verify`) from Mode 4 R001/R005
- **Lifecycle commands** — `/plan` `/build` `/test` `/code-simplify` `/webperf` `/context` `/verify` (Cursor + Claude)
- **Claude marketplace plugin** — `.claude-plugin/plugin.json` for `agent-platform-skills`
- **docs/cursor-setup.md** — Cursor distribution guide (no marketplace; `--profile=lite`)
- **Unified scan registry** — `MAINTAINER/scan-results/registry.md` + `REPORT-SCHEMA.md`; Mode 4 governance scan archive (2026-06-09)
- **Platform Sync Gate (PSG)** — mandatory maintainer auto-sync after Mode 1–4 changes; `platform-maintainer-sync.mdc`

### Changed
- `/spec` routes to `interview-me` skill (`idea-refine` when exploratory)
- **QUICK-REF** — profiles matrix, lifecycle when/how table, skills catalog, common confusions (`/test` vs `/verify`, etc.)
- **README Install** — profile recommendation table + capability matrix + lite→full upgrade path
- **Mode 2 web audit (2026-06)** — OWASP 2025 supply chain, fail-closed errors, API auth batching, LLM action screening in security/backend/devops agents

---

## [2.41.0] — 2026-06-09

### Added
- **Agent-skills ingest (P0 + P1)** — rationalization gates, doubt review, source-driven dev, TDD pyramid/Beyoncé/DAMP, Hyrum's Law, Chesterton's Fence, CWV measure-first; attribution in `MAINTAINER/ingest/agent-skills-p0-SOURCES.md`
- **2 new playbooks** (20 total): `requirements-clarification`, `deprecation`
- **Reference library** — `.agent/references/` (testing, security, performance, accessibility, orchestration-patterns)
- **Context template** — `spec-outline.md` · add-feature Step 0 (spec clarity)
- **Lifecycle slash commands** — Claude Code (`.claude/commands/`) and Cursor (`.cursor/commands/`): `/session-start`, `/session-end`, `/spec`, `/audit`, `/review`, `/release`, `/ship`, `/quick-ref`, `/platform-help`, `/caveman` (+ helpers); Cursor-only `/implement` for Plan mode handoff
- **Cursor Plan mode handoff** — `plan-mode-handoff.mdc` resumes `add-feature` from Step 3 after plan approval
- **User CONTRIBUTING.md** — how to submit rules and playbook ideas
- **docs/DISTRIBUTION.md** — install paths, IDE notes, honest comparison vs skill packs

### Changed
- **Marketing / discovery** — FRAMEWORK-README "When to use what" table; QUICK-REF key-principle column; PLATFORM-HELP "Start here" path; README named-concepts section; presentation decks + STORY-PLAN aligned with v2.41 lifecycle, slash commands, and Plan handoff
- **Install banner** — dynamic playbook count from manifest (`apply.js`)
- **User-facing docs** — playbook counts, agent-skills DNA callouts, slash command list

---

## [2.40.0] — 2026-06-09

### Added
- **8 new playbooks** (18 total): `nfr-definition`, `production-readiness`, `performance-budget`, `observability-setup`, `accessibility-audit`, `compliance-review`, `org-maturity-assessment`, `incident-postmortem`
- **`context/nfr-log.md`** — ISO 25010 / 14-category NFR register (threshold + measure + verify)
- **`context/compliance-evidence-log.md`** — SOC 2 / ISO 27001 control → artifact mapping
- **`context/incident-log.md`** — incident register and DORA rollup table
- **Expanded `security-audit` playbook** — structured OWASP/CVE/secrets pass with mandatory Critic (replaces stub)
- **Full project audit** — Phases 4b/5b/8b (performance, WCAG, observability) + Phase 10 governance/compliance/maturity; report is Phase 11
- **Critic dimensions** — `[ACCESSIBILITY]`, `[OPERABILITY]`, `[BC]` and expanded review scope
- **WCAG 2.2 AA** — frontend-agent accessibility baseline
- **UX interaction principles** — Nielsen + Shneiderman golden rules in frontend-agent
- **Maintainer command** — `"Sync user-facing docs for vX.Y.Z"` and 18-playbook inventory in maintainer agent

### Changed
- **`production-readiness`** — P0 NFR verification, compliance evidence, vuln SLA, SBOM, change-management gates
- **`nfr-definition`** — DORA KPI elicitation and compliance evidence cross-links
- **`nfr-log.md`** — example rows for compliance (`NFR-C01`–`C02`) and DORA (`NFR-DP01`–`DP04`)
- **data-agent** — N+1 detection, indexes, bounded reads, EXPLAIN discipline
- **devops-agent** — container image vulnerability scan; observability operability section
- **add-feature Step 5b** — `[PERFORMANCE]` / `[ACCESSIBILITY]` when triggered; checks `nfr-log.md` P0/P1
- **Architect / Security agents** — NFR, compliance-evidence, and incident-log discipline
- **AGENTS.md routing** — NFR, PRR, performance budget, observability, a11y, compliance, maturity, postmortem
- **CHECKLIST** — NFR, a11y, observability, compliance evidence, vuln SLA, change traceability
- **User-facing docs** — README, FRAMEWORK-README, QUICK-REF, PLATFORM-HELP, `agent-platform-beta.html`, STORY-PLAN

---

## [2.37.0] — 2026-06-09

### Added
- **`document-api` playbook** — OpenAPI/Swagger tasks now route to `.agent/playbooks/document-api.md` instead of `*(none)*`; enforces spec-from-code alignment and mandatory Critic review before handoff
- **Session-end Step 2a** — Critic catch-up gate when application code changed but playbook Step 5b was skipped
- **Session-end Step 2e** — mandatory test + coverage verification when application code changed
- **CHECKLIST quality gates** — Critic, Security gate, and playbook Step 5b output tracked explicitly

### Fixed
- **Critic gate skipped on bug-fix / add-feature** — Step 5b marked MANDATORY with required `▶ Critic review —` output and `CURRENT.md` logging; HARD RULE blocks marking work done without review
- **PowerShell commit failure at session-end** — Step 2c forbids `&&` chaining; each git command runs as a separate shell invocation
- **Docs route without playbook** — `AGENTS.md` docs row now points to `document-api.md` (prevents spec drift / docs-before-code)

### Changed
- **add-feature Step 5a** — Security gate outputs required `▶ Security gate —` signal when triggered

---

## [2.35.2] — 2026-06-09

### Fixed
- **`▶` fires on session-start command** — the router was treating `Read .agent/session-start.md and execute it.` as a dev task and incorrectly attaching an expert/playbook routing signal; session commands now bypass routing entirely in both `AGENTS.md` and the global `~/.claude/CLAUDE.md` stub

---

## [2.35.1] — 2026-06-08

### Fixed
- **`▶` routing signal silenced by global stub** — the global `~/.claude/CLAUDE.md` template said "silently load the correct expert/playbook" which instructed the model to suppress all routing output, overriding every project-level `▶` exemption; removed the word "silently" and added the exact `▶` format with an explicit platform-signal exemption from caveman mode/compression
- **Project CLAUDE.md: `▶` format now inline** — the `▶` format is now embedded directly in `CLAUDE.md` so no prior `AGENTS.md` read is required; the agent no longer needs to read `AGENTS.md` before outputting the first response line

---

## [2.35.0] — 2026-06-08

### Added
- **Agent Platform branding on routing status lines** — every expert/playbook activation now shows `▶ Agent Platform · [Expert] · [Playbook]` so users can see the platform working
- **Release playbook — DevOps owns changelog + version bump** — Step 3 expanded with four concrete sub-steps: collect commits since last tag, determine semver bump level, write CHANGELOG.md entry, bump version in all relevant files (DevOps agent, not docs-agent)
- **Release playbook — full release commit + tag + GitHub release page** — Steps 6–8 added: `chore(release): vX.Y.Z` commit, `git tag`, push `--tags`, `gh release create` using the CHANGELOG entry verbatim, and announce via release page URL
- **CHANGELOG.md starter template ships on install** — professional Keep a Changelog template created automatically for new projects; includes `[Unreleased]` section, full example entry, authoring rules, semver guide, and comparison link stubs; existing changelogs are never touched
- **Changelog retrofit capability** — DevOps agent can convert any existing changelog to Keep a Changelog format; 9-step workflow: audit → confirm plan → map entries → drop internal noise → show diff → write on approval; trigger: "retrofit my changelog"
- **Changelog management documented** — new section in user-facing README covering install-time creation, release-time authoring, and the retrofit command

### Fixed
- **Routing status line suppressed** — `session-start-shared.md` contained "Never announce what you are reading" which silenced the `▶` status line entirely; replaced with a precise rule that preserves the status line while still preventing file-read narration
- **Session-start: same-framework auto-resume** — sessions on the same framework now resume silently without re-prompting the user
- **Mode 3 ingest clarified** — ingest is maintainer-curated, not user self-serve; audit now verifies docs and presentation are in sync
- **README: maintainer-only commands removed** — Mode 4 / ingest commands removed from user-facing upgrade section
- **release.ps1 BOM bug** — `Set-Content -Encoding UTF8` wrote a BOM that broke `JSON.parse`; switched to `[System.IO.File]::WriteAllText` with explicit no-BOM UTF-8

### Documented
- All 4 Jest coverage output formats (HTML, Clover XML, LCOV, JSON summary) documented with glossary entries

---

## [2.34.0] — 2026-06-06

### Added — Honest limitation notice · Glossary · Responsive presentation · Uninstall restore visibility · Antigravity rules scan

**Honest limitation notice (3 places):**
- `apply.js` install output: new "⚠ Rules are guidance — not deterministic enforcement" section with call-to-action for `--mode=install-guards`
- `.agent/PLATFORM-HELP.md`: new "⚠ Important" section at top explaining probabilistic vs deterministic enforcement
- `presentation`: amber callout on "What It Is" slide

**Uninstall restore visibility:**
- Restore messages now have their own clearly separated section with `──────` dividers and `✅ Restored: X ← your original file is back` formatting
- Previously buried between `✔ Removed:` lines; users were missing that their files were restored

**PLATFORM-HELP.md discoverability:**
- Status block Reference line now shows `say "platform help" for full guide` — users see it every session instead of only after opening QUICK-REF.md

**Glossary with links (`README.md`):**
- New "Glossary — standards and abbreviations" section: 14 terms (OWASP, CWE, CVE, SOLID, DRY, ADR, OpenAPI/Swagger, OIDC, SBOM, CSRF, SSRF, N+1, CQRS) all with clickable links to authoritative sources

**Responsive presentation:**
- 3-tier CSS breakpoints (960px tablet, 640px mobile, 400px small mobile)
- Grids, fonts, padding, arrows all adapt correctly to different screen sizes

**New: Standards Glossary slide (presentation):**
- Slide 17: 10 terms explained and linked — OWASP, LLM Top 10, CWE, SOLID, ADR, OpenAPI, OIDC, SBOM, CVE/CSRF/SSRF, DRY/N+1/CQRS

**Presentation trimmed (19 → 17 slides):**
- Removed: Full Platform Lifecycle Diagram (overlapped How It Works), Caveman Mode (mentioned in Quality Gates), Platform Evolution (rewritten as "Living Platform" user value story)
- SOLID: now shown as badge in Quality Gates slide — named but not taught

**Antigravity `.agents/rules/` now scanned** for pre-existing user rules (was missing; only `.agents/prompts/` was scanned)

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.33.0] — 2026-06-04

### Fixed — All 9 agent manifests fully synced with actual capabilities (16 gaps closed)

Agent `.manifest.json` files had drifted behind the actual `.md` files across multiple releases. Full audit and resync:

| Agent | Gaps closed |
|-------|------------|
| architect | Added: `SOLID-principles`, `design-gate`, `code-standards-review`, `DRY-enforcement`, `layer-boundaries`; routing: `threat model`, `design before code`, `SOLID` |
| backend | Added: `rate-limiting`, `idempotency-keys`, `SSRF-prevention`, `mass-assignment-protection`, `OWASP-API-compliance`; routing: `rate limit`, `SSRF`, `REST design` |
| frontend | Added: `XSS-prevention`, `CSP-configuration`, `CSRF-frontend`, `secure-storage`; routing: `accessibility`, `XSS`, `CSP`, `localStorage` |
| devops | Added: `SBOM`, `supply-chain-security`, `artifact-signing`, `OIDC-credentials`, `api-version-inventory`, `linting-enforcement`, `branching-strategy` |
| test | Added: `contract-testing`, `consumer-driven-contracts`, `mutation-testing`, `regression-tests`, `coverage-report-generation`; routing: `contract test`, `mutation testing` |
| docs | Added: `docs-registry-audit`, `new-doc-registration`, `staleness-detection`; routing: `docs registry`, `registry audit` |
| security | Added: `prompt-injection-detection`, `CSRF-prevention`, `SSRF-prevention`, `security-audit-logging`, `LLM-security`, `property-level-auth`; routing: `prompt injection`, `LLM security`, `agentic` |
| data | Added: `idempotency`, `zero-downtime-migration`, `N+1-detection`, `index-optimisation` |
| critic | Added: `DRY-detection`, `SOLID-violations`, `code-structure-review`, `magic-numbers`, `design-gate-verification`, `cross-framework-review`; routing: `cross-framework`, `DRY`, `magic number` |

**Prevention:** `MAINTAINER/platform-maintainer-agent.md` now has a "Manifest sync" hard rule — manifests must be updated on every agent capability change.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.32.0] — 2026-06-04

### Added — Design before code: mandatory Design Gate across all agents, playbooks, and hard rules

**The gap:** agents defaulted to coding immediately. Design was only triggered for "cross-cutting" changes — everything else went straight to implementation.

**The fix:** a four-tier Design Gate is now a platform-level hard rule enforced everywhere:

| Tier | Examples | Required |
|------|---------|---------|
| Trivial | Bug fix, 1-line patch | 1-sentence statement + "ok" |
| Small | New function, small feature | 2–3 sentence design + confirmation |
| Medium | New endpoint, module, schema change | Written design + explicit approval |
| Large | Cross-cutting, new service, breaking change | Architect review + ADR + approval |

**Files changed:**
- `BEST-PRACTICES.md` — Design Gate is now Golden Rule #1; full tier table added; task anatomy updated to include Design as Step 0
- `CONVENTIONS.md` — "Design before code — always" as first agent behaviour rule
- `AGENTS.md` — "DESIGN BEFORE CODE" as first hard rule in Section 3
- `add-feature.md` — Step 2 (Design) expanded to mandatory tier table with BLOCKED gates per tier
- `bug-fix.md` — new Step 3b (Design check) for non-trivial and architectural fixes

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.31.0] — 2026-06-04

### Added — Code standards enforcement: SOLID, DRY, file modularity, linting gate, branching strategy

**`CONVENTIONS.md` — new PLATFORM sections:**
- **Code structure & modularity:** file size limit (400 lines warning / 800 lines hard), single responsibility rule, DRY with 3-occurrence abstraction threshold, no magic numbers, function focus, standard folder structure (`src/`, `tests/`, `docs/`, `config/`, `scripts/`), linting as a build gate
- **Branching & version control:** trunk-based (≤5 devs) vs Gitflow (larger teams), branch naming convention (`feature/`, `fix/`, `chore/`), PR size limit (<400 lines), no force-push to main

**`architect-agent.md` — SOLID principles section:**
- Full SOLID coverage: SRP, OCP (extend don't modify), LSP (substitution guarantee), ISP (small focused interfaces), DIP (depend on abstractions not implementations)
- Design-review questions for each principle to surface issues before coding begins

**`devops-agent.md` — linting as a real gate:**
- Pipeline rule: lint failures block deployment same as test failures — not optional
- Done-when: linting passes (no unsuppressed violations), branching strategy documented in WORKFLOWS.md

**`PLATFORM-HELP.md`** — new "Code standards enforcement" section with full table
**`README.md`** — new "Code standards enforcement" row in "What you get"

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.30.0] — 2026-06-02

### Added — Mode 4: GitHub Governance Repo Scan

Quarterly workflow for discovering new agent governance, coordination, and orchestration tools on GitHub and surfacing them as new platform capabilities.

**`MAINTAINER/github-governance-scan.md`** — 7-phase playbook:
- Phase 1: 15 search query templates across 4 themes (coordination, session lifecycle, trust/scoring, routing/recovery) — rotated each scan run to widen coverage over time
- Phase 2: Triage criteria — keeps 6–15 repos meeting ≥2 governance signals, discards wrappers and placeholders
- Phase 3: 8-question structured analysis per repo (session lifecycle, coordination, routing, trust, quality gates, recovery, manifests, gaps)
- Phase 4: R001-Rxxx findings with `FEATURE / STRENGTHEN / ARCHITECTURE` classification + effort + impact
- Phase 5: Quick-pick table sorted by effort × impact
- Phase 6: Selection commands — `Add` (implement now) · `Investigate` (deeper read) · `Roadmap` (create phased plan doc) · `Skip` · `Defer`
- Phase 7: Archive to `governance-scan/archive/YYYY-MM-DD/` + running scan log updated

**`MAINTAINER/governance-scan/scan-log.md`** — pre-seeded with the founding scan (8 repos → v2.29.0 governance phases).

**`platform-maintainer-agent.md`** updated:
- Available modes list: Mode 4 added
- "Three improvement sources" → "Four improvement sources"
- Mode comparison table expanded to include Mode 4
- Mode 4 section with selection commands, scan-log reference, archive path
- Amendment promotion workflow added (user AP-NNN approvals → PLATFORM section via Mode 1)
- Extension anatomy: 7 → 9 steps (manifest.json, reputation.json, AGENTS.md PLATFORM section)
- "add new framework" command: registry.yaml v2 fields specified

**`MAINTAINER/GUIDE.md`** updated:
- Toolbox table: Mode 4 row added
- Maintenance schedule: quarterly GitHub scan added
- Repo layout: `governance-scan/` folder documented
- E2E test table: phases 5rep, 5gate, 7b, 6a, 6b added

**User-facing docs updated:**
- `README.md`: upgrade section references four improvement sources; Mode 4 paragraph added
- `AGENT-PLATFORM-FRAMEWORK-README.md`: "Three improvement sources" → four-column table; Mode 4 workflow description
- `presentation/agent-platform-beta.html` (slide s10): "Three sources" → "Four sources"; `c3` grid → `c4`; new Mode 4 card (orange, 🔭); commands table row added

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

No template files change in this release — all additions are in `MAINTAINER/` (never deployed to consumer repos). Upgrade picks up the version bump in `platform.json`.

---

## [2.29.0] — 2026-06-02

### Added — Agent Governance System (14-phase roadmap)

A complete governance layer for multi-agent, multi-IDE development. Six capabilities added in one release; all additive — no existing behaviour changes.

---

#### Upgrade safety model (PW1)

`AGENTS.md` now uses a two-section model with `<!-- PLATFORM:START/END -->` and `<!-- PROJECT:START/END -->` markers. Platform upgrades patch only the PLATFORM section — your custom routing rows and hard rules in the PROJECT section survive every upgrade. Migration: first upgrade replaces AGENTS.md once; re-add any custom rows you had, then they are preserved permanently.

---

#### Machine-readable agent manifests (Phase 1A)

Nine `*.manifest.json` files deployed alongside each expert agent in `.agent/agents/`. Each manifest declares:

- `capabilities` — what the agent knows
- `cannot_do` — task types this agent must never handle (used for routing validation)
- `routing_keywords` — supplementary trigger phrases beyond the AGENTS.md table
- `governance.critic_dimensions` — which Critic dimensions apply to this agent's output
- `governance.requires_architect_for` — task types that require Architect sign-off first
- `trust_ceiling` — `standard` or `elevated`

JSON Schema 2020-12 at `.agent/agents/schemas/agent.manifest.schema.json`. All manifests validated on install.

---

#### Reputation vectors (Phase 1B)

`.agent/context/reputation.json` — per-agent trust scores, updated automatically at every session end.

Each agent starts at 500/1000. Scores move based on Critic outcomes:

| Event | Delta |
|-------|-------|
| Critic APPROVED, session `clean` | +10 overall + each capability used |
| Critic found issues, all fixed | +5 overall |
| Critic BLOCKED, unresolved | −20 overall |
| Security gate triggered | −15 on security capability |
| Session `partial` or budget exceeded | −10 overall |

Scores are per-capability as well as overall, floor 0, ceiling 1000.

---

#### Five-state finality + idempotency (Phases 2A, 2B)

`registry.yaml` schema v2 adds two fields per framework:

- `finality_state` — `clean` | `partial` | `lost_confirmation` | `failed` | `in_progress`
- `step_manifest` — list of completed playbook step IDs (e.g. `[reproduce, fix, regression, critic]`)
- `completed_actions` — top-level map keyed by `file_path:timestamp`; prevents double-execution when a takeover is retried

---

#### Partial session resume (Phase 3B)

Session start now handles a third case alongside the existing takeover and conflict flows:

```
┌──────────────────────────────────────────────────────────────────┐
│  Previous session was incomplete                                 │
│  Completed steps: [reproduce, scope, fix]                        │
│  Last goal: [goal from CURRENT.md]                               │
│                                                                  │
│  1. Resume — continue from where it stopped                      │
│  2. Start fresh — ignore previous partial state                  │
└──────────────────────────────────────────────────────────────────┘
```

Reply 1 loads the playbook and skips the already-completed steps. Reply 2 clears the partial state and starts normally.

---

#### Idempotency check on takeover (Phase 3C)

When taking over a stuck session, the new framework reads `completed_actions` before committing. Files already handled in a previous takeover attempt are skipped — no double-commits even if the takeover itself is retried.

---

#### Policy self-evolution — amendment proposals (Phases 4A, 4B)

When the Critic issues a DEFER finding, it now also emits a structured amendment proposal:

```
## Amendment Proposal AP-001
Current rule: [the specific rule blocking this]
Proposed exception: [minimal change that allows this case]
Rationale: [why this case is legitimately different]
Scope: [agent file + section]
To approve: say "approve amendment AP-001"
```

Saying `"approve amendment AP-NNN"` writes the exception directly into the PROJECT section of the specified agent file. The platform learns from real usage without any manual file editing.

---

#### Reputation-aware Critic gate scope (Phase 5B)

Before running a Critic gate, the router reads `reputation.json`:

- `overall ≥ 700` → Critic scope reduced to `[CORRECTNESS] [TEST]` for routine tasks
- `overall ≤ 300` → all 7 dimensions mandatory
- `by_capability.security ≤ 400` → `[SECURITY]` mandatory regardless of score

High-trust agents earn lighter review. Low-trust agents and any agent with a weak security record get heavier scrutiny.

---

#### Manifest-driven routing validation (Phases 6A, 6B)

Two routing improvements backed by manifests:

**cannot_do check:** After identifying an expert, the router reads their manifest's `cannot_do` list. If the task type matches, routing re-runs to find the correct expert (e.g. a UI task routed to backend-agent is redirected to frontend-agent because backend's manifest says `cannot_do: ["UI", "styling"]`).

**Manifest-augmented fallback:** When no AGENTS.md row matches, the router reads `routing_keywords` from all manifests before asking for clarification. Eliminates drift between the routing table and actual agent capabilities.

---

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

What the upgrade changes:
- `AGENTS.md` PLATFORM section: two-section markers added on first upgrade (see upgrade safety above)
- `session-end-shared.md`: Step 4b added (reputation delta writing)
- `session-start-shared.md`: Case C (partial resume) + manifest-augmented routing fallback
- `critic-agent.md`: DEFER output format includes amendment proposal block
- Nine new `*.manifest.json` files deployed alongside agent files
- `.agent/context/reputation.json` deployed (all agents start at 500)
- `registry.yaml` migrated to schema v2 (finality_state, step_manifest, completed_actions added)

---

## [2.28.0] — 2026-06-01

### Added — Solution pattern library + 7 rules from drone-systems ingest (Mode 3)

**Solution pattern library (`patterns.md`):**
- New `.agent/context/patterns.md` — reusable approaches that worked in this codebase
- Session-end Step 2d: selective pattern capture (non-trivial solutions only)
- CONVENTIONS.md: check `patterns.md` before implementing non-trivial solutions
- QUICK-REF.md: `patterns.md` added to Project Knowledge table

**Mode 3 ingest — AGENTS.md from production drone-systems repo:**

CONVENTIONS.md (+3):
- Never mask errors with silent fallbacks — fix root cause; a hidden failure is worse than a surfaced one
- Do not delete existing comments unless deleting the code they belong to
- Behavior-preserving refactors must be in separate commits from feature/bug-fix changes

docs-agent.md (+3):
- Create Mermaid diagrams for state machines, processes, and data flows instead of prose
- When modifying a function, update its inline docstring in the same change
- Done-when gate: any function you modified has an accurate inline docstring

critic-agent.md (+1):
- Note potential bugs found in adjacent code during review — report, do not fix without instruction

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

### Added — Solution pattern library: agents capture and reuse what worked

**Inspired by Ruflo's SONA architecture** — lightweight, zero-infrastructure pattern memory.

**New file: `.agent/context/patterns.md`**

A structured library of reusable approaches that have worked in this codebase. Written by agents at session end when a non-trivial problem was solved in a non-trivial way. Read by agents before implementing to check if a prior session already solved a similar problem.

Entry format:
```
### [date] Category: Pattern title
Situation / Approach / Reuse when / Outcome / Source
```

Categories: Auth · API · Data · Testing · Refactor · Performance · Debugging · Security · Architecture

**Session-end Step 2d (new):** After committing session work, the agent asks: "Did this session produce a reusable pattern?" Selective by design — only captures genuinely novel approaches, skips obvious CRUD and config work. Agents build up a codebase-specific pattern library over time with zero infrastructure.

**CONVENTIONS.md:** New agent behaviour rule — before implementing a non-trivial solution, check `.agent/context/patterns.md` for prior patterns.

**QUICK-REF.md:** `patterns.md` added to the Project Knowledge table.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.27.0] — 2026-06-01

### Added — Elastic License v2, fork instructions, self-install guard, release.ps1 fork-friendly

**Licensing (Elastic License v2):**
- `LICENSE` file created with full ELv2 text — copyright © 2024–2026 Zafrir Ron (zafrirron)
- `package.json` author expanded to `{name, email, url}` · license changed from `MIT` → `Elastic-2.0`
- `README.md` — license badge + copyright line at top; links to LICENSE
- ELv2 terms: free for personal, team, and internal enterprise use; commercial hosting/SaaS prohibited; attribution to Zafrir Ron required on all copies and forks

**Fork instructions (`README.md` — "Fork this platform" section):**
- Step-by-step guide: fork on GitHub, clone, change 4 fields, verify with `npm test`, deploy to team
- How to pull upstream improvements via `git remote add upstream`
- `tools/release.ps1` now reads `$REPO` from `AGENT-PLATFORM-MANIFEST.json` — forks don't need to edit the release script

**Self-install guard (`apply.js`):**
- Detects if the installer is being run against the platform repo itself (checks for `AGENT-PLATFORM-MANIFEST.json` + `AGENT-PLATFORM-TEMPLATES` in the target directory)
- Blocks `install`, `upgrade`, `repair`, `force`, `install-guards`, `remove-guards` with a clear error message
- Uninstall modes are exempt — you can always clean up

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.26.0] — 2026-05-31

### Added — 23 production-proven rules from user submission ingest (Mode 3)

First Mode 3 ingest: 7 Cursor rule files from a Java/Spring monorepo. Language-agnostic rules extracted and added to 5 platform files.

**CONVENTIONS.md — 10 rules**
- General: mark temporary implementations with TODO; prefer constructor injection; use structured log format with args not string concatenation
- Agent behaviour: read module context docs before any task; mark tech shortcuts in code with TODO at the point of the shortcut
- Git: commit subject ≤50 chars; commit body explains WHY (not what)
- Error handling (new section): never swallow exceptions silently; return empty collections not null; model absent values with nullable wrappers

**architect-agent.md — 3 rules**
- Layer boundaries: controller→service only, service→repository only, no cross-layer shortcuts
- No cross-service code imports — services communicate via API only
- Consider CQRS: separate command from query controllers when domain has both

**backend-agent.md — 4 rules (new REST design section)**
- REST paths use resource nouns — never verbs; HTTP method expresses intent
- HTTP verb semantics: GET=read, POST=create, PUT=replace, PATCH=partial, DELETE=remove
- List endpoints return a wrapper with `items` field — never bare arrays
- Every endpoint has a stable `operationId` — never rename a published operationId

**docs-agent.md — 4 rules**
- Explicit doc update trigger list (API surface, domains, tech stack, integrations, patterns, limitations)
- Explicit skip list (formatting, comment-only, version bumps with no behavior change)
- Docs content quality: one fact per bullet, no narration, no "TBD"/"coming soon"
- Done-when gate: verify context docs match code before marking done

**test-agent.md — 2 rules**
- Test every fetch-by-id for both found AND missing cases (+ done-when gate)
- Use fluent assertion libraries — failure messages must be actionable without reading source

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.25.0] — 2026-05-31

### Added — Global install: platform activates across all repos with one command

**New mode: `--mode=global`**

Installs user-level stubs to your home directory so the platform auto-activates in every repo:

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

Writes stubs to all four framework global config locations:

| Framework | Target |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` + `~/.claude/commands/` (caveman, quick-ref, etc.) |
| Cursor | `~/.cursor/rules/agent-platform-global.mdc` (alwaysApply: true) |
| Codex | `~/.codex/instructions.md` |
| Antigravity | `~/.agents/rules/agent-platform-global.md` |

**Behaviour per repo:**
- Repo with `AGENTS.md` → expert routing activates automatically
- Repo without `AGENTS.md` → one-time install offer at session start
- Repo with `.agent-platform-skip` → offer suppressed permanently
- `~/.agent-platform/global-version` → tracks global stub version

**Three-layer model:** PLATFORM (framework rules) → PROJECT (team rules) → USER (personal, global)
USER sections in stub files are yours and never overwritten by upgrades.

**Smart merge on upgrade:** existing global files with `PLATFORM:START/END` markers get only the platform section patched; USER content is preserved.

---

### Added — `--mode=uninstall-global` and install-time global stub suggestion

**Symmetric uninstall for the global scope:**

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall-global          # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall-global --confirm # remove
```

Smart removal — does not blindly delete files:
- Files with no user content in the USER section → deleted entirely
- Files where the user added content to `<!-- USER:START/END -->` → PLATFORM block stripped, USER content kept
- Files with no platform markers → left completely untouched
- Pure platform files (`~/.claude/commands/`, `~/.agent-platform/global-version`) → always deleted

The two scopes are fully independent: removing global stubs does not affect any project installs, and project uninstall does not touch global stubs.

**Post-install global stub suggestion (fresh installs only):**

After a project install, the summary now shows one of:
```
✔  Global stubs  installed (v2.25.0) — platform activates in all your repos
```
or:
```
○  Global stubs  not installed — run: npx github:zafrirron/Agent-Platform --mode=global
   (activates platform in every repo you open — install once, works everywhere)
```

This surfaces the global option at the natural moment (first repo install) without duplicating content between the two scopes.

**`uninstall.md`** updated to document both scopes with distinct dry-run and confirm steps.

### Added — `PLATFORM_REPO` / `PLATFORM_NPX` placeholder system: full fork support

Forks of this repo can now change a single field and have all deployed files and installer output reflect the correct repo URL.

**`AGENT-PLATFORM-MANIFEST.json`** now has:
```json
"platform_repo": "zafrirron/Agent-Platform",
"platform_npx":  "github:zafrirron/Agent-Platform"
```

**What this changes for forks:**
- Change `platform_repo` and `platform_npx` in the manifest → all deployed template files, installer console output, and update checker automatically use the fork's URL
- No more find-and-replace across 120 occurrences after every upstream merge

**Files updated to use `{{PLATFORM_NPX}}` / `{{PLATFORM_REPO}}`:**
- `.agent/PLATFORM-HELP.md` — all install/upgrade/remove commands
- `.agent/QUICK-REF.md` — Platform Operations table
- `.agent/tools/upgrade.md` — upgrade instructions
- `.agent/tools/uninstall.md` — uninstall instructions
- `.agent/tools/check-updates.mjs` — reads `platform_repo` from `platform.json` at runtime
- `.agent/bootstrap/apply.js` — all console.log output, guard file comments
- `.agent/platform.json` — stores `platform_repo` and `platform_npx` after install

**Fork setup:** change two fields in `AGENT-PLATFORM-MANIFEST.json` and everything follows.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

### Added — Full Project Audit playbook: 8-domain professional report, first-session auto-offer

**New playbook: `.agent/playbooks/audit.md`**

Runs a comprehensive professional audit across 8 domains using the right expert for each:

| Phase | Expert | What it audits |
|-------|--------|---------------|
| 1 | Architect | Architecture, components, interfaces, CSCIs, dependency map, ASCII diagram |
| 2 | Docs | Documentation inventory, audience mapping, staleness, gaps |
| 3 | Security | Secrets scan, CVEs, OWASP Top 10, auth coverage, input validation |
| 4 | Test | Coverage, test types, missing regression tests, untested critical paths |
| 5 | Critic | Dead code, error handling gaps, complexity hotspots, inconsistent patterns |
| 6 | Data | Schema, migrations, N+1 risks, PII handling, backup strategy |
| 7 | Backend | API endpoint inventory, auth coverage, api-contracts.md completeness |
| 8 | DevOps | CI/CD health, secrets management, SBOM, rollback strategy |

Generates a timestamped report at `.agent/context/audit-YYYY-MM-DD-HH-MM.md` with:
- Executive summary table (per-domain health: 🟢🟡🔴)
- Findings by severity: Critical → High → Medium → Low
- Quick wins section (high-impact, under 1 hour)
- Prioritised action plan

**First-session auto-offer (session-start Step 1d):**
On the very first session start (no prior completed sessions detected), the platform automatically offers to run the audit. User says YES or NO — the session continues either way.

**Routing:** Say `"run project audit"`, `"health check"`, or `"what is this project"` to trigger at any time.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.24.0] — 2026-05-30

### Added — Beta presentation (17 slides) + release script auto-updates presentation version

**Presentation (`presentation/agent-platform-beta.html`):**
- 17 professional slides with dark theme, animated bar charts, and keyboard/swipe navigation
- New: Expert + Playbook COMBINE diagram — WHO the agent is vs WHAT steps to follow, with the "fix the login bug" combined example
- New: Playbooks slide — all 8 playbooks with trigger scenarios, key steps, and security gate callout
- New: Agent-Generated Artifacts — Coverage HTML report (Test expert) + OpenAPI spec (Docs expert)
- New: Enterprise Governance — centralized rules, one upgrade propagates to all team repos
- New: Platform Evolution — maintainer commands table, improvement loop diagram
- New: Dual Rules Model — PLATFORM vs PROJECT sections with live code example
- New: Caveman Mode — bar chart, when to use/avoid, cross-IDE commands
- New: Zero Code Impact + Factory Reset — gitignored, uninstall restores everything
- New: How It Works lifecycle diagram — professional flow boxes for Install → Session Start → Auto-routing → Work → Session End

**release.ps1:** automatically bumps version markers in `presentation/agent-platform-beta.html` on every release

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.23.0] — 2026-05-30

### Added — Zero-manual-step install for projects with pre-existing AI configs

**Auto-migration of pre-existing AI configs (all frameworks):**
The installer now automatically handles any existing AI configuration files — from Claude Code, Cursor, Codex, Antigravity, Cline, or any other framework — with zero user action required:
- `CLAUDE.md`: session-start trigger injected at top; original content preserved below it
- `AGENTS.md`: platform routing table always installed (overwriting user's, which is backed up); routing was broken when preserved
- `.cursorrules`, `.cursor/rules/*.mdc`, `.codex/instructions.md`, `.clinerules`: detected and backed up
- `.claude/commands/*.md`, `.agents/prompts/*.md`: pre-existing user commands detected and noted
- First session start: agent reads ALL backed-up files (via `manifest.json`), evaluates every rule regardless of source framework, migrates valuable ones to appropriate expert PROJECT sections, deletes `MIGRATION-NOTES.md` — no user action needed

**Explicit routing — agents now READ expert + playbook files:**
The routing table in `AGENTS.md` now shows full file paths and uses imperative "MUST READ" language. Session-start Step 7 explicitly says "immediately READ the expert file AND the playbook file". Eliminates the pattern where agents behaved like experts without following playbook steps.

**Linux compatibility:**
- `.gitattributes` enforces LF line endings on all `.sh` files — fixes Critical bug where `launch.sh` failed on Linux/macOS due to CRLF
- `tools/release.ps1`: `$ROOT` and `$GH` now auto-detected (no hardcoded Windows paths); Linux/pwsh usage documented
- `tests/E2E-TEST-PLAN.md`: all `E:\Test` hardcoded paths replaced with `<TEST_DIR>`; bash + PowerShell commands shown side-by-side

**UX fixes (discovered during E2E testing):**
- Status block output as plain text (not code block) — markdown links now render as clickable in IDE chat
- `/quick-ref` slash command outputs one clickable link, not the full file content in chat
- `AGENTS.md` and `SYNC-POINTS.md` always installed even when pre-existing (were silently skipped before, breaking routing)

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.22.0] — 2026-05-30

### Added — Web audit: 15 OWASP/CWE/LLM security and best-practice rules across 6 expert agents

Mode 2 web ecosystem audit against OWASP Top 10 (2021), OWASP API Security Top 10 (2023), CWE Top 25 (2024), OWASP LLM Top 10 (2025).

**security-agent.md** — 5 new rule sections:
- Data protection: TLS enforcement, encryption at rest, no tokens in browser storage (F001)
- CSRF prevention: SameSite cookies, CSRF tokens, Origin/Referer validation (F004)
- SSRF prevention: URL allowlisting, private IP range blocking for server-side HTTP fetches (F007)
- Security audit logging: structured event logs, alerting thresholds, log integrity (F005)
- LLM/agentic security: prompt injection defence, indirect injection, least-privilege tool grants, system-prompt protection, output validation (F008, F015)
- Extended rate limiting to compute-heavy endpoints (F009); deprecated API inventory (F010); threat modelling trigger (F002); property-level auth and mass-assignment (F003)

**backend-agent.md** — mass-assignment allowlists, third-party API response validation, SSRF URL validation, idempotency keys, extended rate limiting (F003, F007, F009, F011, F018)

**frontend-agent.md** — no tokens in localStorage, avoid innerHTML with user data, CSP header requirement, CSRF token on mutation forms (F001, F004)

**devops-agent.md** — SBOM generation, artifact signing, dependency hash pinning, CI runner OIDC short-lived credentials, isolated build environments, API version inventory (F006, F014, F010)

**test-agent.md** — mutation testing for critical modules, consumer-driven contract testing across service boundaries (F012, F013)

**architect-agent.md** — threat modelling as mandatory design-time step for auth/payment/bulk features (F002)

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.21.0] — 2026-05-30

### Changed — QUICK-REF redesign: user-facing reference, not internal mechanics

**Problem:** QUICK-REF was printed in the agent chat on demand, exposing internal `Read .agent/...` commands to users and filling the conversation with a wall of text.

**Changes:**
- `"show quick reference"` trigger now outputs a single line: `Quick reference: open .agent/QUICK-REF.md in your editor.` — no more chat dumps
- `QUICK-REF.md` fully rewritten for users, not agents:
  - Expert agents: removed "Command" column — auto-routing note added, trigger phrases only
  - Playbooks: removed "Command" column — scenario → playbook name + what it covers
  - Project Knowledge: rewritten as "open in editor" file list — no agent instructions
  - Testing: rewritten as agentic prompts ("write tests for X", "check coverage") — not raw CLI commands
  - Extend: unchanged — already the gold standard ("Tell the agent: ...")
  - Platform: Local help points to file path; "check for updates" and "upgrade" rewritten as agent phrases or npx terminal commands
- `release.ps1` now bumps `README.md` version alongside `package.json` and manifest

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.20.1] — 2026-05-30

### Docs — docs governance added to all user-facing platform descriptions

- `README.md` — new "Docs governance" row in "What you get" table; enforcement guards row updated to mention doc detection
- `AGENT-PLATFORM-FRAMEWORK-README.md` — new "📋 Docs governance" table row; dedicated Section 5 explaining the full enforcement chain (registry → Done-when → session end → release gate → pre-commit guard); capabilities paragraph updated; sections renumbered 6–9 → 7–10
- `.agent/PLATFORM-HELP.md` — new "Docs governance" section between Testing and Caveman, with quick-paste commands for first session, release audit, and manual registry updates; Sections header updated

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.20.0] — 2026-05-30

### Added — Docs governance model: registry, agent enforcement, release gate, new-doc detection

Documentation completeness is now a first-class quality gate — not an afterthought.

**`.agent/context/docs-registry.md`** — installed in every consumer repo. Single source of truth mapping every project doc to its owner expert, audience, update trigger, and last-reviewed date. Agents read this before marking tasks done.

**Every expert agent — Done-when updated:**
All 8 expert Done-when checklists now include:
- Check `docs-registry.md` for owned rows and update them for this change
- Register any new `.md` files created during the session

**`docs-agent.md` — two new modes:**
- *Registry audit mode* (triggered at release gate): reads registry, checks `Last reviewed` against last git tag, reports STALE / OK per row, blocks release if stale docs exist
- *New doc registration mode*: when any expert creates a new `.md` file, adds it to the registry immediately with correct owner and audience

**`release.md` playbook — docs approval gate (Step 4):**
Docs agent runs a registry audit before the release is allowed to proceed. Any stale row or unregistered new doc file = BLOCKED. Agent offers to update stale docs or mark them N/A with a reason.

**`session-end-shared.md` — Step 2b (new-doc scan):**
At every session end, scans for new `.md` files created during the session that are not yet in `docs-registry.md`. Prompts to register them before closing the session.

**Pre-commit guard (`--mode=install-guards`) — Guard 3:**
Detects newly staged `.md` files outside `.agent/` not found in `docs-registry.md`.
Soft warning (does not block commit) — tells the user which files to register.
Hard gates (secrets, tests) are unaffected.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.19.2] — 2026-05-30

### Release — token optimization + caveman guidance + bug fixes

Full changelog for the v2.18.1–v2.19.2 release stream.

### Fixed

- **Install crash** (`preArtifacts.conflicting undefined`) — every fresh install crashed at the post-install summary. `apply.js` was using stale property names from before a refactor. Fixed to use `toBackup.length`.
- **Uninstall restore silently skipped** — backed-up files (e.g. original `CLAUDE.md`) were never restored because the backup lived inside `.agent/backup/`, which was deleted before the restore code ran. Now staged to `os.tmpdir()` before deletion. Also removed `!fs.existsSync(dest)` guard that prevented overwriting the platform version.

### Added

- **36 integration tests** (`tests/apply-integration.test.mjs`) — runs the real installer against temp directories. Covers clean install, install with pre-existing `CLAUDE.md`, upgrade, uninstall dry-run, uninstall confirm, and backup restore. Catches installer-level crashes that unit tests on pure functions cannot.
- **`.agent/TOKEN-BUDGET.md`** — exact token cost of every platform file, installed into every consumer repo. Includes mandatory session cost, per-task lazy loading table, never-auto-loaded list, caveman savings, and "when to use / when to avoid" guidance.
- **`.agent/tools/setup-test-runner.md`** — test runner detection logic extracted from `session-start-shared.md`. Loaded only once (when `test_runner` is still a placeholder), never again.
- **Caveman mode surfaced at the right moments** — mentioned in every session start status block; explained in Backend and Frontend expert files at the moment the user is in implementation mode. Clear guidance: turn it off for Critic reviews, security audits, architecture decisions, Docs expert work.

### Performance — −49% mandatory session-start token cost

| Change | Tokens saved per session |
|--------|--------------------------|
| QUICK-REF table no longer streamed at session start (on-demand only) | −1,516 |
| AGENTS.md prose and redundant reference sections removed | −845 |
| Test-runner detection moved to separate file (loads once ever) | −566 |
| **Total** | **−2,356 tokens/session** |

Session start now outputs a compact 4-line status block:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  my-project · Agent Platform v2.19.2 · claude
  Last work : add user authentication
  Updates   : ✅ Up to date
  Reference : "show quick reference" for commands · "caveman mode" to cut output ~65%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready. Tell me what you want to do.
```

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.19.1] — 2026-05-30

### Performance — token optimizations (part 2)

- `AGENTS.md`: removed meta-comments, verbose prose, redundant expert/playbook reference tables — 1,674 → 829 tokens (−845)
- `session-start-shared.md` Step 2: test runner detection table extracted to `.agent/tools/setup-test-runner.md` — 2,208 → 1,642 tokens (−566)
- `setup-test-runner.md` added to manifest — loaded once ever (first session only), never again after test runner is configured
- `.agent/TOKEN-BUDGET.md` added to manifest — exact token cost breakdown deployed to every consumer repo

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.19.0] — 2026-05-30

### Performance — QUICK-REF no longer streamed at session start

- Session start Step 5 rewritten: no longer reads and streams the full QUICK-REF table (was 1,516 tokens every session)
- Replaced with a compact 4-line status block: project · version · framework · last work · update status · reference hint
- QUICK-REF displayed only on explicit request: "show quick reference", "show help", "show commands"
- `QUICK-REF.md` header updated: "Displayed on demand only"

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.18.2] — 2026-05-29

### Fixed — Uninstall restore silently skipped backed-up files

Backup lived inside `.agent/backup/`, which was deleted before the restore code ran. Files were never restored.

- Backed-up files now staged to `os.tmpdir()` **before** deleting `.agent/`
- Restore runs after deletion from the temp staging dir, then cleans up
- Removed `!fs.existsSync(dest)` guard — during uninstall, always overwrite the platform version with the user's original
- `import os from 'os'` added to `apply.js`

### Added — 36 integration tests

- `tests/apply-integration.test.mjs`: 6 describe blocks covering the full install lifecycle
- Scenarios: clean install, install with pre-existing CLAUDE.md (backup), upgrade, uninstall dry-run, uninstall confirm (user files intact), uninstall confirm with restore
- `npm test` updated to run both unit and integration test files
- Pre-commit hook now catches installer-level crashes, not just utility-function bugs

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.18.1] — 2026-05-29

### Fixed — Install crash on every fresh install

`apply.js` line 755 referenced `preArtifacts.conflicting`, `.thirdParty`, `.userCursor` — stale property names from before a refactor. `scanPreExistingArtifacts()` returns `{ toBackup, toNote }`. Every install crashed with `TypeError: Cannot read properties of undefined (reading 'length')` after successfully writing all 87 files.

Fixed to use `preArtifacts.toBackup.length`.

Also adds `tests/E2E-TEST-PLAN.md` — manual end-to-end test script covering install, session start, auto-routing, multi-expert, playbooks, cross-framework critic, and uninstall.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.18.0] — 2026-05-29

### Added — Security declaration

- **`SECURITY.md`** — clear declaration of what the platform does and does not do: only markdown/YAML/JSON files installed, no executable code, no network calls, no telemetry, no source code touched, every rule traceable to a failure it prevents.
- **README trust section** — supply chain transparency: version-pinnable, open source, auditable, no runtime code injection, no npm registry dependencies beyond Node built-ins.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.17.0] — 2026-05-29

### Added — Automatic expert + playbook routing

**Before:** Users had to manually tell the agent which expert file to load.  
**After:** The agent routes silently. You describe the goal — it figures out the rest.

| You say | Agent does automatically |
|---------|--------------------------|
| "fix the login bug" | Loads backend expert + bug-fix playbook → begins Step 1 |
| "add rate limiting" | Loads backend expert + add-feature playbook → begins Step 1 |
| "review the auth" | Loads security expert → reviews using OWASP rules |
| "ready to ship" | Loads devops expert + release playbook → runs gates |
| "find what's wrong" | Loads critic agent → adversarial 6-dimension review |

Three layers of activation ensure routing fires before you type anything. The user **never** tells the agent which file to read.

- Full lifecycle flow diagram added to README and PLATFORM-HELP.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.16.0] — 2026-05-29

### Added — 40 unit tests for core installer

- **`apply-utils.mjs`** — pure functions extracted from `apply.js`: `sub`, `isStub`, `patchPlatformSection`, `detectTestRunner`, `detectCoverageCmd`, `scanPreExistingArtifacts`
- **`tests/apply-utils.test.mjs`** — 40 tests across 6 describe blocks using `node:test` (no external deps)
- **`npm test`** script added to `package.json`
- **Pre-commit hook** blocks commits when tests fail

### Fixed (11 Critic review findings)

- Backup dir uses datetime not date — same-day reinstall no longer overwrites previous backup
- Upgrade warns when file skipped due to missing PLATFORM markers
- Session start update check: graceful failure instruction added
- Unknown-stack CI workflow: WARNING comment added for unrecognised test runners
- `build-bootstrap-manifest.js`: preserves existing kind values, reports new/removed files
- `COPYING.md` + `PACK-DEPLOY.md`: rewritten to reflect npx install
- gitignore append: ensures newline separator if file doesn't end with one
- `add-framework.md`: explicit instructions for `FW_RULE_PATTERNS` and `LEGACY_ROOT_FILES`

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.15.2] — 2026-05-29

### Fixed — Comprehensive backup/restore for all frameworks

- `FW_RULE_PATTERNS` array: framework-agnostic rule file detection (auto-extends for future frameworks)
- `LEGACY_ROOT_FILES` array: root-level legacy configs (`.cursorrules` etc.)
- `backupArtifacts()` now writes `manifest.json` with original paths — restore is exact regardless of file location
- Uninstall restore now uses `manifest.json` for accurate restoration, with legacy fallback for pre-v2.15.1 backups

### Fixed — Wording (removed language that made users think their code would be deleted)

- README: "Your repo returns to its exact pre-install state" → "Your source code, project files, and git history are never touched"
- Uninstall confirmation: "source code and git history were never touched"
- PLATFORM-HELP zero footprint table: explicit "Your source code is never touched"

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.15.1] — 2026-05-29

### Fixed — Documentation audit (6 findings)

- `CHANGELOG.md`: added missing v2.14.0 and v2.15.0 entries
- `AGENT-PLATFORM-FRAMEWORK-README.md` footer: v2.10 → v2.15 (was 5 versions stale)
- `AGENT-PLATFORM-FRAMEWORK-README.md`: "8 software-expert agents" → "9 software-expert agents (including Critic)"
- `README.md`: "Eight specialist agents" → "Nine expert agents (including Critic)"
- `session-start-shared.md`: fixed step numbering gap — steps jumped 2→4, renumbered sequentially
- `PLATFORM-HELP.md`: "Sections:" header was missing "Critic agent"

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.15.0] — 2026-05-29

### Added — Pre-existing AI artifact detection + backup + restore

When installing on a repo that already uses Claude Code, Cursor, Antigravity, or Codex:
- **Pre-install scan** detects existing `CLAUDE.md`, `AGENTS.md`, `SYNC-POINTS.md`, `.cursorrules`
- **Backup** of platform-owned files created at `.agent/backup/pre-install-YYYY-MM-DD/`
- **`.agent/MIGRATION-NOTES.md`** generated — per-file guidance on connecting existing config to the platform
- **Install summary** shows `⚠ preserved` / `ℹ detected` lines per artifact found
- **Uninstall restores originals** — after removing all platform files, backed-up originals are restored to their original locations

This removes the adoption barrier for developers who already have AI configurations in their repo.

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.14.0] — 2026-05-29

### Added — Zero footprint: all platform files gitignored by default

- **`apply.js` gitignore step**: writes a marked block to `.gitignore` on every install:
  ```
  # Agent Platform Bootstrap — START
  .agent/  .claude/  .cursor/  .agents/  .codex/  AGENTS.md  SYNC-POINTS.md  CLAUDE.md
  # Agent Platform Bootstrap — END
  ```
- **`git status` stays clean** after install — nothing committed accidentally with your code
- **Uninstall removes the block**: entire gitignore section removed by `START/END` markers
- **Install summary**: new capability line `✔ Zero code impact — platform files gitignored`
- **README + docs**: "Zero footprint" guarantee table added prominently

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.13.0] — 2026-05-29

### Added — Cross-framework critic review (automatic multi-model code review)

**The feature:** When you start a session in IDE B after working in IDE A, the platform automatically offers to run the Critic agent on IDE A's work — using IDE B's model with no shared context.

**Why it's valuable:** Different AI models (Claude, GPT, Gemini) have different reasoning patterns and blind spots. When Cursor reviews Claude Code's work, it has no memory of the implementation decisions — it approaches the code exactly as a second developer would in a real code review. This cross-model review consistently finds auth assumptions, untested edge cases, and intent-vs-implementation gaps that single-model review misses.

**How it works:**
1. IDE A ends session → `CURRENT.md` records files changed + `Critic reviewed: no`
2. IDE B starts session → detects `meta.updated_by` ≠ current framework
3. Shows boxed offer: last framework, goal, files changed, YES/NO
4. YES → Critic loads the changed files cold, runs 6-dimension review
5. User decides: fix Critical/High now, note and proceed, or proceed clean
6. `CURRENT.md` updated: `Critic reviewed: yes — X Critical, Y High, Z Medium`
7. Offered once per handoff — never repeats for the same session

**Zero setup.** Just switch IDEs and answer YES.

### Changed

- `session-start-shared.md`: New Step 1b — cross-framework critic offer with boxed UI
- `session-end-shared.md`: Explicit file-by-file change list + `Critic reviewed: no` field
- `critic-agent.md`: Cross-framework review mode (cold review, intent vs implementation focus)
- `PLATFORM-HELP.md`: Cross-framework review section with boxed example
- `README.md`: Dedicated "Cross-framework critic review" section with flow diagram
- `AGENT-PLATFORM-FRAMEWORK-README.md`: §4 expanded with cross-framework critic flow; "What you get" table updated; §3 expert table note

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.12.0] — 2026-05-29

### Added — Agentic maintainer audit system (two modes)

**Mode 1 — Agentic manual commands** (`platform-maintainer-agent.md`):
The maintainer states intent in plain language; the agent executes all 7 steps automatically:
- `"add rule to <expert>: <rule>"` → duplicate check → format → write → log → bump
- `"add quality gate to <playbook> step N"` → auto-insert BLOCKED condition
- `"add step to <playbook>"` → format + renumber + log
- `"add new expert for <domain>"` → full 7-step scaffold
- `"check if <topic> is covered"` → cross-file PLATFORM search

**Mode 2 Option B — Monthly web audit** (`web-audit.md`):
- Phase 1: OWASP Top 10 (web + API), CWE Top 25, CVE patterns
- Phase 2: Backend, Testing, DevOps, Data, Agentic best practices
- Structured findings report (F001-Fxxx) — NOT COVERED / PARTIALLY COVERED
- Maintainer selects: Add / Skip / Modify / Defer
- Agent implements only what maintainer explicitly selects

**Mode 2 Option C — Quarterly horizon scan** (`web-audit.md scope=full`):
- All of Option B + Phase 3 (HackerNews signals, new tooling, Black Hat/DEF CON/ArXiv)
- Additional finding type: `E-prefix` (EMERGING PRACTICE) — new practices, not gaps
- Additional action: `"Create new expert from E001"` for broad emerging domains
- Summary table includes Type column: Gap vs Emerging

### Changed

- `web-audit-report-template.md`: Emerging Practices section, E-prefix format, Type column
- `platform-maintainer-agent.md`: Mode 1 command interface, Mode 2 scope=full trigger
- `platform-audit.md`: Clarified as Mode 1 Internal Audit
- `MAINTAINER/GUIDE.md`: Dual improvement loop diagram, audit schedule table, updated file list

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## Install — quick reference

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex

# Any OS with Node.js 18+
npx github:zafrirron/Agent-Platform
```

Upgrade, repair, or force-reset:
```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
npx github:zafrirron/Agent-Platform --mode=repair
npx github:zafrirron/Agent-Platform --mode=force
```

Check for updates from inside any consumer repo:
```bash
node .agent/tools/check-updates.mjs
```

Let the agent self-upgrade:
```
Read .agent/tools/upgrade.md and execute it.
```

---

## Upgrade matrix

| You are on | → 2.4.0 | Notes |
|------------|---------|-------|
| **2.3.0** | ✅ One command | `npx github:zafrirron/Agent-Platform --mode=upgrade` |
| **2.2.0** | ✅ One command | `npx github:zafrirron/Agent-Platform --mode=upgrade` |
| **2.1.0** (initial public) | ✅ One command | `npx github:zafrirron/Agent-Platform --mode=upgrade` |
| **2.0.x** (pre-public) | ✅ Supported | Full re-install recommended |
| **1.x** (legacy) | ⚠️ Manual | See [§ Upgrading 1.x → 2.x](#upgrading-1x--23) |
| **< 1.0** | ❌ Not supported | Fresh install recommended |

> **Safe by default:** `mode=install` and `mode=repair` never overwrite existing files.  
> `mode=force` resets all templates — use only when you have no project-specific customisations to preserve.

---

## [2.5.0] — 2026-05-29

### Added

| File | What it does |
|------|-------------|
| `.agent/session-start.md` | Universal session-start entry point — one command works in any IDE; agent self-identifies its framework (claude/cursor/agents/codex) then calls `session-start-shared.md` |
| `.agent/tools/uninstall.md` | Agent uninstall prompt — asks user to confirm, then runs `npx ... --mode=uninstall --confirm` |

### Changed

| File | What changed |
|------|-------------|
| `CLAUDE.md` template | Reduced to 2 lines: project name + `Read .agent/session-start.md and execute it.` — no more Claude-specific instructions cluttering a framework-agnostic install |
| `apply.js` | Install summary now shows: capabilities list (8 agents, 8 playbooks, test enforcement, caveman, quick ref, update check), single universal start command, uninstall command. Added `--mode=uninstall` with dry-run (default) and `--confirm` flag for actual removal. |
| `README.md` | Session start updated to single universal command; added Remove section |
| `AGENT-PLATFORM-MANIFEST.json` | Added `session-start.md` and `uninstall.md` entries; bumped to 2.5.0 |

### Install summary — what the user now sees

```
══════════════════════════════════════════════════════════════════
  Agent Platform Bootstrap v2.5.0 — Installed on MyProject
══════════════════════════════════════════════════════════════════

  What was installed          Files created: 82   Updated: 0
  ──────────────────────────────────────────────────────────────
  .agent/          shared hub — conventions, playbooks, agents, context
  .claude/         Claude Code
  .cursor/         Cursor
  .agents/         Antigravity
  .codex/          Codex (VS Code)

  Capabilities
  ──────────────────────────────────────────────────────────────
  ✔  4 IDE frameworks    Claude Code · Cursor · Antigravity · Codex
  ✔  8 expert agents     Architect · Backend · Frontend · DevOps
                         Test · Docs · Security · Data
  ✔  8 playbooks         add-feature · bug-fix · refactor · release
                         debug · security-audit · add-dependency · api-integration
  ✔  Test enforcement    runner: npm test  |  coverage gate: 80%
  ✔  Token compression   "caveman mode" — ~65% output reduction
  ✔  Quick reference     displayed on every session start
  ✔  Update check        node .agent/tools/check-updates.mjs
  ✔  Context docs        api-contracts · adr-log · known-issues · dependencies

  References
  ──────────────────────────────────────────────────────────────
  Full guide  →  AGENT-PLATFORM-FRAMEWORK-README.md
  Repository  →  https://github.com/zafrirron/Agent-Platform

  Start your first session (any IDE):
  ──────────────────────────────────────────────────────────────

  Read .agent/session-start.md and execute it.

  ──────────────────────────────────────────────────────────────
  To remove all platform files:

  npx github:zafrirron/Agent-Platform --mode=uninstall
══════════════════════════════════════════════════════════════════
```

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

Adds `session-start.md`, `uninstall.md`; updates `CLAUDE.md` to minimal form.

---

## [2.4.0] — 2026-05-29

### Added — Post-install summary & agentic quick reference

| File | What it does |
|------|-------------|
| `.agent/QUICK-REF.md` | Framework-aware quick reference table — all capabilities in one place; `<fw>` placeholder replaced at session start with the active framework name; `{{TEST_RUNNER}}` and `{{COVERAGE_CMD}}` filled at install time |
| `.agent/session-start-shared.md` | Single shared session-start logic for all 4 frameworks: conflict check, 7-day update check, last-work context, quick reference display, ready prompt |

### Changed

| File | What changed |
|------|-------------|
| `.claude/prompts/session-start.md` | Reduced to 2-line wrapper: declares `framework=claude`, calls `session-start-shared.md` |
| `.cursor/prompts/session-start.md` | Reduced to 2-line wrapper: declares `framework=cursor`, calls shared file |
| `.agents/prompts/session-start.md` | Reduced to 2-line wrapper: declares `framework=agents`, calls shared file |
| `.codex/prompts/session-start.md` | Reduced to 2-line wrapper: declares `framework=codex`, calls shared file |
| `apply.js` | Writes `test_runner`, `coverage_cmd`, `coverage_threshold`, `last_update_check`, `last_update_status` to `platform.json`; prints structured install summary with file counts, folder list, full guide link, repo URL, and per-framework session-start commands |
| `platform.json` template | Added fields: `test_runner`, `coverage_cmd`, `coverage_threshold`, `last_update_check`, `last_update_status` |
| `AGENT-PLATFORM-MANIFEST.json` | Added `QUICK-REF.md` and `session-start-shared.md` entries; bumped to 2.4.0 |

### Behaviour after install

**Install completion** — terminal shows:
```
══════════════════════════════════════════════════════════════
  Agent Platform Bootstrap v2.4.0 — Installed on <project>
  Files created: N   Updated: 0   Skipped: 0
  Full guide  →  AGENT-PLATFORM-FRAMEWORK-README.md
  Repository  →  https://github.com/zafrirron/Agent-Platform
  Start: Read .<fw>/prompts/session-start.md and execute it.
══════════════════════════════════════════════════════════════
```

**Every session start** — agent displays:
- Status header (project, version, framework, last work, update status)
- Full quick reference table (all commands for the active framework)
- Update notice if last check > 7 days and a newer version exists
- `Ready. Tell me what you want to do.`

### Upgrade path

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```
Adds `QUICK-REF.md` and `session-start-shared.md`; updates the 4 session-start wrappers and `platform.json` template.

---

## [2.3.0] — 2026-05-29

### Added — Professional installation system

| What | Detail |
|------|--------|
| **`bin/agent-platform.js`** | npx entry point — `npx github:zafrirron/Agent-Platform` installs directly from GitHub with no file copying |
| **`install.sh`** | Bash one-liner: `curl -fsSL .../install.sh \| bash` — auto-detects latest release, downloads, applies, cleans up |
| **`install.ps1`** | PowerShell equivalent for Windows: `iwr -useb .../install.ps1 \| iex` — same flow |
| **`.agent/tools/check-updates.mjs`** | Deployed to consumer repos; compares installed `bootstrap_version` against GitHub Releases API; prints upgrade instructions |
| **`.agent/tools/upgrade.md`** | Agent upgrade prompt: `Read .agent/tools/upgrade.md and execute it.` — agent checks version, runs npx upgrade, fills placeholders, runs repair |

### Changed

- **`apply.js`** (core installer): split `PACK_ROOT` (templates source) from `INSTALL_ROOT` (consumer repo target); supports `--pack=<dir>` and `--target=<dir>` CLI args and `AP_PACK` / `AP_TARGET` env vars; improved stack detection (reads `package.json` scripts to distinguish jest/vitest/mocha)
- **`package.json`**: added `bin`, `repository`, `keywords`, `author`, `license`; removed `private`; bumped to 2.3.0 — enables `npx github:zafrirron/Agent-Platform`
- **`AGENT-PLATFORM-MANIFEST.json`**: added `check-updates.mjs` and `upgrade.md` tool entries
- **Framework README**: replaced "Activate" section with three-path "Install" section (npx / shell / agent-direct); updated §8 with check-updates and agent upgrade commands; updated quick-ref card
- **`CHANGELOG.md`**: added install quick-reference block at top

### Upgrade path

For existing consumer repos — upgrade to get `check-updates.mjs` and `upgrade.md` deployed:
```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## [2.2.0] — 2026-05-28

### Added

**Test enforcement** — agents can no longer mark a task done without tests.

| File | What changed |
|------|-------------|
| `.agent/agents/test-agent.md` | Full rewrite: "When to invoke" trigger table, 4-category test taxonomy (unit · integration · regression · contract), runner/coverage placeholders, 8 explicit rules |
| `.agent/CONVENTIONS.md` | Explicit "critical path" definition; test mandate for every new public function and every API endpoint; `COVERAGE_THRESHOLD` gate; red-suite-blocks-handoff rule |
| `.agent/CHECKLIST.md` | New dedicated **Testing** section with 6 checkboxes (runner, unit, regression, contract, coverage, untestable-code log) |
| `.agent/BEST-PRACTICES.md` | Completed Task Anatomy: Spec → Implement → Test → Handoff table; explicit "Done means" definition |
| `.agent/playbooks/api-integration.md` | Explicit test step with required cases (happy path + ≥1 error path + auth failure); added Rules section |

**Pack infrastructure**

| File | What changed |
|------|-------------|
| `AGENT-PLATFORM-MANIFEST.json` | New placeholders: `COVERAGE_CMD`, `COVERAGE_THRESHOLD` |
| `AGENT-PLATFORM-BOOTSTRAP.md` | Phase 0 detects `TEST_RUNNER`, `COVERAGE_CMD`; defaults `COVERAGE_THRESHOLD` to 80% |
| `AGENT-PLATFORM-FRAMEWORK-README.md` | Updated "What you get" table, Phase 0 description, Test expert row, §9 best-practices, quick-ref card; added "Upgrading from v2.x to v2.2" guide |
| `CHANGELOG.md` | Created (this file) |

### Changed

- `bootstrap_version` synced and bumped: `2.0.0` → `2.2.0` (manifest had not been bumped since initial private build; docs were already at 2.1).

### Fixed

- `BEST-PRACTICES.md` Task Anatomy section was empty (cut off at the heading).
- `test-agent.md` had only 3 lines of content — no actionable guidance.
- `api-integration.md` had no Rules section and no explicit test step.

---

## [2.1.0] — 2026-05-28 (initial public release)

First public release of the Agent Platform Bootstrap framework.

### Added

**Coordination layer (`.agent/` shared hub)**

- `BEST-PRACTICES.md` — 10 golden rules for agentic development
- `CHECKLIST.md` — pre-handoff verification checklist
- `CONVENTIONS.md` — coding, testing, git, and security conventions
- `FILE_MAP.md`, `PROJECT.md`, `WORKFLOWS.md`, `ZONES.md` — project-specific stubs
- `SYNC.md`, `SWITCH-PROMPTS.md` — cross-framework sync protocol

**8 software-expert agents** (`.agent/agents/`)

Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data — domain personas with owned paths and rules.

**7 playbooks** (`.agent/playbooks/`)

add-feature · bug-fix · refactor · release · debug-pipeline · add-dependency · api-integration · security-audit

**5 living context files** (`.agent/context/`)

api-contracts · api-patterns · adr-log · known-issues · dependencies · project-overview

**Caveman skill** (`.agent/skills/caveman/`)

~65% output token compression; wired into all 4 frameworks; 5 slash commands for Claude Code.

**4 IDE framework private folders**

| Folder | Framework |
|--------|-----------|
| `.claude/` | Claude Code — session prompts, 5 slash commands, FRAMEWORK.json |
| `.cursor/` | Cursor — session prompts, 3 MDC rules, FRAMEWORK.json |
| `.agents/` | Antigravity — session prompts, skill wiring, FRAMEWORK.json |
| `.codex/` | Codex (VS Code) — session prompts, instructions, FRAMEWORK.json |

**Handoff + registry**

- `.agent/handoff/CURRENT.md` — session log (newest-first)
- `.agent/handoff/sync/registry.yaml` — active-framework lock (prevents concurrent edits)
- `.agent/handoff/TEMPLATE.md`, `task-template.md` — structured handoff formats

**Pack infrastructure**

- `AGENT-PLATFORM-BOOTSTRAP.md` — 5-phase install orchestrator
- `AGENT-PLATFORM-MANIFEST.json` — 88-file template manifest, placeholders: `PROJECT_NAME`, `PROJECT_DESCRIPTION`, `DATE`, `HIGH_CONFLICT_PATHS`, `TEST_RUNNER`, `BOOTSTRAP_VERSION`
- `AGENT-PLATFORM-APPLY.js` — Node 18+ installer with `--mode=install|repair|upgrade|force`
- `AGENT-PLATFORM-TEMPLATES/` — all installable file bodies (consumer-project neutral)
- `tools/build-bootstrap-manifest.js` — regenerates manifest from templates
- `tools/build-framework-readme.js` — regenerates framework README
- `COPYING.md` — exact file list for copying the pack
- `PACK-DEPLOY.md` — instructions for deploying to a consumer repo

---

## Upgrade guides

---

### Upgrading 2.1 → 2.3

**What changed:** 5 template files updated (testing enforcement), 2 new placeholders, + full installer system.  
**Risk:** Low — only `.agent/` template files change; no new directories or file moves.

**Recommended (npx — no files to copy):**
```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```
This adds new files (`check-updates.mjs`, `upgrade.md`) and leaves existing content untouched.

Then fill the 2 new placeholders in `.agent/CONVENTIONS.md`, `.agent/CHECKLIST.md`, and `.agent/agents/test-agent.md`:

| Placeholder | Example values |
|-------------|---------------|
| `{{COVERAGE_CMD}}` | `pytest --cov` · `jest --coverage` · `go test -cover ./...` · `dotnet test /p:CollectCoverage=true` |
| `{{COVERAGE_THRESHOLD}}` | `80` (default) — adjust to your project's baseline |

Then repair any remaining stubs:
```bash
npx github:zafrirron/Agent-Platform --mode=repair
```

**Manual path (no Node.js):**  
Copy these 5 files from the new pack to your `.agent/` folder and fill the placeholders above:
```
AGENT-PLATFORM-TEMPLATES/.agent/agents/test-agent.md   → .agent/agents/test-agent.md
AGENT-PLATFORM-TEMPLATES/.agent/CONVENTIONS.md         → .agent/CONVENTIONS.md
AGENT-PLATFORM-TEMPLATES/.agent/CHECKLIST.md           → .agent/CHECKLIST.md
AGENT-PLATFORM-TEMPLATES/.agent/BEST-PRACTICES.md      → .agent/BEST-PRACTICES.md
AGENT-PLATFORM-TEMPLATES/.agent/playbooks/api-integration.md → .agent/playbooks/api-integration.md
```
> Preserve the `## Project-specific` section at the bottom of `CONVENTIONS.md` — it contains your project's custom rules.

---

### Upgrading 2.0 → 2.3

**What changed:** 2.0.x was a pre-public private build with manifest version `2.0.0` but templates equivalent to 2.1.0.  
**Risk:** Low-medium — if you have project-specific content in stubs, preserve it manually.

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

This adds any files in the new manifest that are missing from your repo without touching existing files.
Then follow the placeholder fill step from the 2.1 → 2.3 guide above.

---

### Upgrading 1.x → 2.3

**What changed:** v2 is a full rebuild — new directory structure, multi-framework architecture, manifest-driven installer.  
**Risk:** High — no automated migration path.

```bash
# 1. Back up your existing agent folder
# 2. Run fresh install into your repo root
npx github:zafrirron/Agent-Platform

# 3. After install completes, tell your agent to fill stubs:
#    Read .agent/README.md and fill all stub files for this project.

# 4. Manually re-apply project-specific content from your backup:
#    .agent/CONVENTIONS.md  →  ## Project-specific section
#    .agent/WORKFLOWS.md, FILE_MAP.md, ZONES.md
#    .agent/context/ files (api-contracts, known-issues, dependencies, adr-log)
```

Key structural differences from 1.x:

| 1.x | 2.x |
|-----|-----|
| Single IDE folder | 4 IDE private folders + shared `.agent/` hub |
| No registry | `registry.yaml` cross-IDE lock |
| No handoff log | `CURRENT.md` session log |
| No specialist agents | 8 domain expert personas |
| No playbooks | 7 step-by-step playbooks |
| No caveman skill | Token compression wired into all 4 frameworks |
