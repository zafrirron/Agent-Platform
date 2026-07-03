# Mode 4 Targeted Scan — 2026-07-03 — saeed-vayghan/gemini-agent-skills

## Meta
- **Mode:** mode4
- **Scan scope:** targeted
- **Trigger:** `Read MAINTAINER/github-governance-scan.md and execute it. repo=saeed-vayghan/gemini-agent-skills`
- **Target repo:** saeed-vayghan/gemini-agent-skills
- **Entry skill requested:** `.gemini/skills/ux-researcher/SKILL.md`
- **Queries / sources:** N/A (targeted)
- **Platform version:** 2.42.1
- **Prior registry read:** 2026-06-09 R001–R012 dispositions honored; no re-propose of Implemented R001/R005

## Summary

| Metric | Count |
|--------|------:|
| Findings total | 6 |
| Implemented | 2 |
| Roadmapped | 1 |
| Skipped | 0 |
| Deferred | 3 |
| Pending | 0 |
| COVERED (no finding) | 8 |

> Dispositions applied 2026-07-03: R013 + R016 **Implemented**, R014 **Roadmapped**, R015/R017/R018 **Deferred** (low priority / architecture — revisit next scan).

### Scan mode: targeted
### Target repo: https://github.com/saeed-vayghan/gemini-agent-skills
### Repo type: skill pack (120+ persona skills) + Gemini CLI converter
### Stars: ~29 · License: MIT

---

## Q1–Q10 summary

| # | Answer (short) |
|---|----------------|
| Q1 | No session-start/end; skills activate on demand via Gemini `/skills list` |
| Q2 | `multi-agent-coordinator`, `workflow-orchestrator`, `context-management` describe coordination — no live multi-IDE registry |
| Q3 | Gemini auto-activates skill from user prompt; persona-per-domain routing (120 skills) |
| Q4 | No reputation/trust scoring |
| Q5 | Checklist gates per skill ("When invoked", excellence checklists); no Critic agent |
| Q6 | Fault tolerance in coordinator skill (retries, circuit breakers) — prose only |
| Q7 | Persona registry tables inside bundled skills; no manifest.json |
| Q8 | Gemini-native path, Claude→Gemini converter CLI, 120 domain personas, JSON context query assets |
| Q9 | **Missing/weaker:** UX research skill, multi-agent coordination depth, Gemini install docs, optional persona library |
| Q10 | Copy-to-`.gemini/skills/`; converter CLI; not npx/cherry-pick — document interoperability |

---

## Recommended adoption — saeed-vayghan/gemini-agent-skills

| Priority | What | Our target | Effort |
|----------|------|------------|--------|
| **P0** | **UX research workflow** (`ux-researcher`) — interviews, usability tests, journey maps, a11y research | New optional skill `ux-research` or extend `frontend-agent` + `accessibility-audit` playbook cross-link | Medium |
| **P1** | **Multi-agent coordination patterns** (checklists from `multi-agent-coordinator`) | Informs future team coord server + `orchestration-patterns.md`; defer implementation | High (architecture) |
| **P1** | **Gemini skills path** (`.gemini/skills/`) | `docs/DISTRIBUTION.md` + optional `--framework=gemini` note (5th IDE) | Low (docs) |
| **P2** | **Structured context query JSON** (`references/*_query.json`) | Optional pattern in `context-engineering` skill | Low |
| **P2** | **Persona library cherry-pick** — 120 domain skills as `--mode=add` catalog entries | Manifest `skills_catalog` extension + ingest attribution file | Medium |
| **Defer** | Claude→Gemini converter CLI | Out of scope — different product surface | — |

**Install pattern to copy:** Document Gemini CLI skill install in DISTRIBUTION; optional `--mode=add --add=skill:ux-researcher` after adapted SKILL.md (strip Gemini-only "Query context manager" if no such agent).

**Already COVERED:** Backend/security/devops/test domain experts; lifecycle `/spec`→`/ship`; `context-engineering`; TDD/checklist patterns from agent-skills ingest; WCAG in frontend-agent + a11y playbook.

**Do not adopt wholesale:** 120 persona skills replace our **9 experts + 11 lifecycle skills** model — different architecture (persona-per-role vs lifecycle + playbooks). Cherry-pick selected modules only.

---

## Findings

## R013 — gemini-agent-skills: UX researcher persona skill

Source: https://github.com/saeed-vayghan/gemini-agent-skills — `.gemini/skills/ux-researcher/SKILL.md`

Observation: Dedicated UX research skill with interview planning, usability testing, survey design, journey mapping, persona development, A/B analysis, and accessibility research checklists — invoked with structured 3-phase workflow.

Platform gap: We have frontend UX interaction principles and WCAG/a11y audit playbook but **no UX research / discovery skill** for pre-build user insight work.

Classification: FEATURE

Suggested path: Optional `.agent/skills/ux-research/` (adapt MIT skill — remove "Query context manager", wire to `/spec` or new `/research`); or playbook subsection in `requirements-clarification.md`

Effort: Medium | Impact: Medium

Disposition: **Implemented** (2026-07-03) — `.agent/skills/ux-research/SKILL.md` created (adapted, Gemini "Query context manager" removed); registered in manifest `skills_catalog` + files; cherry-pick via `--mode=add --add=skill:ux-research`; cross-linked from `requirements-clarification` playbook; catalogued in QUICK-REF / QUICK-REF-lite / using-platform.

---

## R014 — gemini-agent-skills: Multi-agent coordinator checklists

