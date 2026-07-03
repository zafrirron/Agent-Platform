---
name: code-simplification
description: Minimalism ladder (write less, proactively), Chesterton's Fence, Rule of 500, simplify while preserving exact behavior. Use for /code-simplify.
attribution: Inspired by addyosmani/agent-skills (MIT); minimalism ladder adapted from DietrichGebert/ponytail (MIT)
---

## Overview

Reduce complexity — both **proactively** (write less in the first place) and **reactively** (simplify existing code without changing observable behavior).

## Minimalism ladder — before writing new code

Understand the problem first (read the real flow the change touches), then stop at the **first rung that holds**:

1. **Does this need to exist?** → no: skip it (YAGNI)
2. **Already in this codebase?** → reuse it, don't rewrite
3. **Standard library does it?** → use it
4. **Native platform feature?** → use it (e.g. `<input type="date">` over a date-picker dependency)
5. **Installed dependency does it?** → use it
6. **One line?** → one line
7. **Only then:** the minimum that works

**Safety floor — never cut to save lines:** trust-boundary validation, data-loss/error handling, security, and accessibility. Lazy about the solution, never about reading the code or keeping it safe.

## Process (reactive simplification)

1. **Measure:** tests green before touching code.
2. **Chesterton's Fence:** understand why each line exists before removing.
3. Simplify: naming, extract helpers, remove dead paths — **~100 lines per change** max.
4. Re-run full relevant test suite.
5. No behavior change unless user explicitly expands scope.

## Review mode — over-engineering delete-list

When invoked on a diff or PR ("review for over-engineering", `/code-simplify` on a diff): scan **only** for unnecessary complexity and return a **delete-list** — specific lines, abstractions, wrappers, or dependencies to remove, each with the simpler ladder rung that replaces it. Propose deletions; do not change behavior; the safety floor still applies (never list validation/security/a11y for removal).

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Rewrite while here" | Scope creep; split refactor from behavior change. |
| "No tests — simplify anyway" | Behavior preservation needs proof. |
| "Build the flexible/generic version now" | YAGNI — climb the ladder; add flexibility when a second caller actually needs it. |

## Verification

- [ ] Tests still green
- [ ] Diff is reviewable size
- [ ] Safety floor intact — no validation/security/a11y removed to save lines
