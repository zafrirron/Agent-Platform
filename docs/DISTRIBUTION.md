# Distribution options

Agent Platform ships in **three profiles**. Skill packs and IDE plugins are complementary — this doc explains install paths and how Cursor differs from Claude Code.

---

## Install profiles

| Profile | Command | What you get |
|---------|---------|--------------|
| **lite** | `--profile=lite [--framework=cursor\|claude]` | Skills pack: `/spec` `/plan` `/build` `/test` `/review` `/ship`, `.agent/skills/`, no handoff/enterprise layer |
| **core** | `--profile=core` | All playbooks except enterprise; full session model |
| **full** | default / `--profile=full` | Complete platform (multi-IDE, handoff, enterprise gates) |

```bash
# Skills pack for Cursor (lightweight)
npx github:zafrirron/Agent-Platform --profile=lite --framework=cursor

# Full team platform
npx github:zafrirron/Agent-Platform
```

---

## Claude Code marketplace (plugin)

```text
/plugin marketplace add https://github.com/zafrirron/Agent-Platform.git
/plugin install agent-platform-skills@zafrirron
```

Plugin manifest: `.claude-plugin/plugin.json` — bundles `AGENT-PLATFORM-TEMPLATES/.agent/skills` and lifecycle `.claude/commands`.

**Upgrade to full platform in a repo:** `npx github:zafrirron/Agent-Platform --profile=full`

---

## Cursor — no marketplace

Cursor does **not** have a `/plugin install` marketplace. Use `npx` (recommended) or copy skills to `.cursor/rules/`. See **[docs/cursor-setup.md](cursor-setup.md)**.

---

## Gemini CLI (`.gemini/skills/`) — interoperability

The platform ships `SKILL.md` modules that are portable to the Gemini CLI skill model. Gemini activates skills placed under `.gemini/skills/<name>/` and lists them with `/skills list`.

To use a platform skill in Gemini:

```bash
# Copy an installed platform skill into your Gemini skills folder
cp -r .agent/skills/ux-research ~/.gemini/skills/ux-research
gemini            # then: /skills list
```

**Notes:**
- Platform skills are framework-neutral markdown — no Gemini-specific frontmatter required, though Gemini reads `name` + `description` from the header.
- The reverse direction (Gemini/Claude persona packs → platform) goes through **Mode 4 targeted scan** or **Mode 3 ingest**, not a direct copy — the platform adapts and de-duplicates before adopting.
- Full multi-agent Gemini support (a 5th framework stub) is not installed by default; open an issue if you want `--framework=gemini` scaffolding.

---

## Cherry-pick skills (à la carte)

```bash
npx github:zafrirron/Agent-Platform --mode=list --list=skills
npx github:zafrirron/Agent-Platform --mode=add --add=skill:interview-me,skill:tdd --framework=cursor
```

Aliases: `skill:tdd` → `test-driven-development`, `skill:interview` → `interview-me`.

---

## Primary install (full — recommended for teams)

```bash
npx github:zafrirron/Agent-Platform
```

Installs `.agent/`, IDE private folders, playbooks, experts, session prompts, and slash commands. Everything platform-related is gitignored by default.

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
| `/spec` | `interview-me` skill → `spec-outline.md` |
| `/plan` | `planning-and-task-breakdown` skill |
| `/build` | `incremental-implementation` skill (`build auto` = full plan) |
| `/test` | `test-driven-development` skill |
| `/code-simplify` | `code-simplification` skill |
| `/webperf` | `web-performance-audit` skill (CWV Quick/Deep) |
| `/context` | `context-engineering` skill |
| `/verify` | `verification-before-completion` skill |
| `/audit` | Full project audit (full profile) |
| `/review` | Critic / code review |
| `/release` | Release playbook |
| `/ship` | Production readiness gate (PRR) |
| `/implement` | Plan approval → add-feature Step 3 (Cursor, full profile) |
| `/caveman` | Token compression (+ helpers) |

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

Cursor has **no plugin marketplace**. See **[docs/cursor-setup.md](cursor-setup.md)** for the full Cursor path (`--profile=lite --framework=cursor` recommended).

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
