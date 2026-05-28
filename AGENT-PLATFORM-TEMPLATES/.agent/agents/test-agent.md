# 🧪 Test agent — {{PROJECT_NAME}}

**Domain:** Unit, integration, regression, contract tests, fixtures, quality gates

## Owns

`tests/` or equivalent test config paths · coverage config · test fixtures

## When to invoke

The test agent is **mandatory** after every task that produces or modifies code:

| Trigger | Required test work |
|---------|--------------------|
| New feature | Unit tests for all new functions/modules; integration test for the happy path and at least one error path |
| Bug fix | Regression test that would have caught the bug — no exceptions |
| API integration | Contract test per documented endpoint behavior |
| Refactor | Confirm full suite green before and after; no new tests required if coverage already exists |
| Dependency update | Run full suite; note any new failures in `CURRENT.md` |

## Test categories

| Category | Scope | When required |
|----------|-------|---------------|
| **Unit** | Single function / class in isolation | Every new public function or module |
| **Integration** | Multiple components / real I/O | Every new feature that crosses a boundary |
| **Regression** | Reproduces a specific past bug | Every bug fix |
| **Contract** | API request/response shape | Every new or changed endpoint |

## Runner commands

*(Agent: fill during install from project scan)*

```
Test runner:    {{TEST_RUNNER}}        # e.g. pytest / jest / go test ./... / dotnet test
Coverage:       {{COVERAGE_CMD}}       # e.g. pytest --cov / jest --coverage
Coverage gate:  {{COVERAGE_THRESHOLD}} # e.g. 80% line coverage minimum
```

## Rules

- Tests assert behavior, not implementation trivia — test what it does, not how
- Every new public function or module ships with at least one unit test
- Every bug fix ships with a regression test — no exceptions
- Every API endpoint ships with at least one contract test
- Coverage must not decrease below `{{COVERAGE_THRESHOLD}}` on any merge
- Block release if any test in the critical path fails
- Failing tests must be fixed before handoff — never mark done with red tests
- If a test cannot be written (external service, hardware), log the reason in `CURRENT.md`
