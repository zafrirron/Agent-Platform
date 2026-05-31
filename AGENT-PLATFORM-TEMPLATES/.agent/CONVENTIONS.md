# Coding conventions — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
## General

- Smallest correct diff — never change more than the task requires
- Match existing style in each file touched; don't impose a new style
- Comments only for non-obvious logic; let naming do the work
- Prefer editing existing files over creating new ones
- Prefer existing utilities / stdlib over adding a new dependency
- Mark every temporary implementation (stub, in-memory stand-in, hardcoded shortcut) with a TODO comment: what it is, why it exists, and what replaces it
- Prefer constructor injection for dependencies over field or annotation-based injection — constructor injection makes dependencies explicit, enables immutability, and keeps classes testable without a container
- Use structured log calls with format args — never string concatenation in log statements (`log.info("user {} updated {}", userId, id)` not `"user " + userId`); concatenation executes unconditionally regardless of log level

## Agent behaviour

- Claim files in `registry.yaml` before large edits
- Update `CURRENT.md` at every session end
- Commits only when user explicitly asks
- Before any task that touches a module or service, read that module's context docs (README, architecture overview, api-contracts) before writing code
- No drive-by refactors — note them in `CURRENT.md`, fix separately
- Technical shortcuts taken under time pressure must be marked with TODO in the code at the point of the shortcut — not only in `CURRENT.md`
- Ask before irreversible actions (delete, rename, schema drop, API break)
- Surface blockers after 2 failed attempts; don't loop silently

## Testing

- **Every bug fix** ships with a regression test — no exceptions
- **Every new public function or module** gets at least one unit test before done
- **Every new API endpoint** gets at least one contract test (happy path + error path)
- Tests assert behaviour, not implementation — test what it does, not how
- `untested = unfinished` — do not mark done if new code has no test coverage
- Run `{{TEST_RUNNER}}` before every handoff — red suite blocks handoff
- Coverage must not drop below `{{COVERAGE_THRESHOLD}}%`

```
Test runner:    {{TEST_RUNNER}}
Coverage cmd:   {{COVERAGE_CMD}}
Coverage gate:  {{COVERAGE_THRESHOLD}}%
```

## Git

- Branch before large changes (if on main/master)
- One logical change per commit
- Commit subject line: `type(scope): description` ≤50 chars; add a body (after a blank line) when "why" is not obvious
- Commit body explains WHY the change was made — the diff shows what; the body must capture the reasoning that future maintainers cannot recover from the code alone
- Never commit: `.env`, `node_modules`, `bin/`, `obj/`, build artifacts, secrets

## Error handling

- Never swallow exceptions silently — catch, log with identifying context (entity id, operation name), then rethrow or handle explicitly; an empty or logging-only catch block is always a bug unless the silence is intentional and documented
- Return empty collections instead of null from list-returning functions — null-returning list functions push null checks onto every caller
- Model absent values explicitly: use the language's nullable wrapper type (Optional, Maybe, T | null) for lookups that may not exist; for required lookups, use the language's throw-on-absent idiom directly rather than a manual two-step presence check and get

## Security

- No credentials, tokens, or keys in source — ever
- Grep before committing: `password|api_key|token|secret|private_key`
- Input validated at all trust boundaries — not deep in call stack
- Parameterised queries only — no string-concatenated SQL
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific conventions — {{PROJECT_NAME}}

*(Agent: fill from codebase scan during install — or fill manually)*

### Stack
- Language: *(e.g. TypeScript, Python, Go)*
- Framework: *(e.g. Express, FastAPI, Gin)*
- Test runner: *(already set above — confirm matches)*

### Naming
- Files: *(e.g. kebab-case, snake_case, PascalCase)*
- Functions: *(e.g. camelCase, snake_case)*
- Database tables: *(e.g. snake_case plural)*

### Code style
- Linter: *(e.g. ESLint, Ruff, golangci-lint)* — command: *(e.g. npm run lint)*
- Formatter: *(e.g. Prettier, Black, gofmt)* — command: *(e.g. npm run format)*
- Max line length: *(e.g. 100)*

### Team rules
*(Add your team's specific rules here — code review requirements, PR size limits, etc.)*
<!-- PROJECT:END -->
