# Agent Platform Bootstrap — complete guide

> **Human documentation** for the framework pack and for day-to-day use after install.  
> **Agent install:** [AGENT-PLATFORM-BOOTSTRAP.md](AGENT-PLATFORM-BOOTSTRAP.md) · **Copy list:** [COPYING.md](COPYING.md) · **Deploy:** [PACK-DEPLOY.md](PACK-DEPLOY.md)

---

## Two kinds of repositories

| Repository | Purpose | What lives here |
|------------|---------|-----------------|
| **Framework repository** | Develop and version the pack | `AGENT-PLATFORM-TEMPLATES/`, manifest, apply script, maintainer docs |
| **Consumer repository** | Your application + installed platform | Product code + `.agent/`, IDE private folders, `AGENTS.md` |

**Do not mix:** application source does not belong in the framework repository.

To create a **new framework-only project**, copy only the paths in [COPYING.md](COPYING.md). Use this file as the main `README.md` (or rename [README-FOR-FRAMEWORK-REPO.md](README-FOR-FRAMEWORK-REPO.md)).

---

## v2 pack model

| Piece | Path | Role |
|-------|------|------|
| Orchestrator | `AGENT-PLATFORM-BOOTSTRAP.md` | Short instructions for the executing agent |
| Manifest | `AGENT-PLATFORM-MANIFEST.json` | Template paths + `bootstrap_version` |
| Templates | `AGENT-PLATFORM-TEMPLATES/` | All installable file bodies |
| Installer | `AGENT-PLATFORM-APPLY.js` | `--mode=install|repair|upgrade|force` |

Human guides (installation, usage, extending) are **in this file**. Templates are **on disk**, not embedded in the orchestrator.

---

## Platform capabilities

> **One command. A complete agentic development environment on any repository.**

Run `npx github:zafrirron/Agent-Platform` in any repo root. In 30–90 seconds it builds a full coordination platform: 4 IDE frameworks working together without conflicts, 8 software-expert agents you activate by name, 8 step-by-step playbooks for every common scenario, a framework-aware quick reference on every session start, built-in test enforcement, living project-knowledge docs, built-in token compression, and a self-documenting extension system. Your existing code is never touched.

---

## What you get

| Capability | What it does |
|------------|-------------|
| **4 IDE frameworks** | Claude Code · Cursor · Antigravity · Codex — each gets a private folder with session-start/end prompts and skill wiring |
| **Cross-IDE coordination** | `registry.yaml` prevents two IDEs editing the same file simultaneously; `CURRENT.md` preserves full context across switches |
| **8 software-expert agents** | Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data — activate by name, chain across sessions |
| **8 playbooks** | add-feature · release · debug-pipeline · bug-fix · refactor · add-dependency · security-audit · api-integration — step-by-step with agent assignments |
| **Quick reference on every session start** | Agent displays a full capability table on every session start — framework-aware (`<fw>` substituted), includes update status and last work context. No memorisation required. |
| **10 best-practice rules** | Golden rules, task anatomy (Spec/Implement/Test/Handoff), debug protocol, refactor discipline, dep evaluation, security baseline — in `.agent/BEST-PRACTICES.md` |
| **Test enforcement** | Every new public function, bug fix, and API endpoint requires a test before done; coverage gate auto-detected at install; red suite blocks handoff |
| **5 living context files** | api-contracts · adr-log (Architecture Decision Records) · known-issues · dependencies · project-overview — kept in sync as code evolves |
| **🪨 Caveman skill** | ~65% output token savings; activated with `"caveman mode"` across all 4 frameworks |
| **Agentic update check** | `node .agent/tools/check-updates.mjs` — or tell the agent: `Read .agent/tools/upgrade.md and execute it.` Checks once per 7 days, caches result. |
| **3 install paths** | npx · curl/iwr shell one-liner · agent-direct. No file copying. Version-pinnable. |
| **API agentic patterns** | 12 conventions for agents that build or consume APIs: schema-first, contract discipline, idempotency, structured errors, auth injection, rate-limit backoff, mock-first, contract tests |
| **Extensible by prompt** | 7-step extension anatomy + ready-to-paste prompts for adding new agents, playbooks, skills, IDE frameworks, or context files — permanently, so every future repo gets them |
| **Self-customising** | Phase 0 scans your codebase and fills project name, stack, test runner, coverage command, and entry points automatically |
| **Safe to run anywhere** | Default mode creates missing files only — never overwrites existing content, never touches application source |

---

## Install

Three equally supported install paths — pick whichever fits your workflow.

---

### Path A — npx (recommended)

No file copying. Works on any OS with Node.js 18+. The pack stays in a temp directory; nothing extra lands in your repo.

