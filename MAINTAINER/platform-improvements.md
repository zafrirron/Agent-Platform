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

### [2.41.0] — 2026-06-09 — User-facing docs sync (post-2.37 capabilities)

**Gap observed:** README, FRAMEWORK-README, QUICK-REF, PLATFORM-HELP, presentation deck, and maintainer commands still described v2.37 / 9 playbooks / 8-domain audit after v2.38–2.41 NFR/compliance releases.

**Files changed:** `README.md`, `AGENT-PLATFORM-FRAMEWORK-README.md`, `QUICK-REF.md`, `PLATFORM-HELP.md`, `presentation/agent-platform-beta.html`, `presentation/STORY-PLAN.md`, `MAINTAINER/GUIDE.md`, `platform-maintainer-agent.md`

**Rules added:**
- Maintainer command: `"Sync user-facing docs for vX.Y.Z"`
- Playbook inventory table (18 playbooks) in maintainer agent
- Presentation slide: Enterprise & Compliance (v2.38–2.41)

**Validated:** Pending

---

### [2.41.0] — 2026-06-09 — Compliance & maturity P0/P1 (SOC2/ISO/DORA evidence)

**Gap observed:** Platform had ISO 25010 NFRs and PRR but no compliance evidence mapping, DORA measurement, SOC 2/ISO 27001 SDLC review playbook, incident/MTTR tracking, or audit governance phase.

**Files changed:** `compliance-review.md`, `org-maturity-assessment.md`, `incident-postmortem.md`, `compliance-evidence-log.md`, `incident-log.md`, `production-readiness.md`, `nfr-definition.md`, `nfr-log.md`, `audit.md`, `AGENTS.md`, `CHECKLIST.md`, `architect-agent.md`, `docs-registry.md`, manifest

**Rules added:**
- Compliance evidence register with SOC 2 / ISO 27001 control crosswalk
- Compliance-review playbook with SDLC checklist + Critic gate
- PRR blocks on P0 evidence gaps and Critical CVE past SLA
- DORA NFR templates (change failure rate, MTTR) + incident log rollup
- Org maturity assessment (quarterly) + audit Phase 10
- Incident postmortem playbook feeding DORA metrics

**Validated:** Pending

---

### [2.40.0] — 2026-06-09 — UX golden rules in frontend-agent (Nielsen + Shneiderman)

**Gap observed:** `frontend-agent.md` covered WCAG 2.2 AA and async states but lacked actionable usability heuristics — feedback timing, consistency, affordance, error prevention, progressive disclosure, responsive/touch UX beyond target size.

**File changed:** `.agent/agents/frontend-agent.md`

**Rules added:**
- UX interaction principles section (visibility/feedback, consistency, affordance, error prevention, user control, clarity, responsive/touch)
- Done-when: empty-state CTA, UX heuristic verify pass, explicit UX checklist item

**Validated:** Pending

---

### [2.39.0] — 2026-06-11 — NFR P1: performance budget, observability, a11y audit, data query rules

**Gap observed:** P0 added NFR register and PRR but lacked implementation playbooks for performance budgets, observability instrumentation, and standalone a11y audits; data-agent manifest claimed N+1/index capabilities without agent-body rules; DevOps lacked container scan enforcement.

**Files changed:** `performance-budget.md`, `observability-setup.md`, `accessibility-audit.md`, `data-agent.md`, `devops-agent.md`, `AGENTS.md`, `CHECKLIST.md`, agent manifests

**Rules added:**
- Performance budget playbook with mandatory Critic PERFORMANCE
- Observability setup: correlation ID, health, metrics, OPERABILITY Critic
- Accessibility audit: axe + keyboard + WCAG Critic ACCESSIBILITY
- Data-agent: N+1, indexes, bounded reads, EXPLAIN
- DevOps: Trivy/Grype image scan BLOCKED on Critical CVEs

**Validated:** Pending

---

### [2.38.0] — 2026-06-11 — NFR playbooks: definition, production readiness, audit expansion

**Gap observed:** Platform strong on security/correctness but weak on measurable NFRs (performance budgets, observability, WCAG, PRR). `security-audit.md` was a stub; full audit had no frontend/performance/observability phases.

