# Agent Platform — End-to-End Test Plan v2

Tests the full platform lifecycle using two AI frameworks: **Claude Code** and **Antigravity**.
Covers: install with pre-existing AI configs · session start/end · auto-routing · multi-expert ·
security gate · cross-framework Critic · framework takeover · upgrade two-section model · uninstall.

---

## Setup — one command

```powershell
# From the platform repo root — resets E:\Test to clean state with pre-existing AI configs
.\tests\setup-test-folder.ps1
```

This clears E:\Test, copies the todo-app source files (including pre-existing CLAUDE.md and AGENTS.md),
initialises git, commits, and clears the npx cache. Run this before every E2E test run.

---

## Phase 0 — Verify clean state

```powershell
Test-Path "E:\Test\CLAUDE.md"           # True  — pre-existing (will be backed up)
Test-Path "E:\Test\AGENTS.md"           # True  — pre-existing (will be backed up)
Test-Path "E:\Test\.agent"              # False — platform not installed yet
Test-Path "E:\Test\src\app.js"         # True  — todo app source
git -C "E:\Test" log --oneline          # 1 commit: "chore: initial todo app (pre-platform)"
```

---

## Phase 1 — Install (fresh install with pre-existing AI configs)

```powershell
cd E:\Test
npx github:zafrirron/Agent-Platform
```

### Verify install summary shows:
- [ ] Version: v2.22.0
- [ ] Jest detected as test runner
- [ ] Pre-existing CLAUDE.md and AGENTS.md noted as backed up
- [ ] MIGRATION-NOTES.md created

### Verify key files:
```powershell
Test-Path "E:\Test\.agent\session-start.md"          # True
Test-Path "E:\Test\.agent\QUICK-REF.md"              # True
Test-Path "E:\Test\.agent\platform.json"             # True
Test-Path "E:\Test\.agent\handoff\CURRENT.md"        # True
Test-Path "E:\Test\.agent\context\docs-registry.md" # True
Test-Path "E:\Test\CLAUDE.md"                        # True  — platform version installed
Test-Path "E:\Test\AGENTS.md"                        # True  — platform version installed
Test-Path "E:\Test\.agent\MIGRATION-NOTES.md"        # True
```

### Verify backup created:
```powershell
Get-ChildItem "E:\Test\.agent\backup" -Recurse | Select-Object Name
# Must show: pre-install-* folder containing original CLAUDE.md and AGENTS.md
```

### Verify pre-existing content backed up (not lost):
```powershell
$backup = Get-ChildItem "E:\Test\.agent\backup\pre-install-*" | Select-Object -First 1
Get-Content (Get-ChildItem $backup.FullName | Where-Object { $_.Name -like "*CLAUDE*" }).FullName
# Must show original content: "This is a pre-existing CLAUDE.md..."
```

### Verify gitignore block:
```powershell
Select-String "Agent Platform Bootstrap" "E:\Test\.gitignore"
# Must show START and END markers
```

### Verify two-section model in backend-agent.md:
```powershell
Select-String "PLATFORM:START|PROJECT:START" "E:\Test\.agent\agents\backend-agent.md"
# Must show both markers
```

### Verify platform.json:
```powershell
$p = Get-Content "E:\Test\.agent\platform.json" | ConvertFrom-Json
"version: $($p.bootstrap_version)"   # 2.22.0
"test_runner: $($p.test_runner)"     # npx jest
```

---

## Phase 2 — Session Start (Claude Code)

Open Claude Code in `E:\Test`. New chat. Paste:
```
Read .agent/session-start.md and execute it.
```

### Verify:
- [ ] Step 1: registry.yaml — claude set to active
- [ ] Step 1b: No Critic offer (first session — nothing to review)
- [ ] Step 2: test runner already set (npx jest) — setup-test-runner skipped silently
- [ ] Step 3: Update check runs or is skipped
- [ ] Step 5: Compact 4-line status block shown (NOT the full QUICK-REF table)
- [ ] Step 5: Reference line shows clickable `📄 .agent/QUICK-REF.md` link outside the code block
- [ ] Step 7: Auto-routing activated silently
- [ ] Step 8: `Ready. Tell me what you want to do.`

### Test /quick-ref slash command (Claude Code only):
Type `/quick-ref` in the chat.
- [ ] Agent reads and displays `.agent/QUICK-REF.md` in full

