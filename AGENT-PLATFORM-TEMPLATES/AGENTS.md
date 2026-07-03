# AGENTS.md — {{PROJECT_NAME}}

**Description:** {{PROJECT_DESCRIPTION}}

---

<!-- PLATFORM:START -->
## 1 · Session commands

| Action | Command |
|--------|---------|
| Start session | `Read .agent/session-start.md and execute it.` |
| End session | `Read .agent/session-end.md and execute it.` |

---

## 2 · Auto-routing

**Session commands bypass routing entirely — no `▶` line, no expert, no playbook:**
- `Read .agent/session-start.md and execute it.` → execute session-start directly
- `Read .agent/session-end.md and execute it.` → execute session-end directly
- Any command that begins with `Read .agent/` and contains `execute it` → execute directly, never route

You are the active router. When the user describes a task:
1. Identify the matching row in the table below
2. **READ the expert file** listed in the "Expert file" column
3. **READ the playbook file** listed in the "Playbook file" column (if one is listed)
3b. **Apply active packs (language / stack / domain overlays):** read `.agent/platform.json` → `active_packs`. For each active pack `<id>`: read `.agent/packs/<id>/pack.json`; if `provides.agent_overlays` maps the routed expert to a file, **read that file after the expert file** (a `language` pack may map several experts to one shared overlay). Also consult `.agent/packs/<id>/routing.md` for keyword-specific references. Overlays refine, never override, the generic expert. Skip silently if `active_packs` is empty or absent (zero cost when no pack is active).
4. Start your first response with exactly one status line, then begin working immediately — no other meta-commentary:
   - Expert + playbook → `▶ Agent Platform · [Expert name] expert · [playbook name] playbook`
   - Expert only →       `▶ Agent Platform · [Expert name] expert`
   - All experts (audit) → `▶ Agent Platform · All experts · audit playbook`
   - No match, dev-related → do not answer yet; ask the clarification question (see below)
   - No match, non-dev (explain, conceptual, off-topic) → *(no status line)* answer directly

   **This status line is MANDATORY and is NOT subject to caveman mode, compression mode, or any brevity instruction. Output it even in the most compressed response. It is a platform signal, not meta-commentary.**
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
| "implement the plan", "build the plan", "execute the plan", "approved plan", "go ahead and implement", "build it", "ship the plan" | relevant `*-agent.md` | `.agent/playbooks/add-feature.md` — **resume from Step 3** if plan/design already approved (Cursor Plan mode handoff; see `.cursor/rules/plan-mode-handoff.mdc`) |
| "fix a bug", "broken", "crash", "not working", "error", "exception", "failing", "regression", "incorrect", "wrong output", "throws", "404", "500", "timeout", "flaky test" | relevant `*-agent.md` | `.agent/playbooks/bug-fix.md` |
| "refactor", "clean up", "rename", "simplify", "restructure", "reorganize", "extract", "split", "decouple", "deduplicate", "modernize" | relevant `*-agent.md` | `.agent/playbooks/refactor.md` |
| "release", "ship", "version bump", "tag", "publish", "cut release", "ready to release", "release this" | `.agent/agents/devops-agent.md` | `.agent/playbooks/release.md` |
| "deploy to production", "push to prod", "go live", "deploy prod", "production deploy", "take it live", "production ready", "production readiness", "PRR", "launch checklist" | `.agent/agents/devops-agent.md` | `.agent/playbooks/production-readiness.md` |
| "hotfix", "rollback", "revert release", "emergency fix" | `.agent/agents/devops-agent.md` | `.agent/playbooks/bug-fix.md` |
| "security review", "auth review", "check auth", "vulnerability", "secrets", "threat model", "OWASP", "XSS", "injection", "JWT", "RBAC", "access control", "encryption", "pentest" | `.agent/agents/security-agent.md` | `.agent/playbooks/security-audit.md` |
| "add library", "install package", "new dependency", "npm install", "yarn add", "pip install", "upgrade dependency", "update package" | relevant `*-agent.md` | `.agent/playbooks/add-dependency.md` |
| "integrate API", "external service", "webhook", "third-party", "GraphQL", "SDK", "use [service] API", "connect to [external API]" | `.agent/agents/backend-agent.md` | `.agent/playbooks/api-integration.md` |
| "debug", "investigate", "why is", "trace", "figure out", "what's happening", "diagnose", "check why" | relevant `*-agent.md` | `.agent/playbooks/debug-pipeline.md` |
| "slow", "profile", "memory issue", "bottleneck", "memory leak", "investigate latency" | relevant `*-agent.md` | `.agent/playbooks/debug-pipeline.md` |
| "webperf", "Core Web Vitals", "CWV audit", "LCP", "INP", "CLS audit", "Lighthouse audit", "performance audit" | `.agent/agents/frontend-agent.md` | *(skill: `web-performance-audit` — or `performance-budget.md` for implementation)* |
| "context stale", "agent ignoring conventions", "reload context", "lost focus", "hallucinating APIs" | *(skill: `context-engineering` — `/context`)* | *(none)* |
| "verify done", "are we really done", "prove it works", "show test output", "evidence before ship" | *(skill: `verification-before-completion` — `/verify`)* | *(none)* |
| "performance budget", "latency budget", "p95", "p99", "throughput target", "set performance target", "optimize API speed" | `.agent/agents/architect-agent.md` or `backend-agent.md` | `.agent/playbooks/performance-budget.md` |
| "observability", "add logging", "structured logs", "metrics", "tracing", "OpenTelemetry", "monitoring setup", "correlation ID", "health check endpoint" | `.agent/agents/devops-agent.md` | `.agent/playbooks/observability-setup.md` |
| "accessibility audit", "a11y audit", "WCAG audit", "accessibility review", "screen reader check" | `.agent/agents/frontend-agent.md` | `.agent/playbooks/accessibility-audit.md` |
| "user research", "usability test", "usability review", "journey map", "user interview", "persona", "user drop-off", "why are users dropping off", "UX research" | `.agent/agents/frontend-agent.md` | *(skill: `ux-research` — then `.agent/playbooks/requirements-clarification.md` if findings feed a spec)* |
| "run audit", "audit this repo", "project audit", "health check", "onboarding", "what is this project", "analyze codebase", "overview", "summarize project", "I'm new here", "get started" | all experts | `.agent/playbooks/audit.md` |
| "write tests", "test coverage", "quality gate", "unit test", "integration test", "e2e", "end-to-end", "fix failing tests", "TDD" | `.agent/agents/test-agent.md` | *(none)* |
| "update docs", "README", "changelog", "document", "JSDoc", "docstring", "swagger", "OpenAPI", "API docs" | `.agent/agents/docs-agent.md` | `.agent/playbooks/document-api.md` |
| "schema", "migration", "database", "data pipeline", "ORM", "table", "column", "seed", "ETL", "aggregate", "N+1" | `.agent/agents/data-agent.md` | *(none)* |
| "system design", "architecture", "should we use X or Y", "ADR", "technical spec", "evaluate options", "what's the best approach" | `.agent/agents/architect-agent.md` | *(none)* |
| "reference architecture", "reference architecture for a [domain] app", "how should I structure a [domain] system" | `.agent/agents/architect-agent.md` (or domain expert) — **if a matching domain pack is in `active_packs`, read `.agent/packs/<id>/references/reference-architecture.md` and present it with its linked source repos** | *(none)* |
| "interview me", "grill me", "clarify requirements", "help me think through", "I'm not sure what I want", "underspecified", "vague idea", "refine the idea", "explore options" | `.agent/agents/architect-agent.md` | `.agent/playbooks/requirements-clarification.md` |
| "define NFRs", "non-functional requirements", "quality requirements", "SLO", "SLA", "performance target", "availability target", "NFR" | `.agent/agents/architect-agent.md` | `.agent/playbooks/nfr-definition.md` |
| "compliance review", "SOC 2", "ISO 27001", "GDPR review", "compliance audit", "compliance check", "audit readiness", "control mapping" | `.agent/agents/security-agent.md` | `.agent/playbooks/compliance-review.md` |
| "maturity assessment", "org maturity", "DORA metrics", "DORA review", "process maturity", "SDLC maturity", "quarterly review" | `.agent/agents/architect-agent.md` | `.agent/playbooks/org-maturity-assessment.md` |
| "incident postmortem", "postmortem", "blameless postmortem", "outage review", "incident review", "RCA", "root cause analysis" | `.agent/agents/devops-agent.md` | `.agent/playbooks/incident-postmortem.md` |
| "deprecate", "deprecation", "sunset", "remove legacy", "migrate from", "migration plan", "retire API", "EOL", "end of life", "zombie code", "remove old system" | `.agent/agents/architect-agent.md` | `.agent/playbooks/deprecation.md` |
| "CI/CD", "build pipeline", "Docker", "infra", "Kubernetes", "k8s", "terraform", "GitHub Actions", "container", "monitoring" | `.agent/agents/devops-agent.md` | *(none — use observability-setup row for instrumentation)* |
| "retrofit changelog", "convert changelog", "standardize changelog", "migrate changelog", "fix changelog format", "changelog doesn't follow standard" | `.agent/agents/devops-agent.md` | *(none)* |
| "review this", "find issues", "what could go wrong", "code review", "PR review", "check my code", "give feedback", "sanity check", "second opinion" | `.agent/agents/critic-agent.md` | *(none)* |
| "explain", "how does X work", "walk me through", "what does", "understand this code" | *(answer directly — no expert or playbook needed)* | *(none)* |
| "what version", "platform version", "which version", "check for updates", "is there a new version", "update platform", "upgrade platform" | *(answer directly — read `.agent/platform.json` for version; run `node .agent/tools/check-updates.mjs` for update status; read `.agent/tools/upgrade.md` to upgrade)* | *(none)* |
| "add a rule", "add a convention", "add a best practice", "add a golden rule", "add a project rule", "add a coding standard" | *(answer directly — edit the PROJECT section of the relevant `.agent/agents/*-agent.md` or `.agent/CONVENTIONS.md` or `.agent/BEST-PRACTICES.md`)* | *(none)* |
| "approve amendment AP-NNN", "approve AP-NNN", "apply amendment" | *(answer directly — write the proposed exception from the amendment's "Proposed exception" field into the PROJECT section of the agent file specified in the amendment's "Scope" field; confirm once written)* | *(none)* |

