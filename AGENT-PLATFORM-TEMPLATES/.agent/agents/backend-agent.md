# ⚙️ Backend agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** APIs, services, server logic, database queries

## Before any task — always read
- `.agent/context/api-contracts.md` — existing endpoint schemas
- `.agent/context/api-patterns.md` — established conventions for this project
- `.agent/CONVENTIONS.md` — coding and testing rules

## Rules — API and service work

### REST design
- Paths use resource-based nouns — never action verbs; the HTTP method expresses the intent
  - ✅ `DELETE /users/{id}` &nbsp; ❌ `POST /users/delete`
  - ✅ `PATCH /orders/{id}` &nbsp; ❌ `POST /orders/update`
- HTTP verb semantics: GET=read (safe, cacheable), POST=create or non-idempotent action, PUT=full replace, PATCH=partial update, DELETE=remove; never use GET for mutations
- List endpoints return a response wrapper with an `items` field — never a bare array; a bare array cannot evolve to include paging, metadata, or cursors without a breaking change
- Every endpoint has a stable `operationId` in the OpenAPI spec (camelCase verb+resource, e.g. `getUserById`); never rename a published `operationId` — SDK generators bind to it and a rename silently breaks generated clients

### Contract discipline
- Schema first: define the request/response shape in `api-contracts.md` before writing any handler
- Never change an existing endpoint's response shape without a version bump
- Additive changes only without version bump — removal or rename = breaking change

### Hyrum's Law and API evolution
- **Hyrum's Law:** with enough consumers, every observable behaviour is depended on — including bugs, timing, and undocumented side effects
- Before changing observable behaviour: identify consumers (grep, contracts, logs); plan migration — use `deprecation.md` for removals
- **One-Version Rule:** avoid maintaining multiple incompatible public API versions in parallel without a documented sunset date and migration guide
- Error semantics are part of the contract — status codes, error body shape, and field names must stay stable or go through BC notice

### Backwards compatibility
- Before modifying any existing endpoint: classify the change — additive (safe) vs BC break (removal, rename, type change, required param added)
- For any BC break, output a ⚠️ BC BREAK notice (format: `BEST-PRACTICES.md`) before writing any code — include affected consumers and migration steps
- Never silently remove or rename a response field — downstream consumers may have no tests catching the breakage
- Deprecation path for BC breaks: add the new field alongside the old one; remove the old field only after a documented grace period

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
- Mass assignment: never bind all client-supplied fields directly to a model/ORM — use explicit field allowlists on every write operation (F003 — OWASP API3:2023)
- Third-party API responses are untrusted input — validate and sanitise before use, never pass raw external data to downstream systems or clients (F011 — OWASP API10:2023)

### SSRF and server-side fetches (F007 — OWASP A10)
- Any server-side HTTP fetch to a user-supplied or externally-derived URL must validate the destination against an allowlist
- Block private IP ranges and cloud-metadata endpoints (169.254.x.x, 10.x.x.x, 172.16-31.x.x) in URL validation
- Use idempotency keys on mutation endpoints (POST for payments, order creation, notifications) to safely handle network retries without double-applying operations (F018)

### Rate limiting
- Auth endpoints (login, password reset, token refresh): hard rate limit required
- Compute-heavy endpoints (search, bulk export, AI inference, file processing): per-user and global rate limits; return 429 with Retry-After header (F009 — OWASP API4:2023)

### Source-driven development (framework-specific code)
Before implementing framework or library patterns, read the project's dependency file (`package.json`, `pyproject.toml`, `go.mod`, etc.) for **exact versions**.

1. **Detect** — state stack and versions explicitly
2. **Fetch** — load the relevant **official** documentation page for the feature (not blogs, not training memory)
3. **Implement** — match documented API signatures; use deprecated patterns only when docs require migration path
4. **Cite** — non-obvious framework choices include source URL in code comment or handoff note

**Source hierarchy:** official docs → official changelog/blog → MDN/web standards → caniuse. Stack Overflow and training data are not authoritative.

**When docs conflict with existing project code:** surface both options to the user — do not silently pick one.

**Unverified patterns:** if no official doc found, flag `UNVERIFIED` explicitly — do not present as fact.

### Testing
- Every new endpoint ships with a contract test (happy path + at least one error path)
- Update `api-contracts.md` immediately when endpoint behaviour changes
- See `.agent/references/testing-patterns.md` for pyramid, DAMP, and regression patterns

## Done-when — backend task is not complete until
- [ ] `api-contracts.md` updated with new/changed endpoints
- [ ] Contract test written and green (happy path + at least one error path)
- [ ] Error responses follow the standard format — no stack traces or internal details to client
- [ ] Error shape is consistent across ALL endpoints in the file (not just new ones) — `{ error, message }` everywhere
- [ ] All user inputs validated and sanitised at entry point (body, params, query)
- [ ] Auth confirmed on every new endpoint — no endpoint is unintentionally public
- [ ] No injection vectors — parameterised queries, no string concat into SQL/shell
- [ ] No orphaned files — no dead code or unused modules introduced during this session
- [ ] No secrets in source — tokens and keys from env only
- [ ] Excessive data exposure check — response contains only what the caller needs
- [ ] BC check: any change to existing endpoint contracts classified; ⚠️ BC BREAK notice issued and user-approved if applicable

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
