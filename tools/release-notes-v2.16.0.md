## Agent Platform Bootstrap v2.16.0

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

## What's new in v2.16.0

### 40 unit tests for the core installer

- `apply-utils.mjs`: pure functions extracted from `apply.js` — `sub`, `isStub`, `patchPlatformSection`, `detectTestRunner`, `detectCoverageCmd`, `scanPreExistingArtifacts`
- `tests/apply-utils.test.mjs`: 40 tests across 6 describe blocks using Node.js built-in `node:test` (no external dependencies)
- `npm test` script added to `package.json`
- Pre-commit hook installed: blocks commits when tests fail

### 11 Critic review findings resolved

- Backup directory uses datetime not date — same-day reinstall no longer overwrites previous backup
- Upgrade warns when a file is skipped due to missing PLATFORM markers
- Session start update check: graceful failure — never blocks session on a network error
- Unknown-stack CI workflow: clear WARNING comment for unrecognised test runners
- `build-bootstrap-manifest.js`: preserves existing `kind` values, reports new and removed files
- `COPYING.md` + `PACK-DEPLOY.md`: rewritten to reflect the npx install path
- `.gitignore` append: ensures newline separator if file does not end with one
- `add-framework.md`: explicit instructions for `FW_RULE_PATTERNS` and `LEGACY_ROOT_FILES`

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
