---
name: test-driven-development
description: Red-Green-Refactor, test pyramid (80/15/5), DAMP over DRY, Beyoncé Rule. Use for /test and behavior changes.
attribution: Inspired by addyosmani/agent-skills (MIT)
---

## Overview

Tests are proof — not an afterthought.

## Process

1. **Red:** write failing test for desired behavior.
2. **Green:** minimal code to pass.
3. **Refactor:** improve structure; tests stay green.
4. Respect pyramid: unit heavy · integration selective · e2e sparse.
5. Beyoncé Rule: if you liked it you should have put a test on it.

## References

Load `.agent/references/testing-patterns.md` when stuck on structure or mocks.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Test after feature works" | Untested "works" regresses silently. |
| "Too slow for TDD" | One test now beats debugging later. |

## Verification

- [ ] Failing test existed before production fix (or documented exception)
- [ ] Suite green at end
