# Agent Platform — Team Adoption · Story Plan

**Audience:** Developer team (technical, peer-to-peer)  
**Goal:** Approval to adopt across our projects + team commits to starting today  
**Total time:** ~25 min (15 min deck + 8 min live demo + Q&A)

---

## Story arc in one sentence
> We each carry the mental overhead of remembering context, enforcing quality, and coordinating across IDEs — this platform takes that weight off every session, automatically.

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
- Session ends: work is committed, context logged, next session (or next dev, or next IDE) picks up from there.

Key point: *this is not a prompt template. It's a coordination layer.*

---

### Beat 3 — The gates that actually block (4 min) · Slide 6
This is where developer skeptics get convinced.

Talking points:
- **Design Gate**: agent cannot write a single line of production code until the design is confirmed at the right tier. Trivial fix = one sentence. New endpoint = written design. Cross-cutting change = ADR. Silence is not approval.
- **Security Gate (Step 5a)**: fires automatically on any feature touching endpoints, auth, or data input. Security expert reviews the new code before Critic. No user action needed.
- **Critic Review**: 7-dimension adversarial review. The Critic's job is to assume things are wrong. 0 Critical, 0 High before anything is marked done. Findings include file and line number.
- **BC Check (new)**: any change that would break an existing API, schema, or config outputs a structured warning — who's affected, migration path, severity — and blocks until you explicitly approve.

These are not suggestions. They are hard stops.

*"This is the code review that happens before the PR, from an adversary with no ego."*

---

### Beat 4 — Your workflow, your rules (3 min) · Slides 7–8
Address the top developer concern: "Will this force me into a rigid style?"

Talking points:
- Works in Cursor, Claude Code, Codex, Antigravity. Your IDE choice stays your choice.
- Each expert file has two sections. PLATFORM section = OWASP rules, quality gates — upgraded automatically. PROJECT section = your stack, your conventions, your rules — **never overwritten, ever**.
- Cursor multi-model: all Cursor models (GPT-4o, Claude, Gemini) inherit the same platform rules automatically. Model switches mid-task = treat like a framework switch; run session-end first.
- Cross-framework Critic: when you switch tools, the new session offers a cold review of what the previous model did. Different model = different blind spots = genuine independent review.

*"Your team conventions go in PROJECT. They survive every upgrade. The platform improves around them."*

---

### Beat 5 — Live demo (8 min) · Slide 9 (demo guide)
See DEMO SCRIPT section below.

---

### Beat 6 — Day 1 (2 min) · Slide 11
Close with the concrete action. Don't leave it abstract.

Talking points:
- Pick any repo where you're starting new work this sprint.
- `npx github:zafrirron/Agent-Platform` — 30 seconds.
- Start a session: `Read .agent/session-start.md and execute it.`
- From that point: describe tasks, routing handles itself.
- First session triggers the full project audit offer — 8-domain professional health check of your codebase. Free with the install.

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

**Total time: ~8 minutes. All from the E2E test plan (tests/E2E-TEST-PLAN.md).**

### Setup (before the room)
```powershell
$TEST_DIR = "$env:TEMP\platform-demo"
mkdir $TEST_DIR
Copy-Item tests\todo-app\* $TEST_DIR\ -Recurse
cd $TEST_DIR
git init
git add -A
git commit -m "chore: initial todo app (pre-platform)"
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
In Claude Code or Cursor, paste:
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

### Step 5 — Security gate fires (2 min)
Type: `Add user authentication — each todo should belong to a user. Users authenticate with a token in the Authorization header.`

Watch:
- Architect: cross-cutting, ADR triggered
- Backend: implements JWT auth
- **Step 5a fires automatically**: Security expert loads and reviews — no user prompt needed
- Critic: 6-dimension adversarial review
- Nothing marked done until all gates pass

### Step 6 — Session end + handoff (60s)
Type: `End session.`

Show `.agent/handoff/CURRENT.md` — goal, files changed, commit hash, Critic reviewed status.

Say: "The next session — whether it's you tomorrow, a teammate, or a different IDE — picks up exactly from here."

### Step 7 — Before/after (30s)
Switch to slide 10. Point at the numbers.

---

## Key messages (one per beat)

| Beat | One-line message |
|------|-----------------|
| 1 | The context overhead and quality inconsistency is a team problem, not an individual one |
| 2 | Sessions now have a structure — start, work under gates, end with a handoff |
| 3 | Quality gates block, not suggest — design, security, adversarial critic, BC check |
| 4 | Your IDE, your rules, your conventions — the platform improves around them |
| 5 | [Demo] From bare app to JWT auth + 41 tests + OWASP in one session |
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
