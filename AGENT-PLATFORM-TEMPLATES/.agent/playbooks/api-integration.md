# Playbook: API integration

**Experts:** Backend · Test · Security

## Steps

1. Claim scope in `registry.yaml`
2. Update `.agent/context/api-contracts.md` (schema-first)
3. Add `.agent/context/api-patterns.md` rules to design
4. Mock → stub → real upstream
5. Implement with structured errors + auth from env
6. Contract tests + update `api-contracts.md`
7. Security agent: no secrets in source
8. Session end + handoff
