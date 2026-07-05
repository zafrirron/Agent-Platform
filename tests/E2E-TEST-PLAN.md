# Agent Platform — End-to-End Test Plan v3

Tests the full platform lifecycle. Uses two AI frameworks: **Claude Code** and **Antigravity**.

## Automated vs manual split

```
npm test   ← runs all automated checks (293 tests, ~3s)
           covers: install, platform.json fields, placeholders, two-section markers,
                   v2.42 playbooks (20) + 11 lifecycle skills + optional ux-research skill + install profiles (lite/core/full),
                   language/stack/domain packs (opt-in): not installed by profile, detect-and-suggest proposal (no auto-install; deps + marker files + source extensions), --add=pack activation (incl. language pack shared overlay across code experts), active_packs, --list=packs, reference_sources,
                   --mode=add cherry-pick + --mode=list catalog, profile-filter unit tests,
                   references + spec-outline + plan handoff,
                   lifecycle slash commands (/plan /build /test /code-simplify /webperf /context /verify),
                   Cursor + Claude commands, PLATFORM-HELP + QUICK-REF updates,
                   enterprise context logs + routing rows, dynamic install banner,
                   upgrade PROJECT preservation, uninstall + restore,
                   user-owned rules preserved & git-tracked (file-scoped gitignore), platform-created vs user-owned CLAUDE.md, reconciliation contract in session-start, uninstall preserves user rules + prunes empty platform folders, uninstall harvests authored PROJECT sections + pack overlays to preserved file/folder,
                   global install, global uninstall, USER content preservation,
                   global/project scope independence
```

**Automated (npm test):**

| Phase | What | Test file |
|-------|------|-----------|
| 1 | Install: files, platform.json fields, placeholders, gitignore, backup, two-section markers, v2.42 playbooks/context/routing/references/commands/skills/profiles | `apply-integration.test.mjs` |
| 1 | Install: `--profile=lite`, `--mode=add`, `--mode=list` | `apply-integration.test.mjs` |
| 1p | Packs: not installed by profile, catalog registration, `--add=pack` activation + `active_packs`, `--list=packs`, `reference_sources`, **detect-and-suggest proposal (no auto-install)** | `apply-integration.test.mjs` |
| 1pu | Packs preservation: `user.overlay.md` + shipped pack files survive `--mode=upgrade` and `--mode=force`, `active_packs` preserved on upgrade, `user.overlay.md` stays out of the manifest | `apply-integration.test.mjs` |
| 1oc | OpenCode framework: default + `--framework=opencode` install, `.opencode/commands/*` + `agents/critic.md` + `opencode.json` emission, non-clobber of existing `opencode.json`, gitignore, no cross-framework leakage | `apply-integration.test.mjs` |
| 1r | User rules preserved & tracked: user `.cursor/rules/*.mdc` untouched + not gitignored, `.cursor/` not whole-folder ignored, platform-created `CLAUDE.md` gitignored, user-owned `CLAUDE.md` not gitignored | `apply-integration.test.mjs` |
| 1r | Reconciliation **contract**: session-start-shared.md ships conflict classification + conflict report + PROJECT-over-PLATFORM precedence + `reconcile my rules` trigger (live agent path is manual — see below) | `apply-integration.test.mjs` |
| 1r | MIGRATION-NOTES explains shared-folder model, precedence, reconcile trigger | `apply-integration.test.mjs` |
| 9r | Uninstall file-scoped: user rules (incl. added-after-install) survive, `.cursor/` retained when it holds user files, platform files removed, empty platform folders pruned | `apply-integration.test.mjs` |
| 9p | Uninstall **preserves authored-in-platform content**: user `PROJECT`-section rules → `AGENT-PLATFORM-PRESERVED-RULES.md`, pack `user.overlay.md` → `.agent-platform-preserved/`; pristine template sections not preserved (no noise) | `apply-integration.test.mjs` |
| 1 | Profile filter rules (lite/core/full) | `profile-filter.test.mjs` |
| 1 | Install: global stubs suggestion in stdout | `apply-integration.test.mjs` |
| 8 | Upgrade: PROJECT section preserved, PLATFORM section updated | `apply-integration.test.mjs` |
| 9 | Uninstall dry-run + confirm: platform removed, user files intact, CLAUDE.md restored | `apply-integration.test.mjs` |
| 10 | Global install: all stubs created, no raw placeholders, version file, PLATFORM/USER markers | `global-install.test.mjs` |
| 10 | Global install idempotent: no duplicate blocks after re-run | `global-install.test.mjs` |
| 10 | Global install upgrade: USER content preserved | `global-install.test.mjs` |
| 12 | Global uninstall dry-run: no changes made | `global-install.test.mjs` |
| 12 | Global uninstall confirm: pure files deleted, USER content kept in patched file | `global-install.test.mjs` |
| 12 | Global uninstall: project install untouched | `global-install.test.mjs` |

**Manual only (requires live AI agent):**

| Phase | Why manual |
|-------|-----------|
| 2 | Session start — requires Claude Code to execute session-start.md |
| 1r | Live rule reconciliation — requires an AI agent to classify a real conflicting user rule, present the conflict report, honour precedence, and re-run on `reconcile my rules` (contract that these instructions ship is automated) |
| 2b | Full project audit — requires AI to run 11 phases (incl. governance/compliance) |
| 2c | Slash commands — requires AI to honour full lifecycle `/spec` `/plan` `/build` `/test` `/review` `/code-simplify` `/webperf` `/context` `/verify` `/ship` (Claude + optional Cursor) |
| 1lite | Lite profile install — optional automated rehearsal with `--profile=lite --framework=cursor` |
| 1p | Language/stack/domain packs — detector proposal (deps + marker files + source extensions) + activation are automated; **live overlay load (incl. language overlay auto-loading for any code task) + reference-architecture use requires an AI agent** |
| 2d | Cursor Plan handoff — requires `/implement` or "implement the plan" after Plan approval |
| 3 | Auto-routing — requires AI to route core + enterprise + v2.42 prompt types silently |
| 4 | Security gate — requires AI to implement auth and trigger Step 5a |
| 5 | Session end — requires AI to derive summary and commit via shell tools |
| 5rep | Reputation delta — requires AI to update reputation.json at session end |
| 5gate | Reputation gate scope — requires AI to adjust Critic dimensions based on score |
| 6 | Cross-framework Critic — requires two different AI frameworks |
| 7 | Framework takeover — requires AI to detect and respond to stuck session |
| 11 | Global stub activation — requires AI to read ~/.claude/CLAUDE.md and act on it |
| 6cannotdo | Manifest cannot_do routing — requires AI to read manifest and re-route |
| 6manifest | Manifest-augmented routing — requires AI to fall back to manifest keywords |

---

---

## Before you start

Choose a clean empty folder as your test directory. Examples:

```bash
# Linux / macOS
export TEST_DIR=/tmp/platform-e2e

# Windows PowerShell
$TEST_DIR = "$env:TEMP\platform-e2e"
```

All steps below use `<TEST_DIR>` — substitute your chosen path.

The todo-app source files are in `tests/todo-app/` in this repo. Copy them to your test folder
in Phase 0.

