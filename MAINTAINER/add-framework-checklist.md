# Checklist: Add a New IDE Framework

> Use this when adding a 5th (or Nth) framework to Agent Platform.
> Every item must be completed for full parity. Do not ship without checking all boxes.
>
> **Activate maintainer agent first:**
> `Read MAINTAINER/platform-maintainer-agent.md`
> `Task: Add [FrameworkName] as a new supported framework`

---

## Variables to define before starting

| Variable | Description | Example |
|----------|-------------|---------|
| `FOLDER` | Private folder name (no dot) | `windsurf` |
| `DISPLAY` | Human display name | `Windsurf` |
| `ID` | Framework ID used in registry | `windsurf` |
| `RULES_FORMAT` | How this IDE reads agent rules | `.windsurfrules` / `rules/*.md` / `instructions.md` |
| `SKILL_FORMAT` | How to wire shared skills | MDC rules / skill file / instructions note |

---

## Group 1 — Create framework private folder (new files)

- [ ] `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/FRAMEWORK.json`
  ```json
  { "framework_id": "<ID>", "display_name": "<DISPLAY>",
    "private_root": ".<FOLDER>", "shared_hub": ".agent" }
  ```
- [ ] `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/prompts/session-start.md`
  ```
  # <DISPLAY> — session start
  My framework folder name is: `<FOLDER>`
  Do not edit [other framework folders] during this session.
  Read `.agent/session-start-shared.md` and execute it,
  replacing every `<fw>` with `<FOLDER>`.
  ```
- [ ] `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/prompts/session-end.md`
  Same pattern, calls `session-end-shared.md`
- [ ] `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/README.md`
  Private area declaration + session commands
- [ ] `AGENT-PLATFORM-TEMPLATES/.<FOLDER>/<rules-or-instructions>/`
  Wire caveman skill + platform-core rules in the format this IDE understands

---

## Group 2 — Installer (apply.js)

- [ ] Add `'<FOLDER>'` to `fw` array
- [ ] Add `<FOLDER>: '<DISPLAY>'` to `fwLabel` object
- [ ] Add `'.<FOLDER>'` to `managedDirs` (uninstall cleanup)
- [ ] Add `.<FOLDER>/` to `GI_BLOCK` gitignore entries
- [ ] Update hardcoded `'✔  4 IDE frameworks'` → `'✔  5 IDE frameworks'` + add to list
- [ ] Update hardcoded `'Works in: Claude Code · ...'` line to include `<DISPLAY>`

---

## Group 3 — Manifest (AGENT-PLATFORM-MANIFEST.json)

- [ ] Add `<ID>` to `"frameworks"` array
- [ ] Add file entries for all new framework template files:
  - `.<FOLDER>/FRAMEWORK.json`
  - `.<FOLDER>/prompts/session-start.md`
  - `.<FOLDER>/prompts/session-end.md`
  - `.<FOLDER>/README.md`
  - Any rules/skills/instruction files

---

## Group 4 — Shared template files (update existing)

- [ ] `.agent/handoff/sync/registry.yaml` — add `<ID>: { status: idle, ... }` block
- [ ] `.agent/ZONES.md` — add row: `.<FOLDER>/` → `<DISPLAY> private`
- [ ] `.agent/SYNC.md` — add `<ID>` to frameworks list
- [ ] `.agent/README.md` — add `<DISPLAY>` to shared-by list + `.<FOLDER>/` to private folders
- [ ] `.agent/handoff/TEMPLATE.md` — add `<ID>` to `Framework:` choice list
- [ ] `SYNC-POINTS.md` — add framework row to switch commands table
- [ ] `session-start.md` (universal) — add `<DISPLAY> → <FOLDER>` to identification table
- [ ] `session-end.md` (universal) — same identification table

---

## Group 5 — Update "do not edit" lists in existing frameworks

Each existing framework's rules/instructions tells agents not to edit other frameworks.
Add `.<FOLDER>/` to the "do not edit" list in each of these:

- [ ] `.claude/prompts/session-start.md` — add `.<FOLDER>/` to "do not edit" line
- [ ] `.cursor/prompts/session-start.md` — same
- [ ] `.agents/prompts/session-start.md` — same
- [ ] `.codex/prompts/session-start.md` — same
- [ ] `.cursor/rules/agent-sync.mdc` — add to sync rules
- [ ] `.agents/rules/00-multi-framework-sync.md` — add to sync rules
- [ ] `.codex/instructions.md` — add to instructions

---

## Group 6 — Documentation

- [ ] `README.md` — update "4 IDE frameworks" → "5 IDE frameworks" (3+ occurrences)
- [ ] `README.md` — add `<DISPLAY>` to all framework lists
- [ ] `AGENT-PLATFORM-FRAMEWORK-README.md` — update "What you get" count
- [ ] `AGENT-PLATFORM-FRAMEWORK-README.md` — add to session commands tables (§1 + §2)
- [ ] `AGENT-PLATFORM-FRAMEWORK-README.md` — update tree diagram in "What gets created"
- [ ] `AGENT-PLATFORM-FRAMEWORK-README.md` — update §4 "Switch between IDEs"
- [ ] `AGENT-PLATFORM-BOOTSTRAP.md` — add `.<FOLDER>/` to gitignore block + installed layout
- [ ] `PLATFORM-HELP.md` template — add to Session table + IDE switching section
- [ ] `QUICK-REF.md` template — session table (auto — uses `<fw>`, but add to note)
- [ ] `AGENTS.md` template — §1 session commands table
- [ ] `PLATFORM-HELP.md` template — add to expert chaining chain example

---

## Group 7 — Metadata + installers

- [ ] `package.json` — add `<ID>` to `"keywords"` array
- [ ] `.gitignore` (framework repo root) — add `.<FOLDER>/` comment
- [ ] `COPYING.md` — add `.<FOLDER>/` to deploy list
- [ ] `install.ps1` — add `<DISPLAY>` session-start example
- [ ] `MAINTAINER/platform-improvements.md` — log the addition

---

## Group 8 — Version and release

- [ ] Bump `bootstrap_version` in `AGENT-PLATFORM-MANIFEST.json`
- [ ] Bump version in `AGENT-PLATFORM-BOOTSTRAP.md` footer
- [ ] Bump version in `AGENT-PLATFORM-FRAMEWORK-README.md` footer
- [ ] Bump version in `package.json`
- [ ] Bump version in `README.md`
- [ ] `CHANGELOG.md` — document the new framework addition

---

## Summary counts

| Group | Items | Notes |
|-------|-------|-------|
| New files to create | 5–8 | Depends on framework's skill/rules format |
| apply.js changes | 6 | All in one file |
| Manifest entries | 5–8 | One per new template file |
| Existing files to update | ~18 | Registry, zones, docs, do-not-edit lists |
| **Total** | **~35** | |

---

## Framework folder naming conventions (reference)

| Framework | Folder | Rules format | Skill format |
|-----------|--------|-------------|-------------|
| Claude Code | `.claude/` | `/commands/*.md` | slash commands |
| Cursor | `.cursor/` | `/rules/*.mdc` | MDC rule file |
| Antigravity | `.agents/` | `/rules/*.md` | skill `.md` file |
| Codex (VS Code) | `.codex/` | `instructions.md` | plain-text note |
| **Windsurf** (next) | `.windsurf/` | `rules/*.md` or `.windsurfrules` | TBD |
| Cline | `.cline/` | `.clinerules` | TBD |
