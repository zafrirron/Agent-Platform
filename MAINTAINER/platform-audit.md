# Playbook: Platform Audit

> Load with maintainer agent: `Read MAINTAINER/platform-maintainer-agent.md`
> Then: `Read MAINTAINER/platform-audit.md and execute it.`

Produces a full capability matrix, identifies gaps, flags weak rules, and checks for duplicates.

---

## Steps

### Step 1 — Expert capability matrix

Read every file in `AGENT-PLATFORM-TEMPLATES/.agent/agents/`.

Produce a table with one row per expert:

| Expert | Domain | Rule count | Rules summary | Done-when items | Gaps flagged |
|--------|--------|-----------|--------------|-----------------|-------------|

Flag as **undertrained** if:
- Fewer than 5 rules in the PLATFORM section
- No done-when checklist
- No "before any task" reading list

### Step 2 — Playbook step matrix

Read every file in `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/`.

Produce a table:

| Playbook | Trigger | Step count | Hard quality gates | Weak steps | Expert assignments |
|---------|---------|-----------|-------------------|-----------|-------------------|

Flag as **weak** if:
- Any step has no verifiable outcome ("test the code" with no specific requirement)
- No hard quality gate that blocks progress
- No expert assignments on domain-specific steps

### Step 3 — Cross-file duplicate check

Search for rules that appear in multiple files. Common candidates:
- "no secrets in source" — appears in Security, DevOps, CONVENTIONS — is it consistent?
- "parameterised queries" — should be in Backend, Data, Security
- "update CURRENT.md" — should be universal, not repeated per expert

Report: rule text | files it appears in | consistent or contradictory

### Step 4 — Coverage gap analysis

Check which of these common failure categories have NO rule covering them:

| Failure category | Covered by | Gap? |
|-----------------|-----------|------|
| SQL injection | | |
| Broken object-level auth | | |
| Sensitive data exposure | | |
| Missing rate limiting | | |
| Regression test quality | | |
| API contract drift | | |
| Deployment with red tests | | |
| Secrets in CI config | | |
| Missing migration rollback | | |
| Unbounded database queries | | |

### Step 5 — Rule quality check

For each rule in the PLATFORM sections, evaluate:
- **Specific?** Can an agent know with certainty whether it has followed this rule?
- **Verifiable?** Can the user confirm it was followed without asking the agent?
- **Traceable?** Does `MAINTAINER/platform-improvements.md` have an entry explaining what failure this rule prevents?

Flag any rule that fails the specificity or verifiability check.

### Step 6 — Report

Produce:
1. Summary: X experts audited, Y playbooks audited
2. Undertrained experts list (if any)
3. Weak playbooks list (if any)
4. Duplicate rules that need consolidation (if any)
5. Gap list — failure categories with no coverage
6. Rule quality issues — vague or unverifiable rules
7. Recommended next improvements (priority-ordered)
