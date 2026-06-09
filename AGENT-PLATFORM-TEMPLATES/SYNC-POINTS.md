# Sync points — all agent frameworks

**Project:** {{PROJECT_NAME}}

Switch tools with two commands: **session-start** when you arrive, **session-end** when you leave.

## Switch commands

| Framework | Start | End |
|-----------|-------|-----|
| **Cursor** | `Read .cursor/prompts/session-start.md and execute it.` | `Read .cursor/prompts/session-end.md and execute it.` |
| **Claude Code** | `Read .claude/prompts/session-start.md and execute it.` | `Read .claude/prompts/session-end.md and execute it.` |
| **Antigravity** | `Read .agents/prompts/session-start.md and execute it.` | `Read .agents/prompts/session-end.md and execute it.` |
| **Codex (VS Code)** | `Read .codex/prompts/session-start.md and execute it.` | `Read .codex/prompts/session-end.md and execute it.` |

## Private areas

| Framework | Folder |
|-----------|--------|
| Cursor | `.cursor/` |
| Claude | `.claude/` + `CLAUDE.md` |
| Antigravity | `.agents/` |
| Codex | `.codex/` |

## Shared sync (all frameworks)

| Point | Path |
|-------|------|
| Registry | `.agent/handoff/sync/registry.yaml` |
| Handoff | `.agent/handoff/CURRENT.md` |
| Protocol | `.agent/SYNC.md` |
| Zones | `.agent/ZONES.md` |
| Bootstrap | `AGENT-PLATFORM-BOOTSTRAP.md` |

Router: `AGENTS.md`

## Cursor multi-model

Cursor can route a single session to multiple models (GPT-4o, Claude, Gemini, etc.).
The platform treats the whole Cursor session as one framework lock — it does not track model switches.

If you switch models mid-task, run **session-end before** switching and **session-start after**
so the handoff log stays accurate. Skipping this leaves `CURRENT.md` stale and the registry
showing work-in-progress state that the incoming model won't know about.
