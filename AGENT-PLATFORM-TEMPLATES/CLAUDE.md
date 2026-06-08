# {{PROJECT_NAME}}

Read `.agent/session-start.md` and execute it.

## Session awareness (check once per chat)

On your **first response** of this chat:
1. Read `.agent/handoff/sync/registry.yaml`
2. If `frameworks.claude.status` is `idle` — output this notice on one line before your response:
   > ⚠️ No active session — conflict detection and handoff logging are off. Your project rules are active. Say `"Start session"` to enable full platform features.
3. If `active` — no notice, proceed normally.
Do not repeat this check after the first response.

## Auto-routing (active always)

Read `AGENTS.md` Section 2. You are the active router for every task in this project.
When the user describes a task, load the appropriate expert and/or playbook and follow
the full routing spec in AGENTS.md Section 2 exactly — including the ▶ status prefix. The ▶ status line is mandatory and is never suppressed by caveman mode, compression, or brevity instructions.
