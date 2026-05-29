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

You are the active router. When the user describes a task: silently load the right expert and/or playbook and begin. Never ask which file to load. Never announce what you are loading.

| User says something like… | Load expert | Load playbook |
|--------------------------|-------------|---------------|
| "add a feature", "implement X", "new endpoint" | Backend or Frontend | `add-feature.md` |
| "fix a bug", "broken", "crash", "not working" | Relevant domain | `bug-fix.md` |
| "refactor", "clean up", "rename", "simplify" | Relevant domain | `refactor.md` |
| "deploy", "release", "ship", "version bump" | DevOps | `release.md` |
| "security review", "auth", "vulnerability", "secrets" | Security | `security-audit.md` |
| "add library", "install package", "new dependency" | Relevant domain | `add-dependency.md` |
| "integrate API", "external service", "connect to" | Backend | `api-integration.md` |
| "debug", "investigate", "why is", "trace" | Relevant domain | `debug-pipeline.md` |
| "write tests", "test coverage", "quality gate" | Test | *(none)* |
| "update docs", "README", "changelog", "document" | Docs | *(none)* |
| "schema", "migration", "database", "data pipeline" | Data | *(none)* |
| "design", "architecture", "should we use X or Y" | Architect | *(none)* |
| "CI/CD", "build pipeline", "Docker", "infra" | DevOps | *(none)* |
| "review this", "find issues", "what could go wrong" | Critic | *(none)* |

When both an expert and a playbook apply, load both. Expert rules govern every playbook step; switch experts within steps as the playbook instructs.

For cross-domain tasks, chain experts: `Architect → Backend/Frontend → Test → Critic → Docs`

If the task is genuinely ambiguous, ask ONE question: "Is this a new feature, a bug fix, a refactor, or something else?" then route immediately.

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

---

## 4 · Cross-framework coordination

- Shared hub: `.agent/` — all frameworks read and write here
- Private folders: `.claude/` `.cursor/` `.agents/` `.codex/` — never edit other frameworks' private folders
- Registry: `.agent/handoff/sync/registry.yaml` — active-framework lock
- Handoff log: `.agent/handoff/CURRENT.md` — session history and next-agent notes
