# {{PROJECT_NAME}} — Agent Platform Help

> **When executing this as a user command:** display the FULL contents of this file.
> Do NOT summarise or paraphrase — output every section, every table, every row.

> **Quick reference (commands only):** `Read .agent/QUICK-REF.md`
> **Re-show this file any time:** say `"platform help"` or `"how does this work"`
> **Re-show quick reference any time:** say `"show quick reference"` or `"show help"`

**Sections:** Session workflow · Expert agents · Critic agent · Playbooks · Project knowledge · Testing · Docs governance · Caveman · Switching IDEs · Extending · Maintenance

---

## Platform lifecycle — the complete flow

```
INSTALL (once)
──────────────────────────────────────────────────────────────────
npx {{PLATFORM_NPX}}
  │
  ├─ Backs up any existing AI configs (CLAUDE.md, Cursor rules, etc.)
  ├─ Installs .agent/ .claude/ .cursor/ .agents/ .codex/
  ├─ Fills stubs: project name, stack, test runner, coverage
  ├─ Adds platform block to .gitignore
  └─ Prints install summary with capability list + session-start command

SESSION START (every session)
──────────────────────────────────────────────────────────────────
"Read .agent/session-start.md and execute it."
  │
  ├─ Conflict check — is another IDE already active on overlapping files?
  ├─ Cross-framework Critic offer — if previous session was a different IDE
  ├─ One-time setup — detect and configure test runner if not set
  ├─ Update check — once per 7 days, cached, skips silently if offline
  ├─ Display full Quick Reference — all commands for your active IDE
  └─ "Ready. Tell me what you want to do."

YOU DESCRIBE WHAT YOU WANT
──────────────────────────────────────────────────────────────────
        │
        ├─── DOMAIN TASK ──────────────────────────────────────────
        │    "add an endpoint"   → Read .agent/agents/backend-agent.md
        │    "review for auth"   → Read .agent/agents/security-agent.md
        │    "write tests"       → Read .agent/agents/test-agent.md
        │    "find what's wrong" → Read .agent/agents/critic-agent.md
        │    (+ 5 more experts)
        │
        └─── WORKFLOW TASK ────────────────────────────────────────
             "fix a bug"         → Read .agent/playbooks/bug-fix.md
             "add a feature"     → Read .agent/playbooks/add-feature.md
             "ready to ship"     → Read .agent/playbooks/release.md
             "something's wrong" → Read .agent/playbooks/debug-pipeline.md
             (+ 4 more playbooks)

WORK
──────────────────────────────────────────────────────────────────
  │
  ├─ Agent reads context: api-contracts, adr-log, known-issues, deps
  ├─ Agent follows: CONVENTIONS.md rules, BEST-PRACTICES.md golden rules
  ├─ Agent writes: code + tests + docs
  ├─ Critic review gate: if playbook step requires it (bug-fix, add-feature, release)
  └─ Test suite: runs and must pass before handoff

SESSION END
──────────────────────────────────────────────────────────────────
"Read .agent/session-end.md and execute it."
  │
  ├─ Summarise: files changed, behaviour, tests, blockers
  ├─ Checklist: tests green, no stubs, docs updated
  ├─ CURRENT.md: goal, files changed, Critic reviewed: no
  ├─ registry.yaml: mark framework idle
  └─ "Session ended. To continue in another IDE: Read .agent/session-start.md"

NEXT SESSION
──────────────────────────────────────────────────────────────────
  ├─ Same IDE → back to SESSION START, picks up from CURRENT.md
  └─ New IDE  → SESSION START offers cross-framework Critic review
               of the previous IDE's work before proceeding
```

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
| **Critic** | `Read .agent/agents/critic-agent.md` | Adversarial review — finds bugs, security issues, edge cases, test gaps | Building things |

## How routing works — automatic, not manual

**You never need to tell the agent which expert or playbook to use.**

The agent is primed as an active router from the moment a session starts. When you describe a task, it silently identifies the right expert and/or playbook and begins working. You just describe your goal in plain language.

| You say | Agent automatically does |
|---------|--------------------------|
| "fix the login bug" | Loads backend-agent.md + bug-fix.md → begins bug-fix Step 1 |
| "add rate limiting" | Loads backend-agent.md + add-feature.md → begins add-feature Step 1 |
| "review the auth" | Loads security-agent.md → reviews using OWASP rules |
| "ready to ship v2" | Loads devops-agent.md + release.md → begins release gates |
| "find what's wrong" | Loads critic-agent.md → runs 6-dimension adversarial review |

### Expert + Playbook combined

An expert defines WHO the agent is (domain persona, rules, done-when criteria).
A playbook defines WHAT steps to follow (process, quality gates, expert assignments).

They are loaded together when both apply:
- The expert's rules are enforced at every step of the playbook
- The playbook assigns different experts at specific steps (e.g. Critic at review gate)
- The agent switches expert persona at those steps, then returns

