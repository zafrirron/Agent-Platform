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

> **One pack. One command. A complete agentic development environment on any repository.**

Copy the platform pack to any consumer repository root — new or existing — then tell your agent: **`Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.`** In 30–90 seconds it builds a full coordination platform: 4 IDE frameworks working together without conflicts, 8 software-expert agents you activate by name, 7 step-by-step playbooks for every common scenario, living project-knowledge docs, built-in token compression, and a self-documenting extension system. Your existing code is never touched.

---

## What you get

| Capability | What it does |
|------------|-------------|
| **4 IDE frameworks** | Claude Code · Cursor · Antigravity · Codex — each gets a private folder with session-start/end prompts and skill wiring |
| **Cross-IDE coordination** | `registry.yaml` prevents two IDEs editing the same file simultaneously; `CURRENT.md` preserves full context across switches |
| **8 software-expert agents** | Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data — activate by name, chain across sessions |
| **7 playbooks** | add-feature · release · debug-pipeline · bug-fix · refactor · add-dependency · security-audit — step-by-step with agent assignments |
| **10 best-practice rules** | Golden rules, task anatomy (Context/Goal/Constraints/Done-when), debug protocol, refactor discipline, dep evaluation, security baseline — in `.agent/BEST-PRACTICES.md` |
| **5 living context files** | api-contracts · adr-log (Architecture Decision Records) · known-issues · dependencies · project-overview — kept in sync as code evolves |
| **🪨 Caveman skill** | ~65% output token savings; 5 slash commands (`/caveman`, `/caveman-commit`, `/caveman-review`, `/caveman-stats`, `/caveman-compress`); wired into all 4 frameworks |
| **API agentic patterns** | 12 conventions for agents that build or consume APIs: schema-first, contract discipline, idempotency, structured errors, auth injection, rate-limit backoff, mock-first, contract tests |
| **Extensible by prompt** | 7-step extension anatomy + ready-to-paste prompts for adding new agents, playbooks, skills, IDE frameworks, or context files — permanently, so every future repo gets them |
| **Self-customising** | Phase 3 scans your codebase and fills project-specific stubs (stack, components, entry points, contracts, deps) automatically |
| **Safe to run anywhere** | Default mode creates missing files only — never overwrites existing content, never touches application source |

---

## Activate

**This platform is installed by telling your agentic IDE what to read.** You do not run shell commands yourself unless you choose the optional CLI path below.

**Install on any repo (new or existing)** — paste into Cursor, Claude Code, Antigravity, or Codex:

```
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
```

**Modes** — append to the same line:

| You want | Tell the agent |
|----------|----------------|
| First install (default) | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.` |
| Repair broken refs / empty stubs | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=repair` |
| Add new pack files only | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=upgrade` |
| Reset templates (confirm first) | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=force` |

The agent reads the orchestrator, runs the five phases, and may call `node AGENT-PLATFORM-APPLY.js` on your machine when needed.

**Optional (no agent):** `node AGENT-PLATFORM-APPLY.js` with `--mode=install|repair|upgrade|force` — same result, not the primary workflow.

---

## Installation guide

> **How to get this platform onto any repo — new or existing — in under a minute.**

---

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| A git repository | `git init` if starting fresh |
| Any agentic IDE | Claude Code, Cursor, Antigravity, or Codex (VS Code) |
| Platform pack | See [COPYING.md](COPYING.md) |

No other tools required. The agent does all the work.

---

### Installing on a new repository

```
1.  Create or clone your repo
2.  Copy the pack files from COPYING.md into the repo root
3.  Open the repo in your agentic IDE
4.  Tell the agent:

    Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.

5.  The agent runs 5 phases automatically (see below)
6.  When done, run your IDE's session-start command (agent will tell you which one)
```

---

### Installing on an existing repository

Same steps — the bootstrap **never overwrites existing files** in default mode. It only creates what is missing.

```
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
```

Your existing code, docs, and config are untouched. Only the `.agent/`, `.claude/`, `.cursor/`, `.agents/`, `.codex/` platform scaffolding is added.

---

### What the agent does — the 5 phases

