# Distribution options

Agent Platform is installed **per repository** with one command. Skill packs and IDE plugins are complementary — this doc explains how we differ and how to combine them.

---

## Primary install (recommended)

```bash
npx github:zafrirron/Agent-Platform
```

Installs `.agent/`, IDE private folders, playbooks, experts, session prompts, and optional Claude slash commands. Everything platform-related is gitignored by default.

**Global activation** (once per machine):

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

Writes stubs to `~/.claude/`, `~/.cursor/`, etc. so any repo with `AGENTS.md` auto-routes.

---

## Slash commands (`/`)

After install, lifecycle shortcuts are available as `/` commands in **Cursor** and **Claude Code**.

| Command | Routes to |
|---------|-----------|
| `/session-start` | `.agent/session-start.md` |
| `/session-end` | `.agent/session-end.md` |
| `/quick-ref` | Open `.agent/QUICK-REF.md` |
| `/platform-help` | Full `.agent/PLATFORM-HELP.md` (Cursor) |
| `/spec` | Requirements clarification → `spec-outline.md` |
| `/audit` | Full project audit playbook |
| `/review` | Critic agent adversarial review |
| `/release` | Release playbook (version, changelog, tag) |
| `/ship` | Production readiness gate (PRR) |
| `/implement` | Plan approval → add-feature Step 3 (Cursor) |
| `/caveman` | Token compression mode (+ `caveman-commit`, `caveman-review`, …) |

| IDE | Location | Global (`--mode=global`) |
|-----|----------|--------------------------|
| **Cursor** | `.cursor/commands/*.md` | `~/.cursor/commands/` |
| **Claude Code** | `.claude/commands/*.md` | `~/.claude/commands/` |

Filename (without `.md`) becomes the command name. Commands are thin routers — playbooks and experts hold the real discipline.

---

## Cursor and other IDEs

| IDE | How platform activates |
|-----|------------------------|
| **Cursor** | `.cursor/rules/` + **`/session-start`** and lifecycle **`/` commands**; Plan handoff via `/implement` or `plan-mode-handoff.mdc` |
| **Claude Code** | `CLAUDE.md` + slash commands |
| **Antigravity** | `.agents/` prompts |
| **Codex** | `.codex/` prompts |

There is **no separate Cursor marketplace listing** today. Install via `npx` in the repo root — same as CI or a new clone. Optional: add a team rule in Cursor Settings pointing new hires to `README.md` Quick Start.

---

## Compared to skill packs (e.g. [agent-skills](https://github.com/addyosmani/agent-skills))

| | Agent Platform | Typical skill pack |
|--|----------------|-------------------|
| **Unit of install** | Whole repo environment | Individual skills or plugin |
| **Multi-IDE** | Registry, handoff, cross-framework Critic | Usually one tool |
| **Workflow** | 20 playbooks with mandatory gates | Varies per skill |
| **Session model** | session-start / session-end, `CURRENT.md` | Ad hoc |
| **Enforcement** | Optional `--mode=install-guards` (hooks + CI) | Rarely included |
| **Extension** | 7-step anatomy in `PLATFORM-HELP.md` | Copy or fork skills |

**Use both:** Install Agent Platform for coordination; add project-specific skills under `.agent/skills/` or your IDE's skill folder. Platform ingest already adapted selected agent-skills patterns (rationalization, TDD, spec clarity) into playbooks — see `MAINTAINER/ingest/agent-skills-p0-SOURCES.md`.

---

## Demo and onboarding assets

| Asset | URL |
|-------|-----|
| Interactive deck | [agent-platform-beta.html](https://zafrirron.github.io/Agent-Platform/presentation/agent-platform-beta.html) |
| Team adoption deck | [team-adoption.html](https://zafrirron.github.io/Agent-Platform/presentation/team-adoption.html) |
| Offline help | `.agent/PLATFORM-HELP.md` after install |

A short screen recording (install → session-start → one routed task) is the best substitute for a GIF; link it from your internal wiki or README fork.

---

## Commercial use

Free for personal and internal use. Commercial hosting/SaaS redistribution is prohibited under [Elastic License 2.0](LICENSE). Contact the maintainer for commercial licensing questions.
