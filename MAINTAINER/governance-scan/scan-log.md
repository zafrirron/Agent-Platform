# Governance Scan Log

Running log of all Mode 4 GitHub agent ecosystem scans (coordination + skill packs).
**Unified registry (all modes):** `MAINTAINER/scan-results/registry.md`  
Full reports: `MAINTAINER/scan-results/mode4/` + legacy `MAINTAINER/governance-scan/archive/YYYY-MM-DD/scan-report.md`

---

## [2026-07-03] — Mode 4 targeted — DietrichGebert/ponytail

**Scan mode:** targeted  
**Queries used:** N/A (targeted)  
**Findings:** 5 (R031–R035) — 2 Implemented, 3 Deferred  
**Archive:** [../scan-results/mode4/2026-07-03-targeted-ponytail-report.md](../scan-results/mode4/2026-07-03-targeted-ponytail-report.md)

| Repo | Stars | Key finding | Status |
|------|------:|-------------|--------|
| DietrichGebert/ponytail | 72,000 | Proactive minimalism ladder + safety floor (R031); over-engineering review (R032) | R031/R032 Implemented; R033/R034/R035 Deferred |

**Next scan:** very active (v4.8.4); re-check for new commands / measurement harness. Adopt the ladder principle into `code-simplification`, not the persona.

---

## [2026-07-03] — Mode 4 targeted — thedesignproject/agent-skills

**Scan mode:** targeted  
**Queries used:** N/A (targeted)  
**Findings:** 6 (R025–R030) — 3 Implemented, 3 Deferred  
**Archive:** [../scan-results/mode4/2026-07-03-targeted-thedesignproject-agent-skills-report.md](../scan-results/mode4/2026-07-03-targeted-thedesignproject-agent-skills-report.md)

| Repo | Stars | Key finding | Status |
|------|------:|-------------|--------|
| thedesignproject/agent-skills | 36 | `npx skills` interop (R025); anti "AI aesthetic" frontend (R028); subagent skill-testing (R029) | R025/R028/R029 Implemented; R026/R027/R030 Deferred |

**Next scan:** design-focused pack; re-check only if it adds coordination/lifecycle. Mine prompt-engineer / agentic-design-systems on demand.

---

## [2026-07-03] — Mode 4 targeted — VoltAgent/awesome-agent-skills

**Scan mode:** targeted  
**Queries used:** N/A (targeted)  
**Findings:** 6 (R019–R024) — 3 Implemented, 3 Deferred  
**Archive:** [../scan-results/mode4/2026-07-03-targeted-awesome-agent-skills-report.md](../scan-results/mode4/2026-07-03-targeted-awesome-agent-skills-report.md)

| Repo | Stars | Key finding | Status |
|------|------:|-------------|--------|
| VoltAgent/awesome-agent-skills | high | Cross-IDE path matrix (R019); skill quality checklist (R020); skill-ingest security vetting (R021) | R019/R020/R021 Implemented; R022/R023/R024 Deferred |

**Next scan:** quarterly re-check for new *meta* sections (quality/security tooling); mine specific packs on demand only — do not ingest 1000-skill breadth.

---

## [2026-07-03] — Mode 4 targeted — saeed-vayghan/gemini-agent-skills

**Scan mode:** targeted  
**Queries used:** N/A (targeted)  
**Findings:** 6 (R013–R018) — all Pending  
**Archive:** [../scan-results/mode4/2026-07-03-targeted-gemini-agent-skills-report.md](../scan-results/mode4/2026-07-03-targeted-gemini-agent-skills-report.md)

| Repo | Stars | Key finding | Status |
|------|------:|-------------|--------|
| saeed-vayghan/gemini-agent-skills | 29 | UX researcher skill (R013); multi-agent coord (R014); Gemini path (R016) | Pending |

---

## [2026-06-09] — Mode 4 scan (10 repos, 12 findings)

**Queries used:** `topic:agent-skills` · `agent skills SKILL.md in:readme` · `slash commands spec plan build agent in:readme` · `AGENTS.md skills commands in:readme` · `claude code skills slash commands in:readme` · `multi-agent coordination framework in:readme` · `agent orchestration session handoff in:readme` · `agent manifest capabilities routing in:readme` · `AI agent quality gate workflow in:readme` · `playbook quality gate AI agent workflow in:readme`

**Repos analysed:**

