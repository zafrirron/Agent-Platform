# Agent Platform — End-to-End Test Plan v3

Tests the full platform lifecycle. Uses two AI frameworks: **Claude Code** and **Antigravity**.

## Automated vs manual split

```
npm test   ← runs all automated checks (125 assertions, ~4s)
           covers: install, platform.json fields, placeholders, two-section markers,
                   upgrade PROJECT preservation, uninstall + restore,
                   global install, global uninstall, USER content preservation,
                   global/project scope independence
```

**Automated (npm test):**

| Phase | What | Test file |
|-------|------|-----------|
| 1 | Install: files, platform.json fields, placeholders, gitignore, backup, two-section markers | `apply-integration.test.mjs` |
| 1 | Install: global stubs suggestion in stdout | `apply-integration.test.mjs` |
| 8 | Upgrade: PROJECT section preserved, PLATFORM section updated | `apply-integration.test.mjs` |
| 9 | Uninstall dry-run + confirm: platform removed, user files intact, CLAUDE.md restored | `apply-integration.test.mjs` |
| 10 | Global install: all stubs created, no raw placeholders, version file, PLATFORM/USER markers | `global-install.test.mjs` |
| 10 | Global install idempotent: no duplicate blocks after re-run | `global-install.test.mjs` |
| 10 | Global install upgrade: USER content preserved | `global-install.test.mjs` |
| 12 | Global uninstall dry-run: no changes made | `global-install.test.mjs` |
| 12 | Global uninstall confirm: pure files deleted, USER content kept in patched file | `global-install.test.mjs` |
| 12 | Global uninstall: project install untouched | `global-install.test.mjs` |

**Manual only (requires live AI agent):**

| Phase | Why manual |
|-------|-----------|
| 2 | Session start — requires Claude Code to execute session-start.md |
| 2b | Full project audit — requires AI to run 8 expert passes |
| 3 | Auto-routing — requires AI to route 6 prompt types silently |
| 4 | Security gate — requires AI to implement auth and trigger Step 5a |
| 5 | Session end — requires AI to derive summary and commit via shell tools |
| 6 | Cross-framework Critic — requires two different AI frameworks |
| 7 | Framework takeover — requires AI to detect and respond to stuck session |
| 11 | Global stub activation — requires AI to read ~/.claude/CLAUDE.md and act on it |

---

---

## Before you start

Choose a clean empty folder as your test directory. Examples:

```bash
# Linux / macOS
export TEST_DIR=/tmp/platform-e2e

# Windows PowerShell
$TEST_DIR = "$env:TEMP\platform-e2e"
```

All steps below use `<TEST_DIR>` — substitute your chosen path.

The todo-app source files are in `tests/todo-app/` in this repo. Copy them to your test folder
in Phase 0.

---

## Phase 0 — Clean slate

```bash
# Create test folder and copy todo-app source
mkdir <TEST_DIR>
cp -r tests/todo-app/. <TEST_DIR>/    # Linux/macOS
# or: Copy-Item tests\todo-app\* <TEST_DIR>\ -Recurse  # Windows

# Initialise git
cd <TEST_DIR>
git init
git add -A
git commit -m "chore: initial todo app (pre-platform)"

# Clear npx cache so latest version installs
# Linux/macOS:
rm -rf ~/.npm/_npx
# Windows:
Remove-Item "$env:LOCALAPPDATA\npm-cache\_npx" -Recurse -Force -ErrorAction SilentlyContinue
```

**Verify starting state:**
- `CLAUDE.md` present → pre-existing (will be backed up by installer)
- `AGENTS.md` present → pre-existing (will be backed up by installer)
- `.agent/` absent → platform not installed yet
- `src/app.js` present → todo app source

---

## Phase 1 — Install (fresh install with pre-existing AI configs)

```bash
cd <TEST_DIR>
npx github:zafrirron/Agent-Platform
```