```bash
# First install
npx github:zafrirron/Agent-Platform

# Upgrade existing install (adds new files, skips existing)
npx github:zafrirron/Agent-Platform --mode=upgrade

# Pin to a specific version
npx github:zafrirron/Agent-Platform#v2.2.0

# Other modes
npx github:zafrirron/Agent-Platform --mode=repair   # fill empty stubs only
npx github:zafrirron/Agent-Platform --mode=force    # reset all templates (confirm first)
```

After npx completes, tell your agent to fill project stubs:
```
Read .agent/README.md and fill all stub files for this project.
```

---

### Path B — shell one-liner

Downloads the latest release, runs the apply script, cleans up. Nothing installed into your repo.

**Linux / macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash
```

With options:
```bash
AP_VERSION=v2.2.0 AP_MODE=upgrade \
  curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash
```

**Windows PowerShell:**
```powershell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

With options (save script first, then run with params):
```powershell
.\install.ps1 -Version v2.2.0 -Mode upgrade
```

---

### Path C — agent-direct (no terminal needed)

For agentic IDEs where the agent has shell access.

**Claude Code** — paste into chat:
```
Run: curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash
Then fill all project stubs from the codebase.
```

**Fallback (pack files already present in repo root):**
```
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
```

---

### Install mode reference

| Mode | What it does |
|------|-------------|
| `install` | Create missing files only — never overwrites (default) |
| `upgrade` | Same as install; processes new manifest entries added in this release |
| `repair` | Overwrites only files whose content is still an unfilled stub |
| `force` | Overwrites all template files — confirm first; your project source is never touched |

---

## Installation guide

> **How to get this platform onto any repo — new or existing — in under a minute.**

---

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| A git repository | `git init` if starting fresh |
| Any agentic IDE | Claude Code, Cursor, Antigravity, or Codex (VS Code) |
| Node.js 18+ | Required for `npx` path only; shell one-liners handle this automatically |

---

### Installing on a new repository

**Option A — npx (recommended, any OS with Node.js 18+):**
```bash
npx github:zafrirron/Agent-Platform
```

**Option B — shell one-liner:**
```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

The installer runs all 5 phases automatically, prints a summary with per-IDE session-start commands, and exits. No agent interaction needed for the install itself.

---

### Installing on an existing repository

Same commands — the installer **never overwrites existing files** in default mode. It only creates what is missing.

```bash
npx github:zafrirron/Agent-Platform
```

Your existing code, docs, and config are untouched. Only `.agent/`, `.claude/`, `.cursor/`, `.agents/`, `.codex/` platform scaffolding is added.

---

### What gets installed — the 5 phases

| Phase | What happens |
|-------|-------------|
| **0 · Discover** | Reads repo name, README, stack (languages, build files); detects `TEST_RUNNER`, `COVERAGE_CMD`, and sets `COVERAGE_THRESHOLD` (default 80%) |
| **1 · Verify pack** | Confirms manifest + `AGENT-PLATFORM-TEMPLATES/` at repo root |
| **2 · Apply** | Runs apply (e.g. `node AGENT-PLATFORM-APPLY.js`) — writes templates; skips existing files |
| **3 · Stubs** | Fills project-specific stubs: stack, components, entry points, API contracts, dependencies |
| **4 · Gitignore** | Appends `*/local/` and framework-scratch paths to `.gitignore` |
| **5 · Report** | Lists files created/skipped, framework switch commands, next step |

Total time: typically **30–90 seconds** depending on codebase size.

---

### Modes

| You want to… | Command |
|-------------|---------|
| Install (first time, or add missing files) | `npx github:zafrirron/Agent-Platform` |
| Repair broken links / fill empty stubs | `npx github:zafrirron/Agent-Platform --mode=repair` |
| Add files from a newer pack | `npx github:zafrirron/Agent-Platform --mode=upgrade` |
| Reset templates to latest (⚠️ overwrites templates) | `npx github:zafrirron/Agent-Platform --mode=force` |
| Pin to a specific version | `npx github:zafrirron/Agent-Platform#v2.4.0` |

`--mode=force` requires explicit confirmation before overwriting. Application source is never touched.

---

### What gets created

