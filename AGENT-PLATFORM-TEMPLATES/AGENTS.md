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

You are the active router. When the user describes a task, immediately and silently:
1. Identify the matching row in the table below
2. **READ the expert file** listed in the "Expert file" column
3. **READ the playbook file** listed in the "Playbook file" column (if one is listed)
4. Begin working — follow the playbook steps in order, applying the expert rules at every step
5. Never announce what you are reading. Never ask which file to load.

| User says something like… | Expert file | Playbook file |
|--------------------------|-------------|---------------|
| "add a feature", "implement X", "new endpoint" | `.agent/agents/backend-agent.md` or `frontend-agent.md` | `.agent/playbooks/add-feature.md` |
| "fix a bug", "broken", "crash", "not working", "validate", "missing check" | relevant `*-agent.md` | `.agent/playbooks/bug-fix.md` |
| "refactor", "clean up", "rename", "simplify" | relevant `*-agent.md` | `.agent/playbooks/refactor.md` |
| "deploy", "release", "ship", "version bump" | `.agent/agents/devops-agent.md` | `.agent/playbooks/release.md` |
| "security review", "auth", "vulnerability", "secrets" | `.agent/agents/security-agent.md` | `.agent/playbooks/security-audit.md` |
| "add library", "install package", "new dependency" | relevant `*-agent.md` | `.agent/playbooks/add-dependency.md` |
| "integrate API", "external service", "connect to" | `.agent/agents/backend-agent.md` | `.agent/playbooks/api-integration.md` |
| "debug", "investigate", "why is", "trace" | relevant `*-agent.md` | `.agent/playbooks/debug-pipeline.md` |
| "write tests", "test coverage", "quality gate" | `.agent/agents/test-agent.md` | *(none)* |
| "update docs", "README", "changelog", "document" | `.agent/agents/docs-agent.md` | *(none)* |
| "schema", "migration", "database", "data pipeline" | `.agent/agents/data-agent.md` | *(none)* |
| "design", "architecture", "should we use X or Y" | `.agent/agents/architect-agent.md` | *(none)* |
| "CI/CD", "build pipeline", "Docker", "infra" | `.agent/agents/devops-agent.md` | *(none)* |
| "review this", "find issues", "what could go wrong" | `.agent/agents/critic-agent.md` | *(none)* |

**When a playbook is listed: you MUST read it and follow its numbered steps exactly.** The expert rules govern every step — do not skip steps or summarise them.

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
- **NEVER run session-end automatically.** Session end is triggered ONLY when the user explicitly says "End session." or "Read .agent/session-end.md". Completing a task is NOT a reason to end the session.

---

## 4 · Cross-framework coordination

- Shared hub: `.agent/` — all frameworks read and write here
- Private folders: `.claude/` `.cursor/` `.agents/` `.codex/` — never edit other frameworks' private folders
- Registry: `.agent/handoff/sync/registry.yaml` — active-framework lock
- Handoff log: `.agent/handoff/CURRENT.md` — session history and next-agent notes
