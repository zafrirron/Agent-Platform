# Platform Improvements Log

> Every platform rule traces back to a real failure. This file is that record.
> Log every improvement here before shipping it. Do not add rules without a log entry.

---

## Format

```
### [vX.Y.Z] — YYYY-MM-DD — <one-line description>

**Failure observed:** What went wrong in a real or simulated scenario.
**File changed:** Which template file was updated.
**Rule added:** The exact rule or done-when item.
**Validated:** Yes / No / Pending — did this rule actually prevent the failure in testing?
```

---

### [2.22.0] — 2026-05-30 — Web audit: 15 OWASP/CWE/best-practice gaps closed across 6 expert agents

**Source:** Mode 2 web ecosystem audit against OWASP Top 10 (2021), OWASP API Security Top 10 (2023), CWE Top 25 (2024), OWASP LLM Top 10 (2025), industry best-practice searches.

**Files changed:** `security-agent.md`, `backend-agent.md`, `frontend-agent.md`, `devops-agent.md`, `test-agent.md`, `architect-agent.md`

**Rules added (15):**
- F001: TLS enforcement, encryption at rest, no tokens in browser storage (security-agent, frontend-agent)
- F002: Threat modelling as mandatory design-time step for auth/payment/bulk features (security-agent, architect-agent)
- F003: Property-level auth and mass-assignment allowlists (security-agent, backend-agent)
- F004: CSRF prevention — SameSite cookies, CSRF tokens, Origin/Referer validation (security-agent, frontend-agent)
- F005: Security audit logging — structured logs for auth failures, access denials, privilege changes (security-agent)
- F006: SBOM generation, artifact signing, dependency hash pinning (devops-agent)
- F007: SSRF prevention — URL allowlisting, private IP blocking for server-side fetches (security-agent, backend-agent)
- F008: LLM/prompt injection defence — indirect injection, least-privilege tool grants, system-prompt protection (security-agent)
- F009: Rate limiting extended to compute-heavy endpoints, not just auth (security-agent, backend-agent)
- F010: Deprecated/shadow API inventory and decommission timelines (security-agent, devops-agent)
- F011: Third-party API responses treated as untrusted input (backend-agent)
- F012: Mutation testing as supplement to coverage % for critical modules (test-agent)
- F013: Consumer-driven contract testing across service boundaries (test-agent)
- F014: CI runner OIDC short-lived credentials, isolated build environments, branch protection (devops-agent)
- F015: LLM output validation, system-prompt leakage prevention (security-agent)

**Validated:** Pending — E2E test with security audit playbook

---

## Log

### [v2.10.0] — 2026-05-29 — Critic agent + adversarial review in playbooks

**Failure observed:** Implementing agents approve their own work. A single agent writing AND reviewing has a blind spot — it reviews based on its own assumptions and misses edge cases, security implications, and test quality issues it introduced.
**Files changed:**
- `AGENT-PLATFORM-TEMPLATES/.agent/agents/critic-agent.md` (new)
- `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/bug-fix.md` (Step 5b added)
- `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/release.md` (Step 1b added)
- `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/add-feature.md` (Step 5b added)
**Rule added:** Critic agent with 6-dimension review (correctness, security, test quality, completeness, design, edge cases). Severity levels Critical/High/Medium/Low. Critical/High findings block task completion. Built into 3 playbooks as mandatory gates.
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Backend agent done-when gate for api-contracts.md

**Failure observed:** Backend agent shipped an endpoint without updating api-contracts.md. Downstream agents (Docs, Frontend) then worked from stale contracts.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/agents/backend-agent.md`
**Rule added:** Done-when checklist item: `api-contracts.md updated with new/changed endpoints`
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Security expert OWASP rules

**Failure observed:** Security expert had only 3 generic rules. JWT algorithm confusion attacks, SQL injection, file upload path traversal, and missing per-endpoint auth checks were not covered.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/agents/security-agent.md`
**Rule added:** Full OWASP-aligned rule set: JWT validation, SQL injection prevention, file upload validation, per-endpoint auth check, dependency audit requirement.
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Regression test quality gate

**Failure observed:** Agents wrote tests that passed before the fix was applied, meaning the tests were not actually regression tests — they tested the general area but not the specific bug.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/agents/test-agent.md`, `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/bug-fix.md`
**Rule added:** "Verify the test FAILS on unfixed code" as a mandatory verification step before applying the fix.
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Release playbook hard gate

**Failure observed:** Release playbook had "all tests passing" as a checklist item that could be checked without actually running tests. Agents marked it done without running the suite.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/release.md`
**Rule added:** "If any test fails: STOP. Do not proceed." with explicit STOP instruction. No bypass language allowed.
**Validated:** Pending

---

### [v2.2.0] — 2026-05-28 — Test enforcement added

**Failure observed:** Agents completed features and bug fixes without writing any tests. No enforcement mechanism existed.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/CONVENTIONS.md`, `AGENT-PLATFORM-TEMPLATES/.agent/CHECKLIST.md`, `AGENT-PLATFORM-TEMPLATES/.agent/agents/test-agent.md`
**Rule added:** Coverage gate, mandatory test types per trigger (unit/regression/contract), `untested = unfinished` rule.
**Validated:** Yes — test coverage improved measurably in tested consumer repos.

---

## Improvement backlog

Items identified but not yet implemented:

| Priority | Gap | Target file | Notes |
|---------|-----|------------|-------|
| High | Frontend agent: no accessibility rules | frontend-agent.md | Add WCAG 2.1 AA baseline |
| High | Data agent: no query performance rules | data-agent.md | Add index check, N+1 detection |
| Medium | DevOps agent: no container scanning rule | devops-agent.md | Add image vulnerability scan before deploy |
| Medium | Docs agent: no broken link check | docs-agent.md | Add link validation before publish |
| Low | Architect agent: no event storming guidance | architect-agent.md | Add for domain-driven design projects |
| Low | All experts: no performance budget rule | CONVENTIONS.md | Perf budget per request/page |