```text
repo-root/
├── AGENTS.md                         ← router (all frameworks read this)
├── SYNC-POINTS.md                    ← framework switch cheat sheet
├── CLAUDE.md                         ← Claude Code entry point
│
├── .agent/                           ← SHARED hub (all frameworks)
│   ├── BEST-PRACTICES.md             ← 10 golden rules + protocols
│   ├── QUICK-REF.md                  ← capability quick reference (shown every session start)
│   ├── session-start-shared.md       ← shared session-start logic for all 4 frameworks
│   ├── PROJECT.md, CONVENTIONS.md, WORKFLOWS.md, FILE_MAP.md
│   ├── ZONES.md, SYNC.md, CHECKLIST.md
│   ├── agents/                       ← 8 software-expert personas
│   │   architect · backend · frontend · devops · test · docs · security · data
│   ├── playbooks/                    ← 8 step-by-step workflows
│   │   add-feature · release · debug-pipeline · bug-fix · refactor
│   │   add-dependency · security-audit · api-integration
│   ├── context/                      ← 5 living reference files
│   │   project-overview · api-contracts · api-patterns · adr-log · known-issues · dependencies
│   ├── skills/caveman/SKILL.md       ← 🪨 token-compression skill
│   ├── tools/
│   │   ├── check-updates.mjs         ← version check vs GitHub (7-day cache)
│   │   ├── upgrade.md                ← agent self-upgrade prompt
│   │   ├── check_locks.js            ← file conflict checker
│   │   ├── prune_handoff.js          ← handoff log pruner
│   │   └── launch.mjs / .sh / .ps1  ← app launcher
│   └── handoff/
│       ├── CURRENT.md                ← session log (newest first)
│       └── sync/registry.yaml        ← active-framework lock
│
├── .claude/   🔒 Claude private
│   ├── commands/  ← /caveman slash commands
│   ├── rules/
│   └── prompts/session-start.md + session-end.md
│
├── .cursor/   🔒 Cursor private
│   ├── rules/caveman.mdc
│   └── prompts/session-start.md + session-end.md
│
├── .agents/   🔒 Antigravity private
│   ├── skills/caveman.md
│   └── prompts/session-start.md + session-end.md
│
└── .codex/    🔒 Codex private
    └── prompts/session-start.md + session-end.md
```

---

### Installing into a different repository

Run the install command from inside the target repo. The installer detects the project name and stack from that directory automatically.

```bash
cd /path/to/other-project
npx github:zafrirron/Agent-Platform
```

Phase 3 fills all stubs from that repo's own codebase scan — the output is project-aware.

---

### Updating an existing installation

```bash
# Check what version is installed and whether an update is available
node .agent/tools/check-updates.mjs

# Add new files from the latest release (never overwrites existing content)
npx github:zafrirron/Agent-Platform --mode=upgrade

# Or let the agent handle it entirely
Read .agent/tools/upgrade.md and execute it.
```

Your customised content (filled stubs, project-specific docs, ADRs, known-issues) is never overwritten in upgrade mode. See [CHANGELOG.md](CHANGELOG.md) for version-specific upgrade guides.

---

## Usage guide — after install

> **This section is for you (the human).** Once the bootstrap has run, here is everything you need to operate the platform day-to-day. No memorisation required — copy-paste the commands below.

---

### 1 · Start every session

Pick your IDE and paste the start command. The agent reads the registry, checks for conflicts, marks itself active, and is ready to work.

| You are using | Paste this |
|---------------|-----------|
| **Claude Code** | `Read .claude/prompts/session-start.md and execute it.` |
| **Cursor** | `Read .cursor/prompts/session-start.md and execute it.` |
| **Antigravity** | `Read .agents/prompts/session-start.md and execute it.` |
| **Codex (VS Code)** | `Read .codex/prompts/session-start.md and execute it.` |

---

### 2 · End every session

Always run before switching tools or closing the IDE. The agent marks itself idle and logs what it did so the next agent picks up cleanly.

| You are using | Paste this |
|---------------|-----------|
| **Claude Code** | `Read .claude/prompts/session-end.md and execute it.` |
| **Cursor** | `Read .cursor/prompts/session-end.md and execute it.` |
| **Antigravity** | `Read .agents/prompts/session-end.md and execute it.` |
| **Codex (VS Code)** | `Read .codex/prompts/session-end.md and execute it.` |

---

### 3 · Activate a software expert

The platform ships with **8 domain specialists**. Activate one when your task has a clear domain.

```
Act as the <ProjectName> Backend expert.
Read .agent/agents/backend-agent.md
Task: add rate-limiting middleware to the API
```

