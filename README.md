# Agent Platform Bootstrap

**A complete multi-agent development environment for any repository — installed in one command.**

> Drop it into any codebase. Claude Code, Cursor, Antigravity, and Codex work together without conflicts. Eight specialist agents. Eight playbooks. A quick reference guide on every session start. No memorisation required.

---

## Install

```bash
# Any OS — Node.js 18+ required
npx github:zafrirron/Agent-Platform

# Linux / macOS (no Node.js needed)
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

Then start your first session — one command, any IDE:

```
Read .agent/session-start.md and execute it.
```

---

## What you get

| Capability | Description |
|------------|-------------|
| **4 IDE frameworks** | Claude Code · Cursor · Antigravity · Codex — private folders, session prompts, skill wiring. Switch between IDEs without losing context. |
| **8 expert agents** | Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data. Activate by name, chain across sessions. |
| **8 playbooks** | add-feature · bug-fix · refactor · release · debug · security-audit · add-dependency · api-integration. Step-by-step workflows with agent assignments. |
| **Quick reference on every session start** | Agent displays a full capability table on every session start — no memorisation required. Framework-aware: shows the exact commands for your active IDE. |
| **Test enforcement** | Every new function, bug fix, and API endpoint requires a test before done. Coverage gate auto-detected at install. Red suite blocks handoff. |
| **Agentic update check** | `node .agent/tools/check-updates.mjs` — compares installed version against GitHub. Or tell the agent: `Read .agent/tools/upgrade.md and execute it.` |
| **Cross-IDE coordination** | `registry.yaml` prevents two IDEs editing the same files simultaneously. `CURRENT.md` preserves full context across switches. |
| **Token compression (Caveman)** | `"caveman mode"` cuts agent output by ~65% while keeping full accuracy. Works across all 4 frameworks. |
| **5 living context files** | api-contracts · adr-log · known-issues · dependencies · project-overview — kept in sync as code evolves. |
| **Self-customising install** | Scans your codebase at install time. Fills project name, stack, test runner, coverage command, and entry points automatically. |
| **Safe everywhere** | Default mode creates missing files only. Never overwrites existing content. Never touches application source. |

---

## How it works

```
npx github:zafrirron/Agent-Platform
        │
        ├─ Phase 0: Detect project name, stack, test runner, coverage command
        ├─ Phase 1: Verify pack files
        ├─ Phase 2: Write .agent/, .claude/, .cursor/, .agents/, .codex/
        ├─ Phase 3: Fill project-specific stubs from codebase scan
        ├─ Phase 4: Update .gitignore
        └─ Phase 5: Print install summary with per-IDE session-start commands
```

After install, every session starts with a full capability quick reference — all commands for the active IDE, update status, and last work context.

---

## Remove

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run — shows what will be deleted
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # actually deletes
```

Your application source is never touched — only the platform scaffolding is removed.

---

## Upgrade

```bash
# Add new files from latest release, skip existing
npx github:zafrirron/Agent-Platform --mode=upgrade

# Or let the agent do it
Read .agent/tools/upgrade.md and execute it.
```

Check for updates from inside any installed repo:
```bash
node .agent/tools/check-updates.mjs
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md) | Complete guide — installation, usage, all capabilities, extending, best practices |
| [CHANGELOG.md](CHANGELOG.md) | Version history and upgrade paths |

---

## Version

Current: **v2.6.0** · [Changelog](CHANGELOG.md) · [GitHub Releases](https://github.com/zafrirron/Agent-Platform/releases)

---

*Agent Platform Bootstrap — https://github.com/zafrirron/Agent-Platform*
