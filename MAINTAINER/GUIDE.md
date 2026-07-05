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

**The platform gets smarter from four sources: real failures, the global knowledge ecosystem, production-proven user rules, AND the open-source GitHub ecosystem (Mode 4).** A fifth mode — **Mode 5 (Solution Blueprint)** — doesn't add a new source; it **orchestrates** the others across a whole system goal (see below).

> Each source feeds **two lanes**: universal rules improve the **core**; language/stack/platform/domain-specific rules improve **packs** (Mode 4 `repo=… pack=`, Mode 2 `pack=`/`build-pack=`, Mode 3 `pack=` / PACK-CANDIDATE, Mode 1 `add rule to pack`, Mode 5 orchestrates multi-pack builds). Pack changes use the independent PSG pack lane and never block a core release.

---

## Starting a maintainer session

```
Read MAINTAINER/platform-maintainer-agent.md
Task: [your goal — e.g. "audit the security expert for gaps", "add a new rule for X"]
```

The maintainer agent knows the full framework structure, the section model, the extension anatomy, and the release process. You do not need to explain any of this.

**Do not repeat:** "update manifests", "sync user docs", "fix changelog", "update E2E", or "update presentation". Those are **PSG** — mandatory at the end of every task. The agent must output a **PSG Report** before saying done.

---

## Maintainer toolbox — what to use and when

There are six maintainer tools. Each has a distinct trigger and a distinct output.

| Tool | File | Trigger | Output |
|------|------|---------|--------|
| **Add rule** (Mode 1) | `platform-maintainer-agent.md` | Observed a failure, have a specific rule to add | One rule added to the right PLATFORM section, logged, version bumped |
| **Internal platform audit** | `platform-audit.md` | Platform feels stale, before a release, or after many changes — check the platform's own health | Quality report: undertrained experts, weak playbooks, coverage gaps, vague rules, duplicates |
| **Web ecosystem audit** (Mode 2) | `web-audit.md` | Monthly schedule, or after an OWASP/CWE update | Structured findings F001-Fxxx from OWASP, CWE, best practices, **+ skill packs/playbooks (Phase 2F)** |
| **Targeted site scan** (Mode 2 `url=`) | `web-audit.md` | You want to point the scanner at one **non-repo website** (a product/service/docs/standards site) in a domain | Best-practice + feature-idea findings from that site; core lane, or `url=… pack=<id>` to route into any-axis pack (untrusted content + IP-safe: distil, never clone) |
| **User submission ingest** (Mode 3) | `platform-ingest.md` | User drops their agent/playbook/convention files into `MAINTAINER/ingest/`; add `pack=<id>` to feed a pack | Structured findings I001-Ixxx (core lane) **+ PACK-CANDIDATE findings routed into language/stack/platform/domain packs** |
| **GitHub ecosystem scan** (Mode 4) | `github-governance-scan.md` | Quarterly discovery **or** `repo=owner/name` targeted **or** `repo=… pack=<id>` to grow a stack/domain pack brain | Structured findings R001-Rxxx + Recommended adoption table (targeted/pack) |
| **Solution Blueprint** (Mode 5) | `solution-blueprint.md` | You can state a whole **system/mission goal** and want the pack set it needs across all 4 axes | 4-axis pack plan (domain/stack/platform/language) with **per-candidate approval gates** (reject out-of-scope stacks/platforms/languages), then orchestrated `build-pack=`/`pack=` builds + a composition note in the domain pack |

**The improvement cycle always ends the same way regardless of which tool triggered it:**
Template change → log in `platform-improvements.md` → **Platform Sync Gate (PSG)** → CHANGELOG `[Unreleased]` → `npm test` → (when ready) release via `tools/release.ps1`.

