# Playbook: Security audit

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] User requested security review, audit, or OWASP check — not feature implementation
- [ ] Read `.agent/context/known-issues.md` and `.agent/context/api-contracts.md`

## Steps

1. **Activate Security expert** — load `security-agent.md` in full. Apply ALL OWASP/CWE rules from the expert file (primary authority).

2. **Scope declaration** — output immediately:
   `▶ Security gate — security audit: [target: whole codebase / files: list]`

3. **Secrets scan** — grep for `password|api_key|token|secret|private_key|bearer` in source (exclude `node_modules`, vendor). Flag hardcoded values: **Critical**.

4. **Dependency CVE scan** — run `npm audit` / `pip-audit` / `cargo audit` / equivalent. Report High/Critical CVEs: **BLOCKED** until patched or mitigated with documented exception.

5. **Auth & authz** — every endpoint: auth required? Property-level auth? Mass-assignment allowlists on PATCH/PUT? Missing route-level auth: **High**.

6. **Input validation** — user input at trust boundaries (HTTP body, query, headers, uploads, LLM output): validated/sanitised? Injection paths (SQL, shell, path traversal, SSRF): **High/Critical**.

7. **Data exposure** — stack traces, internal IDs, PII in logs or error responses? **High**.

8. **OWASP API Top 10 pass** — map findings to API1–API10 categories; note coverage gaps.

9. **Critic review** ← mandatory for audit deliverable
   Load `critic-agent.md`. Scope: `[SECURITY] [COMPLETENESS] [CORRECTNESS]`
   Output: `▶ Critic review — APPROVED` or `▶ Critic review — N findings (X Critical, Y High): [summary]`
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`

10. **Report** — severity-ordered findings table (Critical → High → Medium → Low). Do not fix code unless user asks — findings first.

11. **Handoff** — update `CURRENT.md` and `known-issues.md` for Critical/High items. Do not run session-end.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "I'll fix Critical findings silently" | Report findings first — user decides fix scope in audit playbook. |
| "npm audit failed — skip CVE step" | Step 4 is mandatory — High/Critical CVEs block until patched or documented. |
| "Auth looks fine from the handler" | Step 5 checks every endpoint — missing route auth is High severity. |
| "Critic is redundant after OWASP pass" | Step 9 is mandatory — Critic catches completeness gaps in the audit deliverable. |

## Rules
- Audit is read-only on code unless user explicitly requests fixes in the same session
- See `.agent/references/security-checklist.md` for pre-merge spot-checks
- Re-use Phase 3 checklist from `audit.md` as minimum floor; security-agent.md is the ceiling
- LLM/agentic features: include F008/F015 prompt-injection checks
<!-- PLATFORM:END -->