### Test "show quick reference" trigger:
Type `show quick reference`
- [ ] Agent outputs one line pointing to the file — does NOT dump the full table in chat

---

## Phase 3 — Auto-routing (6 prompts)

Type each prompt. Agent must route silently — no announcement of which file it loaded.

| Prompt | Expected routing | Pass? |
|--------|-----------------|-------|
| `fix the create todo endpoint — it doesn't validate the title` | Backend + bug-fix | |
| `add a due date field to todos` | Backend + add-feature | |
| `check if the API is secure` | Security + security-audit | |
| `write tests for the todos router` | Test expert | |
| `document the API` | Docs expert → Swagger/OpenAPI | |
| `I'm ready to cut a release` | DevOps + release playbook | |

**For each:** agent starts working in the correct persona without asking which file to load.

---

## Phase 4 — Security gate (add-feature Step 5a)

Paste this as one message:
```
Add user authentication — each todo should belong to a user.
Users authenticate with a token in the Authorization header.
```

### Verify the playbook chains automatically:
- [ ] Architect expert: cross-cutting scope noted, ADR created before any code
- [ ] Backend expert: implements auth (JWT sub claim, owner field, 404 on wrong owner)
- [ ] **Step 5a fires automatically**: Security expert reviews new auth code (no user prompt needed)
  - Checks: input validation, auth enforcement, data exposure, injection vectors
  - BLOCKED if Critical/High finding — must be addressed before continuing
- [ ] Test expert: writes tests for auth logic
- [ ] Critic: 6-dimension adversarial review
- [ ] Agent does NOT hand off until all gates pass

---

## Phase 5 — Session End (Claude Code)

```
End session.
```

### Verify agent derives everything from context (no user recap needed):
- [ ] Agent summarises goal and files from session context — does NOT ask user what changed
- [ ] **Step 2c: Agent checks for uncommitted changes**
  - If uncommitted work exists: agent runs `git add -A` and `git commit -m "..."` using shell tools
  - Working tree confirmed clean before proceeding
- [ ] Step 2b: New .md files scan — any unregistered docs flagged
- [ ] CURRENT.md updated:
  - Goal derived from session context
  - Files changed listed explicitly
  - `Commit:` field populated with commit hash
  - `Critic reviewed: no`
- [ ] registry.yaml: claude → idle, `meta.updated_by: claude`
- [ ] Output: `Session ended. Framework: claude → idle.`

---

## Phase 6 — Cross-framework Critic (switch to Antigravity)

Open `E:\Test` in **Antigravity**. New session. Paste:
```
Read .agent/session-start.md and execute it.
```

### Verify Step 1b fires the Critic offer:
```
┌─────────────────────────────────────────────────────────────────┐
│  Cross-framework Critic review available                        │
│                                                                 │
│  Last session: claude — [goal from CURRENT.md]                  │
│  Files changed: [list from CURRENT.md]                          │
│                                                                 │
│  A different AI model did this work. Would you like me to run   │
│  a Critic review before we proceed?                             │
│                                                                 │
│  Reply YES to review, NO to proceed directly.                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key check:** This box must appear. If it doesn't, the `previous_framework` capture bug has returned.

Say **YES**. Verify:
- [ ] Critic loads in cross-framework cold review mode
- [ ] Reviews files listed in CURRENT.md
- [ ] Full 6-dimension review: correctness · security · edge cases · intent vs implementation · test coverage · handoff quality
- [ ] Findings shown with severity ratings
- [ ] CURRENT.md updated: `Critic reviewed: yes — X Critical, Y High, Z Medium`
- [ ] Offer NOT shown again in the same session (one-time per handoff)

---

## Phase 7 — Framework takeover test

### Setup: simulate a stuck session
In Antigravity terminal, edit `E:\Test\.agent\handoff\sync\registry.yaml`:
Set `claude: status: active` with a task (simulating Claude ran out of credits mid-session).

Then in Antigravity, start a NEW session:
```
Read .agent/session-start.md and execute it.
```

### Verify takeover offer appears:
```
┌─────────────────────────────────────────────────────────────────┐
│  claude has an open session                                     │
│  Task : [task from registry]                                    │
│  Files: [files list]                                            │
│                                                                 │
│  1. Take over — commit uncommitted work, close it, continue     │
│  2. Wait — end the other session first if still running         │
└─────────────────────────────────────────────────────────────────┘
```

Say **1 (Take over)**. Verify:
- [ ] Agent checks `git status`
- [ ] If uncommitted changes: agent commits them
- [ ] registry.yaml: claude set to idle
- [ ] Antigravity session starts normally
- [ ] Cross-framework Critic offer follows (claude was the previous framework)

---

## Phase 8 — Upgrade two-section model test

### Step A: Add content to PROJECT section (simulate user customisation)
In Antigravity, ask agent to add a custom backend rule:
```
Add a project-specific backend rule: all our endpoints must return responses in under 200ms
```
Agent should add this to the PROJECT section of backend-agent.md (not PLATFORM).

Verify before upgrade:
```powershell
Select-String "200ms" "E:\Test\.agent\agents\backend-agent.md"
# Must find the rule in the PROJECT section
```

### Step B: End session in Antigravity, then run upgrade
```
End session.
```
Then in terminal:
```powershell
Remove-Item "$env:LOCALAPPDATA\npm-cache\_npx" -Recurse -Force -ErrorAction SilentlyContinue
npx github:zafrirron/Agent-Platform --mode=upgrade
```

### Step C: Verify after upgrade
```powershell
# PROJECT section preserved (user rule still there)
Select-String "200ms" "E:\Test\.agent\agents\backend-agent.md"
# Must still find the rule

