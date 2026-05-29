# Changelog

All notable changes to **Agent Platform Bootstrap** are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning follows [Semantic Versioning](https://semver.org/).

---

## Upgrade matrix

| You are on | → 2.2.0 | Notes |
|------------|---------|-------|
| **2.1.0** (initial public) | ✅ Supported | 5-file copy + 2 placeholder fills — see [§ Upgrading 2.1 → 2.2](#upgrading-21--22) |
| **2.0.x** (pre-public / private) | ✅ Supported | Full re-install recommended — see [§ Upgrading 2.0 → 2.2](#upgrading-20--22) |
| **1.x** (legacy) | ⚠️ Manual | No automated path — see [§ Upgrading 1.x → 2.2](#upgrading-1x--22) |
| **< 1.0** | ❌ Not supported | Fresh install recommended |

> **Safe by default:** `mode=install` and `mode=repair` never overwrite existing files.  
> `mode=force` resets all templates — use only when you have no project-specific customisations to preserve.

---

## [2.2.0] — 2026-05-28

### Added

**Test enforcement** — agents can no longer mark a task done without tests.

| File | What changed |
|------|-------------|
| `.agent/agents/test-agent.md` | Full rewrite: "When to invoke" trigger table, 4-category test taxonomy (unit · integration · regression · contract), runner/coverage placeholders, 8 explicit rules |
| `.agent/CONVENTIONS.md` | Explicit "critical path" definition; test mandate for every new public function and every API endpoint; `COVERAGE_THRESHOLD` gate; red-suite-blocks-handoff rule |
| `.agent/CHECKLIST.md` | New dedicated **Testing** section with 6 checkboxes (runner, unit, regression, contract, coverage, untestable-code log) |
| `.agent/BEST-PRACTICES.md` | Completed Task Anatomy: Spec → Implement → Test → Handoff table; explicit "Done means" definition |
| `.agent/playbooks/api-integration.md` | Explicit test step with required cases (happy path + ≥1 error path + auth failure); added Rules section |

**Pack infrastructure**

| File | What changed |
|------|-------------|
| `AGENT-PLATFORM-MANIFEST.json` | New placeholders: `COVERAGE_CMD`, `COVERAGE_THRESHOLD` |
| `AGENT-PLATFORM-BOOTSTRAP.md` | Phase 0 detects `TEST_RUNNER`, `COVERAGE_CMD`; defaults `COVERAGE_THRESHOLD` to 80% |
| `AGENT-PLATFORM-FRAMEWORK-README.md` | Updated "What you get" table, Phase 0 description, Test expert row, §9 best-practices, quick-ref card; added "Upgrading from v2.x to v2.2" guide |
| `CHANGELOG.md` | Created (this file) |

### Changed

- `bootstrap_version` synced and bumped: `2.0.0` → `2.2.0` (manifest had not been bumped since initial private build; docs were already at 2.1).

### Fixed

- `BEST-PRACTICES.md` Task Anatomy section was empty (cut off at the heading).
- `test-agent.md` had only 3 lines of content — no actionable guidance.
- `api-integration.md` had no Rules section and no explicit test step.

---

## [2.1.0] — 2026-05-28 (initial public release)

First public release of the Agent Platform Bootstrap framework.

### Added

**Coordination layer (`.agent/` shared hub)**

- `BEST-PRACTICES.md` — 10 golden rules for agentic development
- `CHECKLIST.md` — pre-handoff verification checklist
- `CONVENTIONS.md` — coding, testing, git, and security conventions
- `FILE_MAP.md`, `PROJECT.md`, `WORKFLOWS.md`, `ZONES.md` — project-specific stubs
- `SYNC.md`, `SWITCH-PROMPTS.md` — cross-framework sync protocol

**8 software-expert agents** (`.agent/agents/`)

Architect · Backend · Frontend · DevOps · Test · Docs · Security · Data — domain personas with owned paths and rules.

**7 playbooks** (`.agent/playbooks/`)

add-feature · bug-fix · refactor · release · debug-pipeline · add-dependency · api-integration · security-audit

**5 living context files** (`.agent/context/`)

api-contracts · api-patterns · adr-log · known-issues · dependencies · project-overview

**Caveman skill** (`.agent/skills/caveman/`)

~65% output token compression; wired into all 4 frameworks; 5 slash commands for Claude Code.

**4 IDE framework private folders**

| Folder | Framework |
|--------|-----------|
| `.claude/` | Claude Code — session prompts, 5 slash commands, FRAMEWORK.json |
| `.cursor/` | Cursor — session prompts, 3 MDC rules, FRAMEWORK.json |
| `.agents/` | Antigravity — session prompts, skill wiring, FRAMEWORK.json |
| `.codex/` | Codex (VS Code) — session prompts, instructions, FRAMEWORK.json |

**Handoff + registry**

- `.agent/handoff/CURRENT.md` — session log (newest-first)
- `.agent/handoff/sync/registry.yaml` — active-framework lock (prevents concurrent edits)
- `.agent/handoff/TEMPLATE.md`, `task-template.md` — structured handoff formats

**Pack infrastructure**

- `AGENT-PLATFORM-BOOTSTRAP.md` — 5-phase install orchestrator
- `AGENT-PLATFORM-MANIFEST.json` — 88-file template manifest, placeholders: `PROJECT_NAME`, `PROJECT_DESCRIPTION`, `DATE`, `HIGH_CONFLICT_PATHS`, `TEST_RUNNER`, `BOOTSTRAP_VERSION`
- `AGENT-PLATFORM-APPLY.js` — Node 18+ installer with `--mode=install|repair|upgrade|force`
- `AGENT-PLATFORM-TEMPLATES/` — all installable file bodies (consumer-project neutral)
- `tools/build-bootstrap-manifest.js` — regenerates manifest from templates
- `tools/build-framework-readme.js` — regenerates framework README
- `COPYING.md` — exact file list for copying the pack
- `PACK-DEPLOY.md` — instructions for deploying to a consumer repo

---

## Upgrade guides

---

### Upgrading 2.1 → 2.2

**What changed:** 5 template files updated, 2 new placeholders added.  
**Risk:** Low — only template files change; no new directories or file moves.

**Step 1 — Update the pack files in your framework repo** (or skip if you are a consumer):

```
Copy the new AGENT-PLATFORM-BOOTSTRAP.md, AGENT-PLATFORM-MANIFEST.json,
and AGENT-PLATFORM-TEMPLATES/ from the v2.2.0 release.
```

**Step 2 — In each consumer repo, copy the 5 changed templates:**

```
AGENT-PLATFORM-TEMPLATES/.agent/agents/test-agent.md   → .agent/agents/test-agent.md
AGENT-PLATFORM-TEMPLATES/.agent/CONVENTIONS.md         → .agent/CONVENTIONS.md
AGENT-PLATFORM-TEMPLATES/.agent/CHECKLIST.md           → .agent/CHECKLIST.md
AGENT-PLATFORM-TEMPLATES/.agent/BEST-PRACTICES.md      → .agent/BEST-PRACTICES.md
AGENT-PLATFORM-TEMPLATES/.agent/playbooks/api-integration.md → .agent/playbooks/api-integration.md
```

> If your `.agent/CONVENTIONS.md` has project-specific content at the bottom (under `## Project-specific`), preserve that section — it is safe to overwrite everything above it.

**Step 3 — Fill the 2 new placeholders** in the copied files:

| Placeholder | Example values |
|-------------|---------------|
| `{{COVERAGE_CMD}}` | `pytest --cov` · `jest --coverage` · `go test -cover ./...` · `dotnet test /p:CollectCoverage=true` |
| `{{COVERAGE_THRESHOLD}}` | `80` (default) — adjust to your project's baseline |

**Step 4 — Verify:**

```
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=repair
```

This fills any remaining `{{placeholder}}` stubs without overwriting what you set.

---

### Upgrading 2.0 → 2.2

**What changed:** 2.0.x was a pre-public private build; the manifest version was `2.0.0` but the templates were functionally equivalent to 2.1.0.  
**Risk:** Low-medium — if you have project-specific content in stubs, preserve it manually.

**Recommended path:** treat as a fresh install with `mode=upgrade`, then apply the 2.1 → 2.2 steps above.

```
# 1. Copy the v2.2.0 pack to your consumer repo root
# 2. Tell your agent:
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=upgrade
# 3. Then follow the "Upgrading 2.1 → 2.2" Step 3 and Step 4 above
```

`mode=upgrade` adds any files that are in the manifest but missing from your repo without touching existing files.

---

### Upgrading 1.x → 2.2

**What changed:** The v2 pack is a full rebuild — new directory structure (`.agent/` shared hub), multi-framework architecture, manifest-driven installer.  
**Risk:** High — no automated migration path exists.

**Recommended path:** fresh install, then manually migrate your project-specific content.

```
# 1. Back up your existing .agent/ or equivalent folder
# 2. Copy the v2.2.0 pack to your repo root
# 3. Tell your agent:
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
# 4. After Phase 3 completes, compare your backup against the new stubs
#    and re-apply project-specific content (CONVENTIONS.md ## Project-specific,
#    WORKFLOWS.md, FILE_MAP.md, ZONES.md, context/ files)
```

Key structural differences from 1.x:

| 1.x | 2.x |
|-----|-----|
| Single IDE folder | 4 IDE private folders + shared `.agent/` hub |
| No registry | `registry.yaml` cross-IDE lock |
| No handoff log | `CURRENT.md` session log |
| No specialist agents | 8 domain expert personas |
| No playbooks | 7 step-by-step playbooks |
| No caveman skill | Token compression wired into all 4 frameworks |
