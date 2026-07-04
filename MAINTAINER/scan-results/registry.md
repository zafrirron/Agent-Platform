# Maintainer Scan Results — unified registry

> **Read this file before every maintainer scan** (Mode 1 internal audit, Mode 2 web audit, Mode 3 ingest, Mode 4 GitHub scan).
> Prevents duplicate findings, tracks dispositions, and feeds the next scan efficiently.

**Schema:** `MAINTAINER/scan-results/REPORT-SCHEMA.md`  
**Archives:** `MAINTAINER/scan-results/{mode}/YYYY-MM-DD-report.md`

| Mode | Playbook | ID prefix | Archive folder |
|------|----------|-----------|----------------|
| Internal platform audit | `platform-audit.md` | P001… | `internal/` |
| Web ecosystem audit | `web-audit.md` | F001 / E001… | `web-audit/` |
| User submission ingest | `platform-ingest.md` | I001… | `ingest/` |
| GitHub ecosystem scan | `github-governance-scan.md` | R001… | `mode4/` |
| Solution blueprint (Mode 5) | `solution-blueprint.md` | (delegates to build-pack/pack=) | `blueprint/` |

**Mode 4 variants:** discovery (quarterly search) · **targeted** (`repo=owner/name` — skip search, deep-read one repo for adoption ideas) · **pack-scoped** (`repo=owner/name pack=<id>` — grow a stack/domain pack brain; findings target `.agent/packs/<id>/`, not core)

**Mode 2 variants:** default (monthly web audit) · `scope=full` (quarterly horizon) · `pack=<id>` (freshen an existing pack) · `build-pack=<id>` (greenfield web-wide new-pack build) · **`url=<website>`** (deep-read ONE non-repo site for best practices / feature ideas; core lane, or `url=… pack=<id>` to route into any-axis pack — untrusted content + IP-safe: distil, never clone)

**Pack-scoped scans** (Mode 2 `build-pack=<id>` / `pack=<id>`, Mode 4 `repo=… pack=<id>`, or Mode 3 ingest `pack=<id>` / PACK-CANDIDATE findings) use `Scope: pack` · `Pack: <id>` in Meta and follow the **PSG pack lane** — see `platform-maintainer-agent.md`. Each also keeps a **per-pack dedup ledger** at `MAINTAINER/scan-results/packs/<id>.md` (schema: `packs/README.md`) — the pack-scoped mirror of this registry. Read that ledger before, and update it after, any pack-scoped scan so no source or finding is processed twice.

Legacy Mode 4 copies also remain at `MAINTAINER/governance-scan/archive/` — new runs write to **both** until consolidated.

---

## Quick index (newest first)

| Date | Mode | Findings | Implemented | Skipped | Deferred | Archive |
|------|------|----------|-------------|---------|----------|---------|
| 2026-07-04 | Mode 3 ingest — PACK-CANDIDATE (pack:domain-c4i) | 11 (C001–C011) | 8 (C001–C008) | 0 | 0 (3 already covered) | [packs/domain-c4i.md](packs/domain-c4i.md) |
| 2026-07-04 | Mode 2 `url=` site scan (pack:domain-c4i) | 7 (U001–U007) | 3 (U001–U003) | 1 (U006→adjacent) + 1 covered | 2 (U004/U005) | [packs/domain-c4i.md](packs/domain-c4i.md) |
| 2026-07-04 | Mode 2 web-scan enrich (pack:domain-c4i) | 4 (B018–B021) | 4 (all adopted) | 0 | 0 | [packs/domain-c4i.md](packs/domain-c4i.md) |
| 2026-07-04 | Mode 2 build-pack | 17 (B001–B017) | 17 (all adopted) | 0 | 6 adjacent candidates | [packs/domain-c4i.md](packs/domain-c4i.md) |
| 2026-07-03 | Mode 4 targeted | 6 (R036–R041) | 4 (R036–R039) | 0 | 2 (R040 roadmap; R041→R014) | [mode4/2026-07-03-targeted-opencode-report.md](mode4/2026-07-03-targeted-opencode-report.md) |
| 2026-07-03 | Mode 4 targeted | 5 (R031–R035) | 2 (R031, R032) | 0 | 3 (R033 opt-in; R034 roadmap; R035) | [mode4/2026-07-03-targeted-ponytail-report.md](mode4/2026-07-03-targeted-ponytail-report.md) |
| 2026-07-03 | Mode 4 targeted | 6 (R025–R030) | 3 (R025, R028, R029) | 0 | 3 (R026 roadmap; R027 opt-in; R030) | [mode4/2026-07-03-targeted-thedesignproject-agent-skills-report.md](mode4/2026-07-03-targeted-thedesignproject-agent-skills-report.md) |
| 2026-07-03 | Mode 4 targeted | 6 (R019–R024) | 3 (R019, R020, R021) | 0 | 3 (R022/R023/R024) | [mode4/2026-07-03-targeted-awesome-agent-skills-report.md](mode4/2026-07-03-targeted-awesome-agent-skills-report.md) |
| 2026-07-03 | Mode 4 targeted | 6 (R013–R018) | 2 (R013, R016) | 0 | 4 (R014 roadmapped; R015/R017/R018) | [mode4/2026-07-03-targeted-gemini-agent-skills-report.md](mode4/2026-07-03-targeted-gemini-agent-skills-report.md) |
| 2026-06-09 | Mode 4 | 12 | 2 (R001, R005) | 0 | 10 | [mode4/2026-06-09-report.md](mode4/2026-06-09-report.md) |
| 2026-06-09 | Mode 2 | 15 | 5 (F001–F004, F013) | 0 | 10 | *(see platform-improvements.md)* |
| 2026-06-11 | Mode 4 | — | scan keyword fix | — | — | governance-scan/scan-log |
| 2026-06-02 | Mode 4 | 8 repos | 14 phases | — | — | founding scan |

