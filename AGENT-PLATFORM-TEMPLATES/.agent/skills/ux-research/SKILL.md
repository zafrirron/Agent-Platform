---
name: ux-research
description: Plan and run user research — interviews, usability tests, surveys, journey maps, and accessibility research — turning findings into actionable, verifiable design recommendations. Optional domain skill; cherry-pick with --mode=add.
attribution: Adapted from saeed-vayghan/gemini-agent-skills ux-researcher (MIT), itself derived from VoltAgent/awesome-claude-code-subagents
---

## Overview

Use this skill **before build** when a feature's user need, flow, or usability is unclear — the discovery counterpart to `interview-me` (which clarifies *requirements*, not *user behavior*). Produce evidence, not opinions.

Pairs with: `requirements-clarification` playbook (define phase), `accessibility-audit` playbook (WCAG), frontend-agent (UX interaction principles).

## When to use

- "Should the flow be X or Y?" — needs user evidence, not a guess
- Usability concerns on an existing screen
- Persona / journey mapping before a redesign
- Accessibility research beyond an automated WCAG pass
- Post-launch: why are users dropping off / erroring?

**Not for:** pure requirements gathering (use `interview-me`), or automated a11y checks (use `accessibility-audit`).

## Process

### 1. Plan
- State the **research question** and the decision it informs.
- Pick method: interview · usability test · survey · analytics review · A/B analysis.
- Define participants, sample size, and success criteria.
- Note assumptions and the bias risks for the chosen method.

### 2. Conduct
- Run sessions or pull data with a consistent protocol.
- Capture raw observations verbatim — separate observation from interpretation.
- Triangulate: at least two data sources before a conclusion.

### 3. Synthesize
- Cluster findings into themes; rank by impact on the decision.
- Convert each theme into an **actionable recommendation** an agent or designer can implement.
- Flag confidence level (evidence strength) per recommendation.

### 4. Hand off
- Output: recommendation list → feeds `/spec`, `requirements-clarification`, or `add-feature` Step 0.
- Accessibility findings → cross-link `accessibility-audit` playbook.

## Method quick-reference

| Method | Use when | Output |
|--------|----------|--------|
| User interview | Understand motivations / mental models | Themed insights |
| Usability test | Validate a flow or prototype | Task success rate + friction points |
| Survey | Quantify a known question at scale | Statistically framed answers |
| Analytics / funnel | Explain drop-off in live product | Behavioral evidence |
| A/B analysis | Compare two variants | Significance-checked winner |
| Journey map | See cross-touchpoint experience | Pain points + opportunity areas |

## Verification

- [ ] Research question tied to a concrete product decision
- [ ] Method's bias risks named and mitigated
- [ ] Findings triangulated (≥2 sources) before any recommendation
- [ ] Each recommendation is actionable with a stated confidence level
- [ ] Accessibility findings routed to `accessibility-audit` when relevant
