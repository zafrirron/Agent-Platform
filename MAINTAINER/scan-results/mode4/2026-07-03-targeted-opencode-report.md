# Mode 4 Targeted Scan — 2026-07-03 — anomalyco/opencode (opencode.ai)

## Meta
- **Mode:** mode4
- **Scan scope:** targeted
- **Trigger:** `Read MAINTAINER/github-governance-scan.md and execute it. repo=https://opencode.ai/`
- **Target repo:** anomalyco/opencode (resolved from https://opencode.ai/)
- **Source read:** opencode.ai docs (Config, Rules/AGENTS.md, Commands, Agents, Skills, Permissions), repo README
- **Queries / sources:** N/A (targeted)
- **Platform version:** 2.44.0
- **Prior registry read:** R001–R035 dispositions honored; OpenCode skills path already COVERED (R019 matrix lists `.opencode/skills/`)

## Summary

| Metric | Count |
|--------|------:|
| Findings total | 6 |
| Implemented | 4 |
| Skipped | 0 |
| Deferred | 2 |
| Pending | 0 |
| COVERED (no finding) | 3 |

> Dispositions applied 2026-07-03: R036 + R037 + R038 + R039 **Implemented**; R040 **Deferred (roadmap)**; R041 **Merged into R014**.

### Scan mode: targeted
### Target repo: https://github.com/anomalyco/opencode (https://opencode.ai)
### Repo type: **peer AI coding-agent runtime** — terminal/TUI + LSP, native `AGENTS.md`/`CLAUDE.md`, `.opencode/` (commands, agents, skills, plugins), `opencode.json` config, multi-session
### License: MIT

---

## Repo character

OpenCode is a full AI coding agent (not a skill pack). It **natively consumes** the same artifacts the platform ships: it auto-loads `AGENTS.md` (and `CLAUDE.md`) as rules by traversing up to the git root, reads `SKILL.md` modules from `.opencode/skills/`, runs file-based slash commands from `.opencode/commands/*.md`, and loads subagents from `.opencode/agents/*.md`. Project config lives in a root `opencode.json` (highest-precedence standard config) with an `instructions[]` field (file paths/globs merged with `AGENTS.md`) and a `permission` block (allow/ask/deny per tool). It supports multiple concurrent sessions/agents and shareable session links. This makes OpenCode a natural **5th first-class framework** rather than a source of skills to copy.

---

## Q1–Q10 summary

| # | Answer (short) |
|---|----------------|
| Q1 | Session-based (multiple concurrent sessions, shareable links); no built-in session-end handoff registry |
| Q2 | Multi-session / parallel agents supported — same pressure as our R014 coord concept |
| Q3 | Routing via `AGENTS.md` (auto-loaded) + file-based `.opencode/commands/*` + `.opencode/agents/*` subagents |
| Q4 | No trust/reputation model |
| Q5 | Primary/subagent modes; `permission` config (bash/edit/write allow-ask-deny) as a runtime guard |
| Q6 | N/A |
| Q7 | No agent manifests; agents are markdown w/ `description` + `mode` frontmatter |
| Q8 | **Native AGENTS.md/CLAUDE.md/skills consumption; file-based commands + subagents; `opencode.json` instructions; runtime permission guards; multi-session** |
| Q9 | **Missing (for us):** we had no first-class OpenCode surface — no slash commands, no invokable Critic, no config, no cross-IDE handoff registration |
| Q10 | Config precedence: remote → global → custom → project `opencode.json` → `.opencode/` dirs; plural subdir names canonical (`commands/`, `agents/`) |

---

## Recommended adoption — anomalyco/opencode

| Priority | What | Our target | Effort |
|----------|------|------------|--------|
| **P0** | R036 — claim/doc native AGENTS.md+CLAUDE.md+skills compat | `docs/DISTRIBUTION.md` + README | Low |
| **P1** | R037 — `--framework=opencode` lifecycle commands | installer + `.opencode/commands/` | Medium |
| **P1** | R039 — `opencode.json` instructions (incl. sync/packs) | installer | Low–Med |
| **P2** | R038 — `.opencode/agents/*` Critic subagent | installer | Med |
| **Roadmap** | R040 (permissions), R041 (parallel sessions → R014) | roadmap doc | Low |

**Adopt as a framework, not skills:** OpenCode already runs the platform via `AGENTS.md`; the work is making it a peer of Claude/Cursor/Codex/Antigravity (private folder, commands, subagent, config, handoff registration) — not copying content out of it.

**Already COVERED:** `.opencode/skills/` path (R019 DISTRIBUTION matrix); AGENTS.md always-loaded routing; cross-framework Critic offer (works for any framework id via `session-*-shared.md`).

**Do not adopt wholesale:** OpenCode's MCP/plugin internals, TUI, and provider config — out of scope.

---

## Findings

## R036 — opencode: Native AGENTS.md / CLAUDE.md / skills compatibility

Source: https://opencode.ai/docs/rules , https://opencode.ai/docs/skills

Observation: OpenCode auto-loads `AGENTS.md` and `CLAUDE.md` from the project (traversing up to the git root) and reads `SKILL.md` from `.opencode/skills/` — exactly the artifacts the platform installs. The platform was therefore already usable in OpenCode but never said so.

Platform gap: No documentation of zero-adapter OpenCode compatibility; users didn't know the platform "just works" there.

Classification: FEATURE (documentation)

Suggested path: Document native consumption in `docs/DISTRIBUTION.md` + README.

Effort: Low | Impact: Medium

Disposition: **Implemented** (2026-07-03) — README compat line + new "OpenCode interoperability (zero-adapter)" section in `docs/DISTRIBUTION.md`.

---

## R037 — opencode: First-class framework + lifecycle slash commands

Source: https://opencode.ai/docs/config , https://opencode.ai/docs/commands

Observation: OpenCode runs file-based slash commands from `.opencode/commands/*.md` (with `description` frontmatter) and is configured per-project by root `opencode.json`. The platform's other four frameworks each get a private folder + commands.

Platform gap: OpenCode had no `--framework=opencode` target, no `.opencode/` private folder, no slash commands, and no cross-IDE handoff registration.

Classification: ARCHITECTURE

Suggested path: Add OpenCode as the 5th framework per `MAINTAINER/add-framework.md`; emit lifecycle commands to `.opencode/commands/`.

Effort: Medium | Impact: High

Disposition: **Implemented** (2026-07-03) — full 5th-framework integration: `.opencode/` (FRAMEWORK.json, prompts, sync.md, 13 commands), manifest `frameworks[]` + file entries, `profile-filter` prefix (incl. root `opencode.json`), `apply.js` (fw list/labels, gitignore, uninstall, scans, 5-framework banner), all shared files + existing-framework "do not edit" lists. +13 tests (258 total).

---

## R038 — opencode: Critic exposed as an invokable subagent

Source: https://opencode.ai/docs/agents

Observation: OpenCode loads subagents from `.opencode/agents/*.md` (`mode: subagent`), invokable via `@name`.

Platform gap: The adversarial Critic had no OpenCode-native invocation; experts otherwise route fine through `AGENTS.md` (so full expert duplication is unnecessary and would violate the platform's minimalism principle).

Classification: FEATURE

Suggested path: Emit a thin `.opencode/agents/critic.md` that delegates to `.agent/agents/critic-agent.md` (single source of truth); rely on `AGENTS.md` for the other experts.

Effort: Medium | Impact: Medium

Disposition: **Implemented** (2026-07-03) — `.opencode/agents/critic.md` (`@critic`), delegates to `critic-agent.md`; pack-aware.

---

## R039 — opencode: `opencode.json` instructions

Source: https://opencode.ai/docs/config (instructions field)

Observation: `opencode.json` `instructions[]` accepts file paths/globs merged with `AGENTS.md` — the place to anchor always-on platform context.

Platform gap: No platform-emitted `opencode.json`; OpenCode users had no platform-authored config anchor and no always-on multi-framework awareness.

Classification: FEATURE

Suggested path: Emit a minimal root `opencode.json` with `instructions` → `AGENTS.md` + `.opencode/sync.md`; never clobber an existing one (preserve provider/model settings).

Effort: Low–Medium | Impact: Medium

Disposition: **Implemented** (2026-07-03) — root `opencode.json` (skipped if pre-existing); `.opencode/sync.md` provides always-on multi-framework awareness + session detection + auto-routing. Kept minimal to respect the token budget (no bulk preloading).

---

## R040 — opencode: Map platform guards to `permission` config

Source: https://opencode.ai/docs/config (permission)

Observation: `opencode.json` supports a `permission` block (allow/ask/deny for bash/edit/write) — the runtime analog of `--mode=install-guards` (hooks + CI) and the security/Critic gates.

Platform gap: We ship commit/CI-time guards but nothing at OpenCode's runtime permission layer.

Classification: STRENGTHEN

Suggested path: Optionally emit a conservative `permission` block in `opencode.json` (non-clobbering), described as complementary to `install-guards`.

Effort: Low | Impact: Medium

Disposition: **Deferred (roadmap)** (2026-07-03) — logged as R040 in `platform-governance-roadmap.md`; small installer enhancement behind the same non-clobber rule.

---

## R041 — opencode: Parallel sessions → team coordination layer

Source: https://opencode.ai/docs (sessions / sharing)

Observation: OpenCode runs multiple concurrent sessions/agents — the same "many agents, one repo, git sync too slow" pressure behind R014.

Platform gap: `registry.yaml` coordinates one team/IDE at a time; no event-driven claim/heartbeat protocol for parallel agents.

Classification: ARCHITECTURE

Suggested path: Track under R014 (team coordination server); use OpenCode multi-session as a validation scenario.

Effort: — | Impact: High

Disposition: **Merged into R014** (2026-07-03) — no separate work item; noted in the roadmap backlog.

---

## COVERED

| Capability | Our equivalent |
|------------|----------------|
| `.opencode/skills/` skill path | R019 DISTRIBUTION cross-IDE matrix |
| Always-on rules via AGENTS.md | AGENTS.md always-loaded + router |
| Cross-framework Critic offer | `session-start-shared.md` (framework-agnostic) |

---

## Quick-pick by effort + impact

| Finding | Title | Effort | Impact |
|---------|-------|--------|--------|
| R037 | Framework + lifecycle commands | Med | **High** |
| R036 | Native compat (documented) | Low | Medium |
| R039 | opencode.json instructions | Low–Med | Medium |
| R038 | Critic subagent | Med | Medium |
| R040 | permission guards | Low | Medium |
| R041 | Parallel sessions → R014 | — | High |

---

## Next scan
- Re-check for a stabilized global `~/.config/opencode/` layer + `permission` defaults (R040)
- **Do not re-propose:** R036, R037, R038, R039 (Implemented) · `.opencode/skills/` path (COVERED, R019)