### Verify install summary shows:
- [ ] Version: v2.25.0
- [ ] `npx jest` detected as test runner
- [ ] Pre-existing CLAUDE.md and AGENTS.md noted as backed up
- [ ] MIGRATION-NOTES.md created
- [ ] `○  Global stubs  not installed — run: npx ... --mode=global` line present (global stubs not yet installed on this machine)

### Verify key files:
```bash
# Linux/macOS — check exits 0
test -f <TEST_DIR>/.agent/session-start.md   && echo "OK: session-start.md"
test -f <TEST_DIR>/.agent/QUICK-REF.md       && echo "OK: QUICK-REF.md"
test -f <TEST_DIR>/.agent/platform.json      && echo "OK: platform.json"
test -f <TEST_DIR>/.agent/handoff/CURRENT.md && echo "OK: CURRENT.md"
test -f <TEST_DIR>/.agent/context/docs-registry.md && echo "OK: docs-registry.md"
test -f <TEST_DIR>/.agent/MIGRATION-NOTES.md && echo "OK: MIGRATION-NOTES.md"
```

```powershell
# Windows
Test-Path "<TEST_DIR>\.agent\session-start.md"          # True
Test-Path "<TEST_DIR>\.agent\QUICK-REF.md"              # True
Test-Path "<TEST_DIR>\.agent\platform.json"             # True
Test-Path "<TEST_DIR>\.agent\handoff\CURRENT.md"        # True
Test-Path "<TEST_DIR>\.agent\context\docs-registry.md"  # True
Test-Path "<TEST_DIR>\.agent\MIGRATION-NOTES.md"        # True
```

### Verify backup created — original AI configs preserved:
```bash
ls <TEST_DIR>/.agent/backup/          # must show pre-install-* folder
```
Read the backed-up file and confirm it contains the original pre-existing content
("This is a pre-existing CLAUDE.md to test platform backup and restore").

### Verify two-section model installed correctly:
```bash
grep -c "PLATFORM:START\|PROJECT:START" <TEST_DIR>/.agent/agents/backend-agent.md
# must return 2 (both markers present)
```

### Verify platform.json:
```bash
node -e "const p=require('<TEST_DIR>/.agent/platform.json'); console.log(p.bootstrap_version, p.test_runner, p.platform_repo, p.platform_npx)"
# 2.25.0  npx jest  zafrirron/Agent-Platform  github:zafrirron/Agent-Platform
```
- [ ] `platform_repo` field present and correct
- [ ] `platform_npx` field present and correct

### Verify gitignore block written:
```bash
grep "Agent Platform Bootstrap" <TEST_DIR>/.gitignore
# must show the START/END markers
```

---

## Phase 2 — Session Start (Claude Code)

Open Claude Code in `<TEST_DIR>`. New chat. Paste:
```
Read .agent/session-start.md and execute it.
```

### Verify:
- [ ] Step 1: registry.yaml — claude set to active, no conflict
- [ ] Step 1b: No Critic offer (first session — nothing prior to review)
- [ ] Step 1d: **First-session audit offer displayed** (no completed sessions exist yet):
  ```
  ┌──────────────────────────────────────────────────────────────────┐
  │  First session detected — Full Project Audit available           │
  │  Run a professional audit across 8 domains...                    │
  │  Run audit now? YES / NO (run manually later)                    │
  └──────────────────────────────────────────────────────────────────┘
  ```
  Reply **NO** — continue session without running audit (audit tested separately in Phase 2b)
- [ ] Step 1d: After NO — session proceeds to Step 2 without running audit
- [ ] Step 2: test runner already set (npx jest) — setup-test-runner skipped silently
- [ ] Step 5: Compact 4-line status block — NOT the full QUICK-REF table
- [ ] Step 5: `📄 .agent/QUICK-REF.md` link appears **outside** the code block
- [ ] Step 7: Auto-routing activated silently
- [ ] Step 8: `Ready. Tell me what you want to do.`

