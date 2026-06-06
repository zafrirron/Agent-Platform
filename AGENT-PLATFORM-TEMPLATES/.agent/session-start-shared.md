# Agent Platform — shared session start

> This file is called by every framework's session-start prompt.
> The calling file sets: `My framework folder name is: <fw-name>`
> Replace every occurrence of `<fw>` in this file with that value before executing.

---

## Execute these steps in order

### Step 1 — Conflict check and registry

1. Read `.agent/handoff/sync/registry.yaml`
2. **Capture** `meta.updated_by` as `previous_framework` before writing anything — this is needed for Step 1b
3. Check registry for any active sessions — two cases:

   **Case A — Another framework is active** (e.g. Codex active, you are starting Claude):
   ```
   ┌─────────────────────────────────────────────────────────────────┐
   │  [stuck_framework] has an open session                          │
   │                                                                 │
   │  Task : [task from registry]                                    │
   │  Files: [files list from registry]                              │
   │                                                                 │
   │  1. Take over — commit uncommitted work, close it, continue     │
   │     here. Use when that IDE ran out of credits or is gone.      │
   │  2. Wait — end the other session first if it is still running.  │
   │                                                                 │
   │  Reply 1 or 2.                                                  │
   └─────────────────────────────────────────────────────────────────┘
   ```

   **Case B — This framework already has an active session** (e.g. Claude crashed, new chat opened):
   ```
   ┌─────────────────────────────────────────────────────────────────┐
   │  You already have an open [current_framework] session           │
   │                                                                 │
   │  Task : [task from registry]                                    │
   │  Files: [files list from registry]                              │
   │                                                                 │
   │  1. Continue — close the previous session and start fresh here  │
   │     (uncommitted work will be committed first)                  │
   │  2. Cancel — if another window of this IDE is still running.    │
   │                                                                 │
   │  Reply 1 or 2.                                                  │
   └─────────────────────────────────────────────────────────────────┘
   ```

   **If user replies 2 (either case):** Stop. Do not continue.

   **If user replies 1 (either case) — Takeover sequence:**
   a. Read `completed_actions` from `registry.yaml` — this is the idempotency map
   b. Run `git status --short` to check for uncommitted work
   c. If uncommitted changes exist:
      - For each changed file: derive idempotency key `[file_path]:[last_modified_timestamp]`
      - Check if key already exists in `completed_actions` — if yes, skip that file (already handled)
      - Run `git add -A` for remaining files
      - Run `git commit -m "WIP: [framework] session interrupted — [task from registry]"`
      - Confirm commit succeeded
      - Add committed files to `completed_actions` with `completed_at: now, framework: [stuck_framework]`
   d. In `registry.yaml`: set `frameworks.[stuck_framework].status` → `idle`, `files` → `[]`, `finality_state` → `lost_confirmation`
   e. For Case A only: keep `meta.updated_by` as `[stuck_framework]` so Step 1b correctly offers cross-framework Critic review
   f. Continue to Step 1.4

   > **Why idempotency matters:** If the takeover commit fails mid-way and is retried, the same files
   > won't be double-committed. The `completed_actions` map prevents duplicate work across IDE switches.

   **If no active sessions found:** check for partial sessions (Case C below), then continue to Step 1.4

   **Case C — This framework has a partial previous session** (finality_state is `partial` or `failed`):
   Read `frameworks.<fw>.finality_state` and `frameworks.<fw>.step_manifest`.
   If `finality_state` is `partial`:
   ```
   ┌─────────────────────────────────────────────────────────────────┐
   │  Previous session was incomplete                                │
   │                                                                 │
   │  Completed steps: [step_manifest list]                          │
   │  Last goal: [goal from CURRENT.md]                              │
   │                                                                 │
   │  1. Resume — continue from where it stopped                     │
   │  2. Start fresh — ignore previous partial state                 │
   │                                                                 │
   │  Reply 1 or 2.                                                  │
   └─────────────────────────────────────────────────────────────────┘
   ```
   If user replies 1: load the relevant playbook, skip already-completed steps from step_manifest, resume from first incomplete step.
   If user replies 2: clear `step_manifest`, set `finality_state: clean`, proceed normally.
   If `finality_state` is `failed`: note the failure in session context, proceed normally.

