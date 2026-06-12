# Ingest source log — agent-skills P0

**Repository:** https://github.com/addyosmani/agent-skills (MIT, v0.6.2)
**Ingest date:** 2026-06-11
**Mode:** Maintainer selective ingest (not full pack copy)

## P0 items implemented

| Source skill/reference | Platform target | Status |
|------------------------|-----------------|--------|
| `deprecation-and-migration` | `.agent/playbooks/deprecation.md` | Done |
| `source-driven-development` | `backend-agent.md`, `frontend-agent.md` | Done |
| `test-driven-development` | `test-agent.md` (pyramid, Beyoncé, DAMP) | Done |
| `doubt-driven-development` | `architect-agent.md` + `add-feature.md` Step 2a | Done |
| Rationalization tables (multiple skills) | add-feature, bug-fix, release, production-readiness, test-agent | Done |
| `references/*.md` (4 files) | `.agent/references/` (condensed, attributed) | Done |

## P1 implemented (2026-06-11 batch)

| Source | Platform target | Status |
|--------|-----------------|--------|
| `interview-me` + `idea-refine` | `requirements-clarification.md` | Done |
| `spec-driven-development` (lightweight) | `spec-outline.md` + add-feature Step 0 | Done |
| `orchestration-patterns` | `.agent/references/orchestration-patterns.md` | Done |
| `api-and-interface-design` (Hyrum) | `backend-agent.md` | Done |
| `git-workflow-and-versioning` | `devops-agent.md` change sizing | Done |
| `code-simplification` | `refactor.md` Chesterton's Fence | Done |
| `performance-optimization` (CWV) | `performance-budget.md` Step 4b | Done |
| Rationalization (remaining playbooks) | refactor, security-audit, nfr-definition, debug-pipeline, performance-budget | Done |
| Install banner | `apply.js` dynamic count from manifest | Done |

## P2 — done (skills pack, unreleased)

| Item | Status |
|------|--------|
| `browser-testing-devtools` skill | Done — `.agent/skills/browser-testing-devtools/SKILL.md` |
| Lifecycle slash commands (`/spec` `/plan` `/build` `/test` `/code-simplify` `/webperf`) | Done — `.claude/commands/` + `.cursor/commands/` |
| `/build auto` autonomous slice mode | Done — documented in `incremental-implementation` skill |
| Install profiles (`lite` / `core` / `full`) | Done — `profile-filter.mjs` + `apply.js` |
| Claude marketplace plugin | Done — `.claude-plugin/plugin.json` (`agent-platform-skills`) |
| Cherry-pick (`--mode=add` / `--mode=list`) | Done — `AGENT-PLATFORM-MANIFEST.json` catalog |
| `web-performance-auditor` + `/webperf` | Done — `web-performance-audit` skill + commands (Mode 2 F013, 2026-06-09) |
| `context-engineering` + `/context` | Done — Mode 4 R001 (2026-06-09) |
| `verification-before-completion` + `/verify` | Done — Mode 4 R005 / superpowers patterns (2026-06-09) |