**Files changed:** `nfr-definition.md`, `production-readiness.md`, `security-audit.md`, `nfr-log.md`, `audit.md`, `frontend-agent.md`, `architect-agent.md`, `critic-agent.md`, `add-feature.md`, `AGENTS.md`, `CHECKLIST.md`, `docs-registry.md`

**Rules added:**
- NFR register with threshold + measure + verify path per row
- PRR playbook blocks deploy on P0 NFR / security / Critic failures
- WCAG 2.2 AA baseline in frontend-agent
- Critic `[ACCESSIBILITY]` + `[OPERABILITY]` dimensions
- add-feature Critic adds `[PERFORMANCE]` / `[ACCESSIBILITY]` when triggered

**Validated:** Pending — E2E with nfr-definition + production-readiness on platform-demo

---

### [2.37.0] — 2026-06-09 — E2E gaps: Critic enforcement, PowerShell commits, document-api playbook

**Failure observed:** Platform E2E on `platform-demo` (todo-app demo): bug-fix and add-feature completed without Critic (`CURRENT.md` `Critic reviewed: no`); session-end first commit failed on PowerShell `&&`; "document API" routed to docs-agent with `*(none)*` playbook — agent documented auth without implementing it; coverage not re-run at session end.

**Files changed:** `bug-fix.md`, `add-feature.md`, `document-api.md` (new), `AGENTS.md`, `session-end-shared.md`, `CHECKLIST.md`, `AGENT-PLATFORM-MANIFEST.json`

**Rules added:**
- Playbook Step 5b: MANDATORY `▶ Critic review —` output + `CURRENT.md` log; HARD RULE blocks done/session-end until complete
- Session-end Step 2a: Critic catch-up when app code changed and playbook skipped
- Session-end Step 2c: separate git commands — no `&&` (PowerShell-safe)
- Session-end Step 2e: run `{{TEST_RUNNER}}` + `{{COVERAGE_CMD}}` when app code changed
- New `document-api` playbook: spec follows code, mandatory Critic `[COMPLETENESS] [CORRECTNESS]`
- CHECKLIST: Quality gates section for Critic / Security / Step 5b

**Validated:** Pending — re-run E2E Phase 3–5 on upgraded `platform-demo`

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

### [2.28.0] — 2026-06-01 — User submission ingest: 7 rules from drone-systems AGENTS.md

**Source:** Mode 3 user submission ingest — AGENTS.md from a production Python/TypeScript drone defense monorepo (Pants build system). Language-agnostic rules extracted.

**Files changed:** `CONVENTIONS.md`, `docs-agent.md`, `critic-agent.md`

**Rules added (5 NEW):**
- I001: Never mask errors with silent fallbacks — fix root cause; a hidden failure is worse than a surfaced one (CONVENTIONS.md General)
- I002: Do not delete existing comments unless deleting the code they belong to (CONVENTIONS.md General)
- I003: Behavior-preserving refactors must be in separate commits from feature/fix changes (CONVENTIONS.md Git)
- I004: Create Mermaid diagrams for state machines, processes, data flows — not prose (docs-agent.md)
- I005: Note potential bugs found in adjacent code during review — report, do not fix without instruction (critic-agent.md Rules)

**Enhancements (2 ENHANCE):**
- I006: Keep inline docstrings current when modifying a method — same change, include params/return/purpose (docs-agent.md Writing quality)
- I007: Done-when gate: any function you modified must have an accurate inline docstring (docs-agent.md done-when)

**Skipped:** Smallest diff/match style/comments (DUPLICATE x3), ask clarifying questions (DUPLICATE), keep PRs small (DUPLICATE), all Pants/Docker/drone-specific items (PROJECT-SPECIFIC ~12 items)

**Validated:** Pending

---

### [2.26.0] — 2026-05-31 — User submission ingest: 23 production-proven rules across 5 expert files

**Source:** Mode 3 user submission ingest — 7 Cursor rule files (.mdc) from a Java/Spring monorepo. Rules extracted, deduplicated against existing platform, language-agnostic versions written to platform standard.

