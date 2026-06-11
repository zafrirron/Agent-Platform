# Playbook: Organization maturity assessment

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] User requested maturity assessment, DORA review, SDLC health check, or quarterly governance review
- [ ] Read `.agent/context/nfr-log.md`, `compliance-evidence-log.md`, `incident-log.md`
- [ ] Read `.agent/handoff/CURRENT.md` (recent gate execution)

## When to run
- Quarterly process review (recommended)
- Before SOC 2 / ISO 27001 audit window
- After major process change (new CI, new deploy path)
- Say: `"Run org maturity assessment"` or `"DORA metrics review"`

## Steps

1. **Scope** — output:
   `▶ Maturity assessment — period: [last 90 days / since last tag] · frameworks: [DORA + ISO 25010 NFRs + SDLC gates]`

2. **DORA delivery metrics** — measure or estimate from git, CI, `incident-log.md`:

   | Metric | How to measure | This period | Trend vs last |
   |--------|----------------|-------------|---------------|
   | Deployment frequency | production deploys ÷ weeks | | ↑ / → / ↓ |
   | Lead time for changes | median hours: merge commit → prod deploy | | |
   | Change failure rate | change-related incidents ÷ deploys (`incident-log.md`) | | |
   | Failed deployment recovery | median MTTR for change-related incidents | | |
   | Deployment rework rate | unplanned deploys after incident ÷ total deploys | | |

   Compare to `nfr-log.md` rows `NFR-DP01`–`NFR-DP04`. Flag any P0/P1 threshold miss.

3. **Process maturity rubric** (CMMI-inspired, 1–5 per dimension):

   | Dimension | L1 Ad hoc | L3 Defined | L5 Optimizing | Score | Evidence |
   |-----------|-----------|------------|---------------|-------|----------|
   | Culture & collaboration | | Gates in AGENTS.md; design before code | | | |
   | Automation & tooling | | CI lint+test; CVE scan | | | |
   | Architecture & quality | | NFR register; ADRs | | | |
   | Testing & release | | Critic + PRR + release playbook | | | |
   | Compliance evidence | | `compliance-evidence-log.md` verified | | | |

   Score 1–5 per row; overall = average. Document evidence source for each score.

4. **ISO 25010 / NFR health** — from `nfr-log.md`:
   - Count P0/P1 rows by status: `verified` / `gap` / `proposed`
   - List categories with no measurable rows (Performance, Compliance, Observability, etc.)

5. **Gate execution sample** — last 5 application-change sessions in `CURRENT.md`:
   - Critic reviewed: yes — present?
   - Security gate when triggered?
   - NFR IDs cited for significant features?

6. **Findings & recommendations** — prioritised:
   - **Improve now** — blocks maturity score ≥3 or compliance readiness
   - **Next quarter** — P1 NFRs, DORA trend gaps
   - **Backlog** — P2 items

7. **Critic review** ← mandatory
   Load `critic-agent.md`. Scope: `[COMPLETENESS] [OPERABILITY]`
   Output: `▶ Critic review — APPROVED` or findings line.
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`

8. **Persist report** — write `.agent/context/maturity-{{DATE}}.md` (format: `maturity-YYYY-MM-DD.md`) with executive summary, DORA table, rubric scores, action plan.

9. **Handoff** — update DORA rollup section in `incident-log.md` if incidents exist. Do not run session-end.

## Rules
- Assessment is findings-only — no code changes unless user requests remediation in same session
- If git/CI history insufficient, mark metrics `estimated` and note data gap
- Full project code audit is separate — use `audit.md`; this playbook assesses **process and outcomes**
<!-- PLATFORM:END -->