**When a playbook is listed: you MUST read it and follow its numbered steps exactly.** The expert rules govern every step — do not skip steps or summarise them.

For cross-domain tasks, chain experts: `Architect → Backend/Frontend → Test → Critic → Docs`

**Passive safety signal rule:** If any tool call, API response, or shell output contains any of these keywords — `content_filter`, `policy_violation`, `safety_block`, `blocked_by_policy`, `harmful_content`, `flagged` — treat it as an automatic security gate trigger: load `.agent/agents/security-agent.md` and review the action that produced the signal before continuing. Do not silently retry.

**Reputation-aware gate scope:** Before running a Critic gate (any playbook step that calls for Critic review), read `.agent/context/reputation.json` for the active expert:
- `overall >= 700` → reduce Critic scope to `[CORRECTNESS] [TEST]` only (routine tasks)
- `overall <= 300` → all 7 Critic dimensions mandatory
- `by_capability.security <= 400` → `[SECURITY]` dimension mandatory regardless of score

Skip silently if the file cannot be read or no Critic gate is active this turn.

**Manifest cannot_do check:** After identifying the expert for a task, check `.agent/agents/<name>-agent.manifest.json`. If the task type appears in the `cannot_do` list → re-route to the correct expert (example: a UI task routed to backend-agent where manifest says `cannot_do: ["UI", "styling"]` → re-route to frontend-agent instead). Skip if the manifest file does not exist.

