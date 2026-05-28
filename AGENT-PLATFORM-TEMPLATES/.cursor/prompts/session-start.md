# Cursor — session start

**User command:** `Read .cursor/prompts/session-start.md and execute it.`

You are working in **Cursor** on {{PROJECT_NAME}}. Sync before writing any code.

## Steps

1. Read `SYNC-POINTS.md`, `.agent/SYNC.md`, `.agent/ZONES.md`
2. Read `.agent/handoff/sync/registry.yaml` + `.agent/handoff/CURRENT.md` (top entry)
3. Optional lock check: `node .agent/tools/check_locks.js cursor <files you plan to edit>`
4. Conflict check: if `claude`, `antigravity`, or `codex` is `active` on overlapping `files` → stop
5. Set `frameworks.cursor` → `active` (started_at, task, files); `meta.updated_by: cursor`
6. Prepend `CURRENT.md` with `**Framework:** cursor`, `Status: in_progress`
7. Load expert from `.agent/agents/` or `AGENTS.md` §2 for your task domain

**Do not edit** `.claude/`, `.agents/`, `.codex/`, or `CLAUDE.md`.

Confirm to user: private `.cursor/`, registry active, conflicts none.

Proceed with the user's task.
