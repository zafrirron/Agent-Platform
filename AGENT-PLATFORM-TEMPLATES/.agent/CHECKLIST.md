# Pre-handoff checklist — {{PROJECT_NAME}}

Run before every session end. All boxes must be checked or explicitly noted as N/A.

## Scope
- [ ] Changes limited to requested task only
- [ ] No drive-by refactors or unrelated edits

## Registry & handoff
- [ ] `registry.yaml` updated → `idle`, `files` cleared
- [ ] `CURRENT.md` entry added: status, files changed, tests, next agent

## Code quality
- [ ] New critical paths have tests
- [ ] No TODO/FIXME left without a `CURRENT.md` note
- [ ] Existing tests still pass (or noted as failing with reason)

## Security
- [ ] No secrets, tokens, or keys in staged files
- [ ] No `.env`, `node_modules`, `bin/`, `obj/` staged

## Documentation
- [ ] API / schema changes → `context/api-contracts.md` updated
- [ ] New dep added → `context/dependencies.md` updated
- [ ] Architectural decision → `context/adr-log.md` entry added
- [ ] New known issue → `context/known-issues.md` entry added