---

## [2026-07-04] — Mode 3 ingest (PACK-CANDIDATE) — internal C2 engineer UI/UX skill → pack:domain-c4i v1.3.0

**Source:** internal C2 engineering submission `c2_ui_ux_skill.md` (owned contribution — no external IP)  
**Ledger:** [packs/domain-c4i.md](packs/domain-c4i.md)

**Scan mode:** Mode 3 ingest, pack lane (PACK-CANDIDATE → `pack=domain-c4i`). Added an **operator-cognition & interaction-design** layer the pack under-covered (existing UX ref was layout/symbology/map/video).

### Findings (8 adopted, 3 already covered)
- **C001** SA pipeline (Perception/Comprehension/Projection), **C002** cognitive-load/widget limits (~5–7), **C003** Fitts' Law forward+reverse, **C004** stress single-tasking + sensible defaults, **C005** interruption task-state save, **C006** forgiveness + neutral destructive colours, **C007** alert fatigue/habituation (enhances §8/B010), **C008** UX-enforcing components + domain/UI state separation — **Adopted** → new `references/c4i-cognition.md` + `frontend-agent.overlay.md` rules + routing.
- **C009** dual-coding, **C010** agent transparency, **C011** graceful degradation — **already covered** (B007 / U002 / B006); wording aligned, external validation of the existing brain.

---

## [2026-07-04] — Mode 2 `url=` site scan — imarcgroup.com/top-c4isr-companies → pack:domain-c4i v1.2.0

**Target site:** https://www.imarcgroup.com/blog/top-c4isr-companies — proprietary market-research listicle (**inspiration-only**, low fidelity)  
**Ledger:** [packs/domain-c4i.md](packs/domain-c4i.md)

**Scan mode:** `url=` targeted site scan (pack lane). IP guard applied: distilled capability *themes* only; **no company list, market figures, or wording copied**; the platform builds capability packs, not vendor packs.

### Findings (breadth/gap signals — deepen later with standards scans)
- **U001** All-domain / multi-domain C2 (land/air/maritime/space/cyber; JADC2; joint interop by contract) — **Adopted** → capabilities §15 + architect/frontend overlays.
- **U002** Predictive decision support — AI recommendations with confidence/provenance, human-on/in-the-loop (models adjacent) — **Adopted** (enhances B010) → §16 + backend/frontend overlays.
- **U003** ISR collection management + PED (tasking→coverage/gap; Processing/Exploitation/Dissemination→intel products) — **Adopted** → §17 + backend overlay.
- **U004** Commander-level SA / big-data roll-up dashboards — **Deferred** (backlog).
- **U005** Unmanned-systems (UxV) C2 in the COP — **Deferred** (backlog).
- **U006** Cyber-ops C2 + Electronic Warfare — **Rejected for this pack → adjacent** `domain-cyber-ops` / `stack-ew`.
- **U007** Interoperability / integrated-systems — **COVERED** (B002).