> **You never remind the agent to sync docs.** PSG runs automatically after every Mode 1–4 change. See `platform-maintainer-agent.md` § Platform Sync Gate.

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
| Monthly | Web ecosystem check (OWASP, CWE, best practices, **skill packs Phase 2F**) | `Read MAINTAINER/web-audit.md and execute it.` |
| Quarterly | Full ecosystem scan + emerging practices | `Read MAINTAINER/web-audit.md and execute it. scope=full` |
| Quarterly | GitHub ecosystem scan — discovery **or** targeted `repo=` | `Read MAINTAINER/github-governance-scan.md and execute it.` · targeted: `… repo=owner/name` |
| **Plan a whole system's pack set** | State a mission/system goal → 4-axis pack plan with per-candidate approval gates → orchestrated builds | `Read MAINTAINER/solution-blueprint.md and execute it. blueprint="<brief>"` (Mode 5; add `build=no` to dry-run) |
| **Build a NEW pack brain (greenfield)** | Author a new language/stack/platform/domain pack from the whole web ecosystem (standards, specs, reference apps, threat models, compliance) — not one repo | `… web-audit.md … build-pack=<id>` (Mode 2 — pack ecosystem build scan) |
| Grow an EXISTING pack brain | From a repo/app, docs freshness pass, user submissions, or a hand-written rule | `… github-governance-scan.md … repo=owner/name pack=<id>` (Mode 4) · `… web-audit.md … pack=<id>` (Mode 2 freshness) · `… platform-ingest.md … pack=<id>` (Mode 3) · or `"add rule to pack <id>: …"` (Mode 1) |
| After OWASP update | Security-focused subset | Run Mode 2 Phase 1 only |
| After shipping user-visible capabilities (v2.38+) | Sync user-facing docs + presentation + E2E plan | `"Sync user-facing docs for vX.Y.Z"` via maintainer agent — see checklist §D/F/G in `platform-maintainer-agent.md` |

---

## The maintainer's job — base platform vs packs

Everything the maintainer does falls into **two lanes**. Being explicit about which lane you're in is the single most important habit.

| | **Core lane (base platform)** | **Pack lane** |
|---|---|---|
| **What it holds** | Universal software-engineering discipline — experts, playbooks, skills, conventions. Ships to **every** consumer repo on `--mode=upgrade`. | Language/stack/platform/domain-specific knowledge — opt-in overlays users activate per project. Versioned & released **independently** of core. |
| **Bar** | Must generalize to *any* project. Stack/domain specifics are **rejected**. | Specificity is **the point**. Non-universal by design. |
| **Sync** | Full PSG (manifests, user docs, presentation, tests, counts). | PSG **pack lane** only (pack files + manifest `packs_catalog`/`kind:"pack"` + pack test + ledger). Never touches core counts. |
| **Release impact** | A change here is a platform release (`bootstrap_version`). | A stale/immature pack **never blocks a core release**; packs carry their own `pack.json` `version`. |

### The 5 modes across both lanes