4. Set `frameworks.<fw>` → `active`, `started_at` → now, in `registry.yaml`
5. Set `meta.updated_by` → `<fw>`

### Step 1b — Cross-framework Critic offer

1. Use `previous_framework` captured in Step 1.2 — do NOT re-read `meta.updated_by` from registry (it now shows the current framework)
2. Read the most recent entry in `.agent/handoff/CURRENT.md`
3. **If** `previous_framework` is a DIFFERENT framework than the current one
   AND the most recent CURRENT.md entry does NOT contain `Critic reviewed: yes`
   (absent field or `Critic reviewed: no` both count as not reviewed):

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

### Step 1c — One-time migration of pre-existing AI configs (runs once, then never again)

Check if `.agent/MIGRATION-NOTES.md` exists.

**If it does not exist:** skip this step entirely.

**If it exists:** the user had pre-existing AI config files from one or more frameworks before installing the platform. Automatically migrate any valuable rules — regardless of which IDE or framework they came from.

**Migration procedure:**

1. Read `.agent/MIGRATION-NOTES.md` — find the backup folder path (e.g. `.agent/backup/pre-install-*/`)
2. Read `manifest.json` in that backup folder — it maps every backed-up filename to its original path
3. For EVERY backed-up file (all frameworks — Claude, Cursor, Codex, Antigravity, any others):
   - Read the file content
   - Identify which framework it came from by its original path:
     - `CLAUDE.md` → Claude Code instructions
     - `AGENTS.md` → previous agent rules
     - `.cursorrules` or `.cursor/rules/*.mdc` → Cursor rules
     - `.codex/instructions.md` → Codex instructions
     - Any other AI config file → read and evaluate
4. For each rule or instruction found across ALL backed-up files, evaluate:
   - **Domain coding rule** (backend, frontend, security, data, testing, DevOps) → add to the PROJECT section of the appropriate expert agent in `.agent/agents/`
   - **General coding convention** (naming, formatting, git, style) → add to `.agent/CONVENTIONS.md` PROJECT section
   - **Project-specific constraint** (e.g. "always use TypeScript", "max line length 100") → add to `.agent/CONVENTIONS.md` PROJECT section
   - **Session-start instruction or platform trigger** → skip (already handled by the platform)
   - **Boilerplate, placeholder, or zero-content rule** → skip
   - **Duplicate of an existing platform rule** → skip
5. For each rule migrated, output one line: `✅ Migrated: "[rule text]" → [target file]`
6. For each rule skipped, output one line: `⏭ Skipped: "[rule text]" (reason)`
7. If nothing was migrated: output `ℹ No custom rules found worth migrating.`
8. Delete `.agent/MIGRATION-NOTES.md` — migration is complete, this step will never run again

> **Framework-agnostic by design:** It does not matter which IDE the user came from. All backed-up AI configs are read, evaluated, and merged into the platform in one automatic pass.
> **The user does nothing.** No manual copying, no file editing, no prompts.

### Step 1d — First-session audit offer

**Check:** does the file `.agent/context/.audit-offered` exist?

- **If it exists:** skip this step entirely — the offer has already been shown.
- **If it does NOT exist:** this is the first real session. **Immediately** write the file `.agent/context/.audit-offered` with content `offered` — do this BEFORE showing the offer, so the flag is set regardless of how the user replies or whether the session is interrupted.

> Do NOT use CURRENT.md to decide this. The flag file is the only source of truth.

