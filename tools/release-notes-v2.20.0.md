## Agent Platform Bootstrap v2.20.0

**Built by agents. For agents. To build better agents.**

---

## Install

```bash
npx github:zafrirron/Agent-Platform
```

Start your first session — paste into your AI agent chat:
```
Read .agent/session-start.md and execute it.
```

---

## What's new in v2.20.0

### Docs governance — documentation stays current automatically

Every project that installs the platform now gets a built-in documentation enforcement system.

**`.agent/context/docs-registry.md`** maps each project doc to its owner expert, audience, update trigger, and last-reviewed date. Populated automatically at first session by the Docs expert scanning your project.

**Four enforcement points:**

| When | What happens |
|------|-------------|
| Expert finishes any task | Done-when: check owned docs, update `Last reviewed` |
| Expert creates a new `.md` file | Must register it in the registry before session ends |
| Session end (Step 2b) | Scans for new `.md` files not yet in registry — prompts to register |
| Release gate (release.md Step 4) | Docs agent audits every row — stale or unregistered = **BLOCKED** |

**Pre-commit guard** (`--mode=install-guards`): warns when newly staged `.md` files are missing from the registry. Soft warning — does not block commits.

**All 8 expert agents** updated: Done-when checklists now include checking owned docs and registering any new files created.

**First session on a new project** — paste into your agent:
```
Read .agent/agents/docs-agent.md
Task: scan the project for all existing doc files and populate docs-registry.md
```

---

## Upgrade

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

Your agents get improved rules. Your project customisations are untouched.

## Uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run — shows what will be removed
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes everything
```

Removes all platform AI coordination files and restores any AI config files that existed before install.

---

*Built by agents. For agents. To build better agents.*
*https://github.com/zafrirron/Agent-Platform*
