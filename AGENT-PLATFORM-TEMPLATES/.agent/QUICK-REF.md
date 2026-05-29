# {{PROJECT_NAME}} — Agent Platform Quick Reference

> **When executing this as a user command:** display the FULL table — every section, every row. Do NOT summarise.
> **Re-show this any time:** say `"show quick reference"` or `"show help"`
> **Full local help:** say `"platform help"` or `"how does this work"`

| | |
|---|---|
| **Framework** | <fw> |
| **Version** | {{BOOTSTRAP_VERSION}} |
| **Local help** | `Read .agent/PLATFORM-HELP.md` |
| **Full guide** | https://github.com/zafrirron/Agent-Platform/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md |
| **Repository** | https://github.com/zafrirron/Agent-Platform |

---

## Session

| Action | Command |
|--------|---------|
| Start session | `Read .agent/session-start.md and execute it.` |
| End session | `Read .agent/session-end.md and execute it.` |

---

## Expert Agents — activate when your task has a clear domain

| Agent | Say this or start a task like… | Command |
|-------|-------------------------------|---------|
| Architect | "design a new feature", "should we use X or Y", "new component", cross-cutting change | `Read .agent/agents/architect-agent.md` |
| Backend | "add an endpoint", "fix the API", "write a service", server or database logic | `Read .agent/agents/backend-agent.md` |
| Frontend | "update the UI", "new component", "client state", styling or UX | `Read .agent/agents/frontend-agent.md` |
| DevOps | "set up CI", "fix the build", "deployment", Docker, infra scripts | `Read .agent/agents/devops-agent.md` |
| Test | "write tests", "coverage is low", "regression test", quality gate | `Read .agent/agents/test-agent.md` |
| Docs | "update README", "changelog", "document this endpoint" | `Read .agent/agents/docs-agent.md` |
| Security | "auth review", "check for secrets", "threat model", before a sensitive release | `Read .agent/agents/security-agent.md` |
| Data | "schema change", "migration", "data pipeline", "transform data" | `Read .agent/agents/data-agent.md` |

---

## Playbooks — step-by-step workflows with agent assignments

| Trigger | Playbook | Command |
|---------|---------|---------|
| Starting new feature work | Add feature | `Read .agent/playbooks/add-feature.md` |
| Something is broken | Bug fix | `Read .agent/playbooks/bug-fix.md` |
| "clean up this area" (tests must exist first) | Refactor | `Read .agent/playbooks/refactor.md` |
| "something's wrong but I don't know why" | Debug | `Read .agent/playbooks/debug-pipeline.md` |
| Ready to ship a version | Release | `Read .agent/playbooks/release.md` |
| Security review before release | Security audit | `Read .agent/playbooks/security-audit.md` |
| "I need to add [package/library]" | Add dependency | `Read .agent/playbooks/add-dependency.md` |
| Integrating an external API or service | API integration | `Read .agent/playbooks/api-integration.md` |

---

## Project Knowledge

| Action | When to use | Command |
|--------|------------|---------|
| Best practices | Before any non-trivial task | `Read .agent/BEST-PRACTICES.md` |
| Check registry | Confirm no other IDE is editing overlapping files | `Read .agent/handoff/sync/registry.yaml` |
| See handoff log | Pick up where the last session left off | `Read .agent/handoff/CURRENT.md` |
| Log ADR | Recording a hard-to-reverse design decision | `Read .agent/context/adr-log.md` |
| Log known issue | Noting a bug or limitation to fix later | `Read .agent/context/known-issues.md` |

---

## Testing

| Action | Command |
|--------|---------|
| Run tests | `{{TEST_RUNNER}}` |
| Check coverage | `{{COVERAGE_CMD}}` |
| Load test expert | `Read .agent/agents/test-agent.md` |

> If commands show `<fill-in …>` — set your test runner in `.agent/CONVENTIONS.md` under `## Testing`.

---

## Token Compression (Caveman)

| Action | Command | Effect |
|--------|---------|--------|
| Caveman on | `"caveman mode"` | ~65% shorter agent output, same accuracy |
| Caveman off | `"stop caveman"` | Return to normal output |
| Compress file | `"caveman compress <path>"` | Compress a context file ~46% |

---

## Extend This Platform

| What you can add | Where it goes | How |
|-----------------|---------------|-----|
| New expert agent | `.agent/agents/<name>-agent.md` | Tell the agent: "Add a new expert agent for [domain]" |
| New playbook | `.agent/playbooks/<name>.md` | Tell the agent: "Add a new playbook for [scenario]" |
| New shared skill | `.agent/skills/<name>/` | Tell the agent: "Add a new skill called [name] that [does X]" |
| New context file | `.agent/context/<name>.md` | Tell the agent: "Add a context file tracking [what]" |
| 5th IDE framework | `.<name>/` private folder | Tell the agent: "Add [Windsurf/Cline/etc.] as a 5th framework" |
| New best practice | `.agent/BEST-PRACTICES.md` | Tell the agent: "Add a new golden rule: [rule]" |
| API conventions | `.agent/context/api-patterns.md` | Tell the agent: "Add API pattern: [convention]" |

> For all extensions: tell your agent the request above, then follow the 7-step extension anatomy in the full guide.

---

## Platform

| Action | Command |
|--------|---------|
| Local help | `Read .agent/PLATFORM-HELP.md` |
| Check for updates | `node .agent/tools/check-updates.mjs` |
| Agent self-upgrade | `Read .agent/tools/upgrade.md and execute it.` |
| Install enforcement guards | `npx github:zafrirron/Agent-Platform --mode=install-guards` |
| Remove guards | `npx github:zafrirron/Agent-Platform --mode=remove-guards` |
| Remove platform | `npx github:zafrirron/Agent-Platform --mode=uninstall` |
| Install | `npx github:zafrirron/Agent-Platform` |
| Upgrade | `npx github:zafrirron/Agent-Platform --mode=upgrade` |
| Repair | `npx github:zafrirron/Agent-Platform --mode=repair` |
