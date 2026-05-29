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

### Step 4 — Update check (max once every 7 days)

1. Read `.agent/platform.json`
2. Check `last_update_check` field:
   - If field is missing OR the date is more than 7 days before today → run the check
   - If the date is within the last 7 days → skip (use cached `last_update_status`)
3. If running the check:
   - Run `node .agent/tools/check-updates.mjs`
   - Write today's date (YYYY-MM-DD) to `last_update_check` in `platform.json`
   - Write result (`"up_to_date"` or `"update_available: vX.Y.Z"`) to `last_update_status` in `platform.json`
4. Read `last_update_status` from `platform.json` for display in Step 4

### Step 5 — Last work context

1. Read `.agent/handoff/CURRENT.md`
2. Extract the most recent entry's one-line summary (goal or status line)
3. Hold it for display in Step 4

### Step 6 — Display quick reference

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

### Step 7 — Log session start

Prepend a new entry to `.agent/handoff/CURRENT.md`:

```
**Framework:** <fw> | **Status:** in_progress | **Started:** <today>
**Goal:** <ask user or leave as "pending — user has not stated a task yet">
```

### Step 8 — Ready

Output exactly:
```
Ready. Tell me what you want to do.
```
