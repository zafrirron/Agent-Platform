# Agent Platform Bootstrap

**Built by agents. For agents. To build better agents.**

> *The meta-platform: an AI agent maintains the rules that your AI agents follow.
> Every upgrade makes every agent smarter. Agents building the platform that builds better agents.*

[![License: Elastic-2.0](https://img.shields.io/badge/License-Elastic_2.0-blue.svg)](LICENSE)
© 2024–2026 [Zafrir Ron](https://github.com/zafrirron) — Free for personal and internal use. Commercial hosting/SaaS prohibited. See [LICENSE](LICENSE).

**[📊 View Interactive Presentation](https://zafrirron.github.io/Agent-Platform/presentation/agent-platform-beta.html)** — interactive deck · lifecycle · live demo · enterprise features

---

## What it is

A complete multi-agent development environment installed into any repository in one command. Claude Code, Cursor, Antigravity, Codex, and OpenCode work together without conflicts. Nine expert agents (including the Critic — adversarial reviewer). **20 playbooks.** **11 lifecycle skills.** **Opt-in language/stack/platform/domain Packs** (curated expertise layered on the agnostic core — [see below](#language-technology-stack-platform--domain-packs-opt-in)). Three install profiles (`lite` / `core` / `full`). Test enforcement. A quick reference on every session start. No memorisation required.

**Lifecycle:** `DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP` (full profile adds session handoff + enterprise gates)

> **The platform coordination layer never modifies your source code.** It adds its own files — `.agent/` plus the platform's own files inside the shared framework folders (`.cursor/`, `.claude/`, `.codex/`, `.agents/`, `.opencode/`). Only the platform's own files are gitignored, so nothing is accidentally committed — **your own rules/commands in those folders stay tracked and active.** The platform scaffolding itself stays completely out of your codebase.
> **Already using Claude Code, Cursor, Antigravity, Codex, or OpenCode?** Your existing `CLAUDE.md`, `AGENTS.md`, Cursor rules, and `opencode.json` are preserved, backed up, still tracked in git, and never overwritten. Say `"reconcile my rules"` any time to have the agent check them against the platform (keep / duplicate / conflict / migrate). Remove the platform and your originals are restored. (OpenCode reads the platform's `AGENTS.md`, `CLAUDE.md`, and `.claude/skills` natively — no adapter needed.)

---

## Security and trust — what this platform is and is not

**The platform installs markdown files. That is all.**

Expert rules and playbooks are plain-text instructions that tell AI agents how to write better, more secure code. They are not executable code. They do not run inside your project. They cannot exfiltrate data, add backdoors, or weaken your security posture.

| Concern | Reality |
|---------|---------|
| Injects executable code into my project | ❌ Only markdown, YAML, and JSON files are installed |
| Modifies my source code or config | ❌ Installer creates new files only — existing files skipped |
| Makes network calls from my project | ❌ No runtime dependencies are added |
| Collects telemetry or sends data anywhere | ❌ No analytics, no tracking, no callbacks |
| Commits anything without my knowledge | ❌ All platform files are gitignored on install |
| Overwrites my security decisions | ❌ Your PROJECT sections are never overwritten |

**Every rule is readable and auditable.** Open any file in `.agent/agents/` — every instruction the platform gives your AI is visible markdown. Every rule traces to its source failure in `MAINTAINER/platform-improvements.md`.

**No npm registry, no third-party dependencies.** `apply.js` uses only Node.js built-ins (`fs`, `path`). Nothing from the npm registry that could be compromised.

→ Full security declaration: [SECURITY.md](SECURITY.md)

---

## Zero footprint — install, use, remove cleanly

| Guarantee | Detail |
|-----------|--------|
| **No code changes on install** | Only adds `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/` `.opencode/` folders and `AGENTS.md` `SYNC-POINTS.md` `CLAUDE.md` `opencode.json`. Zero modifications to your existing files. |
| **Nothing committed accidentally** | The platform's **own** files are added to `.gitignore` automatically on install — file-scoped: `.agent/` fully, plus only the platform's own files inside shared folders like `.cursor/`. `git status` stays clean, and **your own rules/commands in those folders stay tracked** (never whole-folder ignored). |
| **Existing AI configs are preserved** | Already using Claude Code, Cursor, Antigravity, Codex, or OpenCode? Your `CLAUDE.md`, `AGENTS.md`, Cursor rules, `opencode.json`, and any other AI config files are **never overwritten** and stay tracked in git. Backed up to `.agent/backup/`. A `MIGRATION-NOTES.md` explains the model, precedence, and where to maintain rules; say `"reconcile my rules"` to check them against the platform. |
| **Clean removal** | `--mode=uninstall` removes all platform AI coordination files and restores your original AI configs from backup. The platform coordination layer never modifies your source code — your AI agents write code for you, the platform just makes them smarter. |
| **Your customisations survive upgrades** | `mode=upgrade` only updates the `<!-- PLATFORM:START/END -->` section of each file. Your project-specific content is never overwritten. |

---

## Install

**Three profiles** — same lifecycle skills, different coordination depth. Pick based on team size and how much structure you want on day one.

| Profile | Command | Best for |
|---------|---------|----------|
| **lite** (skills pack) | `npx github:zafrirron/Agent-Platform --profile=lite --framework=cursor` | Solo dev, Cursor or Claude, skills-first workflow |
| **core** | `npx github:zafrirron/Agent-Platform --profile=core` | Full playbooks + experts, no enterprise/compliance layer |
| **full** (default) | `npx github:zafrirron/Agent-Platform` | Teams, multi-IDE handoff, session registry, enterprise gates |

### Which profile should I use?

| You are… | Recommended | Why |
|----------|-------------|-----|
| Solo dev trying Agent Platform or coming from skill packs | **lite** | Same `/spec`→`/ship` lifecycle, minimal footprint — skills + slash commands only |
| Cursor user, no plugin marketplace | **lite** + `--framework=cursor` | Installs `.cursor/commands/` and `.agent/skills/` — see [docs/cursor-setup.md](docs/cursor-setup.md) |
| Claude Code user wanting skills only | **lite** or marketplace plugin | Plugin = skills pack; `npx --profile=lite` adds project-local commands |
| One dev who wants playbooks + expert routing | **core** or **full** | Experts and 20 playbooks auto-load from plain-language tasks |
| Team on multiple IDEs (Cursor + Claude + …) | **full** | Session handoff, `CURRENT.md`, conflict registry, cross-IDE Critic review |
| Need NFR, compliance, PRR, org maturity playbooks | **full** | Enterprise playbook layer not included in lite or core |

### What each profile includes

| Capability | lite | core | full |
|------------|:----:|:----:|:----:|
| 11 lifecycle skills + `/spec` … `/verify` `/ship` | ✓ | ✓ | ✓ |
| Slash commands (Cursor / Claude) | ✓ | ✓ | ✓ |
| Cherry-pick `--mode=add --add=skill:…` | ✓ | ✓ | ✓ |
| 9 expert agents + auto-routing | — | ✓ | ✓ |
| 20 playbooks (bug-fix, release, debug, …) | — | ✓ | ✓ |
| Session start/end + handoff (`CURRENT.md`) | — | ✓ | ✓ |
| Multi-IDE sync registry | — | ✓ | ✓ |
| Enterprise playbooks (NFR, compliance, PRR, …) | — | — | ✓ |
| `/audit` · `/release` · `/implement` (Plan handoff) | — | — | ✓ |
| Optional CI guards (`--mode=install-guards`) | — | — | ✓ |

**Start lite, grow into full:** lite is not a dead end — upgrade anytime without losing skills:

```bash
npx github:zafrirron/Agent-Platform --profile=full
```

Your project-specific content in `AGENTS.md` / `CLAUDE.md` PROJECT sections is preserved on upgrade.

```bash
# Any OS — Node.js 18+
npx github:zafrirron/Agent-Platform

# Cherry-pick one skill
npx github:zafrirron/Agent-Platform --mode=list --list=skills
npx github:zafrirron/Agent-Platform --mode=add --add=skill:interview-me --framework=cursor

# Claude Code marketplace plugin (skills + commands)
# /plugin marketplace add https://github.com/zafrirron/Agent-Platform.git
# /plugin install agent-platform-skills@zafrirron

# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

**Cursor has no plugin marketplace** — use `npx` or see [docs/cursor-setup.md](docs/cursor-setup.md).

Start your first session — one command, any IDE:

```
Read .agent/session-start.md and execute it.
```

---

## Language, technology-stack, platform & domain packs (opt-in)

The core platform is deliberately **language-, stack- and domain-agnostic** — general software-engineering discipline for any project. **Packs** layer curated, opinionated knowledge for a specific **programming language** (TypeScript, Java, C++), **technology stack** (React, Django), **platform / execution target** (Docker, boards/SoCs — roadmap), or **business domain** (fintech) on top of the core, **without changing it**.

**Just ask your agent — no terminal commands to remember:**

```text
"what packs are available"      "which packs should I use" / "scan my repo for packs"
"activate the React pack"        "what packs are active"
"add this rule to my <pack> pack"   (saved to user.overlay.md — survives every update)
```

Your agent runs the install commands under the hood (e.g. `npx … --mode=add --add=pack:stack-react`). The only terminal command you ever type is the one-time install.

- **Four composable kinds** — `language:*` (the language itself — type/memory/concurrency footguns), `stack:*` (a framework/library *built in* a language), `platform:*` (*where the code runs* — hardware/OS/RTOS/container runtime; **roadmap**), `domain:*` (compliance + reference architectures). A repo can run `language:typescript` + `stack:react` + `domain:fintech` together. A language pack is reusable across every framework in it, so its rules aren't duplicated per stack.
- **Opt-in, no bloat** — packs never install by profile; only when you activate one, recorded in `active_packs`. Zero cost when none active.
- **Detect-and-suggest** — the installer (and *"scan my repo for packs"*) detects your language/stack (dependency manifests, `tsconfig.json`/`pom.xml`/`CMakeLists.txt`, or a source-extension scan) and *suggests* matching packs; it never auto-installs.
- **Overlays, not new experts** — a stack/domain pack refines one generic expert; a language pack overlays every code-writing expert (so its rules apply to all code) — only while active; core files are untouched. Packs compose.
- **Your rules survive updates** — add pack-specific rules via `user.overlay.md` (user-owned, never in the manifest); no upgrade/force/re-install ever touches it.
- **Domain reference architectures** — domain packs link back to real open-source apps. Ask *"reference architecture for a fintech app"* and the agent surfaces the distilled architecture + the linked source repos (license-aware).
- **Private & proprietary packs** — packs are where your **IP / secret sauce** belongs, never the public core. **Fork the platform to a private repo, build your packs there, and install from the fork**: your teams get the generic core *plus* your private packs, while you still merge upstream core updates conflict-free (your work lives in packs, not core). Per-project secrets stay in `user.overlay.md`. Maintainers stand up a whole project's pack set at once with **Mode 5 (Solution Blueprint)** — state a system goal, approve/reject candidate packs per axis, build. See [`.agent/packs/README.md`](AGENT-PLATFORM-TEMPLATES/.agent/packs/README.md) and [MAINTAINER/GUIDE.md](MAINTAINER/GUIDE.md).

Available (shipped reference packs): languages — `language-typescript`, `language-java`, `language-cpp`; stacks — `stack-react`, `stack-django`; domains — `domain-fintech`. These are **generic examples** — the core stays domain/axis-agnostic. Build your own for any language/stack/platform/domain (proprietary ones in a private fork) — see the fork pattern below. Details: [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md#language-technology-stack-platform--domain-packs-opt-in-overlays) · spec: [`.agent/packs/README.md`](AGENT-PLATFORM-TEMPLATES/.agent/packs/README.md) · design: [ADR-001](MAINTAINER/adr/ADR-001-stack-domain-packs.md).

---

## Quick reference — commands, experts, and playbooks

Install creates `.agent/QUICK-REF.md` — the full capability guide for your project.
It lists every command, every expert agent, every playbook, and every platform operation.

**Ask your agent at any time to show it:**

| Say this | What happens |
|----------|-------------|
| `"show quick reference"` | Agent returns a clickable link to `.agent/QUICK-REF.md` |
| `"show help"` | Same |
| `"show commands"` | Same |
| `"what can you do"` | Same |
| `"platform help"` | Same |

The agent responds with a **link** — it does not dump the file into chat (that would waste your context window). Open the file in your editor to see everything at a glance.

**Slash commands** (type `/` in chat) — full lifecycle:

`/spec` · `/plan` · `/build` · `/test` · `/review` · `/code-simplify` · `/webperf` · `/context` · `/verify` · `/ship` (+ `/audit` `/release` on full profile)

- **Cursor** — `.cursor/commands/`: above + `/session-start` · `/session-end` · `/implement` (Plan handoff) · `/platform-help` · `/caveman`
- **Claude Code** — `.claude/commands/`: lifecycle set + marketplace plugin `agent-platform-skills`

**Skills** (cherry-pick under `.agent/skills/`): all 11 lifecycle skills — see `.agent/QUICK-REF.md` for when to use each (`/webperf`, `/context`, `/verify`, etc.)

**What's in the guide:** session commands · profiles (lite/core/full) · 9 expert agents · 20 playbooks · 11 lifecycle skills · reference checklists · NFR/compliance · caveman · platform operations

---

## Why Agent Platform (named discipline)

Hard-won engineering habits are encoded into playbooks and experts — not left to model mood:

| Concept | What it means here |
|---------|-------------------|
| **Rationalization gate** | Playbooks block "skip this step because…" excuses |
| **Doubt review** | Architect challenges the design before code lands |
| **Beyoncé Rule** | Tests assert behavior, not private implementation |
| **Hyrum's Law** | Backend agent treats every response shape as a public contract |
| **Chesterton's Fence** | Refactor playbook: understand legacy before deleting |
| **Critic (10 dimensions)** | Adversarial review across security, a11y, operability, BC |

**vs skill packs:** Portable skills teach *how* to think; Agent Platform adds *where* work happens — session handoff, multi-IDE registry, gated workflows, optional CI guards. See [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

## The meta-philosophy

Most tools make developers more productive. This platform makes **AI agents** more disciplined, consistent, and safe — by encoding hard-won lessons from real software failures into permanent rules that every agent follows, in every project, automatically.

The platform itself is developed using the same platform. An AI agent maintains the expert rules. Another AI applies them in your project. When we improve a rule, every user's agents improve on next upgrade.

```
You observe a failure in a real project
        ↓
AI partner (platform maintainer agent) helps diagnose and write the rule
        ↓
Rule ships in the next version
        ↓
Every user's agents are now smarter — automatically
        ↓
Repeat. The platform never stops improving.
```

**Agents writing the rules. Rules making agents better. Better agents building better software.**

---

## What you get

| Capability | Description |
|------------|-------------|
| **5 IDE frameworks** | Claude Code · Cursor · Antigravity · Codex · OpenCode — coordinated, no conflicts |
| **9 expert agents** | Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data · **Critic** — activate by name |
| **Critic agent** | Adversarial reviewer — finds bugs, security issues, edge cases, and test gaps that implementing agents miss. Built into bug-fix, add-feature, and release playbooks. |
| **Cross-framework critic review** | When you switch IDEs (e.g. Claude Code → Cursor), the new agent automatically offers to review the previous model's work. Different AI models have different blind spots — cross-model review catches what the first model missed. Zero extra setup. |
| **Emergency IDE takeover** | If an IDE runs out of credits or crashes mid-session, just start a session in any other IDE. It detects the stuck session, offers to take over, commits any uncommitted work, and continues — no manual file editing, no lost work. Switch between Claude Code, Cursor, Codex, Antigravity, and OpenCode freely based on credits and availability. |
| **🔍 Full Project Audit** | 11-phase professional report on first session or on demand — architecture through governance/maturity. Report saved to `.agent/context/audit-[date].md`. Ideal for onboarding to any unknown repo. |
| **20 playbooks** | Core: audit · add-feature · bug-fix · refactor · release · debug · security-audit · add-dependency · api-integration · document-api · deprecation · requirements-clarification. Quality: nfr-definition · production-readiness · performance-budget · observability-setup · accessibility-audit. Compliance: compliance-review · org-maturity-assessment · incident-postmortem |
| **Reference checklists** | `.agent/references/` — testing, security, performance, accessibility, orchestration patterns (agent-skills–informed) |
| **🧩 Language / stack / platform / domain Packs** | Opt-in overlays that layer curated, failure-derived expertise on the agnostic core — `language:*` (TS/Java/C++), `stack:*` (React/Django), `platform:*` (roadmap), `domain:*` (fintech example — build your own). Composable, detect-and-suggest, zero cost when none active. Your rules live in `user.overlay.md` (survives every update). **Company IP → build packs in a private fork** (see below). Just ask: *"scan my repo for packs"*. |
| **Install profiles** | `lite` skills pack · `core` (no enterprise) · `full` team platform · `--mode=add` cherry-pick |
| **11 lifecycle skills** | `SKILL.md` modules — interview-me, TDD, plan/build slices, code-simplify, web-performance-audit, context-engineering, verification-before-completion |
| **Agent-skills ingest** | Rationalization gates · doubt review · source-driven dev · Beyoncé/DAMP · spec-outline template |
| **NFR & production readiness** | `nfr-log.md` — measurable ISO 25010 targets. `production-readiness` gates go-live (P0 NFRs, compliance evidence, vuln SLA). |
| **Compliance & DORA** | `compliance-evidence-log.md` for SOC 2 / ISO 27001 artifacts. Maturity assessment + incident postmortem for DORA metrics. |
| **Smart upgrade model** | `mode=upgrade` improves your agents' rules without touching your project customisations |
| **Code standards enforcement** | SOLID principles · DRY · file modularity · no magic numbers · linting gates · branching strategy — encoded into expert agents and CONVENTIONS.md. Architect agent runs SOLID checks at design time. Critic catches DRY violations. DevOps agent blocks the pipeline on lint failures — not a suggestion, a gate. |
| **Test enforcement** | Every function, bug fix, and API endpoint requires a test. Red suite blocks handoff. Test expert auto-generates coverage in 4 formats: HTML (`coverage/lcov-report/index.html` — open in browser), Clover XML (Jenkins/CI), LCOV (Codecov/Coveralls), and JSON. All formats generated from one `--coverage` run. |
| **API documentation** | Docs expert generates OpenAPI/Swagger docs from `api-contracts.md`. Say "document the API" and get a publish-ready spec. |
| **Quick reference** | Compact status block on every session start (last work, update status). Full capability guide at `.agent/QUICK-REF.md` — open in editor any time. No memorisation required. |
| **Local help** | `PLATFORM-HELP.md` installed in every repo — everything explained, fully offline |
| **Agentic update check** | Agents check for platform improvements automatically, once per 7 days |
| **Docs governance** | Every doc has a registered owner expert. Done-when checklists enforce updates. Session end catches new unregistered files. Release playbook blocked until Docs agent approves all docs current. New docs added by users are detected automatically and added to the registry. |
| **Token compression** | `"caveman mode"` — ~65% shorter output, same accuracy, all IDEs |
| **Enforcement guards** | `--mode=install-guards` wires real pre-commit hooks and GitHub Actions CI — secrets scan, test suite, coverage gate, unregistered doc detection. Aspiration becomes enforcement. |
| **Zero code impact** | Installs only into `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/` `.opencode/`. Nothing else changes. All platform files gitignored by default. Remove completely with one command — nothing left behind. |

---

## How it works

```
┌─────────────────────────────────────────────────────────────────────┐
│  INSTALL  (once)                                                      │
│  npx github:zafrirron/Agent-Platform                                 │
│                                                                       │
│  Detects stack · Installs .agent/ + 5 IDE framework folders         │
│  Backs up any existing AI configs · Gitignores platform files        │
│  Prints: capability list + one session-start command                 │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SESSION START  (every session, any IDE)                              │
│  "Read .agent/session-start.md and execute it."                      │
│                                                                       │
│  · Conflict check — is another IDE already active?                   │
│  · Cross-framework Critic offer — if switching from another IDE      │
│  · Update check — once per 7 days, cached                           │
│  · Compact status block — last work, update status, quick ref path  │
│  · "Ready. Tell me what you want to do."                             │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                      You describe what you want
                                   │
              Auto-routing: agent identifies task type, declares the match
              (▶ Expert · playbook), then begins — user just describes the goal
                                   │
              ┌────────────────────┴─────────────────────┐
              │                                           │
              ▼                                           ▼
┌─────────────────────────┐◄──── COMBINE ────►┌───────────────────────────┐
│  EXPERT AGENT           │                   │  PLAYBOOK                 │
│  WHO the agent is       │  Use alone  OR    │  WHAT steps to follow     │
│                         │  load both        │                           │
│  "review for security"  │  together for     │  "fix a bug"              │
│    → Security expert    │  the most         │    → bug-fix.md           │
│                         │  powerful result  │                           │
│  "find what's wrong"    │                   │  "ready to ship"          │
│    → Critic agent       │                   │    → release.md           │
└────────────┬────────────┘                   └─────────────┬─────────────┘
             └──────────────────┬──────────────────────────┘
                                ▼
              ┌──────────────────────────────────────────────────────────┐
              │  COMBINED EXAMPLE: "fix the login bug"                    │
              │                                                            │
              │  Backend expert  +  bug-fix.md                            │
              │  (WHO: API rules,   (WHAT: reproduce → root cause →       │
              │  auth discipline,    fix → regression test → critic)      │
              │  done-when gates)                                          │
              │                                                            │
              │  Expert rules govern every step.                          │
              │  At Step 5b the playbook assigns the Critic agent.        │
              └──────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  WORK                                                                 │
│                                                                       │
│  Agent reads context files — api-contracts, adr-log, known-issues   │
│  Agent checks patterns.md — reuses what worked in prior sessions    │
│  Agent follows rules — CONVENTIONS.md, BEST-PRACTICES.md            │
│  Agent writes code, tests, documentation                             │
│  Security gate — automatic for new endpoints/auth (add-feature 5a)  │
│  Critic review gate (mandatory quality gate in every playbook)       │
│  Test suite runs and passes · Coverage report generated              │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SESSION END                                                          │
│  "Read .agent/session-end.md and execute it."                        │
│                                                                       │
│  · Summarise work — derived from context, no user recap needed       │
│  · Pre-handoff checklist — tests green, no stubs, docs updated      │
│  · Commit all uncommitted changes — clean handoff to next IDE        │
│  · Capture reusable pattern in patterns.md (if session solved        │
│    something non-trivial — agents build codebase memory over time)   │
│  · Update CURRENT.md — goal, files, commit hash, Critic reviewed: no│
│  · Mark framework idle in registry                                   │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │
              ┌────────────────────┴─────────────────────┐
              │                                           │
              ▼                                           ▼
   Same IDE next session                      Switch to another IDE
   Back to SESSION START                      SESSION START in new IDE
                                              + Critic reviews prior work
```

---

## Cross-framework critic review — automatic multi-model code review

When you switch IDEs, the platform turns the framework switch into a code review.

```
Claude Code session:
  You implement a feature, end session.
  CURRENT.md records: files changed, goal, Critic reviewed: no

You open Cursor, run session-start:

  ┌─────────────────────────────────────────────────────────────┐
  │  Cross-framework Critic review available                    │
  │  Last session: Claude Code — "Add JWT refresh endpoint"     │
  │  Files: src/api/auth.ts, src/api/auth.test.ts               │
  │  Review before we proceed?  YES / NO                        │
  └─────────────────────────────────────────────────────────────┘

  YES → Cursor reviews Claude Code's work with fresh eyes.
        No shared context. No shared assumptions.
        Reports: findings by severity → you decide what to fix.
```

**Why it matters:** A different AI model (Claude vs GPT vs Gemini) has different reasoning patterns and blind spots. When Cursor reviews Claude Code's work, it approaches the code the way a second developer would — cold, without the assumptions the first model built up during implementation. This catches auth gaps, untested edge cases, and intent-vs-implementation mismatches that single-model review consistently misses.

**Zero setup required.** It just happens automatically whenever `meta.updated_by` in the registry doesn't match the framework you're starting.

---

## Global install — platform everywhere (optional, run once)

Install user-level stubs to your home directory so the platform activates automatically in every repo:

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

Writes to `~/.claude/CLAUDE.md`, `~/.claude/commands/`, `~/.cursor/rules/`, `~/.cursor/commands/`, `~/.codex/instructions.md`, `~/.agents/rules/` — the Claude, Cursor, Codex, and Antigravity global layers. (OpenCode is configured per-project via `AGENTS.md` + `opencode.json`; a global `~/.config/opencode/` layer is on the roadmap.)

**What it does:**
- **Repo with platform installed** → expert routing activates automatically, no manual session-start needed
- **Repo without platform** → one-time install offer displayed at session start
- **Repo with `.agent-platform-skip`** → offer suppressed permanently for that repo
- **`~/.claude/commands/`** and **`~/.cursor/commands/`** → lifecycle slash commands (`/session-start`, `/spec`, `/audit`, `/ship`, `/implement`, `/caveman`, …) available in every repo globally

**The three-layer model after global install:**

| Layer | Where | What |
|---|---|---|
| **PLATFORM** | project `.agent/agents/*.md` | Framework-maintained expert rules |
| **PROJECT** | project `.agent/agents/*.md` | Your team's coding conventions |
| **USER** | `~/.claude/CLAUDE.md` USER section | Your personal cross-repo preferences |

USER section is yours — never overwritten by upgrades.

---

## Upgrade — get smarter agents

```bash
# Your agents get improved rules. Your project customisations are untouched.
npx github:zafrirron/Agent-Platform --mode=upgrade
```

Every expert file has two sections:
- **Platform section** — improved by this project, pushed on `--mode=upgrade`
- **Project section** — your team's rules, never overwritten

**Why upgrading is worth it:** Every release includes rules sourced from four places — OWASP security guidelines and CWE Top 25 (Mode 2 web audit), real failures observed in production codebases (Mode 1), production-proven rules contributed by platform users (Mode 3), and new governance patterns discovered through quarterly GitHub ecosystem scans (Mode 4). When you upgrade:
- Your **Security expert** knows the latest OWASP API vulnerabilities and CWE patterns
- Your **Backend expert** knows current API design standards
- Your **Test expert** knows current testing quality requirements
- Your **Critic agent** knows what to look for in adversarial review
- Your **platform governance** reflects the best coordination patterns from the open-source ecosystem

You don't track these sources yourself — the platform does it for you, and every upgrade makes your agents smarter.

### Where the intelligence comes from

The platform actively studies the open-source agent ecosystem and adapts proven patterns (all MIT-licensed, de-duplicated, and security-vetted before adoption). A sample of what shipped and its source:

| Source repo | What your agents gained |
|-------------|-------------------------|
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | `context-engineering` (`/context`) + the DNA of most lifecycle skills |
| [obra/superpowers](https://github.com/obra/superpowers) | `verification-before-completion` (`/verify`) + systematic debugging |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | Proactive **minimalism ladder** + over-engineering delete-list review |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | Cross-IDE skill paths, skill quality bar, ingest security vetting |
| [saeed-vayghan/gemini-agent-skills](https://github.com/saeed-vayghan/gemini-agent-skills) | `ux-research` optional skill + Gemini interop |
| [thedesignproject/agent-skills](https://github.com/thedesignproject/agent-skills) | Anti "AI aesthetic" frontend principle + `npx skills` interop |

**Full provenance ledger** — every adopted source, finding ID, and disposition: [`docs/INTELLIGENCE-SOURCES.md`](docs/INTELLIGENCE-SOURCES.md)

> **Platform fork maintainers:** the full improvement pipeline is documented in [`MAINTAINER/GUIDE.md`](MAINTAINER/GUIDE.md) — the five maintainer modes across two lanes (**core** vs **packs**): Mode 1 manual rules, Mode 2 web audit (incl. greenfield `build-pack=<id>` and `url=<site>` scans), Mode 3 user ingest, Mode 4 GitHub ecosystem scan, and **Mode 5 (Solution Blueprint)** — decompose a whole system goal into a 4-axis pack set with per-candidate approval gates.

---

## Enforcement guards — wired, not aspirational

The expert rules tell agents what to do. The guards ensure it actually happens.

```bash
npx github:zafrirron/Agent-Platform --mode=install-guards
```

Installs:
- **Pre-commit hook** — blocks commits containing secrets or with a failing test suite
- **GitHub Actions CI** — blocks PRs with failing tests, coverage below threshold, or secrets

Stack-aware: auto-detects your test runner and generates the right CI setup steps.

```bash
npx github:zafrirron/Agent-Platform --mode=remove-guards  # remove if needed
```

---

## Fork this platform — your IP lives in packs, not core edits

This repository is designed to be forked. Teams and enterprises run their own **private** instance and build their proprietary knowledge as **packs** inside it.

> **The pattern that matters:** the public **core stays generic** (universal software-engineering discipline). Your **company IP / secret sauce goes into packs** — a proprietary domain brain, an internal stack's conventions, a classified system's reference architecture — authored in your private fork and **never** pushed public. Because your work lives in packs (not core files), you keep pulling upstream core improvements **conflict-free**. Per-project secrets stay in each repo's `user.overlay.md`.

```
public Agent-Platform ──fork──▶ your-org/Agent-Platform (PRIVATE)
   generic core  ──merge upstream──▶ (no conflicts — your work is in packs)
                                      build packs here (Mode 5 blueprint / build-pack= / add pack)
                                      teams install from the fork → generic core + your private packs
```

| Layer | Lives in | Shared with |
|-------|----------|-------------|
| Generic core | public platform / upstream of your fork | everyone |
| **Company packs (IP)** | **your private fork** `.agent/packs/*` | your org |
| Per-project rules | this repo's `user.overlay.md` | this project only |

### Why fork?
- **Build proprietary packs** — a private domain/stack/platform/language brain your teams activate per project (the recommended home for all company-specific knowledge)
- **Stand up a whole project's pack set at once** — a maintainer runs **Mode 5 (Solution Blueprint)**: state the system goal, approve/reject candidate packs per axis, and the platform builds them (see [MAINTAINER/GUIDE.md](MAINTAINER/GUIDE.md))
- Add your company's internal coding standards (universal ones as core PROJECT-section rules; specific ones as packs)
- Run private security audits with your own OWASP extensions
- Deploy to your team via your own GitHub org: `npx github:YOUR_ORG/your-platform`
- Keep proprietary knowledge out of a public repo — entirely

### Fork setup — 4 fields to change

**Step 1** — Fork and clone:
```bash
# Fork on GitHub: click "Fork" on https://github.com/zafrirron/Agent-Platform
git clone https://github.com/YOUR_ORG/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

**Step 2** — Update `AGENT-PLATFORM-MANIFEST.json` *(the only critical change — drives all deployed content)*:
```json
"platform_repo": "YOUR_ORG/YOUR_REPO_NAME",
"platform_npx":  "github:YOUR_ORG/YOUR_REPO_NAME"
```

**Step 3** — Update `package.json`:
```json
"name":   "your-platform-name",
"author": "YOUR_ORG",
"repository": {
  "url": "https://github.com/YOUR_ORG/YOUR_REPO_NAME.git"
}
```

**Step 4** — Update install scripts (so your team's install links point to your fork):

In `install.sh`:
```bash
REPO="YOUR_ORG/YOUR_REPO_NAME"
```

In `install.ps1`:
```powershell
$Repo = "YOUR_ORG/YOUR_REPO_NAME"
```

`tools/release.ps1` reads the repo from the manifest automatically — no change needed.

**Step 5** — Verify everything is wired:
```bash
npm test   # 286 tests must pass
```

**Step 6** — Deploy to your team:
```bash
# Your team installs your fork:
npx github:YOUR_ORG/YOUR_REPO_NAME

# Your team upgrades when you release new rules:
npx github:YOUR_ORG/YOUR_REPO_NAME --mode=upgrade
```

### What you keep from upstream

Pull improvements from this repo any time:
```bash
git remote add upstream https://github.com/zafrirron/Agent-Platform.git
git fetch upstream
git merge upstream/main
```

New OWASP rules, expert improvements, and platform features flow in via `merge`. Your custom rules in `<!-- PROJECT:START/END -->` sections are never overwritten.

---

## Remove

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run — shows what will be removed
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes platform AI files
```

Removes: the platform's **own** files only — `.agent/` fully, plus the platform's files inside shared folders (`.cursor/`, `.claude/`, etc.), platform root files, and the gitignore block. Empty platform folders are pruned; any folder still holding **your** files is kept. **Your own rules/commands are never removed.**  
Restores: any AI config files you had before installing (CLAUDE.md, AGENTS.md, Cursor rules, etc.) from the backup.

The platform coordination layer is removed cleanly. Your AI agents improved your code while you used the platform — those changes are yours. The platform scaffolding that made them smarter is what gets removed.

---

## Presentation

**👉 [View the interactive platform presentation](https://zafrirron.github.io/Agent-Platform/presentation/agent-platform-beta.html)**

19 slides · what it is · how it works · expert agents · playbooks · before/after demo · enterprise governance · platform evolution · global install · zero code impact.
Navigate with arrow keys or swipe. Works on mobile.

> If the link above doesn't work yet (GitHub Pages propagating): [open via htmlpreview](https://htmlpreview.github.io/?https://github.com/zafrirron/Agent-Platform/blob/main/presentation/agent-platform-beta.html)

---

## Glossary — standards and abbreviations used

The platform references industry standards by name. Click any term for more detail:

| Term | What it means | Learn more |
|------|--------------|-----------|
| **OWASP** | Open Web Application Security Project — publishes the most widely-used web security risk lists | [owasp.org](https://owasp.org) |
| **OWASP Top 10** | The 10 most critical web application security risks (updated ~every 3 years) | [owasp.org/Top10](https://owasp.org/Top10/) |
| **OWASP API Security** | The 10 most critical API-specific security risks (2023 edition used in this platform) | [owasp.org/API-Security](https://owasp.org/API-Security/) |
| **OWASP LLM Top 10** | Security risks specific to LLM/AI applications (2025 edition) | [genai.owasp.org](https://genai.owasp.org/llm-top-10/) |
| **CWE** | Common Weakness Enumeration — catalog of software security weaknesses; CWE Top 25 = most dangerous | [cwe.mitre.org](https://cwe.mitre.org) |
| **CVE** | Common Vulnerabilities and Exposures — database of known vulnerabilities in specific software versions | [cve.mitre.org](https://cve.mitre.org) |
| **SOLID** | Five object-oriented design principles: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion | [Wikipedia](https://en.wikipedia.org/wiki/SOLID) |
| **DRY** | Don't Repeat Yourself — don't duplicate logic; extract shared abstractions | [Wikipedia](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) |
| **ADR** | Architecture Decision Record — a short document capturing a hard-to-reverse architectural decision and why it was made | [adr.github.io](https://adr.github.io) |
| **OpenAPI / Swagger** | Industry-standard format for describing REST APIs; Swagger is the tooling ecosystem around it | [swagger.io](https://swagger.io) |
| **OIDC** | OpenID Connect — identity layer on top of OAuth 2.0; used for short-lived token authentication in CI/CD (OIDC credentials) | [openid.net/connect](https://openid.net/connect/) |
| **SBOM** | Software Bill of Materials — a list of all components in a software build, required for supply chain security | [cisa.gov/sbom](https://www.cisa.gov/sbom) |
| **CSRF** | Cross-Site Request Forgery — attack that tricks a user's browser into making unwanted requests | [OWASP CSRF](https://owasp.org/www-community/attacks/csrf) |
| **SSRF** | Server-Side Request Forgery — attack that makes the server fetch attacker-controlled URLs | [OWASP SSRF](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery) |
| **N+1** | A database query anti-pattern: 1 query to get a list + N queries for each item = (N+1) total queries | [explanation](https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping) |
| **Clover XML** | A test coverage report format (originally by Atlassian) consumed by CI tools like Jenkins, GitHub Actions, and Bamboo | [wikipedia](https://en.wikipedia.org/wiki/Clover_(software)) |
| **LCOV** | Linux Test Project coverage data format — consumed by Codecov, Coveralls, and most CI coverage dashboards | [lcov.github.io](https://github.com/linux-test-project/lcov) |
| **Codecov / Coveralls** | Cloud services that track test coverage trends over time and post coverage badges/comments on PRs | [codecov.io](https://codecov.io) · [coveralls.io](https://coveralls.io) |

---

## Documentation

| Document | For |
|----------|-----|
| [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md) | **Users** — complete installation, usage, and extension guide |
| [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md) | **Users** — profiles (lite/core/full), slash commands, cherry-pick, vs skill packs |
| [docs/INTELLIGENCE-SOURCES.md](docs/INTELLIGENCE-SOURCES.md) | **Users** — provenance ledger: which open-source repos the platform learned from and what each contributed |
| [docs/cursor-setup.md](docs/cursor-setup.md) | **Cursor users** — no marketplace; `npx --profile=lite`, `--mode=add` |
| [CONTRIBUTING.md](CONTRIBUTING.md) | **Contributors** — submit rules, playbooks, and doc improvements |
| [presentation/agent-platform-beta.html](presentation/agent-platform-beta.html) | **Users** — interactive product deck (profiles, lifecycle skills) |
| [presentation/team-adoption.html](presentation/team-adoption.html) | **Teams** — adoption deck + [STORY-PLAN.md](presentation/STORY-PLAN.md) presenter guide |
| [SECURITY.md](SECURITY.md) | **Trust** — what the platform does and does not do, how to audit it |
| [CHANGELOG.md](CHANGELOG.md) | **Users** — version history and upgrade paths |
| [MAINTAINER/GUIDE.md](MAINTAINER/GUIDE.md) | **Platform author** — agentic development workflow, release process |

## Platform maintainer commands

This platform is developed using itself. All maintenance is done by telling the agent:

| What you want | Say to your agent |
|--------------|------------------|
| Start a maintainer session | `Read MAINTAINER/platform-maintainer-agent.md` then describe your task |
| Improve an expert rule (Mode 1) | `"Add rule to [expert]: [rule]"` |
| Add a quality gate to a playbook | `"Add quality gate to [playbook] step N: [condition]"` |
| Add a step to a playbook | `"Add step to [playbook]: [description]"` |
| Add a new expert agent | `"Add a new expert agent for [domain]"` |
| Add a new playbook | `"Add a new playbook for [scenario]"` |
| Add a new IDE framework | `"Add a new framework for [name]"` |
| Check if a topic is covered | `"Check if [topic] is covered"` |
| **Ingest user agentic files (Mode 3)** | `Read MAINTAINER/platform-ingest.md and execute it.` |
| Monthly security + best practice audit (Mode 2) | `Read MAINTAINER/web-audit.md and execute it.` |
| Quarterly full ecosystem scan | `Read MAINTAINER/web-audit.md and execute it. scope=full` |
| GitHub ecosystem scan (Mode 4) | `Read MAINTAINER/github-governance-scan.md and execute it.` (add `repo=owner/name` for targeted) |
| **Build a NEW pack brain** (greenfield) | `Read MAINTAINER/web-audit.md and execute it. build-pack=<id>` (Mode 2 pack ecosystem build) |
| Grow an EXISTING pack brain | `… github-governance-scan.md … repo=owner/name pack=<id>` · `… web-audit.md … pack=<id>` / `url=<site> pack=<id>` · `… platform-ingest.md … pack=<id>` · or `"add rule to pack <id>: …"` |
| **Plan a whole system's pack set (Mode 5)** | `Read MAINTAINER/solution-blueprint.md and execute it. blueprint="<system goal>"` — 4-axis plan, approve/reject per axis, then build (add `build=no` to dry-run) |
| Internal consistency audit | `Read MAINTAINER/platform-audit.md and execute it.` |
| Release the next version | `"Release"` — agent reads CHANGELOG, calculates version bump, confirms with you, runs the release script |
| Sync user-facing docs after a release | `"Sync user-facing docs for vX.Y.Z"` — updates README, FRAMEWORK-README, QUICK-REF, PLATFORM-HELP, presentation deck |
| Verify playbook inventory & routing | `"List all playbooks and check AGENTS.md routing is complete"` |

---

## Version

**v2.47.0** · [Changelog](CHANGELOG.md) · [GitHub Releases](https://github.com/zafrirron/Agent-Platform/releases)

---

*Agent Platform Bootstrap — https://github.com/zafrirron/Agent-Platform*
*Built by agents. For agents. To build better agents.*
