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
> **Lifecycle `/` commands:** `/spec` `/plan` `/build` `/test` `/review` `/code-simplify` `/webperf` `/context` `/verify` `/ship` (+ `/audit` `/release` on full profile)
> **Cursor:** `.cursor/commands/` — also `/session-start` `/session-end` `/implement` `/platform-help`
> **Cursor Plan mode (full):** `/implement` after plan approval — resumes `add-feature` Step 3 (`.cursor/rules/plan-mode-handoff.mdc`).
> **Claude Code:** `.claude/commands/` — or marketplace plugin `agent-platform-skills`
> **Profiles:** `lite` skills pack · `core` · `full` — `npx {{PLATFORM_NPX}} --profile=lite --framework=cursor`
> **Cherry-pick:** `npx {{PLATFORM_NPX}} --mode=add --add=skill:interview-me`
> **Need more detail?** Say `"platform help"` → `.agent/PLATFORM-HELP.md` · `"show quick reference"` → this file

---

## Profiles — which install?

| Profile | Best for | You get | You don't get |
|---------|----------|---------|---------------|
| **lite** | Solo dev, Cursor/Claude skills-first | 11 skills, lifecycle `/` commands, lite router | Expert agents, handoff registry, enterprise playbooks |
| **core** | Full playbooks, no compliance layer | All playbooks + experts + session model | NFR/compliance/maturity playbooks only |
| **full** (default) | Teams, multi-IDE, enterprise gates | Everything | — |

Change profile / upgrade: say *"upgrade platform"* · See skills: say *"what skills are available"* (the agent runs it)

---

## When to use what — lifecycle commands

**Plain language works too** — auto-routing loads the same skill/playbook. Use `/` commands when you want a predictable workflow every time.

| Command | Use when… | Loads | How |
|---------|-----------|-------|-----|
| `/spec` | Idea is vague; need requirements before code | `interview-me` or `idea-refine` skill | Answer one question at a time; output → `spec-outline.md` |
| `/plan` | Spec exists; need ordered tasks | `planning-and-task-breakdown` skill | Small verifiable slices; no coding yet |
| `/build` | Plan approved; ready to implement | `incremental-implementation` skill | One slice at a time; say `/build auto` for autonomous slices after plan OK |
| `/test` | Writing or fixing tests; TDD | `test-driven-development` skill | Red → green → refactor; tests are proof of behavior |
| `/review` | Code review, sanity check, PR feedback | Critic expert patterns | Adversarial review — not implementation |
| `/code-simplify` | Refactor for clarity; behavior must not change | `code-simplification` skill | Chesterton's Fence — understand before removing |
| `/webperf` | Page feels slow; CWV/Lighthouse; API latency | `web-performance-audit` skill | Ask Quick vs Deep; **measure first** — no guessing |
| `/context` | Agent invents APIs, ignores rules, or you **switched tasks** | `context-engineering` skill | Reload rules + only task-relevant files; ask on ambiguity |
| `/verify` | Agent says "done" but you want **proof** | `verification-before-completion` skill | Re-run repro/tests; cite command output — no "looks fixed" |
| `/ship` | Cut a release / tag | `release` playbook | Tests + gates before version bump |
| `/audit` | First time in repo; health check (full) | All experts · `audit.md` | 11-phase report |
| `/release` | Production go-live checklist (full) | `production-readiness` playbook | P0 NFRs + evidence |
| `/implement` | Cursor Plan approved → code (full) | `add-feature` from Step 3 | After plan UI approval only |
| `/quick-ref` | Forgot a command | This file | — |
| `/platform-help` | Full offline guide (full) | `PLATFORM-HELP.md` | — |
| `/caveman` | Long session; save tokens | `caveman` skill | Shorter output; rules unchanged |

### Common confusions

| Question | Answer |
|----------|--------|
| `/test` vs `/verify`? | **`/test`** = write/run tests (TDD). **`/verify`** = prove the fix/feature is actually done (evidence gate). |
| `/webperf` vs performance-budget playbook? | **`/webperf`** = audit/measure CWV or API now. **Performance budget** = define targets in `nfr-log.md` then optimize. |
| `/context` vs new chat? | **`/context`** = reload the *right* files/rules mid-session. **New chat** = full reset when context is heavily polluted. |
| Skill vs playbook? | **Skill** = focused workflow (`SKILL.md`). **Playbook** = multi-step process with expert gates (`.agent/playbooks/`). |
| Expert vs skill? | **Expert** = domain rules (backend, security…). **Skill** = lifecycle slice (plan, test, verify…). Router picks both when needed. |

---

## Skills catalog (11 lifecycle + optional add-ons) — when & how

Add a skill: just say *"add the `<id>` skill"* (the agent runs it) · Unsure? say *"which skill should I use?"* (loads `using-platform`)