### Verify Step 1d does NOT fire on second session:
End and restart the session. Verify the audit offer does NOT appear again (CURRENT.md now has a session entry).
- [ ] Audit offer absent on second and subsequent sessions

### Test `/quick-ref` slash command (Claude Code):
Type `/quick-ref` in the chat.
- [ ] Full QUICK-REF.md displayed

### Test "show quick reference" trigger:
Type `show quick reference`
- [ ] Agent outputs one line pointing to the file — does NOT dump full table in chat

---

## Phase 2b — Full Project Audit

This phase tests both the audit playbook directly and the first-session YES path in isolation.

### Step A — Manual trigger (in active Claude Code session)

In the same session as Phase 2, type:
```
Run project audit
```

### Verify expert sequencing (8 domains):
- [ ] **Phase 1 — Architect:** produces component inventory, dependency map, ASCII architecture diagram
- [ ] **Phase 2 — Docs:** documentation inventory, staleness check, gap identification
- [ ] **Phase 3 — Security:** secrets scan result, OWASP Top 10 assessment, CVE check
- [ ] **Phase 4 — Test:** coverage assessment, missing regression tests identified
- [ ] **Phase 5 — Critic:** dead code, error handling gaps, complexity hotspots
- [ ] **Phase 6 — Data:** schema quality, migration safety, PII handling
- [ ] **Phase 7 — Backend:** API endpoint inventory, auth coverage, api-contracts.md completeness
- [ ] **Phase 8 — DevOps:** CI/CD health, secrets management, rollback strategy

### Verify report output:
```bash
ls <TEST_DIR>/.agent/context/audit-*.md   # must show exactly one file named audit-YYYY-MM-DD-HH-MM.md
```
- [ ] Report file created at `.agent/context/audit-YYYY-MM-DD-HH-MM.md`
- [ ] Report contains executive summary table with per-domain health indicators (🟢🟡🔴)
- [ ] Report contains findings by severity (Critical → High → Medium → Low)
- [ ] Report contains Quick wins section
- [ ] Report contains Prioritised action plan

### Step B — First-session YES path (clean scratch folder)

Create a separate scratch folder to test the YES path in isolation:
```bash
mkdir <AUDIT_TEST_DIR>
cd <AUDIT_TEST_DIR>
git init
npx github:zafrirron/Agent-Platform
```

Open in Claude Code. Start session:
```
Read .agent/session-start.md and execute it.
```

When the Step 1d offer appears, reply **YES**.

- [ ] Audit runs immediately — all 8 expert passes complete
- [ ] Report generated at `.agent/context/audit-YYYY-MM-DD-HH-MM.md`
- [ ] After audit completes, session proceeds to Step 2 (not stuck or stopped)
- [ ] `Ready. Tell me what you want to do.` shown after audit

---

## Phase 3 — Auto-routing (6 prompts)

Type each prompt. Agent routes silently — no announcement of which file was loaded.

| Prompt | Expected routing |
|--------|-----------------|
| `fix the create todo endpoint — it doesn't validate the title` | Backend + bug-fix |
| `add a due date field to todos` | Backend + add-feature |
| `check if the API is secure` | Security + security-audit |
| `write tests for the todos router` | Test expert |
| `document the API` | Docs expert → OpenAPI/Swagger |
| `I'm ready to cut a release` | DevOps + release playbook |

---

## Phase 4 — Security gate (add-feature Step 5a)

```
Add user authentication — each todo should belong to a user.
Users authenticate with a token in the Authorization header.
```

### Verify automatic expert chaining:
- [ ] Architect: cross-cutting scope noted, ADR before code
- [ ] Backend: implements JWT auth (sub claim, owner field, 404 on wrong owner)
- [ ] **Step 5a fires automatically**: Security expert reviews new auth code
- [ ] Test expert: tests for auth logic
- [ ] Critic: 6-dimension adversarial review
- [ ] No handoff until all gates pass

---

## Phase 5 — Session End (Claude Code)

```
End session.
```