**Files changed:** `CONVENTIONS.md`, `architect-agent.md`, `backend-agent.md`, `docs-agent.md`, `test-agent.md`

**Rules added (18 NEW):**
- I001: Layer boundaries — controller→service only, service→repository only, no cross-domain shortcuts (architect-agent)
- I002: No cross-service code imports — services communicate via API only (architect-agent)
- I003: Mark temporary implementations with TODO + rationale in code (CONVENTIONS.md General)
- I006: Explicit doc update trigger list: API surface, domains, tech stack, integrations, patterns, limitations (docs-agent)
- I007: Explicit doc update skip list: formatting, comment-only, version bumps with no behavior change (docs-agent)
- I008: Docs content quality: one fact per bullet, no narration, no "TBD"/"coming soon" (docs-agent)
- I009: Commit body explains WHY — the diff shows what; body must capture reasoning (CONVENTIONS.md Git)
- I011: Never swallow exceptions silently — log with context, then rethrow (CONVENTIONS.md Error handling)
- I012: Return empty collections instead of null from list-returning functions (CONVENTIONS.md Error handling)
- I013: Model absent values explicitly — nullable wrappers for optional, throw-on-absent for required (CONVENTIONS.md Error handling)
- I014: REST paths use resource nouns — never verbs in paths (backend-agent REST design)
- I015: HTTP verb semantics: GET=read, POST=create, PUT=replace, PATCH=partial, DELETE=remove (backend-agent)
- I016: List endpoints return response wrapper with `items` field — never bare arrays (backend-agent)
- I017: Every endpoint has stable operationId in OpenAPI spec — never rename published operationId (backend-agent)
- I019: Consider CQRS — separate command from query controllers when domain has both (architect-agent)
- I020: Test every fetch-by-id for BOTH found AND missing cases (test-agent + done-when gate)
- I021: Use fluent assertion libraries — actionable failure messages without reading source (test-agent)
- I022: Prefer constructor injection over field/annotation injection (CONVENTIONS.md General)
- I023: Structured log format (format string + args) — never string concatenation in log calls (CONVENTIONS.md General)

**Enhancements (5 ENHANCE):**
- I004: "Read module context docs before any task" added to CONVENTIONS.md Agent behaviour
- I005: "Verify context docs match code before done" added to docs-agent done-when checklist
- I010: Commit subject ≤50 chars (tightened from ≤72 total) — CONVENTIONS.md Git
- I018: "Mark tech shortcuts with TODO in code, not only in CURRENT.md" — CONVENTIONS.md Agent behaviour

**Skipped:**
- Test naming convention (DUPLICATE — platform already has naming convention)
- Monorepo folder structure, no cross-service commits (PROJECT-SPECIFIC)
- Lombok, List.copyOf, BaseEntity, package naming (JAVA-SPECIFIC — not universally applicable)

**Validated:** Pending

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
| ~~High~~ | ~~Frontend agent: no accessibility rules~~ | frontend-agent.md | **Done v2.38.0** — WCAG 2.2 AA |
| ~~High~~ | ~~security-audit stub~~ | security-audit.md | **Done v2.38.0** — structured audit |
| ~~High~~ | ~~Data agent: no query performance rules~~ | data-agent.md | **Done v2.39.0** |
| ~~Medium~~ | ~~accessibility-audit.md~~ | new playbook | **Done v2.39.0** |
| ~~Medium~~ | ~~performance-budget.md~~ | new playbook | **Done v2.39.0** |
| ~~Medium~~ | ~~observability-setup.md~~ | new playbook | **Done v2.39.0** |
| ~~Medium~~ | ~~DevOps container scanning~~ | devops-agent.md | **Done v2.39.0** |
| Medium | Docs agent: no broken link check | docs-agent.md | Add link validation before publish |
| Low | Architect agent: no event storming guidance | architect-agent.md | Add for domain-driven design projects |
| ~~Low~~ | ~~`compliance-review.md` (GDPR/HIPAA/SOC2)~~ | new playbook | **Done v2.41.0** — SOC2/ISO/GDPR + evidence log |
| Medium | `pentest.md` playbook | new playbook | ISO A.8.8 / SOC 2 CC4.1 — P2 from compliance audit |