---

## Phase 0 — Clean slate

```bash
# Create test folder and copy todo-app source
mkdir <TEST_DIR>
cp -r tests/todo-app/. <TEST_DIR>/    # Linux/macOS
# or: Copy-Item tests\todo-app\* <TEST_DIR>\ -Recurse  # Windows

# Initialise git
cd <TEST_DIR>
git init
git add -A
git commit -m "chore: initial todo app (pre-platform)"

# Clear npx cache so latest version installs
# Linux/macOS:
rm -rf ~/.npm/_npx
# Windows:
Remove-Item "$env:LOCALAPPDATA\npm-cache\_npx" -Recurse -Force -ErrorAction SilentlyContinue
```

**Verify starting state:**
- `CLAUDE.md` present → pre-existing (will be backed up by installer)
- `AGENTS.md` present → pre-existing (will be backed up by installer)
- `.agent/` absent → platform not installed yet
- `src/app.js` present → todo app source

---

## Phase 1 — Install (fresh install with pre-existing AI configs)

```bash
cd <TEST_DIR>
npx github:zafrirron/Agent-Platform
```

### Verify install summary shows:
- [ ] Version: v2.43.0
- [ ] Capabilities line: `✔  20 playbooks` (dynamic count from manifest — not a hardcoded "8")
- [ ] `npx jest` detected as test runner
- [ ] Pre-existing CLAUDE.md and AGENTS.md noted as backed up
- [ ] MIGRATION-NOTES.md created
- [ ] `○  Global stubs  not installed — run: npx ... --mode=global` line present (global stubs not yet installed on this machine)

### Verify key files:
```bash
# Linux/macOS — check exits 0
test -f <TEST_DIR>/.agent/session-start.md   && echo "OK: session-start.md"
test -f <TEST_DIR>/.agent/QUICK-REF.md       && echo "OK: QUICK-REF.md"
test -f <TEST_DIR>/.agent/platform.json      && echo "OK: platform.json"
test -f <TEST_DIR>/.agent/handoff/CURRENT.md && echo "OK: CURRENT.md"
test -f <TEST_DIR>/.agent/context/docs-registry.md && echo "OK: docs-registry.md"
test -f <TEST_DIR>/.agent/MIGRATION-NOTES.md && echo "OK: MIGRATION-NOTES.md"
```

```powershell
# Windows
Test-Path "<TEST_DIR>\.agent\session-start.md"          # True
Test-Path "<TEST_DIR>\.agent\QUICK-REF.md"              # True
Test-Path "<TEST_DIR>\.agent\platform.json"             # True
Test-Path "<TEST_DIR>\.agent\handoff\CURRENT.md"        # True
Test-Path "<TEST_DIR>\.agent\context\docs-registry.md"  # True
Test-Path "<TEST_DIR>\.agent\MIGRATION-NOTES.md"        # True
```

### Verify backup created — original AI configs preserved:
```bash
ls <TEST_DIR>/.agent/backup/          # must show pre-install-* folder
```
Read the backed-up file and confirm it contains the original pre-existing content
("This is a pre-existing CLAUDE.md to test platform backup and restore").

### Verify two-section model installed correctly:
```bash
grep -c "PLATFORM:START\|PROJECT:START" <TEST_DIR>/.agent/agents/backend-agent.md
# must return 2 (both markers present)
```

### Verify platform.json:
```bash
node -e "const p=require('<TEST_DIR>/.agent/platform.json'); console.log(p.bootstrap_version, p.test_runner, p.platform_repo, p.platform_npx)"
# 2.43.0  npx jest  zafrirron/Agent-Platform  github:zafrirron/Agent-Platform
```
- [ ] `platform_repo` field present and correct
- [ ] `platform_npx` field present and correct

### Verify v2.43.0 artifacts (automated in `npm test`; spot-check manually):
```bash
ls <TEST_DIR>/.agent/playbooks/*.md | wc -l          # 20
test -f <TEST_DIR>/.agent/context/nfr-log.md
test -f <TEST_DIR>/.agent/context/compliance-evidence-log.md
test -f <TEST_DIR>/.agent/context/incident-log.md
grep -c "production-readiness.md" <TEST_DIR>/AGENTS.md   # ≥1
grep -c "compliance-review.md" <TEST_DIR>/AGENTS.md      # ≥1
grep "Phase 10" <TEST_DIR>/.agent/playbooks/audit.md
grep "20 total" <TEST_DIR>/.agent/QUICK-REF.md
test -f <TEST_DIR>/.agent/context/spec-outline.md
test -f <TEST_DIR>/.agent/references/orchestration-patterns.md
test -f <TEST_DIR>/.cursor/commands/spec.md
test -f <TEST_DIR>/.cursor/commands/implement.md
test -f <TEST_DIR>/.cursor/rules/plan-mode-handoff.mdc
test -f <TEST_DIR>/.claude/commands/spec.md
test -f <TEST_DIR>/.claude/commands/ship.md
grep "Start here" <TEST_DIR>/.agent/PLATFORM-HELP.md
grep "Key principle" <TEST_DIR>/.agent/QUICK-REF.md
ls <TEST_DIR>/.agent/skills/interview-me/SKILL.md
ls <TEST_DIR>/.agent/skills/planning-and-task-breakdown/SKILL.md
test -f <TEST_DIR>/.claude/commands/plan.md
test -f <TEST_DIR>/.cursor/commands/build.md
```

### Optional — lite profile (skills pack) automated smoke:

```bash
cd <TEST_DIR_LITE>
npx github:zafrirron/Agent-Platform --profile=lite --framework=cursor
```

```bash
test -f <TEST_DIR_LITE>/.agent/skills/interview-me/SKILL.md
test ! -f <TEST_DIR_LITE>/.agent/agents/backend-agent.md   # experts skipped
test ! -f <TEST_DIR_LITE>/.agent/handoff/sync/registry.yaml
node -e "const p=require('<TEST_DIR_LITE>/.agent/platform.json'); console.assert(p.profile==='lite')"
grep "profile.*lite" <TEST_DIR_LITE>/AGENTS.md
```

### Verify gitignore block written:
```bash
grep "Agent Platform Bootstrap" <TEST_DIR>/.gitignore
# must show the START/END markers
```

---

## Phase 1p — Language, technology-stack & domain packs (detect · propose · activate · overlay)

Verifies the opt-in packs layer end-to-end: the installer **detects** the project language/stack/domain and **proposes** matching packs (never auto-installs), the user **activates** one, and a live agent **loads the overlay + reference architecture**.

> The todo-app fixture is an Express REST API — a natural extension is "add payments", which makes the fintech domain pack relevant. This phase simulates that.

### 1p.1 — List available packs (no install)
```bash
cd <TEST_DIR>
npx github:zafrirron/Agent-Platform --mode=list --list=packs
```
- [ ] Output lists language packs `pack:language-typescript [language]`, `pack:language-java [language]`, `pack:language-cpp [language]`
- [ ] Output lists `pack:stack-react [stack]`, `pack:stack-django [stack]`, `pack:domain-fintech [domain]`
- [ ] No `.agent/packs/` directory created by listing