### Verify:
- [ ] Agent derives goal and file list from session context — does NOT ask user to recap
- [ ] Step 2c: Agent checks `git status` and commits any uncommitted changes using shell tools
- [ ] Working tree confirmed clean before proceeding
- [ ] CURRENT.md updated: goal · files · `Commit:` hash · `Critic reviewed: no`
- [ ] registry.yaml: claude → idle · `meta.updated_by: claude`
- [ ] Output: `Session ended. Framework: claude → idle.`

---

## Phase 6 — Cross-framework Critic (switch to Antigravity)

Open `<TEST_DIR>` in **Antigravity**. New session. Paste:
```
Read .agent/session-start.md and execute it.
```

### Verify Step 1b fires the Critic offer box:
```
┌─────────────────────────────────────────────────────────────────┐
│  Cross-framework Critic review available                        │
│  Last session: claude — [goal from CURRENT.md]                  │
│  Files changed: [list from CURRENT.md]                          │
│  A different AI model did this work. Would you like me to run   │
│  a Critic review before we proceed?                             │
│  Reply YES to review, NO to proceed directly.                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key check:** If this box does NOT appear, the `previous_framework` capture bug has returned.

Say **YES**. Verify:
- [ ] Critic runs cold 6-dimension review on files from CURRENT.md
- [ ] Findings shown with severity ratings
- [ ] CURRENT.md updated: `Critic reviewed: yes — X Critical, Y High, Z Medium`
- [ ] Offer not shown again in this session

---

## Phase 7 — Framework takeover

### Setup: simulate a stuck session
Manually edit `<TEST_DIR>/.agent/handoff/sync/registry.yaml`:
Set claude `status: active` with a task description (simulating it ran out of credits).

Then in Antigravity, start a new session:
```
Read .agent/session-start.md and execute it.
```

### Verify takeover offer:
```
┌─────────────────────────────────────────────────────────────────┐
│  claude has an open session                                     │
│  Task : [task from registry]                                    │
│  1. Take over — commit uncommitted work, close it, continue     │
│  2. Wait — end the other session first if still running         │
└─────────────────────────────────────────────────────────────────┘
```

Say **1**. Verify:
- [ ] Agent checks `git status` and commits if uncommitted changes exist
- [ ] registry.yaml: claude set to idle
- [ ] Antigravity session starts
- [ ] Cross-framework Critic offer follows

---

## Phase 8 — Upgrade two-section model

### Step A: Add a project-specific rule (simulates user customisation)
In Antigravity session, ask:
```
Add a project-specific backend rule: all our endpoints must respond in under 200ms
```
The agent adds this to the PROJECT section of backend-agent.md.

Verify before upgrade:
```bash
grep "200ms" <TEST_DIR>/.agent/agents/backend-agent.md   # must find it in PROJECT section
```

### Step B: End session and run upgrade
```
End session.
```
Then in terminal:
```bash
# Clear npx cache first
rm -rf ~/.npm/_npx   # Linux/macOS
# or: Remove-Item "$env:LOCALAPPDATA\npm-cache\_npx" -Recurse -Force  # Windows

npx github:zafrirron/Agent-Platform --mode=upgrade
```

### Step C: Verify after upgrade
```bash
# PROJECT section preserved (user rule still there)
grep "200ms" <TEST_DIR>/.agent/agents/backend-agent.md   # must still find it

# PLATFORM section updated (F003 mass-assignment rule from web audit)
grep -i "mass assignment" <TEST_DIR>/.agent/agents/backend-agent.md   # must find it

