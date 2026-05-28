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

