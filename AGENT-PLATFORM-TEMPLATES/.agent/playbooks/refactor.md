# Playbook: Refactor

## Pre-conditions (ALL must be true before starting)
- [ ] Tests exist with adequate coverage of the area being changed
- [ ] Behavior fully frozen — no feature additions in this diff
- [ ] Scope agreed with user and written down
- [ ] Files claimed in `registry.yaml`

## Steps
1. Run tests → all green (baseline)
2. Apply **one** type of change (see below)
3. Run tests → all green
4. Repeat steps 2-3 for each additional change type
5. Review: net diff should be smaller or same LOC; never larger

## Change types

| Type | What it means |
|------|--------------|
| **Rename** | Variable / function / class name → intent is clearer |
| **Extract** | Inline logic → named function, module, or constant |
| **Move** | Code in wrong file/module → correct home |
| **Simplify** | Complex expression → readable equivalent with same semantics |
| **Dedup** | Copy-paste blocks → shared function |

## Rules
- One type per PR / commit — never mix rename + extract in same diff
- Never: add features, change behavior, or update deps in a refactor diff
- If tests don't exist → write them first; ship as a separate commit
- If refactor reveals a bug → stop; file separate bug-fix task; don't fix in-line
- If scope grows beyond original agreement → stop; discuss with user
