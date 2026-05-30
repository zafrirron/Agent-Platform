# Playbook: Add feature

## Pre-conditions
- [ ] Requirements clear — done-when criteria defined
- [ ] Scope agreed — what's explicitly out of scope noted

## Steps
1. **Claim** — read `registry.yaml`; claim scope files
2. **Design** — if cross-cutting: Architect agent first; log ADR if architectural
3. **Spec** — write acceptance criteria or test skeleton before implementation
4. **Implement** — domain expert(s); smallest correct change
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
   The critic must check all six dimensions: correctness, security, test quality,
   completeness, design, edge cases.
   **BLOCKED if: any Critical or High finding is reported.**
   Address all findings before continuing to Step 6.
6. **Docs** — if user-facing: Docs agent updates README / changelog
7. **Handoff** — end session prompt; update `CURRENT.md` with outcome + next agent

## Rules
- No feature additions and refactors in the same diff
- If scope creeps during implementation → stop, discuss with user, re-scope
