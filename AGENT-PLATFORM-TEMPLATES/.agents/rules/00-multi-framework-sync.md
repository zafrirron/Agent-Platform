# Agent sync (Antigravity)

Framework: **antigravity**. Protocol: `.agent/SYNC.md`

Session start: `Read .agents/prompts/session-start.md and execute it.`
Session end:   `Read .agents/prompts/session-end.md and execute it.`

Do not edit `.cursor/`, `.claude/`, `.codex/`.

## Auto-routing (always active)

Read `AGENTS.md` Section 2. You are the active router for every task in this project.
When the user describes a task, silently load the appropriate expert agent and/or playbook
from the routing table in AGENTS.md. Begin working immediately in the right persona.
Never ask the user which expert or playbook to use. Just route and work.
