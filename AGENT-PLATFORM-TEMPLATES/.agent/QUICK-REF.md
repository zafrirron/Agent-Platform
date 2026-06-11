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

> **Session ended without "End session"?** No problem — session start resumes automatically. You'll see `▶ Resuming: [your last task]` and continue where you left off.
> **Switching to a different IDE?** Session start offers a Critic review of the previous IDE's work — different AI models catch each other's blind spots. Say YES to run it.

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

> Routing keywords above are human-readable summaries. The authoritative keyword list for each expert is in `.agent/agents/<name>-agent.manifest.json` → `routing_keywords` field.

---

## Playbooks
**Describe the situation — the right playbook loads automatically.** (18 total)

| Your situation | Playbook |
|---------------|---------|
| First time in this repo / onboarding / health check | **Full Project Audit** — 11-phase report → `.agent/context/audit-[date].md` |
| Starting new feature work | Add feature — design gate, Security gate, tests, Critic |
| Something is broken | Bug fix — reproduce, fix, regression test, Critic |
| "hotfix", "rollback", "emergency fix" | Bug fix via DevOps — emergency path |
| "clean up this area" (tests must exist first) | Refactor — incremental, tests green before/after |
| "something's wrong but I don't know why" | Debug pipeline — systematic diagnosis |
| "slow", "bottleneck", "p95", "performance budget" | Performance budget — or debug pipeline for investigation |
| Ready to ship a version | Release — tests, Critic, changelog, tag |
| "go live", "production ready", "PRR" | Production readiness — P0 NFRs, compliance evidence, security |
| Security review / OWASP / pentest prep | Security audit — secrets, CVEs, OWASP API Top 10 |
| "I need to add [package/library]" | Add dependency — vet, CVE scan, document |
| Integrating an external API or service | API integration — contract-first, tests |
| "document API", "OpenAPI", "Swagger" | Document API — spec from code, Critic gate |
| "define NFRs", "SLO", "quality targets" | NFR definition — writes `nfr-log.md` |
| "observability", "metrics", "health check" | Observability setup — logs, correlation ID, alerts |
| "accessibility audit", "WCAG", "a11y" | Accessibility audit — WCAG 2.2 AA + keyboard pass |
| "compliance review", "SOC 2", "ISO 27001" | Compliance review — SDLC controls + evidence gaps |
| "DORA metrics", "maturity assessment" | Org maturity assessment — quarterly process review |
| "postmortem", "outage", "incident review" | Incident postmortem — MTTR, DORA rollup |

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
| [.agent/context/nfr-log.md](.agent/context/nfr-log.md) | Measurable quality targets (ISO 25010 / 14-category) |
| [.agent/context/compliance-evidence-log.md](.agent/context/compliance-evidence-log.md) | SOC 2 / ISO 27001 control → artifact mapping |
| [.agent/context/incident-log.md](.agent/context/incident-log.md) | Incidents, MTTR, DORA rollup |

---

## Testing
**Tell your agent — it handles the rest.**

| Your task | Say to agent |
|-----------|-------------|
| Write tests for a component | "write tests for [component name]" |
| Improve test coverage | "coverage is low — what's missing?" |
| Regression test after a fix | Happens automatically via bug-fix playbook |
| Full test suite + quality gate | "run the test suite and check coverage" |

> **Coverage reports (4 formats)** — generated automatically in `coverage/`: HTML (`lcov-report/index.html` — open in browser) · Clover XML (`clover.xml` — Jenkins/CI) · LCOV (`lcov.info` — Codecov/Coveralls) · JSON (`coverage-final.json` — scripts).

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
| New expert agent | `.agent/agents/<name>-agent.md` + `<name>-agent.manifest.json` + entry in `reputation.json` | "Add a new expert agent for [domain]" |
| New playbook | `.agent/playbooks/<name>.md` | "Add a new playbook for [scenario]" |
| Custom routing row | `AGENTS.md` Section 5 (PROJECT section) | "Add a project routing rule: [trigger] → [expert]" |
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
| What version am I on? | Say to agent: `"what version"` or `"platform version"` |
| Check for updates | Say to agent: `"check for updates"` or `"is there a new version"` |
| Upgrade | Say to agent: `"upgrade platform"` — or terminal: `npx {{PLATFORM_NPX}} --mode=upgrade` |
| Install global stubs (user-level, run once) | `npx {{PLATFORM_NPX}} --mode=global` |
| Remove global stubs | `npx {{PLATFORM_NPX}} --mode=uninstall-global` |
| Install enforcement guards | `npx {{PLATFORM_NPX}} --mode=install-guards` |
| Remove guards | `npx {{PLATFORM_NPX}} --mode=remove-guards` |
| Repair | `npx {{PLATFORM_NPX}} --mode=repair` |
| Remove platform | `npx {{PLATFORM_NPX}} --mode=uninstall` |
