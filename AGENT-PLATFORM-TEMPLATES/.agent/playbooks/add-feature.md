# Playbook: Add feature

## Pre-conditions
- [ ] Requirements clear — done-when criteria defined
- [ ] Scope agreed — what's explicitly out of scope noted

## Steps
1. **Claim** — read `registry.yaml`; claim scope files
2. **Design** — **REQUIRED before any code.** Assess scope:
   - Touches more than one file domain, adds middleware, changes auth, or modifies data shape → **BLOCKED: load `architect-agent.md` first; write ADR before proceeding**
   - Isolated single-domain change → document the approach in one paragraph before coding
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
5a. **Security gate** ← automatic for any feature touching endpoints, auth, or data input
   If the feature adds or modifies: a new endpoint, auth/authz logic, user input handling, file operations, or data queries:
   Load `security-agent.md`. Run a targeted review on the new code only — not the whole codebase.
   Check: input validation, auth enforcement, error response content, data exposure, injection vectors.
   **BLOCKED if: any Critical or High finding is reported.**
   Address findings before Step 5b.
   If the feature adds no endpoints and no data handling: skip this step.
5b. **Critic review** ← adversarial gate
   Load `critic-agent.md`. Give it the implementation + tests from Steps 4–5.
   Scope: `[SECURITY] [CORRECTNESS] [TEST] [COMPLETENESS] [DESIGN] [DEPENDENCY]`
   **BLOCKED if: any Critical or High finding is reported. DEFER if tradeoff requires user decision.**
   Address all findings before continuing to Step 6.
6. **Docs** — if user-facing: Docs agent updates README / changelog
7. **Handoff** — update `CURRENT.md` with outcome, files changed, and next agent recommendation. Do NOT run session-end — only the user ends the session.

## Rules
- No feature additions and refactors in the same diff
- If scope creeps during implementation → stop, discuss with user, re-scope
