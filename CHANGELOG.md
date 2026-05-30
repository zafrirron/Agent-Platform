# Changelog

All notable changes to **Agent Platform Bootstrap** are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [Semantic Versioning](https://semver.org/).

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
