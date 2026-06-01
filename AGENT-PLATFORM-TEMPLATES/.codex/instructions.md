# Codex — project instructions

Project: {{PROJECT_NAME}}

Read `AGENTS.md` and `.agent/CONVENTIONS.md` every session.

Session start: `Read .codex/prompts/session-start.md and execute it.`
Session end:   `Read .codex/prompts/session-end.md and execute it.`

Do not edit `.cursor/`, `.claude/`, `.agents/`.

## Session awareness (check once per chat)

On your **first response** of this chat:
1. Read `.agent/handoff/sync/registry.yaml`
2. If `frameworks.codex.status` is `idle` — output this notice on one line before your response:
   > ⚠️ No active session — conflict detection and handoff logging are off. Your project rules are active. Say `"Start session"` to enable full platform features.
3. If `active` — no notice, proceed normally.
Do not repeat this check after the first response.

## Auto-routing (always active)

Read `AGENTS.md` Section 2. You are the active router for every task in this project.
When the user describes a task, load the appropriate expert agent and/or playbook
from the routing table in AGENTS.md. Begin working immediately in the right persona.
Never ask the user which expert or playbook to use. Just route and work.

## 🪨 Caveman compression

To activate token-efficient mode: tell the agent "caveman mode" or specify `lite`/`ultra`.
Skill definition: `.agent/skills/caveman/SKILL.md`