### 1p.2 — Detect-and-suggest (proposal on upgrade)
Add a payments dependency to simulate a fintech feature, then re-run the installer:
```bash
# add "stripe" to dependencies (payments) — domain-fintech trigger
npm pkg set dependencies.stripe="^14.0.0"    # or edit package.json by hand
npx github:zafrirron/Agent-Platform --mode=upgrade
```
- [ ] Install summary shows a **`Suggested packs`** block
- [ ] It proposes `• Fintech / Payments — npx ... --add=pack:domain-fintech`
- [ ] The pack is **NOT** auto-installed: `.agent/packs/` still absent; `platform.json` → `active_packs` still `[]`

> A React/Django project would similarly surface `stack-react` / `stack-django`. Detection reads `package.json`, `manage.py`, `requirements.txt`, etc.

### 1p.3 — Activate a pack (opt-in)
```bash
npx github:zafrirron/Agent-Platform --mode=add --add=pack:domain-fintech
```
- [ ] `.agent/packs/domain-fintech/pack.json` exists
- [ ] `.agent/packs/domain-fintech/references/reference-architecture.md` exists
- [ ] `.agent/packs/README.md` shipped with the pack
- [ ] `platform.json` → `active_packs` now contains `domain-fintech`
- [ ] Other packs (e.g. `stack-django`) were **not** installed

```bash
node -e "const p=require('<TEST_DIR>/.agent/platform.json'); console.assert(p.active_packs.includes('domain-fintech'), 'active_packs missing'); console.log('active_packs:', p.active_packs)"
```

### 1p.4 — Live overlay load (requires AI agent)
In Claude Code / Cursor (after session start, Phase 2), send:
```
Add a payment charge endpoint to the todo API.
```
- [ ] Agent routes to `backend-agent` **and** reads `.agent/packs/domain-fintech/backend-agent.overlay.md` (it should apply fintech hard rules: integer minor units, idempotency key, double-entry, no card data in logs)
- [ ] Security-sensitive asks also pull `security-agent.overlay.md` (no PAN/CVV storage, webhook verification)

### 1p.5 — Reference-architecture query (requires AI agent)
Send:
```
Give me a reference architecture for a fintech payments app.
```
- [ ] Agent reads `.agent/packs/domain-fintech/references/reference-architecture.md`
- [ ] Response presents the building blocks (double-entry ledger, idempotency, PSP abstraction, reconciliation)
- [ ] Response **links back to the source repos** from `reference_sources` (apache/fineract, firefly-iii, ERPNext) with license awareness

### 1p.6 — Zero-cost when inactive (control)
```bash
# in a project with no active packs, confirm no overlay behavior
node -e "const p=require('<TEST_DIR_LITE>/.agent/platform.json'); console.assert((p.active_packs||[]).length===0)"
```
- [ ] With `active_packs` empty, routing behaves exactly as core (no overlay reads)

### 1p.7 — Language pack detect + activate (marker file, extension, shared overlay)
The todo-app fixture is a Node/JS project; a `tsconfig.json` marks it TypeScript. Detection also works from source extensions alone (no manifest).
```bash
# marker-file detection
cd <TEST_DIR> && echo '{ "compilerOptions": { "strict": true } }' > tsconfig.json
npx github:zafrirron/Agent-Platform --mode=upgrade
```
- [ ] `Suggested packs` proposes `• TypeScript — npx ... --add=pack:language-typescript`
- [ ] Not auto-installed (`.agent/packs/language-typescript` absent; `active_packs` unchanged)

```bash
# extension-only detection (no dependency manifest) — sanity check in a scratch dir
mkdir <SCRATCH>/src && echo 'int main(){return 0;}' > <SCRATCH>/src/main.cpp
npx github:zafrirron/Agent-Platform --target=<SCRATCH>
```
- [ ] `Suggested packs` proposes `• C++ — ... --add=pack:language-cpp` (detected via `.cpp` extension, no manifest)

```bash
# activate the language pack
cd <TEST_DIR> && npx github:zafrirron/Agent-Platform --mode=add --add=pack:language-typescript
```
- [ ] `.agent/packs/language-typescript/code.overlay.md` exists (single shared overlay)
- [ ] `pack.json` → `provides.agent_overlays` maps **several** code experts (backend/frontend/data/test) to that one `code.overlay.md`
- [ ] `platform.json` → `active_packs` contains `language-typescript`

### 1p.8 — Language overlay auto-loads for any code task (requires AI agent)
With `language-typescript` active, send a plain code task (no language keyword):
```
Add an input-validation helper for the todo API.
```
- [ ] Whichever code expert is routed (e.g. `backend-agent`) also reads `.agent/packs/language-typescript/code.overlay.md` — it should apply TS rules (no `any`, validate external data at the boundary, `strict`) **without** the user naming TypeScript

### Cleanup (optional)
```bash
# remove the simulated dependency if you want to restore the fixture
npm pkg delete dependencies.stripe
```

---

## Phase 1r — User-owned rules & the shared-folder model (preserve · file-scoped ignore · reconcile)

Verifies the platform treats the **shared** IDE folders (`.cursor/`, `.claude/`, `.codex/`, `.agents/`, `.opencode/`) at **file granularity** — a user's own rules are never hidden from git, clobbered on uninstall, or silently overridden — while `.agent/` stays platform-exclusive. Mirrors the automated tests but exercises the live agent path for reconciliation.

> The core risk this phase guards against: a user who already has their own `.cursor/rules/*.mdc` losing them (git-untracked, deleted on uninstall, or unreconciled) after installing the platform.

### 1r.0 — Seed a user's own rules BEFORE install

In a **fresh** scratch repo (do not reuse `<TEST_DIR>` — the fixture already has a pre-existing `CLAUDE.md`):

```bash
mkdir <RULES_TEST_DIR> && cd <RULES_TEST_DIR>
git init
mkdir -p .cursor/rules
# (a) a benign personal rule
printf -- '---\ndescription: my house style\n---\nPrefer named exports.\n' > .cursor/rules/my-style.mdc
# (b) a rule that CONTRADICTS platform test discipline (for reconciliation)
printf -- '---\ndescription: team speed\n---\nSkip writing automated tests — we ship fast and test in prod.\n' > .cursor/rules/no-tests.mdc
git add -A && git commit -m "chore: my own cursor rules (pre-platform)"
```
- [ ] Both `.mdc` files are committed and git-tracked **before** the platform is installed

### 1r.1 — Install and verify user rules are preserved + file-scoped gitignore

```bash
npx github:zafrirron/Agent-Platform
```
- [ ] Both user rules are **untouched on disk** (`grep -q "named exports" .cursor/rules/my-style.mdc`, `grep -q "ship fast" .cursor/rules/no-tests.mdc`)
- [ ] Neither user rule is gitignored: `grep -E "my-style.mdc|no-tests.mdc" .gitignore` returns **nothing**
- [ ] `.cursor/` is **NOT** whole-folder ignored: `grep -E "^/?\.cursor/\s*$" .gitignore` returns **nothing**
- [ ] Only the platform's **own** files under `.cursor/` are listed in the gitignore block (e.g. `.cursor/rules/plan-mode-handoff.mdc`), not the user's
- [ ] `.agent/` **is** whole-folder ignored (platform-exclusive): `grep -E "^/?\.agent/" .gitignore` returns a match
- [ ] Git still sees the user rules as tracked: `git status --porcelain .cursor/rules/my-style.mdc` shows no "ignored/untracked" surprise