Present this offer:
```
┌──────────────────────────────────────────────────────────────────┐
│  First session detected — Full Project Audit available           │
│                                                                  │
│  Run a professional audit of this codebase across 8 domains:     │
│  Architecture · Documentation · Security · Tests · Code Quality  │
│  Data · API Coverage · DevOps & CI                               │
│                                                                  │
│  Generates a full report at: .agent/context/audit-[date].md     │
│  Takes 3-10 minutes depending on codebase size.                  │
│                                                                  │
│  Ideal for: onboarding · pre-release checks · unknown repos      │
│                                                                  │
│  Run audit now? YES / NO (run manually later)                    │
└──────────────────────────────────────────────────────────────────┘
```

- **If YES:** immediately read `.agent/playbooks/audit.md` and execute it. After the audit completes, continue to Step 2.
- **If NO:** continue to Step 2. User can run the audit any time by saying `"Run project audit"`.

> **The audit can also be run manually at any time** — say `"Run project audit"` or `"Read .agent/playbooks/audit.md and execute it."`

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

Output this compact status block. Substitute all values inline — do not read any additional files for this step.

Output this status block as plain text (no code block) so markdown links render as clickable:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**{{PROJECT_NAME}} · Agent Platform v{{BOOTSTRAP_VERSION}} · <fw>**
Last work : <one-line summary from CURRENT.md, or "no prior sessions">
Updates   : <"✅ Up to date" | "⚠️ vX.Y.Z available — say 'upgrade platform'">
Reference : 📄 [.agent/QUICK-REF.md](.agent/QUICK-REF.md) · say `"platform help"` for full guide · `"caveman mode"` cuts output ~65%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Do NOT read or output QUICK-REF.md at session start.**
It is displayed only when the user explicitly asks (see trigger below).

> **Trigger — when the user says any of:** "show quick reference", "show help", "show commands", "what can you do", "platform help", "how does this work"
> → Output exactly: 📄 [.agent/QUICK-REF.md](.agent/QUICK-REF.md) — open in your editor for the full capability guide.
> Do NOT read or output the file contents into chat.

### Step 6 — Log session start

Prepend a new entry to `.agent/handoff/CURRENT.md`:

```
**Framework:** <fw> | **Status:** in_progress | **Started:** <today>
**Goal:** <ask user or leave as "pending — user has not stated a task yet">
**Budget:** files-modified: 0 | turns: 0
```

### Step 6b — Session budget

Track these limits throughout the session. After each significant action, increment the counters mentally:

| Budget | Limit | Action when hit |
|---|---|---|
| Files modified | 30 files | Pause. Summarise what changed. Ask user to confirm before continuing. |
| Turns (back-and-forth exchanges) | 50 turns | Check in: "We've had 50 exchanges this session — should we end and start fresh?" |
| Consecutive tool failures | 3 in a row | Stop. Report the blocker in CURRENT.md. Do not retry a fourth time. |

**Why:** Runaway sessions silently accumulate risk. Explicit budget limits surface scope creep and prevent uncontrolled cascading changes.

### Step 7 — Activate auto-routing

Read `AGENTS.md` Section 2 (Auto-routing).

From this point until session end, follow the routing table exactly:
- When the user describes a task, identify the matching row in the table
- **Immediately READ the expert file** listed — do not just act from memory
- **Immediately READ the playbook file** listed — do not skip it, it defines the required steps
- Follow the playbook steps in numbered order; apply expert rules at every step
- Never ask the user which file to read — determine and read it automatically
- Never announce what you are reading — just read and begin
- If a task spans domains, chain experts in order: Architect → domain expert → Test → Critic

**Manifest-augmented routing:** The routing keywords in the table above are the primary source. Each agent also declares `routing_keywords` in their `.agent/agents/<name>-agent.manifest.json`. When the routing table has no clear match, read the manifest files from `.agent/agents/` and check their `routing_keywords` before asking the user for clarification — this eliminates drift between the routing table and agent capabilities.

### Step 8 — Ready

Output exactly:
```
Ready. Tell me what you want to do.
```
