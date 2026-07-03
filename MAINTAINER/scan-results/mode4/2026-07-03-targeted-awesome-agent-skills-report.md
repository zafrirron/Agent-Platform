# Mode 4 Targeted Scan — 2026-07-03 — VoltAgent/awesome-agent-skills

## Meta
- **Mode:** mode4
- **Scan scope:** targeted
- **Trigger:** `Read MAINTAINER/github-governance-scan.md and execute it. repo=https://github.com/VoltAgent/awesome-agent-skills`
- **Target repo:** VoltAgent/awesome-agent-skills
- **Source read:** repo README (uploaded snapshot, ~1900 lines / 406 commits, main)
- **Queries / sources:** N/A (targeted)
- **Platform version:** 2.42.1
- **Prior registry read:** R001–R018 dispositions honored; no re-propose of Implemented R001/R005/R013/R016

## Summary

| Metric | Count |
|--------|------:|
| Findings total | 6 |
| Implemented | 3 |
| Skipped | 0 |
| Deferred | 3 |
| Pending | 0 |
| COVERED (no finding) | 7 |

> Dispositions applied 2026-07-03: R019 + R020 + R021 **Implemented**; R022/R023/R024 **Deferred** (nice-to-have / roadmap — revisit next scan).

### Scan mode: targeted
### Target repo: https://github.com/VoltAgent/awesome-agent-skills
### Repo type: **curated skill index (awesome list)** — 1000+ skills, 8-IDE compatible, MIT
### Stars: high-signal community list (VoltAgent) · License: MIT

---

## Repo character (why most content is NOT a finding)

This is a **discovery catalog**, not a runnable framework: it lists 1000+ third-party `SKILL.md` skills from vendors (Anthropic, Stripe, Vercel, Cloudflare, Trail of Bits, Sentry, NVIDIA, …) and community authors, with an install-path table and quality/security guidance. The *individual skills* are vendor/domain-specific (Stripe SDK, n8n, CUDA-Q, WordPress, etc.) and out of scope to adopt wholesale (same rationale as gemini R018). The **platform-worthy signal is the meta-layer**: the cross-IDE path matrix, quality standards, security vetting, and its value as a seed/discovery source.

---

## Q1–Q10 summary

| # | Answer (short) |
|---|----------------|
| Q1 | No session lifecycle — it's an index, skills activate per host IDE |
| Q2 | No multi-agent coordination — catalog only |
| Q3 | No routing — host IDE matches skill by description keywords |
| Q4 | No trust/reputation scoring (points to external "Agent Trust Hub", "Snyk Skill Security Scanner") |
| Q5 | **Skill Quality Standards** section = quality bar (progressive disclosure, scoped tools, no absolute paths) |
| Q6 | N/A (no execution) |
| Q7 | No manifests; relies on each skill's own `SKILL.md` frontmatter |
| Q8 | **Cross-IDE skills-path matrix (8 tools)**; curated 1000+ catalog; skill-security notice; skill-quality criteria |
| Q9 | **Missing/weaker:** canonical multi-IDE path docs, skill quality checklist, skill-ingest security vetting, context-degradation taxonomy |
| Q10 | Install = copy `SKILL.md` into the host IDE's skills path; not npx/cherry-pick — document interoperability + treat as discovery source |

---

## Recommended adoption — VoltAgent/awesome-agent-skills

| Priority | What | Our target | Effort |
|----------|------|------------|--------|
| **P0** | **Cross-IDE skills-path matrix** (Antigravity/Claude/Codex/Cursor/Gemini/Copilot/OpenCode/Windsurf, project + global paths) | Extend `docs/DISTRIBUTION.md` interop section (builds on R016) | Low (docs) |
| **P1** | **Skill Quality Standards checklist** (progressive disclosure <100-tok meta / <500-line body, no absolute paths, scoped tools, 3rd-person keyworded description) | Add to skill-authoring guidance (`PLATFORM-HELP.md` 7-step anatomy + MAINTAINER skill authoring) | Low |
| **P1** | **Skill-ingest security-vetting checklist** (prompt injection, tool poisoning, hidden payloads; review before install) | New checklist in Mode 3 ingest + cherry-pick docs; cross-link `security-audit` | Low–Med |
| **P2** | **Context-degradation failure taxonomy** (lost-in-middle, poisoning, distraction, clash) | Strengthen `context-engineering/SKILL.md` confusion gates | Low |
| **P2** | **`skill-optimizer` meta-skill** (diagnose/optimize SKILL.md via static analysis) | Optional maintainer tool / roadmap — aligns with PSG + quality bar | Med |
| **Defer** | Adopt the 1000+ vendor/domain skills | Out of scope — vendor/domain sprawl; cherry-pick only on demand | — |

