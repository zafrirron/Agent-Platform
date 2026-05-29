# Platform upgrade — agent instructions

> Tell your agent: `Read .agent/tools/upgrade.md and execute it.`

---

## Why upgrading is worth it

Every release of Agent Platform includes rules sourced from:
- **OWASP** — latest web and API security vulnerabilities
- **CWE Top 25** — most dangerous software weaknesses
- **Engineering best practices** — current standards for testing, API design, DevOps, and data safety

The platform maintainer runs regular web ecosystem audits and encodes findings into the expert agents' PLATFORM sections. When you upgrade:
- Your Security expert knows about the latest OWASP API vulnerabilities
- Your Backend expert knows current API design standards
- Your Test expert knows current testing quality requirements
- Your Critic agent knows what new failure patterns to look for

You don't track these sources yourself — the platform evolves continuously and your agents evolve with it.

---

## What to do

### Step 1 — Check current state

Read `.agent/platform.json` and note `bootstrap_version`.

### Step 2 — Check for updates

Run `node .agent/tools/check-updates.mjs` and read the output.

- If **already up to date**: report and stop.
- If **update available**: continue to Step 3.

### Step 3 — Apply the upgrade

Run the npx upgrade (preferred — no manual file copying):

```
npx github:zafrirron/Agent-Platform --mode=upgrade
```

This adds any files that are in the new manifest but missing from this repo, without overwriting existing content.

### Step 4 — Fill new placeholders

If the upgrade output or CHANGELOG lists new `{{PLACEHOLDER}}` variables, find them in the affected `.agent/` files and fill them with project-appropriate values.

Common placeholders added in recent versions:

| Placeholder | Where | Example |
|-------------|-------|---------|
| `{{COVERAGE_CMD}}` | `CONVENTIONS.md`, `CHECKLIST.md`, `test-agent.md` | `pytest --cov` |
| `{{COVERAGE_THRESHOLD}}` | Same files | `80` |

### Step 5 — Repair empty stubs

```
npx github:zafrirron/Agent-Platform --mode=repair
```

This fills any `{{placeholder}}` stubs that are still unfilled, without touching project content.

### Step 6 — Verify

Run `{{TEST_RUNNER}}` to confirm nothing broke.
Update `.agent/handoff/CURRENT.md` with the upgrade result.

---

## Manual path (if npx is unavailable)

1. Fetch `https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/CHANGELOG.md`
2. Find the upgrade guide section matching your installed version
3. Follow the targeted file-copy steps listed there
4. Fill new placeholders manually
5. Run `mode=repair` via the bootstrap if the apply script is present:
   `node AGENT-PLATFORM-APPLY.js --mode=repair`
