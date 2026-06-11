# Pre-handoff checklist — {{PROJECT_NAME}}

Run before every session end. All boxes must be checked or explicitly noted as N/A.

## Scope
- [ ] Changes limited to requested task only
- [ ] No drive-by refactors or unrelated edits

## Registry & handoff
- [ ] `registry.yaml` updated → `idle`, `files` cleared
- [ ] `CURRENT.md` entry added: status, files changed, tests, next agent

## Testing
- [ ] Test suite run and fully green: `{{TEST_RUNNER}}`
- [ ] Every new public function / module has at least one unit test
- [ ] Every bug fix has a regression test
- [ ] Every new API endpoint has a contract test
- [ ] Coverage not below `{{COVERAGE_THRESHOLD}}` (run `{{COVERAGE_CMD}}` to verify)
- [ ] Any untestable code path logged with reason in `CURRENT.md`

## Code quality
- [ ] No TODO/FIXME left without a `CURRENT.md` note
- [ ] Existing tests still pass (or noted as failing with reason)

## Quality gates
- [ ] Critic review completed when application code changed — `CURRENT.md` contains `Critic reviewed: yes`
- [ ] Playbook Step 5b output recorded — response included `▶ Critic review —` line (or session-end Step 2a ran)
- [ ] Security gate (add-feature Step 5a) ran when auth/endpoints/input changed — or noted why N/A

## Security
- [ ] No secrets, tokens, or keys in staged files
- [ ] No `.env`, `node_modules`, `bin/`, `obj/` staged

## Documentation
- [ ] API / schema changes → `context/api-contracts.md` updated
- [ ] New dep added → `context/dependencies.md` updated
- [ ] Architectural decision → `context/adr-log.md` entry added
- [ ] New known issue → `context/known-issues.md` entry added

## Non-functional requirements
- [ ] Significant feature cites relevant `context/nfr-log.md` IDs — or N/A for trivial change
- [ ] P0 NFRs verified before production deploy (or user-approved deferral in `CURRENT.md`)
- [ ] UI changes: WCAG 2.2 AA keyboard pass + automated a11y scan — or N/A (no UI)
- [ ] API/list changes: pagination or explicit NFR note if unbounded — or N/A
- [ ] Performance budget NFRs verified when hot path changed — or `performance-budget` playbook ran
- [ ] Observability minimum (health, structured logs, correlation ID) — or N/A (no networked service)
- [ ] Container image scan clean before prod deploy — or N/A (no containers)
- [ ] P0 compliance evidence rows in `compliance-evidence-log.md` verified — or N/A (not production-bound)
- [ ] `NFR-C01` vuln remediation SLA satisfied (no Critical CVE past window) — or N/A
- [ ] Production deploy: change traceable to PR/review + rollback path documented — or N/A
