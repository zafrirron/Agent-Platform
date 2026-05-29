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

## Log

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
