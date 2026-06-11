# Pack contents

This file lists what is in the framework repository and what ships to consumer repos on install.

---

## Install (preferred — no manual copying needed)

### Project install (per repo)

```bash
# Any OS with Node.js 18+
npx github:zafrirron/Agent-Platform

# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

No file copying required. The installer downloads the pack, applies it, and cleans up.

### Global install (user home directory — run once, works across all repos)

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

Installs thin activation stubs to `~/.claude/`, `~/.cursor/rules/`, `~/.codex/`, `~/.agents/rules/`.
After this, every repo you open with `AGENTS.md` activates expert routing automatically.
Repos without the platform get a one-time install offer at session start.

The project install summary shows a reminder if global stubs are not yet installed.

---

## Framework repository contents

Everything in this repository. Only the paths below ship to consumer repos.

```text
AGENT-PLATFORM-BOOTSTRAP.md        ← installer orchestrator (agent-facing)
AGENT-PLATFORM-MANIFEST.json       ← file registry + bootstrap_version
AGENT-PLATFORM-TEMPLATES/          ← all installable file bodies
AGENT-PLATFORM-APPLY.js            ← installer entry point (Node.js)
bin/agent-platform.js               ← npx entry point
install.sh                          ← bash one-liner installer
install.ps1                         ← PowerShell one-liner installer
```

Framework-only files (not shipped to consumer repos):

```text
AGENT-PLATFORM-FRAMEWORK-README.md ← complete human guide
CHANGELOG.md                        ← version history
COPYING.md                          ← this file
PACK-DEPLOY.md                      ← deploy reference
MAINTAINER/                         ← platform author's private workspace
tools/                              ← build scripts
tests/                              ← unit tests
package.json
.gitignore
```

---

## What gets installed

### Project install (per repo)

```text
.agent/          ← shared hub — conventions, playbooks, agents, context, tools
.claude/         ← Claude Code private folder
.cursor/         ← Cursor private folder
.agents/         ← Antigravity private folder
.codex/          ← Codex private folder
AGENTS.md        ← framework router
SYNC-POINTS.md   ← cross-IDE switch cheat sheet
CLAUDE.md        ← Claude Code entry point
```

All of the above are added to `.gitignore` automatically — nothing is committed to the user's repo.

### Global install (user home directory, `--mode=global`)

```text
~/.claude/CLAUDE.md                         ← activation stub + USER section
~/.claude/commands/*.md                     ← global Claude slash commands
~/.cursor/commands/*.md                     ← global Cursor slash commands
~/.cursor/rules/agent-platform-global.mdc  ← alwaysApply: true activation rule
~/.codex/instructions.md                   ← activation stub + USER section
~/.agents/rules/agent-platform-global.md  ← activation stub + USER section
~/.agent-platform/global-version           ← version tracking
```

These are never gitignored — they live in your home directory, not in any repo.

---

## Uninstall

The two install scopes uninstall independently.

### Project uninstall (this repo only)

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes project platform files
```

Removes all platform files from the repo and restores any AI config files that existed before install.

### Global uninstall (user home directory)

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall-global          # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall-global --confirm # removes global stubs
```

Smart removal: files where you added USER section content have only the PLATFORM block stripped — your personal preferences are preserved. Files with no user content are deleted entirely.
