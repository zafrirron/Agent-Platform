# Playbook: Add feature

## Pre-conditions
- [ ] Requirements clear — done-when criteria defined
- [ ] Scope agreed — what's explicitly out of scope noted

## Steps
1. **Claim** — read `registry.yaml`; claim scope files
2. **Design** — if cross-cutting: Architect agent first; log ADR if architectural
3. **Spec** — write acceptance criteria or test skeleton before implementation
4. **Implement** — domain expert(s); smallest correct change
5. **Test** — Test agent: unit + integration; all tests green
6. **Docs** — if user-facing: Docs agent updates README / changelog
7. **Handoff** — end session prompt; update `CURRENT.md` with outcome + next agent

## Rules
- No feature additions and refactors in the same diff
- If scope creeps during implementation → stop, discuss with user, re-scope
