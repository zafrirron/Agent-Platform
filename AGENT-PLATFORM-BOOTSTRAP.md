# Agent Platform Bootstrap

> Portable multi-framework, multi-expert coordination pack.  
> OS-agnostic (Windows, Linux, macOS) · consumer-project neutral

**Full human guide (installation, usage, extending):** [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md)

---

## What this file is

Instructions for an **executing agent** to install the platform on **the repository where this command is run** (the consumer repository).

This file does not describe any particular product. Phase 3 discovers project facts from the local tree.

---

## Pack layout (must exist beside this file)

| Piece | Path |
|-------|------|
| Orchestrator | `AGENT-PLATFORM-BOOTSTRAP.md` (this file) |
| Manifest | `AGENT-PLATFORM-MANIFEST.json` |
| Templates | `AGENT-PLATFORM-TEMPLATES/` |

Installer: `AGENT-PLATFORM-APPLY.js` (Node.js 18+)

---

## Activate

**User command (primary)** — paste into any agentic IDE:

```
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
```

| Mode | User tells the agent |
|------|----------------------|
| Install | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.` |
| Repair stubs | `… and execute it. mode=repair` |
| Add new pack files | `… and execute it. mode=upgrade` |
| Overwrite templates | `… and execute it. mode=force` (confirm first) |

**Agent only (internal):** may run `node AGENT-PLATFORM-APPLY.js [--mode=…]` during Phase 2. Humans normally do not need the CLI.

---

## Phase 0 — Discover

1. `PROJECT_NAME` — folder or package name.
2. `PROJECT_DESCRIPTION` — first README paragraph or generic fallback.
3. Scan stack from files present (languages, build manifests).
4. `HIGH_CONFLICT_PATHS` — large or high-churn files in **this** tree.
5. `TEST_RUNNER` — detect from build manifests (e.g. `pytest`, `jest`, `go test ./...`, `dotnet test`, `cargo test`). Fall back to `"<fill-in test runner>"`.
6. `COVERAGE_CMD` — detect coverage command for the discovered runner (e.g. `pytest --cov`, `jest --coverage`). Fall back to `"<fill-in coverage command>"`.
7. `COVERAGE_THRESHOLD` — default to `80` if not found in project config; record as a percentage.
8. If platform already installed → prefer `mode=upgrade` for new manifest entries.

## Phase 1 — Verify pack

Require `AGENT-PLATFORM-MANIFEST.json` and `AGENT-PLATFORM-TEMPLATES/` at repository root. If missing, stop.

## Phase 2 — Apply

Run `node AGENT-PLATFORM-APPLY.js` with the chosen mode.

Substitute placeholders: `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, `{{DATE}}`, `{{HIGH_CONFLICT_PATHS}}`, `{{TEST_RUNNER}}`, `{{COVERAGE_CMD}}`, `{{COVERAGE_THRESHOLD}}`, `{{BOOTSTRAP_VERSION}}`.

Do not modify paths outside the manifest.

## Phase 3 — Stubs

From **this repository's** scan, fill:

- `.agent/PROJECT.md`, `FILE_MAP.md`, `WORKFLOWS.md`, `CONVENTIONS.md`
- `.agent/context/*` as applicable
- `.agent/ZONES.md` — source roots and conflict paths
- `.agent/platform.json` — `launch` commands for **this** project only
- `AGENTS.md` ownership map for **this** tree

## Phase 4 — Gitignore

Append if missing:

```gitignore
.cursor/local/
.claude/local/
.agents/local/
.codex/local/
.agent/handoff/CURRENT.local.md
.agent/handoff/sync/*.local.yaml
```

## Phase 5 — Report

Report mode, created/updated/skipped counts, bootstrap version, and session-start command from `SYNC-POINTS.md`.

---

## Installed layout (output)

Private IDE folders (`.cursor/`, `.claude/`, `.agents/`, `.codex/`), shared `.agent/`, `AGENTS.md`, `SYNC-POINTS.md`, `CLAUDE.md`.

**.agent/** (singular) = shared hub · **.agents/** (plural) = Antigravity private only.

---

## Tools (after install)

| Tool | Platforms |
|------|-----------|
| `node .agent/tools/launch.mjs` | all |
| `sh .agent/tools/launch.sh` | Linux, macOS |
| `pwsh .agent/tools/launch.ps1` | Windows (optional) |
| `node .agent/tools/check_locks.js` | all |
| `node .agent/tools/prune_handoff.js` | all |

---

*v2.8.0 — orchestrator only; templates in AGENT-PLATFORM-TEMPLATES/ · see COPYING.md for pack contents*