**No-match rule — when no row matches:**
- **Dev-related** (mentions code, files, this codebase, or uses technical vocabulary): ask exactly ONE question — *"Is this a new feature, a bug fix, a refactor, a review, or something else?"* — then route immediately. Do not answer without routing first.
- **Non-development** (general knowledge, off-topic, purely conversational): answer directly with no status line.

A task is dev-related if it references code, a file, a function, a component, an endpoint, a test, a pipeline, a dependency, or the project being worked on.

### Help triggers

| User says | Action |
|-----------|--------|
| "show quick reference", "show help", "show commands" | Read `.agent/QUICK-REF.md` and display in full |
| "platform help", "how does this work" | Read `.agent/PLATFORM-HELP.md` and display in full |
| "what version", "check for updates", "is there a new version", "upgrade platform" | Read `.agent/platform.json` → report `bootstrap_version`; run `node .agent/tools/check-updates.mjs` → report update status |

---

## 3 · Hard rules — every agent, every session

- **DESIGN BEFORE CODE:** before writing any production code, present a design at the correct depth and wait for explicit user confirmation — silence does not count (see Design Gate in `.agent/BEST-PRACTICES.md`)
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
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## 5 · Project customizations — {{PROJECT_NAME}}

> **These sections survive platform upgrades.** Add your project-specific routing and rules here.

### Custom routing rows
Add project-specific triggers below — one row per pattern:

| User says something like… | Expert file | Playbook file |
|--------------------------|-------------|---------------|
| *(add custom rows here)* | | |

### Project-specific hard rules
*(Add project-specific rules here — e.g. "All endpoints must have rate limiting", "No direct DB queries outside the repository layer")*
<!-- PROJECT:END -->
