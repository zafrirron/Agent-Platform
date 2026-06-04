# Coding conventions — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
## General

- Smallest correct diff — never change more than the task requires
- Match existing style in each file touched; don't impose a new style
- Comments only for non-obvious logic; let naming do the work
- Prefer editing existing files over creating new ones
- Prefer existing utilities / stdlib over adding a new dependency
- Mark every temporary implementation (stub, in-memory stand-in, hardcoded shortcut) with a TODO comment: what it is, why it exists, and what replaces it
- Never mask errors with silent fallbacks, default returns, or empty catch blocks — surface failures and fix the root cause; a fallback that hides an error is worse than no fallback
- Do not delete existing comments unless you are deleting the code they belong to — comments represent intent and context that cannot be recovered from the code alone
- Prefer constructor injection for dependencies over field or annotation-based injection — constructor injection makes dependencies explicit, enables immutability, and keeps classes testable without a container
- Use structured log calls with format args — never string concatenation in log statements (`log.info("user {} updated {}", userId, id)` not `"user " + userId`); concatenation executes unconditionally regardless of log level

## Agent behaviour

- **Design before code — always:** before writing any production code, present a design at the correct depth tier (trivial → 1 sentence; small → 2-3 sentences; medium → written design; large → architect review + ADR) and wait for explicit user confirmation; silence does not count as approval
- Claim files in `registry.yaml` before large edits
- Update `CURRENT.md` at every session end
- Commits only when user explicitly asks
- Before any task that touches a module or service, read that module's context docs (README, architecture overview, api-contracts) before writing code
- Before implementing a non-trivial solution, check `.agent/context/patterns.md` — a prior session may have already solved a similar problem in this codebase
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
- One logical change per commit; behavior-preserving refactors must be in separate commits from feature or bug-fix changes — mixing both makes review and bisect impossible
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

## Code structure & modularity

- **File size:** a file exceeding 400 lines is a signal it is doing too much — split into smaller, focused modules; never exceed 800 lines without a documented reason
- **Single responsibility:** each file, class, or module has one reason to change; if you cannot describe its purpose in one sentence without "and", split it
- **DRY (Don't Repeat Yourself):** if the same logic appears in two places, extract it; three or more occurrences of the same pattern require a shared abstraction — no copy-paste blocks
- **No magic numbers or strings:** named constants for every value that has business meaning (e.g. `MAX_RETRIES = 3`, not `3`); hard-coded values make intent invisible and changes dangerous
- **Function focus:** each function does one thing and does it well; a function that requires more than ~20 lines to explain its single purpose should be decomposed
- **Folder structure:** use predictable, standard names (`src/`, `tests/`, `docs/`, `config/`, `scripts/`); organise by feature/module as the project grows — never by file type alone (e.g. prefer `user/` over a flat `controllers/` + `models/` split)
- **Linting gate:** linting must pass before any code is merged; lint failures are treated as build failures — not style suggestions

## Branching & version control

- **Strategy:** use trunk-based development for teams ≤5; use Gitflow (main + develop + feature/*) for larger teams or release-gated projects — document the chosen strategy in `.agent/WORKFLOWS.md`
- **Branch naming:** `feature/<ticket-or-description>`, `fix/<description>`, `chore/<description>`; no personal or random names
- **PR/MR size:** keep changes reviewable — aim for <400 lines changed per PR; large changes must be split into stacked PRs with a documented dependency order
- **Never force-push to main/master** — use revert commits instead
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
