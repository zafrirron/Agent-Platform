## Agent Platform Bootstrap v2.20.1

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

## What's new in v2.20.1

### 📋 Docs governance — documentation stays current automatically

Every project that installs the platform now gets a built-in documentation enforcement system. No more docs drifting behind the code.

**How it works:**

`.agent/context/docs-registry.md` — installed in every repo. Maps each project doc to its owner expert, audience, update trigger, and last-reviewed date. Populated automatically at first session by the Docs expert scanning your project.

**Four enforcement points — from development to release:**

| When | What happens |
|------|-------------|
| Expert finishes any task | Done-when checklist: check owned docs, update `Last reviewed` |
| Expert creates a new `.md` file | Must register it in `docs-registry.md` before session ends |
| Session end | Scans for new `.md` files not yet in registry — prompts to register |
| Release gate | Docs agent audits every registry row — stale or unregistered = **BLOCKED** |

**Pre-commit guard** (with `--mode=install-guards`): warns when newly staged `.md` files are missing from the registry. Soft warning — does not block commits, but makes the gap visible before it becomes a release problem.

**First session:** paste this into your agent:
```
Read .agent/agents/docs-agent.md
Task: scan the project for all existing doc files and populate docs-registry.md
```

**The result:** every release ships with docs that were explicitly reviewed by the expert who owns them.

---

## Also in this release (v2.20.0)

- Docs governance model implemented in all expert agents, release playbook, session end, and pre-commit guard
- All 8 expert Done-when checklists updated: check registry, register new files
- `docs-agent.md`: registry audit mode + new-doc registration mode
- `release.md`: docs approval gate as Step 4 (blocks release if stale)
- `session-end-shared.md`: Step 2b new-doc scan

---

## Previous release highlights

**v2.19.x** — −49% session-start token cost · compact status block · caveman guidance · TOKEN-BUDGET.md

**v2.18.x** — install crash fix · uninstall restore fix · 76 automated tests (40 unit + 36 integration)

---

## Upgrade existing install

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

## Uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes everything
```

---

*Built by agents. For agents. To build better agents.*
*https://github.com/zafrirron/Agent-Platform*
