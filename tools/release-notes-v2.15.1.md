## Agent Platform Bootstrap v2.15.1

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

## What's new in v2.15.1

### Documentation sync — 6 audit findings resolved

- `CHANGELOG.md`: added missing v2.14.0 and v2.15.0 entries
- `AGENT-PLATFORM-FRAMEWORK-README.md` footer: updated from v2.10 to v2.15 (was 5 versions stale)
- `AGENT-PLATFORM-FRAMEWORK-README.md`: agent count corrected — "9 software-expert agents (including Critic)"
- `README.md`: agent count corrected — "Nine expert agents (including Critic)"
- `session-start-shared.md`: fixed step numbering gap — steps were jumping 2→4, now sequential
- `PLATFORM-HELP.md`: Critic agent added to the Sections header

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