| Expert | Activate with | Best for |
|--------|--------------|----------|
| 🏛 Architect | `Read .agent/agents/architect-agent.md` | Cross-cutting design, ADRs, new components |
| ⚙️ Backend | `Read .agent/agents/backend-agent.md` | APIs, services, server logic |
| 🎨 Frontend | `Read .agent/agents/frontend-agent.md` | UI, components, client state |
| 🔧 DevOps | `Read .agent/agents/devops-agent.md` | CI/CD, builds, infra scripts |
| 🧪 Test | `Read .agent/agents/test-agent.md` | Tests, fixtures, coverage enforcement, quality gate |
| 📚 Docs | `Read .agent/agents/docs-agent.md` | READMEs, changelogs, API docs |
| 🔒 Security | `Read .agent/agents/security-agent.md` | Secrets, auth, threat review |
| 🗄 Data | `Read .agent/agents/data-agent.md` | Schemas, migrations, pipelines |

You can chain experts in one session: start with Architect to design, then Backend to implement, then Test to verify.

---

### 4 · Switch between IDEs mid-task

You can move a task from Cursor to Claude Code (or any combination) without losing context:

```
# In Cursor — end session
Read .cursor/prompts/session-end.md and execute it.

# In Claude Code — start session (picks up from handoff log)
Read .claude/prompts/session-start.md and execute it.
```

The registry at `.agent/handoff/sync/registry.yaml` prevents two IDEs from editing the same files simultaneously. If a conflict is detected, the agent will tell you who owns what and what to do.

---

### 5 · 🪨 Caveman — token compression mode

Caveman cuts AI output by ~65% while keeping full technical accuracy. Activate it any time using natural language — the same commands work across all 4 frameworks.

```
caveman mode          → full compression (default)
caveman lite          → remove filler, keep full sentences
caveman ultra         → maximum — abbreviate everything
caveman compress <path> → compress a context file ~46%
stop caveman          → return to normal
```

The skill definition at `.agent/skills/caveman/SKILL.md` is the single source of truth across all frameworks.

---

### 6 · Check who is active / last handoff

```
# Ask any agent:
Read .agent/handoff/sync/registry.yaml and tell me which frameworks are active.

# See the full session log:
Read .agent/handoff/CURRENT.md
```

---

### 7 · Run a multi-agent workflow

Example: **add a new feature** using the recommended playbook.

```
# Step 1 — design (Architect)
Read .agent/agents/architect-agent.md
Read .agent/playbooks/add-feature.md
Task: design the new <feature> — confirm approach before implementation

# Step 2 — implement (Backend or Frontend expert, same or different IDE)
Read .agent/agents/backend-agent.md
Task: implement the <feature> per the design in CURRENT.md

# Step 3 — test (Test expert)
Read .agent/agents/test-agent.md
Task: write tests for <feature>

# Step 4 — release (DevOps)
Read .agent/agents/devops-agent.md
Read .agent/playbooks/release.md
Task: version bump and build artifact
```

---

### 8 · Check for updates and upgrade

**Check from inside any consumer repo:**
```bash
node .agent/tools/check-updates.mjs
```
Prints current vs latest version, release notes preview, and upgrade instructions.

**Let the agent handle it:**
```
Read .agent/tools/upgrade.md and execute it.
```
The agent checks the version, runs `npx github:zafrirron/Agent-Platform --mode=upgrade`, fills new placeholders, and repairs stubs automatically.

**Repair or re-run without upgrading:**
```bash
npx github:zafrirron/Agent-Platform --mode=repair    # fill empty stubs
npx github:zafrirron/Agent-Platform --mode=upgrade   # add new files from latest
```

---

### 9 · Agentic development best practices

All generated files follow these rules. They live in `.agent/BEST-PRACTICES.md` — read them before any non-trivial task.

#### The 10 golden rules

| # | Rule | Why it matters |
|---|------|---------------|
| 1 | **Smallest correct change** | Large diffs break more, review harder, rollback costlier |
| 2 | **Read before write** | Match existing patterns — don't impose your own style |
| 3 | **Spec first** | Define done-when criteria before implementing; write the test or acceptance criteria first |
| 4 | **Verify after** | Run the affected code path after every change — untested = unfinished |
| 5 | **Ask before irreversible** | Delete, rename, drop schema column, break API contract → confirm with user |
| 6 | **No drive-by refactors** | Note unrelated issues in `CURRENT.md`; fix them in a separate task |
| 7 | **Lock before large edits** | Claim files in `registry.yaml` before touching shared paths |
| 8 | **No secrets in source** | Use `.env` / config injection; grep for secrets before every commit |
| 9 | **Surface blockers early** | Stuck > 2 attempts → log blocked in `CURRENT.md`, explain why, stop |
| 10 | **Update contracts** | API / schema change → update `.agent/context/api-contracts.md` immediately |

#### Write good tasks — the 4-part anatomy

Structure every task you give an agent like this:

```
Context:      [what already exists — 1-2 sentences]
Goal:         [single clear outcome]
Constraints:  [what NOT to touch]
Done-when:    [verifiable: test passes / command outputs X / UI shows Y]
```

