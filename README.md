# Agent Platform Bootstrap

**Built by agents. For agents. To build better agents.**

> *The meta-platform: an AI agent maintains the rules that your AI agents follow.
> Every upgrade makes every agent smarter. Agents building the platform that builds better agents.*

---

## What it is

A complete multi-agent development environment installed into any repository in one command. Claude Code, Cursor, Antigravity, and Codex work together without conflicts. Eight specialist agents. Eight playbooks. Test enforcement. A quick reference on every session start. No memorisation required.

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
| **8 expert agents** | Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data — activate by name |
| **8 playbooks** | add-feature · bug-fix · refactor · release · debug · security-audit · add-dependency · api-integration |
| **Smart upgrade model** | `mode=upgrade` improves your agents' rules without touching your project customisations |
| **Test enforcement** | Every function, bug fix, and API endpoint requires a test. Red suite blocks handoff. |
| **Quick reference** | Full capability guide displayed on every session start — no memorisation required |
| **Local help** | `PLATFORM-HELP.md` installed in every repo — everything explained, fully offline |
| **Agentic update check** | Agents check for platform improvements automatically, once per 7 days |
| **Token compression** | `"caveman mode"` — ~65% shorter output, same accuracy, all IDEs |
| **Safe everywhere** | Never overwrites your code. Never overwrites your customisations on upgrade. |

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

## Upgrade — get smarter agents

```bash
# Your agents get improved rules. Your project customisations are untouched.
npx github:zafrirron/Agent-Platform --mode=upgrade
```

Every expert file has two sections:
- **Platform section** — improved by this project, pushed on `--mode=upgrade`
- **Project section** — your team's rules, never overwritten

---

## Remove

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # remove
```

---

## Documentation

| Document | For |
|----------|-----|
| [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md) | **Users** — complete installation, usage, and extension guide |
| [CHANGELOG.md](CHANGELOG.md) | **Users** — version history and upgrade paths |
| [MAINTAINER/GUIDE.md](MAINTAINER/GUIDE.md) | **Platform author** — how to develop and improve the platform |

---

## Version

**v2.8.0** · [Changelog](CHANGELOG.md) · [GitHub Releases](https://github.com/zafrirron/Agent-Platform/releases)

---

*Agent Platform Bootstrap — https://github.com/zafrirron/Agent-Platform*
*Built by agents. For agents. To build better agents.*
