# Playbook: API integration

**Experts:** Backend · Test · Security

## Steps

1. Claim scope in `registry.yaml`
2. Update `.agent/context/api-contracts.md` (schema-first)
3. Add `.agent/context/api-patterns.md` rules to design
4. Mock → stub → real upstream
5. Implement with structured errors + auth from env
6. **Test agent:** contract test per documented endpoint (happy path + at least one error path); run `{{TEST_RUNNER}}`; all green
7. Update `api-contracts.md` with confirmed behavior
8. Security agent: no secrets in source
9. Update `CURRENT.md` with outcome, endpoints added, and next agent recommendation. Do NOT run session-end — only the user ends the session.

## Rules
- No endpoint ships without a contract test
- Tests must cover: success response shape, at least one 4xx, at least one auth failure (if applicable)
- If upstream is unavailable, mock it and document the mock in `CURRENT.md`
- **BC check:** if the integration modifies an existing endpoint contract (path, method, response shape, required params), output a ⚠️ BC BREAK notice (format: `BEST-PRACTICES.md`) and wait for explicit user approval before implementing the change
