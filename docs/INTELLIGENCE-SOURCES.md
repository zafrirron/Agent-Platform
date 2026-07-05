# Intelligence Sources — where the platform's brain comes from

The Agent Platform doesn't just accumulate rules — it **actively studies the open-source agent ecosystem** and adopts proven patterns. This page is the provenance ledger: every external project whose skills, logic, or workflows were adapted into the platform, and exactly what each one contributed.

> Everything listed is adapted (not copied wholesale) from **MIT-licensed** sources, de-duplicated against what the platform already does, and — since v2.43.0 — **security-vetted** before adoption. Attribution also lives inline in each skill's `SKILL.md` frontmatter.

## How the platform sources its intelligence

The maintainer runs four discovery "modes" (see [`MAINTAINER/GUIDE.md`](../MAINTAINER/GUIDE.md)). Each produces a dated findings report under [`MAINTAINER/scan-results/`](../MAINTAINER/scan-results/registry.md) with finding IDs and dispositions:

| Mode | Source of intelligence | Finding IDs | Reports |
|------|------------------------|-------------|---------|
| **Mode 1 — Internal audit** | The platform's own failures/inconsistencies | `P001…` | `scan-results/internal/` |
| **Mode 2 — Web ecosystem audit** | Security & best-practice research (OWASP, CWE, web perf) | `F001…` | `scan-results/web-audit/` |
| **Mode 3 — User ingest** | Teams' own production-proven rules dropped into `MAINTAINER/ingest/` | `I001…` | `scan-results/ingest/` |
| **Mode 4 — GitHub ecosystem scan** | Public agent repos — discovery (quarterly) + **targeted** (`repo=owner/name`) | `R001…` | `scan-results/mode4/` |

## Adopted sources (Mode 4 — GitHub agent repos)

| Source repo | ★ | License | Adopted into the platform | Findings |
|-------------|---|---------|---------------------------|----------|
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | ~55k | MIT | `context-engineering` skill (`/context`); DNA for `interview-me`, `idea-refine`, `planning-and-task-breakdown`, `incremental-implementation`, `test-driven-development`, `code-simplification`, `web-performance-audit` (`/webperf`), `browser-testing-devtools` | R001 |
| [obra/superpowers](https://github.com/obra/superpowers) | — | MIT | `verification-before-completion` skill (`/verify`) + systematic-debugging patterns | R005 |
| [saeed-vayghan/gemini-agent-skills](https://github.com/saeed-vayghan/gemini-agent-skills) | — | MIT | `ux-research` optional skill; Gemini `.gemini/skills/` interop docs; multi-agent coordination roadmap | R013, R016, R014 |
| [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | — | MIT | Cross-IDE skills-path matrix (8 hosts); skill quality checklist; skill-ingest security-vetting checklist | R019, R020, R021 |
| [thedesignproject/agent-skills](https://github.com/thedesignproject/agent-skills) | ~36 | MIT | `npx skills` installer interop; "avoid the generic AI aesthetic" frontend principle; verify-before-ship skill check | R025, R028, R029 |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | ~72k | MIT | Proactive **minimalism ladder + safety floor** in `code-simplification` (and `/build` gate); over-engineering **delete-list** review lens in the Critic | R031, R032 |
| Founding Mode 4 scan (8 repos) | — | — | Governance roadmap → reputation vectors, five-state finality, idempotency keys, Critic amendment proposals, manifest-based routing | founding |

## Adopted patterns (Mode 2 — security & best-practice research)

| Area | Adopted into the platform | Findings |
|------|---------------------------|----------|
| OWASP A03 — supply chain | Dependency-vetting gate (CVE/license/maintenance) | F001 |
| OWASP API2 — auth | Auth-check review gate | F002 |
| OWASP A10 — fail-closed | Fail-closed defaults in security rules | F003 |
| OWASP LLM top-10 | LLM-input screening | F004 |
| Web performance (Core Web Vitals) | `web-performance-audit` skill (`/webperf`) | F013 |

## Domain packs — reference-architecture provenance

Domain **packs** (opt-in overlays, e.g. `domain-fintech`) are often distilled from **real open-source applications**, not just agent-brain repos. Each domain pack records its sources in `pack.json` → `reference_sources` (repo, URL, license, what we distilled), and its `reference-architecture.md` cites them so users can study the real implementations (license-aware). Example — `domain-fintech` distills from [apache/fineract](https://github.com/apache/fineract) (Apache-2.0), [firefly-iii](https://github.com/firefly-iii/firefly-iii) (AGPL-3.0), and [ERPNext](https://github.com/frappe/erpnext) (GPL-3.0). See [`.agent/packs/README.md`](../AGENT-PLATFORM-TEMPLATES/.agent/packs/README.md) and [ADR-001](../MAINTAINER/adr/ADR-001-stack-domain-packs.md).

## Where to dig deeper

- **Full dispositions (what was implemented / deferred / skipped):** [`MAINTAINER/scan-results/registry.md`](../MAINTAINER/scan-results/registry.md)
- **Per-scan reports (Q&A, findings, recommended adoption):** [`MAINTAINER/scan-results/mode4/`](../MAINTAINER/scan-results/)
- **Improvement log (every rule traced to a source):** [`MAINTAINER/platform-improvements.md`](../MAINTAINER/platform-improvements.md)
- **Inline attribution:** each `.agent/skills/<name>/SKILL.md` frontmatter `attribution:` field.

> Want the platform to learn from a specific repo? A maintainer can run a targeted scan: `Read MAINTAINER/github-governance-scan.md and execute it. repo=owner/name` — it deep-reads that repo and proposes what to adopt.