```bash
# Confirm nothing the user owns got staged for deletion or ignored
git -C <RULES_TEST_DIR> status
```
- [ ] `.cursor/rules/my-style.mdc` and `no-tests.mdc` remain tracked (not newly ignored)

### 1r.2 — Platform-created root entry file is gitignored (non-Claude user)

The scratch repo had **no** `CLAUDE.md`; the platform creates one for cross-framework activation. Because the platform created it, it must be gitignored (never pollutes the user tree):
- [ ] `test -f <RULES_TEST_DIR>/CLAUDE.md` (platform created it)
- [ ] `grep -E "^/?CLAUDE.md" <RULES_TEST_DIR>/.gitignore` returns a match (platform-created → ignored)

> Contrast with `<TEST_DIR>` (Phase 0), where `CLAUDE.md` pre-existed and is **user-owned** → it is backed up and **not** gitignored.

### 1r.3 — MIGRATION-NOTES explains the model

```bash
cat <RULES_TEST_DIR>/.agent/MIGRATION-NOTES.md
```
- [ ] Contains a **"How your rules are handled"** section
- [ ] States user rules **stay tracked** and active; only platform files are ignored
- [ ] States precedence: **PROJECT** sections override **PLATFORM** defaults
- [ ] Documents the on-demand **"reconcile my rules"** trigger

### 1r.4 — Live reconciliation at session start (requires AI agent)

Open `<RULES_TEST_DIR>` in Claude Code / Cursor. Start a session:
```
Read .agent/session-start.md and execute it.
```
During Step 1c (one-time migration / reconciliation), verify the agent:
- [ ] Classifies the pre-existing rules — `my-style.mdc` as **keep/migrate**, `no-tests.mdc` as **conflict** (contradicts platform test discipline)
- [ ] Presents a **conflict report** for `no-tests.mdc` and asks how to resolve (**keep mine / keep platform / keep both**) — does **not** silently discard or silently apply it
- [ ] States precedence when explaining (PROJECT overrides PLATFORM; live IDE rules still apply)
- [ ] Notes the user's original rule files stay live (no silent duplication/deletion)

### 1r.5 — On-demand reconcile trigger (requires AI agent)

In the same session, add a new conflicting rule live, then type:
```
reconcile my rules
```
- [ ] Agent re-runs classification against the **current** live rule files (not just install-time snapshot)
- [ ] Surfaces the new conflict and offers the same keep-mine / keep-platform / keep-both resolution

### 1r.6 — Uninstall preserves standalone user rules + prunes empty platform folders

Add a user rule **after** install (the hardest case — never in the pre-install backup), then uninstall:
```bash
cd <RULES_TEST_DIR>
printf -- '---\ndescription: added later\n---\nKeep me.\n' > .cursor/rules/added-later.mdc
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
```
- [ ] `.cursor/rules/my-style.mdc`, `no-tests.mdc`, and `added-later.mdc` all **survive** (still on disk with content)
- [ ] `.cursor/` folder is **retained** (it still holds user files)
- [ ] The platform's **own** Cursor file (e.g. `.cursor/rules/plan-mode-handoff.mdc`) is **removed**
- [ ] `.agent/` is removed wholesale
- [ ] Platform gitignore block removed: `grep -c "Agent Platform Bootstrap" .gitignore` → 0
- [ ] In a **control** repo with no user files in `.cursor/`, uninstall **prunes** the now-empty `.cursor/` folder entirely

### 1r.7 — Uninstall preserves user content stored INSIDE platform files (PROJECT sections + pack overlays)

This is the critical data-loss case: rules the user authored **inside** platform files (which are removed wholesale). Set them up, then uninstall.

