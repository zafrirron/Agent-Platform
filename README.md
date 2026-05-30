# Agent Platform Bootstrap

**Built by agents. For agents. To build better agents.**

> *The meta-platform: an AI agent maintains the rules that your AI agents follow.
> Every upgrade makes every agent smarter. Agents building the platform that builds better agents.*

**[📊 View Interactive Presentation](https://zafrirron.github.io/Agent-Platform/presentation/agent-platform-beta.html)** — 18 slides · what it is · how it works · live demo · enterprise features

---

## What it is

A complete multi-agent development environment installed into any repository in one command. Claude Code, Cursor, Antigravity, and Codex work together without conflicts. Nine expert agents (including the Critic — adversarial reviewer). Eight playbooks. Test enforcement. A quick reference on every session start. No memorisation required.

> **The platform coordination layer never modifies your source code.** It only adds `.agent/`, `.claude/`, etc. — all gitignored so nothing is accidentally committed. Your AI agents will write and improve your code through the platform. That's the point. The platform scaffolding itself stays completely out of your codebase.
> **Already using Claude Code, Cursor, Antigravity, or Codex?** Your existing `CLAUDE.md`, `AGENTS.md`, and Cursor rules are preserved, backed up, and never overwritten. Remove the platform and your originals are restored.

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
| **No code changes on install** | Only adds `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/` folders and `AGENTS.md` `SYNC-POINTS.md` `CLAUDE.md`. Zero modifications to your existing files. |
| **Nothing committed accidentally** | All platform folders and files are added to `.gitignore` automatically on install. `git status` stays clean. Your team never sees platform noise. |
| **Existing AI configs are preserved** | Already using Claude Code, Cursor, Antigravity, or Codex? Your `CLAUDE.md`, `AGENTS.md`, Cursor rules, and any other AI config files are **never overwritten**. Backed up to `.agent/backup/`. A `MIGRATION-NOTES.md` explains how to connect them to the platform. |
| **Clean removal** | `--mode=uninstall` removes all platform AI coordination files and restores your original AI configs from backup. The platform coordination layer never modifies your source code — your AI agents write code for you, the platform just makes them smarter. |
| **Your customisations survive upgrades** | `mode=upgrade` only updates the `<!-- PLATFORM:START/END -->` section of each file. Your project-specific content is never overwritten. |

---

## Install

```bash
# Any OS — Node.js 18+
npx github:zafrirron/Agent-Platform

# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

Start your first session — one command, any IDE:

```
Read .agent/session-start.md and execute it.
```

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
| **4 IDE frameworks** | Claude Code · Cursor · Antigravity · Codex — coordinated, no conflicts |
| **9 expert agents** | Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data · **Critic** — activate by name |
| **Critic agent** | Adversarial reviewer — finds bugs, security issues, edge cases, and test gaps that implementing agents miss. Built into bug-fix, add-feature, and release playbooks. |
| **Cross-framework critic review** | When you switch IDEs (e.g. Claude Code → Cursor), the new agent automatically offers to review the previous model's work. Different AI models have different blind spots — cross-model review catches what the first model missed. Zero extra setup. |
| **Emergency IDE takeover** | If an IDE runs out of credits or crashes mid-session, just start a session in any other IDE. It detects the stuck session, offers to take over, commits any uncommitted work, and continues — no manual file editing, no lost work. Switch between Claude Code, Cursor, Codex, and Antigravity freely based on credits and availability. |
| **8 playbooks** | add-feature · bug-fix · refactor · release · debug · security-audit · add-dependency · api-integration |
| **Smart upgrade model** | `mode=upgrade` improves your agents' rules without touching your project customisations |
| **Test enforcement** | Every function, bug fix, and API endpoint requires a test. Red suite blocks handoff. Test expert auto-generates a visual coverage report (`coverage/lcov-report/index.html`) — open in browser to see exactly which lines aren't covered. Coverage and Swagger artifacts are your project files — keep, commit, or gitignore them as you see fit. |
| **API documentation** | Docs expert generates OpenAPI/Swagger docs from `api-contracts.md`. Say "document the API" and get a publish-ready spec. |
| **Quick reference** | Compact status block on every session start (last work, update status). Full capability guide at `.agent/QUICK-REF.md` — open in editor any time. No memorisation required. |
| **Local help** | `PLATFORM-HELP.md` installed in every repo — everything explained, fully offline |
| **Agentic update check** | Agents check for platform improvements automatically, once per 7 days |
| **Docs governance** | Every doc has a registered owner expert. Done-when checklists enforce updates. Session end catches new unregistered files. Release playbook blocked until Docs agent approves all docs current. New docs added by users are detected automatically and added to the registry. |
| **Token compression** | `"caveman mode"` — ~65% shorter output, same accuracy, all IDEs |
| **Enforcement guards** | `--mode=install-guards` wires real pre-commit hooks and GitHub Actions CI — secrets scan, test suite, coverage gate, unregistered doc detection. Aspiration becomes enforcement. |
| **Zero code impact** | Installs only into `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/`. Nothing else changes. All platform files gitignored by default. Remove completely with one command — nothing left behind. |

---

## How it works

```
┌─────────────────────────────────────────────────────────────────────┐
│  INSTALL  (once)                                                      │
│  npx github:zafrirron/Agent-Platform                                 │
│                                                                       │
│  Detects stack · Installs .agent/ .claude/ .cursor/ .agents/ .codex/ │
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
              Auto-routing: agent identifies task type and loads
              the right expert + playbook silently — user just describes the goal
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

## Upgrade — get smarter agents

```bash
# Your agents get improved rules. Your project customisations are untouched.
npx github:zafrirron/Agent-Platform --mode=upgrade
```

Every expert file has two sections:
- **Platform section** — improved by this project, pushed on `--mode=upgrade`
- **Project section** — your team's rules, never overwritten

**Why upgrading is worth it:** Every release includes rules sourced from OWASP security guidelines, CWE Top 25 dangerous software weaknesses, and engineering best practices collected from the developer ecosystem. The platform runs regular web audits and encodes the findings into expert agents. When you upgrade:
- Your **Security expert** knows the latest OWASP API vulnerabilities and CWE patterns
- Your **Backend expert** knows current API design standards
- Your **Test expert** knows current testing quality requirements
- Your **Critic agent** knows what to look for in adversarial review

You don't track these sources yourself — the platform does it for you, and every upgrade makes your agents smarter.

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

## Remove

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run — shows what will be removed
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes platform AI files
```

Removes: all platform AI coordination folders (`.agent/`, `.claude/`, etc.), root files, and the gitignore block.  
Restores: any AI config files you had before installing (CLAUDE.md, AGENTS.md, Cursor rules, etc.) from the backup.

The platform coordination layer is removed cleanly. Your AI agents improved your code while you used the platform — those changes are yours. The platform scaffolding that made them smarter is what gets removed.

---

## Presentation

**👉 [View the interactive platform presentation](https://zafrirron.github.io/Agent-Platform/presentation/agent-platform-beta.html)**

18 slides · what it is · how it works · expert agents · playbooks · before/after demo · enterprise governance · zero code impact.
Navigate with arrow keys or swipe. Works on mobile.

> If the link above doesn't work yet (GitHub Pages propagating): [open via htmlpreview](https://htmlpreview.github.io/?https://github.com/zafrirron/Agent-Platform/blob/main/presentation/agent-platform-beta.html)

---

## Documentation

| Document | For |
|----------|-----|
| [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md) | **Users** — complete installation, usage, and extension guide |
| [SECURITY.md](SECURITY.md) | **Trust** — what the platform does and does not do, how to audit it |
| [CHANGELOG.md](CHANGELOG.md) | **Users** — version history and upgrade paths |
| [MAINTAINER/GUIDE.md](MAINTAINER/GUIDE.md) | **Platform author** — agentic development workflow, release process |

## Platform maintainer commands

This platform is developed using itself. All maintenance is done by telling the agent:

| What you want | Say to your agent |
|--------------|------------------|
| Start a maintainer session | `Read MAINTAINER/platform-maintainer-agent.md` then describe your task |
| Improve an expert rule | `"Add rule to [expert]: [rule]"` |
| Add a quality gate to a playbook | `"Add quality gate to [playbook] step N: [condition]"` |
| Add a step to a playbook | `"Add step to [playbook]: [description]"` |
| Add a new expert agent | `"Add a new expert agent for [domain]"` |
| Add a new playbook | `"Add a new playbook for [scenario]"` |
| Add a new IDE framework | `"Add a new framework for [name]"` |
| Check if a topic is covered | `"Check if [topic] is covered"` |
| Monthly security + best practice audit | `Read MAINTAINER/web-audit.md and execute it.` |
| Quarterly full ecosystem scan | `Read MAINTAINER/web-audit.md and execute it. scope=full` |
| Internal consistency audit | `Read MAINTAINER/platform-audit.md and execute it.` |
| Release the next version | `"Release"` — agent reads CHANGELOG, calculates version bump, confirms with you, runs the release script |

---

## Version

**v2.24.0** · [Changelog](CHANGELOG.md) · [GitHub Releases](https://github.com/zafrirron/Agent-Platform/releases)

---

*Agent Platform Bootstrap — https://github.com/zafrirron/Agent-Platform*
*Built by agents. For agents. To build better agents.*