# Pure platform file fully replaced (session-start-shared.md has new trigger text)
grep "open .agent/QUICK-REF.md in your editor" <TEST_DIR>/.agent/session-start-shared.md   # must find it
```

---

## Phase 9 — Uninstall (project scope)

> This phase tests project-scope uninstall only. Global scope is tested separately in Phase 12.

### Dry run (no changes):
```bash
npx github:zafrirron/Agent-Platform --mode=uninstall
```
Verify output lists all platform folders — zero changes made.

### Real uninstall:
```bash
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
```

### Verify after uninstall:
```bash
# Platform folders gone
test ! -d <TEST_DIR>/.agent   && echo "OK: .agent removed"
test ! -d <TEST_DIR>/.claude  && echo "OK: .claude removed"
test ! -d <TEST_DIR>/.cursor  && echo "OK: .cursor removed"
test ! -d <TEST_DIR>/.agents  && echo "OK: .agents removed"
test ! -d <TEST_DIR>/.codex   && echo "OK: .codex removed"

# Pre-existing AI configs RESTORED from backup
grep "pre-existing CLAUDE.md" <TEST_DIR>/CLAUDE.md   # original content restored
grep "pre-existing AGENTS.md" <TEST_DIR>/AGENTS.md   # original content restored

# User source untouched
test -f <TEST_DIR>/src/app.js   && echo "OK: src intact"

# Platform gitignore block removed
grep -c "Agent Platform Bootstrap" <TEST_DIR>/.gitignore   # must return 0

# Git history intact
git -C <TEST_DIR> log --oneline   # must show full history
```

---

---

## Phase 10 — Global Install

> Requires: a clean machine where `--mode=global` has not been run yet (or manually delete `~/.agent-platform/global-version` to reset).

### Step A — Run global install

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

### Verify installer output:
- [ ] Header: `Agent Platform Bootstrap vX.Y.Z — Global Install`
- [ ] Target path shown: your home directory
- [ ] `✔ Created: ~/.claude/CLAUDE.md`
- [ ] `✔ Created: ~/.claude/commands/caveman.md` (and other commands)
- [ ] `✔ Created: ~/.cursor/rules/agent-platform-global.mdc`
- [ ] `✔ Created: ~/.codex/instructions.md`
- [ ] `✔ Created: ~/.agents/rules/agent-platform-global.md`
- [ ] `✔ Created: ~/.agent-platform/global-version`
- [ ] Summary section: "How it works" bullet points present

### Verify stubs created on disk:

```bash
# Linux/macOS
test -f ~/.claude/CLAUDE.md                                 && echo "OK"
test -f ~/.claude/commands/caveman.md                       && echo "OK"
test -f ~/.cursor/rules/agent-platform-global.mdc           && echo "OK"
test -f ~/.codex/instructions.md                            && echo "OK"
test -f ~/.agents/rules/agent-platform-global.md            && echo "OK"
test -f ~/.agent-platform/global-version                    && echo "OK"
```

```powershell
# Windows
Test-Path "~\.claude\CLAUDE.md"                              # True
Test-Path "~\.claude\commands\caveman.md"                    # True
Test-Path "~\.cursor\rules\agent-platform-global.mdc"        # True
Test-Path "~\.codex\instructions.md"                         # True
Test-Path "~\.agents\rules\agent-platform-global.md"         # True
Test-Path "~\.agent-platform\global-version"                 # True
```

### Verify stub content:
```bash
# PLATFORM:START / PLATFORM:END markers present
grep "PLATFORM:START" ~/.claude/CLAUDE.md    && echo "OK"
# USER section present
grep "USER:START"     ~/.claude/CLAUDE.md    && echo "OK"
# {{PLATFORM_NPX}} placeholder substituted — no raw placeholder in deployed file
grep "PLATFORM_NPX"  ~/.claude/CLAUDE.md    && echo "FAIL — placeholder not substituted"
```
- [ ] PLATFORM:START and PLATFORM:END present in all stub files
- [ ] USER:START and USER:END present in all stub files
- [ ] No `{{PLATFORM_NPX}}` literal in deployed stubs (must be substituted to actual value)
- [ ] `~/.agent-platform/global-version` contains correct version JSON

### Verify version file content:
```bash
node -e "const v=require(require('os').homedir()+'/.agent-platform/global-version'); console.log(v.version, v.platform_repo)"
# 2.25.0  zafrirron/Agent-Platform
```

### Step B — Re-run project install; verify summary shows global stubs installed

In `<TEST_DIR>` (or any project with platform installed), open Claude Code and trigger an install or check:

```bash
cd <TEST_DIR>
npx github:zafrirron/Agent-Platform --mode=repair
```

- [ ] Install summary shows: `✔  Global stubs  installed (v2.25.0) — platform activates in all your repos`
- [ ] The `○  Global stubs  not installed` suggestion line is **absent**

### Step C — Upgrade global stubs (idempotent run)

Run `--mode=global` again with stubs already installed:

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

- [ ] Files with no USER content: show `✔ Updated:` (overwritten with latest)
- [ ] No duplicate PLATFORM blocks in updated files
- [ ] USER:START/END block is present and unchanged after upgrade

---

## Phase 11 — Global Stub Activation

Tests the per-repo detection logic baked into the global stubs. Uses Claude Code (reads `~/.claude/CLAUDE.md` automatically).

### Setup — three test repos

```bash
# Repo A: platform installed (has AGENTS.md)
mkdir <GLOBAL_TEST_A>
cd <GLOBAL_TEST_A> && git init
npx github:zafrirron/Agent-Platform

