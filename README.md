# Agent Platform Bootstrap

**Built by agents. For agents. To build better agents.**

> *The meta-platform: an AI agent maintains the rules that your AI agents follow.
> Every upgrade makes every agent smarter. Agents building the platform that builds better agents.*

---

## What it is

A complete multi-agent development environment installed into any repository in one command. Claude Code, Cursor, Antigravity, and Codex work together without conflicts. Eight specialist agents. Eight playbooks. Test enforcement. A quick reference on every session start. No memorisation required.

> **Zero changes to your project code.** Install adds only platform coordination folders (`.agent/`, `.claude/`, etc.) — all gitignored by default so nothing is accidentally committed. Your source files, configuration, and git history are never touched.
> **Already using Claude Code, Cursor, or Copilot?** Your existing `CLAUDE.md`, `AGENTS.md`, and rules files are preserved, backed up, and never overwritten. Remove the platform and your originals are restored.

---

## Zero footprint — install, use, remove cleanly

| Guarantee | Detail |
|-----------|--------|
| **No code changes on install** | Only adds `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/` folders and `AGENTS.md` `SYNC-POINTS.md` `CLAUDE.md`. Zero modifications to your existing files. |
| **Nothing committed accidentally** | All platform folders and files are added to `.gitignore` automatically on install. `git status` stays clean. Your team never sees platform noise. |
| **Existing AI configs are preserved** | If you already have a `CLAUDE.md`, `AGENTS.md`, Cursor rules, or Copilot instructions, they are **never overwritten**. Backed up to `.agent/backup/`. A `MIGRATION-NOTES.md` explains how to connect them to the platform. |
| **Clean removal + original restore** | Uninstall removes all platform files AND restores any files that were backed up on install. Your repo returns to its exact pre-install state. |
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
| **8 playbooks** | add-feature · bug-fix · refactor · release · debug · security-audit · add-dependency · api-integration |
| **Smart upgrade model** | `mode=upgrade` improves your agents' rules without touching your project customisations |
| **Test enforcement** | Every function, bug fix, and API endpoint requires a test. Red suite blocks handoff. |
| **Quick reference** | Full capability guide displayed on every session start — no memorisation required |
| **Local help** | `PLATFORM-HELP.md` installed in every repo — everything explained, fully offline |
| **Agentic update check** | Agents check for platform improvements automatically, once per 7 days |
| **Token compression** | `"caveman mode"` — ~65% shorter output, same accuracy, all IDEs |
| **Enforcement guards** | `--mode=install-guards` wires real pre-commit hooks and GitHub Actions CI — secrets scan, test suite, coverage gate. Aspiration becomes enforcement. |
| **Zero code impact** | Installs only into `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/`. Nothing else changes. All platform files gitignored by default. Remove completely with one command — nothing left behind. |

---

## How it works

```
npx github:zafrirron/Agent-Platform
        │
        ├─ Detects: project name, stack, test runner, coverage command
        ├─ Installs: .agent/ .claude/ .cursor/ .agents/ .codex/
        ├─ Fills: project-specific stubs from codebase scan
        └─ Prints: capabilities list + single session-start command

Every session:
        ├─ Agent self-identifies its IDE (Claude/Cursor/Antigravity/Codex)
        ├─ Checks for updates (max once per 7 days)
        ├─ Displays full quick reference
        └─ Ready. Tell me what you want to do.
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

## Remove — clean uninstall, zero residue

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run — shows what will be deleted
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes everything
```

Removes: all platform folders, root files, and the gitignore block.  
**After removal your repository is identical to before install.** Source code, config, and git history untouched.

---

## Documentation

| Document | For |
|----------|-----|
| [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md) | **Users** — complete installation, usage, and extension guide |
| [CHANGELOG.md](CHANGELOG.md) | **Users** — version history and upgrade paths |
| [MAINTAINER/GUIDE.md](MAINTAINER/GUIDE.md) | **Platform author** — how to develop and improve the platform |

---

## Version

**v2.15.0** · [Changelog](CHANGELOG.md) · [GitHub Releases](https://github.com/zafrirron/Agent-Platform/releases)

---

*Agent Platform Bootstrap — https://github.com/zafrirron/Agent-Platform*
*Built by agents. For agents. To build better agents.*