**Install pattern to copy:** copy a skill's `SKILL.md` into the host IDE's skills path (see matrix). Treat this repo as a **discovery source**, not a dependency.

**Already COVERED:** lifecycle skills (`/spec`→`/ship`), `context-engineering` (R001), `verification-before-completion` (R005), `ux-research` (R013), `web-performance-audit` + addyosmani web-quality ingest, TDD (`test-driven-development` + test-agent), Gemini interop (R016).

**Do not adopt wholesale:** vendor SDK skills (Stripe/Supabase/Auth0/…), TestMu 45+ test-framework skills (domain-specific — our TDD skill + experts cover the *approach*), and the 1000-skill breadth (persona/vendor sprawl — same call as gemini R018).

---

## Findings

## R019 — awesome-agent-skills: Cross-IDE skills-path matrix (8 tools)

Source: https://github.com/VoltAgent/awesome-agent-skills — "Skills Paths for Other AI Coding Assistants"

Observation: Canonical project + global skill install paths for 8 hosts — Antigravity `.agent/skills/` (global `~/.gemini/antigravity/skills/`), Claude `.claude/skills/`, Codex `.agents/skills/`, Cursor `.cursor/skills/`, Gemini `.gemini/skills/`, GitHub Copilot `.github/skills/`, OpenCode `.opencode/skills/`, Windsurf `.windsurf/skills/` — each with official docs link.

Platform gap: Our DISTRIBUTION documents Cursor/Claude/Codex/Antigravity + the new Gemini interop (R016), but has no single canonical path matrix and omits Copilot/OpenCode/Windsurf.

Classification: STRENGTHEN

Suggested path: Extend the `docs/DISTRIBUTION.md` Gemini interop section into a full "portable skills — where each IDE loads them" matrix.

Effort: Low | Impact: Medium

Disposition: **Implemented** (2026-07-03) — `docs/DISTRIBUTION.md` "Portable skills — where each IDE loads them" 8-tool matrix (Antigravity/Claude/Codex/Cursor/Gemini/Copilot/OpenCode/Windsurf, project + global paths + docs links), replacing the Gemini-only section.

---

## R020 — awesome-agent-skills: Skill Quality Standards checklist

Source: https://github.com/VoltAgent/awesome-agent-skills — "Skill Quality Standards / Quality Criteria"

Observation: Explicit authoring bar — description in third person stating *what* + *when* with matchable keywords; progressive disclosure (top-level metadata <~100 tokens, body <500 lines, load big resources on demand); no absolute machine paths ($HOME/$PROJECT_ROOT); scoped tools (no blanket `tools:["*"]`).

Platform gap: We have a 7-step skill anatomy in `PLATFORM-HELP.md` but no crisp, checkable quality checklist for authors/maintainers.

Classification: STRENGTHEN

Suggested path: Add a "Skill quality checklist" to `PLATFORM-HELP.md` skill anatomy + MAINTAINER skill-authoring notes; apply retroactively to `ux-research` etc.

Effort: Low | Impact: Medium

Disposition: **Implemented** (2026-07-03) — "Skill quality checklist" added to `PLATFORM-HELP.md` Extending section (third-person keyworded description, progressive disclosure <100-tok meta / <500-line body, no absolute paths, scoped tools) with a pointer to the ingest security checklist.

---

## R021 — awesome-agent-skills: Skill-ingest security-vetting checklist

Source: https://github.com/VoltAgent/awesome-agent-skills — "Security Notice"

Observation: Warns that curated ≠ audited; skills can carry prompt injection, tool poisoning, hidden malware payloads, unsafe data handling. Recommends reviewing source and using scanners (Snyk Skill Security Scanner, Agent Trust Hub) before install.

Platform gap: Mode 3 ingest and `--mode=add` cherry-pick have no explicit security-vetting gate for third-party skills; `security-audit` playbook targets app code, not imported skills.

Classification: FEATURE

Suggested path: Add a "vet before ingest" checklist to Mode 3 ingest docs + cherry-pick section (read source, no absolute paths, scoped tools, no data exfiltration, no hidden network calls); cross-link `security-audit`. Reinforces the platform's no-data-leaves-machine principle.

