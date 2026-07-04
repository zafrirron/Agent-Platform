# Add New IDE Framework — Agent Playbook

> **Trigger:** `Read MAINTAINER/add-framework.md and execute it.`
> **Load first:** `Read MAINTAINER/platform-maintainer-agent.md`
>
> When the maintainer says "add [FrameworkName] as a new framework",
> execute every step below in order. Do not skip any step.
> Report completion status after each group.

---

## Step 0 — Gather variables

Ask the maintainer for the following if not already provided:

| Variable | Description | Example |
|----------|-------------|---------|
| `FOLDER` | Private folder name (no dot) | `windsurf` |
| `DISPLAY` | Human display name | `Windsurf` |
| `ID` | Framework ID used in registry (usually same as FOLDER) | `windsurf` |
| `RULES_FORMAT` | How this IDE reads agent rules | `rules/*.md` or `.windsurfrules` or `instructions.md` |
| `RULES_FILENAME` | Filename for the platform-core rule in this IDE | `platform-core.md` |
| `CAVEMAN_FILENAME` | Filename for caveman skill in this IDE | `caveman.md` |

Confirm with maintainer before proceeding.

---

## What the new framework gets for FREE (no steps needed)

Because the new framework's session-start and session-end wrappers call the shared files
(`session-start-shared.md` and `session-end-shared.md`) with `<fw>` substituted,
the following capabilities are automatically included for the new framework with zero extra work:

| Capability | Where it lives | Why it's automatic |
|-----------|---------------|-------------------|
| Cross-framework Critic review offer | `session-start-shared.md` Step 1b | Compares `meta.updated_by` vs current `<fw>` — works for any framework ID |
| Conflict check and registry lock | `session-start-shared.md` Step 1 | Uses `<fw>` variable — works for any value |
| 7-day update check | `session-start-shared.md` Step 4 | Platform-agnostic — reads platform.json |
| Full Quick Reference display (with `<fw>` substituted) | `session-start-shared.md` Step 6 | `<fw>` in QUICK-REF.md substituted at runtime |
| Test runner one-time setup | `session-start-shared.md` Step 2 | Stack detection is project-specific, not framework-specific |
| Handoff log (`Critic reviewed: no` field) | `session-end-shared.md` Step 3 | Template uses `<fw>` — works for any framework |
| `meta.updated_by` → `<fw>` set at session end | `session-end-shared.md` Step 4 | This is what triggers cross-framework critic on the next switch |
| Pre-handoff checklist | `session-end-shared.md` Step 2 | Reads `.agent/CHECKLIST.md` — framework-agnostic |

**Do NOT add separate steps for any of the above.** They work automatically from day one.

---

## Step 1 — Create the framework private folder

### 1A — FRAMEWORK.json
Create `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/FRAMEWORK.json`:
```json
{
  "framework_id": "<ID>",
  "display_name": "<DISPLAY>",
  "private_root": ".<FOLDER>",
  "shared_hub": ".agent",
  "session": {
    "start": "Read .<FOLDER>/prompts/session-start.md and execute it.",
    "end":   "Read .<FOLDER>/prompts/session-end.md and execute it."
  },
  "sync": {
    "registry": ".agent/handoff/sync/registry.yaml",
    "handoff":  ".agent/handoff/CURRENT.md"
  }
}
```

### 1B — session-start.md

Before writing this file, read the existing session-start wrappers (e.g. `.claude/prompts/session-start.md`)
to get the current list of ALL existing framework folders. The "Do not edit" line must list every framework
folder that exists at the time of creation — not just the original 4.

Create `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/prompts/session-start.md`:
```
# <DISPLAY> — session start

**User command:** `Read .<FOLDER>/prompts/session-start.md and execute it.`

My framework folder name is: `<FOLDER>`

Do not edit `.claude/`, `.cursor/`, `.agents/`, `.codex/` [and any other framework folders that exist at time of creation] during this session.

Read `.agent/session-start-shared.md` and execute it, replacing every `<fw>` with `<FOLDER>`.
```

> **Note on what session-start-shared.md delivers automatically:**
> The shared file handles: conflict check, cross-framework Critic offer, 7-day update check,
> test runner setup, Quick Reference display, and session logging.
> The wrapper's ONLY job is declaring the framework name and calling the shared file.

