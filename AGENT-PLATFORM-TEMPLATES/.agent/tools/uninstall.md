# Remove Agent Platform

> Tell your agent: `Read .agent/tools/uninstall.md and execute it.`

---

⚠️ **This will permanently remove all platform files from this repository.**

The platform coordination scaffolding is removed. Your AI agents improved your codebase while you used the platform — those code changes are yours to keep. Only the coordination layer that guided them is removed.

## What will be deleted

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

## Steps

1. **Confirm with the user** — ask explicitly: "Are you sure you want to remove all Agent Platform files from this repository? This cannot be undone."
2. If confirmed, run:
   ```
   npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
   ```
3. Report what was removed.

## Dry run (see what would be removed without deleting)

```
npx github:zafrirron/Agent-Platform --mode=uninstall
```

No `--confirm` = nothing is deleted, only a list is shown.
