# Remove Agent Platform

> Tell your agent: `Read .agent/tools/uninstall.md and execute it.`

---

The platform has two independent install scopes. Uninstall each separately.

---

## Scope 1 — Project (this repo)

⚠️ **Removes all platform files from this repository.**

The coordination scaffolding is removed. Code your AI agents wrote while you used the platform is yours to keep. Only the layer that guided them is removed.

### What will be deleted

| Path | Contents |
|------|---------|
| `.agent/` | Shared hub — conventions, playbooks, agents, context, tools |
| `.claude/` | Claude Code session prompts and commands |
| `.cursor/` | Cursor session prompts and MDC rules |
| `.agents/` | Antigravity session prompts and skills |
| `.codex/` | Codex session prompts and instructions |
| `AGENTS.md` | Framework router |
| `SYNC-POINTS.md` | Cross-IDE switch cheat sheet |
| `CLAUDE.md` | Claude Code entry point |

### Steps

1. **Confirm with the user** — ask explicitly: "Are you sure you want to remove all Agent Platform files from this repository? This cannot be undone."
2. If confirmed, run:
   ```
   npx {{PLATFORM_NPX}} --mode=uninstall --confirm
   ```
3. Report what was removed.

### Dry run

```
npx {{PLATFORM_NPX}} --mode=uninstall
```

No `--confirm` = nothing deleted, only a list is shown.

---

## Scope 2 — Global (user home directory)

Removes the user-level stubs installed by `--mode=global`.

**This does NOT affect any project installs.** Each scope is independent.

### What will be affected

| Path | Action |
|------|--------|
| `~/.claude/CLAUDE.md` | PLATFORM block removed; your USER section content is preserved if you added any |
| `~/.cursor/rules/agent-platform-global.mdc` | Same — PLATFORM block removed, USER content kept |
| `~/.codex/instructions.md` | Same |
| `~/.agents/rules/agent-platform-global.md` | Same |
| `~/.claude/commands/caveman*.md` etc. | Deleted (pure platform files, no user content) |
| `~/.agent-platform/global-version` | Deleted |

Files with no platform markers are left untouched.

### Steps

1. **Confirm with the user** — ask: "Remove the global Agent Platform stubs from your home directory?"
2. Dry run first (recommended):
   ```
   npx {{PLATFORM_NPX}} --mode=uninstall-global
   ```
3. Confirm removal:
   ```
   npx {{PLATFORM_NPX}} --mode=uninstall-global --confirm
   ```

---

## Removing both scopes

Run project uninstall first, then global:

```
npx {{PLATFORM_NPX}} --mode=uninstall --confirm
npx {{PLATFORM_NPX}} --mode=uninstall-global --confirm
```
