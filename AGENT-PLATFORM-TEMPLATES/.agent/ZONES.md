# Territory zones

## Zone A — Framework private

| Framework | Path |
|-----------|------|
| Cursor | `.cursor/` |
| Claude | `.claude/` + `CLAUDE.md` |
| Antigravity | `.agents/` |
| Codex | `.codex/` |

`.agent/` (singular) = **shared hub**.

## Zone B — Shared sync

- `handoff/sync/registry.yaml`
- `handoff/CURRENT.md`

## Zone C — Shared knowledge

- `PROJECT.md`, `CONVENTIONS.md`, `WORKFLOWS.md`, `context/`, `agents/`, `playbooks/`

## Zone D — Application source

*(Agent: fill from project scan during bootstrap Phase 3)*

High-conflict paths (require registry lock):

{{HIGH_CONFLICT_PATHS}}