**Note:** source is marketing-level, so adopted items are *directional capabilities*, not verified depth — flagged in the ledger to deepen via JADC2 (U001) and STANAG collection-management (U003) standards scans.

---

## [2026-07-04] — Mode 2 web-scan enrichment — pack:domain-c4i → v1.1.0 (live sources verified)

**Selection:** B018–B021 all adopted; ATAK-CIV license corrected GPL-3.0 (was mislabeled Apache-2.0 in the author-derived v1.0.0 draft)  
**Ledger:** [packs/domain-c4i.md](packs/domain-c4i.md)

**Scan mode:** pack-scoped web scan (live WebFetch/WebSearch)  
**Sources verified:** ATAK-CIV (GPL-3.0, archived) · FreeTAKServer (EPL-2.0) · MIL-STD-2525D/APP-6(D) (JCS) · MISB ST 0601/STANAG 4609 (NSG) · Cursor-on-Target base schema

### Findings (all adopted into the pack)
- **B018** MIL-STD-2525D SIDC depth → new `references/symbology-sidc.md` + frontend overlay (compose frame/icon/status/echelon; JMSML validation; echelon-offset & frame/icon pixel-grid pitfalls).
- **B019** CoT entity semantics (persistent uid, time/start/stale validity, **stale→confidence decay**, access/sharing marker) → backend + security overlays as *semantics* (wire format stays adjacent `stack-cot-tak`).
- **B020** MISB ST 0601 / STANAG 4609 KLV depth (sensor/platform geo-metadata → footprint/target-location; MPEG-2 TS mux; sync = designer responsibility) → `references/c4i-video.md` + frontend video rules.
- **B021** License verification/correction of both reference apps (ATAK **GPL-3.0** archived; FTS **EPL-2.0**).

**Note:** this is the enrichment that converts `domain-c4i` from *author-derived expert judgment* to *web-scan-verified, source-cited* brain. Adjacent candidates unchanged (still proposed, not built).

---

## [2026-07-04] — Mode 2 build-pack — domain-c4i (C2 / C4ISR) — first curated domain pack

**Selection:** all 17 findings (B001–B017) adopted into the new pack; 6 off-axis signals routed to Adjacent pack candidates  
**Ledger:** [packs/domain-c4i.md](packs/domain-c4i.md) (per-pack dedup ledger — pack-scoped mirror of this registry)

**Scan mode:** build-pack (greenfield, dry-run → real build)  
**Target pack:** `domain-c4i` — kind `domain`  
**Sources:** ATAK-CIV (ATAK-CIV/Apache-2.0, verify) · FreeTAKServer (EPL-2.0, verify) · public MIL-STD-2525 / NATO APP-6 standards

### Findings summary (domain = capabilities + UI/UX + C2 semantics only)

B001 COP single-truth · B002 C2 information model · B003 track management · B004 tasking/orders lifecycle · B005 DIL tolerance · B006 freshness & uncertainty · B007 symbology (2525/APP-6, no-color-alone) · B008 layout/perspectives/zones/menus · B009 map UX · B010 alerting & decision support · B011 multi-echelon releasability · B012 after-action replay/attribution · B013 collaboration chat/voice · B014 accessibility/ergonomics · B015 full-motion-video-in-app UX · B016 planning & COA · B017 sensor/report fusion capability.

**Adjacent pack candidates (Phase B2, not built this pass):** `stack-cot-tak`, `stack-dds`, `stack-geospatial`, `stack-fmv-decode`, `platform-tactical-edge`, `language-cpp`.

**Do not re-propose (routed off-axis on purpose):** CoT/TAK transport, DDS middleware, map-rendering engine, video codec/transport, edge HW/OS, C++ language — all belong to adjacent packs, never the domain brain.

---

## [2026-07-03] — Mode 4 targeted — anomalyco/opencode (6 findings: 4 implemented, 2 deferred)

**Selection:** R036 + R037 + R038 + R039 implemented (OpenCode as 5th framework); R040 deferred (roadmap); R041 merged into R014  
**Archive:** [mode4/2026-07-03-targeted-opencode-report.md](mode4/2026-07-03-targeted-opencode-report.md)

