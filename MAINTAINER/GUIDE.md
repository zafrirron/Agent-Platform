# Platform Maintainer Guide

> **For the framework author only.** Not deployed to consumer repos.
> User-facing documentation: `AGENT-PLATFORM-FRAMEWORK-README.md`

---

## The meta-philosophy

This platform is developed using itself. You work with your AI partner (the maintainer agent) the same way users work with their agents — describe what you want, the agent implements it.

```
Three improvement sources feed the platform:

Source 1 — Internal (Mode 1):     Source 2 — Web ecosystem (Mode 2):     Source 3 — User submissions (Mode 3):
Observe failure in consumer repo   Monthly: OWASP + CWE + best practices   Users drop agentic files into
        ↓                          Quarterly: + community findings          MAINTAINER/ingest/
"Add rule to X: [rule]"                    ↓                                       ↓
        ↓                          Structured findings report               Ingest agent reads all files
Agent auto-implements 7 steps              ↓                                       ↓
        ↓                          Maintainer selects findings              Extracts NEW / ENHANCE / DUPLICATE
Rule ships in next version                 ↓                                       ↓
        ↓                          Agent implements selected               Maintainer selects what to add
Every consumer's agents smarter            ↓                                       ↓
        ↓                          Rule ships in next version              Agent implements via Mode 1 workflow
Loop continues                                                                      ↓
                                                                            Submissions archived
```

**The platform gets smarter from three sources: real failures, the global knowledge ecosystem, AND production-proven rules from users.**

---

## Starting a maintainer session

```
Read MAINTAINER/platform-maintainer-agent.md
Task: [your goal — e.g. "audit the security expert for gaps", "add a new rule for X"]
```

The maintainer agent knows the full framework structure, the section model, the extension anatomy, and the release process. You do not need to explain any of this.

---

## Maintainer toolbox — what to use and when

There are four maintainer tools. Each has a distinct trigger and a distinct output.

| Tool | File | Trigger | Output |
|------|------|---------|--------|
| **Add rule** (Mode 1) | `platform-maintainer-agent.md` | Observed a failure, have a specific rule to add | One rule added to the right PLATFORM section, logged, version bumped |
| **Internal platform audit** | `platform-audit.md` | Platform feels stale, before a release, or after many changes — check the platform's own health | Quality report: undertrained experts, weak playbooks, coverage gaps, vague rules, duplicates |
| **Web ecosystem audit** (Mode 2) | `web-audit.md` | Monthly schedule, or after an OWASP/CWE update | Structured findings report F001-Fxxx from OWASP, CWE, best-practice sources |
| **User submission ingest** (Mode 3) | `platform-ingest.md` | User drops their agent/playbook/convention files into `MAINTAINER/ingest/` | Structured findings report I001-Ixxx from user's production-proven rules |

**The improvement cycle always ends the same way regardless of which tool triggered it:**
Add rule to PLATFORM section → log in `platform-improvements.md` → bump version → ship via `tools/release.ps1`.

---

## ⚠️ Two "audits" — completely different things

The word "audit" appears in two places in the platform and they are **not related**:

| | Platform audit | User project audit |
|---|---|---|
| **File** | `MAINTAINER/platform-audit.md` | `.agent/playbooks/audit.md` |
| **Who uses it** | You (the platform maintainer) | Users / agents in consumer repos |
| **What it audits** | The platform itself — are the expert agents well-trained? Are playbooks solid? Are there coverage gaps? | The user's codebase — architecture, security, tests, docs, CI/CD |
| **Output** | List of platform weaknesses for the maintainer to fix | Project health report saved to `.agent/context/audit-YYYY-MM-DD.md` |
| **When triggered** | Maintainer runs it manually, periodically | First session (auto-offered), or user says "run project audit" |
| **Scope** | `MAINTAINER/` folder only — never touches consumer repos | Consumer repo only — never touches the platform |

**In short:** `platform-audit.md` is "is the platform itself good?". `.agent/playbooks/audit.md` is "is the user's project healthy?"

---

## When to run the internal platform audit

Run `Read MAINTAINER/platform-audit.md and execute it.` when:

- **Before a release** — confirm no expert has become undertrained, no playbook has a step with no verifiable outcome
- **After a large Mode 3 ingest** — new rules were added; check for duplicates or inconsistencies introduced
- **After a Mode 2 web audit** that touched many files — same reason
- **When something feels off** — a rule seems wrong, an expert feels weak, or a playbook step seems vague

