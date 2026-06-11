# Playbook: Add feature

## Pre-conditions
- [ ] Requirements clear — done-when criteria defined
- [ ] Scope agreed — what's explicitly out of scope noted

## Steps
1. **Claim** — read `registry.yaml`; claim scope files

2. **Design** — **MANDATORY before any code.** Apply the Design Gate from `.agent/BEST-PRACTICES.md`:

   | Feature scope | Required design step | Blocked until |
   |--------------|---------------------|---------------|
   | Trivial patch / 1-line change | State what changes in 1 sentence | User says "ok" or "proceed" |
   | New function, small addition | 2–3 sentence design summary: what, where, why this approach | User gives explicit confirmation |
   | New endpoint, module, schema change, auth logic | Written design: components, data flow, contracts, edge cases | User explicitly approves |
   | Cross-cutting, new service, breaking change | Load `architect-agent.md`; write ADR; present 2–3 alternatives; create diagram | User approves full design |

   **BLOCKED:** do not write any production code until the user confirms the design at the appropriate tier. Silence is not confirmation.

2b. **BC check** ← gate before implementation
   Apply the Backwards compatibility policy from `.agent/BEST-PRACTICES.md`:
   - Does the feature change any existing endpoint, schema, config key, exported type, or auth mechanism?
   - If **no changes to existing contracts**: proceed to Step 3.
   - If **yes**: classify as additive-safe or BC break.
     - Additive-safe (new optional field, new endpoint, new optional config): proceed.
     - BC break (removal, rename, type change, required param added, incompatible format change): **output ⚠️ BC BREAK notice** (format in `BEST-PRACTICES.md`) covering what breaks, who is affected, and the migration path — then **wait for explicit user approval before proceeding.**
   **BLOCKED if: BC break detected and user approval not received.**

3. **Spec** — write acceptance criteria or failing test skeleton **before** implementation — no exceptions
4. **Implement** — domain expert(s); smallest correct change
4b. **Output validation** ← postcondition gate
   Before running tests, verify the implementation output matches the spec from Step 3:
   - Re-read the acceptance criteria written in Step 3
   - Confirm each criterion is demonstrably met by the implementation
   - Confirm nothing was added beyond the stated scope (scope creep = stop, discuss, re-scope)
   - If any criterion is only partially met: note it explicitly before advancing
   **BLOCKED if: implementation does not satisfy stated acceptance criteria.**
5. **Test** — Test agent: unit + integration; all tests green
5a. **Security gate** ← automatic for any feature touching endpoints, auth, or data input (**MANDATORY when triggered**)
   If the feature adds or modifies: a new endpoint, auth/authz logic, user input handling, file operations, or data queries:
   Load `security-agent.md`. Run a targeted review on the new code only — not the whole codebase.
   Check: input validation, auth enforcement, error response content, data exposure, injection vectors.
   **Output immediately when this step runs (required platform signal):**
   `▶ Security gate — reviewing [list of new/changed files]`
   **BLOCKED if: any Critical or High finding is reported.**
   Address findings before Step 5b.
   If the feature adds no endpoints and no data handling: skip this step silently.
5b. **Critic review** ← adversarial gate (**MANDATORY — cannot skip**)
   Load `critic-agent.md`. Give it the implementation + tests from Steps 4–5.
   Scope: `[SECURITY] [CORRECTNESS] [TEST] [COMPLETENESS] [DESIGN] [DEPENDENCY]`
   **BLOCKED if: any Critical or High finding is reported. DEFER if tradeoff requires user decision.**
   Address all findings before continuing to Step 6.
   **Output immediately after review (required platform signal):**
   `▶ Critic review — APPROVED` or `▶ Critic review — N findings (X Critical, Y High): [one-line summary]`
   Log in `CURRENT.md`: `Critic reviewed: yes — [same summary]`
   **HARD RULE:** Do not tell the user the feature is done, do not proceed to Step 6, and do not end the session until Step 5b completes and the `▶ Critic review` line is output.
6. **Docs** — if user-facing: Docs agent updates README / changelog
7. **Handoff** — update `CURRENT.md` with outcome, files changed, and next agent recommendation. Do NOT run session-end — only the user ends the session.

## Rules
- No feature additions and refactors in the same diff
- If scope creeps during implementation → stop, discuss with user, re-scope
