# Agent Platform — Token Budget

Exact token costs for every file loaded by this platform.
Updated: {{DATE}} · Platform version: {{BOOTSTRAP_VERSION}}

---

## What gets loaded automatically

### Every session start (~2,900 input tokens)

| Tokens | File | Why |
|-------:|------|-----|
| ~800 | `session-start-shared.md` | Session orchestration instructions |
| ~700 | `AGENTS.md` | Auto-routing rules |
| ~330 | `platform.json` | Version, test runner config |
| ~190 | `registry.yaml` | Conflict check |
| ~180 | `session-start.md` | Framework wrapper |
| ~95 | `CLAUDE.md` / `AGENTS.md` (root) | Entry point |
| ~83 | `handoff/CURRENT.md` | Last work context |
| **~2,400** | **Session start total** | |

> First session only: `setup-test-runner.md` (+~350 tokens, one time).
> After test runner is configured it is never loaded again.

### Per task — loaded only when routed there

| Tokens | File | Loaded when |
|-------:|------|-------------|
| ~1,810 | `critic-agent.md` | "review this", cross-framework handoff |
| ~705 | `test-agent.md` | "write tests", "coverage" |
| ~677 | `security-agent.md` | "security review", "auth" |
| ~589 | `backend-agent.md` | "add endpoint", "fix API" |
| ~540 | `frontend-agent.md` | "update UI", "new component" |
| ~536 | `devops-agent.md` | "deploy", "CI/CD" |
| ~500 | `architect-agent.md` | "design", "architecture" |
| ~500 | `data-agent.md` | "schema", "migration" |
| ~491 | `docs-agent.md` | "update README", "document" |
| ~668 | `bug-fix.md` | Bug fix playbook |
| ~656 | `release.md` | Release playbook |
| ~368 | `debug-pipeline.md` | Debug playbook |
| ~300 | other playbooks | Context-specific |

**A typical task loads one expert + one playbook: ~900–1,200 additional tokens.**

---

## What is NEVER auto-loaded

These files exist for reference only — zero tokens unless you ask for them:

| Tokens | File | How to load |
|-------:|------|-------------|
| ~4,833 | `PLATFORM-HELP.md` | say "platform help" |
| ~1,516 | `QUICK-REF.md` | say "show quick reference" |
| ~684 | `CONVENTIONS.md` | loaded by test setup (first session only) |
| ~441 | `BEST-PRACTICES.md` | agent loads before non-trivial tasks |
| ~207 | `context/api-patterns.md` | on demand |
| ~138 | `context/api-contracts.md` | on demand |
| ~129 | `context/adr-log.md` | on demand |

---

## Typical session total

| Phase | Input tokens |
|-------|-------------|
| Session start | ~2,400 |
| 2 tasks (1 expert + 1 playbook each) | ~2,200 |
| **Typical session** | **~4,600 input tokens** |

Input tokens cost **3–5× less** than output tokens on every major provider.
The platform spends your budget on input (cheap) to save it on output (expensive).

---

## Output token savings — caveman mode

Caveman mode compresses agent responses by ~65% with no loss of accuracy.

| Without caveman | With caveman | Saving |
|----------------|-------------|--------|
| 1,000 output tokens | ~350 output tokens | ~650 tokens/response |

Activate: say `"caveman mode"` · Deactivate: say `"stop caveman"`

At output token prices (~3× input), 650 saved output tokens = ~1,950 equivalent input tokens saved per response.

### When to use caveman

| Context | Recommendation | Why |
|---------|---------------|-----|
| Implementation sprints (Backend, Frontend) | ✅ Use it | You know the context; you need action, not explanation |
| Rapid iteration / short feedback loops | ✅ Use it | Saves tokens across many responses |
| Long sessions approaching context limits | ✅ Use it | Compression extends effective context window |
| Critic reviews | ❌ Turn it off | Terse findings lose the reasoning that makes you fix them |
| Security audits | ❌ Turn it off | Severity context and OWASP reasoning must be fully explained |
| Architecture decisions | ❌ Turn it off | Trade-off reasoning is the whole point |
| Docs expert writing documentation | ❌ Turn it off | The output IS the deliverable — terse docs ship as terse docs |
| Platform session start / end | — Not applicable | These already output minimal text; nothing to compress |

**The rule of thumb:** use caveman when you're in *doing* mode. Turn it off when you're in *deciding* or *documenting* mode.

---

## What the platform does NOT load

- Your source code (never read unless you ask the agent to)
- Test files (never read unless you ask)
- Build artifacts, lock files, environment files
- Any file outside `.agent/`, `.claude/`, `.cursor/`, `.agents/`, `.codex/`, `.opencode/`

The platform installs coordination files. It does not monitor, scan, or index your codebase in the background.
