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

## Simplification discipline (Chesterton's Fence)
- **Chesterton's Fence:** before removing or simplifying code, understand why it exists — if the reason is not obvious, document it in `CURRENT.md` before changing
- **Rule of 500:** files approaching 500+ lines are simplify/split candidates — address in a dedicated refactor pass, not mixed with other change types
- Simplification must preserve **exact behaviour** — if behaviour changes, stop and re-classify as bug-fix or add-feature with BC check

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "I'll simplify and add the feature in one PR" | Refactor and feature are separate diffs — mixed diffs hide regressions. |
| "No tests — I'll be careful" | Pre-condition: tests must exist. Write tests first in a separate commit. |
| "This code is ugly — delete it" | Chesterton's Fence — understand purpose before removal. |
| "Rename + extract in one go" | One change type per PR — easier review and bisect. |

## Rules
- One type per PR / commit — never mix rename + extract in same diff
- Never: add features, change behavior, or update deps in a refactor diff
- If tests don't exist → write them first; ship as a separate commit
- If refactor reveals a bug → stop; file separate bug-fix task; don't fix in-line
- If scope grows beyond original agreement → stop; discuss with user
- **BC rule:** a refactor must preserve all public contracts — any change to an exported function signature, component prop, API response shape, or observable behavior is **not a refactor**; stop and re-classify as a feature or bug-fix task with a BC check applied
- **If a rename or move crosses a public boundary** (exported module, published package, documented API): output a ⚠️ BC BREAK notice (format: `BEST-PRACTICES.md`) and require user approval before proceeding