```bash
cd <RULES_TEST_DIR>
# (a) add a real project rule into a platform agent file's PROJECT section
#     edit .agent/agents/backend-agent.md so the PROJECT:START…PROJECT:END block contains:
#     "MY RULE: every endpoint must respond in under 200ms."
# (b) add a per-pack user overlay (never in the manifest)
mkdir -p .agent/packs/mypack
printf 'OVERLAY RULE: money in integer cents only.\n' > .agent/packs/mypack/user.overlay.md

# dry-run first — it should announce what will be SAVED
npx github:zafrirron/Agent-Platform --mode=uninstall
```
- [ ] Dry-run output lists a **"Your authored content will be SAVED before removal"** section naming `backend-agent.md` → `AGENT-PLATFORM-PRESERVED-RULES.md` and the pack overlay → `.agent-platform-preserved/…`

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
```
- [ ] `AGENT-PLATFORM-PRESERVED-RULES.md` exists at repo root and contains **"MY RULE: every endpoint must respond in under 200ms."** attributed to `.agent/agents/backend-agent.md`
- [ ] `.agent-platform-preserved/packs/mypack/user.overlay.md` exists and contains **"integer cents only"**
- [ ] `.agent/` is removed, but **no authored rule was lost** — everything is in the preserved file/folder
- [ ] Console printed `✅ Saved:` lines for each preserved item before the `✔ Removed:` lines

### 1r.8 — No preservation noise for untouched sections (control)

In a repo where you installed but **never edited** any PROJECT section or added an overlay:
```bash
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
```
- [ ] `AGENT-PLATFORM-PRESERVED-RULES.md` is **NOT** created (pristine template sections are not preserved)
- [ ] `.agent-platform-preserved/` is **NOT** created

---

## Phase 2 — Session Start (Claude Code)

Open Claude Code in `<TEST_DIR>`. New chat. Paste:
```
Read .agent/session-start.md and execute it.
```

### Verify:
- [ ] Step 1: registry.yaml — claude set to active, no conflict
- [ ] Step 1b: No Critic offer (first session — nothing prior to review)
- [ ] Step 1d: **First-session audit offer displayed** (no completed sessions exist yet):
  ```
  ┌──────────────────────────────────────────────────────────────────┐
  │  First session detected — Full Project Audit available           │
  │  Run a professional audit across 11 phases...                    │
  │  Run audit now? YES / NO (run manually later)                    │
  └──────────────────────────────────────────────────────────────────┘
  ```
  Reply **NO** — continue session without running audit (audit tested separately in Phase 2b)
- [ ] Step 1d: After NO — session proceeds to Step 2 without running audit
- [ ] Step 2: test runner already set (npx jest) — setup-test-runner skipped silently
- [ ] Step 5: Compact 4-line status block — NOT the full QUICK-REF table
- [ ] Step 5: `📄 .agent/QUICK-REF.md` link appears **outside** the code block
- [ ] Step 7: Auto-routing activated silently
- [ ] Step 8: `Ready. Tell me what you want to do.`

### Verify Step 1d does NOT fire on second session:
End and restart the session. Verify the audit offer does NOT appear again (CURRENT.md now has a session entry).
- [ ] Audit offer absent on second and subsequent sessions

### Test "show quick reference" trigger:
Type `show quick reference`
- [ ] Agent outputs one line pointing to the file — does NOT dump full table in chat

---

## Phase 2b — Full Project Audit

This phase tests both the audit playbook directly and the first-session YES path in isolation.

### Step A — Manual trigger (in active Claude Code session)

In the same session as Phase 2, type:
```
Run project audit
```

### Verify expert sequencing (11 phases):
- [ ] **Phase 1 — Architect:** component inventory, dependency map, ASCII architecture diagram
- [ ] **Phase 2 — Docs:** documentation inventory, staleness check, gap identification
- [ ] **Phase 3 — Security:** secrets scan, OWASP Top 10, CVE check
- [ ] **Phase 4 — Test:** coverage assessment, missing regression tests
- [ ] **Phase 4b — Performance:** NFR-P* rows from `nfr-log.md`, obvious bottlenecks
- [ ] **Phase 5 — Critic:** dead code, error handling gaps, complexity hotspots
- [ ] **Phase 5b — Frontend & a11y:** WCAG 2.2 checks on UI surfaces
- [ ] **Phase 6 — Data:** schema quality, migration safety, PII handling
- [ ] **Phase 7 — Backend:** API inventory, auth coverage, api-contracts.md
- [ ] **Phase 8 — DevOps:** CI/CD health, secrets management, rollback strategy
- [ ] **Phase 8b — Observability:** logging, health checks, runbooks
- [ ] **Phase 10 — Governance & maturity:** DORA proxies, compliance evidence log, gate execution
- [ ] **Phase 11 — Report:** executive summary includes Governance & maturity row

### Verify report output:
```bash
ls <TEST_DIR>/.agent/context/audit-*.md   # must show exactly one file named audit-YYYY-MM-DD-HH-MM.md
```
- [ ] Report file created at `.agent/context/audit-YYYY-MM-DD-HH-MM.md`
- [ ] Report contains executive summary table with per-domain health indicators (🟢🟡🔴)
- [ ] Report contains findings by severity (Critical → High → Medium → Low)
- [ ] Report contains Quick wins section
- [ ] Report contains Prioritised action plan

### Step B — First-session YES path (clean scratch folder)

Create a separate scratch folder to test the YES path in isolation:
```bash
mkdir <AUDIT_TEST_DIR>
cd <AUDIT_TEST_DIR>
git init
npx github:zafrirron/Agent-Platform
```

Open in Claude Code. Start session:
```
Read .agent/session-start.md and execute it.
```

When the Step 1d offer appears, reply **YES**.

- [ ] Audit runs immediately — all 11 phases complete
- [ ] Report generated at `.agent/context/audit-YYYY-MM-DD-HH-MM.md`
- [ ] After audit completes, session proceeds to Step 2 (not stuck or stopped)
- [ ] `Ready. Tell me what you want to do.` shown after audit

---

## Phase 2c — Slash commands (Claude Code + optional Cursor)

In Claude Code, type each command. Agent must load the referenced playbook or file — no "I don't have slash commands" response.

| Command | Expected behaviour |
|---------|-------------------|
| `/quick-ref` | Points to `.agent/QUICK-REF.md` — does **not** dump full table in chat |
| `/spec` | Loads `interview-me` skill (or `idea-refine` if exploratory) |
| `/plan` | Loads `planning-and-task-breakdown` skill |
| `/build` | Loads `incremental-implementation` skill (`build auto` after approved plan) |
| `/test` | Loads `test-driven-development` skill |
| `/code-simplify` | Loads `code-simplification` skill |
| `/webperf` | Loads `web-performance-audit` skill (Quick or Deep CWV) |
| `/context` | Loads `context-engineering` skill |
| `/verify` | Loads `verification-before-completion` skill (evidence before done) |
| `/audit` | Loads `audit.md` (all experts — full profile) |
| `/review` | Critic / code review |
| `/release` | Loads `release.md` (DevOps expert) |
| `/ship` | Production readiness or release (context-dependent) |

**Cursor (optional):** repeat `/session-start`, `/spec`, `/platform-help` in Cursor on the same repo.
- [ ] `/session-start` executes session-start.md (same as the paste prompt)
- [ ] `/platform-help` displays or reads `PLATFORM-HELP.md` (full guide)

---

## Phase 2d — Cursor Plan mode handoff (optional)

In Cursor, start an add-feature task that enters Plan mode. Approve the plan, then type `/implement` or `implement the plan`.

- [ ] Status line includes `resuming Step 3 — plan approved` (or equivalent per `plan-mode-handoff.mdc`)
- [ ] Agent loads `add-feature.md` and **skips** Steps 0–2 (spec/design already done)
- [ ] Implementation begins at Step 3 without re-asking design questions

---

## Phase 3 — Auto-routing (core + enterprise + v2.42 prompts)

Type each prompt. Agent routes silently — first line shows `▶ Expert · playbook` when routing fires.

| Prompt | Expected routing |
|--------|-----------------|
| `fix the create todo endpoint — it doesn't validate the title` | Backend + bug-fix |
| `add a due date field to todos` | Backend + add-feature |
| `check if the API is secure` | Security + security-audit |
| `write tests for the todos router` | Test expert |
| `document the API` | Docs expert → document-api |
| `I'm ready to cut a release` | DevOps + release playbook |
| `define NFRs for this API — p95 under 200ms` | Architect + nfr-definition |
| `run a production readiness review before go-live` | DevOps + production-readiness |
| `compliance review for SOC 2 SDLC controls` | Security + compliance-review |
| `accessibility audit on the todo form` | Frontend + accessibility-audit |
| `DORA maturity assessment for our team` | Architect + org-maturity-assessment |
| `interview me about adding push notifications` | Architect + interview-me skill (or requirements-clarification playbook) |
| `deprecate the legacy v1 todos endpoint` | Architect + deprecation |

---

## Phase 4 — Security gate (add-feature Step 5a)

```
Add user authentication — each todo should belong to a user.
Users authenticate with a token in the Authorization header.
```

### Verify automatic expert chaining:
- [ ] Architect: cross-cutting scope noted, ADR before code
- [ ] Backend: implements JWT auth (sub claim, owner field, 404 on wrong owner)
- [ ] **Step 5a fires automatically**: Security expert reviews new auth code
- [ ] Test expert: tests for auth logic
- [ ] Critic: 10-dimension adversarial review (incl. ACCESSIBILITY, OPERABILITY, BC)
- [ ] No handoff until all gates pass

---

## Phase 5 — Session End (Claude Code)

```
End session.
```

