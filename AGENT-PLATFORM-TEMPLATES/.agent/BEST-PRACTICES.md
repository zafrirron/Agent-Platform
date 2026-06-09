# Agentic development best practices — {{PROJECT_NAME}}

> Read before any non-trivial task. These rules apply to every agent on every framework.
> Full playbooks: `.agent/playbooks/` · Full context: `.agent/context/`

## The 11 golden rules

1. **Design before code** — present a design and get user confirmation BEFORE writing any production code; the required design depth scales with task size (see Design Gate below); no exceptions
2. **Smallest correct change** — large diffs break more, review harder, rollback costlier
3. **Read before write** — match existing patterns; don't impose your own style
4. **Spec first** — define done-when before implementing; write the test or acceptance criteria first
5. **Verify after** — run the affected code path after every change; untested = unfinished
6. **Ask before irreversible** — delete, rename, drop schema column, break API → confirm with user
7. **No drive-by refactors** — note unrelated issues in `CURRENT.md`; fix in a separate task
8. **Lock before large edits** — claim files in `registry.yaml` before touching shared paths
9. **No secrets in source** — use `.env` / config injection; grep before every commit
10. **Surface blockers early** — stuck > 2 attempts → log blocked, explain, stop
11. **Update contracts** — API / schema change → update `context/api-contracts.md` immediately

## Design Gate — mandatory before any code

Before writing a single line of production code, present a design and wait for user confirmation.
The required depth depends on task size:

| Task size | Examples | Required design |
|-----------|---------|----------------|
| **Trivial** | Bug fix, typo, config value, 1-line patch | No design step — state what you will change in one sentence, proceed |
| **Small** | New function, small feature, adding a field | **2–3 sentence summary:** what changes, which files, why this approach. Wait for user: "OK" or "proceed" |
| **Medium** | New endpoint, new module, new class, auth logic, data schema change | **Written design:** components affected, data flow, interface contracts, edge cases considered. User must explicitly approve before coding starts |
| **Large** | New service, cross-cutting change, breaking API change, new architecture component | **Full architect review:** load `architect-agent.md`, write ADR, present 2–3 alternatives with tradeoffs, create diagram. User approves before any code |

**The rule:** if you are unsure which tier applies, apply the next tier up. Overdesigning costs 5 minutes. Underdesigning costs days of rework.

**User approval formats that count as confirmation:**
- "proceed", "ok", "looks good", "go ahead", "yes", "approved" — any clear affirmative
- Silence or no response does NOT count — wait for explicit confirmation

## Task anatomy

Structure every task with five parts:

| Part | What to do |
|------|-----------|
| **0. Design** | Present design at the correct tier (see Design Gate above); wait for user confirmation |
| **1. Spec** | Write acceptance criteria and test skeleton before touching production code |
| **2. Implement** | Smallest correct change; claim files in `registry.yaml` first |
| **3. Test** | Run `{{TEST_RUNNER}}`; new code must have tests; coverage must not drop |
| **4. Handoff** | Update `CURRENT.md`; all checklist items green; log any blockers |

**Done means:** design confirmed, tests written, suite green, handoff updated. Never mark done without all four.

## Backwards compatibility policy

A **BC break** is any change that forces callers, consumers, or users to update their code, config, or integrations to avoid breakage.

| Domain | BC break examples |
|--------|-------------------|
| **API** | Remove endpoint, change HTTP method or path, remove/rename response field, change required parameters, rename `operationId` |
| **Schema** | Drop column, rename column, change column type, remove index a query depends on |
| **Config / env** | Remove or rename env var, change format of a config value, remove CLI flag |
| **Code contracts** | Remove exported function/type/class, change function signature, remove module export |
| **Auth** | Change token format, change auth header name, change session invalidation behaviour |
| **Platform conventions** | Change handoff format, rename agent files, change registry schema |

**When any agent detects a BC break, output this notice before writing any code:**

```
⚠️ BC BREAK — [what changes]
Affected: [callers / consumers / users / services impacted]
Severity: Non-migratable (callers will break without action) | Migratable (migration path exists)
Migration: [step-by-step migration path, or "No migration path available"]
Action required: explicit user approval before proceeding.
```

**Rules:**
- Never implement a BC break silently — the notice is mandatory before writing any code
- **Migratable** break: document migration steps before implementation starts; include in the changelog
- **Non-migratable** break: requires a major semver bump AND explicit "I understand, proceed" from the user
- Any BC break to a public API or platform convention: route to Architect agent and log an ADR

