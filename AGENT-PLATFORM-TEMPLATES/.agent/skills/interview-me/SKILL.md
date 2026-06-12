---
name: interview-me
description: One-question-at-a-time interview until ~95% confidence on requirements. Use when the ask is underspecified or user says "interview me" / "grill me".
attribution: Inspired by addyosmani/agent-skills (MIT)
---

## Overview

Extract what the user **actually** wants — not what they think they should want.

## Process

1. Restate understanding in one sentence; confirm framing.
2. **One question per turn** — prefer concrete choices over open prompts.
3. Track confidence (0–100%) for writing testable acceptance criteria.
   - &lt; 80%: keep asking
   - 80–94%: one confirm question on biggest gap
   - ≥ 95%: write spec
4. Write `.agent/context/spec-outline.md` (objectives, in/out scope, boundaries).
5. User approves spec before any production code.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Skip questions — I know" | Rework costs more than one good question now. |
| "Batch five questions" | One at a time gets better answers. |
| "Code while clarifying" | Spec gate blocks code until approval. |

## Verification

- [ ] spec-outline.md populated and approved
- [ ] No production code written in this skill
