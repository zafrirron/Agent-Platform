---
name: idea-refine
description: Divergent then convergent thinking to turn vague ideas into concrete proposals. Use before spec when exploring options.
attribution: Inspired by addyosmani/agent-skills (MIT)
---

## Overview

Explore 2–3 directions, then recommend one with trade-offs.

## Process

1. State the rough idea in one sentence.
2. **Diverge:** list 2–3 distinct approaches (constraints, risks, effort).
3. **Converge:** recommend one; ask user to pick or combine.
4. Output a short proposal: goal, non-goals, success metrics, open risks.
5. Hand off to `interview-me` or `requirements-clarification` playbook if still underspecified; else `planning-and-task-breakdown`.

## Verification

- [ ] At least two options compared
- [ ] User explicitly picks direction before build
