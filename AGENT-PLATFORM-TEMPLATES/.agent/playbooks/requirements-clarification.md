# Playbook: Requirements clarification

<!-- PLATFORM:START -->
## When to run
- The ask is underspecified, vague, or contradictory
- Greenfield feature with no acceptance criteria
- User says "interview me", "grill me", "help me think through this", or "I'm not sure what I want"

Say before add-feature when scope is unclear.

## Pre-conditions
- [ ] Session started
- [ ] User has stated a rough goal (not a fully specced task)

## Steps

1. **Acknowledge** — restate what you understood in one sentence; ask if the framing is right.

2. **One question at a time** — ask a single focused question per turn. Do not batch five questions.
   - Prefer concrete choices over open-ended vagueness
   - Use diverge/converge: explore 2–3 options before recommending one

3. **Confidence check** — after each answer, estimate confidence (0–100%) that you could write testable acceptance criteria.
   - Below 80%: continue questioning
   - 80–94%: ask one confirming question on the biggest remaining ambiguity
   - ≥ 95%: proceed to Step 4

4. **Write spec outline** — populate `.agent/context/spec-outline.md`:
   - Objectives with done-when criteria
   - In/out of scope
   - Surfaces, testing, boundaries (Always / Ask first / Never)
   - Open questions → resolved or explicitly deferred with user approval

5. **Confirm with user** — present the outline; wait for explicit approval before routing to add-feature.

6. **Handoff** — update `CURRENT.md`. Recommend: `add-feature` with spec-outline as input.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "I know what they want — skip questions" | Underspecified asks cause rework; one question now saves hours later. |
| "Ask everything in one message" | One question at a time — users answer better; you learn faster. |
| "Spec outline is overkill" | Two lines in spec-outline beats zero; large projects need all six areas. |
| "Proceed to code — we'll clarify along the way" | add-feature design gate blocks code without confirmation — clarify first. |

## Done-when
- [ ] spec-outline.md populated and user-approved
- [ ] Confidence ≥ 95% or user explicitly accepts residual ambiguity
- [ ] No production code written in this playbook
<!-- PLATFORM:END -->
