# Changelog

All notable changes to Agent Platform Bootstrap are documented here.

---

## [2.2.0] — 2026-05-28

### Added — Test enforcement

- **`test-agent.md`**: Full rewrite. Added "When to invoke" trigger table (feature / bug fix / API integration / refactor / dep update), 4-category test taxonomy (unit · integration · regression · contract), runner/coverage command placeholders, 8 explicit rules.
- **`CONVENTIONS.md`**: Expanded Testing section. Defined "critical path" explicitly. Mandated tests for every new public function and every API endpoint. Added `COVERAGE_THRESHOLD` gate and "red suite blocks handoff" rule.
- **`CHECKLIST.md`**: New dedicated **Testing** section (6 checkboxes: test suite green, unit tests, regression test, contract test, coverage gate, untestable-code log).
- **`BEST-PRACTICES.md`**: Completed Task Anatomy section with Spec → Implement → Test → Handoff table and explicit "Done means" definition.
- **`api-integration.md`**: Explicit test step (happy path + ≥1 error path + auth failure); added Rules section; test agent now mandatory before security review.
- **`AGENT-PLATFORM-MANIFEST.json`**: New placeholders `COVERAGE_CMD` and `COVERAGE_THRESHOLD`.
- **`AGENT-PLATFORM-BOOTSTRAP.md`**: Phase 0 now auto-detects `TEST_RUNNER`, `COVERAGE_CMD`, and defaults `COVERAGE_THRESHOLD` to 80%.

### Changed

- `bootstrap_version` bumped from `2.0.0` → `2.2.0` (manifest was behind; docs had already advanced to 2.1).
- Framework README: updated "What you get" table, Phase 0 description, Test expert row, best-practices §9, quick-reference card.
- Framework README: added "Upgrading from v2.x to v2.2" guide with a 3-step targeted upgrade path.

### Upgrade path

See **"Upgrading from v2.x to v2.2"** in `AGENT-PLATFORM-FRAMEWORK-README.md`.  
Short version: copy 5 template files, fill `{{COVERAGE_CMD}}` and `{{COVERAGE_THRESHOLD}}`, run `mode=repair`.

---

## [2.1.0] — prior release

- Multi-framework coordination (Claude Code · Cursor · Antigravity · Codex)
- 8 specialist agents, 7 playbooks, caveman skill, API agentic patterns
- Cross-IDE registry + handoff log
- Initial bootstrap installer with 5-phase apply