```
"fix the authentication bug"
  → Backend expert (WHO: API, auth, security rules)
  + bug-fix.md playbook (WHAT: reproduce → scope → fix → regression test → critic review)
  
  At Step 5b: switches to Critic expert → reviews the fix → switches back to Backend
```

**Chaining experts** for complex tasks:
```
Architect (design) → Backend (implement) → Test (verify) → Critic (review) → Docs (document)
```

---

## Critic agent — adversarial quality gate

The Critic is different from every other expert. Other experts build things. The Critic finds what's wrong with what was built.

**Load after any implementation:**
```
Read .agent/agents/critic-agent.md
Review the [feature/fix/endpoint] just implemented above.
```

**What it checks (all six dimensions):**
1. **Correctness** — edge cases, null handling, boundary conditions, idempotency
2. **Security** — injection, auth bypass, data exposure, secrets, JWT issues
3. **Test quality** — does the regression test actually fail before the fix? are error paths covered?
4. **Completeness** — all requirements met? docs updated? contracts updated?
5. **Design** — simplest correct solution? unnecessary complexity? needs an ADR?
6. **Edge cases** — empty input, external service down, concurrent access, boundary values

**Severity levels:**
- **Critical / High** → blocks the task. Must fix before handoff.
- **Medium** → logged in CURRENT.md, fixed in a follow-up.
- **Low** → noted, optional.

**Built into three playbooks:**
- `add-feature.md` Step 5b — critic reviews implementation + tests before docs
- `bug-fix.md` Step 5b — critic confirms regression test quality + checks for new bugs
- `release.md` Step 1b — critic reviews full diff since last release before version bump

**Cross-framework automatic review:**
When you start a session in IDE B after working in IDE A, the session start detects the framework switch and offers:
```
┌──────────────────────────────────────────────────────────────────┐
│ Cross-framework Critic review available                          │
│ Last session: Claude Code — [goal]                               │
│ Would you like me to review that work before we proceed?  YES/NO │
└──────────────────────────────────────────────────────────────────┘
```
This is the highest-value critic use: a different model reviewing the previous model's work with no shared context or assumptions.

**Ask for a critic review any time:**
```
"review this" / "find issues" / "what could go wrong" / "adversarial review"
```

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

## Full Project Audit

A professional 8-domain audit of any codebase. Each domain runs its dedicated expert — using the expert's full ruleset, not a summary.

**Run it:**
```
Run project audit
```
or
```
Read .agent/playbooks/audit.md and execute it.
```

**First session:** The platform automatically offers the audit on the first real session in any repo. Just say YES.

**What it audits:**

| Domain | Expert | Finds |
|--------|--------|-------|
| Architecture | Architect | Components, interfaces, CSCIs, ASCII diagram, dependency gaps |
| Documentation | Docs | Doc inventory, audience mapping, staleness, missing docs |
| Security | Security | Secrets, CVEs, OWASP Top 10, auth gaps, input validation |
| Test quality | Test | Coverage, missing tests, no error-path tests, mutation gaps |
| Code quality | Critic | Dead code, error handling gaps, complexity, duplicated logic |
| Data | Data | Schema, migrations, N+1 risks, PII handling |
| API | Backend | Endpoint inventory, auth coverage, api-contracts completeness |
| DevOps & CI | DevOps | Pipeline health, SBOM, secrets management, rollback |

**Report:** saved to `.agent/context/audit-YYYY-MM-DD-HH-MM.md` with:
- Executive summary table (🟢 Good · 🟡 Needs attention · 🔴 Critical)
- Prioritised findings: Critical → High → Medium → Low
- Quick wins section (fixes under 1 hour)

> **The audit improves automatically.** When experts get updated with new OWASP rules or best practices via `--mode=upgrade`, the audit uses those improvements — no changes to the audit playbook needed.

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

**Coverage report** — after any test run with coverage, open in your browser:
```
coverage/lcov-report/index.html
```
Every file shown line-by-line: green = covered, red = not covered. The Test expert generates this automatically and checks it against your coverage gate before marking a task done.

**Load the test expert** for dedicated test work:
```
Tell agent: "write tests for [component]"
```

---

## Agent-generated artifacts

When agents do their work they may generate useful project artifacts. These are **your files** — not platform files. They are not gitignored by default and are not removed if you uninstall the platform.

| Artifact | Generated by | Default location | Notes |
|----------|-------------|-----------------|-------|
| **Coverage HTML report** | Test expert | `coverage/lcov-report/index.html` | Open in browser — line-by-line green/red coverage view |
| **OpenAPI / Swagger docs** | Docs expert | `swagger/` or `openapi.json` | Publish alongside your API |
| **API contract spec** | Backend expert | `.agent/context/api-contracts.md` | Platform file — lives in `.agent/`, gitignored with it |

