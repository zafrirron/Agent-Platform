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

### Step 2c — Commit all session work

**This step is mandatory. Do not skip it.**

Run `git status --short`.

**If there are uncommitted changes:**
1. Run `git add -A`
2. Run `git commit -m "<use the one-line summary from Step 1 as the commit message>"`
3. Run `git status --short` to confirm the working tree is clean
4. If the commit was blocked by a hook or error — report it to the user and stop

You have terminal/shell tools available. Use them now to run these commands directly.
Do not proceed to Step 3 until `git status` shows a clean working tree.

**If working tree is already clean:** continue to Step 3 silently.

> **Why:** The next IDE reads committed state. Uncommitted changes are invisible to the cross-framework Critic and the next agent. An agentic platform commits its own work.

### Step 2d — Capture reusable pattern (selective — skip if nothing new)

Ask yourself: **did this session solve a non-trivial problem in a non-trivial way?**

**Write a pattern entry if:**
- A tricky bug was root-caused and fixed using an approach worth remembering
- A design decision was made that future similar tasks should follow
- A testing strategy, refactor approach, or debugging technique worked unexpectedly well
- The problem was one that will likely recur in this codebase

**Skip silently if:**
- The work was straightforward CRUD, config, or docs with no new insight
- The approach was obvious and wouldn't help a future agent
- A very similar pattern already exists in `.agent/context/patterns.md`

**If a pattern is worth capturing:**

1. Read `.agent/context/patterns.md`
2. Prepend a new entry above the existing entries (newest first):

```
### [today's date] [Category]: [short title]

**Situation:** [what kind of problem — specific enough to recognise next time]
**Approach:** [what was done and the key insight — not the full code, the principle]
**Reuse when:** [how to recognise this pattern applies to a new task]
**Outcome:** [what it achieved — tests green, bug fixed, perf improved, etc.]
**Source:** Session [today's date] — [one-line goal from this session]
```

3. Remove the `*(No patterns recorded yet...)*` placeholder if this is the first entry.

> **Why this matters:** Patterns compound. Each session that captures a reusable insight makes every future session in this codebase smarter — without any infrastructure, databases, or servers. Just structured memory.

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

### Step 4 — Mark framework idle + write finality state

In `.agent/handoff/sync/registry.yaml`:
- Set `frameworks.<fw>.status` → `idle`
- Clear `frameworks.<fw>.files` → `[]`
- Set `meta.updated_by` → `<fw>`
- Set `frameworks.<fw>.finality_state` based on checklist outcome from Step 2:
  - All checklist items green AND test suite passed → `clean`
  - Some steps incomplete (e.g. tests not written, docs not updated) → `partial`
  - Session ended due to unresolved blocker → `failed`
- Set `frameworks.<fw>.step_manifest` to list the IDs of steps completed this session:
  ```
  step_manifest:
    - reproduce      # bug-fix step 1 complete
    - fix            # bug-fix step 4 complete
    - regression     # bug-fix step 5 complete
    - critic         # bug-fix step 5b complete
  ```
  Use short IDs matching the playbook step names. Empty list `[]` if no playbook was followed.

> **Why this matters:** `finality_state: partial` tells the next session-start to offer a targeted resume
> rather than a full restart. `step_manifest` tells it exactly which steps remain.

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
