# Agent Platform — shared session start

> This file is called by every framework's session-start prompt.
> The calling file sets: `My framework folder name is: <fw-name>`
> Replace every occurrence of `<fw>` in this file with that value before executing.

---

## Execute these steps in order

### Step 1 — Conflict check and registry

1. Read `.agent/handoff/sync/registry.yaml`
2. Check if any other framework has `status: active` with overlapping `files`
   - If conflict found: stop, report which framework owns which files, ask user to end that session first
   - If no conflict: continue
3. Set `frameworks.<fw>` → `active`, `started_at` → now, in `registry.yaml`
4. Set `meta.updated_by` → `<fw>`

### Step 2 — Update check (max once every 7 days)

1. Read `.agent/platform.json`
2. Check `last_update_check` field:
   - If field is missing OR the date is more than 7 days before today → run the check
   - If the date is within the last 7 days → skip (use cached `last_update_status`)
3. If running the check:
   - Run `node .agent/tools/check-updates.mjs`
   - Write today's date (YYYY-MM-DD) to `last_update_check` in `platform.json`
   - Write result (`"up_to_date"` or `"update_available: vX.Y.Z"`) to `last_update_status` in `platform.json`
4. Read `last_update_status` from `platform.json` for display in Step 4

### Step 3 — Last work context

1. Read `.agent/handoff/CURRENT.md`
2. Extract the most recent entry's one-line summary (goal or status line)
3. Hold it for display in Step 4

### Step 4 — Display quick reference

1. Read `.agent/QUICK-REF.md`
2. Replace every `<fw>` in the file with the actual framework folder name
3. Prepend this status header before the table output:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {{PROJECT_NAME}} | Agent Platform v{{BOOTSTRAP_VERSION}} | Framework: <fw>
  Last work : <one-line summary from CURRENT.md, or "no prior sessions">
  Updates   : <last_update_status — "✅ Up to date" or "⚠️ Update available: vX.Y.Z — run: Read .agent/tools/upgrade.md and execute it.">
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

4. Output the **complete** contents of `.agent/QUICK-REF.md` with `<fw>` substituted.
   **IMPORTANT: Output every section in full. Do NOT summarise, truncate, collapse, or skip any section.**
   The file contains these sections — all must be shown:
   - Session
   - Expert Agents (all 8 rows)
   - Playbooks (all 8 rows)
   - Project Knowledge (all 5 rows)
   - Testing (all 3 rows)
   - Token Compression / Caveman (all 3 rows)
   - Platform (all rows)

### Step 5 — Log session start

Prepend a new entry to `.agent/handoff/CURRENT.md`:

```
**Framework:** <fw> | **Status:** in_progress | **Started:** <today>
**Goal:** <ask user or leave as "pending — user has not stated a task yet">
```

### Step 6 — Ready

Output exactly:
```
Ready. Tell me what you want to do.
```
