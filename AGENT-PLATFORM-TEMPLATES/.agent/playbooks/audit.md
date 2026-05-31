# Playbook: Full Project Audit

<!-- PLATFORM:START -->
## When to run
- **First session on any repo** — offered automatically if no prior sessions detected
- **Onboarding to an unknown codebase** — get a professional briefing in minutes
- **Before a major release** — confirm the project is healthy
- **Quarterly health check** — track improvement over time

Say: `"Run project audit"` or `"Read .agent/playbooks/audit.md and execute it."`

---

## Pre-conditions
- Platform installed and session started
- At least some source files exist in the repo

---

## Core principle — the audit uses the full brain of each expert

Each phase reads the actual expert agent file and applies its complete ruleset — not a summary of it. This means:
- **The audit improves automatically when experts improve.** Every platform upgrade that adds new security rules, test standards, or architectural patterns makes the audit smarter — with no changes to this playbook.
- **The checklist in each phase is a minimum floor, not a ceiling.** The expert's own rules are the primary authority.
- **Domain knowledge accumulates.** The Security expert has 15 OWASP/CWE rules, LLM injection defence, and audit logging requirements. The audit uses all of them.

## Execution

Run ALL phases in sequence. Do not skip any phase. Collect all findings.
After all phases, generate the report (Phase 9).

---

### Phase 1 — Architecture (Architect agent)

**Read `.agent/agents/architect-agent.md` in full. Apply ALL its rules, knowledge, and done-when gates to this assessment.** The expert file is the primary authority — the checklist below is a minimum floor, not a ceiling. As the expert gets smarter over time, this phase automatically improves.

Using the Architect expert's full domain knowledge, assess:

**Discover:**
- All programming languages used and their approximate LOC
- Frameworks and major libraries (with versions if detectable)
- All external dependencies and integrations (APIs, databases, queues, storage)
- Entry points (main files, CLI commands, server start)
- Component map: modules, services, layers, and how they relate
- Interface boundaries: where components talk to each other
- CSCIs (Computer Software Configuration Items): distinct deployable or testable units

**Diagram:**
Create an ASCII architecture diagram showing the major components and data flow. Include in the report.

**Apply all architect done-when gates as gap detectors:**
- Components with no clear owner or documentation
- Circular dependencies between modules
- Dependencies with known CVEs or that are severely outdated (>2 major versions behind)
- Missing interface documentation for public boundaries
- Hard-to-reverse decisions not logged in adr-log.md
- Monolithic areas that should be decomposed

---

### Phase 2 — Documentation audit (Docs agent)

**Read `.agent/agents/docs-agent.md` in full. Apply ALL its rules, knowledge, and done-when gates.** The Docs expert knows what good documentation looks like — use its full ruleset, not just this checklist. As the expert evolves, this phase improves automatically.

Using the Docs expert's full domain knowledge, audit all documentation:

**Discover:**
- Every `.md`, `.rst`, `.txt`, or `docs/` file in the repo
- For each: what it covers, who it's for (developer/user/operator/API consumer), when last updated
- README quality: does it cover install, usage, and contribution?
- CHANGELOG: does it exist and is it current?
- API documentation: OpenAPI/Swagger spec or equivalent
- Architecture documentation vs actual architecture
- Deployment/operations documentation

**Flag gaps:**
- No README or README with no install/usage instructions
- No CHANGELOG or changelog not updated with recent changes
- Public API with no documentation
- Architecture documentation that doesn't match the code
- Missing: contributing guide, security policy, deployment guide

---

### Phase 3 — Security audit (Security agent)

**Read `.agent/agents/security-agent.md` in full. Apply ALL its rules, OWASP checks, done-when gates, and domain knowledge.** The Security expert is updated with every web audit (OWASP Top 10, CWE Top 25, LLM security). Loading it directly means the audit uses the latest security knowledge automatically.

Using the Security expert's full domain knowledge, run:

