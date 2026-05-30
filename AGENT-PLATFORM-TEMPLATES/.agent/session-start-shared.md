# Agent Platform — shared session start

> This file is called by every framework's session-start prompt.
> The calling file sets: `My framework folder name is: <fw-name>`
> Replace every occurrence of `<fw>` in this file with that value before executing.

---

## Execute these steps in order

### Step 1 — Conflict check and registry

1. Read `.agent/handoff/sync/registry.yaml`
2. **Capture** `meta.updated_by` as `previous_framework` before writing anything — this is needed for Step 1b
3. Check if any other framework has `status: active` with overlapping `files`
   - If conflict found: stop, report which framework owns which files, ask user to end that session first
   - If no conflict: continue
4. Set `frameworks.<fw>` → `active`, `started_at` → now, in `registry.yaml`
5. Set `meta.updated_by` → `<fw>`

### Step 1b — Cross-framework Critic offer

1. Use `previous_framework` captured in Step 1.2 — do NOT re-read `meta.updated_by` from registry (it now shows the current framework)
2. Read the most recent entry in `.agent/handoff/CURRENT.md`
3. **If** `previous_framework` is a DIFFERENT framework than the current one
   AND the most recent CURRENT.md entry has `Critic reviewed: no`:

   Present this offer to the user:
   ```
   ┌─────────────────────────────────────────────────────────────────┐
   │  Cross-framework Critic review available                        │
   │                                                                 │
   │  Last session: [previous_framework] — [goal from CURRENT.md]    │
   │  Files changed: [file list from CURRENT.md]                     │
   │                                                                 │
   │  A different AI model did this work. Would you like me to run   │
   │  a Critic review before we proceed?                             │
   │                                                                 │
   │  Reply YES to review, NO to proceed directly.                   │
   └─────────────────────────────────────────────────────────────────┘
   ```

4. **If user says YES:**
   - Load `.agent/agents/critic-agent.md` (cross-framework review mode)
   - Read all files listed under `Files changed:` in the CURRENT.md entry
   - Also read the goal and notes from CURRENT.md for context
   - Run the full 6-dimension review on those files
   - Present findings with severity ratings
   - Ask: "How would you like to proceed?
     - Fix Critical/High findings in this session
     - Note findings in CURRENT.md and proceed
     - Proceed without changes"
   - Update CURRENT.md: set `Critic reviewed: yes — [X Critical, Y High, Z Medium findings]`

5. **If user says NO** (or frameworks are the same, or already reviewed):
   - Continue to Step 2 — no critic review

> **Why this matters:** A different AI model (e.g. Cursor vs Claude Code) has different
> reasoning patterns and blind spots. A cross-framework critic catches what the first model
> missed precisely because it approaches the work fresh, with no prior context.

### Step 2 — One-time test runner setup

Read `.agent/platform.json`. Check `test_runner`.

**If already set (not `<fill-in...>`): skip this step entirely.**

If missing or placeholder: Read `.agent/tools/setup-test-runner.md` and execute it, then continue.

### Step 3 — Update check (max once every 7 days)

1. Read `.agent/platform.json`
2. Check `last_update_check` field:
   - If field is missing OR the date is more than 7 days before today → run the check
   - If the date is within the last 7 days → skip (use cached `last_update_status`)
3. If running the check:
   - Run `node .agent/tools/check-updates.mjs`
   - **If the check fails for any reason** (network unavailable, GitHub unreachable, Node.js error) — skip silently and continue. **Never block session start on a network call.**
   - If successful: write today's date (YYYY-MM-DD) to `last_update_check` and write result (`"up_to_date"` or `"update_available: vX.Y.Z"`) to `last_update_status` in `platform.json`
4. Read `last_update_status` from `platform.json` for display in Step 5

### Step 4 — Last work context

1. Read `.agent/handoff/CURRENT.md`
2. Extract the most recent entry's one-line summary (goal or status line)
3. Hold it for display in Step 4

### Step 5 — Display session status

Output this compact status block. Substitute all values inline — do not read any additional files for this step:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {{PROJECT_NAME}} · Agent Platform v{{BOOTSTRAP_VERSION}} · <fw>
  Last work : <one-line summary from CURRENT.md, or "no prior sessions">
  Updates   : <"✅ Up to date" | "⚠️ vX.Y.Z available — say 'upgrade platform'">
  Reference : open .agent/QUICK-REF.md · "caveman mode" to cut output ~65%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Do NOT read or output QUICK-REF.md at session start.**
It is displayed only when the user explicitly asks (see trigger below).

> **Trigger — when the user says any of:** "show quick reference", "show help", "show commands", "what can you do", "platform help", "how does this work"
> → Output exactly: `Quick reference: open .agent/QUICK-REF.md in your editor.`
> Do NOT read or output the file contents into chat.

### Step 6 — Log session start

Prepend a new entry to `.agent/handoff/CURRENT.md`:

```
**Framework:** <fw> | **Status:** in_progress | **Started:** <today>
**Goal:** <ask user or leave as "pending — user has not stated a task yet">
```

### Step 7 — Activate auto-routing

Read `AGENTS.md` Section 2 (Auto-routing).

From this point until session end, you are the active router:
- When the user describes any task, silently identify and load the right expert and/or playbook
- Begin working in the correct persona following the correct process
- Never ask the user which file to read — you determine and load it automatically
- Never announce "I will now load the Backend expert" — just load it and start
- If a task genuinely spans domains, chain the appropriate experts in order

This replaces the old model where users had to manually invoke experts and playbooks.

### Step 8 — Ready

Output exactly:
```
Ready. Tell me what you want to do.
```
