# Agent Platform — Test Runner Setup

> Called by session-start when `test_runner` is still a placeholder.
> After completing this, write values to `platform.json` and `CONVENTIONS.md`, then return to the session-start sequence.

---

## Phase A — Auto-detect from project files

Scan the project root for these files:

| File found | test_runner | coverage_cmd |
|-----------|-------------|--------------|
| `package.json` with `"jest"` in scripts or devDeps | `npx jest` | `npx jest --coverage` |
| `package.json` with `"vitest"` in scripts or devDeps | `npx vitest run` | `npx vitest run --coverage` |
| `package.json` with `"mocha"` in scripts or devDeps | `npx mocha` | `npx nyc mocha` |
| `package.json` with any `test` script | `npm test` | `npm test -- --coverage` |
| `pyproject.toml` or `pytest.ini` or `setup.cfg` | `pytest` | `pytest --cov` |
| `go.mod` | `go test ./...` | `go test -cover ./...` |
| `Cargo.toml` | `cargo test` | `cargo tarpaulin` |
| `.csproj` or `.sln` | `dotnet test` | `dotnet test /p:CollectCoverage=true` |
| `Makefile` with a `test` target | `make test` | `make coverage` |

If detected:
1. Write `test_runner` and `coverage_cmd` to `.agent/platform.json`
2. Update `.agent/CONVENTIONS.md` `## Testing` section with the real values
3. Confirm: `"✅ Test runner auto-detected: <command>"`
4. Return to session-start — continue with Step 3

---

## Phase B — Ask if detection failed

If no stack detected, ask:

> "I couldn't detect a test runner. Does this project have tests set up?
> - **Yes** — tell me the language/framework (Jest, pytest, Go, .NET…)
> - **No** — I can help set one up. What language is this project in?"

**If Yes:** configure from their answer using the table above.

**If No — offer to set one up:**

| Language | Offer |
|---------|-------|
| JavaScript/TypeScript | "I'll add Jest. Run: `npm install --save-dev jest` then I'll create a sample test." |
| Python | "I'll set up pytest. Run: `pip install pytest pytest-cov` then I'll create a sample test." |
| Go | "Go has built-in testing. I'll create a `_test.go` file to get started." |
| Other | Ask what testing framework they prefer |

After setup, write values to `.agent/platform.json` and `.agent/CONVENTIONS.md`, then return to session-start.
