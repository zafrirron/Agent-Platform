# AGENTS.md — {{PROJECT_NAME}}

> Single entry point for **every** AI framework on this repo. Read first, every session.

**Description:** {{PROJECT_DESCRIPTION}}

---

## 1 · Session commands (universal — any IDE)

| Action | Command |
|--------|---------|
| **Start session** | `Read .agent/session-start.md and execute it.` |
| **End session** | `Read .agent/session-end.md and execute it.` |

---

## 2 · Help and quick reference

| You say | What happens |
|---------|-------------|
| `"show quick reference"` or `"show help"` | Read `.agent/QUICK-REF.md` and display the full table |
| `"help me"` or `"what can I do"` | Read `.agent/QUICK-REF.md` and display the full table |
| `"platform help"` or `"how does this work"` | Read `.agent/PLATFORM-HELP.md` and display it in full |
| `"show agents"` or `"what agents are available"` | Display the expert agents table from QUICK-REF.md |
| `"show playbooks"` or `"what playbooks are available"` | Display the playbooks table from QUICK-REF.md |
| `"review this"` or `"critic review"` or `"find issues"` | Read `.agent/agents/critic-agent.md` and review the current work |
| `"what could go wrong"` or `"adversarial review"` | Read `.agent/agents/critic-agent.md` and review the current work |

---

## 3 · Software expert agents

Eight domain specialists — definitions in `.agent/agents/`:

| Agent | File | Domain |
|-------|------|--------|
| 🏛 Architect | `architect-agent.md` | Structure, standards, ADRs, platform |
| ⚙️ Backend | `backend-agent.md` | APIs, services, server logic |
| 🎨 Frontend | `frontend-agent.md` | UI, client apps, UX |
| 🔧 DevOps | `devops-agent.md` | Build, CI/CD, release, infra scripts |
| 🧪 Test | `test-agent.md` | Tests, fixtures, quality gates |
| 📚 Docs | `docs-agent.md` | User & developer documentation |
| 🔒 Security | `security-agent.md` | Secrets, auth, threat review |
| 🗄 Data | `data-agent.md` | Schemas, migrations, pipelines |
| 🔍 Critic | `critic-agent.md` | Adversarial review — find what's wrong before production does |

**Activate:** `Read .agent/agents/<name>-agent.md` then describe your task.

---

## 4 · Playbooks

Eight step-by-step workflows — definitions in `.agent/playbooks/`:

| Playbook | File | Trigger |
|---------|------|---------|
| Add feature | `add-feature.md` | Starting new feature work |
| Bug fix | `bug-fix.md` | Something is broken |
| Refactor | `refactor.md` | Clean up existing code |
| Debug | `debug-pipeline.md` | Something's wrong, cause unknown |
| Release | `release.md` | Ready to ship a version |
| Security audit | `security-audit.md` | Security review before release |
| Add dependency | `add-dependency.md` | Need a new package |
| API integration | `api-integration.md` | Integrating an external API |

**Run:** `Read .agent/playbooks/<name>.md` then describe the task.

---

## 5 · Hard rules (apply to every agent on every framework)

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
- Private folders: `.claude/` `.cursor/` `.agents/` `.codex/` — do NOT edit other frameworks' private folders
- Registry: `.agent/handoff/sync/registry.yaml` — shows which framework is active
- Handoff log: `.agent/handoff/CURRENT.md` — session history and next-agent notes