### Verify:
- [ ] Agent derives goal and file list from session context — does NOT ask user to recap
- [ ] Step 2c: Agent checks `git status` and commits any uncommitted changes using shell tools
- [ ] Working tree confirmed clean before proceeding
- [ ] CURRENT.md updated: goal · files · `Commit:` hash · `Critic reviewed: no`
- [ ] registry.yaml: claude → idle · `meta.updated_by: claude`
- [ ] registry.yaml: `finality_state: clean` (all checklist items passed) or `partial` (incomplete items)
- [ ] registry.yaml: `step_manifest` lists completed step IDs (e.g. `[reproduce, fix, regression, critic]`)
- [ ] `reputation.json`: `sessions_completed` incremented for active agents; `last_updated` set to today; `updated_at` set to today
- [ ] `reputation.json`: `overall` score delta applied (Critic APPROVED → +10; unresolved BLOCKED → -20)
- [ ] Output: `Session ended. Framework: claude → idle.`

---

## Phase 6 — Cross-framework Critic (switch to Antigravity)

Open `<TEST_DIR>` in **Antigravity**. New session. Paste:
```
Read .agent/session-start.md and execute it.
```

### Verify Step 1b fires the Critic offer box:
```
┌─────────────────────────────────────────────────────────────────┐
│  Cross-framework Critic review available                        │
│  Last session: claude — [goal from CURRENT.md]                  │
│  Files changed: [list from CURRENT.md]                          │
│  A different AI model did this work. Would you like me to run   │
│  a Critic review before we proceed?                             │
│  Reply YES to review, NO to proceed directly.                   │
└─────────────────────────────────────────────────────────────────┘
```

**Key check:** If this box does NOT appear, the `previous_framework` capture bug has returned.

Say **YES**. Verify:
- [ ] Critic runs cold 10-dimension review on files from CURRENT.md
- [ ] Findings shown with severity ratings
- [ ] CURRENT.md updated: `Critic reviewed: yes — X Critical, Y High, Z Medium`
- [ ] Offer not shown again in this session

---

## Phase 7 — Framework takeover

### Setup: simulate a stuck session
Manually edit `<TEST_DIR>/.agent/handoff/sync/registry.yaml`:
Set claude `status: active` with a task description (simulating it ran out of credits).

Then in Antigravity, start a new session:
```
Read .agent/session-start.md and execute it.
```

### Verify takeover offer:
```
┌─────────────────────────────────────────────────────────────────┐
│  claude has an open session                                     │
│  Task : [task from registry]                                    │
│  1. Take over — commit uncommitted work, close it, continue     │
│  2. Wait — end the other session first if still running         │
└─────────────────────────────────────────────────────────────────┘
```

Say **1**. Verify:
- [ ] Agent reads `completed_actions` map before committing (idempotency check)
- [ ] Agent checks `git status` and commits if uncommitted changes exist
- [ ] registry.yaml: claude set to idle
- [ ] registry.yaml: claude `finality_state` → `lost_confirmation`
- [ ] Antigravity session starts
- [ ] Cross-framework Critic offer follows

### Phase 7b — Partial resume offer (new)

To test Case B (partial session resume):
1. End a session mid-playbook (close IDE without running session-end)
2. Manually set in registry.yaml: `finality_state: partial`, `step_manifest: [reproduce, scope]`
3. Start a new session in the same framework

Verify:
- [ ] Partial resume offer appears showing completed steps
- [ ] Reply 1 (resume): playbook loads and skips completed steps
- [ ] Reply 2 (fresh): `step_manifest` cleared, `finality_state: clean`, normal session start

---

## Phase 8 — Upgrade two-section model

### Step A: Add a project-specific rule (simulates user customisation)
In Antigravity session, ask:
```
Add a project-specific backend rule: all our endpoints must respond in under 200ms
```
The agent adds this to the PROJECT section of backend-agent.md.

Verify before upgrade:
```bash
grep "200ms" <TEST_DIR>/.agent/agents/backend-agent.md   # must find it in PROJECT section
```

### Step B: End session and run upgrade
```
End session.
```
Then in terminal:
```bash
# Clear npx cache first
rm -rf ~/.npm/_npx   # Linux/macOS
# or: Remove-Item "$env:LOCALAPPDATA\npm-cache\_npx" -Recurse -Force  # Windows

npx github:zafrirron/Agent-Platform --mode=upgrade
```

### Step C: Verify after upgrade
```bash
# PROJECT section preserved (user rule still there)
grep "200ms" <TEST_DIR>/.agent/agents/backend-agent.md   # must still find it

# PLATFORM section updated (F003 mass-assignment rule from web audit)
grep -i "mass assignment" <TEST_DIR>/.agent/agents/backend-agent.md   # must find it

# Pure platform file fully replaced (session-start-shared.md has new trigger text)
grep "open .agent/QUICK-REF.md in your editor" <TEST_DIR>/.agent/session-start-shared.md   # must find it
```

---

## Phase 9 — Uninstall (project scope)

> This phase tests project-scope uninstall only. Global scope is tested separately in Phase 12.

### Dry run (no changes):
```bash
npx github:zafrirron/Agent-Platform --mode=uninstall
```
Verify output lists all platform folders — zero changes made.

### Real uninstall:
```bash
npx github:zafrirron/Agent-Platform --mode=uninstall --confirm
```

> Uninstall is **file-scoped** for the shared framework folders: it removes the platform's own files and then prunes any of `.claude/ .cursor/ .agents/ .codex/ .opencode/` that become empty. In this fixture those folders hold only platform files, so they are pruned entirely. If the user had their own rules in them, the folder (and those rules) would be **retained** — see **Phase 1r.6**. `.agent/` is always removed wholesale.

### Verify after uninstall:
```bash
# Platform folders gone (pruned because they held only platform files here)
test ! -d <TEST_DIR>/.agent   && echo "OK: .agent removed"
test ! -d <TEST_DIR>/.claude  && echo "OK: .claude removed (empty → pruned)"
test ! -d <TEST_DIR>/.cursor  && echo "OK: .cursor removed (empty → pruned)"
test ! -d <TEST_DIR>/.agents  && echo "OK: .agents removed (empty → pruned)"
test ! -d <TEST_DIR>/.codex   && echo "OK: .codex removed (empty → pruned)"

# Pre-existing AI configs RESTORED from backup
grep "pre-existing CLAUDE.md" <TEST_DIR>/CLAUDE.md   # original content restored
grep "pre-existing AGENTS.md" <TEST_DIR>/AGENTS.md   # original content restored

# User source untouched
test -f <TEST_DIR>/src/app.js   && echo "OK: src intact"

# Platform gitignore block removed
grep -c "Agent Platform Bootstrap" <TEST_DIR>/.gitignore   # must return 0

# Git history intact
git -C <TEST_DIR> log --oneline   # must show full history
```

---

---

## Phase 10 — Global Install

> Requires: a clean machine where `--mode=global` has not been run yet (or manually delete `~/.agent-platform/global-version` to reset).

### Step A — Run global install

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

### Verify installer output:
- [ ] Header: `Agent Platform Bootstrap vX.Y.Z — Global Install`
- [ ] Target path shown: your home directory
- [ ] `✔ Created: ~/.claude/CLAUDE.md`
- [ ] `✔ Created: ~/.claude/commands/caveman.md` (and other lifecycle commands)
- [ ] `✔ Created: ~/.cursor/commands/spec.md` (and other lifecycle commands)
- [ ] `✔ Created: ~/.cursor/rules/agent-platform-global.mdc`
- [ ] `✔ Created: ~/.codex/instructions.md`
- [ ] `✔ Created: ~/.agents/rules/agent-platform-global.md`
- [ ] `✔ Created: ~/.agent-platform/global-version`
- [ ] Summary section: "How it works" bullet points present

