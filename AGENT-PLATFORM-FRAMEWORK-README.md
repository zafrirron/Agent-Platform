# Agent Platform Bootstrap — complete guide

> **Human documentation** for the framework pack and for day-to-day use after install.  
> **Agent install:** [AGENT-PLATFORM-BOOTSTRAP.md](AGENT-PLATFORM-BOOTSTRAP.md) · **Copy list:** [COPYING.md](COPYING.md) · **Deploy:** [PACK-DEPLOY.md](PACK-DEPLOY.md)

[![License: Elastic-2.0](https://img.shields.io/badge/License-Elastic_2.0-blue.svg)](LICENSE)
© 2024–2026 [Zafrir Ron](https://github.com/zafrirron) · Free for personal and internal use · Commercial hosting/SaaS prohibited · [Full license](LICENSE)

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

Run `npx github:zafrirron/Agent-Platform` in any repo root. In 30–90 seconds it builds a full coordination platform: 5 IDE frameworks working together without conflicts, 9 software-expert agents (including the Critic — adversarial reviewer) you activate by name, **20 step-by-step playbooks** (core delivery + NFR/quality + compliance/maturity), a framework-aware quick reference on every session start, built-in test enforcement, ISO 25010-style NFR register, production-readiness and compliance evidence gates, docs governance (every doc has a registered owner — release blocked until Docs agent approves all docs current), living project-knowledge docs, built-in token compression, zero footprint (all files gitignored, clean uninstall), and a self-documenting extension system. Your existing code is never touched.

**Lifecycle:** `INSTALL → SESSION → ROUTE → GATES → SHIP` — see [How it works](#how-it-works) in the main README.

---

## Language, technology-stack, platform & domain packs (opt-in overlays)

> **The core is stack-agnostic. Packs make it an expert in *your* stack — without bloating everyone else's.**

The platform core deliberately gives **general** software-engineering discipline for any project. **Packs** layer curated, opinionated, failure-derived knowledge for a specific programming language, technology stack, execution platform, or business domain **on top of** the core, without modifying it.

**Prompt-driven — no terminal commands.** Just ask your agent (it runs the install for you):

```text
"what packs are available"      "which packs should I use" / "scan my repo for packs"
"activate the React pack"        "what packs are active"
"add this rule to my <pack> pack"   → saved to user.overlay.md (survives every update)
```

| Kind | Available | What it adds |
|------|-----------|--------------|
| `language:*` | `language-typescript`, `language-java`, `language-cpp` | The language's own type/memory/concurrency footguns — loads for every code-writing expert |
| `stack:*` | `stack-react`, `stack-django` | Framework/library idioms, pitfalls, perf traps, version gotchas |
| `domain:*` | `domain-fintech` | Compliance, domain invariants, threat models, and **reference architectures** linked to real source apps |
| `platform:*` | *roadmap (design-formalized)* | Execution/deployment target — hardware (Jetson, STM32), OS/RTOS, container runtime (Docker/k8s) |

- **Orthogonal & composable** — a repo can run `language:cpp` + `stack:react` + `domain:fintech` at once. Language ≠ stack: a language pack is reusable across every framework in it. There are **no combo packs**.
- **Opt-in, zero bloat** — never installed by any profile; only via `--mode=add --add=pack:<id>`, recorded in `.agent/platform.json` → `active_packs`. Zero cost when none are active.
- **Detect-and-suggest** — the installer inspects your project (dependency manifests, `tsconfig.json`/`pom.xml`/`CMakeLists.txt`, source extensions) and *suggests* matching packs — never auto-installs.
- **Overlays, not new experts** — a pack refines a generic expert only while active; core files are never touched.
- **Your rules survive updates** — add pack-specific rules to `.agent/packs/<id>/user.overlay.md` (user-owned, never in the manifest); no upgrade/force/re-install touches it.
- **Grows over time** — the four improvement-source maintainer modes (GitHub scan, web audit incl. greenfield `build-pack=<id>` ecosystem scan, user ingest, hand-authored) grow a pack's brain on an independent lane that never blocks a core release; a fifth mode, **Solution Blueprint**, decomposes a whole system goal into a coordinated pack set across all four axes with per-candidate approval gates.
- **Domain reference architectures** — with a domain pack active, ask *"give me a reference architecture for a fintech app"* → the agent reads the pack's `reference-architecture.md` and points you at the linked real-world source repos (license-aware).
- **Private & proprietary packs** — packs are where company IP belongs, not the public core. **Fork the platform to a private repo, build your packs there, and install from the fork** — teams get the generic core *plus* your private packs; per-project secrets stay in `user.overlay.md`. See the pack spec `.agent/packs/README.md`.

Full user guide: [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md#language-technology-stack-platform--domain-packs-opt-in-overlays) · spec: `.agent/packs/README.md` · design: [MAINTAINER/adr/ADR-001-stack-domain-packs.md](MAINTAINER/adr/ADR-001-stack-domain-packs.md).

---

## When to use what

| You want… | Use this | Not this |
|-----------|----------|----------|
| One command, whole repo, any IDE | **Agent Platform** `npx` (default `--profile=full`) | Copying individual skills by hand |
| Solo dev, lightweight skills pack | `--profile=lite --framework=cursor` or Claude plugin | Full platform install |
| One skill only | `--mode=add --add=skill:interview-me` | Whole platform |
| Stack/language/domain-specific expertise | `--mode=add --add=pack:<id>` (language/stack/domain packs) | Bloating the agnostic core |
| Clarify an idea before coding | `/spec` → `interview-me` skill | Jumping straight to add-feature |
| Break spec into tasks | `/plan` | Ad-hoc todo lists in chat |
| Build in slices | `/build` (`build auto` after plan) | One giant implementation pass |
| Prove behavior | `/test` (TDD skill) | "Looks right" without tests |
| Audit UI/API performance | `/webperf` (CWV skill) | Guessing without Lighthouse/APM |
| Onboard to an unknown repo | Full project audit / `/audit` | Random file reads without a report |
| Fix a defect with proof | Bug-fix playbook + Test expert | Ad-hoc patches without regression tests |
| Ship a version tag | Release playbook / `/release` | Manual version bump only |
| Approve go-live (PRR) | Production readiness / `/ship` | Release playbook alone |
| Adversarial quality pass | Critic agent / `/review` | Self-review by the implementing model |
| Optional deterministic gates | `--mode=install-guards` | Hoping the model never skips a step |
| Contribute a rule back | [CONTRIBUTING.md](CONTRIBUTING.md) | Pasting whole third-party skill packs |

Full distribution comparison: [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md).

---

## How we differ from skill packs

Skill packs (e.g. [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills)) excel at **portable expertise** — TDD habits, security checklists, orchestration patterns. Agent Platform is a **repo coordination layer**: multi-IDE registry, session handoff, 20 gated playbooks, living context files, and optional CI/pre-commit enforcement.

| | Agent Platform | Typical skill pack |
|--|----------------|-------------------|
| Install unit | `full` / `core` / `lite` profiles + `--mode=add` | One skill or plugin at a time |
| Claude marketplace | `.claude-plugin/plugin.json` (`agent-platform-skills`) | N/A on Cursor (use `npx`) |
| Session model | session-start / session-end, `CURRENT.md` (full profile) | Per-chat, ad hoc |
| Quality gates | Critic + playbook steps + optional guards | Varies per skill |
| Multi-IDE | Cross-framework Critic, conflict registry (full) | Usually single tool |
| Extension | Documented 7-step anatomy + `SKILL.md` modules | Copy/fork skills |

We **selectively ingest** proven patterns from skill packs into playbooks and `.agent/skills/` (attribution in `MAINTAINER/ingest/`). Lite profile competes with skill packs on install shape; full profile adds coordination.

**Profiles:**

```bash
npx github:zafrirron/Agent-Platform --profile=lite --framework=cursor   # skills pack
npx github:zafrirron/Agent-Platform --profile=core                    # no enterprise playbooks
npx github:zafrirron/Agent-Platform                                   # full (default)
npx github:zafrirron/Agent-Platform --mode=list --list=skills
npx github:zafrirron/Agent-Platform --mode=add --add=skill:tdd
```

See [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md) and [docs/cursor-setup.md](docs/cursor-setup.md).

---

## Engineering concepts we encode

These names appear in playbooks and expert agents — they are deliberate discipline, not buzzwords:

| Concept | Where it lives | One line |
|---------|----------------|----------|
| **Rationalization gate** | Playbook step tables | Agents cannot skip steps by inventing excuses |
| **Doubt review** | add-feature, architect-agent | Challenge assumptions before implementation |
| **Beyoncé Rule** | test-agent | Test behavior, not implementation details |
| **Hyrum's Law** | backend-agent | Every exposed behavior becomes an implicit API contract |
| **Chesterton's Fence** | refactor playbook | Understand why code exists before removing it |
| **Measure-first (CWV)** | performance-budget | Profile and budget before optimizing |

---

## What you get

| Capability | What it does |
|------------|-------------|
| **5 IDE frameworks** | Claude Code · Cursor · Antigravity · Codex · OpenCode — each gets a private folder with session-start/end prompts and skill wiring |
| **Cross-IDE coordination** | `registry.yaml` prevents two IDEs editing the same file simultaneously; `CURRENT.md` preserves full context across switches |
| **9 software-expert agents** | Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data · **Critic** — activate by name, chain across sessions |
| **Critic agent** | Adversarial reviewer with 10 review dimensions (correctness, security, test, completeness, performance, design, dependency, accessibility, operability, BC). Severity-rated findings. Built into add-feature, bug-fix, release, and audit playbooks as mandatory quality gates. |
| **Cross-framework critic review** | When switching IDEs, the new framework automatically offers to run the Critic on the previous framework's work. Zero setup — different AI models reviewing each other's blind spots, every time you switch. Session end commits all changes first so the next IDE always reviews real committed code. |
| **Agent-generated artifacts** | Test expert generates a coverage HTML report; Docs expert generates OpenAPI/Swagger spec. These are your project files — not platform files. Not gitignored by default. Keep, commit, or exclude them as you see fit. See `.agent/PLATFORM-HELP.md` → Agent-generated artifacts. |
| **20 playbooks** | **Core:** audit · add-feature · release · debug-pipeline · bug-fix · refactor · add-dependency · security-audit · api-integration · document-api · deprecation · requirements-clarification. **Quality & NFR:** nfr-definition · production-readiness · performance-budget · observability-setup · accessibility-audit. **Compliance & maturity:** compliance-review · org-maturity-assessment · incident-postmortem. add-feature: spec-outline Step 0, doubt review, Security gate (5a), Critic (5b). |
| **References** | `.agent/references/` — testing-patterns · security-checklist · performance-checklist · accessibility-checklist · orchestration-patterns |
| **NFR & production readiness** | `nfr-log.md` — measurable ISO 25010 / 14-category targets (threshold + measure + verify). `production-readiness` playbook gates go-live: P0 NFRs, compliance evidence, vuln SLA, SBOM, rollback evidence. |
| **Compliance & DORA maturity** | `compliance-evidence-log.md` maps SOC 2 / ISO 27001 SDLC controls to artifacts. `compliance-review`, `org-maturity-assessment`, and `incident-postmortem` playbooks for audit prep and DORA metrics (change failure rate, MTTR). |
| **Quick reference on every session start** | Compact status block on every session start: last work, update status, path to full guide. Full capability guide at `.agent/QUICK-REF.md` — open in editor any time, no chat clutter. No memorisation required. |
| **10 best-practice rules** | Golden rules, task anatomy (Spec/Implement/Test/Handoff), debug protocol, refactor discipline, dep evaluation, security baseline — in `.agent/BEST-PRACTICES.md` |
| **Test enforcement** | Every new public function, bug fix, and API endpoint requires a test before done; coverage gate auto-detected at install; red suite blocks handoff. Test expert auto-generates a visual coverage report (`coverage/lcov-report/index.html`) — open in browser to see line-by-line coverage. |
| **11+ living context files** | api-contracts · adr-log · known-issues · dependencies · project-overview · patterns · nfr-log · compliance-evidence-log · incident-log · docs-registry · reputation.json — kept in sync as code evolves |
| **📋 Docs governance** | Every project doc is registered with an owner expert, audience, and staleness threshold. All expert Done-when checklists require checking owned docs. Session end scans for new unregistered files. Release playbook blocked until Docs agent audits all docs current. Pre-commit guard warns on unregistered new doc files. |
| **🪨 Caveman skill** | ~65% output token savings; activated with `"caveman mode"` across all 5 frameworks |
| **Agentic update check** | `node .agent/tools/check-updates.mjs` — or tell the agent: `Read .agent/tools/upgrade.md and execute it.` Checks once per 7 days, caches result. |
| **3 install paths** | npx · curl/iwr shell one-liner · agent-direct. No file copying. Version-pinnable. |
| **API agentic patterns** | 12 conventions for agents that build or consume APIs: schema-first, contract discipline, idempotency, structured errors, auth injection, rate-limit backoff, mock-first, contract tests |
| **Extensible by prompt** | 7-step extension anatomy + ready-to-paste prompts for adding new agents, playbooks, skills, IDE frameworks, or context files — permanently, so every future repo gets them |
| **Self-customising** | Phase 0 scans your codebase and fills project name, stack, test runner, coverage command, and entry points automatically |
| **Zero code impact** | Installs only into `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/` `.opencode/` — your source files are never modified. All platform files gitignored automatically. Remove with one command and nothing remains. |

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
npx github:zafrirron/Agent-Platform#vX.Y.Z  # pin to a specific version

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
AP_VERSION=vX.Y.Z AP_MODE=upgrade \
  curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash
```

**Windows PowerShell:**
```powershell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

With options (save script first, then run with params):
```powershell
.\install.ps1 -Version vX.Y.Z -Mode upgrade
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
| `global` | Install user-level stubs to `~/` — activates platform in every repo, globally |

---

### Global install — activate the platform across all repos (optional, run once)

Install user-level stubs to your home directory so the platform auto-activates in any repo:

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

Writes stubs to: `~/.claude/CLAUDE.md` · `~/.claude/commands/` · `~/.cursor/rules/` · `~/.cursor/commands/` · `~/.codex/instructions.md` · `~/.agents/rules/`

**Behaviour per repo after global install:**

| Repo state | What happens at session start |
|---|---|
| Platform installed (`AGENTS.md` present) | Expert routing activates automatically — no commands needed |
| Platform not installed | One-time install offer displayed |
| `.agent-platform-skip` present | Offer suppressed permanently for that repo |

**The three-layer model:**

```
~/.claude/CLAUDE.md  USER section   ← personal cross-repo preferences (never overwritten)
[repo]/AGENTS.md     PROJECT section ← team coding conventions  
[repo]/.agent/       PLATFORM section ← framework expert rules
```

Upgrade global stubs later with the same command: `npx github:zafrirron/Agent-Platform --mode=global`

---

## Installation guide

> **How to get this platform onto any repo — new or existing — in under a minute.**

---

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| A git repository | `git init` if starting fresh |
| Any agentic IDE | Claude Code, Cursor, Antigravity, Codex (VS Code), or OpenCode |
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

**Zero changes to your existing code.** The installer adds only platform coordination folders (`.agent/`, `.claude/`, `.cursor/`, `.agents/`, `.codex/`, `.opencode/`) and root files (`AGENTS.md`, `SYNC-POINTS.md`, `CLAUDE.md`, `opencode.json`). All of these are added to `.gitignore` automatically — your `git status` stays clean and nothing is accidentally committed with your code.

**Already using Claude Code, Cursor, Antigravity, Codex, or OpenCode before installing?** The installer scans for pre-existing AI artifacts before touching anything:

| Found | What happens |
|-------|-------------|
| `CLAUDE.md` | Preserved (not overwritten) · backed up to `.agent/backup/` · `MIGRATION-NOTES.md` explains how to connect it |
| `AGENTS.md` | Preserved · backed up · merge guidance provided |
| `.cursor/rules/*.mdc` (your files) | Not touched — platform adds its own rules alongside yours |
| `.cursorrules` | Detected and noted — not modified (legacy Cursor format) |

Install summary shows exactly what was found. `.agent/MIGRATION-NOTES.md` explains each detected file and what to do with it.

**On uninstall:** all platform files are removed AND any backed-up originals are restored. Your project returns to its exact pre-install state.

To share platform config with your team (optional), remove specific entries from the platform block in `.gitignore`.

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
│   ├── session-start-shared.md       ← shared session-start logic for all 5 frameworks
│   ├── PROJECT.md, CONVENTIONS.md, WORKFLOWS.md, FILE_MAP.md
│   ├── ZONES.md, SYNC.md, CHECKLIST.md
│   ├── agents/                       ← 9 software-expert personas + machine-readable manifests
│   │   architect · backend · frontend · devops · test · docs · security · data · critic
│   │   Each agent has a companion *.manifest.json defining capabilities, routing keywords,
│   │   Critic dimensions, and trust ceiling — machine-readable foundation for Phase 5-6 routing
│   ├── agents/schemas/               ← JSON Schema for agent manifests
│   ├── playbooks/                    ← 20 step-by-step workflows
│   │   core: audit · add-feature · release · bug-fix · refactor · debug-pipeline
│   │   add-dependency · security-audit · api-integration · document-api
│   │   requirements-clarification · deprecation
│   │   quality: nfr-definition · production-readiness · performance-budget
│   │   observability-setup · accessibility-audit
│   │   compliance: compliance-review · org-maturity-assessment · incident-postmortem
│   ├── references/                   ← testing · security · performance · a11y · orchestration checklists
│   ├── context/                      ← living reference files
│   │   project-overview · api-contracts · api-patterns · adr-log · known-issues · dependencies
│   │   spec-outline · nfr-log · compliance-evidence-log · incident-log · docs-registry
│   │   reputation.json               ← per-agent trust scores (seeds Phase 5 reputation-aware gates)
│   │   patterns                      ← reusable approaches from prior sessions (agents write + read)
│   ├── skills/caveman/SKILL.md       ← 🪨 token-compression skill
│   ├── packs/                        ← opt-in overlays (only when activated) + shared README.md
│   │   language-* · stack-* · domain-* (platform-* = roadmap); each: pack.json + overlays + references
│   │   user.overlay.md               ← YOUR pack rules — user-owned, survives every update
│   ├── tools/
│   │   ├── check-updates.mjs         ← version check vs GitHub (7-day cache)
│   │   ├── upgrade.md                ← agent self-upgrade prompt
│   │   ├── packs.md                  ← agent-run pack management (list/activate/scan/add-rule)
│   │   ├── check_locks.js            ← file conflict checker
│   │   ├── prune_handoff.js          ← handoff log pruner
│   │   └── launch.mjs / .sh / .ps1  ← app launcher
│   └── handoff/
│       ├── CURRENT.md                ← session log (newest first)
│       └── sync/registry.yaml        ← active-framework lock
│
├── .claude/   🔒 Claude private
│   ├── commands/  ← lifecycle slash commands (/spec · /audit · /ship · /caveman · …)
│   ├── rules/
│   └── prompts/session-start.md + session-end.md
│
├── .cursor/   🔒 Cursor private
│   ├── commands/  ← lifecycle slash commands (/session-start · /implement · /spec · …)
│   ├── rules/     ← platform-core · plan-mode-handoff · caveman
│   └── prompts/session-start.md + session-end.md
│
├── .agents/   🔒 Antigravity private
│   ├── skills/caveman.md
│   └── prompts/session-start.md + session-end.md
│
├── .codex/    🔒 Codex private
│   └── prompts/session-start.md + session-end.md
│
└── .opencode/ 🔒 OpenCode private (+ opencode.json at root)
    ├── commands/  ← lifecycle slash commands (/spec · /plan · /build · …)
    ├── agents/    ← critic subagent (@critic)
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

**Why upgrades are valuable:** Every release includes rules sourced from four places: OWASP security guidelines and CWE Top 25 (Mode 2), real production failures (Mode 1), user-contributed production-proven rules (Mode 3), and new coordination/governance patterns discovered via quarterly GitHub ecosystem scans (Mode 4). Your expert agents automatically become aware of new vulnerability classes, updated security standards, current engineering practices, and the latest open-source governance innovations — without you tracking those sources yourself. The more you upgrade, the smarter your agents become.

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
| **OpenCode** | `Read .opencode/prompts/session-start.md and execute it.` |

---

### 2 · End every session

Always run before switching tools or closing the IDE. The agent marks itself idle and logs what it did so the next agent picks up cleanly.

| You are using | Paste this |
|---------------|-----------|
| **Claude Code** | `Read .claude/prompts/session-end.md and execute it.` |
| **Cursor** | `Read .cursor/prompts/session-end.md and execute it.` |
| **Antigravity** | `Read .agents/prompts/session-end.md and execute it.` |
| **Codex (VS Code)** | `Read .codex/prompts/session-end.md and execute it.` |
| **OpenCode** | `Read .opencode/prompts/session-end.md and execute it.` |

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
| 🔒 Security | `Read .agent/agents/security-agent.md` | Secrets, auth review, threat model, OWASP audits |
| 🗄 Data | `Read .agent/agents/data-agent.md` | Schemas, migrations, pipelines |
| 🔍 Critic | `Read .agent/agents/critic-agent.md` | Adversarial review — find what's wrong before production does |

You can chain experts in one session. Common chain: Architect → Backend → Test → **Critic** → Docs.

**Cross-framework critic:** When starting a session in a different IDE than the last one, the Critic is offered automatically — see §4.

---

### 4 · Switch between IDEs — with automatic cross-framework critic review

You can move a task from Cursor to Claude Code (or any combination) without losing context. And when you switch, the platform turns the handoff into an automatic code review.

```
# In Cursor — end session (records files changed + Critic reviewed: no)
Read .cursor/prompts/session-end.md and execute it.

# In Claude Code — start session
Read .claude/prompts/session-start.md and execute it.
```

**What happens automatically on session start in a different framework:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Cross-framework Critic review available                        │
│  Last session: cursor — [goal from handoff log]                 │
│  Files changed: [file list]                                     │
│  A different AI model did this work. Review before we proceed?  │
│  YES / NO                                                       │
└─────────────────────────────────────────────────────────────────┘
```

If you answer YES, the new framework's agent reads the changed files cold — no shared context, no shared assumptions — and runs a full 6-dimension Critic review. Different AI models have different blind spots. This cross-model review catches what the first model consistently misses.

The registry at `.agent/handoff/sync/registry.yaml` prevents two IDEs from editing the same files simultaneously. If a conflict is detected, the agent will tell you who owns what and what to do.

---

### 5 · 📋 Docs governance — documentation stays current automatically

Most projects have the same problem: documentation drifts behind the code because no one enforces it. The platform solves this with a registry-driven enforcement chain that applies to every user project.

**How it works:**

```
.agent/context/docs-registry.md
  Every doc → owner expert → audience → update trigger → last reviewed
```

**Four enforcement points:**

| When | What happens |
|------|-------------|
| Expert finishes a task | Done-when checklist: check owned docs, update any affected rows |
| Expert creates a new doc file | Must add it to the registry before session ends |
| Session end | Scans for new `.md` files not yet in the registry — prompts to register |
| Release (release.md Step 4) | Docs agent audits every registry row — any stale or unregistered file = **BLOCKED** |

**Pre-commit guard** (with `--mode=install-guards`): warns when newly staged `.md` files outside `.agent/` are missing from the registry.

**First session on a new project:** the Docs agent scans the project for all existing doc files and populates the registry rows automatically.

**The result:** every release ships with documentation that was explicitly reviewed by the expert who owns it. No more "we'll update the docs later."

---

### 6 · 🪨 Caveman — token compression mode

Caveman cuts AI output by ~65% while keeping full technical accuracy. Activate it any time using natural language — the same commands work across all 5 frameworks.

```
caveman mode          → full compression (default)
caveman lite          → remove filler, keep full sentences
caveman ultra         → maximum — abbreviate everything
caveman compress <path> → compress a context file ~46%
stop caveman          → return to normal
```

The skill definition at `.agent/skills/caveman/SKILL.md` is the single source of truth across all frameworks.

---

### 7 · Check who is active / last handoff

```
# Ask any agent:
Read .agent/handoff/sync/registry.yaml and tell me which frameworks are active.

# See the full session log:
Read .agent/handoff/CURRENT.md
```

---

### 8 · Run a multi-agent workflow

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

### 9 · Changelog management

The platform installs and manages `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) best practices.

**On install — starter template created automatically**

If your project has no `CHANGELOG.md`, the platform creates one with:
- A professional header and guiding principles
- `[Unreleased]` section to track work-in-progress changes
- Full format reference with an example entry, authoring rules, and comparison link stubs
- If you already have a `CHANGELOG.md` — it is never touched; your existing file is preserved as-is

**On every release — DevOps agent writes the entry**

The release playbook (Step 3c) directs the DevOps agent to:
1. Collect all commits since the last tag + session handoff notes
2. Determine the semver bump level (patch / minor / major)
3. Write a new versioned section at the top of `CHANGELOG.md`
4. Respect your existing format — if your changelog uses a different style, the agent follows it

**Retrofitting an old changelog**

If your project has an existing changelog in a different format, the DevOps agent can convert it:

```
retrofit my changelog to the platform standard format
```

The agent reads your existing file, maps every entry to the correct section (Added / Changed / Fixed / Removed / Security), drops internal-only entries that have no user impact, and shows you a diff summary for approval before writing anything.

---

### 10 · Check for updates and upgrade

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

### 11 · Agentic development best practices

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

When something is broken **or slow**, follow this in order — never skip steps:

> Also applies to: performance issues, memory leaks, bottlenecks. Say "slow", "performance", "memory issue", or "bottleneck" and the router loads this playbook automatically.

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
> `<fw>` = your active framework folder: `claude` · `cursor` · `agents` · `codex` · `opencode`

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
PERFORMANCE / SLOW  Read .agent/playbooks/debug-pipeline.md  (auto-routed: "slow", "bottleneck", "memory leak")
BUG FIX             Read .agent/playbooks/bug-fix.md
HOTFIX / ROLLBACK   Read .agent/agents/devops-agent.md + Read .agent/playbooks/bug-fix.md
REFACTOR            Read .agent/playbooks/refactor.md
SECURITY AUDIT      Read .agent/playbooks/security-audit.md
ADD FEATURE         Read .agent/playbooks/add-feature.md
RELEASE             Read .agent/playbooks/release.md
API INTEGRATION     Read .agent/playbooks/api-integration.md
DOCUMENT API        Read .agent/playbooks/document-api.md
DEFINE NFRs         Read .agent/playbooks/nfr-definition.md
PRODUCTION READY    Read .agent/playbooks/production-readiness.md
PERFORMANCE BUDGET  Read .agent/playbooks/performance-budget.md
OBSERVABILITY       Read .agent/playbooks/observability-setup.md
A11Y AUDIT          Read .agent/playbooks/accessibility-audit.md
COMPLIANCE REVIEW   Read .agent/playbooks/compliance-review.md
MATURITY / DORA     Read .agent/playbooks/org-maturity-assessment.md
INCIDENT POSTMORTEM Read .agent/playbooks/incident-postmortem.md
PROJECT AUDIT       Read .agent/playbooks/audit.md
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
| **IDE framework** | 6th framework (Windsurf, Cline, Copilot Workspace, etc. — OpenCode is the 5th) |
| **Slash command** | New `/command` in `.claude/commands/`, `.cursor/commands/`, and `.opencode/commands/` (mirror all IDEs) |
| **Session protocol step** | Extra check at start or end of every session |
| **Best practice / rule** | New golden rule, protocol, or checklist item |
| **API agentic pattern** | Conventions for agents that build or consume HTTP APIs |

---

### The extension anatomy — always the same 9 steps

Every extension touches the **templates pack** in this order. Give this list when extending the platform:

```
1. This README — Usage / Extending sections + quick-ref card
2. Install tables — update counts/lists if needed
3. AGENT-PLATFORM-TEMPLATES/ — add or edit template file(s)
4. If adding a new expert agent:
   a. Create <name>-agent.manifest.json alongside the agent file
   b. Add entry to .agent/context/reputation.json (overall: 500, per-capability: 500)
5. node tools/build-bootstrap-manifest.js — regenerate manifest (includes new manifest + reputation files)
6. Stub templates / apply.js if project-specific
7. Bump bootstrap_version in manifest + AGENT-PLATFORM-BOOTSTRAP.md footer
8. AGENTS.md template PLATFORM section (§2) — add routing row if new routing needed
   ⚠️ Edit only inside <!-- PLATFORM:START --> … <!-- PLATFORM:END --> — never edit the PROJECT section
9. CHANGELOG.md — document what changed, why, how to upgrade
```

Miss any step and the next consumer repo upgraded from the pack will not get the new capability.

---

### Prompt templates — copy, fill the blanks, send to any agent

---

#### Add a new expert agent

```
Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.

Task: Add a new expert agent for [DOMAIN — e.g. "Mobile / React Native", "ML / AI pipelines", "Performance"].

Follow the extension anatomy (all 9 steps):
1. Usage Guide §3 expert table — add row
2. "What this installs" — update shared-hub row to mention the new agent
3. Templates tree — no new dirs needed (.agent/agents/ exists)
4a. AGENT-PLATFORM-TEMPLATES/ — add FILE: .agent/agents/[name]-agent.md template:
    - Domain, Owns, Before work, Rules sections
    - Rules must reference BEST-PRACTICES.md and CONVENTIONS.md
    - Two-section markers (PLATFORM:START/END + PROJECT:START/END)
4b. Create companion .agent/agents/[name]-agent.manifest.json:
    - id: "[name]-agent", display_name, version: "1.0"
    - capabilities: [...], cannot_do: [...]
    - governance: { critic_dimensions: [...], requires_architect_for: [...] }
    - routing_keywords: [...], trust_ceiling: "standard"
    - reputation_capabilities: [...] (capability keys for per-domain trust tracking)
4c. Add entry to .agent/context/reputation.json:
    - "[name]-agent": { overall: 500, by_capability: { ... }, sessions_completed: 0, ... }
5. Phase 3 — no stub needed (agent fills own context from scan)
6. Manifest rebuild + version bump — add agent.md, manifest.json to AGENT-PLATFORM-MANIFEST.json
7. AGENTS.md template §2 PLATFORM section — add routing row inside <!-- PLATFORM:START/END -->
8. QUICK-REF.md + PLATFORM-HELP.md — add expert to tables
9. CHANGELOG.md — document new expert

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
   - .opencode/commands/[skill-name].md   (OpenCode slash command)
5. Phase 3 — no stub needed (skill is universal, not project-specific)
6. Manifest rebuild + version bump — add compliance checks for each framework wiring file
7. AGENTS.md template §6 or new section — describe how to activate the skill

Also create all the wiring files in this repo now.
```

---

#### Add support for a new IDE / framework

Adding a new framework touches 35 items across 23 files. Use the dedicated agentic playbook — do not attempt this manually.

**Trigger (maintainer agent):**
```
Read MAINTAINER/platform-maintainer-agent.md
Read MAINTAINER/add-framework.md and execute it.
Task: Add [FrameworkName] as a new supported framework
```

The playbook asks for `FOLDER`, `DISPLAY`, `ID`, `RULES_FORMAT` then executes all 11 steps:

| Step | What it does |
|------|-------------|
| 1 | Creates `.[folder]/`: `FRAMEWORK.json`, session-start/end wrappers, README, platform-core rules, caveman skill wiring |
| 2 | Updates `apply.js`: framework arrays, gitignore block, display strings, uninstall list |
| 3 | Adds all new file entries to `AGENT-PLATFORM-MANIFEST.json` |
| 4 | Updates 8 shared templates: registry.yaml, ZONES.md, SYNC.md, session-start.md identification table, SYNC-POINTS.md, AGENTS.md |
| 5 | Updates all existing frameworks' "do not edit" lists to include the new folder |
| 6 | Updates all documentation: README, this guide, BOOTSTRAP.md, PLATFORM-HELP.md, QUICK-REF.md |
| 7 | Updates metadata: package.json, COPYING.md, install.ps1 |
| 8 | Updates pre-existing artifact detection |
| 9 | Bumps version in all 5 locations |
| 10 | Logs to `MAINTAINER/platform-improvements.md` |
| 11 | Verifies in a scratch repo |

**What the new framework gets automatically** (no extra wiring needed):
- Cross-framework Critic review offer on every session switch
- 7-day update check at session start
- Full Quick Reference display with the framework name substituted
- Handoff log with `Critic reviewed: no` field
- Registry conflict detection

**Recommended next frameworks:** Windsurf · Cline · Continue.dev

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
Frameworks it touches: [all | cursor | claude | antigravity | codex | opencode]
```

Use this prompt verbatim — every part maps to a concrete location in the file. The agent will know exactly where to make each change.

---


---

## Framework repository — maintain and release

> **Platform author documentation:** [`MAINTAINER/GUIDE.md`](MAINTAINER/GUIDE.md)
> Full maintainer workflow, the improvement loop, expert/playbook checklists, and release process.
> The `MAINTAINER/` folder is never deployed to consumer repos.

1. Edit `AGENT-PLATFORM-TEMPLATES/`
2. Log the change in `MAINTAINER/platform-improvements.md`
3. `node tools/build-bootstrap-manifest.js`
4. Bump `bootstrap_version` in manifest + orchestrator footer + README footer + `package.json`
5. Update `CHANGELOG.md` — new version block + upgrade guide section
6. Create a GitHub Release with the new tag — `npx github:zafrirron/Agent-Platform#vX.Y.Z` installs that exact version

**CHANGELOG:** [`CHANGELOG.md`](CHANGELOG.md) — full version history, upgrade matrix, and per-path migration instructions.

**Quality gate:** no consumer-product strings inside the pack (search product names and app folder names — zero hits).

### Four improvement sources (how the platform gets smarter)

| Mode | Source | Output | Trigger |
|------|--------|--------|---------|
| **Mode 1 — Failures** | A rule traced to a real production failure | One rule added immediately | `"Add rule to [expert]: [rule]"` |
| **Mode 2 — Ecosystem** | OWASP / CWE / engineering best practices (monthly + quarterly) | Rules for expert agents (F001-Fxxx) | `Read MAINTAINER/web-audit.md and execute it.` |
| **Mode 3 — User submissions** | Maintainer receives agent/playbook/convention files from platform users (via email, PR, or community) and drops them into `MAINTAINER/ingest/` for review | Rules for expert agents (I001-Ixxx) | `Read MAINTAINER/platform-ingest.md and execute it.` |
| **Mode 4 — GitHub scan** | Quarterly scan of GitHub governance/coordination repos | New platform capabilities or phases (R001-Rxxx) | `Read MAINTAINER/github-governance-scan.md and execute it.` |

**Mode 3 ingest workflow:** The ingest agent reads all submitted files, extracts specific verifiable rules, deduplicates against existing platform rules, maps each finding to the right expert/playbook, and presents a structured report (findings I001, I002, ...). Maintainer selects what to add. Selected findings are implemented via Mode 1 workflow — logged in `platform-improvements.md`, version bumped, ready to ship.

When users share agent rules, playbooks, or conventions (via email, GitHub issues, or PRs), the maintainer reviews them and drops the relevant files into [`MAINTAINER/ingest/`](MAINTAINER/ingest/). The `README.md` there explains the review process and what gets kept.

**Mode 4 scan workflow:** The agent searches GitHub with rotating query templates across coordination, session lifecycle, trust/scoring, and routing themes. For each promising repo it reads README and key files, answers 8 structured questions, and extracts findings (FEATURE / STRENGTHEN / ARCHITECTURE). Maintainer selects findings to implement directly or bundle into a phased roadmap. Results logged to `MAINTAINER/governance-scan/scan-log.md` — already-analyzed repos are skipped on future runs to avoid repetition.

---

## Tell an agent what this project is

```
Read AGENT-PLATFORM-FRAMEWORK-README.md for the full platform guide.
Read AGENT-PLATFORM-BOOTSTRAP.md only when installing on a consumer repository.
```

---

*Agent Platform Bootstrap v2.15 — complete human guide · templates in AGENT-PLATFORM-TEMPLATES/*
