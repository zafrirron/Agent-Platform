# Agent Platform — End-to-End Test Plan

Tests the full platform lifecycle: install → session start → auto-routing → multi-expert →
playbooks → cross-framework critic → uninstall. Uses a dummy Todo REST API as the test project.

---

## Phase 0 — Clean slate

```powershell
mkdir C:\TestProjects\todo-app-platform-test
cd C:\TestProjects\todo-app-platform-test
git init
```

---

## Phase 1 — Create the dummy Todo app (source files)

Create exactly these files so the platform has a real project to work with.

### `package.json`
```json
{
  "name": "todo-app",
  "version": "1.0.0",
  "description": "A simple todo REST API",
  "scripts": {
    "start": "node src/app.js",
    "test": "jest --coverage"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.0.0"
  }
}
```

### `src/app.js`
```js
const express = require('express');
const todosRouter = require('./routes/todos');
const app = express();
app.use(express.json());
app.use('/todos', todosRouter);
module.exports = app;
```

### `src/routes/todos.js`
```js
const express = require('express');
const router = express.Router();
const todos = [];
router.get('/', (req, res) => res.json(todos));
router.post('/', (req, res) => {
  const todo = { id: Date.now(), title: req.body.title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});
router.patch('/:id', (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Not found' });
  todo.done = req.body.done ?? todo.done;
  res.json(todo);
});
router.delete('/:id', (req, res) => {
  const i = todos.findIndex(t => t.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(i, 1);
  res.status(204).send();
});
module.exports = router;
```

### `src/models/todo.js`
```js
class Todo {
  constructor(title) {
    this.id = Date.now();
    this.title = title;
    this.done = false;
    this.createdAt = new Date().toISOString();
  }
}
module.exports = Todo;
```

### `README.md`
```md
# Todo App
A simple REST API for managing todos. Built with Express.js.

## Endpoints
- GET /todos — list all
- POST /todos — create one
- PATCH /todos/:id — update done status
- DELETE /todos/:id — remove
```

---

## Phase 2 — Install the platform

```powershell
npx github:zafrirron/Agent-Platform
```

**Verify the install summary shows:**
- [ ] Version: v2.18.x (current)
- [ ] Files created: ~80+
- [ ] 4 IDE frameworks: Claude Code · Cursor · Antigravity · Codex
- [ ] 9 expert agents (including Critic)
- [ ] 8 playbooks
- [ ] Test enforcement: `npx jest` detected automatically
- [ ] Zero footprint notice (platform files gitignored)
- [ ] Session start command shown

**Verify key files exist:**
```powershell
Test-Path .agent/session-start.md        # must be True
Test-Path .agent/QUICK-REF.md            # must be True
Test-Path .agent/platform.json           # must be True
Test-Path .agent/handoff/CURRENT.md      # must be True
Test-Path CLAUDE.md                      # must be True (root, 2-line)
Test-Path AGENTS.md                      # must be True
Test-Path .gitignore                     # must be True (has platform block)
```

**Verify gitignore block was written:**
```powershell
Select-String "Agent Platform Bootstrap" .gitignore
# → must show the START/END block containing .agent/ .claude/ etc.
```

---

## Phase 3 — Session Start (Claude Code)

Paste into Claude Code chat:
```
Read .agent/session-start.md and execute it.
```

**Verify all 8 steps fire:**
- [ ] Step 1: Registry checked, `claude` set as active in `registry.yaml`
- [ ] Step 1b: No Critic offer (first session — nothing to review)
- [ ] Step 2: Test runner auto-detected → `npx jest` / `npx jest --coverage` written to `platform.json`
- [ ] Step 3: Update check runs (or skipped if last check < 7 days)
- [ ] Step 4: Last work context shown (empty on first session)
- [ ] Step 5: QUICK-REF table displayed with all experts and playbooks
- [ ] Step 6: New entry prepended to `CURRENT.md`
- [ ] Step 7: Auto-routing activated silently
- [ ] Step 8: `Ready. Tell me what you want to do.` shown

---

## Phase 4 — Auto-routing test

Type each prompt below. The agent must route silently — it must NOT say "I will now load the Backend expert".

| Prompt you type | Expected silent routing |
|----------------|------------------------|
| `"fix the create todo endpoint — it doesn't validate the title"` | Backend expert + bug-fix playbook |
| `"add a due date field to todos"` | Backend expert + add-feature playbook |
| `"check if the API is secure"` | Security expert + security-audit playbook |
| `"I'm ready to cut a release"` | DevOps expert + release playbook |
| `"find what's wrong with this codebase"` | Critic agent → 6-dimension review |
| `"write tests for the todos router"` | Test expert → test taxonomy + coverage gate |
| `"document the API"` | Docs expert → API docs |

