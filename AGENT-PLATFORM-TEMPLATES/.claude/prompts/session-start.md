# Claude Code — session start

**User command:** `Read .claude/prompts/session-start.md and execute it.`

You are working in **Claude Code** on {{PROJECT_NAME}}. Sync before writing any code.

## Steps

1. Read `SYNC-POINTS.md`, `CLAUDE.md`, `.agent/SYNC.md`, `.agent/ZONES.md`
2. Read `.agent/handoff/sync/registry.yaml` + `.agent/handoff/CURRENT.md`
3. Optional: `node .agent/tools/check_locks.js claude <planned files>`
4. Conflict check: if `cursor`, `antigravity`, or `codex` is `active` on overlapping `files` → stop
5. Set `frameworks.claude` → `active`; `meta.updated_by: claude`
6. Log `CURRENT.md` with `**Framework:** claude`
7. Load `.agent/agents/<expert>-agent.md` per `AGENTS.md` §2

**Do not edit** `.cursor/`, `.agents/`, `.codex/`.

Confirm and proceed.
