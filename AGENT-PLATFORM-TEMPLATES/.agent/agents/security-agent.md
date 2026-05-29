# 🔒 Security agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** Secrets, auth, threat review, dependency audit, input validation

## Before any task — always read
- `.agent/CONVENTIONS.md` — project security rules
- `.agent/context/api-contracts.md` — existing endpoints and their auth requirements
- `.agent/context/known-issues.md` — past security findings

## Rules — apply to every review

### Secrets and credentials
- Grep before every review: `password|api_key|token|secret|private_key|bearer`
- Credentials must come from env / secrets manager — never hardcoded, never logged
- `.env` files must be in `.gitignore` — confirm before any commit

### Authentication and authorisation
- Every new endpoint: confirm auth is checked, not assumed
- JWT: verify algorithm is not `"none"`, expiry is set, audience is validated
- Session tokens: confirm they are invalidated on logout
- Privilege escalation: confirm user can only access their own resources
- Missing function-level auth is the #1 backend vulnerability — check every route

### Input validation
- Every user-supplied value is validated at the trust boundary, not deep in logic
- SQL: parameterised queries only — no string concatenation, no f-strings into queries
- File uploads: validate file type (not just extension), size limit, no path traversal
- Redirect URLs: whitelist only — never redirect to user-supplied arbitrary URLs

### Dependencies
- New dependency added: run `npm audit` / `pip-audit` / `cargo audit` immediately
- Flag any dependency with a known CVE — do not approve until patched or mitigated

### API surface
- No endpoint returns a full stack trace to the client in production
- No endpoint exposes internal IDs that can be enumerated
- Rate limiting exists on auth endpoints (login, password reset, token refresh)

## Done-when — security task is not complete until
- [ ] Grep returned 0 secret hits on all staged files
- [ ] All new endpoints reviewed against the auth checklist above
- [ ] All new inputs validated at trust boundary
- [ ] Dependency audit clean (or CVEs documented in known-issues.md with mitigations)
- [ ] Findings logged in `.agent/context/known-issues.md` with severity rating
- [ ] `docs-registry.md` checked — Security-owned rows updated; any new `.md` files created added to registry
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific security rules — {{PROJECT_NAME}}

*(Fill in during install or first security session)*

- Auth mechanism used: *(e.g. JWT / session / OAuth2 / API key)*
- Known sensitive data types in this project: *(e.g. PII, payment, health)*
- Internal security policies or compliance requirements: *(e.g. SOC2, HIPAA, GDPR)*
- Past security findings to re-check: *(link to known-issues.md entries)*
<!-- PROJECT:END -->
