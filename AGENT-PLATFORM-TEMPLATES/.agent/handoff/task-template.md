# Flight Plan: [Feature Title]

* **Tracked Task ID**: task-NNN
* **Lead Agent**: [Agent/Role]
* **Target Release**: vX.Y.Z

## 1 · Task Checklist

- [ ] **Phase 1: Design & ADR** (Architect)
  - [ ] Run lock check: `node .agent/tools/check_locks.js <framework-id> [files...]`
  - [ ] Map architectural interfaces / schemas
  - [ ] Write ADR in `.agent/context/adr-log.md`

- [ ] **Phase 2: Contract Specification** (Backend/Frontend)
  - [ ] Update `.agent/context/api-contracts.md`
  - [ ] Scaffold mocks / stubs

- [ ] **Phase 3: Implementation** (Backend/Frontend)
  - [ ] Core logic + UI as needed

- [ ] **Phase 4: Verification** (Test)
  - [ ] Regression tests
  - [ ] Confirm test suite green: `{{TEST_RUNNER}}`

## 2 · Open Questions & Risks

* *Question / Risk* (Owner — mitigation)
