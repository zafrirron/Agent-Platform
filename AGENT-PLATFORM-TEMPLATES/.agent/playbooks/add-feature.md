# Playbook: Add feature

## Pre-conditions
- [ ] Requirements clear — done-when criteria defined
- [ ] Scope agreed — what's explicitly out of scope noted

## Cursor Plan mode handoff

If the user approved a plan in **Cursor Plan mode** (this thread or linked planning context):

- **Steps 0–2** are satisfied when the approved plan includes scope and design at the correct Design Gate tier (see Step 2 table)
- **Resume at Step 3** — write acceptance criteria or failing test skeleton from the approved plan before any production code
- **Re-run Step 2b (BC check)** if the approved plan changes existing contracts
- Cursor rule: `.cursor/rules/plan-mode-handoff.mdc` — status line must include `(resuming Step 3 — plan approved)`

## Steps
0. **Spec clarity** ← before design on non-trivial work
   - If requirements are underspecified: run `.agent/playbooks/requirements-clarification.md` OR user confirms scope is already clear
   - For new endpoint, module, auth, or multi-file feature: ensure `.agent/context/spec-outline.md` has objectives, scope, testing, and boundaries — create or update before Step 2
   - Skip silently for trivial one-line changes

1. **Claim** — read `registry.yaml`; claim scope files

2. **Design** — **MANDATORY before any code.** Read `.agent/context/nfr-log.md` — cite relevant NFR IDs in acceptance criteria. Apply the Design Gate from `.agent/BEST-PRACTICES.md`:

   | Feature scope | Required design step | Blocked until |
   |--------------|---------------------|---------------|
   | Trivial patch / 1-line change | State what changes in 1 sentence | User says "ok" or "proceed" |
   | New function, small addition | 2–3 sentence design summary: what, where, why this approach | User gives explicit confirmation |
   | New endpoint, module, schema change, auth logic | Written design: components, data flow, contracts, edge cases | User explicitly approves |
   | Cross-cutting, new service, breaking change | Load `architect-agent.md`; write ADR; present 2–3 alternatives; create diagram | User approves full design |

   **BLOCKED:** do not write any production code until the user confirms the design at the appropriate tier. Silence is not confirmation.

2a. **Doubt review** ← in-flight gate for non-trivial decisions
   A decision is **non-trivial** when any of: crosses module/service boundary; changes irreversible contracts; asserts properties the type system cannot verify; production or security blast radius.
   When non-trivial: read Architect agent **Doubt-driven review** rules. Run CLAIM → EXTRACT → DOUBT (Critic with adversarial framing on design only) → RECONCILE before Step 3.
   Skip silently for trivial one-line changes.
   **BLOCKED if:** doubt cycle leaves unresolved Critical/High on the design.

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
   Base scope: `[SECURITY] [CORRECTNESS] [TEST] [COMPLETENESS] [DESIGN] [DEPENDENCY]`
   **Add `[PERFORMANCE]`** if the feature adds or modifies: HTTP endpoints, list/query routes, batch jobs, or hot-path loops.
   **Add `[ACCESSIBILITY]`** if the feature adds or modifies: UI components, forms, or user-facing pages.
   **Check `nfr-log.md`:** any P0/P1 NFR for this feature must be verified or noted as gap in review.
   Final scope line must list all active dimensions.
   **BLOCKED if: any Critical or High finding is reported. DEFER if tradeoff requires user decision.**
   Address all findings before continuing to Step 6.
   **Output immediately after review (required platform signal):**
   `▶ Critic review — APPROVED` or `▶ Critic review — N findings (X Critical, Y High): [one-line summary]`
   Log in `CURRENT.md`: `Critic reviewed: yes — [same summary]`
   **HARD RULE:** Do not tell the user the feature is done, do not proceed to Step 6, and do not end the session until Step 5b completes and the `▶ Critic review` line is output.
6. **Docs** — if user-facing: Docs agent updates README / changelog
7. **Handoff** — update `CURRENT.md` with outcome, files changed, and next agent recommendation. Do NOT run session-end — only the user ends the session.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "I'll add tests after the feature works" | Tests are the proof — "later" means untested code ships. Step 3 requires acceptance criteria or failing test skeleton first. |
| "Design gate is overkill for this" | Wrong tier still needs the right tier — a one-liner needs one sentence, not zero design. |
| "Security gate doesn't apply — it's internal" | Internal endpoints still handle data; Step 5a triggers on endpoints, auth, and input. |
| "Critic can wait until the PR" | Step 5b is mandatory before handoff — post-hoc review misses in-flight design flaws. |
| "I'll skip doubt review to save time" | High-stakes wrong design costs more than one adversarial pass. |

## Rules
- No feature additions and refactors in the same diff
- If scope creeps during implementation → stop, discuss with user, re-scope