| Phase | What happens |
|-------|-------------|
| **0 · Discover** | Reads repo name, README, stack (languages, build files) |
| **1 · Verify pack** | Confirms manifest + `AGENT-PLATFORM-TEMPLATES/` at repo root |
| **2 · Apply** | Runs apply (e.g. `node AGENT-PLATFORM-APPLY.js`) — writes templates; skips existing files |
| **3 · Stubs** | Fills project-specific stubs: stack, components, entry points, API contracts, dependencies |
| **4 · Gitignore** | Appends `*/local/` and framework-scratch paths to `.gitignore` |
| **5 · Report** | Lists files created/skipped, framework switch commands, next step |

Total time: typically **30–90 seconds** depending on codebase size.

---

### Modes

| You want to… | Tell the agent |
|-------------|----------------|
| Install (first time, or add missing files) | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.` |
| Repair broken links / fill empty stubs | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=repair` |
| Add files from a newer pack | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=upgrade` |
| Reset templates to latest (⚠️ overwrites templates) | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=force` |

`mode=force` requires explicit confirmation before overwriting. Application source is never touched.

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
│   ├── PROJECT.md, CONVENTIONS.md, WORKFLOWS.md, FILE_MAP.md
│   ├── ZONES.md, SYNC.md, CHECKLIST.md
│   ├── agents/                       ← 8 software-expert personas
│   │   architect · backend · frontend · devops · test · docs · security · data
│   ├── playbooks/                    ← 7 step-by-step workflows
│   │   add-feature · release · debug-pipeline · bug-fix · refactor
│   │   add-dependency · security-audit
│   ├── context/                      ← 5 living reference files
│   │   project-overview · api-contracts · adr-log · known-issues · dependencies
│   ├── skills/caveman/SKILL.md       ← 🪨 token-compression skill
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

### Copying to a different repository

Copy the **platform pack** (see [COPYING.md](COPYING.md)) to the new repo root and trigger install. Everything else is generated from it.

```powershell
# Example: copy bootstrap to another project
# Copy pack per COPYING.md ..\other-project\
# Then in that project's IDE tell the agent:
# Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
```

The generated files are project-aware — Phase 3 fills stubs from that repo's own codebase scan.

---

### Updating an existing installation

When a new version of the bootstrap is available:

1. Copy the new pack release (orchestrator + manifest + templates)
2. Tell the agent: `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.`  
   → adds any new files; skips existing ones
3. `… mode=upgrade` for new manifest entries; `… mode=repair` for empty stubs; `… mode=force` resets templates (confirm first)

Your customised content (filled stubs, project-specific docs, ADRs, known-issues) is never overwritten in default or repair mode.

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
| 🧪 Test | `Read .agent/agents/test-agent.md` | Tests, fixtures, coverage |
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

Caveman cuts AI output by ~65% while keeping full technical accuracy. Activate it any time.

**Claude Code slash commands:**

```
/caveman              → full compression (default)
/caveman lite         → remove filler, keep full sentences
/caveman ultra        → maximum — abbreviate everything
/caveman wenyan       → classical Chinese mode
/caveman-commit       → conventional commit ≤50 chars
/caveman-review       → one-line code review per issue
/caveman-stats        → show session token savings
/caveman-compress .agent/PROJECT.md   → compress a context file ~46%
stop caveman          → return to normal
```

**Cursor / Antigravity / Codex** — tell the agent in plain language:

```
caveman mode
caveman lite
caveman ultra
stop caveman
```

The skill definition at `.agent/skills/caveman/SKILL.md` is the same across all frameworks.

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

### 8 · Repair or re-run the platform

If files get out of sync, stubs are empty, or you've copied the bootstrap to a new repo:

```
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=repair
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=upgrade
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
CAVEMAN ON          /caveman  (Claude Code)  |  "caveman mode"  (others)
CAVEMAN OFF         stop caveman
COMPRESS FILE       /caveman-compress <path>
INSTALL PLATFORM    Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
REPAIR PLATFORM     Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=repair
UPGRADE PLATFORM    Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=upgrade
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
3. Bump `bootstrap_version` in manifest + orchestrator footer
4. Tag release; consumer repos copy the tagged pack

**Quality gate:** no consumer-product strings inside the pack (search product names and app folder names — zero hits).

---

## Tell an agent what this project is

```
Read AGENT-PLATFORM-FRAMEWORK-README.md for the full platform guide.
Read AGENT-PLATFORM-BOOTSTRAP.md only when installing on a consumer repository.
```

---

*Agent Platform Bootstrap v2.1 — complete human guide · templates in AGENT-PLATFORM-TEMPLATES/*
