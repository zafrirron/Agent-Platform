# Playbook: Incident postmortem

<!-- PLATFORM:START -->
## Pre-conditions
- [ ] Production or staging incident occurred (or user requests postmortem for recent outage)
- [ ] Read `.agent/context/incident-log.md` and `.agent/context/known-issues.md`

## Steps

1. **Declare incident** — output:
   `▶ Incident postmortem — [INC-XXX or new] · severity: [P0–P3]`

2. **Timeline** — capture UTC timestamps:
   - Detected (alert, user report, monitor)
   - Responded (owner assigned)
   - Mitigated (service restored or workaround live)
   - Resolved (root cause fixed or permanent mitigation)
   - **MTTR** = minutes Detected → Resolved (or Mitigated if distinct)

3. **Impact** — users affected, duration, data loss (yes/no), SLO breach (reference `nfr-log.md` availability rows)

4. **Root cause** — technical cause + contributing factors (process, missing test, config, dependency)

5. **Change correlation** — was a deploy within 24h before incident?
   - If yes: mark `Change-related: yes` in `incident-log.md` (feeds DORA change failure rate)
   - Link deploy tag/commit

6. **Blameless postmortem doc** — create `.agent/context/postmortems/INC-XXX.md`:

   ```markdown
   # Postmortem — INC-XXX — [title]
   Date: · Severity: · Owner:

   ## Summary
   ## Timeline (UTC)
   ## Root cause
   ## What went well
   ## What went wrong
   ## Action items
   | Action | Owner | Due | Status |
   ```

7. **Update registers**
   - Append or update row in `incident-log.md` with MTTR and postmortem path
   - Add action items to `known-issues.md` if not fixed same session
   - If incident implies compliance gap, update `compliance-evidence-log.md` row status

8. **DORA rollup** — recalculate change failure rate and median MTTR in `incident-log.md` rollup table for current quarter

9. **Critic review** ← mandatory if code or config fix shipped in same session
   Load `critic-agent.md`. Scope: `[CORRECTNESS] [COMPLETENESS] [OPERABILITY]`
   Otherwise note: `Critic: N/A — documentation-only postmortem`

10. **Handoff** — update `CURRENT.md`. Tell user: *"Re-run `org-maturity-assessment` at quarter end to track DORA trends."* Do not run session-end.

## Rules
- Postmortem within 5 business days of P0/P1 incident (best practice — log delay if later)
- No blame attribution to individuals — focus on systems and process
- P0/P1 action items block next production deploy until fixed or user-approved risk acceptance in `CURRENT.md`
<!-- PLATFORM:END -->