### 1C — session-end.md

Before writing, read the current "Do not edit" pattern from `.claude/prompts/session-end.md`.

Create `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/prompts/session-end.md`:
```
# <DISPLAY> — session end

**User command:** `Read .<FOLDER>/prompts/session-end.md and execute it.`

My framework folder name is: `<FOLDER>`

Do not edit `.claude/`, `.cursor/`, `.agents/`, `.codex/` [and any other framework folders that exist] during this session.

Read `.agent/session-end-shared.md` and execute it, replacing every `<fw>` with `<FOLDER>`.
```

> **Note:** session-end-shared.md automatically sets `meta.updated_by → <FOLDER>` in registry.yaml
> at session end. This is what triggers the cross-framework Critic offer when the NEXT framework
> starts a session. No additional wiring needed.

### 1D — README.md
Create `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/README.md`:
```
# .<FOLDER>/ — <DISPLAY> private

This folder is private to <DISPLAY>. Other frameworks must not edit files here.

Start session: `Read .<FOLDER>/prompts/session-start.md and execute it.`
End session:   `Read .<FOLDER>/prompts/session-end.md and execute it.`

Switch frameworks: see `SYNC-POINTS.md`
```

### 1E — Platform-core rules (format: <RULES_FORMAT>)
Create `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/<rules-dir>/<RULES_FILENAME>` in the correct format for this IDE:
- Study how `.cursor/rules/platform-core.mdc` works for Cursor
- Study how `.agents/rules/00-multi-framework-sync.md` works for Antigravity
- Study how `.codex/instructions.md` works for Codex
- Create the equivalent for `<DISPLAY>` that declares: framework ID, do-not-edit list, shared hub reference

### 1F — Caveman skill wiring
Create `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/<skills-or-rules-dir>/<CAVEMAN_FILENAME>`:
- Read `.agent/skills/caveman/SKILL.md` for the caveman definition
- Create the framework-appropriate wiring (same pattern as `.agents/skills/caveman.md` or `.cursor/rules/caveman.mdc`)
- Point to `.agent/skills/caveman/SKILL.md` as the definition source

---

## Step 2 — Update apply.js

Read `AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/apply.js`. Make these exact changes:

### 2A — fw array
Find: `const fw = ['claude', 'cursor', 'agents', 'codex'];`
Replace with: `const fw = ['claude', 'cursor', 'agents', 'codex', '<FOLDER>'];`

### 2B — fwLabel object
Find: `const fwLabel = { claude: 'Claude Code', cursor: 'Cursor', agents: 'Antigravity', codex: 'Codex (VS Code)' };`
Replace with: `const fwLabel = { claude: 'Claude Code', cursor: 'Cursor', agents: 'Antigravity', codex: 'Codex (VS Code)', <FOLDER>: '<DISPLAY>' };`

### 2C — managedDirs (uninstall cleanup)
Find: `const managedDirs  = ['.agent', '.claude', '.cursor', '.agents', '.codex'];`
Add `'.<FOLDER>'` to the array.

### 2D — Gitignore block
Find the `GI_BLOCK` constant. Add `.<FOLDER>/` to the list of gitignored platform folders.

### 2E — Hardcoded framework count and list
Find: `'✔  5 IDE frameworks    Claude Code · Cursor · Antigravity · Codex · OpenCode'`
Replace with: `'✔  6 IDE frameworks    Claude Code · Cursor · Antigravity · Codex · OpenCode · <DISPLAY>'`

Find: `'Works in: Claude Code · Cursor · Antigravity · Codex · OpenCode'`
Replace with: `'Works in: Claude Code · Cursor · Antigravity · Codex · OpenCode · <DISPLAY>'`

### 2F — platformCursorRules (if the new framework uses .cursor/rules)
No change needed unless the new framework also uses `.cursor/rules/`.

---

## Step 3 — Update AGENT-PLATFORM-MANIFEST.json

