# Cursor — private area

🔒 **Cursor only.** Sync: `SYNC-POINTS.md`

| Start | `Read .cursor/prompts/session-start.md and execute it.` or **`/session-start`** |
| End | `Read .cursor/prompts/session-end.md and execute it.` or **`/session-end`** |

## Slash commands (`/`)

Type `/` in Cursor chat — platform commands live in `.cursor/commands/`:

| Command | Action |
|---------|--------|
| `/session-start` | Full platform session (registry, handoff) |
| `/session-end` | End session, update handoff log |
| `/quick-ref` | Open capability guide |
| `/platform-help` | Full offline help |
| `/spec` | Requirements clarification |
| `/audit` | 11-phase project audit |
| `/review` | Critic adversarial review |
| `/release` | Version, changelog, tag |
| `/ship` | Production readiness (PRR) |
| `/implement` | Resume add-feature Step 3 after plan approval |
| `/caveman` | Token compression (+ `caveman-commit`, `caveman-review`, …) |

Global install (`--mode=global`) also copies these to `~/.cursor/commands/`.

## Plan mode → implementation

Cursor **Plan mode** is read-only; after you **approve** the plan, `.cursor/rules/plan-mode-handoff.mdc` tells the agent to re-read `AGENTS.md`, load `add-feature.md`, and **resume from Step 3** (spec/tests before code). Security (5a) and Critic (5b) still run.

Say `"implement the plan"`, approve in the UI, or run **`/implement`** — expect: `▶ … add-feature playbook (resuming Step 3 — plan approved)`.

## Multi-model note

Cursor lets you switch between models (GPT-4o, Claude, Gemini, etc.) within the same project.
The platform tracks sessions at the **framework level** (Cursor), not the model level.
All models inherit the same `.cursor/rules/` (routing, sync fences) automatically.

**When switching models mid-task:** treat it like a framework switch.
Run session-end in the current chat before switching, then session-start in the new chat.
Without this, the handoff log (`CURRENT.md`) and registry won't reflect what the outgoing model did.
