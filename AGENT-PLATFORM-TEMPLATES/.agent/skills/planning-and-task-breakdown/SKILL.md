---
name: planning-and-task-breakdown
description: Decompose an approved spec into small verifiable tasks with acceptance criteria and dependency order. Use after spec, before build.
attribution: Inspired by addyosmani/agent-skills (MIT)
---

## Overview

Turn spec-outline or PRD into an ordered task list — each task independently verifiable.

## Process

1. Read `.agent/context/spec-outline.md` (or user-approved spec).
2. List tasks as **vertical slices** — each touches code + test + verify.
3. Per task: acceptance criteria, files likely touched, dependency (blocked-by).
4. Order: foundation → core behavior → edge cases → docs.
5. Present plan; wait for user approval before `/build`.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Skip plan — start coding" | Unordered work skips tests and doubles back. |
| "One giant task" | Slices enable rollback and review. |

## Verification

- [ ] Every task has acceptance criteria
- [ ] User approved plan before implementation