Read the manifest. Add all new framework files to the `files` array (after the existing codex entries):
```json
{
  "path": ".<FOLDER>/FRAMEWORK.json",
  "template": ".<FOLDER>/FRAMEWORK.json",
  "kind": "template"
},
{
  "path": ".<FOLDER>/prompts/session-start.md",
  "template": ".<FOLDER>/prompts/session-start.md",
  "kind": "template"
},
{
  "path": ".<FOLDER>/prompts/session-end.md",
  "template": ".<FOLDER>/prompts/session-end.md",
  "kind": "template"
}
```
Add entries for any additional rules/skills files created in Step 1.

Also add `"<ID>"` to the `"frameworks"` array.

---

## Step 4 — Update shared template files

### 4A — registry.yaml
Read `.agent/handoff/sync/registry.yaml`.
Add a new framework block (copy the pattern from an existing framework):
```yaml
  <ID>:
    status: idle
    started_at: null
    task: null
    files: []
```

### 4B — ZONES.md
Read `.agent/ZONES.md`. Find the Zone A framework table. Add:
```
| .<FOLDER>/ | <DISPLAY> private folder |
```

### 4C — SYNC.md
Read `.agent/SYNC.md`. Find the frameworks list. Add `**<ID>**` to it.

### 4D — .agent/README.md
Read `.agent/README.md`. 
- Add `<DISPLAY>` to the "Shared by" list.
- Add `.<FOLDER>/` to the private folders list.

### 4E — handoff/TEMPLATE.md
Read `.agent/handoff/TEMPLATE.md`. Find the `Framework:` choice line. Add `<ID>` to the options.

### 4F — SYNC-POINTS.md
Read `SYNC-POINTS.md`. Find the framework switch commands table. Add a new row:
```
| <DISPLAY> | `Read .<FOLDER>/prompts/session-start.md and execute it.` | `Read .<FOLDER>/prompts/session-end.md and execute it.` |
```

### 4G — session-start.md (universal entry)
Read `.agent/session-start.md`. Find the framework identification table. Add:
```
| <DISPLAY> | `<FOLDER>` |
```

### 4H — session-end.md (universal entry)
Same as 4G but in `.agent/session-end.md`.

---

## Step 5 — Update "do not edit" lists in existing frameworks

Each existing framework's session-start must declare the new framework as off-limits.

Read each of these files and add `.<FOLDER>/` to the "Do not edit" line:
- `AGENT-PLATFORM-TEMPLATES/.claude/prompts/session-start.md`
- `AGENT-PLATFORM-TEMPLATES/.cursor/prompts/session-start.md`
- `AGENT-PLATFORM-TEMPLATES/.agents/prompts/session-start.md`
- `AGENT-PLATFORM-TEMPLATES/.codex/prompts/session-start.md`
- `AGENT-PLATFORM-TEMPLATES/.opencode/prompts/session-start.md`

Also update any agent-sync rules files:
- `.cursor/rules/agent-sync.mdc` — add `.<FOLDER>/` to the protected folders list
- `.agents/rules/00-multi-framework-sync.md` — same
- `.codex/instructions.md` — add note about not editing `.<FOLDER>/`
- `.opencode/sync.md` — same

Also update the copy/paste switch table:
- `AGENT-PLATFORM-TEMPLATES/.agent/SWITCH-PROMPTS.md` — add a `<DISPLAY>` start/end row

---

## Step 6 — Update all documentation

> **Baseline:** the platform currently ships **5 IDE frameworks** (Claude Code, Cursor, Antigravity, Codex, OpenCode). The next framework you add is the **6th** — bump `5 → 6` everywhere below.

### 6A — README.md (root)
Read `README.md`. Make these changes:
- `"5 IDE frameworks"` → `"6 IDE frameworks"` (every occurrence)
- `"Claude Code, Cursor, Antigravity, Codex, and OpenCode"` → add `, and <DISPLAY>`
- Add `.<FOLDER>/` to the gitignore/folder lists
- Add `<DISPLAY>` row to the "What you get" frameworks table

### 6B — AGENT-PLATFORM-FRAMEWORK-README.md
Read the file. Make these changes:
- `"5 IDE frameworks"` → `"6 IDE frameworks"` in the "What you get" table
- Session start/end tables (§1, §2): add `<DISPLAY>` row
- Tree diagram in "What gets created": add `.<FOLDER>/` entry
- §4 "Switch between IDEs": add `<DISPLAY>` to the example
- `AGENT-PLATFORM-BOOTSTRAP.md` installed layout reference: add `.<FOLDER>/`