It is NOT a replacement for Mode 1/2/3 improvement. It's the quality gate that catches regressions in the platform's own rules before they ship.

---

## Maintenance schedule

| Frequency | What to do | Tool |
|-----------|-----------|------|
| Anytime | Observed a failure → add a targeted rule | `"Add rule to [expert]: [rule]"` via maintainer agent |
| When files arrive | User dropped files into `MAINTAINER/ingest/` | `Read MAINTAINER/platform-ingest.md and execute it.` |
| Before release | Quality gate — check platform's own health | `Read MAINTAINER/platform-audit.md and execute it.` |
| Monthly | Web ecosystem check (OWASP, CWE, best practices) | `Read MAINTAINER/web-audit.md and execute it.` |
| Quarterly | Full ecosystem scan + emerging practices | `Read MAINTAINER/web-audit.md and execute it. scope=full` |
| After OWASP update | Security-focused subset | Run Mode 2 Phase 1 only |

---

## Repository layout — what's yours vs what ships

```
Agent Platform Bootstrap (framework repo)
│
├── MAINTAINER/                    ← YOUR PRIVATE WORKSPACE — never deployed
│   ├── platform-maintainer-agent.md  ← your AI partner (Mode 1 + Mode 2 + Mode 3 commands)
│   ├── GUIDE.md                       ← this file
│   ├── platform-audit.md              ← Mode 1: internal consistency audit
│   ├── web-audit.md                   ← Mode 2: web ecosystem audit (Option B + C)
│   ├── web-audit-report-template.md   ← structured findings report format
│   ├── platform-ingest.md             ← Mode 3: user submission ingest playbook
│   ├── ingest/                        ← DROP USER FILES HERE for Mode 3 analysis
│   │   ├── README.md                  ←   instructions for submitters
│   │   ├── .gitkeep                   ←   keeps folder in git when empty
│   │   └── archive/                   ←   processed submissions (auto-created on first ingest)
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

## The three-section model — the core mechanism

The platform uses two or three clearly marked sections depending on file type.

**Project template files** (everything in `AGENT-PLATFORM-TEMPLATES/` except `global/`):
```markdown
<!-- PLATFORM:START -->
Rules maintained by the platform author.
Replaced automatically when user runs --mode=upgrade.
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
Team's project-specific customisations.
NEVER touched by any upgrade mode.
<!-- PROJECT:END -->
```

**Global stub files** (`AGENT-PLATFORM-TEMPLATES/global/` — installed to `~/` via `--mode=global`):
```markdown
<!-- PLATFORM:START -->
Platform activation logic — patched on --mode=global upgrade.
<!-- PLATFORM:END -->