# PLATFORM section updated (check a rule added by web audit)
Select-String "mass assignment" "E:\Test\.agent\agents\backend-agent.md" -CaseSensitive:$false
# Must find the web-audit F003 rule

# Pure platform files fully replaced (session-start-shared.md has new Reference line)
Select-String "open .agent/QUICK-REF.md in your editor" "E:\Test\.agent\session-start-shared.md"
# Must find the new trigger text (confirms pure-file upgrade works)
```

---

## Phase 9 — Uninstall

### Dry run (no changes):
```powershell
npx github:zafrirron/Agent-Platform --mode=uninstall
```
Verify output lists all platform folders and files to be removed — zero changes made.

### Real uninstall:
```powershell
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
```

### Verify after uninstall:
```powershell
Test-Path "E:\Test\.agent"              # False — removed
Test-Path "E:\Test\.claude"             # False — removed
Test-Path "E:\Test\.cursor"             # False — removed
Test-Path "E:\Test\.agents"             # False — removed
Test-Path "E:\Test\.codex"             # False — removed
Test-Path "E:\Test\CLAUDE.md"           # True  — RESTORED from backup (original pre-existing content)
Test-Path "E:\Test\AGENTS.md"           # True  — RESTORED from backup (original pre-existing content)
Test-Path "E:\Test\src\app.js"         # True  — user source untouched
Test-Path "E:\Test\src\routes\todos.js"# True  — user source untouched
```

### Verify restored content is original (not platform version):
```powershell
Select-String "pre-existing CLAUDE.md" "E:\Test\CLAUDE.md"
# Must find the original content — confirms restore worked
```

### Verify gitignore block removed:
```powershell
Select-String "Agent Platform Bootstrap" "E:\Test\.gitignore"
# Must return nothing — block removed
```

### Verify git history intact:
```powershell
git -C "E:\Test" log --oneline
# Must show full history — nothing lost
```

---

## Pass / Fail Summary

| Phase | Test | Pass condition |
|-------|------|----------------|
| 0 | Clean state | Pre-existing CLAUDE.md + AGENTS.md present, .agent/ absent |
| 1 | Install | v2.22.0, jest detected, backup created, two-section markers present |
| 2 | Session start | Compact status block, clickable QUICK-REF link, /quick-ref works |
| 3 | Auto-routing | 6 prompts routed silently to correct expert/playbook |
| 4 | Security gate | add-feature Step 5a fires automatically for auth feature |
| 5 | Session end | Agent derives summary, commits work, CURRENT.md has commit hash |
| 6 | Cross-framework Critic | Offer box appears in Antigravity, YES triggers cold 6-dim review |
| 7 | Framework takeover | Offer appears when stuck session detected, takeover completes |
| 8 | Upgrade two-section | PROJECT section preserved, PLATFORM updated, pure files replaced |
| 9 | Uninstall dry-run | Lists all files, zero changes |
| 9 | Uninstall confirm | Platform gone, original CLAUDE.md + AGENTS.md restored, src/ intact |
