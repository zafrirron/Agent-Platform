---
name: incremental-implementation
description: Thin vertical slices — implement, test, verify, commit. Use for /build. Supports /build auto after plan approval.
attribution: Inspired by addyosmani/agent-skills (MIT)
---

## Overview

One slice at a time. Feature flags and safe defaults when appropriate.

## Modes

| Mode | Trigger | Behavior |
|------|---------|----------|
| **Slice** | `/build` or "implement next task" | One approved task from plan; test + commit |
| **Auto** | `/build auto` or "build auto" | Run all plan tasks sequentially; pause on failure or risky step; commit per task |

## Process (slice)

1. Confirm which task (from plan or user).
2. **Minimalism gate** — before writing, climb the ladder in `code-simplification` (need it? → reuse → stdlib → native → dep → one line → minimum); build the smallest complete slice that works. Never cut validation/security/a11y to save lines.
3. Run tests; fix until green.
4. Commit with scoped message.
5. Report done-when evidence; ask to continue or stop.

## Process (auto)

1. Load approved task list (plan or spec-outline).
2. For each task: implement → test → commit → brief status.
3. **Pause** on: test failure, security-sensitive change, ambiguous scope, user interrupt.
4. Do not skip verification between tasks.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Batch whole feature" | Slices reduce blast radius. |
| "Tests after all tasks" | Each slice needs proof before next. |

## Verification

- [ ] Tests pass for completed slice(s)
- [ ] Commits are atomic per task
