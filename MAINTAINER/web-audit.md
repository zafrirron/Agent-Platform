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

## Phase 3 — Full Ecosystem Horizon Scan *(Option C — run only when scope=full)*

> Skip this phase for the default monthly audit.
> Run when maintainer says: `"Run full scope web audit"` or `"include horizon scan"`

### 3A — Emerging AI / Agentic patterns

Search: `"agentic AI engineering patterns [current year]"`
Search: `"multi-agent system architecture best practices [current year]"`
Search: `"LLM prompt injection attack patterns [current year]"`
Search: `"AI agent tool use security risks [current year]"`
Search: `"LLM application security checklist [current year]"`

Fetch top 5 results per query. Look for patterns that do NOT map to any existing expert rule. These are not gaps — they are new practices the community is developing.

### 3B — Developer community signals

Fetch: `https://news.ycombinator.com/best` (top 30 stories — filter to software engineering / security)
Search: `"software engineering emerging practice [current year]"`
Search: `"developer best practice changed [current year]"`

Look for recurring themes across multiple top posts — patterns the community is converging on that the platform does not yet encode.

### 3C — New tooling that changes best practices

Search: `"new developer security tooling [current year]"`
Search: `"deprecated security practice replaced [current year]"`
Search: `"SBOM software bill of materials requirements [current year]"`
Search: `"supply chain attack software [current year]"`

Look for: tools that make old patterns obsolete, new standards replacing old ones, practices that used to be optional and are now required.

### 3D — Conference and research findings

Search: `"OWASP AppSec [current year] new vulnerability class"`
Search: `"Black Hat [current year] web application new attack"`
Search: `"DEF CON [current year] software security finding"`
Search: `"arxiv agentic LLM security [current year]"`

Look for: newly disclosed attack classes not yet reflected in OWASP top lists, academic research on AI/agent security that practitioners haven't encoded yet.

> **Horizon scan findings** use the `E-prefix` (E001, E002...) and the `EMERGING PRACTICE` classification — see Phase 4.

---

## Phase 4 — Build the findings report

For each finding, create an entry using the format from `MAINTAINER/web-audit-report-template.md`.

### Classify each finding

| Classification | Meaning | Prefix |
|---------------|---------|--------|
| NOT COVERED | No existing PLATFORM rule addresses this | F |
| PARTIALLY COVERED | A related rule exists but is too vague or incomplete | F |
| CONTRADICTED | An existing rule conflicts with the finding | F |
| EMERGING PRACTICE | New pattern with no existing rule — practice itself is new, not a gap (Phase 3 only) | E |

Skip findings that are FULLY COVERED by an existing specific rule.

`F-prefixed` findings = gap analysis (Phases 1 + 2)
`E-prefixed` findings = horizon discoveries (Phase 3 only — scope=full)

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

## Phase 5 — Present report and wait for selection

Output the complete findings report using the format from `MAINTAINER/web-audit-report-template.md`.

If scope=full was run, the report has two sections:
- **F-findings** (gap analysis from Phases 1+2) — normal findings
- **E-findings** (horizon scan from Phase 3) — these offer an additional action: `"Create new expert for [domain]"` if the practice is broad enough to warrant a whole new expert

After the report, output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Audit complete: X gap findings (F001-Fxxx) + Y horizon findings (E001-Exxx)
  High: N  ·  Medium: N  ·  Low: N

  To implement findings, tell me:
  • "Add F001, F003" — add specific gap findings
  • "Add E002" — add an emerging practice finding
  • "Add all High" — add all High impact findings
  • "Modify F002 to: [new text]" — add with your modification
  • "Skip F005" — mark as reviewed, don't add
  • "Defer F007" — add to improvement backlog
  • "Explain F003" — fetch more context from source
  • "Create new expert from E001" — scaffold a new expert for an emerging domain
  • "Skip all" — log all as reviewed, nothing added
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Do NOT implement anything until maintainer explicitly selects.**

---

## Phase 6 — Implement selections

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

| Frequency | Command | Phases |
|-----------|---------|--------|
| Monthly | `Read MAINTAINER/web-audit.md and execute it.` | 1 + 2 (Option B) |
| Quarterly | `Read MAINTAINER/web-audit.md and execute it. scope=full` | 1 + 2 + 3 (Option C) |
| After OWASP update | `Read MAINTAINER/web-audit.md and execute it.` phase=1 | Phase 1 only |
| After production incident | Mode 1 targeted addition (immediate) | N/A |
| After major framework release | `Read MAINTAINER/web-audit.md and execute it.` phase=2E | Phase 2E only |
