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

**Mode 4 variants:** discovery (quarterly search) · **targeted** (`repo=owner/name` — skip search, deep-read one repo for adoption ideas)

Legacy Mode 4 copies also remain at `MAINTAINER/governance-scan/archive/` — new runs write to **both** until consolidated.

---

## Quick index (newest first)

| Date | Mode | Findings | Implemented | Skipped | Deferred | Archive |
|------|------|----------|-------------|---------|----------|---------|
| 2026-07-03 | Mode 4 targeted | 6 (R013–R018) | 2 (R013, R016) | 0 | 4 (R014 roadmapped; R015/R017/R018) | [mode4/2026-07-03-targeted-gemini-agent-skills-report.md](mode4/2026-07-03-targeted-gemini-agent-skills-report.md) |
| 2026-06-09 | Mode 4 | 12 | 2 (R001, R005) | 0 | 10 | [mode4/2026-06-09-report.md](mode4/2026-06-09-report.md) |
| 2026-06-09 | Mode 2 | 15 | 5 (F001–F004, F013) | 0 | 10 | *(see platform-improvements.md)* |
| 2026-06-11 | Mode 4 | — | scan keyword fix | — | — | governance-scan/scan-log |
| 2026-06-02 | Mode 4 | 8 repos | 14 phases | — | — | founding scan |

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
