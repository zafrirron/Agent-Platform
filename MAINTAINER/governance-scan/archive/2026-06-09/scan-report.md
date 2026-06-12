# Mode 4 Scan Report — 2026-06-09

## Repos analysed: 10

| Repo | Stars | Category |
|------|------:|----------|
| addyosmani/agent-skills | 55,309 | Seed — skill-pack diff |
| anthropics/skills | 149,621 | Seed — official SKILL.md reference |
| obra/superpowers | 225,132 | Seed — methodology + skills |
| github/spec-kit | 111,570 | Spec-driven CLI + slash commands |
| Fission-AI/OpenSpec | 54,366 | Lightweight spec layer |
| OthmanAdi/planning-with-files | 23,061 | File-based planning + completion gate |
| numman-ali/openskills | 10,383 | Universal skills installer |
| muratcankoylan/Agent-Skills-for-Context-Engineering | 16,494 | Context/harness engineering |
| wshobson/agents | 36,645 | Multi-harness plugin marketplace |
| builderz-labs/mission-control | 5,279 | Agent orchestration dashboard (triage only — shallow README) |

## Repos discarded at triage: 8

| Repo | Reason |
|------|--------|
| ComposioHQ/awesome-claude-skills | Curated list — no governance layer |
| affaan-m/ECC | Dotfiles/config collection — not coordination |
| openclaw/openclaw | General agent runtime — not platform patterns |
| browser-use/browser-use | Browser automation library — no agent governance |
| HKUDS/AI-Trader | Domain-specific trading agent |
| NirDiamant/agents-towards-production | Tutorial content — not installable platform |
| snarktank/ralph | Single-purpose loop script |
| msitarzewski/agency-agents | Persona collection — weaker gates than platform playbooks |

## Repos already in scan log (skipped): 8

faramesh-core · edictum · DashClaw · deterministic-agent-control-protocol · JSON-Agents/Standard · garda-agent-orchestrator · traccia-py · nobulex (founding scan 2026-06-02 — re-check after 2026-12-02)

## Findings: 12 total

| Classification | Count |
|----------------|------:|
| FEATURE | 6 |
| STRENGTHEN | 4 |
| ARCHITECTURE | 2 |

---

## R001 — agent-skills: context-engineering skill

**Source:** https://github.com/addyosmani/agent-skills  
**Observation:** New `context-engineering` SKILL.md defines a five-level context hierarchy (rules → specs → source files → errors → conversation), confusion-management patterns, anti-patterns, and rationalization tables for context starvation/flooding.  
**Platform gap:** Platform has `TOKEN-BUDGET.md` and session-start loading but no dedicated lifecycle skill or playbook for deliberate context curation when quality degrades or switching tasks.  
**Classification:** FEATURE  
**Suggested path:** Cherry-pick condensed skill → `.agent/skills/context-engineering/SKILL.md` + optional `/context` command; cross-link from `session-start.md`  
**Effort:** Low | **Impact:** High

---

## R002 — agent-skills: P3 skill parity (un-ingested modules)

**Source:** https://github.com/addyosmani/agent-skills  
**Observation:** Repo now ships 24 skills. Platform ingested P0–P2 (see `MAINTAINER/ingest/agent-skills-p0-SOURCES.md`). Still absent as cherry-pickable skills: `ci-cd-and-automation`, `code-review-and-quality`, `debugging-and-error-recovery`, `documentation-and-adrs`, `frontend-ui-engineering`, `observability-and-instrumentation`, `security-and-hardening`, `shipping-and-launch`, `using-agent-skills`.  
**Platform gap:** Equivalent *playbook* coverage exists for several domains, but lite-profile users cannot `--mode=add` these as skills; catalog parity incomplete.  
**Classification:** STRENGTHEN  
**Suggested path:** Phase 2F monthly diff in `web-audit.md`; selective `--add` entries in `skills_catalog` (not wholesale copy)  
**Effort:** Medium | **Impact:** Medium

---

## R003 — superpowers: subagent-driven-development

