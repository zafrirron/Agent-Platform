# Cursor — private area

🔒 **Cursor only.** Sync: `SYNC-POINTS.md`

| Start | `Read .cursor/prompts/session-start.md and execute it.` |
| End | `Read .cursor/prompts/session-end.md and execute it.` |

## Multi-model note

Cursor lets you switch between models (GPT-4o, Claude, Gemini, etc.) within the same project.
The platform tracks sessions at the **framework level** (Cursor), not the model level.
All models inherit the same `.cursor/rules/` (routing, sync fences) automatically.

**When switching models mid-task:** treat it like a framework switch.
Run session-end in the current chat before switching, then session-start in the new chat.
Without this, the handoff log (`CURRENT.md`) and registry won't reflect what the outgoing model did.