# Repo B: no platform, no skip file
mkdir <GLOBAL_TEST_B>
cd <GLOBAL_TEST_B> && git init && echo "# Empty repo" > README.md

# Repo C: no platform, has skip file
mkdir <GLOBAL_TEST_C>
cd <GLOBAL_TEST_C> && git init
touch .agent-platform-skip
```

### Test A — Repo with platform installed

Open `<GLOBAL_TEST_A>` in Claude Code. Start a new chat. Type any task (e.g. `"fix a bug"`).

- [ ] Claude routes silently to the correct expert — no announcement
- [ ] No install offer displayed (AGENTS.md present → offer suppressed)

### Test B — Repo without platform (install offer)

Open `<GLOBAL_TEST_B>` in Claude Code. Start a new chat. Type any message.

- [ ] Install offer displayed at the start of the first response:
  ```
  ┌──────────────────────────────────────────────────────────────────┐
  │  Agent Platform not detected in this repo                        │
  │  Install?  YES · NO · SKIP                                       │
  └──────────────────────────────────────────────────────────────────┘
  ```
- [ ] Reply **YES** → Claude runs `npx github:zafrirron/Agent-Platform` in repo root
- [ ] Platform files appear in `<GLOBAL_TEST_B>` after install completes
- [ ] Session continues after install

### Test B2 — NO response

Repeat Test B in a fresh repo. Reply **NO**.
- [ ] Claude proceeds normally without installing
- [ ] Offer does not appear again in the same session

### Test C — Repo with `.agent-platform-skip`

Open `<GLOBAL_TEST_C>` in Claude Code. Start a new chat. Type any message.

- [ ] Install offer is **NOT** displayed
- [ ] Claude proceeds normally without mentioning the platform

### Test D — SKIP response creates skip file

Open another fresh repo (no `.agent-platform-skip`). Reply **SKIP** when offer appears.
- [ ] `.agent-platform-skip` file created at repo root
- [ ] Offer does not appear if the session is reopened

---

## Phase 12 — Global Uninstall

### Setup: add USER content to one stub

Before uninstalling, add personal preferences to the USER section:

```bash
# Append user content inside the USER section of ~/.claude/CLAUDE.md
# Edit the file so USER:START / USER:END contains:
# Always use caveman lite output mode.
```

Verify the file contains:
```bash
grep "caveman lite" ~/.claude/CLAUDE.md   # must find it
```

### Step A — Dry run

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall-global
```

Verify dry run output:
- [ ] Header: `Agent Platform Bootstrap — Uninstall Global Stubs`
- [ ] `⚠️  DRY RUN — nothing deleted`
- [ ] `~/.claude/CLAUDE.md` listed under **Will be PATCHED** (has USER content)
- [ ] Other stub files (no USER content) listed under **Will be DELETED**
- [ ] `~/.claude/commands/caveman.md` etc. listed under **Will be DELETED**
- [ ] Nothing actually changed on disk

