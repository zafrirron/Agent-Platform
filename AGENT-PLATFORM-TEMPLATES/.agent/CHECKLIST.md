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
