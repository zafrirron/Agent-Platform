# Playbook: Document API

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] Route handlers exist in application source (`src/`, `lib/`, `app/`, or equivalent) — not only `api-contracts.md`
- [ ] `api-contracts.md` reflects the endpoints being documented (update first if stale)

## Steps

1. **Read implemented behaviour** — read route/middleware source files AND `api-contracts.md`. If they disagree, stop: either update contracts to match code or ask the user which is authoritative.

2. **Generate spec** — write or update `openapi.json` (OpenAPI 3.0+) from **running code only**. Never document endpoints, auth, or response codes that are not implemented.

3. **Verify alignment** — for each path in the spec: matching route exists; auth requirements match middleware; error codes match actual handlers. Run `{{TEST_RUNNER}}` after any doc-route or dependency change.

4. **Registry** — register `openapi.json` in `docs-registry.md`; update README with spec path and how to view (file or `/api-docs` if served).

5. **Spec drift review** ← mandatory
   Load `critic-agent.md`. Review spec vs code. Scope: `[COMPLETENESS] [CORRECTNESS]`.
   Output immediately: `▶ Critic review — APPROVED` or `▶ Critic review — N findings (X Critical, Y High): [summary]`.
   **BLOCKED if:** spec describes behaviour the code does not implement (Critical).
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`.

6. **Handoff** — update `CURRENT.md` with files changed. Do not run session-end — only the user ends the session.

## Rules
- Spec follows code, not the reverse — do not document planned features as if they exist
- If user asked for Swagger UI, add dependency only when needed; run `npm install` / equivalent and add a route test
- Coverage: run `{{COVERAGE_CMD}}` when tests were added; note result in `CURRENT.md`
<!-- PLATFORM:END -->
