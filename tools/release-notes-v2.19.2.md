## Agent Platform Bootstrap v2.19.2

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

## What's new in v2.19.2

### Token optimizations — −49% mandatory session-start cost

Every session start now costs ~2,400 input tokens instead of ~4,756.

| Change | Saving |
|--------|--------|
| QUICK-REF table no longer streamed at session start (on-demand only) | −1,516 tokens/session |
| AGENTS.md prose and redundant reference sections removed | −845 tokens/session |
| Test-runner detection moved to a separate file (loads once ever, then never again) | −566 tokens/session |
| Session start outputs a compact 4-line status block instead of a full table | Faster, cleaner |

**New session start looks like:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  my-project · Agent Platform v2.19.2 · claude
  Last work : add user authentication
  Updates   : ✅ Up to date
  Reference : "show quick reference" for commands · "caveman mode" to cut output ~65%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready. Tell me what you want to do.
```

### Caveman mode — when to use it (now documented and surfaced)

Caveman mode (~65% shorter output, same accuracy) is now:
- Mentioned in every session start status block
- Explained in Backend and Frontend expert files at the moment you're most likely to need it
- Documented with a clear when-to-use / when-to-avoid table in `.agent/TOKEN-BUDGET.md`

**Rule of thumb:** use it in *doing* mode. Turn it off for Critic reviews, security audits, architecture decisions, and Docs expert work.

### .agent/TOKEN-BUDGET.md — published token audit

New file installed in every repo. Shows the exact token cost of every platform file:
- What loads automatically and when
- What loads per task (lazy, on demand)
- What never auto-loads (PLATFORM-HELP, QUICK-REF, context files)
- Caveman savings with pricing context

Say `"show token budget"` or read `.agent/TOKEN-BUDGET.md` directly.

### Bug fixes (v2.18.1 / v2.18.2)

- **Install crash fixed**: `preArtifacts.conflicting undefined` TypeError on every fresh install
- **Uninstall restore fixed**: backed-up files (e.g. your original CLAUDE.md) were silently skipped on restore because the backup lived inside `.agent/` which was deleted before the restore ran. Now staged to `os.tmpdir()` before deletion.

### Integration test suite (v2.18.2)

76 automated tests now run on every commit (40 unit + 36 integration).
Integration tests run the real installer against temp directories — catches installer-level crashes that unit tests on pure functions cannot.

---

## Upgrade existing install

```bash
npx github:zafrirron/Agent-Platform --mode=upgrade
```

---

## Uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall          # dry run
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm # removes everything
```

Removes all platform AI coordination files and restores any AI config files that existed before install.

---

*Built by agents. For agents. To build better agents.*
*https://github.com/zafrirron/Agent-Platform*
