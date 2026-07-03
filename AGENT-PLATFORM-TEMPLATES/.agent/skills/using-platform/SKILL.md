---
name: using-platform
description: Maps incoming work to the right Agent Platform skill or playbook. Use at session start or when unsure which workflow applies.
---

## Overview

Read the user goal, pick **one** skill or playbook, execute it fully. Do not blend workflows.

## When to use

- Session start in lite profile
- User asks "what should I run?" or "which skill?"
- Task could match multiple workflows

## Process

1. Classify: **Define · Plan · Build · Verify · Review · Simplify · Perf audit · Context · Evidence · Ship**
2. Load the matching asset (skill `SKILL.md` or playbook under `.agent/playbooks/`)
3. Declare: `▶ Agent Platform Skills · [name]`
4. Follow that workflow's steps and verification gates

## Routing table

| Signal | Load |
|--------|------|
| Vague / interview / grill | `interview-me` |
| Explore concepts | `idea-refine` |
| Spec exists, need tasks | `planning-and-task-breakdown` |
| Ready to implement | `incremental-implementation` |
| Tests / TDD | `test-driven-development` |
| Simplify without behavior change | `code-simplification` |
| Browser UI runtime debug | `browser-testing-devtools` |
| User research / usability / journey map | `ux-research` (optional add-on) |
| CWV / perf audit / `/webperf` | `web-performance-audit` |
| Context stale / task switch / quality drop / `/context` | `context-engineering` |
| Claim done without proof / `/verify` | `verification-before-completion` |
| Feature / bug / refactor (repo playbook) | matching playbook in `.agent/playbooks/` |

## Active packs (stack/domain overlays)

Read `.agent/platform.json` → `active_packs`. If non-empty, after loading a skill/expert for a stack/domain-specific task, also read the matching overlay/reference under `.agent/packs/<id>/` (see each pack's `routing.md`). Example: a React re-render question with `stack-react` active → also read `packs/stack-react/references/react-pitfalls.md`. Skip silently when `active_packs` is empty.

## Verification

- [ ] Exactly one workflow loaded
- [ ] User told which skill/playbook is active
- [ ] Active-pack overlays applied when relevant (or skipped — none active)
