# Agent Platform — shared session end

> This file is called by every framework's session-end prompt.
> Replace every `<fw>` with the actual framework folder name before executing.

---

## Execute these steps in order

### Step 1 — Summarise work done

Derive this entirely from your session context — do NOT ask the user what changed.
You have full context of everything done since session start: files read, files written, tasks completed.

Write a 2–4 line summary covering:
- Files changed (list each file explicitly — this is used for cross-framework critic review)
- Behaviour added or fixed
- Tests written or updated
- Any blockers or known issues left open

Hold this summary for Step 3.

### Step 2 — Run pre-handoff checklist

Read `.agent/CHECKLIST.md` and verify each item. For any item that is not satisfied, note it in the session log (Step 3). Do not mark done if:
- New code has no tests
- The test suite is red
- There are unfilled `{{placeholder}}` stubs

### Step 2b — New doc file scan

Scan for any `.md` files created or added during this session that are not yet in `.agent/context/docs-registry.md`:

```
git diff --cached --name-only --diff-filter=A -- "*.md"
git status --short | grep "^?" | grep "\.md$"
```

For each unregistered file found:
- Add a row to `docs-registry.md` immediately
- Owner = the expert who created it (or ask if unclear)
- Do not end the session with unregistered doc files

If no new `.md` files were created: skip this step silently.

### Step 2c — Check for uncommitted changes

Run `git status --short` to check for uncommitted work.

**If there are uncommitted changes — STOP and tell the user:**

```
⚠️  Uncommitted changes detected:
[list the files]

Commit your work before ending the session so the next IDE can see it.
Run in terminal:
  git add -A
  git commit -m "your message"

Then run "End session." again.
```

**Do NOT proceed to Step 3 until the working tree is clean.**

**If working tree is already clean:** continue silently.

> **Why:** The next IDE reads committed state. Uncommitted changes are invisible to the cross-framework Critic and the next agent.

### Step 3 — Update handoff log

Update the most recent entry in `.agent/handoff/CURRENT.md` with this structure:

```
**Framework:** <fw> | **Status:** done | **Ended:** <today>
**Goal:** <what was accomplished>
**Files changed:**
  - <file1> — <what changed>
  - <file2> — <what changed>
**Tests:** <tests added or confirmed green>
**Commit:** <git commit hash from Step 2c, or "none — no changes">
**Critic reviewed:** no
**Next agent:** <which expert or framework, if known>
**Notes:** <blockers, known issues, or anything the next agent should know>
```

> **Important:** List every changed file explicitly. The next framework's session-start
> will use this list to offer a cross-framework Critic review of your work.
> Set `Critic reviewed: no` — the next framework's session-start will update this.

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
