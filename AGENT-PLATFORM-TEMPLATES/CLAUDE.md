# {{PROJECT_NAME}} — Claude Code

> **Private:** `.claude/` · **Start:** `Read .claude/prompts/session-start.md and execute it.` · **End:** `Read .claude/prompts/session-end.md and execute it.`

**Description:** {{PROJECT_DESCRIPTION}}

## Session start

1. Read `.agent/handoff/sync/registry.yaml`
2. Set `frameworks.claude` → `active`
3. Log `.agent/handoff/CURRENT.md` with `Framework: claude`

## Shared docs

- Architecture: `.agent/PROJECT.md`
- Conventions: `.agent/CONVENTIONS.md`
- Experts: `.agent/agents/`
- Router: `AGENTS.md`

**Do not edit:** `.cursor/`, `.agents/`, `.codex/`

Other frameworks: see `SYNC-POINTS.md`