| Skill | When | How / command |
|-------|------|---------------|
| `interview-me` | Underspecified feature; "grill me" | `/spec` · one question at a time → `spec-outline.md` |
| `idea-refine` | Explore options before committing | `/spec` when idea is exploratory |
| `planning-and-task-breakdown` | Spec ready; need task list | `/plan` |
| `incremental-implementation` | Build approved plan in slices | `/build` · `/build auto` after plan OK |
| `test-driven-development` | TDD, coverage, failing tests | `/test` |
| `code-simplification` | Simplify without behavior change | `/code-simplify` |
| `web-performance-audit` | CWV, Lighthouse, API latency audit | `/webperf` · Quick or Deep mode |
| `context-engineering` | Hallucinations, stale chat, task switch | `/context` · reload hierarchy; ask if spec ≠ code |
| `verification-before-completion` | Before ship; "is it really fixed?" | `/verify` · show test/repro output |
| `browser-testing-devtools` | Browser MCP UI debugging (optional) | `--mode=add` · when you use browser automation |
| `ux-research` | User research, usability, journey maps (optional domain) | `--mode=add --add=skill:ux-research` · before build when user need unclear |
| `using-platform` | "Which workflow?" at session start (lite) | Read skill · pick one workflow only |
| `caveman` | Token compression for long sessions | `/caveman` or "caveman mode" |

---

## Packs — language, stack, platform & domain overlays (opt-in)

Curated language/stack/platform/domain knowledge layered on the agnostic core. Opt-in; never auto-installed. **Just prompt your agent — it runs everything:**

| Just say… | The agent does |
|-----------|----------------|
| *"what packs are available"* | Lists the catalog |
| *"which packs should I use"* / *"scan my repo for packs"* | Inspects your project and recommends |
| *"activate the React pack"* / *"use the TypeScript pack"* | Activates and confirms |
| *"what packs are active"* | Reports `active_packs` |
| *"add this rule to my X pack"* | Saves to `user.overlay.md` (survives updates) |

