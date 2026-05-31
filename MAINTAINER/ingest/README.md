# Platform Ingest — Submission Folder

Drop your agentic files here for platform analysis.

The maintainer agent reads everything in this folder, extracts what is universally platform-worthy, and proposes additions to the expert agents and playbooks. You keep all credit — every rule added is logged with its source.

---

## What to submit

Any of these:

| File type | Examples |
|-----------|---------|
| Agent definition files | `backend-agent.md`, `my-security-rules.md`, `code-review-agent.md` |
| Playbook files | `hotfix.md`, `incident-response.md`, `api-review.md` |
| `CLAUDE.md` / `AGENTS.md` | From your project — the agent extracts rules, ignores platform mechanics |
| Conventions files | `CONVENTIONS.md`, `coding-standards.md`, `style-guide.md` |
| Skill files | Any skill `.md` from your `.agent/skills/` or `.claude/commands/` |
| Raw rule lists | A plain markdown file listing rules you've found valuable |

Multiple files at once is fine. Mixed domains is fine.

---

## What gets kept vs skipped

**Kept — rules that are:**
- Specific and imperative ("always validate X before Y", "never commit Z without W")
- Verifiable by an agent — there is a checkable outcome
- Universal — useful across projects, not tied to your specific stack

**Skipped automatically:**
- Project-specific values (your hostnames, API endpoints, team names, your stack's config)
- Vague guidance ("write clean code", "be thoughtful")
- Rules already in the platform
- Platform mechanics (session-start triggers, "Read AGENTS.md" instructions)

---

## What happens after you drop files

Maintainer runs:
```
Read MAINTAINER/platform-ingest.md and execute it.
```

The agent:
1. Reads all submitted files
2. Extracts candidate rules and classifies each as NEW / ENHANCE / DUPLICATE / PROJECT-SPECIFIC
3. Maps each finding to the right target (which expert, which playbook, or new expert candidate)
4. Presents a structured report with full rule text and rationale
5. Waits for maintainer to select which findings to implement
6. Implements selected findings via the standard Mode 1 workflow (logged, version bumped)
7. Archives your files to `archive/YYYY-MM-DD/`

---

## Clean your files first

Before submitting, remove or redact:
- API keys, secrets, tokens
- Hostnames, internal URLs
- Team or company names (if you prefer anonymity)
- Anything you don't want in a public changelog

The ingest agent does not use or expose this data, but clean submissions make the review cleaner.

---

## Archive

Processed files move to `archive/YYYY-MM-DD/` after ingest. They are kept as a record of what was reviewed.
