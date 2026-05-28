# 🪨 Caveman skill

Compresses AI output ~65% by removing filler, hedging, and pleasantries.
Technical accuracy preserved. Code blocks always written normal.

**Source:** https://github.com/JuliusBrussee/caveman  
**Skill definition:** `SKILL.md` (single source of truth for all frameworks)

## Quick reference

| Activate | Command / phrase |
|----------|-----------------|
| Full mode (default) | `/caveman` |
| Lite mode | `/caveman lite` |
| Ultra mode | `/caveman ultra` |
| Classical Chinese | `/caveman wenyan` |
| Off | `stop caveman` or `normal mode` |

## Framework wiring

| Framework | How caveman loads |
|-----------|------------------|
| Claude Code | `.claude/commands/caveman*.md` slash commands |
| Cursor | `.cursor/rules/caveman.mdc` (opt-in, `alwaysApply: false`) |
| Antigravity | `.agents/skills/caveman.md` |
| Codex | Referenced in `.codex/instructions.md` |
