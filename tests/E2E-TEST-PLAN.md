# Agent Platform — End-to-End Test Plan v2

Tests the full platform lifecycle. Uses two AI frameworks: **Claude Code** and **Antigravity**.
Covers: install with pre-existing AI configs · backup/restore · session start/end · auto-routing ·
multi-expert · security gate · cross-framework Critic · framework takeover · upgrade two-section
model · uninstall.

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
- [ ] Version: v2.22.0
- [ ] `npx jest` detected as test runner
- [ ] Pre-existing CLAUDE.md and AGENTS.md noted as backed up
- [ ] MIGRATION-NOTES.md created

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
node -e "const p=require('<TEST_DIR>/.agent/platform.json'); console.log(p.bootstrap_version, p.test_runner)"
# 2.22.0  npx jest
```

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
- [ ] Step 2: test runner already set (npx jest) — setup-test-runner skipped silently
- [ ] Step 5: Compact 4-line status block — NOT the full QUICK-REF table
- [ ] Step 5: `📄 .agent/QUICK-REF.md` link appears **outside** the code block
- [ ] Step 7: Auto-routing activated silently
- [ ] Step 8: `Ready. Tell me what you want to do.`

### Test `/quick-ref` slash command (Claude Code):
Type `/quick-ref` in the chat.
- [ ] Full QUICK-REF.md displayed

### Test "show quick reference" trigger:
Type `show quick reference`
- [ ] Agent outputs one line pointing to the file — does NOT dump full table in chat

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

## Phase 9 — Uninstall

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

## Pass / Fail Summary

| Phase | Test | Pass condition |
|-------|------|----------------|
| 0 | Clean state | Pre-existing CLAUDE.md + AGENTS.md present, .agent/ absent |
| 1 | Install | v2.22.0, jest detected, backup created, MIGRATION-NOTES.md exists, two-section markers present |
| 2 | Session start | Compact 4-line block, QUICK-REF link clickable outside code block, /quick-ref works |
| 3 | Auto-routing | 6 prompts routed silently to correct expert/playbook |
| 4 | Security gate | add-feature Step 5a fires automatically for auth feature |
| 5 | Session end | Agent derives summary, commits work via shell, CURRENT.md has commit hash |
| 6 | Cross-framework Critic | Offer box appears in Antigravity, YES triggers 6-dim cold review |
| 7 | Framework takeover | Offer appears for stuck session, takeover completes cleanly |
| 8 | Upgrade two-section | PROJECT section preserved, PLATFORM updated, pure platform files replaced |
| 9 | Uninstall dry-run | Lists all files, zero changes made |
| 9 | Uninstall confirm | Platform gone, original CLAUDE.md + AGENTS.md restored, src/ intact |