<!-- USER:START -->
Personal cross-repo preferences — NEVER touched by upgrades.
<!-- USER:END -->
```

**What this enables:** you improve expert rules, and every user gets the improvement on next upgrade — without losing their project or personal customisations.

**What `mode=upgrade` does:**
- Files WITH markers → patches only the `PLATFORM` block, leaves `PROJECT`/`USER` section untouched
- Files WITHOUT markers → fully replaced (pure platform files: session-start-shared, session-end-shared, QUICK-REF, etc.)

**What `mode=global` upgrade does:**
- Global stub files WITH markers → patches only `PLATFORM` block, preserves `USER` section content
- Global stub files WITHOUT markers (commands) → fully replaced with latest version

---

## The improvement loop — fully agentic

Every improvement — regardless of which tool triggered it — ends at the same place: a rule in a PLATFORM section, logged, versioned, and shipped. The trigger determines how you arrive at the rule; the loop below is how every rule actually gets into the platform.

### Example: Mode 1 (observed failure)

**1. Observe a failure**
A consumer reports: "The Backend agent shipped an endpoint without updating api-contracts.md."

**2. Open a maintainer session**
```
Read MAINTAINER/platform-maintainer-agent.md
Task: The Backend agent shipped an endpoint without updating api-contracts.md.
I want to add a done-when gate. First check for duplicates.
```

**3. Agent implements**
- Searches existing rules for duplicates
- Adds the rule to the correct PLATFORM section
- Logs to `MAINTAINER/platform-improvements.md`
- Bumps `bootstrap_version` in manifest

**4. Tests run automatically**
The pre-commit hook runs the test suite before every commit. If tests fail, the commit is blocked.
Run manually: `npm test`

**5. Ship it**
```powershell
.\tools\release.ps1 -Version X.Y.Z
```

The release script:
- Validates `CHANGELOG.md` has an entry for this version (blocks if not)
- Bumps version in `package.json`, `AGENT-PLATFORM-MANIFEST.json`, and `README.md`
- Runs the full test suite (blocks on failure)
- Commits the version bump, creates the git tag, pushes, creates the GitHub release page

> The same steps 3–5 apply after a Mode 2 web audit, a Mode 3 ingest, or a platform audit finding. The trigger is different; the implementation and release process is identical.

---

## Mode 3 — Ingesting user submissions

When a user shares their own agentic files (agents, playbooks, skills, CLAUDE.md, conventions):

**Step 1 — User drops files into `MAINTAINER/ingest/`**

Files can be:
- Agent definition `.md` files from their `.agent/agents/` folder
- Playbook files from their `.agent/playbooks/` folder
- Their `CLAUDE.md` or `AGENTS.md` (the agent extracts rules only, ignores mechanics)
- Conventions files, skill files, or raw rule lists

**Step 2 — Run the ingest**

```
Read MAINTAINER/platform-ingest.md and execute it.
```

The ingest agent:
1. Scans and classifies all files in `MAINTAINER/ingest/`
2. Extracts every specific, verifiable rule it finds
3. Deduplicates against existing platform rules
4. Classifies each finding: NEW / ENHANCE / DUPLICATE / PROJECT-SPECIFIC / VAGUE
5. Maps each finding to the best target (which expert, which playbook, or new expert/playbook candidate)
6. Presents a structured ingest report with finding IDs (I001, I002, ...)

**Step 3 — Review and select**

Read the report. Use selection commands to approve, modify, skip, or defer each finding:
- `"Add I001, I003"` — implement those
- `"Add all NEW"` — implement all genuinely new findings
- `"Modify I005 to: [better text]"` — use an improved version
- `"New expert from I006-I010"` — scaffold a new expert from a cluster of findings
- `"Archive"` — close the ingest without implementing anything

**Step 4 — Agent implements**

Selected findings are implemented via the standard Mode 1 workflow — PLATFORM section patched, improvement logged, version bumped.

**Step 5 — Submissions archived**

Processed files move to `MAINTAINER/ingest/archive/YYYY-MM-DD/` automatically.

---

### What the ingest agent looks for

| Finding type | Examples | Typical target |
|---|---|---|
| Security rule | "Validate JWT `kid` before trusting `alg`" | security-agent.md |
| API hygiene | "Return 422 for validation errors, not 400" | backend-agent.md |
| Test quality | "Test at the boundary, not the implementation" | test-agent.md |
| Review pattern | "Flag any method longer than 40 lines" | critic-agent.md |
| Universal convention | "Never log sensitive fields" | CONVENTIONS.md |
| New domain (≥5 rules) | Mobile, ML, browser extensions | New expert candidate |
| New workflow | Incident response, code review, hotfix | New playbook candidate |

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

The full test plan lives at `tests/E2E-TEST-PLAN.md` (v3). It covers:

| Phase | What is tested |
|-------|---------------|
| 0 | Clean slate — pre-existing AI configs present |
| 1 | Install — backup, two-section markers, `platform.json` fields |
| 2 | Session start — first-session audit offer (Step 1d), NO/YES paths |
| 2b | Full project audit — all 8 expert passes, report output |
| 3 | Auto-routing — 6 prompt types |
| 4 | Security gate — add-feature Step 5a |
| 5 | Session end — derive summary, commit via shell |
| 6 | Cross-framework Critic |
| 7 | Framework takeover |
| 8 | Upgrade two-section model |
| 9 | Project uninstall (scope 1 only) |
| 10 | Global install — stubs created, version file, idempotent upgrade |
| 11 | Global stub activation — AGENTS.md detection, install offer, skip |
| 12 | Global uninstall — USER content preserved, pure files deleted |

To run automated tests:
```
npm test
```

To run the full E2E test manually: follow `tests/E2E-TEST-PLAN.md` using a scratch folder.

---

## Versioning rules

Versions are bumped only when a release is requested — not on every commit. Changes accumulate and are released together.

| Change type | Version bump |
|------------|-------------|
| Bug fixes, existing expert enhancements, existing playbook enhancements (Mode 1/2/3 rule improvements) | **Patch** (2.7.x) — maintenance release |
| New expert agent, new playbook, new IDE framework, new major capability | **Minor** (2.X.0) |
| Breaking change to file structure, markers, or installer interface | **Major** (X.0.0) — user decision only |

**Major version bumps are never auto-determined** — the user explicitly decides when a release warrants a major bump.

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
