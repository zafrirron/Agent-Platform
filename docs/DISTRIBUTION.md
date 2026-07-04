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

## Portable skills — where each IDE loads them

The platform ships framework-neutral `SKILL.md` modules under `.agent/skills/<name>/`. Every major AI coding assistant reads skills from its own folder, so a platform skill can be copied into any of them. Canonical paths (source: [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)):

| Tool | Project path | Global path | Docs |
|------|--------------|-------------|------|
| Antigravity | `.agent/skills/` | `~/.gemini/antigravity/skills/` | [docs](https://antigravity.google/docs/skills) |
| Claude Code | `.claude/skills/` | `~/.claude/skills/` | [docs](https://docs.anthropic.com/en/docs/claude-code/skills) |
| Codex | `.agents/skills/` | `~/.agents/skills/` | [docs](https://developers.openai.com/codex/skills) |
| Cursor | `.cursor/skills/` | `~/.cursor/skills/` | [docs](https://cursor.com/docs/context/skills) |
| Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` | [docs](https://geminicli.com/docs/cli/skills/) |
| GitHub Copilot | `.github/skills/` | `~/.copilot/skills/` | [docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) |
| OpenCode | `.opencode/skills/` | `~/.config/opencode/skills/` | [docs](https://opencode.ai/docs/skills) |
| Windsurf | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` | [docs](https://docs.windsurf.com/windsurf/cascade/skills) |

Example — use a platform skill in Gemini CLI:

```bash
cp -r .agent/skills/ux-research ~/.gemini/skills/ux-research
gemini            # then: /skills list
```

**Notes:**
- Platform skills are plain markdown — no host-specific frontmatter required, though most hosts read `name` + `description` from the header.
- The reverse direction (external skill packs → platform) goes through **Mode 4 targeted scan** or **Mode 3 ingest**, not a direct copy — the platform adapts, de-duplicates, and **security-vets** before adopting (see below).
- Full multi-agent Gemini support (a 6th framework stub) is not installed by default; open an issue if you want `--framework=gemini` scaffolding.
- **Community installer** — because the modules are standard `SKILL.md`, they are also consumable by the generic [`npx skills`](https://github.com/thedesignproject/agent-skills) installer (`npx skills add <owner>/<repo> -s <skill> -g`). Complementary to `npx github:{{PLATFORM_REPO}} --mode=add`; vet any skill first (below).

### Vetting third-party skills before you install one

Curated ≠ audited. A `SKILL.md` from any catalog can carry prompt injection, tool poisoning, hidden network calls, or unsafe data handling. Before copying an external skill in — or ingesting one via Mode 3 — check:

- [ ] **Read the whole file** — no instructions to exfiltrate data or call unexpected endpoints (platform principle: nothing leaves your machine).
- [ ] **No absolute/machine paths** — uses relative paths or `$HOME` / `$PROJECT_ROOT`, not `/Users/alice/…`.
- [ ] **Scoped tools** — requests only the tools it needs; no blanket `tools: ["*"]`.
- [ ] **No hidden payloads** — no encoded blobs, obfuscated commands, or "ignore previous instructions" prompt-injection strings.
- [ ] **Trusted source** — team-published or community-adopted; pin the version you reviewed.

---

## Cherry-pick skills (à la carte)

```bash
npx github:zafrirron/Agent-Platform --mode=list --list=skills
npx github:zafrirron/Agent-Platform --mode=add --add=skill:interview-me,skill:tdd --framework=cursor
```

Aliases: `skill:tdd` → `test-driven-development`, `skill:interview` → `interview-me`.

---

## Language, technology-stack, platform & domain packs (opt-in overlays)

The core platform is **language-, stack- and domain-agnostic** — it applies general software-engineering discipline to any project. **Packs** add curated, opinionated, failure-derived knowledge for a specific programming language (TypeScript, Java, C++…), technology stack (React, Django…), platform / execution target (Docker, boards/SoCs — roadmap), or business domain (fintech…) **on top of** the agnostic core, without changing it.

**Prompt-driven — no terminal commands to remember.** Just tell your agent:

```text
"what packs are available"      "which packs should I use" / "scan my repo for packs"
"activate the React pack"        "what packs are active"
"add this rule to my <pack> pack"   → saved to user.overlay.md (survives every update)
```

The agent runs the install under the hood (e.g. `npx github:zafrirron/Agent-Platform --mode=add --add=pack:stack-react`); the only terminal command you type is the one-time install.

- **Four kinds:** `language:*` (language semantics/footguns — TypeScript, Java, C++), `stack:*` (framework/library idioms & pitfalls), `platform:*` (*where the code runs* — hardware/OS/RTOS/container runtime; **defined, roadmap — no curated packs yet**), `domain:*` (compliance, invariants, **reference architectures**). They compose — a repo can run `language:typescript` + `stack:react` + `domain:fintech` at once.
  - **Language vs stack:** a language pack is the language itself and is reusable across every framework in it (a TS pack applies to React, Angular, Node); a stack pack is a framework/library *built in* a language. Separate kinds → no duplicated rules, no combo packs.
- **Opt-in, never bloat:** packs are **not** installed by any profile. They only install when you activate one and are recorded in `.agent/platform.json` → `active_packs`. Zero cost when none are active.
- **Detect-and-suggest:** on install/upgrade (and *"scan my repo for packs"*), the installer detects your language/stack (from `package.json`, `tsconfig.json`, `pom.xml`, `CMakeLists.txt`, `manage.py`, or a shallow source-extension scan) and *suggests* matching packs — it never auto-installs them.
- **Overlays, not new experts:** a stack/domain pack refines one generic expert via `<expert>.overlay.md`; a language pack maps one shared `code.overlay.md` to every code-writing expert — read only when the pack is active. Core files are never modified.
- **Your rules survive updates:** add pack-specific rules to `.agent/packs/<id>/user.overlay.md` (user-owned, never in the manifest) — no upgrade/force/re-install touches it. The agent writes there when you say *"add this to my `<pack>` pack"*.
- **Domain reference architectures:** domain packs link back to real source apps (`reference_sources` in `pack.json`). Ask your agent *"give me a reference architecture for a fintech app"* and it reads the pack's `reference-architecture.md` and points you at the linked implementations (license-aware).
- **Private & proprietary packs (fork pattern):** packs are where a company's **IP / secret sauce** belongs — never the public core. Fork the platform to a private repo, build your packs there (a maintainer runs **Mode 5 (Solution Blueprint)** to plan a whole project's pack set, or `build-pack=<id>` per pack), and point the installer at your fork so teams get the generic core **plus** your private packs. Because the core carries no domain/IP, your fork merges upstream core updates conflict-free. Per-project secrets stay in `user.overlay.md`.

Full spec: `.agent/packs/README.md` (installed with any pack) · design: [`MAINTAINER/adr/ADR-001-stack-domain-packs.md`](../MAINTAINER/adr/ADR-001-stack-domain-packs.md).

Available packs: languages — `language-typescript`, `language-java`, `language-cpp`; stacks — `stack-react`, `stack-django`; domains — `domain-fintech`, `domain-c4i` (C2 / C4ISR). More via community contribution, maintainer pack-scoped scans, and your own **private-fork packs** (build company IP as packs — see the fork pattern in [README](../README.md#fork-this-platform--your-ip-lives-in-packs-not-core-edits)).

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

After install, lifecycle shortcuts are available as `/` commands in **Cursor**, **Claude Code**, and **OpenCode**.

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
| **OpenCode** | `.opencode/commands/*.md` | per-project (no global stub) |

Filename (without `.md`) becomes the command name. Commands are thin routers — playbooks and experts hold the real discipline.

---

## Cursor and other IDEs

| IDE | How platform activates |
|-----|------------------------|
| **Cursor** | `.cursor/rules/` + **`/session-start`** and lifecycle **`/` commands**; Plan handoff via `/implement` or `plan-mode-handoff.mdc` |
| **Claude Code** | `CLAUDE.md` + slash commands |
| **Antigravity** | `.agents/` prompts |
| **Codex** | `.codex/` prompts |
| **OpenCode** | Native `AGENTS.md` + `opencode.json` `instructions` + `.opencode/commands/*.md` slash commands + `.opencode/agents/*` subagents (e.g. `@critic`) |

Cursor has **no plugin marketplace**. See **[docs/cursor-setup.md](cursor-setup.md)** for the full Cursor path (`--profile=lite --framework=cursor` recommended).

### OpenCode interoperability (zero-adapter)

[OpenCode](https://opencode.ai) reads the platform's artifacts natively — no translation layer:

- **Rules** — OpenCode auto-loads `AGENTS.md` (and `CLAUDE.md`) from the project root, so the platform's expert-router and hard rules are active the moment you open the repo. The platform's `opencode.json` adds `.opencode/sync.md` to `instructions` so multi-framework awareness and session detection work too.
- **Skills** — OpenCode loads `SKILL.md` modules from `.opencode/skills/` (and `~/.config/opencode/skills/`), the same format the platform ships.
- **Commands** — the platform emits its lifecycle slash commands to `.opencode/commands/*.md` (`/spec` `/plan` `/build` `/test` `/review` `/verify` `/ship` …).
- **Subagents** — `.opencode/agents/critic.md` exposes the adversarial **Critic** as an invokable subagent (`@critic`); other experts route through `AGENTS.md`.
- **Config precedence** — a project `opencode.json` is written only if one doesn't already exist; your provider/model settings are never clobbered.

Install everything for OpenCode with the default `npx github:zafrirron/Agent-Platform`, or scope to it with `--framework=opencode`.

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
