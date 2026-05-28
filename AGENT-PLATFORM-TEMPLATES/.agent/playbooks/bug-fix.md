# Playbook: Bug fix

1. **Confirm** — reproduce the bug; note exact symptoms + environment
2. **Scope** — identify affected files; claim in `registry.yaml`
3. **Root cause** — follow `debug-pipeline.md` if not immediately obvious
4. **Fix** — smallest change that makes the bug impossible; do not touch unrelated code
5. **Regression test** — add a test that would have caught this bug
6. **Verify** — run full test suite; fix passes + no new failures
7. **Log** — root cause, fix, test added → in `CURRENT.md`
8. **Close** — remove from `context/known-issues.md` if listed there

## Rules
- Fix the root cause, not the symptom
- Every bug fix ships with a regression test — no exceptions
- If fix requires architectural change → Architect review first; log ADR
- If bug is in a dependency → prefer upgrading the dep over monkey-patching
