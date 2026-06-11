# Reference: Security checklist

> Condensed from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) `references/security-checklist.md` (MIT). Use at Security gate and `security-audit` playbook.

## Pre-commit / pre-merge
- [ ] No secrets in code, config, or logs (`password`, `api_key`, `token`, `private_key` grep clean)
- [ ] Dependencies scanned — zero open Critical CVE; High CVEs patched or documented exception
- [ ] Auth enforced on every new/changed endpoint
- [ ] Input validated at entry point — not deep in call stack

## Auth & access
- [ ] JWT: algorithm validated; never `alg: none`
- [ ] RBAC checked server-side — not UI-only
- [ ] Session/token expiry and revocation documented

## Input & output
- [ ] Parameterised queries only — no SQL string concat
- [ ] File uploads: type, size, path validated
- [ ] Error responses: no stack traces or internal paths to clients
- [ ] PII/secrets never logged

## Headers & transport
- [ ] HTTPS in production; HSTS where applicable
- [ ] CORS allowlist explicit — not `*` with credentials
- [ ] Security headers on web surfaces (CSP, X-Frame-Options as appropriate)

## OWASP API Top 10 (spot-check)
- [ ] BOLA/IDOR: object access scoped to authenticated owner
- [ ] Mass assignment: allowlist fields on create/update
- [ ] Rate limiting on auth and expensive endpoints

## Evidence
- Security gate output: `▶ Security gate — reviewing [files]`
- Findings logged by severity; zero Critical/High before handoff
