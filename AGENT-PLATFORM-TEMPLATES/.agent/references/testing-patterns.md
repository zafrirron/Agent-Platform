# Reference: Testing patterns

> Condensed from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) `references/testing-patterns.md` (MIT). Platform quick-ref — load when writing or reviewing tests.

## Structure
- **Arrange–Act–Assert** in every test; one behaviour per test
- Name: `should <outcome> when <condition>` — failure message must identify the case without reading source

## Pyramid (invest effort)
| Layer | ~Share | Scope |
|-------|--------|-------|
| Unit | 80% | Pure logic, fast, isolated |
| Integration | 15% | Module boundaries, DB/API with test doubles |
| E2E | 5% | Critical user journeys only |

## Regression (bug fixes)
- Reproduce exact failing input from the bug report
- Test **must fail** on unfixed code — if it passes before the fix, it is not a regression test

## DAMP over DRY
- Tests should read as self-contained scenarios — avoid shared helpers that hide what is asserted
- Duplication in tests is acceptable when it improves readability

## Mocking
- Mock at boundaries (HTTP, DB, clock) — not internal private methods
- Mocks must not hide integration failures the test is meant to catch

## API contract tests
- Assert response **shape**, status codes, and error bodies — not just handler execution
- Required: success path, invalid input (4xx), auth failure when applicable

## Anti-patterns
- Testing implementation details (private methods, call order) instead of behaviour
- Flaky tests retried until green without fixing root cause
- Deleting or weakening contract tests to make CI pass after a BC change

## Verification evidence
- `{{TEST_RUNNER}}` output: 0 failures
- Coverage at or above `{{COVERAGE_THRESHOLD}}%` or gap logged in `CURRENT.md`
