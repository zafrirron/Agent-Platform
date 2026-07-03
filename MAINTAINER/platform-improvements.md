# Platform Improvements Log

> Every platform rule traces back to a real failure. This file is that record.
> Log every improvement here before shipping it. Do not add rules without a log entry.

---

## Format

```
### [vX.Y.Z] — YYYY-MM-DD — <one-line description>

**Failure observed:** What went wrong in a real or simulated scenario.
**File changed:** Which template file was updated.
**Rule added:** The exact rule or done-when item.
**Validated:** Yes / No / Pending — did this rule actually prevent the failure in testing?
```

---

### [Unreleased] — 2026-07-03 — Add OpenCode as the 5th supported IDE framework (Mode 4: R036–R039)

**Source:** Mode 4 targeted scan of `anomalyco/opencode` (resolved from https://opencode.ai/). OpenCode is a peer AI coding-agent runtime that natively reads `AGENTS.md`/`CLAUDE.md`/`SKILL.md` and supports `.opencode/commands`, `.opencode/agents`, and `opencode.json`.

**Failure observed (opportunity):** the platform was invisible-but-usable in OpenCode (AGENTS.md auto-loads) yet had **no first-class support** — no slash commands, no invokable Critic, no config, no cross-IDE handoff registration. Users switching to/from OpenCode fell outside the multi-framework coordination model.

**Files changed:** followed `MAINTAINER/add-framework.md` end-to-end.
- **New templates** — `AGENT-PLATFORM-TEMPLATES/.opencode/`: `FRAMEWORK.json`, `opencode.json`, `sync.md`, `prompts/session-start.md`+`session-end.md`, `agents/critic.md`, `commands/*.md` (13 lifecycle commands).
- **Installer** — `AGENT-PLATFORM-MANIFEST.json` (`frameworks[]` + 19 file entries), `profile-filter.mjs` (`FRAMEWORK_PREFIX.opencode` incl. root `opencode.json`), `apply.js` (fw list/labels, gitignore `.opencode/`+`opencode.json`, uninstall managed dirs/files, `FW_CONFIG_FILES`, `PLATFORM_FOLDER_SCANS`, `OPENCODE_PLATFORM_COMMANDS`, "5 IDE frameworks" banner, "Works in" line).
- **Shared files** — registry.yaml, SYNC.md, ZONES.md, `.agent/session-start.md`+`session-end.md`, SYNC-POINTS.md, handoff/TEMPLATE.md, `.agent/README.md`, `AGENTS.md` private-folder list; "do not edit" lists in all four existing frameworks' prompts + `agent-sync.mdc` / `00-multi-framework-sync.md` / `.codex/instructions.md`.
- **Docs/decks** — README, FRAMEWORK-README, BOOTSTRAP, `docs/DISTRIBUTION.md` (OpenCode interoperability section), PLATFORM-HELP, CONTRIBUTING, COPYING, `package.json`, both presentation decks; roadmap R040/R041.

**Rule added:** OpenCode is a supported framework; installs are non-clobbering for `opencode.json`; `.opencode/` uses OpenCode's canonical plural subdir names (`commands/`, `agents/`).

**Validated:** Yes — `npm test` 258/258 green (+13: default + scoped install, command/subagent/`opencode.json` emission, non-clobber of existing `opencode.json`, gitignore, no cross-framework leakage under `--framework=opencode`).

---

### [Unreleased] — 2026-07-03 — Fix: pack detection false positive (`stack-react` on every Node repo)

**Failure observed:** A dry-run of pack detect-and-suggest on the E2E `tests/todo-app/` fixture (a plain Express REST API — no React) wrongly proposed `--add=pack:stack-react`. Root cause: `stack-react`'s `detect.files` included the generic `package.json`, and `detectPacks` treats every declared signal as match-any, so any repo with a `package.json` matched. Compounding: `detectPacks` silently ignored the `globs` and `keywords` signals the catalog declared, so React's real `**/*.tsx`/`**/*.jsx` signal never ran.

**Files changed:**
- `AGENT-PLATFORM-MANIFEST.json` — `stack-react.detect`: removed `package.json` file signal (keep `react`/`react-dom` deps + `**/*.tsx`/`**/*.jsx` globs); `domain-fintech.detect`: removed unused `keywords` (never evaluated; deps remain trigger).
- `AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/apply.js` — `detectPacks` now honours `globs` via a bounded, path-based scan reusing the extension walk.
- `tests/apply-integration.test.mjs` — +2 regression tests.

**Rule added:** Pack `detect` signals must be **specific** — never a generic manifest filename like `package.json`. Precise signals only: framework deps, framework-specific files (`manage.py`), source extensions, or path globs.

**Validated:** Yes — non-React Node project no longer suggests `stack-react`; `.jsx` project suggests it via glob; base todo-app suggests nothing; `npm test` 245/245 green.

---

### [Unreleased] — 2026-07-03 — Mode 3 ingest → pack lane (maintainer-only)

**Source:** Platform architecture — while documenting "how each of the 4 maintainer modes grows a pack brain", found Mode 3 (ingest) was the only mode with no pack path: a user's stack/domain/platform-specific rule would be classified PROJECT-SPECIFIC and discarded rather than routed into a pack.

**Gap observed:** Modes 1 (`add rule to pack`), 2 (`pack=` refresh), and 4 (`repo=… pack=`) could all feed packs; Mode 3 could only feed core (universal bar), so production-proven user rules that are language/stack/platform/domain-specific had nowhere to go.

**Files changed (MAINTAINER/* only — no consumer template change):**
- `platform-ingest.md` — `pack=<id>` trigger; two-lane model (core vs pack); new **PACK-CANDIDATE** status (distinct from PROJECT-SPECIFIC = repo/team-tied); Step 3 dedup now includes `.agent/packs/**`; Step 4 pack integration-path table (overlay/references/`reference_sources`/reference-architecture) + attachment-by-kind; Step 5 report gains pack findings + New-pack-candidates + counts; Step 6 pack selection commands; Step 7b pack-lane implementation (bump `version`+`last_verified`, routing sync, **PSG pack lane**, pack-tagged provenance); Step 9 pack archive path + `Scope: pack`; quality bar gains a pack (non-universal) variant.
- `GUIDE.md` — Mode 3 row + "Grow a pack brain" row + Mode 3 section note the pack lane; two-lane note under the sources diagram.
- `REPORT-SCHEMA.md` — ingest pack archive path + PACK-CANDIDATE; `registry.md` — pack-scoped note includes Mode 3; `platform-maintainer-agent.md` — "grow packs" note includes Mode 3.

**Capability added:** all four maintainer modes can now grow pack brains; user submissions are a first-class feeder for packs; pack writes stay on the independent PSG pack lane and never block a core release.

**Validated:** N/A (docs/playbook-only; `npm test` unaffected — no manifest/code change).

---

### [Unreleased] — 2026-07-03 — Packs model → 4 axes: `platform` (execution/deployment target) kind formalized (design only)

**Source:** Platform architecture — user question "how are hardware and OS handled? are they the technology stack or a new orthogonal axis?" with a drone use case (domain: drone mission brain · language: C++ · Docker · Airvolute DroneCore 2 + NVIDIA Jetson + STM32H7).

**Gap observed:** the 3-axis model (language/stack/domain) had nowhere for *where code runs* — hardware target (Jetson/STM32/carrier board), OS/RTOS (Linux/L4T, FreeRTOS, bare-metal), and container runtime (Docker/k8s). Folding these into `stack` would duplicate them across every framework pack (the same failure that split `language` out of `stack`).

**Decision:** add a 4th orthogonal `kind: "platform"` = execution/deployment target. Key insight recorded: a `kind` does not constrain composition (multiple same-kind packs can be active), so hardware+OS are one axis — activate several `platform` packs for heterogeneous systems; extract a standalone OS pack (`platform-freertos`) only on duplication. Boundary tightened: language runtime (Node/JVM) → language/stack; container/OS runtime (Docker/Linux) → platform. Drone example maps to `language:cpp` + `stack:ros2` + `platform:jetson-orin` + `platform:stm32h7` + `platform:docker` + `domain:drone-autonomy`; the SoC↔MCU split lives in the domain pack's reference architecture.

**Files changed (design/spec + maintainer only — no consumer template/behavior change):** `MAINTAINER/adr/ADR-001-stack-domain-packs.md` (Principle 1 → four axes + platform rationale + composition note; schema kind enum + platform detection note; Phase 2p; status), `MAINTAINER/platform-governance-roadmap.md`, `.agent/packs/README.md` (four-kinds table + platform section + schema), `MAINTAINER/platform-maintainer-agent.md` (`add pack` accepts `platform-<name>` + attachment/detection guidance).

**Scope:** design formalization per user request — **no curated `platform-*` packs, no code, no detection change** yet. End-user docs/decks intentionally left unchanged until platform packs ship (avoid advertising an empty kind).

**Validated:** N/A (docs-only; `npm test` unaffected — no manifest/code change).

---

### [Unreleased] — 2026-07-03 — Programming-language packs (Phase 2) — new `language` kind

**Source:** Platform architecture — user question "are programming languages (Java, TypeScript, C++) technology packs?". They aren't the same axis: a language is reusable across every framework in it, so folding language rules into each `stack` pack would duplicate them N times.

**Gap observed:** packs had only `stack`/`domain` kinds; no way to carry language-level footguns (TS type safety, Java concurrency, C++ ownership/UB). The detector also ignored `detect.globs`, so language-only repos (e.g. C++ with no dependency manifest) were never suggested. The overlay loader assumed a `<expert>.overlay.md` filename, blocking a shared-across-experts overlay.

**Files changed:**
- New packs: `.agent/packs/language-typescript/`, `language-java/`, `language-cpp/` (each: `pack.json` kind `language`, shared `code.overlay.md` mapped to all code experts, `references/<lang>-pitfalls.md`, `routing.md`).
- `.agent/bootstrap/apply.js` — `detectPacks` now evaluates `detect.extensions` via a bounded, shallow (depth ≤2, ≤4000 files, skips heavy/dot dirs) source-extension scan.
- Overlay loader made map-driven (`provides.agent_overlays[<expert>]`): `AGENTS.md` Step 3b, `AGENTS-lite.md`, `session-start-shared.md`, `using-platform` skill.
- Manifest `packs_catalog` (3 language entries, kind `language`, `detect.extensions`) + `kind:"pack"` files.
- Docs/presentation → three-kind model: README, `docs/DISTRIBUTION.md`, QUICK-REF (+lite), PLATFORM-HELP, `.agent/packs/README.md`, ADR-001, both decks; `platform-maintainer-agent.md` add-pack command (language id + shared overlay guidance).

**Capability added:**
- Third orthogonal pack axis (`language`) that overlays every code-writing expert — once active, the language's rules apply to all code in the session (no keyword needed), composing with `stack`/`domain`.
- Language detection by marker file **and** source extension (catches manifest-less repos).

**Validated:** Done — `npm test` green (243 tests; +8: catalog kind check, language-pack activation + shared-overlay map, tsconfig + `.cpp`-extension detection).

---

### [Unreleased] — 2026-07-03 — Packs maintainer growth loop (Phase 3, maintainer-only)

**Source:** Platform architecture — closing the ADR-001 loop so maintainers can *grow* stack/domain pack brains (Phase 1 shipped consumer-side only).

**Gap observed:** the 4 maintainer modes deliberately reject stack/domain-specific content (universal bar). With packs shipped, there was no sanctioned path to route specific findings *into* a pack, nor to author/refresh packs or keep them from rotting.

**Files changed (MAINTAINER/* only — no consumer template change):**
- `github-governance-scan.md` — Mode 4 `pack=<id>` scope (P0–P5): deep-read repo/app, findings target `.agent/packs/<id>/` (overlay/references/`reference_sources`/reference-architecture), pack PSG lane, pack archive naming.
- `web-audit.md` — Mode 2 `pack=<id>` freshness pass (framework/version/compliance updates → pack; bump `last_verified`).
- `platform-maintainer-agent.md` — `add pack <id>` + `add rule to pack <id>` commands; **PSG pack lane** (independent versioning/tests; N/A for core count invariants); change-type matrix row.
- `platform-audit.md` — Step 6b pack-health check (staleness, overlay/routing drift, missing files, dead `reference_sources`, manifest registration, provenance).
- `scan-results/REPORT-SCHEMA.md` + `registry.md` — `Scope: pack` · `Pack: <id>` variant + pack archive paths.
- `GUIDE.md` — Mode 4/growth rows; `ADR-001` + roadmap status → Phase 3 shipped.

**Capability added:** external sources (Mode 2/4) and manual authoring (Mode 1) now feed **pack** brains under a non-universal bar, with provenance, independent versioning, and staleness detection — packs get smarter over time without polluting core.

**Validated:** Done — `npm test` green (235 tests; maintainer-only change, no manifest/count impact). PSG classification: **Maintainer-only** (A + H + explicit N/A for manifests, user docs, presentation, tests; counts unchanged).

---

### [Unreleased] — 2026-07-03 — Technology-stack & domain Packs layer (Phase 1)

**Source:** Platform architecture enhancement (maintainer-directed). Design: `MAINTAINER/adr/ADR-001-stack-domain-packs.md`; roadmap backlog entry.

**Gap observed:** the platform is (verified) stack/domain agnostic — it could not give React/Django/HIPAA/PCI-specific help, and loading all stacks/domains into every repo would bloat unused content. No sanctioned path existed to *grow* stack/domain-specific brains without polluting the universal core.

**Files changed:**
- New: `.agent/packs/README.md` (spec) + packs `stack-react`, `stack-django`, `domain-fintech` (pack.json + overlays + references + routing).
- Installer: `profile-filter.mjs` (pack gating, `pack:` add tokens, `isPackPath`/`packIdOf`), `apply.js` (`--list=packs`, `active_packs`, `detectPacks` detect-and-suggest).
- Manifest: `packs_catalog` + `kind:"pack"` file entries.
- Wiring: `AGENTS.md` (Step 3b overlay load + reference-architecture row), `AGENTS-lite.md`, `session-start-shared.md`, `using-platform` skill.
- Docs: `docs/DISTRIBUTION.md`, README, QUICK-REF (+lite), PLATFORM-HELP; presentation decks.
- Tests: 15 new (`apply-integration.test.mjs`) — not-installed-by-default, catalog registration, activation, `--list=packs`, `reference_sources`, detect-and-suggest proposal (no auto-install); E2E **Phase 1p** added to `E2E-TEST-PLAN.md`.

**Capability added:**
- Opt-in `stack`/`domain` packs as **overlays** (never modify core); composable; no combo packs.
- Detect-and-suggest activation; `active_packs` in `platform.json`; zero cost when none active.
- Domain packs carry `reference_sources` (real source-app repos, license-aware) + `reference-architecture.md`; user reference-architecture query path.

**Validated:** Done — `npm test` green (235 tests; incl. 15 new pack tests).

**Follow-ups (later phases):** more packs; maintainer `pack=<id>` scope on Modes 2/4 + "add pack" authoring command; PSG pack lane; per-pack `last_verified` refresh cadence.

---

### [Unreleased] — 2026-07-03 — Mode 4 R031/R032 adopted (DietrichGebert/ponytail)

**Source:** Mode 4 targeted scan on `DietrichGebert/ponytail` (2026-07-03, ~72k★), report R031–R035. Adopted the principle (minimal-code discipline), not the persona.

**Gap observed:** `code-simplification` was reactive only — no pre-code gate to stop over-building; Critic had no explicit over-engineering lens.

**Files changed:** `.agent/skills/code-simplification/SKILL.md` (minimalism ladder + safety floor + delete-list review mode), `.agent/skills/incremental-implementation/SKILL.md` (pre-build minimalism gate; renumbered steps), `.agent/agents/critic-agent.md` (`[DESIGN]` over-engineering/delete-list + "nine"→"ten" fix).

**Capability added:**
- R031 (P0): proactive minimalism ladder (need→reuse→stdlib→native→dep→one-line→minimum) with a hard safety floor (never cut validation/security/a11y).
- R032 (P1): over-engineering review lens — folded into Critic `[DESIGN]` (delete-list) + `code-simplify` diff mode.
- R033 deferred (opt-in debt ledger); R034 deferred (roadmap — skill-impact benchmark); R035 deferred (16-host portability).

**Validated:** Done — `npm test` green (220 tests; incl. "critic-agent.md has 10 review dimensions").

---

### [Unreleased] — 2026-07-03 — Mode 4 R025/R028/R029 adopted (thedesignproject/agent-skills)

**Source:** Mode 4 targeted scan on `thedesignproject/agent-skills` (2026-07-03), report R025–R030. Design/frontend skill pack — adopted low-effort, in-scope items.

**Gap observed:** (R025) no note that our SKILL.md modules work with the community `npx skills` installer; (R028) frontend-agent lacked a guardrail against homogeneous AI-generated UI; (R029) skill quality checklist had no "test before shipping" step.

**Files changed:** `docs/DISTRIBUTION.md` (community-installer note), `.agent/agents/frontend-agent.md` (anti "AI aesthetic" principle), `.agent/PLATFORM-HELP.md` (verify-before-ship checklist item).

**Capability added:**
- R025 (P1): `npx skills add` installer interop documented.
- R028 (P1): distinctive-design principle in frontend-agent (never over accessibility).
- R029 (P1): verify-before-ship in skill quality checklist (dry-run/subagent).
- R026 deferred (roadmap — AI-consumable design systems); R027 deferred (opt-in `prompt-engineering` skill); R030 deferred (PR/branch naming).

**Validated:** Done — `npm test` green (220 tests; docs/template content only, no manifest/count impact).

---

### [Unreleased] — 2026-07-03 — Mode 4 R019/R020/R021 adopted (VoltAgent/awesome-agent-skills)

**Source:** Mode 4 targeted scan on `VoltAgent/awesome-agent-skills` (2026-07-03), report R019–R024. Repo is a curated index of 1000+ skills — adopted its *meta-layer*, not the skills.

**Gap observed:** (R019) no single canonical multi-IDE skills-path reference; (R020) no checkable skill-quality bar for authors/maintainers; (R021) no security-vetting gate when ingesting/cherry-picking third-party skills.

**Files changed:** `docs/DISTRIBUTION.md` (8-tool portable-skills matrix + "vetting third-party skills" checklist), `.agent/PLATFORM-HELP.md` (skill quality checklist), `MAINTAINER/platform-ingest.md` (Step 1b security-vet gate).

**Capability added:**
- R019 (P0): cross-IDE skills-path matrix (project + global paths, docs links).
- R020 (P1): skill quality checklist — progressive disclosure (<100-tok meta / <500-line body), no absolute paths, scoped tools, 3rd-person keyworded description.
- R021 (P1): skill-ingest security vetting — quarantine on data exfiltration / obfuscation / prompt injection / absolute paths / blanket tools / untrusted source.
- R022/R023/R024: deferred (context taxonomy, skill-optimizer meta-skill, awesome-list as seed).

**Validated:** Done — `npm test` green (220 tests; docs-only change, no manifest/count impact).

---

### [Unreleased] — 2026-07-03 — Mode 4 R013/R016 adopted + R014 roadmapped (gemini-agent-skills)

**Source:** Mode 4 targeted scan on `saeed-vayghan/gemini-agent-skills` (2026-07-03), report R013–R018.

**Gap observed:** No UX-research/discovery skill for pre-build user-behavior work (had requirements clarification + WCAG audit only); no documented path to run platform skills under the Gemini CLI.

**Files changed:** `.agent/skills/ux-research/SKILL.md` (new), `AGENT-PLATFORM-MANIFEST.json` (skills_catalog + files), `.agent/bootstrap/profile-filter.mjs` (SKILL_ADD_DEPS), `.agent/QUICK-REF.md`, `.agent/QUICK-REF-lite.md`, `.agent/skills/using-platform/SKILL.md`, `AGENTS.md` (routing keywords), `.agent/playbooks/requirements-clarification.md` (Step 0 behavior-gap gate), `docs/DISTRIBUTION.md` (Gemini interop), `MAINTAINER/platform-governance-roadmap.md` (R014 backlog), `tests/apply-integration.test.mjs`.

**Trigger wiring (2026-07-03 follow-up):** skill was discoverable but not reachably triggered — added (B) `AGENTS.md` routing row (user research / usability / journey map / user drop-off → `ux-research`, expert frontend-agent) and (C) a formal **Step 0 behavior-gap gate** in `requirements-clarification` that routes to `ux-research` when the ambiguity is user behavior vs requirements. Slash command intentionally NOT added (kept optional).

**Capability added:**
- R013 (P0): optional `ux-research` skill — cherry-pick `--mode=add --add=skill:ux-research`; adapted from MIT source (Gemini "Query context manager" removed); not part of the 11-lifecycle count (domain add-on).
- R016 (P1): Gemini CLI `.gemini/skills/` interoperability documented.
- R014 (P1): multi-agent coordination roadmapped (not scheduled; tied to external coord server).
- R015/R017/R018: deferred (low impact / architectural — revisit next scan).

**Validated:** Done — `npm test` green (220 tests; new "optional ux-research skill deployed and in manifest catalog" assertion passes).

---

### [Unreleased] — 2026-07-03 — Mode 4 targeted repo scan (`repo=owner/name`)

**Gap observed:** Maintainers had no formal path to deep-read a **specific** GitHub repo for adoption ideas — only quarterly discovery search or manual Mode 3 file drops.

**Files changed:** `MAINTAINER/github-governance-scan.md`, `MAINTAINER/platform-maintainer-agent.md`, `MAINTAINER/GUIDE.md`, `MAINTAINER/scan-results/REPORT-SCHEMA.md`, `MAINTAINER/scan-results/registry.md`

**Capability added:** Targeted Mode 4 trigger skips Phase 1–2; runs Phase 3 deep analysis + Recommended adoption table; archives as `mode4/YYYY-MM-DD-targeted-<repo>-report.md`.

**Validated:** Done — targeted scan on `saeed-vayghan/gemini-agent-skills` (2026-07-03); report R013–R018 archived.

---

### [Unreleased] — 2026-06-09 — Mode 4 R001 + R005 + unified scan registry

**Source:** Mode 4 GitHub scan 2026-06-09 — addyosmani/agent-skills R001; obra/superpowers R005

**Files changed:** `context-engineering/SKILL.md`, `verification-before-completion/SKILL.md`, `/context` `/verify` commands, manifest, AGENTS routing, debug-pipeline, docs/tests/presentation, `MAINTAINER/scan-results/` (registry + schema), scan playbooks

**Rules/skills added:**
- R001: `context-engineering` skill — five-level hierarchy, confusion gates, selective loading
- R005: `verification-before-completion` skill — evidence checklist before declaring done
- Unified `MAINTAINER/scan-results/registry.md` — all maintainer modes read/write findings + actions

**Validated:** Yes — 218/218 `npm test`

---

### [Unreleased] — 2026-06-09 — Platform Sync Gate (PSG) — mandatory auto-sync after every change

**Gap observed:** Maintainer had to repeat "update manifests, docs, changelog, E2E, presentation" after every audit batch; agents stopped at template edits.
**Files changed:** `MAINTAINER/platform-maintainer-agent.md`, `MAINTAINER/GUIDE.md`, `MAINTAINER/web-audit.md`, `MAINTAINER/platform-ingest.md`, `MAINTAINER/github-governance-scan.md`, `CONTRIBUTING.md`, `.cursor/rules/platform-maintainer-sync.mdc`
**Rule added:** PSG — hard stop before "done"; automatic after Mode 1–4; PSG Report table required; counts invariant across all user-facing surfaces.
**Validated:** Pending — governance process change

---

### [Unreleased] — 2026-06-09 — Mode 2 web audit: F001–F004 + F013 implemented

**Source:** Mode 2 web audit 2026-06-09 — OWASP Top 10:2025, OWASP API2:2023, OWASP LLM cheat sheet, addyosmani/agent-skills web-performance-auditor

**Files changed:** `security-agent.md`, `devops-agent.md`, `backend-agent.md`, `CONVENTIONS.md`, `.agent/skills/web-performance-audit/SKILL.md`, `.claude/commands/webperf.md`, `.cursor/commands/webperf.md`, `AGENT-PLATFORM-MANIFEST.json`, `AGENTS.md`, `using-platform/SKILL.md`, `QUICK-REF.md`, `PLATFORM-HELP.md`, `apply-integration.test.mjs`, `global-install.test.mjs`

**Rules added:**
- OWASP 2025 A03: typosquatting checks, signed artifact promote, build infra hardening (devops + security)
- OWASP API2: batched auth rate limits, re-auth on sensitive account mutations (security)
- OWASP 2025 A10: fail-closed multi-step transactions, resource cleanup, no sensitive errors to client (CONVENTIONS + backend)
- LLM action screening + injection attempt logging (security)
- `/webperf` + `web-performance-audit` skill (agent-skills-shaped CWV audit)

**Validated:** Yes — 218/218 `npm test`

---

### [Unreleased] — 2026-06-11 — Mode 2/4 scan: skill packs + playbooks coverage

**Gap observed:** `addyosmani/agent-skills` (~55k stars) never surfaced in Mode 4 governance queries or Mode 2 web audit — discovered only via maintainer Mode 3 ingest. Scan vocabulary targeted orchestration/session/trust, not `SKILL.md`, lifecycle slash commands, or playbook libraries.

**Files changed:** `MAINTAINER/web-audit.md` (Phase 2F), `MAINTAINER/github-governance-scan.md` (skill-pack queries, seed repos, triage fast-path, Q9–Q10), `MAINTAINER/web-audit-report-template.md`, `MAINTAINER/governance-scan/scan-log.md`, `MAINTAINER/GUIDE.md`, `MAINTAINER/platform-maintainer-agent.md`

**Rule added:** N/A — maintainer scan playbook update, not consumer rule.

**Validated:** Pending — next quarterly scan should list seed repos + any new skill-pack hits.

---

### [2.41.0] — 2026-06-09 — User-facing docs + presentation sync (v2.41)

**Gap observed:** Post-ingest marketing, Cursor slash commands, and Plan handoff shipped in templates but FRAMEWORK tree still said 18 playbooks; beta deck test count 172; team-adoption STORY-PLAN still said 7-dimension Critic; E2E/global docs missing `.cursor/commands/`.

**Files changed:** README, FRAMEWORK-README, CHANGELOG, COPYING, MAINTAINER/GUIDE, `presentation/agent-platform-beta.html`, `presentation/team-adoption.html`, `presentation/STORY-PLAN.md`, `tests/E2E-TEST-PLAN.md`, PLATFORM-HELP

**Validated:** Yes — 192/192 `npm test`

---

### [2.41.0] — 2026-06-09 — Cursor `/` slash commands (parity with Claude Code)

**Gap observed:** Lifecycle commands shipped only in `.claude/commands/`; Cursor users expected `/spec`, `/ship`, etc. in `.cursor/commands/` per Cursor's slash-command discovery model.

**Files changed:** `.cursor/commands/*.md` (14 files), `AGENT-PLATFORM-MANIFEST.json` (repo + global scope), `.cursor/README.md`, `QUICK-REF.md`, `README.md`, `docs/DISTRIBUTION.md`, tests

**Rules added:** `/session-start`, `/session-end`, `/quick-ref`, `/platform-help`, `/spec`, `/audit`, `/review`, `/release`, `/ship`, `/implement`, caveman helpers — mirrored from Claude commands + Cursor-only `/implement` for plan handoff.

**Validated:** Yes — 192/192 `npm test`

---

### [2.41.0] — 2026-06-09 — Cursor Plan mode → implementation handoff

**Failure observed:** After Cursor Plan approval, agents treated implementation as a fresh task — skipped add-feature resume, no `▶` handoff line, Steps 3–5b gates inconsistent.

**Files changed:** `.cursor/rules/plan-mode-handoff.mdc`, `AGENTS.md`, `add-feature.md`, `QUICK-REF.md`, `PLATFORM-HELP.md`, `.cursor/README.md`, `AGENT-PLATFORM-MANIFEST.json`, `tests/apply-integration.test.mjs`

**Rules added:** On plan approval — re-read AGENTS.md, load add-feature, resume Step 3, mandatory status line `(resuming Step 3 — plan approved)`; routing row for "implement the plan" triggers.

**Validated:** Yes — 190/190 `npm test`

---

### [2.41.0] — 2026-06-09 — P1/P2 marketing: discovery, comparison, slash commands

**Gap observed:** README opener still said "nine playbooks"; FRAMEWORK-README lacked "when to use what" and skill-pack comparison; QUICK-REF had no key principles; PLATFORM-HELP buried value behind philosophy; no user CONTRIBUTING path; lifecycle not aligned across deck + docs; no `/spec` `/ship` parity with agent-skills lifecycle marketing.

**Files changed:** `README.md`, `AGENT-PLATFORM-FRAMEWORK-README.md`, `QUICK-REF.md`, `PLATFORM-HELP.md`, `CONTRIBUTING.md`, `docs/DISTRIBUTION.md`, `.claude/commands/{spec,ship,audit,review,release}.md`, `AGENT-PLATFORM-MANIFEST.json`, `presentation/agent-platform-beta.html`, `presentation/team-adoption.html`, `CHANGELOG.md`

**Rules added:** N/A (marketing/docs only)

**Validated:** Yes — 187/187 `npm test`

---

### [2.41.0] — 2026-06-11 — Mode 3 ingest: agent-skills P0 + P1 (addyosmani/agent-skills)

**Source:** https://github.com/addyosmani/agent-skills (MIT) — selective ingest, not wholesale copy.

**Gap observed:** Platform lacked anti-rationalization gates, source-driven rules, TDD pyramid/Beyoncé/DAMP, doubt review, deprecation/clarification playbooks, reference checklists, spec template, Hyrum's Law, change sizing, Chesterton's Fence, CWV measure-first, and accurate install banner.

**Files changed:**
- New: `deprecation.md`, `requirements-clarification.md`, `spec-outline.md`, `.agent/references/*` (5 files)
- Updated: playbooks, experts, `apply.js` (dynamic playbook count), `AGENTS.md`, `QUICK-REF.md`, user docs, presentations, `AGENT-PLATFORM-MANIFEST.json`, tests

**Rules added:** P0 rationalization + doubt + source-driven + deprecation; P1 spec Step 0, requirements-clarification, orchestration-patterns, Hyrum's Law, ~100-line commits, Chesterton's Fence, CWV step 4b, extended rationalization tables.

**Validated:** Yes — 187/187 `npm test`

---

### [2.41.0] — 2026-06-09 — User-facing docs sync (post-2.37 capabilities)

**Gap observed:** README, FRAMEWORK-README, QUICK-REF, PLATFORM-HELP, presentation deck, and maintainer commands still described v2.37 / 9 playbooks / 8-domain audit after v2.38–2.41 NFR/compliance releases.

**Files changed:** `README.md`, `AGENT-PLATFORM-FRAMEWORK-README.md`, `QUICK-REF.md`, `PLATFORM-HELP.md`, `presentation/agent-platform-beta.html`, `presentation/STORY-PLAN.md`, `MAINTAINER/GUIDE.md`, `platform-maintainer-agent.md`

**Rules added:**
- Maintainer command: `"Sync user-facing docs for vX.Y.Z"`
- Playbook inventory table (18 playbooks) in maintainer agent
- Presentation slide: Enterprise & Compliance (v2.38–2.41)

**Validated:** Pending

---

### [2.41.0] — 2026-06-09 — Compliance & maturity P0/P1 (SOC2/ISO/DORA evidence)

**Gap observed:** Platform had ISO 25010 NFRs and PRR but no compliance evidence mapping, DORA measurement, SOC 2/ISO 27001 SDLC review playbook, incident/MTTR tracking, or audit governance phase.

**Files changed:** `compliance-review.md`, `org-maturity-assessment.md`, `incident-postmortem.md`, `compliance-evidence-log.md`, `incident-log.md`, `production-readiness.md`, `nfr-definition.md`, `nfr-log.md`, `audit.md`, `AGENTS.md`, `CHECKLIST.md`, `architect-agent.md`, `docs-registry.md`, manifest

**Rules added:**
- Compliance evidence register with SOC 2 / ISO 27001 control crosswalk
- Compliance-review playbook with SDLC checklist + Critic gate
- PRR blocks on P0 evidence gaps and Critical CVE past SLA
- DORA NFR templates (change failure rate, MTTR) + incident log rollup
- Org maturity assessment (quarterly) + audit Phase 10
- Incident postmortem playbook feeding DORA metrics

**Validated:** Pending

---

### [2.40.0] — 2026-06-09 — UX golden rules in frontend-agent (Nielsen + Shneiderman)

**Gap observed:** `frontend-agent.md` covered WCAG 2.2 AA and async states but lacked actionable usability heuristics — feedback timing, consistency, affordance, error prevention, progressive disclosure, responsive/touch UX beyond target size.

**File changed:** `.agent/agents/frontend-agent.md`

**Rules added:**
- UX interaction principles section (visibility/feedback, consistency, affordance, error prevention, user control, clarity, responsive/touch)
- Done-when: empty-state CTA, UX heuristic verify pass, explicit UX checklist item

**Validated:** Pending

---

### [2.39.0] — 2026-06-11 — NFR P1: performance budget, observability, a11y audit, data query rules

**Gap observed:** P0 added NFR register and PRR but lacked implementation playbooks for performance budgets, observability instrumentation, and standalone a11y audits; data-agent manifest claimed N+1/index capabilities without agent-body rules; DevOps lacked container scan enforcement.

**Files changed:** `performance-budget.md`, `observability-setup.md`, `accessibility-audit.md`, `data-agent.md`, `devops-agent.md`, `AGENTS.md`, `CHECKLIST.md`, agent manifests

**Rules added:**
- Performance budget playbook with mandatory Critic PERFORMANCE
- Observability setup: correlation ID, health, metrics, OPERABILITY Critic
- Accessibility audit: axe + keyboard + WCAG Critic ACCESSIBILITY
- Data-agent: N+1, indexes, bounded reads, EXPLAIN
- DevOps: Trivy/Grype image scan BLOCKED on Critical CVEs

**Validated:** Pending

---

### [2.38.0] — 2026-06-11 — NFR playbooks: definition, production readiness, audit expansion

**Gap observed:** Platform strong on security/correctness but weak on measurable NFRs (performance budgets, observability, WCAG, PRR). `security-audit.md` was a stub; full audit had no frontend/performance/observability phases.

**Files changed:** `nfr-definition.md`, `production-readiness.md`, `security-audit.md`, `nfr-log.md`, `audit.md`, `frontend-agent.md`, `architect-agent.md`, `critic-agent.md`, `add-feature.md`, `AGENTS.md`, `CHECKLIST.md`, `docs-registry.md`

**Rules added:**
- NFR register with threshold + measure + verify path per row
- PRR playbook blocks deploy on P0 NFR / security / Critic failures
- WCAG 2.2 AA baseline in frontend-agent
- Critic `[ACCESSIBILITY]` + `[OPERABILITY]` dimensions
- add-feature Critic adds `[PERFORMANCE]` / `[ACCESSIBILITY]` when triggered

**Validated:** Pending — E2E with nfr-definition + production-readiness on platform-demo

---

### [2.37.0] — 2026-06-09 — E2E gaps: Critic enforcement, PowerShell commits, document-api playbook

**Failure observed:** Platform E2E on `platform-demo` (todo-app demo): bug-fix and add-feature completed without Critic (`CURRENT.md` `Critic reviewed: no`); session-end first commit failed on PowerShell `&&`; "document API" routed to docs-agent with `*(none)*` playbook — agent documented auth without implementing it; coverage not re-run at session end.

**Files changed:** `bug-fix.md`, `add-feature.md`, `document-api.md` (new), `AGENTS.md`, `session-end-shared.md`, `CHECKLIST.md`, `AGENT-PLATFORM-MANIFEST.json`

**Rules added:**
- Playbook Step 5b: MANDATORY `▶ Critic review —` output + `CURRENT.md` log; HARD RULE blocks done/session-end until complete
- Session-end Step 2a: Critic catch-up when app code changed and playbook skipped
- Session-end Step 2c: separate git commands — no `&&` (PowerShell-safe)
- Session-end Step 2e: run `{{TEST_RUNNER}}` + `{{COVERAGE_CMD}}` when app code changed
- New `document-api` playbook: spec follows code, mandatory Critic `[COMPLETENESS] [CORRECTNESS]`
- CHECKLIST: Quality gates section for Critic / Security / Step 5b

**Validated:** Pending — re-run E2E Phase 3–5 on upgraded `platform-demo`

---

### [2.22.0] — 2026-05-30 — Web audit: 15 OWASP/CWE/best-practice gaps closed across 6 expert agents

**Source:** Mode 2 web ecosystem audit against OWASP Top 10 (2021), OWASP API Security Top 10 (2023), CWE Top 25 (2024), OWASP LLM Top 10 (2025), industry best-practice searches.

**Files changed:** `security-agent.md`, `backend-agent.md`, `frontend-agent.md`, `devops-agent.md`, `test-agent.md`, `architect-agent.md`

**Rules added (15):**
- F001: TLS enforcement, encryption at rest, no tokens in browser storage (security-agent, frontend-agent)
- F002: Threat modelling as mandatory design-time step for auth/payment/bulk features (security-agent, architect-agent)
- F003: Property-level auth and mass-assignment allowlists (security-agent, backend-agent)
- F004: CSRF prevention — SameSite cookies, CSRF tokens, Origin/Referer validation (security-agent, frontend-agent)
- F005: Security audit logging — structured logs for auth failures, access denials, privilege changes (security-agent)
- F006: SBOM generation, artifact signing, dependency hash pinning (devops-agent)
- F007: SSRF prevention — URL allowlisting, private IP blocking for server-side fetches (security-agent, backend-agent)
- F008: LLM/prompt injection defence — indirect injection, least-privilege tool grants, system-prompt protection (security-agent)
- F009: Rate limiting extended to compute-heavy endpoints, not just auth (security-agent, backend-agent)
- F010: Deprecated/shadow API inventory and decommission timelines (security-agent, devops-agent)
- F011: Third-party API responses treated as untrusted input (backend-agent)
- F012: Mutation testing as supplement to coverage % for critical modules (test-agent)
- F013: Consumer-driven contract testing across service boundaries (test-agent)
- F014: CI runner OIDC short-lived credentials, isolated build environments, branch protection (devops-agent)
- F015: LLM output validation, system-prompt leakage prevention (security-agent)

**Validated:** Pending — E2E test with security audit playbook

---

### [2.28.0] — 2026-06-01 — User submission ingest: 7 rules from drone-systems AGENTS.md

**Source:** Mode 3 user submission ingest — AGENTS.md from a production Python/TypeScript drone defense monorepo (Pants build system). Language-agnostic rules extracted.

**Files changed:** `CONVENTIONS.md`, `docs-agent.md`, `critic-agent.md`

**Rules added (5 NEW):**
- I001: Never mask errors with silent fallbacks — fix root cause; a hidden failure is worse than a surfaced one (CONVENTIONS.md General)
- I002: Do not delete existing comments unless deleting the code they belong to (CONVENTIONS.md General)
- I003: Behavior-preserving refactors must be in separate commits from feature/fix changes (CONVENTIONS.md Git)
- I004: Create Mermaid diagrams for state machines, processes, data flows — not prose (docs-agent.md)
- I005: Note potential bugs found in adjacent code during review — report, do not fix without instruction (critic-agent.md Rules)

**Enhancements (2 ENHANCE):**
- I006: Keep inline docstrings current when modifying a method — same change, include params/return/purpose (docs-agent.md Writing quality)
- I007: Done-when gate: any function you modified must have an accurate inline docstring (docs-agent.md done-when)

**Skipped:** Smallest diff/match style/comments (DUPLICATE x3), ask clarifying questions (DUPLICATE), keep PRs small (DUPLICATE), all Pants/Docker/drone-specific items (PROJECT-SPECIFIC ~12 items)

**Validated:** Pending

---

### [2.26.0] — 2026-05-31 — User submission ingest: 23 production-proven rules across 5 expert files

**Source:** Mode 3 user submission ingest — 7 Cursor rule files (.mdc) from a Java/Spring monorepo. Rules extracted, deduplicated against existing platform, language-agnostic versions written to platform standard.

**Files changed:** `CONVENTIONS.md`, `architect-agent.md`, `backend-agent.md`, `docs-agent.md`, `test-agent.md`

**Rules added (18 NEW):**
- I001: Layer boundaries — controller→service only, service→repository only, no cross-domain shortcuts (architect-agent)
- I002: No cross-service code imports — services communicate via API only (architect-agent)
- I003: Mark temporary implementations with TODO + rationale in code (CONVENTIONS.md General)
- I006: Explicit doc update trigger list: API surface, domains, tech stack, integrations, patterns, limitations (docs-agent)
- I007: Explicit doc update skip list: formatting, comment-only, version bumps with no behavior change (docs-agent)
- I008: Docs content quality: one fact per bullet, no narration, no "TBD"/"coming soon" (docs-agent)
- I009: Commit body explains WHY — the diff shows what; body must capture reasoning (CONVENTIONS.md Git)
- I011: Never swallow exceptions silently — log with context, then rethrow (CONVENTIONS.md Error handling)
- I012: Return empty collections instead of null from list-returning functions (CONVENTIONS.md Error handling)
- I013: Model absent values explicitly — nullable wrappers for optional, throw-on-absent for required (CONVENTIONS.md Error handling)
- I014: REST paths use resource nouns — never verbs in paths (backend-agent REST design)
- I015: HTTP verb semantics: GET=read, POST=create, PUT=replace, PATCH=partial, DELETE=remove (backend-agent)
- I016: List endpoints return response wrapper with `items` field — never bare arrays (backend-agent)
- I017: Every endpoint has stable operationId in OpenAPI spec — never rename published operationId (backend-agent)
- I019: Consider CQRS — separate command from query controllers when domain has both (architect-agent)
- I020: Test every fetch-by-id for BOTH found AND missing cases (test-agent + done-when gate)
- I021: Use fluent assertion libraries — actionable failure messages without reading source (test-agent)
- I022: Prefer constructor injection over field/annotation injection (CONVENTIONS.md General)
- I023: Structured log format (format string + args) — never string concatenation in log calls (CONVENTIONS.md General)

**Enhancements (5 ENHANCE):**
- I004: "Read module context docs before any task" added to CONVENTIONS.md Agent behaviour
- I005: "Verify context docs match code before done" added to docs-agent done-when checklist
- I010: Commit subject ≤50 chars (tightened from ≤72 total) — CONVENTIONS.md Git
- I018: "Mark tech shortcuts with TODO in code, not only in CURRENT.md" — CONVENTIONS.md Agent behaviour

**Skipped:**
- Test naming convention (DUPLICATE — platform already has naming convention)
- Monorepo folder structure, no cross-service commits (PROJECT-SPECIFIC)
- Lombok, List.copyOf, BaseEntity, package naming (JAVA-SPECIFIC — not universally applicable)

**Validated:** Pending

---

## Log

### [v2.10.0] — 2026-05-29 — Critic agent + adversarial review in playbooks

**Failure observed:** Implementing agents approve their own work. A single agent writing AND reviewing has a blind spot — it reviews based on its own assumptions and misses edge cases, security implications, and test quality issues it introduced.
**Files changed:**
- `AGENT-PLATFORM-TEMPLATES/.agent/agents/critic-agent.md` (new)
- `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/bug-fix.md` (Step 5b added)
- `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/release.md` (Step 1b added)
- `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/add-feature.md` (Step 5b added)
**Rule added:** Critic agent with 6-dimension review (correctness, security, test quality, completeness, design, edge cases). Severity levels Critical/High/Medium/Low. Critical/High findings block task completion. Built into 3 playbooks as mandatory gates.
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Backend agent done-when gate for api-contracts.md

**Failure observed:** Backend agent shipped an endpoint without updating api-contracts.md. Downstream agents (Docs, Frontend) then worked from stale contracts.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/agents/backend-agent.md`
**Rule added:** Done-when checklist item: `api-contracts.md updated with new/changed endpoints`
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Security expert OWASP rules

**Failure observed:** Security expert had only 3 generic rules. JWT algorithm confusion attacks, SQL injection, file upload path traversal, and missing per-endpoint auth checks were not covered.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/agents/security-agent.md`
**Rule added:** Full OWASP-aligned rule set: JWT validation, SQL injection prevention, file upload validation, per-endpoint auth check, dependency audit requirement.
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Regression test quality gate

**Failure observed:** Agents wrote tests that passed before the fix was applied, meaning the tests were not actually regression tests — they tested the general area but not the specific bug.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/agents/test-agent.md`, `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/bug-fix.md`
**Rule added:** "Verify the test FAILS on unfixed code" as a mandatory verification step before applying the fix.
**Validated:** Pending

---

### [v2.7.0] — 2026-05-29 — Release playbook hard gate

**Failure observed:** Release playbook had "all tests passing" as a checklist item that could be checked without actually running tests. Agents marked it done without running the suite.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/release.md`
**Rule added:** "If any test fails: STOP. Do not proceed." with explicit STOP instruction. No bypass language allowed.
**Validated:** Pending

---

### [v2.2.0] — 2026-05-28 — Test enforcement added

**Failure observed:** Agents completed features and bug fixes without writing any tests. No enforcement mechanism existed.
**File changed:** `AGENT-PLATFORM-TEMPLATES/.agent/CONVENTIONS.md`, `AGENT-PLATFORM-TEMPLATES/.agent/CHECKLIST.md`, `AGENT-PLATFORM-TEMPLATES/.agent/agents/test-agent.md`
**Rule added:** Coverage gate, mandatory test types per trigger (unit/regression/contract), `untested = unfinished` rule.
**Validated:** Yes — test coverage improved measurably in tested consumer repos.

---

## Improvement backlog

Items identified but not yet implemented:

| Priority | Gap | Target file | Notes |
|---------|-----|------------|-------|
| ~~High~~ | ~~Frontend agent: no accessibility rules~~ | frontend-agent.md | **Done v2.38.0** — WCAG 2.2 AA |
| ~~High~~ | ~~security-audit stub~~ | security-audit.md | **Done v2.38.0** — structured audit |
| ~~High~~ | ~~Data agent: no query performance rules~~ | data-agent.md | **Done v2.39.0** |
| ~~Medium~~ | ~~accessibility-audit.md~~ | new playbook | **Done v2.39.0** |
| ~~Medium~~ | ~~performance-budget.md~~ | new playbook | **Done v2.39.0** |
| ~~Medium~~ | ~~observability-setup.md~~ | new playbook | **Done v2.39.0** |
| ~~Medium~~ | ~~DevOps container scanning~~ | devops-agent.md | **Done v2.39.0** |
| Medium | Docs agent: no broken link check | docs-agent.md | Add link validation before publish |
| Low | Architect agent: no event storming guidance | architect-agent.md | Add for domain-driven design projects |
| ~~Low~~ | ~~`compliance-review.md` (GDPR/HIPAA/SOC2)~~ | new playbook | **Done v2.41.0** — SOC2/ISO/GDPR + evidence log |
| Medium | `pentest.md` playbook | new playbook | ISO A.8.8 / SOC 2 CC4.1 — P2 from compliance audit |
