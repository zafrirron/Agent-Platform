---
name: code-simplification
description: Chesterton's Fence, Rule of 500, simplify while preserving exact behavior. Use for /code-simplify.
attribution: Inspired by addyosmani/agent-skills (MIT)
---

## Overview

Reduce complexity without changing observable behavior.

## Process

1. **Measure:** tests green before touching code.
2. **Chesterton's Fence:** understand why each line exists before removing.
3. Simplify: naming, extract helpers, remove dead paths — **~100 lines per change** max.
4. Re-run full relevant test suite.
5. No behavior change unless user explicitly expands scope.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Rewrite while here" | Scope creep; split refactor from behavior change. |
| "No tests — simplify anyway" | Behavior preservation needs proof. |

## Verification

- [ ] Tests still green
- [ ] Diff is reviewable size