Source: https://github.com/saeed-vayghan/gemini-agent-skills — `.gemini/skills/multi-agent-coordinator/SKILL.md`

Observation: Explicit coordination checklist (deadlock prevention, message delivery, DAG workflows, saga patterns, scatter-gather) and "Query context manager" invocation protocol.

Platform gap: `registry.yaml` covers single-team IDE handoff; no **multi-agent workflow orchestration** guidance for large agent teams (aligns with proposed external coord server).

Classification: ARCHITECTURE

Suggested path: Reference in `platform-governance-roadmap.md` or future coord-server ADR; extract checklist subset to `orchestration-patterns.md` when coord MVP ships

Effort: High | Impact: High

Disposition: **Roadmapped** (2026-07-03) — backlog entry added to `MAINTAINER/platform-governance-roadmap.md` (R014); tied to proposed external team-coordination server; implementation not scheduled.

---

## R015 — gemini-agent-skills: Context management (vector/RAG persona)

Source: https://github.com/saeed-vayghan/gemini-agent-skills — `.gemini/skills/context-management/SKILL.md`

Observation: Bundled persona emphasizes vector DBs, RAG, knowledge graphs, multi-agent context handoff — broader than file-based context reload.

Platform gap: `context-engineering` skill covers hierarchy reload and confusion gates; **no guidance** on when RAG/vector memory is appropriate vs markdown platform model.

Classification: STRENGTHEN

Suggested path: Add "When not file-based" subsection to `context-engineering/SKILL.md` — point to external memory/RAG as out-of-platform pattern

Effort: Low | Impact: Low

Disposition: **Deferred** (2026-07-03) — low impact; revisit if RAG/vector memory demand appears.

---

## R016 — gemini-agent-skills: Gemini `.gemini/skills/` install path

Source: https://github.com/saeed-vayghan/gemini-agent-skills — README

Observation: Skills install to `.gemini/skills/`; Gemini CLI `/skills list` auto-activation; converter CLI from Claude plugins.

Platform gap: Platform documents Cursor, Claude, Codex, Antigravity — **no Gemini CLI / `.gemini/` framework** in install matrix or DISTRIBUTION.

Classification: FEATURE

Suggested path: `docs/DISTRIBUTION.md` section; evaluate 5th framework stub or "bring your own `.gemini/skills/`" via `--mode=add`

Effort: Low | Impact: Medium

Disposition: **Implemented** (2026-07-03) — "Gemini CLI (`.gemini/skills/`) — interoperability" section added to `docs/DISTRIBUTION.md` (copy-to-`.gemini/skills/`, `/skills list`, reverse-direction via Mode 4/3, optional `--framework=gemini` deferred).

---

## R017 — gemini-agent-skills: JSON context query assets

Source: https://github.com/saeed-vayghan/gemini-agent-skills — skill `references/*_query.json`, `assets/progress_tracking.json`

Observation: Skills ship structured JSON prompts for "context assessment" and progress tracking alongside SKILL.md.

Platform gap: Platform uses markdown-only; no **optional structured query templates** for complex skills.

Classification: STRENGTHEN

Suggested path: Optional `.agent/skills/<id>/references/` pattern documented in skill authoring guide (MAINTAINER); pilot in `ux-research` if adopted

Effort: Low | Impact: Low

Disposition: **Deferred** (2026-07-03) — markdown-only remains the platform standard; no structured-JSON demand yet.

---

## R018 — gemini-agent-skills: 120-persona skill library model

Source: https://github.com/saeed-vayghan/gemini-agent-skills — `.gemini/skills/` (120+ skills)

Observation: One SKILL.md per job role (backend-developer, security-auditor, …) vs our 9 experts + 11 lifecycle skills.

Platform gap: Users may expect **domain persona skills** alongside lifecycle; lite profile only ships lifecycle pack.

Classification: ARCHITECTURE

Suggested path: Extend `skills_catalog` with optional "persona pack" profile tier or documented `--mode=add` list; do not merge into core 11 lifecycle skills

Effort: Medium | Impact: Medium

Disposition: **Deferred** (2026-07-03) — architectural (persona-per-role vs lifecycle+playbooks); revisit only if user demand for a persona-pack tier emerges.

---

## COVERED

| Capability | Our equivalent |
|------------|----------------|
| Backend/API/database optimization | `backend-agent`, `data-agent`, playbooks |
| Security audit / penetration | `security-agent`, `security-audit` playbook |
| Code review | Critic + `/review` |
| TDD / test automation | `test-driven-development`, `test-agent` |
| Context reload | `context-engineering` `/context` |
| Verification gates | `verification-before-completion` `/verify` |
| Performance | `web-performance-audit`, `performance-budget` playbook |
| Accessibility testing | `accessibility-audit` playbook, frontend-agent WCAG |
| Planning / task breakdown | `/plan`, `planning-and-task-breakdown` |

---

## Quick-pick by effort + impact

| Finding | Title | Effort | Impact |
|---------|-------|--------|--------|
| R016 | Gemini install path docs | Low | Medium |
| R015 | RAG vs file context note | Low | Low |
| R017 | JSON query asset pattern | Low | Low |
| R013 | UX researcher skill | Medium | Medium |
| R018 | Persona library model | Medium | Medium |
| R014 | Multi-agent coordination | High | High |

---

## Next scan

- Re-check repo after Project Mitra integration ships (README "What's Next")
- If implementing R013: diff `ux-researcher/SKILL.md` only — do not ingest all 120 skills
- **Do not re-propose:** R001, R005 (Implemented)
