# {{PROJECT_NAME}} — Agent Platform Quick Reference

> Open this file in your editor any time you need it.
> Say `"show quick reference"` to your agent and it will point you here.

| | |
|---|---|
| **Framework** | <fw> |
| **Version** | {{BOOTSTRAP_VERSION}} |
| **Full guide** | `.agent/PLATFORM-HELP.md` |
| **Online guide** | https://github.com/{{PLATFORM_REPO}}/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md |

---

## Session

| Action | Say to your agent |
|--------|------------------|
| Start session | `Read .agent/session-start.md and execute it.` |
| End session | `Read .agent/session-end.md and execute it.` |

> **Switching IDEs?** Session start automatically offers a Critic review of the previous IDE's work — different AI models catch each other's blind spots. Say YES to run it.

---

## Expert Agents
**Auto-routing is always on — just describe your task. The right expert loads automatically.**
When routing fires, your agent's first line declares what was loaded: `▶ Backend expert · bug-fix playbook`
When no routing applies (explain, conceptual), no prefix appears — the agent answers directly.

| Expert | Your task sounds like… |
|--------|----------------------|
| Architect | "system design", "should we use X or Y", "ADR", "evaluate options", cross-cutting change |
| Backend | "add an endpoint", "fix the API", "write a service", server or DB logic |
| Frontend | "update the UI", "new component", "new page", "fix the styling", client state |
| DevOps | "set up CI", "fix the build", "deployment", Docker, Kubernetes, infra scripts |
| Test | "write tests", "unit test", "e2e", "coverage is low", "fix failing tests", TDD |
| Docs | "update README", "JSDoc", "document this endpoint", "swagger", "write the changelog" |
| Security | "auth review", "check for vulnerabilities", "threat model", "OWASP", "JWT", "RBAC" |
| Data | "schema change", "migration", "data pipeline", "ORM", "N+1", "transform data" |
| **Critic** | **"review this", "code review", "find issues", "sanity check", "what could go wrong"** |

---

## Playbooks
**Describe the situation — the right playbook loads automatically.**

| Your situation | Playbook |
|---------------|---------|
| First time in this repo / onboarding / health check | **Full Project Audit** — 8-domain professional report saved to `.agent/context/audit-[date].md` |
| Starting new feature work | Add feature — scopes, designs, implements, tests, Critic reviews |
| Something is broken | Bug fix — reproduces, root-causes, fixes, regression test |
| "hotfix", "rollback", "emergency fix" | Bug fix playbook via devops-agent — reproduce, fix, regression test |
| "clean up this area" (tests must exist first) | Refactor — safe incremental refactor with Critic gate |
| "something's wrong but I don't know why" | Debug pipeline — systematic diagnosis |
| "slow", "performance", "memory leak", "bottleneck" | Debug pipeline — profile, isolate, fix |
| Ready to ship a version | Release — docs gate, security review, tag, release notes |
| Security review before release | Security audit — OWASP Top 10, findings with severity |
| "I need to add [package/library]" | Add dependency — vets, installs, validates |
| Integrating an external API or service | API integration — contract, auth, error handling, tests |

---

## Project Knowledge
**Open these files in your editor to read or update. Your agent reads them automatically when relevant.**

| File | Contains |
|------|---------|
| [.agent/handoff/CURRENT.md](.agent/handoff/CURRENT.md) | Last session: goal, files changed, Critic review status |
| [.agent/handoff/sync/registry.yaml](.agent/handoff/sync/registry.yaml) | Which IDE is active, file ownership, conflict prevention |
| [.agent/context/adr-log.md](.agent/context/adr-log.md) | Architecture decisions that are hard to reverse |
| [.agent/context/known-issues.md](.agent/context/known-issues.md) | Known bugs and limitations to fix later |
| [.agent/context/patterns.md](.agent/context/patterns.md) | Reusable approaches that worked — agents check this before implementing |
| [.agent/BEST-PRACTICES.md](.agent/BEST-PRACTICES.md) | Project-specific coding rules and golden rules |
| [.agent/context/docs-registry.md](.agent/context/docs-registry.md) | Registered docs, owners, freshness status |

---

## Testing
**Tell your agent — it handles the rest.**

| Your task | Say to agent |
|-----------|-------------|
| Write tests for a component | "write tests for [component name]" |
| Improve test coverage | "coverage is low — what's missing?" |
| Regression test after a fix | Happens automatically via bug-fix playbook |
| Full test suite + quality gate | "run the test suite and check coverage" |

> **Coverage report** — after any coverage run, open `coverage/lcov-report/index.html` in your browser.
> Line-by-line view: green = covered, red = not covered. Generated automatically by the Test expert.

---

## Token Compression (Caveman)

| Action | Say to agent | Effect |
|--------|-------------|--------|
| Enable | "caveman mode" | ~65% shorter output, same accuracy |
| Disable | "stop caveman" | Return to normal output |
| Compress a file | "caveman compress [path]" | Compress a context file ~46% |

> Use caveman for long implementation sessions or when context is getting large.
> Your normal work output is unaffected — it is always your choice.

---

## Extend This Platform

| What you can add | Where it goes | Say to agent |
|-----------------|---------------|-------------|
| New expert agent | `.agent/agents/<name>-agent.md` | "Add a new expert agent for [domain]" |
| New playbook | `.agent/playbooks/<name>.md` | "Add a new playbook for [scenario]" |
| New shared skill | `.agent/skills/<name>/` | "Add a new skill called [name] that [does X]" |
| New context file | `.agent/context/<name>.md` | "Add a context file tracking [what]" |
| 5th IDE framework | `.<name>/` private folder | "Add [Windsurf/Cline/etc.] as a 5th framework" |
| New best practice | `.agent/BEST-PRACTICES.md` | "Add a new golden rule: [rule]" |
| API conventions | `.agent/context/api-patterns.md` | "Add API pattern: [convention]" |

> For all extensions: describe what you want — your agent handles the implementation and registers it correctly.

---

## Platform Operations
**Terminal commands — run in your project root.**

| Action | Command |
|--------|---------|
| Check for updates | Tell agent: "check for platform updates" |
| Upgrade | `npx {{PLATFORM_NPX}} --mode=upgrade` |
| Install global stubs (user-level, run once) | `npx {{PLATFORM_NPX}} --mode=global` |
| Remove global stubs | `npx {{PLATFORM_NPX}} --mode=uninstall-global` |
| Install enforcement guards | `npx {{PLATFORM_NPX}} --mode=install-guards` |
| Remove guards | `npx {{PLATFORM_NPX}} --mode=remove-guards` |
| Repair | `npx {{PLATFORM_NPX}} --mode=repair` |
| Remove platform | `npx {{PLATFORM_NPX}} --mode=uninstall` |