**Good:** `"Context: auth uses JWT HS256. Goal: add /auth/refresh endpoint. Constraints: don't change /login. Done-when: POST /auth/refresh returns new token; 401 on invalid token."`

**Bad:** `"Add auth stuff."`

The more precise the done-when, the less back-and-forth.

#### Debug protocol

When something is broken, follow this in order — never skip steps:

```
1. Reproduce   → confirm consistent trigger; document minimal repro steps
2. Isolate     → strip to smallest failing case; remove deps, stub data
3. Hypothesise → list 2-3 most likely causes ranked by probability
4. Probe       → test top hypothesis first; one variable at a time
5. Fix         → smallest change that eliminates the root cause (not the symptom)
6. Verify      → original repro case now passes; run full test suite
7. Log         → root cause + fix summary in CURRENT.md
```

Playbook: `Read .agent/playbooks/debug-pipeline.md`

#### Refactor protocol

Only start a refactor when all three are true:

1. Tests exist (write them first if they don't — ship as a separate commit)
2. Behavior is fully frozen (no feature additions in the same diff)
3. Scope agreed with user

Steps: rename → extract → move → simplify. Run tests green after **each** step. One refactor type per PR.

Playbook: `Read .agent/playbooks/refactor.md`

#### Adding a dependency — evaluate first

Before `npm install` / `pip install` / `<PackageReference>` ask:

1. Can stdlib or an existing dep do this? (often yes)
2. Size impact acceptable?
3. License compatible with this project?
4. Actively maintained? (last commit < 12 months, issues responsive)
5. `npm audit` / `pip-audit` clean after install?
6. Approved → add to `.agent/context/dependencies.md`

Playbook: `Read .agent/playbooks/add-dependency.md`

#### Architectural decisions (ADRs) — log them

**ADR = Architecture Decision Record.** A short note that captures *why* a hard-to-reverse choice was made. The NNN is just a sequential number: ADR-001, ADR-002, etc.

Examples of things worth an ADR: choosing a framework, picking a database, splitting a monolith, deciding on an HTTP vs WebSocket API, adopting this multi-framework platform.

Without ADRs, future agents (and future you) waste time re-examining decisions that were already thoroughly considered. With them, everyone reads the record and moves on.

```
Read .agent/context/adr-log.md
# Add entry: decision + context + alternatives considered + consequences
```

Full template and examples are in the file. ADR-001 is pre-filled at bootstrap (the decision to adopt this platform).

#### Test enforcement — built in from v2.2

The platform mandates tests at every handoff. Rules live in `.agent/CONVENTIONS.md` and `.agent/CHECKLIST.md`.

| Trigger | Required |
|---------|---------|
| New public function or module | Unit test |
| Bug fix | Regression test (no exceptions) |
| New API endpoint | Contract test (happy path + ≥1 error path) |
| Any code change | Full suite green before handoff |

The Test expert auto-detects your runner at install. Override in `.agent/CONVENTIONS.md`:
```
Test runner:    {{TEST_RUNNER}}
Coverage cmd:   {{COVERAGE_CMD}}
Coverage gate:  {{COVERAGE_THRESHOLD}}%
```

`untested = unfinished` — agents cannot mark a task done with red tests or uncovered new code.

---

#### Security quick-check (before every commit)

```
- [ ] No hardcoded secrets  (grep -r "password\|api_key\|token\|secret" --include="*.{js,ts,py,cs,env}")
- [ ] Input validated at all trust boundaries
- [ ] Auth checked on every new endpoint
- [ ] New dep audited
- [ ] No over-broad file / network permissions
```

Full audit: `Read .agent/agents/security-agent.md` + `Read .agent/playbooks/security-audit.md`

#### Context hygiene — keep the window clean

- Load only what the task needs — don't scan the whole codebase for a 5-line fix
- Large files: read the relevant section, not the whole file
- Compress bloated context files: `/caveman-compress .agent/PROJECT.md`
- Registry + `CURRENT.md` = minimum context for any agent to orient

---

### Quick-reference card

> The full quick reference is also displayed automatically at every session start.
> `<fw>` = your active framework folder: `claude` · `cursor` · `agents` · `codex`

```
SESSION START       Read .<fw>/prompts/session-start.md and execute it.
SESSION END         Read .<fw>/prompts/session-end.md and execute it.
LOAD EXPERT         Read .agent/agents/<name>-agent.md
BEST PRACTICES      Read .agent/BEST-PRACTICES.md
CHECK REGISTRY      Read .agent/handoff/sync/registry.yaml
SEE HANDOFF LOG     Read .agent/handoff/CURRENT.md
LOG ADR             Read .agent/context/adr-log.md
LOG KNOWN ISSUE     Read .agent/context/known-issues.md
ADD DEPENDENCY      Read .agent/playbooks/add-dependency.md
DEBUG               Read .agent/playbooks/debug-pipeline.md
BUG FIX             Read .agent/playbooks/bug-fix.md
REFACTOR            Read .agent/playbooks/refactor.md
SECURITY AUDIT      Read .agent/playbooks/security-audit.md
ADD FEATURE         Read .agent/playbooks/add-feature.md
RELEASE             Read .agent/playbooks/release.md
API INTEGRATION     Read .agent/playbooks/api-integration.md
CAVEMAN ON          "caveman mode"
CAVEMAN OFF         "stop caveman"
COMPRESS FILE       "caveman compress <path>"
RUN TESTS           {{TEST_RUNNER}}
CHECK COVERAGE      {{COVERAGE_CMD}}
LOAD TEST EXPERT    Read .agent/agents/test-agent.md
INSTALL PLATFORM    npx github:zafrirron/Agent-Platform
UPGRADE PLATFORM    npx github:zafrirron/Agent-Platform --mode=upgrade
REPAIR PLATFORM     npx github:zafrirron/Agent-Platform --mode=repair
CHECK FOR UPDATES   node .agent/tools/check-updates.mjs
AGENT UPGRADE       Read .agent/tools/upgrade.md and execute it.
EXTEND PLATFORM     See Extending guide in this file (AGENT-PLATFORM-FRAMEWORK-README.md)
```

---

## Extending guide

> **How to grow this platform** — add new agents, playbooks, skills, frameworks, or API patterns.
> Every extension follows the same anatomy. Prompt templates below are copy-paste ready for any IDE.

---

### What can be extended

| What | Adds |
|------|------|
| **Expert agent** | New domain persona in `.agent/agents/` |
| **Playbook** | New step-by-step workflow in `.agent/playbooks/` |
| **Shared skill** | New capability (like caveman) in `.agent/skills/` — wired into all frameworks |
| **Context file** | New living reference doc in `.agent/context/` |
| **IDE framework** | 5th framework (Windsurf, Cline, Copilot Workspace, etc.) |
| **Claude Code command** | New `/slash-command` in `.claude/commands/` |
| **Session protocol step** | Extra check at start or end of every session |
| **Best practice / rule** | New golden rule, protocol, or checklist item |
| **API agentic pattern** | Conventions for agents that build or consume HTTP APIs |

---

### The extension anatomy — always the same 7 steps

Every extension touches the **templates pack** in this order. Give this list when extending the platform:

```
1. This README — Usage / Extending sections + quick-ref card
2. Install tables — update counts/lists if needed
3. AGENT-PLATFORM-TEMPLATES/ — add or edit template file(s)
4. node tools/build-bootstrap-manifest.js — regenerate manifest
5. Stub templates / apply.js Phase 3 — if project-specific
6. Bump bootstrap_version in manifest + AGENT-PLATFORM-BOOTSTRAP.md footer
7. AGENTS.md template — update expert table or hard rules if relevant
```

Miss any step and the next consumer repo upgraded from the pack will not get the new capability.

---

### Prompt templates — copy, fill the blanks, send to any agent

---

#### Add a new expert agent

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add a new expert agent for [DOMAIN — e.g. "Mobile / React Native", "ML / AI pipelines", "Performance"].

Follow the extension anatomy (all 7 steps):
1. Usage Guide §3 expert table — add row
2. "What this installs" — update shared-hub row to mention the new agent
3. Templates tree — no new dirs needed (.agent/agents/ exists)
4. AGENT-PLATFORM-TEMPLATES/ — add FILE: .agent/agents/[name]-agent.md template:
   - Domain, Owns, Before work, Rules sections
   - Rules must reference BEST-PRACTICES.md and CONVENTIONS.md
5. Phase 3 — no stub needed (agent fills own context from scan)
6. Manifest rebuild + version bump — add: [ ] .agent/agents/[name]-agent.md exists
7. AGENTS.md template §2 — add row to specialist table

Also create .agent/agents/[name]-agent.md in this repo now, filled for [PROJECT_NAME].
```

---

#### Add a new playbook

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add a new playbook for [SCENARIO — e.g. "incident response", "data migration", "onboarding a new dev"].

Follow the extension anatomy (all 7 steps):
1. Usage Guide quick-ref card — add: [SHORTNAME]  Read .agent/playbooks/[name].md
2. "What this installs" — update playbooks count/list
3. Templates tree — no new dirs needed
4. AGENT-PLATFORM-TEMPLATES/ — add FILE: .agent/playbooks/[name].md with:
   - Pre-conditions checklist
   - Numbered steps with agent assignments
   - Rules section
5. Phase 3 — no stub needed
6. Manifest rebuild + version bump — add to the playbooks compliance line
7. AGENTS.md — update §7 Re-bootstrap note if playbook changes session flow

Also create .agent/playbooks/[name].md in this repo now.
Also add [name] to .agent/BEST-PRACTICES.md playbook index table.
```

---

#### Add a new shared skill (like caveman)

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add a new shared skill called [SKILL-NAME] that [WHAT IT DOES].

Follow the extension anatomy (all 7 steps):
1. Usage Guide — add §N describing the skill and how to activate it per framework
2. "What this installs" — add row: [SKILL-NAME] | [purpose]
3. Templates tree — add: .agent/skills/[skill-name]/  and  .claude/commands/ (if new commands)
4. AGENT-PLATFORM-TEMPLATES/ — add FILE: templates for:
   - .agent/skills/[skill-name]/SKILL.md  (the definition — single source of truth)
   - .agent/skills/[skill-name]/README.md (quick-ref + framework wiring table)
   - .claude/commands/[skill-name].md     (Claude Code slash command)
   - .cursor/rules/[skill-name].mdc       (Cursor MDC rule, alwaysApply: false)
   - .agents/skills/[skill-name].md       (Antigravity wiring)
   - note in .codex/instructions.md template (Codex plain-language activation)
5. Phase 3 — no stub needed (skill is universal, not project-specific)
6. Manifest rebuild + version bump — add compliance checks for each framework wiring file
7. AGENTS.md template §6 or new section — describe how to activate the skill

Also create all the wiring files in this repo now.
```

---

#### Add support for a new IDE / framework

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add [FRAMEWORK-NAME] (folder: .[folder]/) as a 5th supported framework.

Follow the extension anatomy (all 7 steps):
1. Usage Guide §1 + §2 tables — add row for new framework start/end commands
2. "What this installs" — update "4 IDE frameworks" row to "5 IDE frameworks"
3. Templates tree — add:
   .[folder]/
   .[folder]/prompts/
   .[folder]/rules/   (if applicable)
   .[folder]/skills/
   .[folder]/local/
4. AGENT-PLATFORM-TEMPLATES/ — add FILE: templates for:
   .[folder]/prompts/session-start.md
   .[folder]/prompts/session-end.md
   .[folder]/FRAMEWORK.json
   .[folder]/local/.gitkeep
   Wire all existing skills into .[folder]/skills/
5. Phase 3 — no stub
6. Manifest rebuild + version bump — add: [ ] .[folder]/prompts/session-start.md exists
7. Registry template — add frameworks.[id]: idle block
   SYNC-POINTS.md template — add row
   AGENTS.md template §1 — add row
   ZONES.md template Zone A — add row
   .gitignore Phase 4 block — add .[folder]/local/

Also create the .[folder]/ structure in this repo now.
```

---

#### Add a new context reference file

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add a new context file .agent/context/[name].md that tracks [WHAT IT TRACKS].

Follow the extension anatomy (all 7 steps):
1. Usage Guide quick-ref card — add: [NAME UPPER]  Read .agent/context/[name].md
2. "What this installs" — update context files count/list
3. Templates tree — no new dirs needed
4. AGENT-PLATFORM-TEMPLATES/ — add FILE: .agent/context/[name].md with:
   - Description of what goes here
   - Format / schema for entries
   - At least one example entry
5. Phase 3 — if project-specific, add: .agent/context/[name].md | Fill from scan
6. Manifest rebuild + version bump — add: [ ] .agent/context/[name].md exists
7. AGENTS.md §5 hard rules or BEST-PRACTICES.md — reference when agents should update it

Also create .agent/context/[name].md in this repo now, pre-filled for [PROJECT_NAME].
```

---

#### Add a new best practice or golden rule

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add a new agentic best practice: "[RULE — e.g. 'Always run the linter before marking done']"

Touch all locations where rules live:
1. Usage Guide §9 golden rules table — add row (if a top-10 rule) or new sub-section
2. AGENT-PLATFORM-TEMPLATES/.agent/BEST-PRACTICES.md — add the rule in the right section
3. AGENT-PLATFORM-TEMPLATES/.agent/CONVENTIONS.md — add to relevant sub-section (General / Testing / Git / Security)
4. AGENTS.md template §5 hard rules — add if it applies universally
5. Pre-handoff CHECKLIST.md template — add checkbox if it's verifiable at session end
6. Manifest rebuild + version bump — no new check needed unless it produces a new file

Also update .agent/BEST-PRACTICES.md and .agent/CONVENTIONS.md in this repo now.
```

---

### API agentic development — best practices

When agents build, consume, or extend HTTP APIs, add these conventions to your platform:

#### API contract discipline

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add API agentic development conventions to this bootstrap.
Add FILE: .agent/context/api-patterns.md with the following content and wire it into
the backend-agent.md template and BEST-PRACTICES.md:
```

What to include in `.agent/context/api-patterns.md`:

| Pattern | Rule |
|---------|------|
| **Schema first** | Define OpenAPI / JSON Schema before writing any handler code |
| **Never break the contract** | Additive changes only without a version bump; removal = major version |
| **Version from day one** | `/v1/` prefix on all routes; plan for `/v2/` before you need it |
| **Explicit error surface** | Every endpoint documents its error codes; no bare `500` leaks |
| **Idempotency keys** | POST endpoints that agents call in retry loops must be idempotent |
| **Structured errors** | `{ "error": "code", "message": "human text", "details": {} }` — never plain strings |
| **Auth by injection** | Tokens from env / secrets manager; never hardcoded; never logged |
| **Rate limit awareness** | Agents must handle `429` with exponential backoff + jitter |
| **Pagination from the start** | Cursor-based preferred; agents that loop results must handle empty pages |
| **Correlation IDs** | Every request gets `X-Request-ID`; agents log it for traceability |
| **Mock first** | Build against a mock/stub before the real upstream exists |
| **Contract tests** | One test per documented behaviour; fails if contract drifts |

#### Agentic API tool-use patterns

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add a playbook .agent/playbooks/api-integration.md for agents that integrate
external APIs as tools or data sources. Include:
- Schema-first workflow
- Mock → stub → real progression
- Error and retry handling
- Auth secret injection pattern
- Rate-limit and backoff pattern
- Contract test requirement
- Update api-contracts.md rule
```

#### MCP server integration

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add MCP (Model Context Protocol) server support as a new skill.
- Create .agent/skills/mcp/ with SKILL.md describing how to declare and use MCP tools
- Wire into .claude/ (MCP tools are Claude-native)
- Add playbook .agent/playbooks/add-mcp-server.md:
  1. Define tool schema (name, description, input_schema)
  2. Implement server (stdio or SSE transport)
  3. Register in .claude/settings.json mcpServers block
  4. Document in .agent/context/api-contracts.md
  5. Add integration test
```

---

### Evolving the bootstrap itself — the meta-prompt

To update `AGENT-PLATFORM-BOOTSTRAP.md` to include any new capability permanently (so every future repo gets it), use this as your base prompt:

```
Read AGENT-PLATFORM-BOOTSTRAP.md

I want to permanently add [CAPABILITY] to this bootstrap so every new repo
bootstrapped from this file gets it automatically.

Follow the 7-step extension anatomy:
1. Usage Guide    — human doc + quick-ref card entry
2. What installs  — table row
3. Appendix A     — new directories if any
4. AGENT-PLATFORM-TEMPLATES/ — add or edit template file(s)
5. Phase 3        — stub-fill instruction if project-specific
6. Rebuild manifest + bump version
7. AGENTS.md tpl  — update relevant section

Then also apply the change to this repo immediately (create the actual files).
Finally bump the version in the footer line.

Capability to add: [DESCRIBE IN ONE SENTENCE]
Files it creates: [LIST PATHS]
Frameworks it touches: [all | cursor | claude | antigravity | codex]
```

Use this prompt verbatim — every part maps to a concrete location in the file. The agent will know exactly where to make each change.

---


---

## Framework repository — maintain and release

1. Edit `AGENT-PLATFORM-TEMPLATES/`
2. `node tools/build-bootstrap-manifest.js`
3. Bump `bootstrap_version` in manifest + orchestrator footer + README footer + `package.json`
4. Update `CHANGELOG.md` — new version block + upgrade guide section
5. Create a GitHub Release with the new tag — `npx github:zafrirron/Agent-Platform#vX.Y.Z` installs that exact version

**CHANGELOG:** [`CHANGELOG.md`](CHANGELOG.md) — full version history, upgrade matrix, and per-path migration instructions.

**Quality gate:** no consumer-product strings inside the pack (search product names and app folder names — zero hits).

---

## Tell an agent what this project is

```
Read AGENT-PLATFORM-FRAMEWORK-README.md for the full platform guide.
Read AGENT-PLATFORM-BOOTSTRAP.md only when installing on a consumer repository.
```

---

*Agent Platform Bootstrap v2.6 — complete human guide · templates in AGENT-PLATFORM-TEMPLATES/*
