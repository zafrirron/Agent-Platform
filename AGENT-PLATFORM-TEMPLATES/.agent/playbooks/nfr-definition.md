# Playbook: Define non-functional requirements

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] Session started; user wants measurable quality targets (not a feature implementation)
- [ ] Read `.agent/context/nfr-log.md` — extend existing rows, do not duplicate

## Steps

1. **Scope** — clarify what the user is building (API, web app, batch job, library) and which quality attributes matter most. Use the 14-category prompt list:
   Performance · Scalability · Availability · Reliability · Security · Compliance · Usability · Maintainability · Portability · Interoperability · Recoverability · Observability · Cost · Developer productivity

2. **Elicit measurable NFRs** — for each category the user cares about, capture:
   - **Threshold** (number or pass/fail — never "fast" or "secure")
   - **Measurement method** (tool, metric name, environment)
   - **Verification path** (test, checklist, monitor, audit phase)
   - **Priority** (P0 / P1 / P2) and **Owner** expert

3. **Write to register** — add or update rows in `.agent/context/nfr-log.md` with IDs: `NFR-{CAT}{nn}` (e.g. `NFR-P01` performance, `NFR-S01` security, `NFR-C01` compliance, `NFR-DP01` DORA).

4. **DORA delivery KPIs** — if the project ships to production, elicit or propose these **Developer productivity** rows (see `nfr-log.md` examples):
   - **Change failure rate** — failed deploys or change-related incidents ÷ total deploys
   - **Failed deployment recovery** — median MTTR for change-related incidents (`incident-log.md`)
   - **Deployment frequency** — deploys per week/month
   - **Lead time for changes** — commit/merge → production deploy duration
   Set thresholds realistic for team size; default examples are P1/P2.

5. **Compliance NFRs** — if SOC 2, ISO 27001, or GDPR in scope:
   - Add `NFR-C01` vuln remediation SLA (Critical/High patch windows)
   - Register evidence rows in `compliance-evidence-log.md` (`CE-SOC-*`, `CE-ISO-*`)
   - Offer `compliance-review.md` playbook for full SDLC control gap analysis

6. **Cross-link** — if an NFR implies architectural constraint (auth, multi-region, caching), log summary in `adr-log.md`. If it affects API contracts, note in `api-contracts.md` comments section.

7. **Design gate hook** — tell the user: *"Reference NFR IDs in add-feature acceptance criteria. Use `performance-budget`, `observability-setup`, `accessibility-audit`, or `compliance-review` playbooks to verify categories. Run `production-readiness` before first production deploy; `org-maturity-assessment` quarterly for DORA trends."*

8. **Handoff** — update `CURRENT.md` with NFR IDs added. Do not run session-end — only the user ends the session.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "Fast and secure are good enough" | Adjectives are invalid — every NFR needs a number and measurement method. |
| "We'll measure in production" | Every row needs a verification path before go-live — production-only measurement is a gap. |
| "DORA doesn't apply to us" | If you deploy to production, propose P1/P2 DORA rows or document N/A with user approval. |
| "Skip compliance rows — we're not regulated" | If user stated SOC 2/ISO/GDPR scope, `NFR-C01` and evidence log rows are mandatory. |

## Rules
- Load `architect-agent.md` rules for ADR discipline when NFRs drive hard-to-reverse decisions
- Do not implement code in this playbook — definition only
- Compliance frameworks (GDPR, HIPAA, SOC 2, ISO 27001): capture measurable rows in `nfr-log.md`; run `compliance-review.md` for control-level gap analysis
<!-- PLATFORM:END -->