These artifacts belong to your project. Keep them, commit them, or exclude them — your choice:

```bash
# Exclude coverage reports from git
echo "coverage/" >> .gitignore

# Exclude Swagger output from git
echo "swagger/" >> .gitignore
echo "openapi.json" >> .gitignore
```

---

## Docs governance

Documentation completeness is enforced as a quality gate — not left to good intentions.

**The registry** — `.agent/context/docs-registry.md` — maps every project doc to an owner expert, audience, and update trigger. It is installed as a stub and populated by the Docs expert at first session.

**How it stays current:**

| When | Enforcement |
|------|------------|
| Any expert finishes a task | Done-when: check owned docs in registry, update `Last reviewed` |
| Any expert creates a new `.md` file | Must register it before session ends |
| Session end (Step 2b) | Scans for new `.md` files not yet in registry, prompts to register |
| Release gate (release.md Step 4) | Docs agent audits every row — stale or unregistered = **BLOCKED** |
| git commit (guards installed) | Warns if newly staged `.md` files are not in registry |

**First session on this project:**
```
Read .agent/agents/docs-agent.md
Task: scan the project for all existing doc files and populate docs-registry.md
```

**At release time:**
```
Read .agent/agents/docs-agent.md
Task: run registry audit — check all rows for staleness before we release
```

**To add a new doc to the registry** (paste into chat):
```
Add this to .agent/context/docs-registry.md:
| `path/to/doc.md` | <Expert> | <Audience> | <Update trigger> | today |
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

**Normal switch (both IDEs available):**
```
# Step 1 — end session in current IDE
End session.

# Step 2 — open the other IDE, start session
Read .agent/session-start.md and execute it.
```

The new session picks up from where the last one left off via `CURRENT.md`.

**Emergency switch (previous IDE unavailable — out of credits, crashed, etc.):**

Just start a session in the new IDE:
```
Read .agent/session-start.md and execute it.
```

Session start detects the stuck open session and offers a **takeover**:
```
┌─────────────────────────────────────────────────────────────────┐
│  [framework] has an open session                                │
│  Task : [what it was doing]                                     │
│  Files: [files it had claimed]                                  │
│                                                                 │
│  1. Take over — commit uncommitted work, close it, continue     │
│  2. Wait — end the other session first if it is still running   │
└─────────────────────────────────────────────────────────────────┘
```

Reply **1** — the new IDE commits any uncommitted work from the stuck session, closes it cleanly, and continues. No manual file editing required. Cross-framework Critic review is then offered automatically.

> **This is one of the key reasons to use a multi-framework platform.** When one IDE's credits run out mid-task, switch to another and continue without losing any work or context.

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
https://github.com/{{PLATFORM_REPO}}/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md#extending-guide

---

## Platform maintenance

### Zero footprint — your code is never touched

| Guarantee | What it means |
|-----------|--------------|
| **No code changes on install** | Only `.agent/` `.claude/` `.cursor/` `.agents/` `.codex/` and 3 root files are added. Your source files are never modified. |
| **Nothing committed accidentally** | All platform files are gitignored on install. `git status` stays clean. |
| **Clean removal** | `--mode=uninstall` removes the platform coordination layer and restores your original AI configs from backup. Your AI agents improved your code while you used the platform — those improvements are yours to keep. The scaffolding that guided them is what gets removed. |
| **Customisations survive upgrades** | `mode=upgrade` only updates PLATFORM sections. Your project rules are never overwritten. |

### Why upgrading is worth it

Every Agent Platform release includes rules sourced from OWASP security guidelines, CWE Top 25 dangerous software weaknesses, and engineering best practices from the developer community. The maintainer runs regular web ecosystem audits and encodes findings into the expert agents. **Your agents automatically get smarter on every upgrade** — new security checks, better quality gates, updated best practices. You don't need to track these sources yourself.

| Task | Command |
|------|---------|
| Check installed version | Read `.agent/platform.json` |
| Check for updates | `node .agent/tools/check-updates.mjs` |
| Apply updates (agent-driven) | `Read .agent/tools/upgrade.md and execute it.` |
| Apply updates (terminal) | `npx {{PLATFORM_NPX}} --mode=upgrade` |
| Install global stubs (once, user-level) | `npx {{PLATFORM_NPX}} --mode=global` |
| Repair empty stubs | `npx {{PLATFORM_NPX}} --mode=repair` |
| Remove all platform files | `npx {{PLATFORM_NPX}} --mode=uninstall` |

**What you get on upgrade:**
- Improved expert rules (Security, Backend, Test, Critic, and others)
- New PLATFORM section content sourced from OWASP, CWE, and best practice audits
- Your PROJECT sections (your team's customisations) are never touched

---

*Agent Platform Bootstrap v{{BOOTSTRAP_VERSION}} · https://github.com/{{PLATFORM_REPO}}*