| Mode | Core lane (base) | Pack lane |
|------|------------------|-----------|
| **1 — Manual** | `add rule to <expert>` / `add step to <playbook>` | `add pack <id>` · `add rule to pack <id>` |
| **2 — Web audit** | monthly OWASP/CWE/best-practice findings → experts | `build-pack=<id>` (greenfield build) · `pack=<id>` (freshness) · `url=<site> pack=<id>` (one site) |
| **3 — User ingest** | production-proven universal rules → experts | `pack=<id>` / **PACK-CANDIDATE** (a user's stack/domain rules) |
| **4 — GitHub scan** | coordination/skill-pack capabilities → platform | `repo=owner/name pack=<id>` (deep-read one app/repo into a pack) |
| **5 — Solution Blueprint** | *(orchestration — no direct core writes)* | `blueprint="<system goal>"` → decompose into a 4-axis pack set → **approve/reject per axis** → delegate to `build-pack=`/`pack=` |

### How a pack is expanded & enhanced (lifecycle)

```
build-pack=<id>        author the brain from the whole web ecosystem   (bootstrap)
      ↓
pack=<id>              docs/release freshness pass                      (keep current)
      ↓
repo=…pack=<id>        deep-read a specific real app/repo into it       (deep-dive a find)
      ↓
Mode 3 pack=<id>       a user/engineer's production-proven rules         (field-hardening)
      ↓
add rule to pack <id>  a hand-authored rule                             (targeted fix)
```
Mode 5 sits **above** this loop: for a whole system it fans the bootstrap step out across all four axes at once, with approval gates. Every step reads the **per-pack dedup ledger** first and updates it after, so nothing is processed twice and rejected items never re-surface.

### Cadence — standard maintainer updates

| Cadence | Core lane | Pack lane |
|---------|-----------|-----------|
| **Anytime (event-driven)** | `add rule` on an observed failure; Mode 3 when a user submits | `add rule to pack`; Mode 3 PACK-CANDIDATE; new pack via `build-pack=` or Mode 5 when a project needs it |
| **Monthly** | Mode 2 web audit (OWASP/CWE) | `pack=<id>` freshness on the most-used packs |
| **Quarterly** | Mode 2 `scope=full`; Mode 4 discovery; internal platform audit | `pack=<id>` freshness sweep on all active packs; re-check each pack's ledger "next iteration hints" (~6-month source re-verification) |
| **Per new project/system** | — | Mode 5 `blueprint="…"` to stand up the pack set; then normal per-pack growth |
| **Before a release** | internal audit + `"Sync user-facing docs for vX.Y.Z"` | verify changed packs' PSG pack lane; list added/updated packs in release notes |

**In one sentence:** the maintainer keeps the **core** universally excellent and up to date, and grows **packs** wherever real projects need depth — using the same five modes, but on the independent pack lane, and reaching for **Mode 5** when a whole system needs a coordinated pack set.

---

## Private & proprietary packs — fork to a private repo

Packs are where a **company's IP and secret sauce** live (a proprietary domain brain, an internal stack's conventions, a classified system's reference architecture). That content must **not** go into the public platform. The supported pattern:

**Fork the platform into a private repo and build your packs there.**

```
public Agent-Platform  ──fork──▶  your-org/Agent-Platform  (PRIVATE)
   (generic core)                       │
   pull core updates ◀──────────────────┤  ← keep the generic core current from upstream
                                         │
                                        build your packs here (Mode 5 / build-pack= / add pack)
                                         │
                        your teams install from the private fork
```

**How it works and why it's clean:**
1. **Core stays generic, keeps flowing.** The public core carries zero domain/IP by design (that's the whole "agnostic core" principle). Your private fork periodically merges upstream `main` to get core improvements — no conflicts, because your work lives in **packs**, not core files.
2. **Packs carry the IP — and stay private.** Run Mode 5 / `build-pack=` / `add pack` **inside the fork**. The pack files (`.agent/packs/<company>-<x>/`), their ledgers, and the maintainer scan archives all live in the private repo. Nothing proprietary is ever pushed to the public project.
3. **Teams install from the fork.** Point the installer at your fork (the fork's `AGENT-PLATFORM-MANIFEST.json` sets `platform_repo` / `platform_npx`): `npx github:your-org/Agent-Platform …`. Your developers get the generic core **plus** your private packs, activated per project via the normal *"scan my repo for packs"* / *"activate the X pack"* prompts.
4. **Per-project secrets stay out of the pack too.** Anything specific to a single repo/deployment (not reusable across the company's projects) belongs in that repo's `user.overlay.md` — it's never in any manifest and never leaves the repo.

**Layering summary (least → most sensitive):**

| Layer | Lives in | Shared with |
|-------|----------|-------------|
| Generic core | public platform (or upstream of your fork) | everyone |
| Company packs (IP / secret sauce) | **your private fork** `.agent/packs/*` | your org |
| Per-project rules | the project repo's `user.overlay.md` | that project only |

**Maintainer guidance:** treat your private fork as your pack factory. Keep core changes minimal (prefer contributing universal improvements back upstream) so upstream merges stay trivial; put all specificity in packs. This keeps the platform IP-safe *and* keeps you current with the public core — you get the best of both without ever exposing proprietary knowledge.

---

## Ship a release — plain-language workflow

When a batch of platform changes is ready to go live:

1. **Log and test locally** — `npm test` must pass (install, upgrade, uninstall, global stubs, plus any new capability assertions in `apply-integration.test.mjs`).
2. **Write CHANGELOG** — one `[X.Y.Z]` section summarizing everything since the last tag (playbooks, experts, audit phases, docs).
3. **Sync user-facing surfaces** — tell the agent `"Sync user-facing docs for vX.Y.Z"` so README, FRAMEWORK-README, QUICK-REF, PLATFORM-HELP, `agent-platform-beta.html`, and `team-adoption.html` match the release.
4. **Update E2E plan** — if playbooks, routing, or audit phases changed, update `tests/E2E-TEST-PLAN.md` manual phases (assertion count in the header tracks `npm test` automatically).
5. **Internal quality gate** — optional but recommended before release: `Read MAINTAINER/platform-audit.md and execute it.`
6. **Release** — say `"Release"` to the maintainer agent. It confirms the version bump, runs `.\tools\release.ps1 -Version X.Y.Z` (validates CHANGELOG, bumps manifest/README, runs tests, tags, pushes, creates GitHub release).

**After release:** consumer repos upgrade with `npx github:zafrirron/Agent-Platform --mode=upgrade`. No action needed in MAINTAINER/ — that folder never ships.

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
│   ├── platform-improvements.md       ← improvement log (all rules traced to source)
│   ├── github-governance-scan.md      ← Mode 4: quarterly GitHub scan (coordination + skill packs)
│   ├── solution-blueprint.md          ← Mode 5: system goal → 4-axis pack plan + orchestrated builds
│   ├── scan-results/                  ← UNIFIED scan registry (all modes — read before every scan)
│   │   ├── registry.md                ←   findings + dispositions + actions taken
│   │   ├── REPORT-SCHEMA.md           ←   required report format
│   │   ├── mode4/ · web-audit/ · ingest/ · internal/ · blueprint/  ← per-mode archives
│   │   ├── packs/                     ←   per-pack dedup ledgers (packs/<id>.md — pack-scoped mirror of registry.md)
│   └── governance-scan/               ← Mode 4 legacy output (mirrored to scan-results/)
│       ├── scan-log.md                ←   Mode 4 summary (points to registry.md)
│       └── archive/                   ←   full scan reports (legacy path)
│
├── AGENT-PLATFORM-TEMPLATES/      ← SHIPS TO CONSUMER REPOS on install
│   ├── .agent/agents/             ← 9 expert agents (with PLATFORM/PROJECT sections)
│   ├── .agent/playbooks/          ← 20 playbooks (with PLATFORM section)
│   ├── .agent/packs/              ← opt-in packs (language/stack/platform/domain) + shared README; user.overlay.md is user-owned
│   ├── .agent/tools/              ← agent-run tool docs (upgrade.md, packs.md, uninstall.md, …)
│   ├── .agent/CONVENTIONS.md      ← coding conventions (with PLATFORM/PROJECT sections)
│   ├── .claude/ · .cursor/ · .agents/ · .codex/ · .opencode/  ← 5 IDE private folders (commands, prompts, rules)
│   ├── opencode.json              ← OpenCode root config (instructions → AGENTS.md + .opencode/sync.md)
│   ├── global/                    ← USER-LEVEL STUBS (scope=global) — installed to ~/ via --mode=global
│   │   ├── .claude/CLAUDE.md      ←   global activation stub for Claude Code
│   │   ├── .cursor/rules/         ←   alwaysApply global rule for Cursor
│   │   ├── .codex/instructions.md ←   global activation stub for Codex
│   │   └── .agents/rules/         ←   global activation stub for Antigravity (OpenCode is per-project, no global stub)
│   └── ... (all other installed files)
│
├── AGENT-PLATFORM-MANIFEST.json   ← template registry + bootstrap_version
├── AGENT-PLATFORM-APPLY.js        ← installer entry point
├── bin/agent-platform.js          ← npx entry point
├── AGENT-PLATFORM-FRAMEWORK-README.md  ← USER documentation
├── CHANGELOG.md                   ← version history (MUST be updated before release)
├── tests/                         ← integration + unit tests (run on every commit)
└── tools/release.ps1              ← single command for versioning + tagging + GitHub release
```

> Test count: `npm test` runs 293 assertions (~3s). Count grows as governance phases and packs add coverage.

---

## The two install scopes

The platform installs at two independent scopes. Understanding both is important when testing or debugging install flows.

```
Scope 1 — Project (per repo)                Scope 2 — Global (per user, per machine)
─────────────────────────────────────────   ──────────────────────────────────────────────
[repo]/.agent/                              ~/.claude/CLAUDE.md
[repo]/.claude/                             ~/.claude/commands/  (lifecycle + caveman)
[repo]/.cursor/                             ~/.cursor/commands/  (lifecycle + /implement)
[repo]/.agents/                             ~/.cursor/rules/agent-platform-global.mdc
[repo]/.codex/                              ~/.codex/instructions.md
[repo]/.opencode/  + opencode.json          ~/.agents/rules/agent-platform-global.md
[repo]/AGENTS.md                            ~/.agent-platform/global-version
[repo]/CLAUDE.md                            (OpenCode: per-project only — no global stub)

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
# or, to feed a specific pack:
Read MAINTAINER/platform-ingest.md and execute it. pack=<pack-id>
```

The ingest agent:
1. Scans and classifies all files in `MAINTAINER/ingest/`
2. Extracts every specific, verifiable rule it finds
3. Deduplicates against existing platform rules **and active packs**
4. Classifies each finding: NEW / ENHANCE / **PACK-CANDIDATE** / DUPLICATE / PROJECT-SPECIFIC / VAGUE
5. Maps each finding to the best target — a core expert/playbook (core lane) **or a language/stack/platform/domain pack** (pack lane), or a new expert/pack/playbook candidate
6. Presents a structured ingest report with finding IDs (I001, I002, ...)

> **Two lanes:** universal rules go to core (full PSG); language/stack/platform/domain-specific rules become **PACK-CANDIDATE** and land in a pack under the non-universal bar (**PSG — pack lane**, never blocks a core release). This makes user submissions a feeder for pack brains, not just core.

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

## Multi-framework consistency rule — MANDATORY

The platform runs on **5 frameworks** (Claude Code, Cursor, Antigravity, Codex, OpenCode). Every change to agent behaviour, routing, or session instructions must be applied to all five. Missing one means that framework silently diverges.

### Always-loaded files — check all five on every behavioural change

| Framework | Always-loaded file |
|---|---|
| Claude Code | `AGENT-PLATFORM-TEMPLATES/CLAUDE.md` |
| Cursor | `AGENT-PLATFORM-TEMPLATES/.cursor/rules/platform-core.mdc` |
| Antigravity | `AGENT-PLATFORM-TEMPLATES/.agents/rules/00-multi-framework-sync.md` |
| Codex | `AGENT-PLATFORM-TEMPLATES/.codex/instructions.md` |
| OpenCode | `AGENT-PLATFORM-TEMPLATES/.opencode/sync.md` (loaded via `opencode.json` → `instructions: [AGENTS.md, .opencode/sync.md]`) |

Session-start is shared (`session-start-shared.md`) — one change covers all five. ✅  
Routing table (`AGENTS.md`) is shared — one change covers all five. ✅  
Always-loaded framework files are NOT shared — each must be updated individually. ⚠️

### Checklist before every commit that touches routing or session behaviour

- [ ] `AGENTS.md` PLATFORM section updated (routing table rows, rules, no-match logic) — never edit PROJECT section
- [ ] `CLAUDE.md` — auto-routing section consistent with AGENTS.md
- [ ] `.cursor/rules/platform-core.mdc` — auto-routing section consistent with AGENTS.md
- [ ] `.agents/rules/00-multi-framework-sync.md` — auto-routing section consistent with AGENTS.md
- [ ] `.codex/instructions.md` — auto-routing section consistent with AGENTS.md
- [ ] `.opencode/sync.md` — auto-routing section consistent with AGENTS.md
- [ ] No conflicting instructions in any framework file (no "silently", no "never announce" if ▶ prefix is active)
- [ ] Session-awareness notice: same text and logic in all five files

### How to audit consistency quickly

```
grep -rn "announce\|silently\|▶\|status prefix\|auto-routing" \
  AGENT-PLATFORM-TEMPLATES/CLAUDE.md \
  AGENT-PLATFORM-TEMPLATES/.cursor/rules/platform-core.mdc \
  AGENT-PLATFORM-TEMPLATES/.agents/rules/00-multi-framework-sync.md \
  AGENT-PLATFORM-TEMPLATES/.codex/instructions.md \
  AGENT-PLATFORM-TEMPLATES/.opencode/sync.md
```

Any result containing "never announce" or "silently" after routing changes is a bug.

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

The agent follows the extension anatomy and handles all file creation, manifest registration, and cross-file updates automatically.

**When adding a new expert agent, three additional files are required (Phase 1 governance):**
- `<name>-agent.manifest.json` — machine-readable capabilities, routing keywords, governance profile
- Entry in `reputation.json` — agent starts at overall: 500 with per-capability scores
- Routing row added inside `AGENTS.md` PLATFORM section (§2), not PROJECT section

These files seed the Phase 5 reputation-aware gate routing and Phase 6 manifest-driven routing. Omitting them will cause those phases to fail silently for the new agent.

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
| 5rep | Reputation delta — `reputation.json` scores updated at session end |
| 5gate | Reputation-aware gate scope — Critic dimensions adjust per score |
| 6 | Cross-framework Critic |
| 7 | Framework takeover — idempotency check, lost_confirmation state |
| 7b | Partial resume — partial finality triggers targeted step resumption |
| 8 | Upgrade two-section model |
| 9 | Project uninstall (scope 1 only) |
| 10 | Global install — stubs created, version file, idempotent upgrade |
| 11 | Global stub activation — AGENTS.md detection, install offer, skip |
| 12 | Global uninstall — USER content preserved, pure files deleted |
| 6a | Manifest cannot_do routing — UI task re-routes away from backend-agent |
| 6b | Manifest-augmented routing — manifest keywords route without clarification |

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
