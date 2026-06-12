# AGENTS.md — {{PROJECT_NAME}} (Skills profile)

**Profile:** `lite` — modular skills pack. Upgrade: `npx {{PLATFORM_NPX}} --profile=full`

---

<!-- PLATFORM:START -->
## Lifecycle slash commands

| Phase | Command | Routes to |
|-------|---------|-----------|
| Define | `/spec` | `interview-me` or `requirements-clarification` playbook |
| Plan | `/plan` | `planning-and-task-breakdown` skill |
| Build | `/build` | `incremental-implementation` skill (use `/build auto` for approved plan) |
| Verify | `/test` | `test-driven-development` skill |
| Review | `/review` | Critic-style review via `code-review` patterns in skills |
| Simplify | `/code-simplify` | `code-simplification` skill |
| Perf audit | `/webperf` | `web-performance-audit` skill |
| Context | `/context` | `context-engineering` skill |
| Evidence | `/verify` | `verification-before-completion` skill |
| Ship | `/ship` | `release` playbook |

**Cursor:** commands in `.cursor/commands/` · **Claude Code:** `.claude/commands/` or Claude marketplace plugin

## Auto-routing (describe your task — agent loads skill or playbook)

| User says… | Load |
|------------|------|
| "interview me", "grill me", underspecified idea | `.agent/skills/interview-me/SKILL.md` |
| "refine the idea", explore options | `.agent/skills/idea-refine/SKILL.md` |
| "add a feature", "fix a bug", "refactor" | matching `.agent/playbooks/*.md` |
| "write tests", TDD | `.agent/skills/test-driven-development/SKILL.md` |
| "simplify", "clean up" (behavior unchanged) | `.agent/skills/code-simplification/SKILL.md` |
| "webperf", "Core Web Vitals", "Lighthouse audit" | `.agent/skills/web-performance-audit/SKILL.md` |
| "context stale", "reload context", "hallucinating APIs" | `.agent/skills/context-engineering/SKILL.md` |
| "verify done", "prove it works", "evidence" | `.agent/skills/verification-before-completion/SKILL.md` |
| "plan the work", task breakdown | `.agent/skills/planning-and-task-breakdown/SKILL.md` |
| "implement", "build it" | `.agent/skills/incremental-implementation/SKILL.md` |
| "show quick reference" | `.agent/QUICK-REF.md` |

Start every session: `Read .agent/session-start.md and execute it.`

**Upgrade to full platform** (multi-IDE handoff, enterprise gates, Critic):  
`npx {{PLATFORM_NPX}} --profile=full`
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
<!-- Add custom routing rows here -->
<!-- PROJECT:END -->