**Scan:**
- Grep for secrets, tokens, passwords, API keys in source files
- Dependency CVE scan: run `npm audit` / `pip-audit` / `cargo audit` / equivalent
- Authentication patterns: are all routes properly protected?
- Input validation: are user-supplied values validated at trust boundaries?
- OWASP API Top 10 coverage against actual endpoints
- CSRF, SSRF, XSS, SQL injection, path traversal patterns
- Sensitive data in logs, error messages, or responses
- HTTPS/TLS enforcement, SameSite cookie policy
- Hardcoded configuration vs environment variables
- LLM/prompt injection risks (if AI-assisted features exist)

**Flag gaps:**
- Any hardcoded secret: CRITICAL
- Any unprotected endpoint: HIGH
- Any unvalidated user input to DB/shell/redirect: HIGH
- Any CVE in direct dependencies: severity from CVE score

---

### Phase 4 — Test quality audit (Test agent)

**Read `.agent/agents/test-agent.md` in full. Apply ALL its rules, quality gates, and standards.** The Test expert defines what good testing looks like for this project's stack. Use its full ruleset — mutation testing, contract testing, regression discipline — not just the checklist below.

Using the Test expert's full domain knowledge, assess:

**Discover:**
- Test runner and configuration
- Total test count by type (unit / integration / contract / e2e)
- Coverage percentage (run `{{COVERAGE_CMD}}` if possible)
- Coverage by module/file — which files have zero coverage?
- Test patterns: are happy path only, or do tests cover error paths?
- Regression tests: do known bugs have specific tests?
- Performance/load tests: do they exist?

**Flag gaps:**
- Coverage below 60%: HIGH
- Zero-coverage on critical path files: HIGH
- Tests that only test happy path with no error cases: MEDIUM
- No auth failure tests on protected endpoints: HIGH
- No contract tests for external API dependencies: MEDIUM

---

### Phase 5 — Code quality (Critic agent)

**Read `.agent/agents/critic-agent.md` in full. Apply its full 6-dimension adversarial review framework** (correctness, security, test quality, completeness, design, edge cases) across the entire codebase — not just new code. The Critic finds what implementing agents miss. As the Critic gets more experienced, this phase catches more.

Using the Critic's full adversarial framework, review:

**Review:**
- Error handling: are errors caught and handled, or swallowed silently?
- Edge cases: null/undefined handling, empty collections, boundary conditions
- Dead code: functions, modules, or branches never reached
- Code duplication: patterns repeated that should be abstracted
- Complexity hotspots: functions over 50 lines or with high cyclomatic complexity
- Inconsistent patterns: same problem solved differently in different places
- API design: consistent response shapes, naming, versioning
- Concurrency/race conditions (if applicable)

**Flag gaps:**
- Silent error swallowing (catch with no action): HIGH
- Functions with no error handling at all: MEDIUM
- Dead code files: LOW (but clean up)
- Business logic in UI components: MEDIUM

---

### Phase 6 — Data audit (Data agent)

**Read `.agent/agents/data-agent.md` in full. Apply ALL its rules and domain knowledge** — schema safety, migration discipline, zero-downtime patterns, PII handling. Use the expert's full ruleset.

Using the Data expert's full domain knowledge, review:

**Review:**
- Database schema: tables/collections, relationships, indexes
- Migration strategy: are migrations safe for zero-downtime deploy?
- Data validation: is data validated before persistence?
- Query patterns: N+1 risks, missing indexes on frequently queried fields
- Data pipelines: ETL jobs, background workers, scheduled tasks
- Backup strategy: is it documented?
- PII handling: where is sensitive data stored? Is it encrypted?

**Flag gaps:**
- No indexes on foreign keys or frequently filtered fields: HIGH
- No data validation before persistence: HIGH
- Migrations that lock tables: MEDIUM
- PII stored in plain text: CRITICAL
- No documented backup/recovery procedure: HIGH

---

### Phase 7 — API audit (Backend agent)

**Read `.agent/agents/backend-agent.md` in full. Apply ALL its rules** — contract discipline, error handling standards, auth enforcement, mass-assignment protection, SSRF prevention. The Backend expert's done-when checklist becomes the audit's quality bar for every endpoint.

Using the Backend expert's full domain knowledge, audit the API surface:

