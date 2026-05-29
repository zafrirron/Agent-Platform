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

### −49% mandatory session-start token cost

| Change | Tokens saved per session |
|--------|--------------------------|
| QUICK-REF table no longer streamed at session start — on demand only | −1,516 |
| AGENTS.md prose and redundant sections removed | −845 |
| Test-runner detection moved to a separate file, loaded once ever | −566 |
| **Total** | **−2,356 tokens/session** |

Session start now outputs a compact 4-line status block:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  my-project · Agent Platform v2.19.2 · claude
  Last work : add user authentication
  Updates   : ✅ Up to date
  Reference : "show quick reference" for commands · "caveman mode" to cut output ~65%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Ready. Tell me what you want to do.
```

### Caveman mode — when to use it

Caveman mode (~65% shorter output, same accuracy) is now surfaced at the right moments:
- Mentioned in every session start status block
- Explained in Backend and Frontend expert files
- Documented with a when-to-use / when-to-avoid table in `.agent/TOKEN-BUDGET.md`

**Rule of thumb:** use it in *doing* mode. Turn it off for Critic reviews, security audits, architecture decisions, and Docs expert work.

### `.agent/TOKEN-BUDGET.md`

Exact token cost breakdown installed in every consumer repo: mandatory session cost, per-task lazy loading, never-auto-loaded files, caveman savings with pricing context, and when-to-use guidance.

### Bug fixes

- **Install crash fixed** — `preArtifacts.conflicting undefined` TypeError on every fresh install (v2.18.1)
- **Uninstall restore fixed** — backed-up files silently skipped because backup lived inside `.agent/` which was deleted before restore ran (v2.18.2)

### 76 automated tests

40 unit tests (pure functions) + 36 integration tests (real installer against temp directories). Pre-commit hook runs the full suite on every commit.

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
