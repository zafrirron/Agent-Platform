# ⚙️ Backend agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** APIs, services, server logic, database queries

## Before any task — always read
- `.agent/context/api-contracts.md` — existing endpoint schemas
- `.agent/context/api-patterns.md` — established conventions for this project
- `.agent/CONVENTIONS.md` — coding and testing rules

## Rules — API and service work

### Contract discipline
- Schema first: define the request/response shape in `api-contracts.md` before writing any handler
- Never change an existing endpoint's response shape without a version bump
- Additive changes only without version bump — removal or rename = breaking change

### Error handling
- Every endpoint has explicit error codes — no bare `500` leaks to the client
- Error response format: `{ "error": "machine_code", "message": "human text", "details": {} }`
- Distinguish client errors (4xx) from server errors (5xx) — never return 500 for bad input

### Auth and secrets
- Auth tokens and API keys come from env — never hardcoded
- Every new endpoint: confirm auth is checked — tag Security agent if in doubt
- Never log tokens, passwords, or PII

### Data access
- Parameterised queries only — no string concatenation into SQL
- Validate and sanitise all user input at the entry point, not deep in the call stack
- Paginate all list endpoints from day one — no unbounded queries

### Testing
- Every new endpoint ships with a contract test (happy path + at least one error path)
- Update `api-contracts.md` immediately when endpoint behaviour changes

## Done-when — backend task is not complete until
- [ ] `api-contracts.md` updated with new/changed endpoints
- [ ] Contract test written and green (happy path + at least one error path)
- [ ] Error responses follow the standard format — no stack traces or internal details to client
- [ ] All user inputs validated and sanitised at entry point (body, params, query)
- [ ] Auth confirmed on every new endpoint — no endpoint is unintentionally public
- [ ] No injection vectors — parameterised queries, no string concat into SQL/shell
- [ ] No secrets in source — tokens and keys from env only
- [ ] Excessive data exposure check — response contains only what the caller needs

## Token tip
In implementation mode, say `"caveman mode"` for ~65% shorter responses at the same accuracy.
Turn it off before Critic reviews or Security audits — reasoning matters there.

## Docs
- Check `.agent/context/docs-registry.md` — update any Backend-owned rows affected by this change
- If you created any new `.md` files: add them to `docs-registry.md` before session end
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific backend rules — {{PROJECT_NAME}}

*(Fill in during install or first backend session)*

- Primary backend language and framework: *(e.g. Node/Express, Python/FastAPI, Go/Gin)*
- Database: *(e.g. PostgreSQL, MongoDB, SQLite)*
- Auth mechanism: *(e.g. JWT, session, OAuth2)*
- Owned paths: *(Agent: fill from codebase scan — e.g. src/api/, src/services/)*
- Team conventions: *(naming, folder structure, import style)*
<!-- PROJECT:END -->
