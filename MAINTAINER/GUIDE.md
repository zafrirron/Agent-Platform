# Platform Maintainer Guide

> **For the framework author only.** Not deployed to consumer repos.
> User-facing documentation: `AGENT-PLATFORM-FRAMEWORK-README.md`

---

## The meta-philosophy

This platform is developed using itself. You work with your AI partner (the maintainer agent) the same way users work with their agents — describe what you want, the agent implements it.

```
Two improvement sources feed the platform:

Source 1 — Internal (Mode 1):           Source 2 — Web ecosystem (Mode 2):
Observe failure in a consumer repo  OR   Monthly: OWASP + CWE + best practices
        ↓                                Quarterly: + community + conference findings
"Add rule to X: [rule]"                          ↓
        ↓                                Structured findings report (F001-Fxxx + E001-Exxx)
Agent auto-implements 7 steps                    ↓
        ↓                                Maintainer selects what to add
Rule ships in next version                       ↓
        ↓                                Agent implements selected findings
Every consumer's agents smarter                  ↓
        ↓                                Rule ships in next version
Loop continues
```

**The platform gets smarter from two sources: real failures AND the global knowledge ecosystem.**

---

## Starting a maintainer session

```
Read MAINTAINER/platform-maintainer-agent.md
Task: [your goal — e.g. "audit the security expert for gaps", "add a new rule for X"]
```

The maintainer agent knows the full framework structure, the two-section model, the extension anatomy, and the release process. You do not need to explain any of this.

---

## Audit schedule

| Frequency | Mode | What to say |
|-----------|------|-------------|
| Anytime | Mode 1 | `"Add rule to [expert]: [rule]"` |
| Monthly | Mode 2 Option B | `Read MAINTAINER/web-audit.md and execute it.` |
| Quarterly | Mode 2 Option C | `Read MAINTAINER/web-audit.md and execute it. scope=full` |
| After production incident | Mode 1 | `"Add rule to [expert]: [failure-based rule]"` |
| After OWASP update | Mode 2 Phase 1 | Run Phase 1 only |

---

## Repository layout — what's yours vs what ships

```
Agent Platform Bootstrap (framework repo)
│
├── MAINTAINER/                    ← YOUR PRIVATE WORKSPACE — never deployed
│   ├── platform-maintainer-agent.md  ← your AI partner (Mode 1 + Mode 2 commands)
│   ├── GUIDE.md                       ← this file
│   ├── platform-audit.md              ← Mode 1: internal consistency audit
│   ├── web-audit.md                   ← Mode 2: web ecosystem audit (Option B + C)
│   ├── web-audit-report-template.md   ← structured findings report format
│   └── platform-improvements.md       ← improvement log (all rules traced to source)
│
├── AGENT-PLATFORM-TEMPLATES/      ← SHIPS TO CONSUMER REPOS on install
│   ├── .agent/agents/             ← 9 expert agents (with PLATFORM/PROJECT sections)
│   ├── .agent/playbooks/          ← 8 playbooks (with PLATFORM section)
│   ├── .agent/CONVENTIONS.md      ← coding conventions (with PLATFORM/PROJECT sections)
│   ├── global/                    ← USER-LEVEL STUBS (scope=global) — installed to ~/ via --mode=global
│   │   ├── .claude/CLAUDE.md      ←   global activation stub for Claude Code
│   │   ├── .cursor/rules/         ←   alwaysApply global rule for Cursor
│   │   ├── .codex/instructions.md ←   global activation stub for Codex
│   │   └── .agents/rules/         ←   global activation stub for Antigravity
│   └── ... (all other installed files)
│
├── AGENT-PLATFORM-MANIFEST.json   ← template registry + bootstrap_version
├── AGENT-PLATFORM-APPLY.js        ← installer entry point
├── bin/agent-platform.js          ← npx entry point
├── AGENT-PLATFORM-FRAMEWORK-README.md  ← USER documentation
├── CHANGELOG.md                   ← version history (MUST be updated before release)
├── tests/                         ← 76 integration + unit tests (run on every commit)
└── tools/release.ps1              ← single command for versioning + tagging + GitHub release
```

---

## The two install scopes

The platform installs at two independent scopes. Understanding both is important when testing or debugging install flows.

