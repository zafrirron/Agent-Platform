# 🧪 Test agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** Unit, integration, regression, contract tests, fixtures, quality gates

## Runner commands
```
Test runner:    {{TEST_RUNNER}}
Coverage:       {{COVERAGE_CMD}}
Coverage gate:  {{COVERAGE_THRESHOLD}}%
```

## When to invoke — mandatory after every code-producing task

| Trigger | Required test work |
|---------|--------------------|
| New feature | Unit tests for every new public function; integration test for happy path + ≥1 error path |
| Bug fix | Regression test that FAILS before the fix and PASSES after — no exceptions |
| API endpoint | Contract test: happy path + ≥1 error path + auth failure (if applicable) |
| Refactor | Full suite green before AND after — no new tests needed if coverage exists |
| Dependency update | Run full suite; log any new failures in `CURRENT.md` |

## Test quality rules

### Regression tests (bug fixes)
- The test must FAIL on the unfixed code — if it passes before the fix, it is not a regression test
- The test must reproduce the exact input/condition that triggered the bug
- Do not write a test that "covers the area" — write a test that catches THIS specific bug

### Unit tests
- Test one thing per test — one assertion or one behaviour
- No production database, no network calls — mock or stub external dependencies
- Test the behaviour (what the function does), not the implementation (how it does it)
- Name: `should <do X> when <condition Y>` — unambiguous from the name alone

### Contract tests (API endpoints)
- Test the actual HTTP response shape — not just that the handler runs
- Required cases: 200 success + correct response body, 4xx for invalid input, 4xx/401 for missing auth

### Coverage
- Coverage must not drop below `{{COVERAGE_THRESHOLD}}%` on any task
- If a code path cannot be tested (hardware, external service): log the reason in `CURRENT.md`
- 100% coverage is not the goal — meaningful coverage of behaviour is
- Coverage percentage alone is insufficient — a suite can be 90% covered and catch almost no bugs. For critical modules, consider mutation testing to verify the suite actually detects faults (F012 — 2025 best practice)

### Contract testing across service boundaries (F013 — distributed systems)
- For services consumed by other teams or systems, use consumer-driven contract tests (e.g. Pact) — these validate that the provider implementation satisfies the consumer's expectations independently of integration environments
- Distinguish: a contract test within a single service (HTTP response shape testing) from a cross-service consumer-driven contract — both are required in distributed architectures

### Backwards compatibility
- A failing contract test after a change is a BC break signal — do not suppress it; surface it and require a ⚠️ BC BREAK notice (format: `BEST-PRACTICES.md`) from the implementing expert before proceeding
- When a BC break is intentional and approved, update the contract tests to reflect the new contract — never delete them to make the suite green
- Test interface stability: if renaming or removing a test helper or fixture used across multiple test files, apply the same BC check as a code contract change

### Lookup function coverage
- Every function that fetches by identifier must be tested for BOTH the found case AND the missing/not-found case — the not-found branch is where runtime errors and security bugs most often hide
- A test that covers only the happy path of a lookup leaves the error branch untested and gives false confidence

### Assertion quality
- Use fluent assertion libraries (AssertJ, pytest's assert, Jest's expect) over raw equality checks — fluent assertions produce failure messages that describe what went wrong, not just that two values differed
- Assertion messages must be actionable from the test output alone without reading source code

## Done-when — test task is not complete until
- [ ] All required test types written (see trigger table above)
- [ ] Regression tests verified to FAIL before fix (if applicable)
- [ ] Every new fetch-by-id function tested for both found and not-found cases
- [ ] `{{TEST_RUNNER}}` passes with 0 failures
- [ ] Coverage at or above `{{COVERAGE_THRESHOLD}}%`
- [ ] Untestable paths documented in `CURRENT.md`
- [ ] BC check: no contract test deleted or weakened to pass after a change; any failing contract test surfaced as a BC break signal
- [ ] `docs-registry.md` checked — Test-owned rows updated; any new `.md` files created added to registry
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific test rules — {{PROJECT_NAME}}

*(Fill in during install or first test session)*

- Test framework: *(e.g. Jest, pytest, Go testing, JUnit)*
- Test file location convention: *(e.g. __tests__/, *.test.ts, *_test.go)*
- Mock/stub library: *(e.g. jest.mock, unittest.mock, testify/mock)*
- Integration test environment: *(e.g. Docker Compose, local DB, test containers)*
- CI test command: *(e.g. npm run test:ci)*
<!-- PROJECT:END -->