### 6C — AGENT-PLATFORM-BOOTSTRAP.md
Read the file. Make these changes:
- Gitignore block: add `.<FOLDER>/`
- Installed layout section: add `.<FOLDER>/` to the private IDE folders list

### 6D — PLATFORM-HELP.md template
Read `.agent/PLATFORM-HELP.md`. Make these changes:
- Session table: add `<DISPLAY>` row
- IDE switching section: add `<DISPLAY>` to the example
- Expert chaining note: add `<DISPLAY>` to the "works in all IDEs" mentions

### 6E — AGENTS.md template
Read `AGENTS.md`. Update §1 session commands table to include `<DISPLAY>`.

### 6F — PLATFORM-HELP.md "Zero footprint" section
Add `.<FOLDER>/` to the gitignored folders list.

---

## Step 7 — Metadata and installers

### 7A — package.json
Add `"<ID>"` to the `"keywords"` array.

### 7B — COPYING.md
Read `COPYING.md`. Add `.<FOLDER>/` to the framework private folders list.

### 7C — install.ps1
Read `install.ps1`. Add `<DISPLAY>` session-start example to the output section.

### 7D — apply.js: add new framework to artifact detection arrays

Read `AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/apply.js`. Make these two changes:

**In `FW_RULE_PATTERNS`** — add an entry for the new framework's rule files (if it has a rules/instructions folder):
```javascript
{ folder: '.<FOLDER>/rules', ext: '.md',
  platformFiles: new Set(['platform-core.md', 'caveman.md']),
  label: '<DISPLAY> rule' },
```
Adjust `folder`, `ext`, and `platformFiles` to match the actual framework structure.

**In `LEGACY_ROOT_FILES`** — add an entry if the framework has a legacy root-level config file (e.g., `.windsurfrules`):
```javascript
{ file: '.<FOLDER>rules', label: '<DISPLAY> rules (legacy root format)' },
```

If the framework has no legacy root file and no separate rules folder (e.g., its config is entirely inside `.<FOLDER>/`), skip both — no change needed to either array.

---

## Step 8 — Pre-existing artifact handling

Read apply.js `scanPreExistingArtifacts()`. If the new framework has framework-owned root files (unlikely but possible), add them to `PLATFORM_ROOT_FILES`.

Read `writeMigrationNotes()`. If there are pre-existing artifacts specific to this framework that users might have (e.g., `.windsurfrules`), add a guidance section explaining how to connect them to the platform.

---

## Step 9 — Version bump and release

1. Bump `bootstrap_version` in `AGENT-PLATFORM-MANIFEST.json`
2. Bump footer in `AGENT-PLATFORM-BOOTSTRAP.md`
3. Bump footer in `AGENT-PLATFORM-FRAMEWORK-README.md`
4. Bump version in `package.json`
5. Bump version in `README.md`
6. Write `CHANGELOG.md` entry:
   - What was added
   - New framework folder structure
   - How to start a session in the new IDE
   - Upgrade path: `npx github:zafrirron/Agent-Platform --mode=upgrade`

---

## Step 10 — Log to platform improvements

Write entry to `MAINTAINER/platform-improvements.md`:
```
### [vX.Y.Z] — YYYY-MM-DD — Added <DISPLAY> as 6th supported framework

**Motivation:** [why this framework was chosen]
**Files created:** N new files in AGENT-PLATFORM-TEMPLATES/.<FOLDER>/
**Files modified:** ~22 existing files updated
**Validated:** Pending
```

---

## Step 11 — Verify

Install in a scratch repo and confirm:
1. `npx github:zafrirron/Agent-Platform` completes without errors
2. `.<FOLDER>/` folder exists with correct files
3. `Read .<FOLDER>/prompts/session-start.md and execute it.` works correctly
4. `<FOLDER>` appears in registry.yaml
5. Session switching from another framework to `<FOLDER>` triggers cross-framework critic offer
6. `--mode=uninstall --confirm` removes `.<FOLDER>/` cleanly
