# Agent Platform — Team Adoption · Presenter Guide

**Audience:** Developer team (technical, peer-to-peer)  
**Goal:** Approval to adopt across our projects + team commits to starting today  
**Total time:** ~26 min (15 min deck + 9 min live demo + Q&A)

---

## Before you start

**Screen setup**

| Setup | What to do |
|-------|-----------|
| Dual monitor (ideal) | Main screen (audience sees): browser with deck + IDE for demo. Second screen (you only): this file as speaker notes. |
| Single monitor | Open this file on your phone or print it — story beats are short enough to glance at. |

**Open the deck:**
```
start D:\Dev\Agent-Platform\presentation\team-adoption.html
```
Navigate with **← →** arrow keys or click the dots. No server needed.

**Pre-open before the demo starts (so you can alt-tab instantly):**
1. Terminal at `D:\Dev\platform-demo`
2. Your IDE (Cursor or Claude Code) pointed at the demo folder — **do not open it yet**, open it live during Step 3
3. Browser tab ready for Step 5b: [editor.swagger.io](https://editor.swagger.io) (optional) — you'll also open `coverage/lcov-report/index.html` from the project folder after tests run

---

## Story arc in one sentence
> We each carry the mental overhead of remembering context, enforcing quality, and coordinating across IDEs — this platform takes that weight off every session, automatically.

---

## Presentation flow

| Time | Slide | What to do |
|------|-------|-----------|
| 0–2 min | 1–2 (title, friction) | Talk through the problem. Ask the room a question. |
| 2–5 min | 3–5 (solution, lifecycle, routing) | Keep it fast — explain the model, not every feature. |
| 5–9 min | 6–8 (gates, cross-IDE, your rules) | **Slow down here** — this is where developers get convinced. |
| 9–18 min | **9 (demo guide) stays on screen** | Alt-tab to IDE. Follow demo script. Slide 9 shows commands — audience follows along. |
| 18–20 min | 10–11 (before/after, Day 1) | Fast. The demo already proved the numbers. |
| 20–23 min | 12 (approval ask) | Direct ask. Read the action items aloud. |
| 23–26 min | 12 stays up | Q&A. Use the objection table below. |

---

## Story beats

### Beat 1 — The friction we share (2 min) · Slide 2
Start here: every dev on the team has felt this.

Talking points:
- Every AI session starts cold. You spend the first few messages re-explaining your stack, your patterns, your conventions.
- When someone switches IDE or model mid-task, they re-derive everything from scratch.
- There's no standard for "done". One session ships tests, the next doesn't. One adds auth, the next forgets.
- The quality gate is **you** — and that's exhausting.

One question to the room: *"How often do you catch a missing auth check or a test-free endpoint in a PR review that the agent produced?"*

---

### Beat 2 — One command changes the session model (3 min) · Slides 3–4
Don't pitch features yet. Pitch the model change.

Talking points:
- `npx github:zafrirron/Agent-Platform` — one command, your repo is platform-equipped.
- Every session now has a structured lifecycle: start → work → end. Context is loaded. Registry prevents conflicts. Handoff log persists across sessions.
- You describe the task in plain language. The platform declares what it loaded: `▶ Backend expert · bug-fix playbook`. You know exactly what's governing the session.
- **Slash commands** (Cursor + Claude): `/session-start`, `/spec`, `/audit`, `/review`, `/release`, `/ship` — type `/` in chat instead of pasting long prompts.
- Session ends: work is committed, context logged, next session (or next dev, or next IDE) picks up from there.

Key point: *this is not a prompt template. It's a coordination layer.*

---

### Beat 3 — The gates that actually block (4 min) · Slide 6
This is where developer skeptics get convinced. **Slow down.**

Talking points:
- **Design Gate**: agent cannot write a single line of production code until the design is confirmed at the right tier. Trivial fix = one sentence. New endpoint = written design. Cross-cutting change = ADR. Silence is not approval.
- **Security Gate (Step 5a)**: fires automatically on any feature touching endpoints, auth, or data input. Security expert reviews the new code before Critic. No user action needed.
- **Critic Review**: 10-dimension adversarial review (`[SECURITY]` through `[BC]`). The Critic's job is to assume things are wrong. 0 Critical, 0 High before anything is marked done. Findings include file and line number.
- **BC Check (new)**: any change that would break an existing API, schema, or config outputs a structured warning — who's affected, migration path, severity — and blocks until you explicitly approve.

These are not suggestions. They are hard stops.

*"This is the code review that happens before the PR, from an adversary with no ego."*

---

### Beat 4 — Your workflow, your rules (3 min) · Slides 7–8
Address the top developer concern: "Will this force me into a rigid style?"

Talking points:
- Works in Cursor, Claude Code, Codex, Antigravity. Your IDE choice stays your choice.
- Each expert file has two sections. PLATFORM section = OWASP rules, quality gates — upgraded automatically. PROJECT section = your stack, your conventions, your rules — **never overwritten, ever**.
- Cursor multi-model: all Cursor models (GPT-4o, Claude, Gemini) inherit the same `.cursor/rules/` and `.cursor/commands/` automatically. Model switches mid-task = treat like a framework switch; run session-end first.
- **Cursor Plan mode:** after approving a plan, `/implement` (or `"implement the plan"`) resumes `add-feature` from Step 3 — Security (5a) and Critic (5b) still mandatory.
- Cross-framework Critic: when you switch tools, the new session offers a cold review of what the previous model did. Different model = different blind spots = genuine independent review.

*"Your team conventions go in PROJECT. They survive every upgrade. The platform improves around them."*

---

### Beat 5 — Live demo (9 min) · Slide 9 (demo guide)
See DEMO SCRIPT section below.

---

### Beat 6 — Day 1 (2 min) · Slide 11
Close with the concrete action. Don't leave it abstract.

Talking points:
- Pick any repo where you're starting new work this sprint.
- `npx github:zafrirron/Agent-Platform` — 30 seconds.
- Start a session: `/session-start` (Cursor/Claude) or `Read .agent/session-start.md and execute it.`
- From that point: describe tasks or use `/spec` `/audit` `/ship` — routing handles itself.
- First session triggers the full project audit offer — 11-phase professional health check (architecture through governance/maturity). Free with the install.
- **20 playbooks** since v2.41: core delivery (12) + quality/NFR (5) + compliance/maturity (3); agent-skills DNA (rationalization gates, doubt review, reference checklists).
- Enterprise highlights: NFR definition, production readiness (PRR), observability, a11y, compliance review, DORA maturity — mention if audience cares about go-live gates or audit prep.

---

### Beat 7 — Approval ask · Slide 12
Be direct. This is a peer-to-peer conversation.

> "I'd like us to adopt this on [repo] for the next sprint. One install, no code changes, fully reversible. If it doesn't improve the quality of what we ship, we uninstall with one command and nothing is left behind."

Action items:
- Each dev: install in one active project before end of week
- First session: run the full project audit — see the health report for your codebase
- Team sync in 2 weeks: share what the Critic found, discuss PROJECT section rules to standardise

---

## Live Demo Script

**Total time: ~9 minutes.**  
**Demo repo:** `D:\Dev\platform-demo` — clean git repo with the bare todo-app. Use for rehearsal and live presentation.

> Slide 9 stays on screen throughout the demo. It shows the commands — the audience follows along and you have the script in front of you. Do not switch away from it until the demo is done.

### Demo at a glance

| Step | Time | Where | What you do |
|------|------|-------|-------------|
| Setup | before room | Terminal | Verify clean repo |
| 1 | 30s | Terminal | `ls src/` — show starting point |
| 2 | 90s | Terminal | `npx github:zafrirron/Agent-Platform` |
| 3 | 60s | IDE chat | Session start prompt |
| 4 | 60s | IDE chat | Bug fix — auto-routing |
| 5 | 2 min | IDE chat | Auth — security gate (hero moment) |
| 5b | 60s | IDE + browser | OpenAPI spec + coverage HTML |
| 6 | 60s | IDE chat | Session end + handoff |
| 7 | 30s | Browser | Slide 10 — before/after numbers |

### Demo rules — read before rehearsing

1. **One prompt at a time.** Do not paste Step 5 and Step 5b together. Wait for each step to finish.
2. **Say "proceed" or "ok"** when the Design Gate asks — silence blocks the agent.
3. **Checkpoints between steps** (below). Do not advance if the checkpoint fails.
4. **Gates are guidance, not guarantees.** If the agent skips Critic or Security, use the recovery prompts in the troubleshooting section — do not improvise.
5. **Slide 10 numbers are aspirational.** A real session may produce ~10–30 tests, not 41. Point at what you actually generated — credibility beats inflated counts.

### Setup (before the room — verify the demo repo is clean)
```powershell
cd D:\Dev\platform-demo
git status
ls src/
```

### Step 1 — Show the starting state (30s)
```
ls src/
```
Say: "3 files, ~60 lines. No tests, no auth, no validation."

### Step 2 — Install (90s)
```
npx github:zafrirron/Agent-Platform
```
Point out:
- Stack detection (Jest detected)
- Platform folders created
- CLAUDE.md backed up
- Gitignore block written
- Global stubs suggestion

### Step 3 — Session start (60s)
Open your IDE now (live, in front of the room). **Cursor:** type `/session-start`. **Claude Code:** same or paste:
```
Read .agent/session-start.md and execute it.
```
Point out:
- Conflict check (no other framework active)
- First-session audit offer → say NO for now
- Status block
- "Ready. Tell me what you want to do."

### Step 4 — Auto-routing (60s)
Type: `fix the create todo endpoint — it doesn't validate the title`

Point out: `▶ Backend expert · bug-fix playbook` — declared on the first line, then it begins.  
No announcement of which file loaded. Just works.

**✅ Checkpoint before Step 5:** `npm test` passes · POST without title returns 400 · do not continue if auth prompt is next and bug fix is incomplete.

### Step 5 — Security gate fires (2–4 min)
Paste **only this** — then wait. Do not paste Step 5b yet.

```
Add user authentication — each todo should belong to a user. Users authenticate with a token in the Authorization header.
```

Watch:
- `▶ Backend expert · add-feature playbook` (or Architect first for cross-cutting)
- Design gate may ask for approval — **reply: `proceed`**
- Backend implements JWT auth in **real code** (not just docs)
- **Step 5a** (ideal): Security expert reviews new auth code — no user prompt needed
- **Step 5b playbook** (ideal): Critic adversarial review
- Tests for auth logic added

If the agent only writes OpenAPI/docs and says *"auth not implemented yet"* — **Step 5 failed.** Paste recovery prompt A below. Do not go to Step 5b.

**✅ Checkpoint before Step 5b — all must be true:**
```powershell
# 1. Auth code exists (middleware or auth routes — not only openapi.json)
ls src/

# 2. GET /todos without token returns 401
npm test

# 3. Tests include auth cases (not only title validation)
```
- `src/` has auth-related files (e.g. `middleware/auth.js`, `routes/auth.js`)
- `npm test` passes with **more than** the 3 title-validation tests
- Agent did **not** leave a note saying "routes still serve todos without auth"

> **THE MOMENT THAT LANDS HARDEST — pause and point it out explicitly:**
> *"I didn't ask for a security review — the platform triggered it automatically."*
> Only say this if Security expert actually ran. If it didn't, use recovery prompt B and then say it.

### Step 5b — Docs + test coverage artifacts (60s)
**Only after Step 5 checkpoint passes.** Slide 10 promises OpenAPI and HTML coverage — show real artifacts that match **running code**.

**5b-1 — API documentation (Docs expert)**  
Paste in IDE:
```
document the API — generate an OpenAPI 3.0 spec from the implemented code and api-contracts.md
```

Point out:
- `▶ Docs expert` on the first line
- `openapi.json` matches **implemented** endpoints (auth enforced in code, not aspirational)
- Show Swagger **without relying on npm**: paste `openapi.json` into [editor.swagger.io](https://editor.swagger.io)

If the agent added `swagger-ui-express`, run before `npm start`:
```powershell
npm install
```

Say: *"Docs expert generated publish-ready OpenAPI from the live contract."*

**5b-2 — Test coverage report**  
Run in terminal (script already includes `--coverage`):
```powershell
npm test
```

**✅ Checkpoint:** `coverage/lcov-report/index.html` must exist. If missing, paste recovery prompt C.

Open in browser:
```
D:\Dev\platform-demo\coverage\lcov-report\index.html
```

Point out:
- Line-by-line green/red coverage
- Test count on screen (say the real number — e.g. "12 tests", not "41" unless you actually have 41)
- LCOV/Clover also generated for CI

Say: *"One `npm test` — HTML for humans, LCOV for Codecov."*

### Gate recovery prompts — paste if the agent skips expected behavior

| Problem | Paste this |
|---------|------------|
| **A — Auth not implemented** (only OpenAPI/spec) | `Implement JWT auth now per add-feature playbook — middleware, user-scoped todos, 401 without Bearer token. Do not document until code works. Run full test suite.` |
| **B — Security gate did not run** | `Read .agent/playbooks/add-feature.md Step 5a and execute the security gate on the auth code.` |
| **C — Critic did not run** | `Read .agent/agents/critic-agent.md and run adversarial review on all changes this session. 0 Critical, 0 High before continuing.` |
| **D — No coverage folder** | `Run npm test with coverage and confirm coverage/lcov-report/index.html exists.` |
| **E — New npm package but app crashes** | `npm install` in terminal, then `npm test` and `npm start` to verify.` |

### After a failed rehearsal — reset platform-demo
```powershell
cd D:\Dev\platform-demo
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
git checkout -- .
git clean -fd
# Restore bare app if needed: copy from Agent-Platform\tests\todo-app\
```
Then re-run from Step 1.

### Step 6 — Session end + handoff (60s)
Type: `End session.`

Show `.agent/handoff/CURRENT.md` — goal, files changed, commit hash, Critic reviewed status.

Say: "The next session — whether it's you tomorrow, a teammate, or a different IDE — picks up exactly from here."

### Step 7 — Before/after (30s)
Switch to slide 10. Point at what you **actually** built in this session:
- Test count from `npm test` output (not slide's "41" unless true)
- OpenAPI file you opened in editor.swagger.io
- Coverage HTML you showed live
- Auth + security gate moment if it fired

If slide numbers don't match, say: *"Slide shows a full session ceiling — we hit [N] tests and [X] gates in today's run."*

---

## Why your rehearsal failed (common causes)

| What you saw | Why |
|--------------|-----|
| OpenAPI describes auth but code has no auth | Step 5b ran before Step 5 finished — Docs expert has **no playbook**, no Critic/Security gates |
| Only 4 tests | Step 5 (auth + auth tests) never completed — only bug-fix tests exist |
| No `coverage/` folder | `npm test` not run after last code change, or jest ran without `--coverage` |
| Swagger UI crashes | Agent added `swagger-ui-express` but `npm install` not run — use editor.swagger.io instead |
| Critic never offered | Agents are probabilistic; playbooks are guidance. Use recovery prompt C |
| Security gate silent | Same — use recovery prompt B after auth code exists |

**Your session:** bug fix ✅ · auth ❌ (spec only) · docs ✅ · critic ❌ · coverage ❌ (until you run `npm test`)

---

## Key messages (one per beat)

| Beat | One-line message |
|------|-----------------|
| 1 | The context overhead and quality inconsistency is a team problem, not an individual one |
| 2 | Sessions now have a structure — start, work under gates, end with a handoff |
| 3 | Quality gates block, not suggest — design, security, adversarial critic, BC check |
| 4 | Your IDE, your rules, your conventions — the platform improves around them |
| 5 | [Demo] From bare app to JWT auth + 41 tests + OpenAPI + coverage report in one session |
| 6 | 30 seconds to install, fully reversible — start on your next task |

---

## Objection handling

| Objection | Response |
|-----------|----------|
| "Will it slow me down?" | The gates catch things that become PRs or bugs. Catching them before code is faster. Caveman mode cuts output 65% for routine sessions. |
| "Will it mess up my existing setup?" | Zero code impact. All platform files gitignored. Original AI configs backed up and restorable. One command uninstalls cleanly. |
| "What about my IDE / model preference?" | Cursor, Claude Code, Codex, Antigravity all supported. Cursor multi-model works — all models inherit the same rules automatically. |
| "The gates are too strict for quick fixes" | Design gate scales: trivial fix = one sentence and "ok". No friction for small changes. |
| "What if I disagree with a rule?" | Add it to your PROJECT section. Rules there override the platform section and survive every upgrade. |
| "AI agents aren't reliable enough for this" | The platform assumes the agent is unreliable — that's why the Critic exists. The gates catch what the implementing agent misses. |

---

## Files in this folder

| File | Purpose |
|------|---------|
| `team-adoption.html` | 12-slide presentation deck — open in browser |
| `STORY-PLAN.md` | This file — screen setup, timing, story beats, demo script, objection handling |
| `agent-platform-beta.html` | Original beta overview deck (reference only) |