**Scan mode:** targeted  
**Target repo:** anomalyco/opencode (opencode.ai)  
**Repo type:** peer AI coding-agent runtime — native `AGENTS.md`/`CLAUDE.md`/skills, `.opencode/` (commands/agents/skills), `opencode.json`, multi-session (MIT)

### Findings summary

| ID | Title | Disposition |
|----|-------|-------------|
| R036 | Native AGENTS.md/CLAUDE.md/skills compat | **Implemented** — README + `docs/DISTRIBUTION.md` |
| R037 | First-class framework + lifecycle commands | **Implemented** — `.opencode/` + `--framework=opencode` |
| R038 | Critic exposed as `@critic` subagent | **Implemented** — `.opencode/agents/critic.md` |
| R039 | `opencode.json` instructions | **Implemented** — root config (non-clobber) + `.opencode/sync.md` |
| R040 | Map guards to `permission` config | Deferred (roadmap) |
| R041 | Parallel sessions → coordination | Merged into R014 |

**Recommended adoption P0:** R036 ✅ · **P1:** R037 ✅, R039 ✅ · **P2:** R038 ✅ · **Roadmap:** R040, R041→R014

**Do not re-propose:** R036, R037, R038, R039 (Implemented) · `.opencode/skills/` path (COVERED, R019)

---

## [2026-07-03] — Mode 4 targeted — DietrichGebert/ponytail (5 findings: 2 implemented, 3 deferred)

**Selection:** R031 + R032 implemented; R033 (opt-in) / R034 (roadmap) / R035 deferred  
**Archive:** [mode4/2026-07-03-targeted-ponytail-report.md](mode4/2026-07-03-targeted-ponytail-report.md)

**Scan mode:** targeted  
**Target repo:** DietrichGebert/ponytail  
**Repo type:** single-purpose minimal-code skill + 16-host plugin (MIT, ~72k★, v4.8.4)

### Findings summary

| ID | Title | Disposition |
|----|-------|-------------|
| R031 | Proactive minimalism ladder + safety floor | **Implemented** — `code-simplification` + `incremental-implementation` |
| R032 | Over-engineering review lens | **Implemented** — Critic `[DESIGN]` + `code-simplification` delete-list mode |
| R033 | Deferred-shortcut debt ledger | Deferred (opt-in) |
| R034 | Skill-impact benchmark methodology | Deferred (roadmap) |
| R035 | 16-host plugin-marketplace portability | Deferred |

**Recommended adoption P0:** R031 ✅ · **P1:** R032 ✅ · **Opt-in:** R033 · **Roadmap:** R034

---

## [2026-07-03] — Mode 4 targeted — thedesignproject/agent-skills (6 findings: 3 implemented, 3 deferred)

**Selection:** R025 + R028 + R029 implemented; R027 deferred (opt-in skill); R026 deferred (roadmap); R030 deferred  
**Archive:** [mode4/2026-07-03-targeted-thedesignproject-agent-skills-report.md](mode4/2026-07-03-targeted-thedesignproject-agent-skills-report.md)

**Scan mode:** targeted  
**Target repo:** thedesignproject/agent-skills  
**Repo type:** skill pack (17 design/frontend skills, `npx skills add`, MIT, ~36★)

### Findings summary

| ID | Title | Disposition |
|----|-------|-------------|
| R025 | `npx skills add` installer interop | **Implemented** — `docs/DISTRIBUTION.md` community-installer note |
| R026 | AI-consumable design systems | Deferred (roadmap) |
| R027 | prompt-engineer skill | Deferred (opt-in skill) |
| R028 | Distinctive frontend-design (anti "AI aesthetic") | **Implemented** — `frontend-agent.md` UX principle |
| R029 | Subagent skill-testing before deployment | **Implemented** — `PLATFORM-HELP.md` quality checklist |
| R030 | PR/branch naming convention | Deferred |

**Recommended adoption P1:** R025 ✅, R028 ✅, R029 ✅ · **Opt-in:** R027 (prompt-engineer) · **Roadmap:** R026

---

## [2026-07-03] — Mode 4 targeted — VoltAgent/awesome-agent-skills (6 findings: 3 implemented, 3 deferred)