- **Four kinds:** `language:*` (TypeScript, Java, C++ — the language's own footguns) · `stack:*` (React, Django — framework idioms/pitfalls) · `platform:*` (Docker/boards/SoCs — *where the code runs*; **roadmap**) · `domain:*` (fintech — compliance + reference architectures). They compose (`language:typescript` + `stack:react` + `domain:fintech`).
- **Language vs stack:** a language pack = the language itself (reusable across every framework in it); a stack pack = a framework/library built in a language.
- **How it loads:** when a pack is active, the routed expert also reads the overlay it maps in `pack.json` → `provides.agent_overlays`. A language pack overlays *every* code expert; a stack/domain pack overlays one. Zero cost when none active.
- **Reference architecture:** with a domain pack active, ask *"reference architecture for a [domain] app"* → agent reads the pack's `reference-architecture.md` + linked source repos.
- **Available (shipped):** `language-typescript` · `language-java` · `language-cpp` · `stack-react` · `stack-django` · `domain-fintech` · `domain-c4i` (C2/C4ISR).
- **Private/proprietary:** company IP belongs in packs — fork the platform to a private repo and build your packs there (not in this repo). Full spec: `.agent/packs/README.md`.

---

## Help & discovery

| You say | You get |
|---------|---------|
| `"show quick reference"` / `"show help"` | This file (commands + when to use) |
| `"platform help"` / `"how does this work"` | Full `.agent/PLATFORM-HELP.md` |
| `"what version"` / `"check for updates"` | Version from `.agent/platform.json` + update check |
| Describe task in plain English | Auto-routing → `▶ [Expert] · [playbook]` status line |

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
**Describe the situation — the right playbook loads automatically.** (20 total)

**Lifecycle shortcuts:** `/spec` · `/plan` · `/build` · `/test` · `/review` · `/code-simplify` · `/webperf` · `/context` · `/verify` · `/ship`

| Your situation | Playbook / skill | Key principle |
|---------------|---------|---------------|
| First time in this repo / onboarding / health check | **Full Project Audit** — 11-phase report → `audit-[date].md` | Know before you change |
| Underspecified idea / "interview me" | `interview-me` skill → `spec-outline.md` | No code until spec is clear |
| Explore vague concepts | `idea-refine` skill | Diverge then converge |
| Spec approved, need tasks | `planning-and-task-breakdown` skill · `/plan` | Small verifiable slices |
| Ready to implement | `incremental-implementation` skill · `/build` | One slice at a time |
| Tests / TDD | `test-driven-development` skill · `/test` | Tests are proof |
| Simplify without behavior change | `code-simplification` skill · `/code-simplify` | Chesterton's Fence |
| Page slow / CWV / Lighthouse / API latency | `web-performance-audit` skill · `/webperf` | Measure before optimize — Quick or Deep |
| Agent inventing APIs / task switch / stale chat | `context-engineering` skill · `/context` | Reload rules + scoped files only |
| "Done" but no proof / before ship | `verification-before-completion` skill · `/verify` | Evidence from tests/repro — not vibes |
| Starting new feature work | Add feature | Design gate + doubt review first |
| Something is broken | Bug fix | Reproduce → fix → regression test |
| "hotfix", "rollback", "emergency fix" | Bug fix (DevOps path) | Stabilize before polish |
| "clean up this area" (tests exist) | Refactor | Chesterton's Fence — understand before removing |
| "something's wrong but I don't know why" | Debug pipeline | Hypothesis-driven narrowing |
| "slow", "p95", "performance budget" | Performance budget playbook | Define targets in `nfr-log.md` — then optimize |
| Ready to ship a version | Release | Tests + Critic before tag |
| "go live", "production ready", "PRR" | Production readiness | P0 NFRs + evidence before go-live |
| Security review / OWASP / pentest prep | Security audit | Secrets + CVEs + OWASP API Top 10 |
| "I need to add [package/library]" | Add dependency | Vet CVEs before adopt |
| Integrating external API or service | API integration | Contract-first + tests |
| "document API", "OpenAPI", "Swagger" | Document API | Spec from code, Critic gate |
| "define NFRs", "SLO", "quality targets" | NFR definition | Threshold + measure + verify |
| "observability", "metrics", "health check" | Observability setup | Correlation ID + actionable alerts |
| "accessibility audit", "WCAG", "a11y" | Accessibility audit | WCAG 2.2 AA + keyboard pass |
| "compliance review", "SOC 2", "ISO 27001" | Compliance review | Control → artifact mapping |
| "DORA metrics", "maturity assessment" | Org maturity assessment | Process metrics, quarterly |
| "postmortem", "outage", "incident review" | Incident postmortem | Blameless + MTTR rollup |
| "deprecate", "sunset", "remove legacy" | Deprecation | Zero-usage verify before removal |

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
| [.agent/references/testing-patterns.md](.agent/references/testing-patterns.md) | Pyramid, DAMP, regression patterns |
| [.agent/references/security-checklist.md](.agent/references/security-checklist.md) | Pre-merge security spot-check |
| [.agent/references/performance-checklist.md](.agent/references/performance-checklist.md) | Measure-first performance gates |
| [.agent/references/accessibility-checklist.md](.agent/references/accessibility-checklist.md) | WCAG 2.2 AA quick pass |
| [.agent/references/orchestration-patterns.md](.agent/references/orchestration-patterns.md) | Expert chaining rules — no nested persona spawn |
| [.agent/context/spec-outline.md](.agent/context/spec-outline.md) | Lightweight pre-implementation spec (add-feature Step 0) |

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
| 6th IDE framework | `.<name>/` private folder | "Add [Windsurf/Cline/etc.] as a 6th framework" (OpenCode is the 5th) |
| New best practice | `.agent/BEST-PRACTICES.md` | "Add a new golden rule: [rule]" |
| API conventions | `.agent/context/api-patterns.md` | "Add API pattern: [convention]" |

> For all extensions: describe what you want — your agent handles the implementation and registers it correctly.

---

## Platform Operations
**Only one terminal command exists: the one-time install. Everything below is just a prompt — your agent runs it for you.**

| Action | Just say to your agent |
|--------|------------------------|
| What version am I on? | *"what version"* / *"platform version"* |
| Check for updates | *"check for updates"* / *"is there a new version"* |
| Upgrade | *"upgrade platform"* |
| List / add skills | *"what skills are available"* / *"add the X skill"* |
| List / activate packs | *"what packs are available"* / *"activate the X pack"* |
| Install / remove enforcement guards | *"install guards"* / *"remove guards"* |
| Install / remove global stubs | *"install global stubs"* / *"remove global stubs"* |
| Repair empty stubs | *"repair platform"* |
| Reset to latest expert rules | *"get the latest expert rules"* (force — keeps your PROJECT sections + packs) |
| Remove platform | *"uninstall the platform"* |

<details><summary>Under the hood (the agent runs these — you don't type them)</summary>

```
npx {{PLATFORM_NPX}} --mode=upgrade | --mode=repair | --mode=force
npx {{PLATFORM_NPX}} --mode=global | --mode=uninstall-global
npx {{PLATFORM_NPX}} --mode=install-guards | --mode=remove-guards
npx {{PLATFORM_NPX}} --mode=list --list=skills|packs
npx {{PLATFORM_NPX}} --mode=add --add=skill:<id> | --add=pack:<id>
npx {{PLATFORM_NPX}} --mode=uninstall
```

</details>