### Verify stubs created on disk:

```bash
# Linux/macOS
test -f ~/.claude/CLAUDE.md                                 && echo "OK"
test -f ~/.claude/commands/caveman.md                       && echo "OK"
test -f ~/.cursor/commands/session-start.md                && echo "OK"
test -f ~/.cursor/rules/agent-platform-global.mdc           && echo "OK"
test -f ~/.codex/instructions.md                            && echo "OK"
test -f ~/.agents/rules/agent-platform-global.md            && echo "OK"
test -f ~/.agent-platform/global-version                    && echo "OK"
```

```powershell
# Windows
Test-Path "~\.claude\CLAUDE.md"                              # True
Test-Path "~\.claude\commands\caveman.md"                    # True
Test-Path "~\.cursor\commands\spec.md"                      # True
Test-Path "~\.cursor\rules\agent-platform-global.mdc"        # True
Test-Path "~\.codex\instructions.md"                         # True
Test-Path "~\.agents\rules\agent-platform-global.md"         # True
Test-Path "~\.agent-platform\global-version"                 # True
```

### Verify stub content:
```bash
# PLATFORM:START / PLATFORM:END markers present
grep "PLATFORM:START" ~/.claude/CLAUDE.md    && echo "OK"
# USER section present
grep "USER:START"     ~/.claude/CLAUDE.md    && echo "OK"
# {{PLATFORM_NPX}} placeholder substituted — no raw placeholder in deployed file
grep "PLATFORM_NPX"  ~/.claude/CLAUDE.md    && echo "FAIL — placeholder not substituted"
```
- [ ] PLATFORM:START and PLATFORM:END present in all stub files
- [ ] USER:START and USER:END present in all stub files
- [ ] No `{{PLATFORM_NPX}}` literal in deployed stubs (must be substituted to actual value)
- [ ] `~/.agent-platform/global-version` contains correct version JSON

### Verify version file content:
```bash
node -e "const v=require(require('os').homedir()+'/.agent-platform/global-version'); console.log(v.version, v.platform_repo)"
# 2.43.0  zafrirron/Agent-Platform
```

### Step B — Re-run project install; verify summary shows global stubs installed

In `<TEST_DIR>` (or any project with platform installed), open Claude Code and trigger an install or check:

```bash
cd <TEST_DIR>
npx github:zafrirron/Agent-Platform --mode=repair
```

- [ ] Install summary shows: `✔  Global stubs  installed (v2.43.0) — platform activates in all your repos`
- [ ] The `○  Global stubs  not installed` suggestion line is **absent**

### Step C — Upgrade global stubs (idempotent run)

Run `--mode=global` again with stubs already installed:

```bash
npx github:zafrirron/Agent-Platform --mode=global
```

- [ ] Files with no USER content: show `✔ Updated:` (overwritten with latest)
- [ ] No duplicate PLATFORM blocks in updated files
- [ ] USER:START/END block is present and unchanged after upgrade

---

## Phase 11 — Global Stub Activation

Tests the per-repo detection logic baked into the global stubs. Uses Claude Code (reads `~/.claude/CLAUDE.md` automatically).

### Setup — three test repos

```bash
# Repo A: platform installed (has AGENTS.md)
mkdir <GLOBAL_TEST_A>
cd <GLOBAL_TEST_A> && git init
npx github:zafrirron/Agent-Platform

# Repo B: no platform, no skip file
mkdir <GLOBAL_TEST_B>
cd <GLOBAL_TEST_B> && git init && echo "# Empty repo" > README.md

# Repo C: no platform, has skip file
mkdir <GLOBAL_TEST_C>
cd <GLOBAL_TEST_C> && git init
touch .agent-platform-skip
```

### Test A — Repo with platform installed

Open `<GLOBAL_TEST_A>` in Claude Code. Start a new chat. Type any task (e.g. `"fix a bug"`).

- [ ] Claude routes silently to the correct expert — no announcement
- [ ] No install offer displayed (AGENTS.md present → offer suppressed)

### Test B — Repo without platform (install offer)

Open `<GLOBAL_TEST_B>` in Claude Code. Start a new chat. Type any message.

- [ ] Install offer displayed at the start of the first response:
  ```
  ┌──────────────────────────────────────────────────────────────────┐
  │  Agent Platform not detected in this repo                        │
  │  Install?  YES · NO · SKIP                                       │
  └──────────────────────────────────────────────────────────────────┘
  ```
- [ ] Reply **YES** → Claude runs `npx github:zafrirron/Agent-Platform` in repo root
- [ ] Platform files appear in `<GLOBAL_TEST_B>` after install completes
- [ ] Session continues after install

### Test B2 — NO response

Repeat Test B in a fresh repo. Reply **NO**.
- [ ] Claude proceeds normally without installing
- [ ] Offer does not appear again in the same session

### Test C — Repo with `.agent-platform-skip`

Open `<GLOBAL_TEST_C>` in Claude Code. Start a new chat. Type any message.

- [ ] Install offer is **NOT** displayed
- [ ] Claude proceeds normally without mentioning the platform

### Test D — SKIP response creates skip file

Open another fresh repo (no `.agent-platform-skip`). Reply **SKIP** when offer appears.
- [ ] `.agent-platform-skip` file created at repo root
- [ ] Offer does not appear if the session is reopened

---

## Phase 12 — Global Uninstall

### Setup: add USER content to one stub

Before uninstalling, add personal preferences to the USER section:

```bash
# Append user content inside the USER section of ~/.claude/CLAUDE.md
# Edit the file so USER:START / USER:END contains:
# Always use caveman lite output mode.
```

Verify the file contains:
```bash
grep "caveman lite" ~/.claude/CLAUDE.md   # must find it
```

### Step A — Dry run

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall-global
```

Verify dry run output:
- [ ] Header: `Agent Platform Bootstrap — Uninstall Global Stubs`
- [ ] `⚠️  DRY RUN — nothing deleted`
- [ ] `~/.claude/CLAUDE.md` listed under **Will be PATCHED** (has USER content)
- [ ] Other stub files (no USER content) listed under **Will be DELETED**
- [ ] `~/.claude/commands/caveman.md` and `~/.cursor/commands/spec.md` etc. listed under **Will be DELETED**
- [ ] Nothing actually changed on disk

### Step B — Confirm uninstall

```bash
npx github:zafrirron/Agent-Platform --mode=uninstall-global --confirm
```

Verify after uninstall:

```bash
# ~/.claude/CLAUDE.md: PATCHED — platform block removed, user content kept
grep "PLATFORM:START"  ~/.claude/CLAUDE.md  && echo "FAIL — platform block still there"
grep "caveman lite"    ~/.claude/CLAUDE.md  && echo "OK — user content preserved"

