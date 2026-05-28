# Agentic development best practices — {{PROJECT_NAME}}

> Read before any non-trivial task. These rules apply to every agent on every framework.
> Full playbooks: `.agent/playbooks/` · Full context: `.agent/context/`

## The 10 golden rules

1. **Smallest correct change** — large diffs break more, review harder, rollback costlier
2. **Read before write** — match existing patterns; don't impose your own style
3. **Spec first** — define done-when before implementing; write the test or acceptance criteria first
4. **Verify after** — run the affected code path after every change; untested = unfinished
5. **Ask before irreversible** — delete, rename, drop schema column, break API → confirm with user
6. **No drive-by refactors** — note unrelated issues in `CURRENT.md`; fix in a separate task
7. **Lock before large edits** — claim files in `registry.yaml` before touching shared paths
8. **No secrets in source** — use `.env` / config injection; grep before every commit
9. **Surface blockers early** — stuck > 2 attempts → log blocked, explain, stop
10. **Update contracts** — API / schema change → update `context/api-contracts.md` immediately

## Task anatomy

Structure every task with four parts:

| Part | What to do |
|------|-----------|
| **1. Spec** | Write acceptance criteria and test skeleton before touching production code |
| **2. Implement** | Smallest correct change; claim files in `registry.yaml` first |
| **3. Test** | Run `{{TEST_RUNNER}}`; new code must have tests; coverage must not drop |
| **4. Handoff** | Update `CURRENT.md`; all checklist items green; log any blockers |

**Done means:** tests written, suite green, handoff updated. Never mark done without all three.

