# {{PROJECT_NAME}} — Agent Platform Quick Reference

| | |
|---|---|
| **Framework** | <fw> |
| **Version** | {{BOOTSTRAP_VERSION}} |
| **Full guide** | https://github.com/zafrirron/Agent-Platform/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md |
| **Repository** | https://github.com/zafrirron/Agent-Platform |

---

## Session

| Action | Command |
|--------|---------|
| Start session | `Read .<fw>/prompts/session-start.md and execute it.` |
| End session | `Read .<fw>/prompts/session-end.md and execute it.` |

---

## Expert Agents

| Agent | Command | Domain |
|-------|---------|--------|
| Architect | `Read .agent/agents/architect-agent.md` | Cross-cutting design, ADRs |
| Backend | `Read .agent/agents/backend-agent.md` | APIs, services, server logic |
| Frontend | `Read .agent/agents/frontend-agent.md` | UI, components, client state |
| DevOps | `Read .agent/agents/devops-agent.md` | CI/CD, builds, infra |
| Test | `Read .agent/agents/test-agent.md` | Tests, coverage, quality gates |
| Docs | `Read .agent/agents/docs-agent.md` | README, changelog, API docs |
| Security | `Read .agent/agents/security-agent.md` | Secrets, auth, threat review |
| Data | `Read .agent/agents/data-agent.md` | Schemas, migrations, pipelines |

---

## Playbooks

| Action | Command |
|--------|---------|
| Add feature | `Read .agent/playbooks/add-feature.md` |
| Bug fix | `Read .agent/playbooks/bug-fix.md` |
| Refactor | `Read .agent/playbooks/refactor.md` |
| Debug | `Read .agent/playbooks/debug-pipeline.md` |
| Release | `Read .agent/playbooks/release.md` |
| Security audit | `Read .agent/playbooks/security-audit.md` |
| Add dependency | `Read .agent/playbooks/add-dependency.md` |
| API integration | `Read .agent/playbooks/api-integration.md` |

---

## Project Knowledge

| Action | Command |
|--------|---------|
| Best practices | `Read .agent/BEST-PRACTICES.md` |
| Check registry | `Read .agent/handoff/sync/registry.yaml` |
| See handoff log | `Read .agent/handoff/CURRENT.md` |
| Log ADR | `Read .agent/context/adr-log.md` |
| Log known issue | `Read .agent/context/known-issues.md` |

---

## Testing

| Action | Command |
|--------|---------|
| Run tests | `{{TEST_RUNNER}}` |
| Check coverage | `{{COVERAGE_CMD}}` |
| Load test expert | `Read .agent/agents/test-agent.md` |

---

## Token Compression (Caveman)

| Action | Command |
|--------|---------|
| Caveman on | `"caveman mode"` |
| Caveman off | `"stop caveman"` |
| Compress file | `"caveman compress <path>"` |

---

## Platform

| Action | Command |
|--------|---------|
| Check for updates | `node .agent/tools/check-updates.mjs` |
| Agent self-upgrade | `Read .agent/tools/upgrade.md and execute it.` |
| Install | `npx github:zafrirron/Agent-Platform` |
| Upgrade | `npx github:zafrirron/Agent-Platform --mode=upgrade` |
| Repair | `npx github:zafrirron/Agent-Platform --mode=repair` |
| Full guide | https://github.com/zafrirron/Agent-Platform/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md |
| Extend platform | https://github.com/zafrirron/Agent-Platform/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md#extending-guide |
