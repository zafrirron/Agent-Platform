## Agent Platform Bootstrap v2.17.0

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

## What's new in v2.17.0

### 🚦 Automatic expert + playbook routing — you just describe the goal

**Before:** Users had to manually tell the agent which expert file to load.
**After:** The agent routes silently. You describe the goal — it figures out the rest.

| You say | Agent does automatically |
|---------|--------------------------|
| "fix the login bug" | Loads backend expert + bug-fix playbook → begins Step 1 |
| "add rate limiting" | Loads backend expert + add-feature playbook → begins Step 1 |
| "review the auth" | Loads security expert → reviews using OWASP rules |
| "ready to ship" | Loads devops expert + release playbook → runs gates |
| "find what's wrong" | Loads critic agent → adversarial 6-dimension review |

The user **never** tells the agent which file to read. Three layers of activation ensure routing fires before you type anything.

### 🔗 Expert + Playbook combined model

Expert (WHO the agent is) and Playbook (WHAT steps to follow) are two independent dimensions that combine:
- Expert rules govern every step of the playbook
- Playbook assigns different experts at specific steps (e.g. Critic at review gate)
- Use either alone, or both together for maximum power

### 📊 Full lifecycle flow diagram in README

Complete ASCII flow diagram: Install → Session Start → Auto-routing → Expert/Playbook → Work → Session End → loop/IDE switch.

---

## Also in this release stream (v2.16.0)

- ✅ 40 unit tests for core installer — 100% pass
- All 11 Critic review findings resolved
- Comprehensive backup/restore covering all current and future frameworks

---

## Upgrade existing install

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

## Uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run — shows what will be removed
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes everything
```

Removes all platform AI coordination files and restores any AI config files that existed before install.

---

*Built by agents. For agents. To build better agents.*
*https://github.com/zafrirron/Agent-Platform*
