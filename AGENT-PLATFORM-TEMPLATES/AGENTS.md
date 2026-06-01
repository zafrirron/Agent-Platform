# AGENTS.md — {{PROJECT_NAME}}

**Description:** {{PROJECT_DESCRIPTION}}

---

## 1 · Session commands

| Action | Command |
|--------|---------|
| Start session | `Read .agent/session-start.md and execute it.` |
| End session | `Read .agent/session-end.md and execute it.` |

---

## 2 · Auto-routing

You are the active router. When the user describes a task:
1. Identify the matching row in the table below
2. **READ the expert file** listed in the "Expert file" column
3. **READ the playbook file** listed in the "Playbook file" column (if one is listed)
4. Start your first response with exactly one status line, then begin working immediately — no other meta-commentary:
   - Expert + playbook → `▶ [Expert name] expert · [playbook name] playbook`
   - Expert only →       `▶ [Expert name] expert`
   - All experts (audit) → `▶ All experts · audit playbook`
   - No match, dev-related → do not answer yet; ask the clarification question (see below)
   - No match, non-dev (explain, conceptual, off-topic) → *(no status line)* answer directly
5. Follow the playbook steps in order, applying the expert rules at every step. Never ask which file to load.

**Expert disambiguation — when the table says "relevant `*-agent.md`":**
- Server logic, APIs, services, DB queries → `backend-agent.md`
- UI components, styling, client state, UX → `frontend-agent.md`
- Schema, migrations, pipelines → `data-agent.md`
- CI/CD, Docker, infra → `devops-agent.md`
- Tests only → `test-agent.md`
- For cross-domain tasks, chain: `Architect → Backend/Frontend → Test → Critic → Docs`

**"auth" routing rule:** `auth` alone in a feature request routes as backend; use the security row only when the task is explicitly a review, audit, or vulnerability check.

| User says something like… | Expert file | Playbook file |
|--------------------------|-------------|---------------|
| "add a feature", "implement", "build", "create", "new endpoint", "new component", "new page", "new screen", "scaffold" | `.agent/agents/backend-agent.md` (server/API/data) or `frontend-agent.md` (UI/component/styling) | `.agent/playbooks/add-feature.md` |
| "fix a bug", "broken", "crash", "not working", "error", "exception", "failing", "regression", "incorrect", "wrong output", "throws", "404", "500", "timeout", "flaky test" | relevant `*-agent.md` | `.agent/playbooks/bug-fix.md` |
| "refactor", "clean up", "rename", "simplify", "restructure", "reorganize", "extract", "split", "decouple", "deduplicate", "modernize" | relevant `*-agent.md` | `.agent/playbooks/refactor.md` |
| "deploy", "release", "ship", "version bump", "tag", "publish", "go live", "cut release", "push to prod" | `.agent/agents/devops-agent.md` | `.agent/playbooks/release.md` |
| "hotfix", "rollback", "revert release", "emergency fix" | `.agent/agents/devops-agent.md` | `.agent/playbooks/bug-fix.md` |
| "security review", "auth review", "check auth", "vulnerability", "secrets", "threat model", "OWASP", "XSS", "injection", "JWT", "RBAC", "access control", "encryption", "pentest" | `.agent/agents/security-agent.md` | `.agent/playbooks/security-audit.md` |
| "add library", "install package", "new dependency", "npm install", "yarn add", "pip install", "upgrade dependency", "update package" | relevant `*-agent.md` | `.agent/playbooks/add-dependency.md` |
| "integrate API", "external service", "webhook", "third-party", "GraphQL", "SDK", "use [service] API", "connect to [external API]" | `.agent/agents/backend-agent.md` | `.agent/playbooks/api-integration.md` |
| "debug", "investigate", "why is", "trace", "figure out", "what's happening", "diagnose", "check why" | relevant `*-agent.md` | `.agent/playbooks/debug-pipeline.md` |
| "slow", "performance", "optimize", "profile", "memory issue", "bottleneck", "memory leak" | relevant `*-agent.md` | `.agent/playbooks/debug-pipeline.md` |
| "run audit", "audit this repo", "project audit", "health check", "onboarding", "what is this project", "analyze codebase", "overview", "summarize project", "I'm new here", "get started" | all experts | `.agent/playbooks/audit.md` |
| "write tests", "test coverage", "quality gate", "unit test", "integration test", "e2e", "end-to-end", "fix failing tests", "TDD" | `.agent/agents/test-agent.md` | *(none)* |
| "update docs", "README", "changelog", "document", "JSDoc", "docstring", "swagger", "OpenAPI", "API docs" | `.agent/agents/docs-agent.md` | *(none)* |
| "schema", "migration", "database", "data pipeline", "ORM", "table", "column", "seed", "ETL", "aggregate", "N+1" | `.agent/agents/data-agent.md` | *(none)* |
| "system design", "architecture", "should we use X or Y", "ADR", "technical spec", "evaluate options", "what's the best approach" | `.agent/agents/architect-agent.md` | *(none)* |
| "CI/CD", "build pipeline", "Docker", "infra", "Kubernetes", "k8s", "terraform", "GitHub Actions", "container", "monitoring" | `.agent/agents/devops-agent.md` | *(none)* |
| "review this", "find issues", "what could go wrong", "code review", "PR review", "check my code", "give feedback", "sanity check", "second opinion" | `.agent/agents/critic-agent.md` | *(none)* |
| "explain", "how does X work", "walk me through", "what does", "understand this code" | *(answer directly — no expert or playbook needed)* | *(none)* |

**When a playbook is listed: you MUST read it and follow its numbered steps exactly.** The expert rules govern every step — do not skip steps or summarise them.

For cross-domain tasks, chain experts: `Architect → Backend/Frontend → Test → Critic → Docs`

**No-match rule — when no row matches:**
- **Dev-related** (mentions code, files, this codebase, or uses technical vocabulary): ask exactly ONE question — *"Is this a new feature, a bug fix, a refactor, a review, or something else?"* — then route immediately. Do not answer without routing first.
- **Non-development** (general knowledge, off-topic, purely conversational): answer directly with no status line.

A task is dev-related if it references code, a file, a function, a component, an endpoint, a test, a pipeline, a dependency, or the project being worked on.

### Help triggers

| User says | Action |
|-----------|--------|
| "show quick reference", "show help", "show commands" | Read `.agent/QUICK-REF.md` and display in full |
| "platform help", "how does this work" | Read `.agent/PLATFORM-HELP.md` and display in full |

---

## 3 · Hard rules — every agent, every session

- Read `.agent/BEST-PRACTICES.md` before any non-trivial task
- Read `.agent/CONVENTIONS.md` for coding, testing, git, and security rules
- Claim files in `.agent/handoff/sync/registry.yaml` before large edits
- Update `.agent/handoff/CURRENT.md` at every session end
- No commits unless the user explicitly asks
- Every bug fix ships with a regression test — no exceptions
- Every new public function ships with at least one unit test
- No secrets, tokens, or keys in source ever
- **NEVER run session-end automatically.** Session end is triggered ONLY when the user explicitly says "End session." or "Read .agent/session-end.md". Completing a task is NOT a reason to end the session.

---

## 4 · Cross-framework coordination

- Shared hub: `.agent/` — all frameworks read and write here
- Private folders: `.claude/` `.cursor/` `.agents/` `.codex/` — never edit other frameworks' private folders
- Registry: `.agent/handoff/sync/registry.yaml` — active-framework lock
- Handoff log: `.agent/handoff/CURRENT.md` — session history and next-agent notes
