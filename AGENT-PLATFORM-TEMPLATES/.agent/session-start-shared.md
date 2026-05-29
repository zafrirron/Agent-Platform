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

### Step 1b — Cross-framework Critic offer

1. Read `meta.updated_by` from `registry.yaml` — this is the framework that last ended a session
2. Read the most recent entry in `.agent/handoff/CURRENT.md`
3. **If** `meta.updated_by` is a DIFFERENT framework than the current one
   AND the most recent CURRENT.md entry has `Critic reviewed: no`:

   Present this offer to the user:
   ```
   ┌─────────────────────────────────────────────────────────────────┐
   │  Cross-framework Critic review available                        │
   │                                                                 │
   │  Last session: [meta.updated_by] — [goal from CURRENT.md]      │
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

Read `.agent/platform.json`. Check the `test_runner` field.

**If `test_runner` is already set (not a placeholder): skip this step entirely.**

If `test_runner` is missing, empty, or starts with `<fill-in`:

#### Phase A — Auto-detect from project files

Scan the project root for these files and determine the stack:

| File found | Detected stack | test_runner | coverage_cmd |
|-----------|---------------|-------------|--------------|
| `package.json` with `"jest"` in scripts or devDeps | JavaScript/Jest | `npx jest` | `npx jest --coverage` |
| `package.json` with `"vitest"` in scripts or devDeps | JavaScript/Vitest | `npx vitest run` | `npx vitest run --coverage` |
| `package.json` with `"mocha"` in scripts or devDeps | JavaScript/Mocha | `npx mocha` | `npx nyc mocha` |
| `package.json` with any `test` script | Node.js | `npm test` | `npm test -- --coverage` |
| `pyproject.toml` or `pytest.ini` or `setup.cfg` | Python/pytest | `pytest` | `pytest --cov` |
| `go.mod` | Go | `go test ./...` | `go test -cover ./...` |
| `Cargo.toml` | Rust | `cargo test` | `cargo tarpaulin` |
| `.csproj` or `.sln` | .NET | `dotnet test` | `dotnet test /p:CollectCoverage=true` |
| `Makefile` with a `test` target | Make | `make test` | `make coverage` |

If detected:
- Write `test_runner` and `coverage_cmd` to `.agent/platform.json`
- Update `.agent/CONVENTIONS.md` `## Testing` section with the real values
- Confirm: `"✅ Test runner auto-detected: <command>"`
- Continue to the next step

#### Phase B — Ask if detection failed

If no stack was detected from files, ask:

> "I couldn't detect a test runner for this project. Does this project have tests set up?
> - **Yes** — tell me what language/framework (e.g. Jest, pytest, Go, .NET) and I'll configure it.
> - **No** — I can help you set one up. What language is this project written in?"

**If the user says Yes:** configure from their answer using the table above.

**If the user says No — offer to set one up:**

| Language | Offer to install |
|---------|-----------------|
| JavaScript/TypeScript | "I'll add Jest. Run: `npm install --save-dev jest` then I'll create a sample test." |
| Python | "I'll set up pytest. Run: `pip install pytest pytest-cov` then I'll create a sample test." |
| Go | "Go has built-in testing. I'll create a `_test.go` file to get started." |
| Other | Ask what testing framework they prefer |

After setup, write the values to `.agent/platform.json` and `.agent/CONVENTIONS.md`.

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

### Step 5 — Display quick reference

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