**Discover:**
- All HTTP endpoints (method, path, auth requirement)
- Compare against `.agent/context/api-contracts.md` — what's undocumented?
- Error response consistency: does every endpoint follow the standard format?
- Rate limiting: which endpoints are protected?
- Input validation: every endpoint's inputs validated?
- API versioning strategy

**Flag gaps:**
- Endpoints not in api-contracts.md: MEDIUM
- Endpoints with no auth where auth is expected: HIGH
- Inconsistent error response format: MEDIUM
- No rate limiting on auth or compute-heavy endpoints: HIGH

---

### Phase 8 — DevOps & CI audit (DevOps agent)

**Read `.agent/agents/devops-agent.md` in full. Apply ALL its rules** — SBOM requirements, artifact signing, OIDC credential standards, supply chain security. Use the expert's full ruleset including the latest DevOps security practices.

Using the DevOps expert's full domain knowledge, review:

**Review:**
- CI/CD pipeline: does it exist? Does it run tests? Does it block on failure?
- Build reproducibility: pinned dependencies? Lock files committed?
- Secrets management: are secrets in CI variables, not in code?
- Container/deployment config: hardened? Non-root user? Pinned base images?
- SBOM generation: is a software bill of materials produced?
- Rollback strategy: can a bad deploy be reverted quickly?
- Environment parity: dev/staging/production differences documented?

**Flag gaps:**
- No CI/CD pipeline: HIGH
- Tests not required to pass before merge: HIGH
- Secrets in code or config files: CRITICAL
- No deployment rollback procedure: HIGH
- Floating dependency versions (no lock file): MEDIUM

---

### Phase 9 — Report generation

After all phases complete, generate the audit report:

**File:** `.agent/context/audit-{{DATE}}.md`
(use format: `audit-YYYY-MM-DD-HH-MM.md`)

**Report structure:**

```
# Project Audit Report — [Project Name]
Generated: [timestamp] · Platform: Agent Platform v{{BOOTSTRAP_VERSION}}

## Executive Summary

| Domain | Health | Critical | High | Medium | Low |
|--------|--------|----------|------|--------|-----|
| Architecture | 🟢/🟡/🔴 | N | N | N | N |
| Documentation | 🟢/🟡/🔴 | N | N | N | N |
| Security | 🟢/🟡/🔴 | N | N | N | N |
| Test Quality | 🟢/🟡/🔴 | N | N | N | N |
| Code Quality | 🟢/🟡/🔴 | N | N | N | N |
| Data | 🟢/🟡/🔴 | N | N | N | N |
| API | 🟢/🟡/🔴 | N | N | N | N |
| DevOps & CI | 🟢/🟡/🔴 | N | N | N | N |

Health key: 🟢 Good (no Critical/High) · 🟡 Needs attention (High findings) · 🔴 Critical (Critical findings)

### Overall recommendation
[2-3 sentence summary of the project's health and the most important things to address]

### Quick wins (fixes under 1 hour)
[List of Low-effort / High-impact items]

## Architecture
[Phase 1 findings, diagram, gap list]

## Documentation
[Phase 2 findings, inventory table, gap list]

## Security
[Phase 3 findings, severity-rated list, CVE list]

## Test Quality
[Phase 4 findings, coverage numbers, gap list]

## Code Quality
[Phase 5 findings, hotspots, gap list]

## Data
[Phase 6 findings, schema notes, gap list]

## API
[Phase 7 findings, endpoint inventory, gap list]

## DevOps & CI
[Phase 8 findings, pipeline assessment, gap list]

## Prioritised action plan
### 🔴 Critical (fix before next deploy)
### 🟡 High (fix this sprint)
### ⚪ Medium (fix next sprint)
### 🔵 Low (backlog)
```

**After generating the report:**
- Output the file path to the user
- Show the Executive Summary table only in chat
- Tell the user: "Full report saved to `.agent/context/audit-[date].md` — open in your editor for the complete findings."
- Do NOT run session-end. The user continues their session.

---

## Rules
- Run every phase — do not skip any domain because files "look fine"
- Flag everything found — the user decides what to prioritise
- Do not fix anything during the audit — findings only, no code changes
- If a tool (npm audit, etc.) is not available, note it and move on
- The report file is the deliverable — it persists across sessions

<!-- PLATFORM:END -->
