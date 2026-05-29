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

4. **Fix**
   Smallest change that makes the bug impossible. Do not refactor surrounding code — note it in `CURRENT.md` for a separate task.

5. **Regression test** ← quality gate
   - Write a test that **reproduces the exact failing input from Step 1**
   - **Verify the test FAILS on unfixed code** — if it passes, it is not a regression test
   - Apply the fix
   - **Verify the test PASSES on fixed code**
   - If you cannot write this test, log the reason in `CURRENT.md` before continuing

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
