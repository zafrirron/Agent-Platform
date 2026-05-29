# Changelog

All notable changes to **Agent Platform Bootstrap** are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [Semantic Versioning](https://semver.org/).

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
