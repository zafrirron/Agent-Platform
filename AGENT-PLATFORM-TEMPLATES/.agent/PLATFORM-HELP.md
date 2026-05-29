# {{PROJECT_NAME}} — Agent Platform Help

> **When executing this as a user command:** display the FULL contents of this file.
> Do NOT summarise or paraphrase — output every section, every table, every row.

> **Quick reference (commands only):** `Read .agent/QUICK-REF.md`
> **Re-show this file any time:** say `"platform help"` or `"how does this work"`
> **Re-show quick reference any time:** say `"show quick reference"` or `"show help"`

**Sections:** Session workflow · Expert agents · Playbooks · Project knowledge · Testing · Caveman · Switching IDEs · Extending · Maintenance

---

## Session workflow

Every working session follows the same three steps regardless of which IDE you use.

### 1 — Start

Paste into your AI agent chat (not the terminal):

```
Read .agent/session-start.md and execute it.
```

The agent will:
- Check no other IDE is editing overlapping files
- Mark itself active in the registry
- Run a version update check (at most once per 7 days)
- Display the full quick reference guide
- Show what was last worked on

### 2 — Work

Tell the agent what you want to do in plain language. It routes itself to the right expert or playbook. You can also load them explicitly — see [Expert agents](#expert-agents) and [Playbooks](#playbooks).

### 3 — End

Always end before closing the IDE or switching tools:

```
Read .agent/session-end.md and execute it.
```

The agent will:
- Summarise what was done
- Run the pre-handoff checklist (tests, stubs, open issues)
- Update the handoff log so the next session picks up cleanly
- Mark itself idle in the registry

**Why this matters:** if you skip session end, the registry still shows the IDE as active. The next IDE you open will see a conflict and stop until you resolve it.

---

## Expert agents

Expert agents give the AI a focused persona with specific rules, owned files, and domain knowledge. Load one when your task has a clear domain.

| Agent | Load with | Best for | Do not use for |
|-------|-----------|---------|----------------|
| **Architect** | `Read .agent/agents/architect-agent.md` | New components, cross-cutting decisions, ADR writing, "should we use X or Y" | Small isolated changes |
| **Backend** | `Read .agent/agents/backend-agent.md` | API endpoints, services, server logic, database queries | UI work |
| **Frontend** | `Read .agent/agents/frontend-agent.md` | UI components, client state, styling, UX flows | Server-side logic |
| **DevOps** | `Read .agent/agents/devops-agent.md` | CI/CD pipelines, build scripts, Docker, deployment, infra | Application logic |
| **Test** | `Read .agent/agents/test-agent.md` | Writing tests, improving coverage, setting up quality gates | Feature implementation |
| **Docs** | `Read .agent/agents/docs-agent.md` | README, changelog, API documentation, migration notes | Code changes |
| **Security** | `Read .agent/agents/security-agent.md` | Auth review, secret scanning, threat modelling, before sensitive releases | General development |
| **Data** | `Read .agent/agents/data-agent.md` | Schema design, migrations, data pipelines, transformations | UI or API logic |

**Chaining experts:** you can activate more than one in sequence. Common chain: Architect → Backend → Test → Docs.

**Example:**
```
Read .agent/agents/backend-agent.md
Task: add a rate-limiting middleware to the /api/v1 routes
```

---

## Playbooks

Playbooks are step-by-step workflows with pre-conditions, ordered steps, agent assignments, and rules. They prevent common mistakes and ensure nothing is skipped.

| Playbook | Trigger | Load with | What it enforces |
|---------|---------|-----------|-----------------|
| **Add feature** | Starting new feature work | `Read .agent/playbooks/add-feature.md` | Spec first, design before code, tests before done |
| **Bug fix** | Something is broken | `Read .agent/playbooks/bug-fix.md` | Reproduce first, regression test required, no exceptions |
| **Refactor** | Clean up code (tests must exist) | `Read .agent/playbooks/refactor.md` | One change type per PR, tests green before and after |
| **Debug** | Something's wrong but cause unknown | `Read .agent/playbooks/debug-pipeline.md` | Reproduce → isolate → hypothesise → probe → fix |
| **Release** | Ready to ship a version | `Read .agent/playbooks/release.md` | Full suite green, changelog updated, no unresolved blockers |
| **Security audit** | Before a sensitive release | `Read .agent/playbooks/security-audit.md` | Secrets, auth, inputs, deps, permissions |
| **Add dependency** | Need a new package/library | `Read .agent/playbooks/add-dependency.md` | Evaluate before install, audit after, document in deps file |
| **API integration** | Integrating an external API | `Read .agent/playbooks/api-integration.md` | Schema-first, mock→stub→real, contract tests required |

**Example:**
```
Read .agent/playbooks/bug-fix.md
The login endpoint returns 500 when the email contains a + character.
```

---

## Project knowledge files

These files accumulate knowledge about the project over time. Agents read and update them automatically when following playbooks.

| File | What it tracks | Update when |
|------|---------------|------------|
| `.agent/context/project-overview.md` | Stack, components, entry points | Architecture changes |
| `.agent/context/api-contracts.md` | Endpoint schemas and behaviour | Any API change |
| `.agent/context/api-patterns.md` | Conventions for building/consuming APIs | New API convention agreed |
| `.agent/context/adr-log.md` | Architecture Decision Records — why hard decisions were made | Any hard-to-reverse decision |
| `.agent/context/known-issues.md` | Bugs and limitations not yet fixed | When you find an issue you're deferring |
| `.agent/context/dependencies.md` | Non-obvious or important dependencies | When adding/removing a dep |
| `.agent/CONVENTIONS.md` | Coding, testing, git, and security rules for this project | Project-specific rule changes |
| `.agent/BEST-PRACTICES.md` | 10 golden rules for all agentic work | Read before any non-trivial task |

---

## Testing enforcement

The platform requires tests for all new code. Agents cannot mark a task done if tests are missing.

| Trigger | Required |
|---------|---------|
| New public function or module | Unit test |
| Bug fix | Regression test — no exceptions |
| New API endpoint | Contract test (happy path + ≥1 error path) |
| Any code change | Full suite green before session end |

**Your test runner:** `{{TEST_RUNNER}}`  
**Coverage command:** `{{COVERAGE_CMD}}`  
**Coverage gate:** {{COVERAGE_THRESHOLD}}%

> If these show `<fill-in …>`, set them in `.agent/CONVENTIONS.md` under `## Testing`.

**Load the test expert** for dedicated test work:
```
Read .agent/agents/test-agent.md
Task: write unit tests for the new auth middleware
```

---

## Token compression — Caveman

Caveman cuts agent output by ~65% while keeping full technical accuracy. Useful for long sessions to reduce context usage.

| Action | Say this |
|--------|---------|
| Turn on (standard) | `"caveman mode"` |
| Turn on (minimal filler only) | `"caveman lite"` |
| Turn on (maximum compression) | `"caveman ultra"` |
| Turn off | `"stop caveman"` |
| Compress a file | `"caveman compress .agent/PROJECT.md"` |

Works the same in all IDEs. The skill definition is at `.agent/skills/caveman/SKILL.md`.

---

## Switching IDEs

You can move any task between IDEs without losing context. The handoff log (`CURRENT.md`) and registry preserve full state.

```
# Step 1 — end session in current IDE
Read .agent/session-end.md and execute it.

# Step 2 — open the other IDE, start session
Read .agent/session-start.md and execute it.
```

The new session picks up from where the last one left off via `CURRENT.md`.

**Cross-IDE conflict prevention:** if you try to start a session while another IDE is still active on overlapping files, the agent stops and tells you what to do.

---

## Extending the platform

You can permanently add new capabilities. Everything is prompt-driven — tell the agent what to build.

| What to add | Tell the agent |
|------------|---------------|
| New expert agent | `"Add a new expert agent for [domain — e.g. Mobile, ML, Performance]"` |
| New playbook | `"Add a new playbook for [scenario — e.g. incident response, data migration]"` |
| New shared skill | `"Add a new skill called [name] that [does X]"` |
| New context file | `"Add a context file tracking [what]"` |
| 5th IDE framework | `"Add [Windsurf/Cline/Copilot Workspace] as a 5th supported framework"` |
| New best practice | `"Add a new golden rule: [rule]"` |
| API convention | `"Add API agentic pattern: [convention]"` |

Every extension follows the 7-step anatomy documented at:  
https://github.com/zafrirron/Agent-Platform/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md#extending-guide

---

## Platform maintenance

| Task | Command |
|------|---------|
| Check installed version | Read `.agent/platform.json` |
| Check for updates | `node .agent/tools/check-updates.mjs` |
| Apply updates (agent-driven) | `Read .agent/tools/upgrade.md and execute it.` |
| Apply updates (terminal) | `npx github:zafrirron/Agent-Platform --mode=upgrade` |
| Repair empty stubs | `npx github:zafrirron/Agent-Platform --mode=repair` |
| Remove all platform files | `npx github:zafrirron/Agent-Platform --mode=uninstall` |

---

*Agent Platform Bootstrap v{{BOOTSTRAP_VERSION}} · https://github.com/zafrirron/Agent-Platform*