# Other stub files: DELETED
test ! -f ~/.cursor/rules/agent-platform-global.mdc  && echo "OK: cursor stub removed"
test ! -f ~/.codex/instructions.md                   && echo "OK: codex stub removed"
test ! -f ~/.agents/rules/agent-platform-global.md   && echo "OK: agents stub removed"

# Commands: DELETED
test ! -f ~/.claude/commands/caveman.md              && echo "OK: claude command removed"
test ! -f ~/.cursor/commands/spec.md                 && echo "OK: cursor command removed"

# Version tracking: DELETED
test ! -f ~/.agent-platform/global-version           && echo "OK: version file removed"
```

- [ ] `~/.claude/CLAUDE.md` still exists and contains the user's `caveman lite` preference
- [ ] PLATFORM:START/END block absent from `~/.claude/CLAUDE.md`
- [ ] All other stub files deleted (no USER content was added to them)
- [ ] All command files deleted
- [ ] `~/.agent-platform/global-version` deleted

### Step C — Verify project install unaffected

```bash
test -d <TEST_DIR>/.agent   && echo "OK: project install untouched"
```
- [ ] Project platform files in `<TEST_DIR>` completely unchanged by global uninstall

---

## Phase 5b — Reputation-aware Critic gate (manual)

After completing a task through a full add-feature or bug-fix playbook:

1. Run 2+ sessions successfully (Critic APPROVED each time) to build `backend-agent` reputation above 700
2. Trigger a routine bug-fix task

Verify:
- [ ] Critic gate runs with reduced scope: `[CORRECTNESS] [TEST]` only (not all 10 dimensions)
- [ ] Agent reports reduced scope in status line, e.g. `✅ Critic [CORRECTNESS, TEST]: 0C 0H`

To test expanded scope: manually set `backend-agent.overall` to 250 in `reputation.json`, run same task.
- [ ] Critic uses all 10 dimensions (incl. ACCESSIBILITY, OPERABILITY, BC)

---

## Phase 6a — Manifest cannot_do routing (manual)

With manifests deployed, try to route a task that violates an agent's `cannot_do`:

```
Add a new login page component with a form and validation
```

Expected: this is UI work. Routing should go to frontend-agent.
backend-agent manifest has `"UI"` in `cannot_do`.

Verify:
- [ ] Agent identifies task as frontend work — routes to frontend-agent (not backend-agent)
- [ ] Status line: `▶ Frontend expert · add-feature playbook`

---

## Phase 6b — Manifest-augmented routing fallback (manual)

Try a task whose keywords are in manifests but not the AGENTS.md routing table rows exactly:

```
I need to optimise a slow database aggregate query
```

Verify:
- [ ] Agent routes to data-agent (manifest routing_keywords: `query-optimisation`, `aggregate`)
- [ ] No clarification question asked
- [ ] Correct expert + playbook loaded silently

---

## Pass / Fail Summary

| Phase | Test | Pass condition |
|-------|------|----------------|
| 0 | Clean state | Pre-existing CLAUDE.md + AGENTS.md present, .agent/ absent |
| 1 | Install | v2.43.0, 20 playbooks, references + spec-outline, install banner shows dynamic playbook count, jest detected, backup created, MIGRATION-NOTES.md exists, two-section markers present, platform.json has platform_repo + platform_npx |
| 1r | User rules preserved (install) | User `.cursor/rules/*.mdc` untouched + git-tracked (not gitignored); `.cursor/` not whole-folder ignored; platform-created `CLAUDE.md` gitignored, user-owned not; MIGRATION-NOTES explains model + precedence + reconcile |
| 1r | Live reconciliation — manual | Session start classifies benign vs conflicting user rule, shows conflict report (keep mine/platform/both), honours precedence; `reconcile my rules` re-runs on live rules |
| 9r | Uninstall preserves user rules | User rules (incl. added-after-install) survive; `.cursor/` retained when holding user files; platform files removed; empty platform folders pruned; gitignore block removed |
| 9p | Uninstall preserves authored-in-platform content | User `PROJECT`-section rules saved to `AGENT-PLATFORM-PRESERVED-RULES.md`; pack `user.overlay.md` copied to `.agent-platform-preserved/`; dry-run announces saves; pristine sections not preserved |
| 2 | Session start | Step 1d audit offer (first session); NO path; offer absent on second session; compact status block; `show quick reference` points to file |
| 2b | Full project audit — manual | 11 phases complete, report at correct path, executive summary incl. Governance & maturity row |
| 2b | Full project audit — YES path | Fresh repo: offer appears, YES runs all 11 phases, session continues after audit |
| 2c | Slash commands — manual | `/spec` `/plan` `/build` `/test` `/code-simplify` `/webperf` `/context` `/verify` `/review` `/ship` load correct skills/playbooks (Claude; Cursor optional) |
| 1lite | Lite profile — auto | `--profile=lite`: skills + commands, no agents/registry/enterprise; `platform.json.profile=lite` |
| 2d | Plan handoff — manual (Cursor) | `/implement` after Plan approval resumes add-feature Step 3 with plan-approved status line |
| 3 | Auto-routing | 13 prompts routed silently to correct expert/playbook (core + enterprise + interview + deprecate) |
| 4 | Security gate | add-feature Step 5a fires automatically for auth feature |
| 5 | Session end | Agent derives summary, commits work via shell, CURRENT.md has commit hash |
| 5rep | Reputation delta — manual | sessions_completed incremented, scores updated, last_updated set in reputation.json |
| 5gate | Reputation gate scope — manual | High score → reduced Critic dimensions; low score → all 10 mandatory |
| 6 | Cross-framework Critic | Offer box appears in Antigravity, YES triggers 10-dim cold review |
| 7 | Framework takeover | Offer appears for stuck session, takeover completes cleanly |
| 7b | Partial resume — manual | Partial finality triggers resume offer; step 1 resumes from first incomplete step |
| 8 | Upgrade two-section | PROJECT section preserved, PLATFORM updated, pure platform files replaced |
| 9 | Project uninstall dry-run | Lists all files, zero changes made |
| 9 | Project uninstall confirm | Platform gone, original CLAUDE.md + AGENTS.md restored, src/ intact |
| 10A | Global install | Stubs + Claude/Cursor lifecycle commands created, version file v2.43.0, no raw {{placeholders}} |
| 10B | Post-install summary | Repair run shows ✔ Global stubs installed with version |
| 10C | Global upgrade (idempotent) | Re-run --mode=global: updated without duplicate blocks, USER section preserved |
| 11A | Global activation — installed repo | Claude routes silently, no offer |
| 11B | Global activation — uninstalled repo | Offer displayed; YES installs; NO proceeds; SKIP creates skip file |
| 11C | Global activation — skip file | Offer suppressed when .agent-platform-skip present |
| 12A | Global uninstall dry-run | Correct files listed as DELETE vs PATCH, zero changes made |
| 12B | Global uninstall confirm | USER content preserved in patched file; pure platform files deleted; project install untouched |
| 6a | Manifest cannot_do routing — manual | UI task routes to frontend, not backend; manifest cannot_do respected |
| 6b | Manifest-augmented routing — manual | Task with manifest-only keywords routes correctly without clarification question |
