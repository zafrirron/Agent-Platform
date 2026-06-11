# Playbook: Accessibility audit

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] User-facing UI exists (`src/components/`, `pages/`, `views/`, `app/` routes, or equivalent)
- [ ] Read `.agent/agents/frontend-agent.md` WCAG 2.2 AA section in full

## Steps

1. **Scope** — list screens/flows to audit (primary user journey minimum).

2. **Automated scan** — run one of:
   - `axe-core` in test suite or CLI
   - Lighthouse accessibility category
   - eslint-plugin-jsx-a11y (if already in project)
   Record tool, version, and **zero Critical** violations required for pass.

3. **Manual keyboard pass** — tab through primary flow:
   - All interactive elements reachable
   - Visible focus indicator
   - No keyboard traps
   - Destructive actions confirmable

4. **WCAG spot checks** (Frontend expert rules):
   - Form labels and `aria-describedby` on errors
   - Colour contrast (4.5:1 normal text)
   - Images: alt text appropriate
   - Headings hierarchical; landmark regions (`main`, `nav`)

5. **Findings table** — severity order:
   | Severity | WCAG criterion | Location | Fix |
   Critical = blocks primary flow for assistive tech users.

6. **Critic review** ← mandatory
   Load `critic-agent.md`. Scope: `[ACCESSIBILITY] [COMPLETENESS] [TEST]`
   Output: `▶ Critic review — APPROVED` or `▶ Critic review — N findings (X Critical, Y High): [summary]`
   Log in `CURRENT.md`: `Critic reviewed: yes — [result]`

7. **NFR log** — update `nfr-log.md` Usability/a11y row status if present.

8. **Handoff** — report only unless user asked to fix in same session. Do not run session-end.

## Rules
- Audit is read-only on code unless user requests fixes
- Skip silently if repo has no UI source files — say "No UI detected; audit N/A"
- Mobile/touch targets: 24×24 CSS px minimum per WCAG 2.2
<!-- PLATFORM:END -->
