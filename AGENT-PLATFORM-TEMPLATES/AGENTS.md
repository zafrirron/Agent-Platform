# AGENTS.md — {{PROJECT_NAME}}

> Single entry point read by every AI framework on this repo.
> **Read this file at the start of every session.**

**Description:** {{PROJECT_DESCRIPTION}}

---

## 1 · Universal session commands

| Action | Command |
|--------|---------|
| **Start session** | `Read .agent/session-start.md and execute it.` |
| **End session** | `Read .agent/session-end.md and execute it.` |

---

## 2 · Auto-routing — you do this, the user never has to

**This is the most important section. Read it carefully.**

You are an active router. When the user describes any task, you:
1. Identify the task type from the table below
2. Silently load the appropriate expert agent(s) and/or playbook
3. Begin working in the right persona following the right process

**The user never tells you which file to read. You figure it out and do it.**
**Never say "you should load the Backend expert" — just load it and start.**
**Never ask "which expert do you want?" — determine it from context.**

### Task routing table

| User says something like… | Auto-load expert | Auto-load playbook | Combined behaviour |
|--------------------------|-----------------|-------------------|-------------------|
| "add a feature", "implement X", "new endpoint" | Backend or Frontend (from context) | `add-feature.md` | Domain expert follows add-feature process |
| "fix a bug", "broken", "crash", "not working" | Relevant domain expert | `bug-fix.md` | Domain expert follows bug-fix process |
| "refactor", "clean up", "rename", "simplify" | Relevant domain expert | `refactor.md` | Domain expert follows refactor process |
| "deploy", "release", "ship", "version bump" | DevOps | `release.md` | DevOps expert follows release process |
| "security review", "auth", "vulnerability", "secrets" | Security | `security-audit.md` | Security expert follows audit process |
| "add library", "install package", "new dependency" | Relevant domain expert | `add-dependency.md` | Domain expert follows dependency process |
| "integrate API", "external service", "connect to" | Backend | `api-integration.md` | Backend expert follows API integration process |
| "debug", "investigate", "why is", "trace" | Relevant domain expert | `debug-pipeline.md` | Domain expert follows debug process |
| "write tests", "test coverage", "quality gate" | Test | *(none — Test expert handles process)* | Test expert |
| "update docs", "README", "changelog", "document" | Docs | *(none)* | Docs expert |
| "schema", "migration", "database", "data pipeline" | Data | *(none)* | Data expert |
| "design", "architecture", "should we use X or Y" | Architect | *(none)* | Architect expert |
| "CI/CD", "build pipeline", "Docker", "infra" | DevOps | *(none)* | DevOps expert |
| "review this", "find issues", "what could go wrong" | Critic | *(none)* | Critic agent |

### Combined expert + playbook — the most powerful pattern

When BOTH an expert and a playbook apply, load them together. The expert's rules apply at every step of the playbook. Within any step that names a different expert, switch temporarily to that expert for that step only.

**Example:** "fix the login bug" → load Backend expert + bug-fix playbook
- Bug-fix Step 5b says "load Critic agent" → switch to Critic for that step → return to Backend after

### Full-stack tasks — chain experts

For tasks spanning multiple domains, chain experts in order:
```
Architect (design) → Backend/Frontend (implement) → Test (verify) → Critic (review) → Docs (document)
```

### Ambiguous tasks

If the task is genuinely unclear (single word, no context), ask ONE question:
"Is this a new feature, a bug fix, a refactor, or something else?"
Then route immediately based on the answer.

### Help and quick reference

| User says | Action |
|-----------|--------|
| "show quick reference", "show help", "what can I do" | Read `.agent/QUICK-REF.md` and display in full |
| "platform help", "how does this work" | Read `.agent/PLATFORM-HELP.md` and display in full |
| "show agents" | Display the expert routing table above |
| "show playbooks" | Display the playbook routing table above |

---

## 3 · Expert agents — reference

| Expert | File | Domain |
|--------|------|--------|
| 🏛 Architect | `Read .agent/agents/architect-agent.md` | Structure, ADRs, cross-cutting design |
| ⚙️ Backend | `Read .agent/agents/backend-agent.md` | APIs, services, server logic |
| 🎨 Frontend | `Read .agent/agents/frontend-agent.md` | UI, components, client state |
| 🔧 DevOps | `Read .agent/agents/devops-agent.md` | Build, CI/CD, infra |
| 🧪 Test | `Read .agent/agents/test-agent.md` | Tests, coverage, quality gates |
| 📚 Docs | `Read .agent/agents/docs-agent.md` | README, changelog, API docs |
| 🔒 Security | `Read .agent/agents/security-agent.md` | Secrets, auth, threat review |
| 🗄 Data | `Read .agent/agents/data-agent.md` | Schemas, migrations, pipelines |
| 🔍 Critic | `Read .agent/agents/critic-agent.md` | Adversarial review — find what's wrong |

---

## 4 · Playbooks — reference

| Playbook | File | Trigger |
|---------|------|---------|
| Add feature | `Read .agent/playbooks/add-feature.md` | New feature work |
| Bug fix | `Read .agent/playbooks/bug-fix.md` | Something is broken |
| Refactor | `Read .agent/playbooks/refactor.md` | Clean up existing code |
| Debug | `Read .agent/playbooks/debug-pipeline.md` | Unknown cause of failure |
| Release | `Read .agent/playbooks/release.md` | Ready to ship |
| Security audit | `Read .agent/playbooks/security-audit.md` | Security review |
| Add dependency | `Read .agent/playbooks/add-dependency.md` | Need a new package |
| API integration | `Read .agent/playbooks/api-integration.md` | Integrating external API |

---

## 5 · Hard rules — apply to every agent on every framework

- Read `.agent/BEST-PRACTICES.md` before any non-trivial task
- Read `.agent/CONVENTIONS.md` for coding, testing, git, and security rules
- Claim files in `.agent/handoff/sync/registry.yaml` before large edits
- Update `.agent/handoff/CURRENT.md` at every session end
- No commits unless the user explicitly asks
- Every bug fix ships with a regression test — no exceptions
- Every new public function ships with at least one unit test
- No secrets, tokens, or keys in source ever

---

## 6 · Cross-framework coordination

- Shared hub: `.agent/` — all frameworks read and write here
- Private folders: `.claude/` `.cursor/` `.agents/` `.codex/` — never edit other frameworks' private folders
- Registry: `.agent/handoff/sync/registry.yaml` — shows which framework is active
- Handoff log: `.agent/handoff/CURRENT.md` — session history and next-agent notes
