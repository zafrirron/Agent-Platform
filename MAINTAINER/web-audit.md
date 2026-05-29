# Mode 2 — Web Ecosystem Audit

> **Trigger:** `Read MAINTAINER/web-audit.md and execute it.`
> **Requires:** Maintainer agent loaded — `Read MAINTAINER/platform-maintainer-agent.md`
> **Scope:** Security (OWASP, CVEs, CWEs) + Engineering best practices (stack-specific)
> **Output:** Structured findings report → maintainer selects what to add

---

## Before you start

Read the current state of all experts and conventions:
1. Read all files in `AGENT-PLATFORM-TEMPLATES/.agent/agents/`
2. Read `AGENT-PLATFORM-TEMPLATES/.agent/CONVENTIONS.md`
3. Build a mental map of what is already covered — you will need this to classify each finding as COVERED / PARTIALLY / NOT COVERED

---

## Phase 1 — Security sources

### 1A — OWASP

Fetch and analyse:
- `https://owasp.org/www-project-top-ten/` — OWASP Top 10 Web (current year)
- `https://owasp.org/API-Security/editions/2023/en/0x11-t10/` — OWASP API Security Top 10 2023
- `https://owasp.org/www-project-testing-guide/` — OWASP Testing Guide (latest key items)

For each item in OWASP Top 10 and API Security Top 10:
- Is it covered by an existing PLATFORM rule? (check security-agent.md, CONVENTIONS.md, backend-agent.md)
- If NOT COVERED or PARTIALLY COVERED: create a finding

### 1B — CWE Top 25

Fetch: `https://cwe.mitre.org/top25/archive/2024/2024_cwe_top25.html`

For each of the top 10 most dangerous (CWE-89, CWE-79, CWE-78, CWE-416, CWE-20, CWE-125, CWE-22, CWE-352, CWE-434, CWE-862):
- Is there a corresponding platform rule?
- If not: create a finding

### 1C — Recent CVE patterns

Search: `"common vulnerability pattern 2024 web application"`
Search: `"API security vulnerability 2024 best practices"`
Search: `"authentication bypass pattern 2024"`

Extract recurring vulnerability patterns (not specific CVEs, but classes of vulnerability). Create findings for any class not covered.

---

## Phase 2 — Engineering best practices

### 2A — Backend practices

Search: `"backend API best practices 2024 security"`
Search: `"REST API design best practices 2024"`
Search: `"microservices security checklist 2024"`

Look for: rate limiting patterns, idempotency requirements, pagination best practices, error response standards, correlation IDs, circuit breaker patterns.

Compare against backend-agent.md and api-patterns.md.

### 2B — Testing best practices

Search: `"software testing best practices 2024"`
Search: `"test quality metrics engineering 2024"`
Search: `"mutation testing property-based testing 2024"`

Look for: mutation testing, property-based testing, contract testing tools, snapshot testing dangers, test pyramid ratios.

Compare against test-agent.md and CONVENTIONS.md.

### 2C — DevOps / CI-CD practices

Search: `"CI CD security best practices 2024"`
Search: `"supply chain security software 2024"`
Search: `"container security checklist 2024"`

Look for: SBOM requirements, supply chain attacks, dependency pinning, container hardening, secrets rotation.

Compare against devops-agent.md.

### 2D — Data and migration practices

Search: `"database migration best practices 2024"`
Search: `"zero downtime migration patterns"`
Search: `"data pipeline reliability 2024"`

Compare against data-agent.md.

### 2E — Agentic development patterns

Search: `"agentic AI development best practices 2024"`
Search: `"LLM application security 2024"`
Search: `"prompt injection prevention 2024"`
Search: `"multi-agent system patterns 2024"`

Look for: prompt injection risks, LLM output validation, agent memory security, tool use safety, hallucination prevention in code generation.

Compare against ALL expert files — these are new patterns that may not be covered anywhere.

---

## Phase 3 — Build the findings report

For each finding, create an entry using the format from `MAINTAINER/web-audit-report-template.md`.

### Classify each finding

| Classification | Meaning |
|---------------|---------|
| NOT COVERED | No existing PLATFORM rule addresses this |
| PARTIALLY COVERED | A related rule exists but is too vague or incomplete |
| CONTRADICTED | An existing rule conflicts with the finding |

Skip findings that are FULLY COVERED by an existing specific rule.

### Assign impact

| Impact | Criteria |
|--------|---------|
| **High** | Directly prevents a security vulnerability or production failure |
| **Medium** | Improves reliability, testability, or reduces tech debt |
| **Low** | Stylistic improvement, minor optimisation, emerging practice |

### Assign target

For each finding, identify which expert file or playbook should receive the rule:
- Security vulnerability → security-agent.md
- API design → backend-agent.md + api-patterns.md
- Testing practice → test-agent.md + CONVENTIONS.md
- DevOps/CI → devops-agent.md
- Data/migration → data-agent.md
- Agentic patterns → applicable expert(s) + CONVENTIONS.md

---

## Phase 4 — Present report and wait for selection

Output the complete findings report using the format from `MAINTAINER/web-audit-report-template.md`.

After the report, output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Audit complete: X findings (Y High, Z Medium, W Low)
  
  To implement findings, tell me:
  • "Add F001, F003" — add specific findings
  • "Add all High" — add all High impact findings
  • "Modify F002 to: [new text]" — add with your modification
  • "Skip F005" — mark as reviewed, don't add
  • "Defer F007" — add to improvement backlog
  • "Explain F003" — fetch more context from source
  • "Skip all" — log all as reviewed, nothing added
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Do NOT implement anything until maintainer explicitly selects.**

---

## Phase 5 — Implement selections

For each finding the maintainer selects to add:

1. Run the Mode 1 `add-rule` workflow (duplicate check → format → write → log)
2. Source URL must be recorded in `platform-improvements.md`
3. Rule text must be adapted to platform standard (specific + verifiable + action verb)

For skipped findings:
- Log in `MAINTAINER/platform-improvements.md` backlog section: "Reviewed [date] — skipped: [reason if given]"

For deferred findings:
- Add to `MAINTAINER/platform-improvements.md` backlog section with the proposed rule text

After all selections processed:
- Bump version if any rules were added
- Report summary: "X rules added, Y skipped, Z deferred. Log updated."

---

## Recommended audit schedule

| Frequency | Scope |
|-----------|-------|
| Monthly | Full audit (all phases) |
| After a OWASP update | Phase 1 only (security sources) |
| After a production incident | Mode 1 targeted addition (immediate) |
| After major framework version | Phase 2E only (agentic patterns) |
