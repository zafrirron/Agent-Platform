# Pack contents

This file lists what is in the framework repository and what ships to consumer repos on install.

---

## Install (preferred — no manual copying needed)

```bash
# Any OS with Node.js 18+
npx github:zafrirron/Agent-Platform

# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

No file copying required. The installer downloads the pack, applies it, and cleans up.

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

## What gets installed on a consumer repo

The apply step creates these (nothing else):

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

---

## Uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes everything
```

Removes all platform files and restores any AI config files that existed before install.
