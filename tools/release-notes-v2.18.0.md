## Agent Platform Bootstrap v2.18.0

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

## What's new in v2.18.0

### 🔒 Security declaration — what this platform does and does not do

A legitimate question: *does installing this platform risk my project's security or privacy?*

**Answer: No. The platform installs markdown files. That is all.**

New [SECURITY.md](https://github.com/zafrirron/Agent-Platform/blob/main/SECURITY.md) covers:

| Concern | Reality |
|---------|---------|
| Injects executable code into my project | ❌ Only markdown, YAML, and JSON files are installed |
| Modifies my source code or config | ❌ Installer creates new files only |
| Makes network calls from my project | ❌ No runtime dependencies added |
| Collects telemetry or sends data | ❌ No analytics, no tracking, no callbacks |
| Commits anything without my knowledge | ❌ All platform files are gitignored |
| Overwrites my security decisions | ❌ PROJECT sections are never touched |

**Every expert rule is readable markdown.** Every rule traces to the failure it prevents. No rule instructs agents to exfiltrate data, add backdoors, or weaken security.

**No npm registry, no third-party dependencies.** `apply.js` uses only Node.js built-ins (`fs`, `path`). Nothing from the registry that could be compromised.

**Supply chain:** version-pinnable, open source, auditable, no runtime code injection.

---

## Previous release highlights

**v2.17.0** — Automatic expert + playbook routing (you just describe the goal)

**v2.16.0** — 40 unit tests, all 11 Critic findings resolved, comprehensive backup/restore

---

## Upgrade

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

## Uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run — shows what will be removed
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes everything
```

Removes all platform AI coordination files and restores any AI config files (CLAUDE.md, Cursor rules, etc.) that existed before install. The platform scaffolding that guided your agents is removed — the code improvements your agents made are yours to keep.

---

*Built by agents. For agents. To build better agents.*
*https://github.com/zafrirron/Agent-Platform*