**Source:** https://github.com/obra/superpowers  
**Observation:** After plan approval, dispatches a **fresh subagent per task** with mandatory **two-stage review** (spec compliance, then code quality) before continuing. Supports multi-hour autonomous runs without plan drift.  
**Platform gap:** Platform chains experts in-process and uses Critic gates at playbook steps, but does not prescribe fresh subagent dispatch per slice or two-stage review sequencing for autonomous `/build auto` mode.  
**Classification:** FEATURE  
**Suggested path:** Extend `incremental-implementation` skill + `add-feature.md` with subagent dispatch pattern; document in `orchestration-patterns.md`  
**Effort:** Medium | **Impact:** High

---

## R004 — superpowers: git worktree isolation

**Source:** https://github.com/obra/superpowers  
**Observation:** `using-git-worktrees` skill activates post-design-approval: creates isolated branch/worktree, runs project setup, verifies clean test baseline before implementation begins.  
**Platform gap:** Platform uses registry file locks and handoff but no standard **worktree isolation** step before large feature implementation.  
**Classification:** FEATURE  
**Suggested path:** Add optional Step 2c to `add-feature.md` + DevOps expert rule; lite skill or playbook subsection  
**Effort:** Low | **Impact:** Medium

---

## R005 — superpowers: verification-before-completion

**Source:** https://github.com/obra/superpowers  
**Observation:** Dedicated debugging skill enforces evidence before declaring fixes complete (systematic-debugging + verification-before-completion in skills library).  
**Platform gap:** Playbooks have done-when gates; no standalone **verification** skill for "agent claims fixed but didn't re-run tests/check logs."  
**Classification:** STRENGTHEN  
**Suggested path:** Condensed skill from superpowers patterns → `.agent/skills/verification-before-completion/` or merge into `debug-pipeline.md` Step final  
**Effort:** Low | **Impact:** High

---

## R006 — planning-with-files: persistent plan + completion gate

**Source:** https://github.com/OthmanAdi/planning-with-files  
**Observation:** v3.0 adds opt-in autonomous/gated modes with a **completion gate** that blocks the agent until markdown plan tasks on disk are actually done. Plans survive crashes and context compaction; multi-agent shared state via files.  
**Platform gap:** Platform uses `handoff/CURRENT.md` and `registry.yaml` but no **file-native task plan** with deterministic completion gate for long autonomous runs.  
**Classification:** FEATURE  
**Suggested path:** New context template `.agent/context/plan.md` + gate in `incremental-implementation` skill; optional `/plan-files` command  
**Effort:** Medium | **Impact:** High

---

## R007 — openskills: universal SKILL.md loader + AGENTS.md XML

**Source:** https://github.com/numman-ali/openskills  
**Observation:** CLI installs skills from any GitHub repo; `openskills sync` writes Anthropic-compatible `<available_skills>` XML into `AGENTS.md`; `npx openskills read <name>` loads on demand (progressive disclosure). Supports `--universal` → `.agent/skills/`.  
**Platform gap:** Platform has `npx apply --mode=add` and manifest catalog but does not emit **Claude-compatible skills XML** in AGENTS.md or interoperate with external skill repos via a standard loader.  
**Classification:** ARCHITECTURE  
**Suggested path:** Evaluate `apply.js --mode=sync-skills` emitting XML block; document interoperability in `DISTRIBUTION.md`  
**Effort:** Medium | **Impact:** Medium

---

## R008 — Context-Engineering: harness-engineering skill

**Source:** https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering  
**Observation:** Formal harness model: locked vs editable vs append-only vs human-controlled surfaces; durable THREAD.md logs; novelty gates; metric-gaming resistance; PR-prep without auto-merge. Includes production `researcher/` loop with deterministic CI gates.  
**Platform gap:** Platform maintainer workflows are manual; consumer repos lack a **harness-engineering** skill for teams building autonomous research/eval loops on top of the platform.  
**Classification:** FEATURE  
**Suggested path:** Maintainer-only doc first; optional enterprise skill for teams running background agents  
**Effort:** High | **Impact:** Medium

---

## R009 — Context-Engineering: skill-router benchmark harness

**Source:** https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering  
**Observation:** Published router benchmarks (600 calls × 4 models) measuring whether the correct skill activates; corpus-wide description hardening improved top-1 accuracy to 0.84–0.92 per model.  
**Platform gap:** Platform has `routing_keywords` in manifests but **no regression harness** that tests AGENTS.md routing prompts against expected expert/skill outcomes.  
**Classification:** ARCHITECTURE  
**Suggested path:** Add `tests/routing-benchmark.fixtures.jsonl` + optional script under `MAINTAINER/` or `tests/`  
**Effort:** Medium | **Impact:** High