Effort: Low–Medium | Impact: Medium

Disposition: **Implemented** (2026-07-03) — user-facing "Vetting third-party skills" checklist in `docs/DISTRIBUTION.md`; maintainer-facing **Step 1b security-vet gate** added to `MAINTAINER/platform-ingest.md` (quarantine on exfiltration / obfuscation / prompt injection / absolute paths / blanket tools / untrusted source).

---

## R022 — awesome-agent-skills: Context-degradation failure taxonomy

Source: https://github.com/VoltAgent/awesome-agent-skills — Community › Context Engineering (`muratcankoylan/context-degradation`, `context-compression`, `memory-systems`)

Observation: Names concrete context-failure modes — lost-in-middle, poisoning, distraction, clash — plus compression/compaction/masking/caching strategies.

Platform gap: Our `context-engineering` skill (R001) covers hierarchy reload + confusion gates but doesn't enumerate the failure taxonomy that triggers a reload.

Classification: STRENGTHEN

Suggested path: Add a "context failure modes" subsection to `context-engineering/SKILL.md` so the `/context` gate has explicit symptoms to detect.

Effort: Low | Impact: Low

Disposition: **Deferred** (2026-07-03) — nice-to-have; revisit when touching `context-engineering` next.

---

## R023 — awesome-agent-skills: `skill-optimizer` meta-skill

Source: https://github.com/VoltAgent/awesome-agent-skills — Community (`hqhq1025/skill-optimizer`, `mcollina/skills`)

Observation: A meta-skill that diagnoses and optimizes `SKILL.md` files using real session data + research-backed static analysis; cross-IDE.

Platform gap: We have PSG + a quality bar but no tooling/skill to audit our own skill modules for the quality criteria (R020).

Classification: FEATURE

Suggested path: Optional maintainer meta-skill or lint step that checks skills against R020 criteria; roadmap — pairs with R020.

Effort: Medium | Impact: Medium

Disposition: **Deferred** (2026-07-03) — roadmap; now that R020 defines the criteria, a future lint/meta-skill can check against them.

---

## R024 — awesome-agent-skills: Curated catalog as discovery source

Source: https://github.com/VoltAgent/awesome-agent-skills — repo purpose (1000+ curated, team-published skills)

Observation: A community-maintained, quality-gated index of team-published skills across 8 IDEs — a high-signal map of what vendors ship as skills.

Platform gap: Mode 4 seed-repo list doesn't include a curated aggregator; users have no pointer to "where to find more skills" beyond our catalog.

Classification: ARCHITECTURE (process)

Suggested path: Add `VoltAgent/awesome-agent-skills` to Mode 4 seed repos (discovery baseline) and reference it in DISTRIBUTION as an external skill catalog (with the R021 vetting caveat).

Effort: Low | Impact: Low

Disposition: **Deferred** (2026-07-03) — low impact; the DISTRIBUTION matrix already credits the repo. Add to Mode 4 seed list on next scan-playbook edit.

---

## COVERED

| Capability | Our equivalent |
|------------|----------------|
| Lifecycle skills / slash commands | `/spec`→`/ship`, 11 lifecycle skills |
| Context reload | `context-engineering` `/context` (R001) |
| Verification / evidence gates | `verification-before-completion` `/verify` (R005) |
| UX research / design | `ux-research` (R013) + `accessibility-audit` |
| Web performance / quality | `web-performance-audit` + addyosmani ingest |
| Test automation approach | `test-driven-development` + test-agent |
| Gemini `.gemini/skills/` interop | `docs/DISTRIBUTION.md` (R016) |

---

## Quick-pick by effort + impact

| Finding | Title | Effort | Impact |
|---------|-------|--------|--------|
| R019 | Cross-IDE skills-path matrix | Low | Medium |
| R020 | Skill quality checklist | Low | Medium |
| R021 | Skill-ingest security vetting | Low–Med | Medium |
| R022 | Context-degradation taxonomy | Low | Low |
| R024 | Awesome-list as discovery source | Low | Low |
| R023 | skill-optimizer meta-skill | Med | Med |

---

## Next scan

- Re-check quarterly — list adds vendor skills frequently (406 commits); watch for new *meta* sections (quality/security tooling)
- Mine specific packs on demand only (e.g. `dembrandt` UX/design system, `muratcankoylan` context pack) — do not ingest breadth
- **Do not re-propose:** R001, R005, R013, R016 (Implemented / COVERED)
