# Playbook: Bug fix

<!-- PLATFORM:START -->
## Pre-conditions — confirm before starting
- [ ] Bug is reproducible — you have the exact input/condition that triggers it
- [ ] Scope is clear — you know which files are likely involved
- [ ] Not a feature request in disguise — if it is, stop and create a feature task instead

## Steps

1. **Reproduce**
   Confirm the bug triggers consistently with a minimal input. Document:
   - Exact steps to reproduce
   - Expected behaviour
   - Actual behaviour
   - Environment (OS, version, browser if applicable)

2. **Scope**
   Identify and claim affected files in `registry.yaml`. Do not touch unrelated code.

3. **Root cause**
   Follow `debug-pipeline.md` if cause is not immediately obvious.
   **Fix the root cause, not the symptom.** If fixing the symptom, stop and escalate.

3b. **Design check** — before writing any fix code:
   - **Simple / obvious fix** (1–5 lines, isolated, no interface changes): state the fix in one sentence — wait for user "ok" before proceeding
   - **Non-trivial fix** (multiple files, changes shared logic, requires refactor, touches security or auth): present a written design — what changes, which files, why this approach, any risks — wait for explicit user approval
   - **Architectural fix** (root cause requires restructuring, breaking API change, schema migration): load `architect-agent.md`, write ADR, get full design approval first
   **BLOCKED:** do not write code until the appropriate design confirmation is received.

3c. **BC check** ← gate before writing the fix
   Does the fix change any public contract (API response shape, error codes, config format, exported interface)?
   - If **no**: proceed to Step 4.
   - If **yes**: output a ⚠️ BC BREAK notice (format: `BEST-PRACTICES.md`) — a bug fix that changes observable behaviour is still a BC break from the caller's perspective.
     Include: what changed, which callers are affected, migration steps or "no migration path".
   **BLOCKED if: fix breaks a public contract and user approval has not been received.**
   Note: fixing a bug that was never intentionally part of the contract does not require user approval, but still requires the notice so callers are aware.

4. **Fix**
   Smallest change that makes the bug impossible. Do not refactor surrounding code — note it in `CURRENT.md` for a separate task.

4b. **Output validation** ← postcondition gate
   Before writing the regression test, verify the fix output matches the root cause analysis:
   - Re-read the expected behaviour from Step 1
   - Confirm the fix eliminates the exact condition identified in Step 3 (root cause), not just suppresses the symptom
   - If the fix changes behaviour beyond the stated scope: stop, note in CURRENT.md, ask user
   **BLOCKED if: fix output does not match stated root cause.**

5. **Regression test** ← quality gate
   - Write a test that **reproduces the exact failing input from Step 1**
   - **Verify the test FAILS on unfixed code** — if it passes, it is not a regression test
   - Apply the fix
   - **Verify the test PASSES on fixed code**
   - If you cannot write this test, log the reason in `CURRENT.md` before continuing

5b. **Critic review** ← adversarial gate
   Load `critic-agent.md`. Give it: the fix from Step 4 + the regression test from Step 5.
   Scope: `[CORRECTNESS] [TEST] [SECURITY]`
   The critic must confirm:
   - Does the test actually fail on unfixed code? (confirm, don't assume)
   - Did the fix introduce any new bugs in adjacent code?
   - Are there edge cases the regression test doesn't cover?
   - Any security implications of the change?
   **BLOCKED if: any Critical or High finding is reported. DEFER if tradeoff requires user decision.**
   Address all Critical/High findings before continuing to Step 6.

6. **Full suite**
   Run `{{TEST_RUNNER}}`. All tests must pass. If any new failures appear, fix them before continuing — do not ship a fix that breaks other tests.

7. **Log**
   Update `CURRENT.md`:
   - Root cause (one sentence)
   - Fix applied (one sentence)
   - Regression test added (file and test name)
   - Any related issues noted for later

8. **Close**
   If this bug was in `.agent/context/known-issues.md`, remove or update the entry.

## Rules
- Every bug fix ships with a regression test — no exceptions
- Fix the root cause, not the symptom
- If fix requires architectural change → Architect agent first; log ADR
- If bug is in a dependency → prefer upgrading the dep over monkey-patching
- Do not touch code outside the bug scope — note it in `CURRENT.md`
<!-- PLATFORM:END -->