---

## R010 — spec-kit: project constitution artifact

**Source:** https://github.com/github/spec-kit  
**Observation:** First workflow step is `/speckit.constitution` — creates governing principles before any spec/plan/implement cycle. Constitution persists as project artifact separate from feature specs.  
**Platform gap:** Platform spreads principles across `BEST-PRACTICES.md`, `CONVENTIONS.md`, and PROJECT sections but has no **constitution** command or single ratified principles artifact per repo.  
**Classification:** STRENGTHEN  
**Suggested path:** `/constitution` command → generates/updates `.agent/context/constitution.md`; session-start checks if missing on full profile  
**Effort:** Low | **Impact:** Medium

---

## R011 — OpenSpec: per-change artifact folders

**Source:** https://github.com/Fission-AI/OpenSpec  
**Observation:** Each change gets `openspec/changes/<name>/` with `proposal.md`, `specs/`, `design.md`, `tasks.md`; `/opsx:apply` and `/opsx:archive` manage lifecycle. Lighter than spec-kit; brownfield-friendly.  
**Platform gap:** Platform uses single `spec-outline.md` — no **per-feature folder** with proposal/spec/design/tasks separation for parallel changes.  
**Classification:** ARCHITECTURE  
**Suggested path:** Optional `.agent/changes/<slug>/` convention in `add-feature.md` Step 0; document in FRAMEWORK-README  
**Effort:** Medium | **Impact:** Medium

---

## R012 — wshobson/agents: plugin-eval quality certification

**Source:** https://github.com/wshobson/agents  
**Observation:** `plugin-eval` framework: static structural analysis + LLM judge (4 dimensions) + Monte Carlo reliability (50–100 runs). `plugin-eval certify` for skill quality.  
**Platform gap:** Platform has integration tests for install artifacts but **no quality scoring** for skills/playbooks themselves (vagueness, gate completeness, progressive disclosure).  
**Classification:** FEATURE  
**Suggested path:** Maintainer tool `MAINTAINER/tools/skill-eval.mjs` — static checks on SKILL.md (length, gates, rationalization table presence)  
**Effort:** Medium | **Impact:** Medium

---

## COVERED (no finding — logged for scan completeness)

| Repo | Capability | Platform equivalent |
|------|------------|---------------------|
| addyosmani/agent-skills | Lifecycle `/spec` `/plan` `/build` `/test` `/review` `/ship` | Done — lite/core/full + commands |
| addyosmani/agent-skills | Rationalization tables, TDD, interview-me | P0–P2 ingested |
| obra/superpowers | brainstorming → plan → TDD → review workflow | add-feature + lifecycle skills |
| anthropics/skills | Official SKILL.md format | Platform skills follow same shape |
| wshobson/agents | Multi-harness marketplace | Platform has 4 frameworks + Claude plugin |
| Platform | Session handoff, reputation, manifests, step_manifest | Founding scan implemented (Phases 1A–6B) |

---

## Quick-pick by effort + impact

| Finding | Title | Effort | Impact |
|---------|-------|--------|--------|
| R001 | context-engineering skill | Low | High |
| R005 | verification-before-completion | Low | High |
| R004 | git worktree isolation | Low | Medium |
| R010 | project constitution command | Low | Medium |
| R003 | subagent-driven-development | Medium | High |
| R006 | planning-with-files completion gate | Medium | High |
| R009 | routing benchmark harness | Medium | High |
| R007 | openskills AGENTS.md interoperability | Medium | Medium |
| R011 | per-change artifact folders | Medium | Medium |
| R012 | plugin-eval static certification | Medium | Medium |
| R002 | agent-skills P3 parity | Medium | Medium |
| R008 | harness-engineering skill | High | Medium |

---

## Maintainer selection commands

```
"Add R001, R005"           — implement selected findings via Mode 1 + PSG
"Add all Low-effort High-impact"  — R001, R005
"Investigate R003"         — deep-read superpowers subagent skill files
"Roadmap R006, R008, R009" — phased roadmap doc
"Defer R002"               — backlog (monthly 2F handles)
"Skip all"                 — log reviewed, archive only
```