**For each routing verify:**
- [ ] Agent immediately works in the correct persona
- [ ] Playbook step numbers are followed (Step 1, Step 2, …)
- [ ] Quality gates enforced (tests required before handoff)
- [ ] No announcement of which file was loaded

---

## Phase 5 — Multi-expert playbook (add-feature deep test)

Tell the agent:
```
Add user authentication — each todo should belong to a user.
Users authenticate with a token in the Authorization header.
```

**Verify it chains experts through the playbook:**
- [ ] Architect expert for design and scope (Step 1)
- [ ] Backend expert for implementation (Steps 2–4)
- [ ] Security expert reviews the auth logic (quality gate)
- [ ] Test expert writes tests for the new endpoint (Step 5)
- [ ] Agent does NOT hand off until tests pass and coverage gate is met

---

## Phase 6 — Security audit playbook

Tell the agent:
```
Run a security audit on this todo app.
```

**Verify:**
- [ ] Security expert loads
- [ ] OWASP Top 10 checks run against the code
- [ ] Findings reported with severity: Critical / High / Medium / Low
- [ ] Each finding references the specific file and line
- [ ] Agent proposes fixes and waits for confirmation before changing code

---

## Phase 7 — Session End (prepare for cross-framework test)

Tell the agent:
```
End session. I made changes to src/routes/todos.js and src/models/todo.js.
Goal was: add due date field to todos.
```

**Verify `CURRENT.md` was updated with:**
- [ ] Goal recorded
- [ ] Files changed: `src/routes/todos.js`, `src/models/todo.js`
- [ ] `Critic reviewed: no`

**Verify `registry.yaml` updated with:**
- [ ] `meta.updated_by: claude`
- [ ] Claude set to `status: idle`

---

## Phase 8 — Cross-framework Critic test (simulate Cursor switch)

Open a NEW session as if switching to Cursor. Paste this:
```
Read .agent/session-start.md and execute it.
My framework folder name is: cursor
```

**Verify Step 1b fires the Critic offer box:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Cross-framework Critic review available                        │
│                                                                 │
│  Last session: claude — add due date field to todos             │
│  Files changed: src/routes/todos.js, src/models/todo.js         │
│                                                                 │
│  A different AI model did this work. Would you like me to run   │
│  a Critic review before we proceed?                             │
│                                                                 │
│  Reply YES to review, NO to proceed directly.                   │
└─────────────────────────────────────────────────────────────────┘
```

**Say YES — verify:**
- [ ] Critic loads in "cross-framework cold review" mode (no prior context)
- [ ] Reviews `src/routes/todos.js` and `src/models/todo.js`
- [ ] Full 6-dimension review: correctness · security · edge cases · intent vs implementation · test coverage · handoff quality
- [ ] Findings shown with severity ratings
- [ ] `CURRENT.md` updated: `Critic reviewed: yes — X Critical, Y High, Z Medium`
- [ ] Offer is NOT shown again in the same session (one-time per handoff)

---

## Phase 9 — Uninstall

**Dry run first (no changes made):**
```powershell
npx github:zafrirron/Agent-Platform --mode=uninstall
```
Verify output lists: `.agent/`, `.claude/`, `.cursor/`, `.agents/`, `.codex/`, `CLAUDE.md`, `AGENTS.md`, `SYNC-POINTS.md`, gitignore block.

**Real uninstall:**
```powershell
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
```

**Verify after uninstall:**
- [ ] `Test-Path .agent/` → `False`
- [ ] `Test-Path CLAUDE.md` → `False`
- [ ] `Test-Path AGENTS.md` → `False`
- [ ] `.gitignore` still exists but platform block is removed
- [ ] `src/` folder fully intact — all todo app files present
- [ ] `git log` shows full history — nothing lost

---

## Pass / Fail Summary

| Phase | Test | Pass condition |
|-------|------|----------------|
| 2 | Install | Correct version, jest detected, ~80+ files, gitignore block written |
| 3 | Session start | All 8 steps fire, QUICK-REF displayed, `Ready.` shown |
| 4 | Auto-routing | 7 prompts all route silently to correct expert/playbook |
| 5 | Multi-expert | Auth feature chains Architect → Backend → Security → Test |
| 6 | Security audit | OWASP findings with severity + file:line, waits before changing |
| 7 | Session end | `CURRENT.md` updated, `Critic reviewed: no`, registry idle |
| 8 | Cross-framework critic | Box shown on Cursor start, YES triggers 6-dim cold review |
| 9 | Uninstall dry-run | Lists all files, zero changes |
| 9 | Uninstall confirm | Platform gone, source code 100% intact, git history intact |
