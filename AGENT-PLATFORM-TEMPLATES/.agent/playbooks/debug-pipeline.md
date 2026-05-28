# Playbook: Debug pipeline

## Protocol — follow in order, never skip steps

1. **Reproduce** — confirm consistent trigger; write down exact repro steps
2. **Isolate** — strip to smallest failing case; remove unrelated deps, stub data
3. **Hypothesise** — list 2-3 most likely causes ranked by probability; state them before probing
4. **Probe** — test top hypothesis; one variable at a time; add targeted log or assertion
5. **Fix** — smallest change that eliminates the root cause (not just the symptom)
6. **Verify** — original repro case now passes; run full test suite; no new failures
7. **Log** — root cause + fix summary in `CURRENT.md`

## Common patterns

| Symptom | First probe |
|---------|------------|
| Silent failure | Log at entry + exit of suspect function |
| Wrong output | Print intermediate state at each pipeline stage |
| Intermittent failure | Add timestamps; look for race condition / timing |
| Works locally, fails CI | Compare env vars, runtime versions, file paths |
| Regression | `git log --oneline` last-good commit; bisect |
| Memory / perf degradation | Profile before guessing; measure, don't assume |

## Rules
- State your hypothesis before probing — don't poke randomly
- If probe disproves hypothesis, update ranked list before probing again
- Stuck after 3 hypotheses → escalate to Architect agent
- Never ship a fix you cannot explain
- Every fix must include a regression test