```
Scope 1 — Project (per repo)                Scope 2 — Global (per user, per machine)
─────────────────────────────────────────   ──────────────────────────────────────────────
[repo]/.agent/                              ~/.claude/CLAUDE.md
[repo]/.claude/                             ~/.claude/commands/  (caveman, quick-ref, etc.)
[repo]/.cursor/                             ~/.cursor/rules/agent-platform-global.mdc
[repo]/.agents/                             ~/.codex/instructions.md
[repo]/.codex/                              ~/.agents/rules/agent-platform-global.md
[repo]/AGENTS.md                            ~/.agent-platform/global-version
[repo]/CLAUDE.md

Install:   npx ... (no flags)               Install:   npx ... --mode=global
Uninstall: npx ... --mode=uninstall         Uninstall: npx ... --mode=uninstall-global
```

**Install pattern for new users:**
1. User runs project install in their first repo → platform installs locally
2. Installer shows: `○  Global stubs  not installed — run: npx ... --mode=global`
3. User runs `--mode=global` once → all future repos (with or without project install) get routing

**Not "double install":** the global stub is a thin activation signal (50 lines). The project install is the full platform (agents, playbooks, context, tools). They stack without conflict — global is the doorbell, project is the house.

**Uninstall independence:** removing from one scope does not affect the other. A user can remove the platform from a single repo while keeping global stubs for other repos.

---

## The two-section model — the core mechanism

Every template file that ships to consumer repos has two clearly marked sections:

```markdown
<!-- PLATFORM:START -->
Rules maintained by the platform author.
Replaced automatically when user runs --mode=upgrade.
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
User's project-specific customisations.
NEVER touched by any upgrade mode.
<!-- PROJECT:END -->
```

**What this enables:** you improve expert rules, and every user gets the improvement on next upgrade — without losing their project customisations.

**What `mode=upgrade` does:**
- Files WITH markers → patches only the `PLATFORM` block, leaves `PROJECT` section untouched
- Files WITHOUT markers → fully replaced (pure platform files: session-start-shared, session-end-shared, QUICK-REF, etc.)

---

## The improvement loop — fully agentic

### 1. Observe a failure
A consumer reports (or you discover): "The Backend agent shipped an endpoint without updating api-contracts.md."

### 2. Open a maintainer session
```
Read MAINTAINER/platform-maintainer-agent.md
Task: The Backend agent shipped an endpoint without updating api-contracts.md.
I want to add a done-when gate. First check for duplicates.
```

### 3. Agent audits, implements, and logs
The agent:
- Searches existing rules for duplicates
- Adds the rule to the correct PLATFORM section
- Logs the entry in `MAINTAINER/platform-improvements.md`
- Updates `CHANGELOG.md` with the change

### 4. Tests run automatically
The pre-commit hook runs all 76 tests before every commit. If tests fail, the commit is blocked.
To run tests manually: `npm test`

### 5. Ship it
```powershell
.\tools\release.ps1 -Version X.Y.Z
```

The release script:
- Validates CHANGELOG.md has an entry for this version (blocks if not)
- Bumps version in `package.json`, `AGENT-PLATFORM-MANIFEST.json`, and `README.md`
- Runs the full test suite (blocks on failure)
- Commits the version bump, creates the git tag, pushes, creates the GitHub release page

---

## Adding a new expert or playbook

Tell the maintainer agent:
```
Add a new expert agent for [domain]
```
or
```
Add a new playbook for [scenario]
```

The agent follows the 7-step extension anatomy and handles all file creation, manifest registration, and cross-file updates (AGENTS.md, QUICK-REF.md, PLATFORM-HELP.md, CHANGELOG.md, platform-improvements.md) automatically.

---

## E2E testing

The full test plan lives at `tests/E2E-TEST-PLAN.md`. It covers:
- Install → session start → auto-routing → multi-expert → security audit → session end → cross-framework critic → uninstall

To run automated tests:
```
npm test
```

To run the full E2E test manually: follow `tests/E2E-TEST-PLAN.md` using a scratch folder.

---

## Versioning rules

| Change type | Version bump |
|------------|-------------|
| New file added to manifest | Minor (2.x.0) |
| Existing PLATFORM section improved | Patch (2.7.x) |
| New install mode or infrastructure change | Minor (2.x.0) |
| Breaking change to file structure or markers | Major (x.0.0) |

**Always update `CHANGELOG.md` BEFORE running the release script.** The script will block if the version has no CHANGELOG entry.

---

## Git workflow

```
# Commit often during development — tests run automatically on every commit
git add [specific files]
git commit -m "feat/fix/chore: description"

# Push when ready
git push

# Release when the feature set is complete and CHANGELOG is updated
.\tools\release.ps1 -Version X.Y.Z
```

Never manually bump versions, create tags, or edit GitHub release pages. The release script does all of that from `CHANGELOG.md`.
