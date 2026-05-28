# Deploying the pack to a consumer repository

Generic instructions. No specific product names.

---

## 1. Copy the pack

Copy from a framework release:

- `AGENT-PLATFORM-BOOTSTRAP.md`
- `AGENT-PLATFORM-MANIFEST.json`
- `AGENT-PLATFORM-TEMPLATES/` (entire directory)
- `AGENT-PLATFORM-APPLY.js`

See [COPYING.md](COPYING.md).

---

## 2. Install (tell your agent)

Open the consumer repo in Cursor, Claude Code, Antigravity, or Codex and paste:

```
Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.
```

The agent runs discovery, apply, stubs, gitignore, and reports session-start commands. No manual shell steps required.

---

## 3. Modes (tell your agent)

| Mode | What to paste |
|------|----------------|
| First install | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it.` |
| Add new pack files | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=upgrade` |
| Fill empty stubs | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=repair` |
| Reset templates | `Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=force` |

**Optional CLI** (if you have no agent): `node AGENT-PLATFORM-APPLY.js` with the same `--mode=` values.

---

## 4. After install

- Use session commands from generated `SYNC-POINTS.md`
- Customize `.agent/PROJECT.md` and `.agent/WORKFLOWS.md` for that codebase
- Set `.agent/platform.json` → `launch` for that project's run commands

---

## 5. Uninstall

Linux / macOS:

```bash
rm -rf .agent .cursor .claude .agents .codex
rm -f AGENTS.md SYNC-POINTS.md CLAUDE.md AGENT-PLATFORM-*
```

Windows (PowerShell):

```powershell
Remove-Item -Recurse -Force .agent,.cursor,.claude,.agents,.codex
Remove-Item -Force AGENTS.md,SYNC-POINTS.md,CLAUDE.md,AGENT-PLATFORM-*
```
