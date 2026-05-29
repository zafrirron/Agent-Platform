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

### Automatic expert + playbook routing — you just describe the goal

Before: users had to manually tell the agent which expert file to load.
After: the agent routes silently. You describe the goal — it figures out the rest.

| You say | Agent does automatically |
|---------|--------------------------|
| "fix the login bug" | Loads backend expert + bug-fix playbook → begins Step 1 |
| "add rate limiting" | Loads backend expert + add-feature playbook → begins Step 1 |
| "review the auth" | Loads security expert → reviews using OWASP rules |
| "ready to ship" | Loads devops expert + release playbook → runs gates |
| "find what's wrong" | Loads critic agent → adversarial 6-dimension review |

The user never tells the agent which file to read. Three layers of activation ensure routing fires before you type anything.

### Expert + Playbook combined model

Expert (WHO the agent is) and Playbook (WHAT steps to follow) are two independent dimensions that combine. Expert rules govern every step of the playbook. Playbook assigns different experts at specific steps (e.g. Critic at review gate).

### Full lifecycle flow diagram

Complete ASCII flow diagram added to README and PLATFORM-HELP: Install → Session Start → Auto-routing → Expert/Playbook → Work → Session End → loop/IDE switch.

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
