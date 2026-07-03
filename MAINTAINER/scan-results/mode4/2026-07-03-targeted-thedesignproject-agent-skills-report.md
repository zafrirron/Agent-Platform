# Mode 4 Targeted Scan — 2026-07-03 — thedesignproject/agent-skills

## Meta
- **Mode:** mode4
- **Scan scope:** targeted
- **Trigger:** `Read MAINTAINER/github-governance-scan.md and execute it. repo=https://github.com/thedesignproject/agent-skills`
- **Target repo:** thedesignproject/agent-skills
- **Source read:** repo README (13 commits, main) · [github.com/thedesignproject/agent-skills](https://github.com/thedesignproject/agent-skills)
- **Queries / sources:** N/A (targeted)
- **Platform version:** 2.42.1
- **Prior registry read:** R001–R024 dispositions honored; no re-propose of Implemented R001/R005/R013/R016/R019/R020/R021; `caveman` already COVERED

## Summary

| Metric | Count |
|--------|------:|
| Findings total | 6 |
| Implemented | 3 |
| Skipped | 0 |
| Deferred | 3 |
| Pending | 0 |
| COVERED (no finding) | 8 |

> Dispositions applied 2026-07-03: R025 + R028 + R029 **Implemented**; R027 **Deferred (opt-in skill)**; R026 **Deferred (roadmap)**; R030 **Deferred**.

### Scan mode: targeted
### Target repo: https://github.com/thedesignproject/agent-skills
### Repo type: **skill pack** — 17 design/frontend-focused skills + guides, `npx skills add` installer
### Stars: ~36 · Forks: ~10 · License: MIT

---

## Repo character

A designer/builder-oriented skill pack for Claude Code + Cursor. Strong on **design-to-code, design systems, and skill authoring**; weaker on multi-agent coordination (none). Installs via the community `npx skills add owner/repo` tool (interactive list, `-s <skill>`, `-g` global). Each skill declares an **Auto vs Slash** activation mode — the same discoverability idea our AGENTS.md routing + `/` commands provide.

---

## Q1–Q10 summary

| # | Answer (short) |
|---|----------------|
| Q1 | No session lifecycle — skills activate per host IDE |
| Q2 | No multi-agent coordination |
| Q3 | Per-skill **Auto (trigger on match) vs Slash** activation declared in README |
| Q4 | No trust/reputation |
| Q5 | `writing-skills` / `create-skill` include subagent-based verification before deployment |
| Q6 | N/A |
| Q7 | No manifests; `ai-component-metadata` generates machine-readable metadata for *design-system components* (not agents) |
| Q8 | **AI-consumable design systems** (agentic-design-systems, ai-component-metadata); **prompt-engineer** skill; `npx skills add` installer; distinctive frontend-design (anti "AI aesthetic") |
| Q9 | **Missing/weaker:** AI-readable component metadata, prompt-engineering skill, "avoid generic AI aesthetic" frontend guidance, subagent skill-testing |
| Q10 | `npx skills add owner/repo` — a standardized cross-repo skills installer worth documenting interop with |

---

## Recommended adoption — thedesignproject/agent-skills

| Priority | What | Our target | Effort |
|----------|------|------------|--------|
| **P1** | **`npx skills add` installer interop** — standardized cross-repo skill installer (`npx skills add owner/repo -s <skill> -g`) | Document in `docs/DISTRIBUTION.md` (our SKILL.md modules are compatible; note the community installer) | Low (docs) |
| **P1** | **Distinctive frontend-design guidance** (avoid generic "AI aesthetic": identical sans-serif + flat color) | Strengthen `frontend-agent.md` UX principles | Low |
| **P1** | **Subagent skill-testing** (`writing-skills`: verify a skill before deployment) | Add to R020 skill quality checklist / R023 roadmap | Low |
| **P2 (opt-in skill)** | **prompt-engineer** — write/refactor/evaluate prompts, output schemas, eval rubrics | New optional domain skill `prompt-engineering` (like `ux-research`) | Medium |
| **Roadmap** | **AI-consumable design systems** — component metadata schema (variants, tokens, anti-patterns) for agent consumers | ADR / roadmap — novel, niche; pairs with frontend-agent | Medium |
| **Defer** | figma-use/figma-generate (Figma MCP), presentation, marketing-psychology, business-kickoff | Out of core scope / domain-specific | — |

**Install pattern to note:** community `npx skills add` installer is complementary to our `npx github:…` — document, don't replace.

**Already COVERED:** accessibility → `accessibility-audit` playbook + frontend-agent WCAG; web-design-guidelines → frontend-agent + accessibility-audit; caveman → our `caveman` skill; find-skills → `using-platform` router + QUICK-REF; create-prd → `interview-me` + `spec-outline`; pr-branch-naming → release/git conventions in playbooks; create-skill → PLATFORM-HELP 7-step anatomy + R020 checklist; frontend build → frontend-agent + add-feature.

**Do not adopt wholesale:** domain skills (marketing-psychology, business-kickoff-workshop) and Figma-MCP-dependent skills — out of the dev-workflow core.

---

## Findings

## R025 — thedesignproject: `npx skills add` installer interop

Source: https://github.com/thedesignproject/agent-skills — Quick start

Observation: Installs skills via the community `npx skills add owner/repo` tool — interactive multi-select, `-s <skill-name>` for one/several, `-g` for global. A standardized, cross-repo skills installer that any `SKILL.md`-shipping repo can use.

Platform gap: Our skills install only via `npx github:zafrirron/Agent-Platform --mode=add`; we don't document that our framework-neutral `SKILL.md` modules are also consumable by the generic `npx skills` installer, nor point users to it.

Classification: ARCHITECTURE (interop)

Suggested path: Note the `npx skills add` installer in `docs/DISTRIBUTION.md` portable-skills section as a complementary install path.

Effort: Low | Impact: Low

Disposition: **Implemented** (2026-07-03) — "Community installer" note added to `docs/DISTRIBUTION.md` portable-skills section (`npx skills add <owner>/<repo> -s <skill> -g`, complementary to `--mode=add`, with vetting reminder).

---

## R026 — thedesignproject: AI-consumable design systems

Source: https://github.com/thedesignproject/agent-skills — `agentic-design-systems`, `ai-component-metadata`

Observation: Skills that design/scaffold/audit a component library **whose primary consumer is an AI agent** — generating machine-readable metadata for components, variants, tokens, and anti-patterns so an agent knows when/how to use each.

Platform gap: We have `frontend-agent` UX principles and `accessibility-audit`, but nothing on making a project's own design system agent-readable — an emerging need for teams whose UI is increasingly agent-built.

Classification: FEATURE

Suggested path: Roadmap / ADR — optional skill or `frontend-agent` extension defining a component-metadata schema; niche today, growing.

Effort: Medium | Impact: Medium

Disposition: **Deferred (roadmap)** (2026-07-03) — novel but niche; revisit when demand for agent-consumable design systems appears.

---

## R027 — thedesignproject: prompt-engineer skill

Source: https://github.com/thedesignproject/agent-skills — `prompt-engineer`

Observation: Writes, refactors, and evaluates LLM prompts — templates, structured output schemas, evaluation rubrics, test suites (chain-of-thought, few-shot, system prompts).

Platform gap: No prompt-engineering skill; teams building LLM-backed features have no platform workflow for prompt design/eval.

Classification: FEATURE

Suggested path: Optional domain skill `prompt-engineering` (cherry-pick, like `ux-research`); route via AGENTS.md keywords ("write a prompt", "eval prompt", "output schema").

Effort: Medium | Impact: Medium

Disposition: **Deferred (opt-in skill)** (2026-07-03) — viable optional domain skill; not built this batch. Ship on request following the `ux-research` pattern.

---

## R028 — thedesignproject: distinctive frontend-design guidance

Source: https://github.com/thedesignproject/agent-skills — `frontend-design`

Observation: Creates production-grade frontend that deliberately **avoids the generic "AI aesthetic"** (identical sans-serif + flat color UIs), aiming for distinctive, high-quality design.

Platform gap: `frontend-agent` has UX interaction principles but no explicit guardrail against homogeneous AI-generated UI.

Classification: STRENGTHEN

Suggested path: Add an "avoid the generic AI aesthetic" principle to `frontend-agent.md` (vary type/color/layout; justify design choices; production-grade over template default).

Effort: Low | Impact: Medium

Disposition: **Implemented** (2026-07-03) — "Distinctive design — avoid the generic 'AI aesthetic'" block added to `frontend-agent.md` UX interaction principles (reuse real design system, deliberate type/color/spacing/layout, justify choices, never over accessibility).

---

## R029 — thedesignproject: subagent skill-testing before deployment

Source: https://github.com/thedesignproject/agent-skills — `writing-skills`, `create-skill`

Observation: Skill-authoring skills that **create, edit, and verify a skill before deployment** using best practices, examples, and subagent-based testing.

Platform gap: Our R020 quality checklist defines the bar but has no "test the skill before shipping" step; PSG validates the platform, not an individual new skill's behavior.

Classification: STRENGTHEN

Suggested path: Add a "verify before ship" line to the R020 skill quality checklist (dry-run the skill on a sample task / subagent); feeds the R023 skill-optimizer roadmap.

Effort: Low | Impact: Low

Disposition: **Implemented** (2026-07-03) — "Verify before ship" item added to the `PLATFORM-HELP.md` skill quality checklist (dry-run on a representative task / subagent; confirm trigger, context, output before cataloguing).

---

## R030 — thedesignproject: PR/branch naming convention skill

Source: https://github.com/thedesignproject/agent-skills — `pr-branch-naming`, `guides/github-for-designers`

Observation: Generates conventionally-named branch + PR title from a feature description, with optional one-step checkout and draft PR creation.

Platform gap: Our `release`/git flow covers commit conventions but has no explicit branch/PR naming helper.

Classification: STRENGTHEN

Suggested path: Optional — a short branch/PR naming convention note in the release or add-feature playbook; low value vs existing git guidance.

Effort: Low | Impact: Low

Disposition: **Deferred** (2026-07-03) — low value; existing playbook git/commit conventions cover the need.

---

## COVERED

| Capability | Our equivalent |
|------------|----------------|
| Accessibility / WCAG | `accessibility-audit` playbook + frontend-agent |
| UI/design review | frontend-agent + accessibility-audit |
| Caveman compression | `caveman` skill |
| Skill discovery | `using-platform` router + QUICK-REF |
| PRD / spec from request | `interview-me` + `spec-outline` |
| Skill authoring anatomy | PLATFORM-HELP 7-step + R020 checklist |
| Frontend build | frontend-agent + add-feature playbook |
| Slash vs auto activation | `/` commands + AGENTS.md keyword routing |

---

## Quick-pick by effort + impact

| Finding | Title | Effort | Impact |
|---------|-------|--------|--------|
| R025 | `npx skills add` interop | Low | Low |
| R028 | Anti "AI aesthetic" frontend guidance | Low | Medium |
| R029 | Subagent skill-testing | Low | Low |
| R030 | PR/branch naming | Low | Low |
| R027 | prompt-engineer skill | Med | Med |
| R026 | AI-consumable design systems | Med | Med |

---

## Next scan

- Small, active design-focused pack — re-check only if it adds coordination/lifecycle patterns
- Mine `prompt-engineer` and `agentic-design-systems` on demand if teams request them
- **Do not re-propose:** R001, R005, R013, R016, R019, R020, R021 (Implemented) · caveman (COVERED)
