# Agent Platform — shared session end

> This file is called by every framework's session-end prompt.
> Replace every `<fw>` with the actual framework folder name before executing.

---

## Execute these steps in order

### Step 1 — Summarise work done

Write a 2–4 line summary covering:
- Files changed
- Behaviour added or fixed
- Tests written or updated
- Any blockers or known issues left open

Hold this summary for Step 3.

### Step 2 — Run pre-handoff checklist

Read `.agent/CHECKLIST.md` and verify each item. For any item that is not satisfied, note it in the session log (Step 3). Do not mark done if:
- New code has no tests
- The test suite is red
- There are unfilled `{{placeholder}}` stubs

### Step 3 — Update handoff log

Update the most recent entry in `.agent/handoff/CURRENT.md`:
- Set `Status` → `done` or `blocked`
- Fill in the summary from Step 1
- Add `Tests:` line — what tests were added or confirmed green
- Add `Next agent:` — which expert or framework should pick this up (if known)

### Step 4 — Mark framework idle

In `.agent/handoff/sync/registry.yaml`:
- Set `frameworks.<fw>.status` → `idle`
- Clear `frameworks.<fw>.files` → `[]`
- Set `meta.updated_by` → `<fw>`

### Step 5 — Optional: prune handoff log

If `.agent/handoff/CURRENT.md` has more than 20 entries, run:
```
node .agent/tools/prune_handoff.js
```

### Step 6 — Confirm to user

Output exactly:
```
Session ended. Framework: <fw> → idle.
To continue in another IDE: Read .agent/session-start.md and execute it.
```