### Step B — Confirm uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall-global --confirm
```

Verify after uninstall:

```bash
# ~/.claude/CLAUDE.md: PATCHED — platform block removed, user content kept
grep "PLATFORM:START"  ~/.claude/CLAUDE.md  && echo "FAIL — platform block still there"
grep "caveman lite"    ~/.claude/CLAUDE.md  && echo "OK — user content preserved"

# Other stub files: DELETED
test ! -f ~/.cursor/rules/agent-platform-global.mdc  && echo "OK: cursor stub removed"
test ! -f ~/.codex/instructions.md                   && echo "OK: codex stub removed"
test ! -f ~/.agents/rules/agent-platform-global.md   && echo "OK: agents stub removed"

# Commands: DELETED
test ! -f ~/.claude/commands/caveman.md              && echo "OK: command removed"

# Version tracking: DELETED
test ! -f ~/.agent-platform/global-version           && echo "OK: version file removed"
```

- [ ] `~/.claude/CLAUDE.md` still exists and contains the user's `caveman lite` preference
- [ ] PLATFORM:START/END block absent from `~/.claude/CLAUDE.md`
- [ ] All other stub files deleted (no USER content was added to them)
- [ ] All command files deleted
- [ ] `~/.agent-platform/global-version` deleted

### Step C — Verify project install unaffected

```bash
test -d <TEST_DIR>/.agent   && echo "OK: project install untouched"
```
- [ ] Project platform files in `<TEST_DIR>` completely unchanged by global uninstall

---

## Pass / Fail Summary

| Phase | Test | Pass condition |
|-------|------|----------------|
| 0 | Clean state | Pre-existing CLAUDE.md + AGENTS.md present, .agent/ absent |
| 1 | Install | v2.25.0, jest detected, backup created, MIGRATION-NOTES.md exists, two-section markers present, global stub suggestion shown, platform.json has platform_repo + platform_npx |
| 2 | Session start | Step 1d audit offer appears (first session); NO path proceeds; offer absent on second session; compact status block; /quick-ref works |
| 2b | Full project audit — manual | 8 expert passes complete, report at correct path, executive summary + findings sections present |
| 2b | Full project audit — YES path | Fresh repo: offer appears, YES runs all 8 passes, session continues after audit |
| 3 | Auto-routing | 6 prompts routed silently to correct expert/playbook |
| 4 | Security gate | add-feature Step 5a fires automatically for auth feature |
| 5 | Session end | Agent derives summary, commits work via shell, CURRENT.md has commit hash |
| 6 | Cross-framework Critic | Offer box appears in Antigravity, YES triggers 6-dim cold review |
| 7 | Framework takeover | Offer appears for stuck session, takeover completes cleanly |
| 8 | Upgrade two-section | PROJECT section preserved, PLATFORM updated, pure platform files replaced |
| 9 | Project uninstall dry-run | Lists all files, zero changes made |
| 9 | Project uninstall confirm | Platform gone, original CLAUDE.md + AGENTS.md restored, src/ intact |
| 10A | Global install | 6 stub files created, version file created, no raw {{placeholders}} in deployed files |
| 10B | Post-install summary | Repair run shows ✔ Global stubs installed with version |
| 10C | Global upgrade (idempotent) | Re-run --mode=global: updated without duplicate blocks, USER section preserved |
| 11A | Global activation — installed repo | Claude routes silently, no offer |
| 11B | Global activation — uninstalled repo | Offer displayed; YES installs; NO proceeds; SKIP creates skip file |
| 11C | Global activation — skip file | Offer suppressed when .agent-platform-skip present |
| 12A | Global uninstall dry-run | Correct files listed as DELETE vs PATCH, zero changes made |
| 12B | Global uninstall confirm | USER content preserved in patched file; pure platform files deleted; project install untouched |
