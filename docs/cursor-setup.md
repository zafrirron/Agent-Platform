# Cursor setup — Agent Platform Skills

Cursor has **no Claude-style plugin marketplace**. Distribution is different from Claude Code.

---

## How Cursor gets skills (honest comparison)

| Claude Code | Cursor |
|-------------|--------|
| `/plugin marketplace add …` then `/plugin install` | **No marketplace** — install via `npx` or copy files |
| Plugin bundles `skills/` + `.claude/commands/` | **`.cursor/commands/`** for `/` commands · **rules** for always-on guidance |
| One-click global plugin | Per-repo install, or team docs pointing to Quick Start |

**agent-skills on Cursor:** copy `SKILL.md` into `.cursor/rules/` (see [their cursor-setup](https://github.com/addyosmani/agent-skills/blob/main/docs/cursor-setup.md)).

**Agent Platform on Cursor:** one command installs commands + skills + router:

```bash
npx github:zafrirron/Agent-Platform --profile=lite --framework=cursor
```

---

## Recommended paths

### Solo dev — skills pack (lite)

```bash
cd your-repo
npx github:zafrirron/Agent-Platform --profile=lite --framework=cursor
```

You get:

- `.cursor/commands/` — `/spec` `/plan` `/build` `/test` `/review` `/code-simplify` `/webperf` `/context` `/verify` `/ship` …
- `.agent/skills/` — cherry-pickable `SKILL.md` workflows
- `AGENTS.md` lite router

Start a chat: type `/session-start` or paste `Read .agent/session-start.md and execute it.`

### Cherry-pick one skill

```bash
npx github:zafrirron/Agent-Platform --mode=list --list=skills
npx github:zafrirron/Agent-Platform --mode=add --add=skill:interview-me --framework=cursor
```

### Team — full platform (multi-IDE handoff)

```bash
npx github:zafrirron/Agent-Platform --profile=full
```

Adds registry, session handoff, enterprise playbooks, all IDE stubs.

### Upgrade lite → full

```bash
npx github:zafrirron/Agent-Platform --profile=full --mode=upgrade
```

---

## Cursor Plan mode

After approving a Plan, use `/implement` or say **implement the plan** — resumes `add-feature` Step 3 (full profile only; requires `plan-mode-handoff.mdc`).

---

## Optional: rules instead of commands

Copy any skill into rules for always-on behavior:

```text
.cursor/rules/interview-me.mdc   ← paste from .agent/skills/interview-me/SKILL.md
```

Commands are preferred for lifecycle phases — they load on demand and use fewer tokens.

---

## MCP (browser testing skill)

`browser-testing-devtools` skill expects Chrome DevTools MCP in **Cursor Settings → MCP**. If MCP is not configured, the skill falls back to conventional e2e tests.