| Repo | Stars | Key finding | Status |
|------|------:|-------------|--------|
| addyosmani/agent-skills | 55,309 | `context-engineering` ingested (R001) | R001 Implemented |
| obra/superpowers | 225,132 | verification-before-completion (R005) | R005 Implemented; R003–R004 Deferred |
| github/spec-kit | 111,570 | `/speckit.constitution` first-class artifact | Pending R010 |
| Fission-AI/OpenSpec | 54,366 | Per-change folder artifact model | Pending R011 |
| OthmanAdi/planning-with-files | 23,061 | File plans + completion gate v3 | Pending R006 |
| numman-ali/openskills | 10,383 | Universal skills XML in AGENTS.md | Pending R007 |
| muratcankoylan/Agent-Skills-for-Context-Engineering | 16,494 | Harness engineering + router benchmarks | Pending R008, R009 |
| wshobson/agents | 36,645 | plugin-eval quality certification | Pending R012 |
| builderz-labs/mission-control | 5,279 | Dashboard orchestration — shallow, no finding | Skipped |

**Findings summary:**
- R001: context-engineering skill — **Implemented** 2026-06-09
- R002: agent-skills P3 parity — Deferred
- R003: subagent-driven-development — Deferred
- R004: git worktree isolation — Deferred
- R005: verification-before-completion — **Implemented** 2026-06-09
- R006: planning-with-files completion gate — Deferred
- R007: openskills interoperability — Deferred
- R008: harness-engineering skill — Deferred
- R009: routing benchmark harness — Deferred
- R010: constitution command — Deferred
- R011: per-change artifact folders — Deferred
- R012: plugin-eval certification — Deferred

**Archive:** `MAINTAINER/governance-scan/archive/2026-06-09/scan-report.md` · **Registry:** `MAINTAINER/scan-results/mode4/2026-06-09-report.md`

**Next scan:** Vary toward agent observability, rollback/undo, multi-model consensus gates. Re-check DashClaw and nobulex after 2026-12-02. Diff `addyosmani/agent-skills` via web-audit Phase 2F monthly.

---

## [2026-06-11] — Scan keyword fix (agent-skills miss post-mortem)

**Issue:** `addyosmani/agent-skills` (~55k stars) never appeared in founding scan or Mode 4 queries.

**Root cause:** Queries targeted governance/orchestration vocabulary; skill packs use "skills", "SKILL.md", lifecycle slash commands. Triage favored session handoff over playbook libraries. Deep-read file patterns omitted `skill`/`playbook`/`commands`.

**Remediation:** Updated `github-governance-scan.md` (skill-pack query block, seed repos, triage fast-path, Q9–Q10) and `web-audit.md` Phase **2F** (monthly skill-pack diff).

**Disposition:** Repo ingested manually via Mode 3 — see `MAINTAINER/ingest/agent-skills-p0-SOURCES.md`. Next Mode 4 run: include seed-repo diff; do not re-ingest wholesale.

**Next scan queries to rotate:** `topic:agent-skills`, `"slash commands" "/spec" "/plan"`, `"rationalization" table skill agent`, `"AGENTS.md" skills commands`.

---

## [2026-06-02] — Founding scan (8 repos, pre-roadmap)

**Method:** Manual GitHub search (pre-Mode 4 playbook)

**Repos analysed:**
| Repo | Key finding | Implemented as |
|------|-------------|----------------|
| faramesh-core | Session lifecycle coordination | Phase 3A/3B session finality |
| edictum | Policy enforcement patterns | Phase 4A amendment proposals |
| DashClaw | Five-state finality + idempotency keys | Phase 2A + 2B |
| deterministic-agent-control-protocol | Deterministic routing + audit trails | Phase 4B approval routing |
| JSON-Agents/Standard | Machine-readable agent manifests + routing_keywords | Phase 1A manifests |
| garda-agent-orchestrator | Cross-agent orchestration patterns | Phase 3B/3C session coordination |
| traccia-py | Session tracing + step manifests | Phase 2A step_manifest |
| nobulex | Reputation vectors + trust scoring | Phase 1B + 5A/5B reputation |

**Features implemented:** All 14 governance phases (PW1 + 1A–6B) — see MAINTAINER/platform-governance-roadmap.md

**Next scan:** Vary queries toward agent observability, rollback/undo patterns, multi-model consensus gates. Re-check DashClaw and nobulex in 6 months for new features.

---

*(Newer scans prepended above this line)*
