# Coding conventions — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
## General

- Smallest correct diff — never change more than the task requires
- Match existing style in each file touched; don't impose a new style
- Comments only for non-obvious logic; let naming do the work
- Prefer editing existing files over creating new ones
- Prefer existing utilities / stdlib over adding a new dependency

## Agent behaviour

- Claim files in `registry.yaml` before large edits
- Update `CURRENT.md` at every session end
- Commits only when user explicitly asks
- No drive-by refactors — note them in `CURRENT.md`, fix separately
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
- Commit message: `type(scope): description` ≤72 chars
- Never commit: `.env`, `node_modules`, `bin/`, `obj/`, build artifacts, secrets

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