**Selection:** R019 + R020 + R021 implemented; R022/R023/R024 deferred  
**Archive:** [mode4/2026-07-03-targeted-awesome-agent-skills-report.md](mode4/2026-07-03-targeted-awesome-agent-skills-report.md)

**Scan mode:** targeted  
**Target repo:** VoltAgent/awesome-agent-skills  
**Repo type:** curated skill index (1000+ skills, 8-IDE compatible, MIT) — discovery source, not a framework

### Findings summary

| ID | Title | Disposition |
|----|-------|-------------|
| R019 | Cross-IDE skills-path matrix (8 tools) | **Implemented** — `docs/DISTRIBUTION.md` matrix |
| R020 | Skill Quality Standards checklist | **Implemented** — `PLATFORM-HELP.md` skill quality checklist |
| R021 | Skill-ingest security-vetting checklist | **Implemented** — DISTRIBUTION vetting checklist + `platform-ingest.md` Step 1b gate |
| R022 | Context-degradation failure taxonomy | Deferred |
| R023 | `skill-optimizer` meta-skill | Deferred (roadmap) |
| R024 | Curated catalog as Mode 4 discovery source | Deferred |

**Recommended adoption P0:** R019 (cross-IDE path matrix) ✅ · **P1:** R020 (quality checklist) ✅, R021 (ingest security vetting) ✅

---

## [2026-07-03] — Mode 4 targeted — gemini-agent-skills (6 findings: 2 implemented, 1 roadmapped, 3 deferred)

**Selection:** R013 + R016 implemented; R014 roadmapped; R015/R017/R018 deferred  
**Archive:** [mode4/2026-07-03-targeted-gemini-agent-skills-report.md](mode4/2026-07-03-targeted-gemini-agent-skills-report.md)

**Scan mode:** targeted  
**Target repo:** saeed-vayghan/gemini-agent-skills  
**Entry skill:** ux-researcher

### Findings summary

| ID | Title | Disposition |
|----|-------|-------------|
| R013 | UX researcher persona skill | **Implemented** — `.agent/skills/ux-research/` (optional, cherry-pick) |
| R014 | Multi-agent coordinator patterns | **Roadmapped** — `platform-governance-roadmap.md` backlog |
| R015 | Context management RAG vs file model | Deferred |
| R016 | Gemini `.gemini/skills/` install path | **Implemented** — `docs/DISTRIBUTION.md` interop section |
| R017 | JSON context query assets | Deferred |
| R018 | 120-persona library model | Deferred |

**Recommended adoption P0:** R013 (ux-research skill) ✅ · **P1:** R014 (coord server roadmap) 📋, R016 (Gemini docs) ✅

**Do not re-propose:** R001, R005

---

## [2026-06-09] — Mode 4 — R001 + R005 implemented

**Selection:** `Add R001, R005`  
**Archive:** [mode4/2026-06-09-report.md](mode4/2026-06-09-report.md)

### Actions taken

| ID | Action | Platform target | Status |
|----|--------|-----------------|--------|
| R001 | Implemented | `.agent/skills/context-engineering/SKILL.md` + `/context` | Done |
| R005 | Implemented | `.agent/skills/verification-before-completion/SKILL.md` + `/verify` | Done |
| R002–R004, R006–R012 | Deferred | — | Pending maintainer selection |

### Next scan hints

- Re-diff `addyosmani/agent-skills` for skills beyond R001 (R002 backlog)
- Do not re-propose R001/R005 — mark COVERED
- Vary queries toward observability + rollback patterns

---

## [2026-06-09] — Mode 2 web audit — F001–F004 + F013

**Archive:** `platform-improvements.md` + CHANGELOG [Unreleased]  
**Implemented:** F001 (A03 supply chain), F002 (API2 auth), F003 (A10 fail-closed), F004 (LLM screening), F013 (`/webperf`)  
**Deferred:** F005–F012, F014–F015 — see backlog in `platform-improvements.md`

---

## [2026-06-11] — Mode 4 keyword remediation

**Not a full scan** — post-mortem after missing agent-skills. Updated scan queries + web-audit Phase 2F. See `governance-scan/scan-log.md`.

---

## [2026-06-02] — Founding Mode 4 scan

8 repos → platform governance roadmap Phases 1A–6B. See `MAINTAINER/platform-governance-roadmap.md`.

---

*(New entries prepend above this line)*
