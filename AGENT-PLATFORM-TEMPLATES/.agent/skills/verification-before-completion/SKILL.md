---
name: verification-before-completion
description: Evidence before "done" — re-run tests, repro steps, logs. Use after fixes, before ship, or when agent claims success without proof. /verify
attribution: Patterns from obra/superpowers verification-before-completion + systematic-debugging (MIT)
---

## Overview

**Claims are not proof.** Before marking any fix, feature, or audit complete, gather **evidence** from tools — not narrative.

## When to use

- User types `/verify` or "are we really done?"
- After bug fix, refactor, perf change, or security patch
- Agent says "fixed", "tests pass", "works now" without showing output
- End of `debug-pipeline` Step 6 or before `release` / `/ship`

## Process

1. **State the claim** — one sentence: what should now be true?
2. **Define evidence** — what observable output proves it?
   - Bug fix → original repro steps pass
   - Tests → full relevant suite exit 0 (show command + summary)
   - Perf → before/after metrics from tools (not "feels faster")
   - Security → specific check ran (grep, scanner, manual step cited)
3. **Run evidence** — execute commands yourself; paste key lines (exit code, pass count, metric values).
4. **NOT VERIFIED** — if evidence cannot be run (no env, missing creds), say so explicitly; do not mark done.
5. **Regression scan** — no new failures in adjacent tests or lint where applicable.
6. **Handoff** — if verified, one-line evidence summary for `CURRENT.md` or PR description.

## Evidence checklist by task type

| Task | Minimum evidence |
|------|------------------|
| Bug fix | Repro steps + regression test pass |
| Feature | Acceptance criteria + new/changed tests pass |
| Refactor | Full test suite (or agreed subset) exit 0 |
| Perf | Measured metric vs baseline or NFR row |
| Docs-only | Link or path to updated doc; no false "tests pass" |

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'm confident it works" | Step 3 requires command output — confidence is not evidence. |
| "Tests are slow — skip" | Run targeted tests minimum; say which suite was skipped and why. |
| "User can verify manually" | Run what you can; list what only the user can confirm. |
| "Fixed the symptom" | Repro must match original failure mode from debug pipeline. |

## Verification

- [ ] Claim stated in one sentence
- [ ] Evidence command(s) executed and output cited
- [ ] `NOT VERIFIED` used where evidence missing — task not closed as done
- [ ] No "should work" / "looks good" without tool output
