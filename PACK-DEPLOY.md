# Deploy reference

How to install Agent Platform Bootstrap on a consumer repository.

---

## Recommended: one-command install (no manual steps)

```bash
# Any OS with Node.js 18+
npx github:zafrirron/Agent-Platform

# Linux / macOS (no Node.js needed)
curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash

# Windows PowerShell
iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
```

The installer downloads the pack from GitHub, applies it, prints a summary, and cleans up.
No files need to be manually copied.

---

## Install modes

```bash
# ── Project scope (per repo) ────────────────────────────────────────────────
npx github:zafrirron/Agent-Platform                       # install into current repo (default)
npx github:zafrirron/Agent-Platform --mode=upgrade        # add new files, skip existing
npx github:zafrirron/Agent-Platform --mode=repair         # fill empty stubs only
npx github:zafrirron/Agent-Platform --mode=force          # reset all templates (confirm first)
npx github:zafrirron/Agent-Platform --mode=install-guards # install pre-commit + CI guards
npx github:zafrirron/Agent-Platform --mode=remove-guards  # remove guards
npx github:zafrirron/Agent-Platform --mode=uninstall      # dry run — shows what will be removed
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm  # remove project platform files

# ── Global scope (user home directory, run once) ────────────────────────────
npx github:zafrirron/Agent-Platform --mode=global                        # install global stubs to ~/
npx github:zafrirron/Agent-Platform --mode=uninstall-global              # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall-global --confirm    # remove global stubs
```

**The two scopes are independent.** Removing from one does not affect the other.

## Global install (user-level, run once across all repos)

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

Installs stubs to `~/.claude/`, `~/.cursor/rules/`, `~/.codex/`, `~/.agents/rules/`.
After this, every repo with `AGENTS.md` activates platform routing automatically.
Repos without the platform get a one-time install offer at session start.
Suppress the offer for a specific repo by creating `.agent-platform-skip` at its root.

---

## After install

Start your first session — paste into your AI agent chat (not the terminal):

```
Read .agent/session-start.md and execute it.
```

Works in: Claude Code · Cursor · Antigravity · Codex · OpenCode

---

## Pin to a specific version

```bash
npx github:zafrirron/Agent-Platform#v2.15.2
```

---

## Upgrade an existing install

```bash
# Check for updates
node .agent/tools/check-updates.mjs

# Apply upgrade (improves expert rules, adds new capabilities)
npx github:zafrirron/Agent-Platform --mode=upgrade

# Or let the agent handle it
# Tell your agent: Read .agent/tools/upgrade.md and execute it.
```

---

## Manual install (fallback — not recommended)

If `npx` is unavailable:

1. Clone or download the framework repo
2. Copy these files to the consumer repo root:
   - `AGENT-PLATFORM-BOOTSTRAP.md`
   - `AGENT-PLATFORM-MANIFEST.json`
   - `AGENT-PLATFORM-TEMPLATES/`
   - `AGENT-PLATFORM-APPLY.js`
3. Run: `node AGENT-PLATFORM-APPLY.js`
4. Delete the pack files after install (they are not needed at runtime)
