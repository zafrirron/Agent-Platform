# Playbook: Deprecation and migration

<!-- PLATFORM:START -->
## When to run
- Replacing an old API, library, or subsystem with a new one
- Sunsetting a feature no longer needed
- Consolidating duplicate implementations
- Removing zombie code (no owner, active consumers)
- Planning removal at design time for new systems ("how would we remove this in 3 years?")

Say: `"deprecate [X]"`, `"migrate from [old] to [new]"`, `"sunset [feature]"`, or `"remove legacy [system]"`

## Pre-conditions
- [ ] Replacement exists and is production-proven — **never deprecate without an alternative**
- [ ] Consumer count and touchpoints identified (grep, metrics, dependency graph)
- [ ] BC impact assessed — apply `BEST-PRACTICES.md` BC policy before any removal

## Steps

1. **Decision** — Architect agent answers:
   - Does this still provide unique value?
   - How many consumers? What's migration cost each?
   - Maintenance cost of keeping it (security, deps, onboarding)?
   - Advisory (warn + migrate on user timeline) vs compulsory (hard deadline + tooling)?

2. **Document** — Docs agent writes deprecation notice:
   - Status, replacement, removal date (if compulsory), reason
   - Migration guide with concrete before/after examples
   - Save to `docs/` or CHANGELOG `### Deprecated` section

3. **BC check** ← gate before code changes
   - Classify: additive deprecation (warnings only) vs removal (BC break)
   - Removal requires ⚠️ BC BREAK notice, semver Major, user approval, migration path
   - **BLOCKED if:** removal planned without documented migration and approval

4. **Build migration path** — choose pattern:
   - **Strangler:** route traffic incrementally old → new; remove at 0% old traffic
   - **Adapter:** old interface delegates to new implementation during transition
   - **Feature flag:** per-consumer or per-tenant switch (DevOps agent)

5. **Migrate consumers** — one at a time:
   - List touchpoints → update to replacement → verify behaviour (tests) → remove old references
   - **Churn rule:** if you own the infrastructure, migrate your users or provide zero-effort compat — don't announce and abandon

6. **Verify zero usage** — DevOps + Backend:
   - Metrics/logs show no calls to deprecated surface
   - Grep codebase for old imports/paths — zero hits outside migration guide examples

7. **Remove** — smallest deletion PR:
   - Delete code, tests, config, docs for old system
   - Remove deprecation notices (served their purpose)
   - Update `api-contracts.md`, changelog, ADR log

8. **Critic review** ← mandatory for compulsory deprecation or public API removal
   Load `critic-agent.md`. Scope: `[CORRECTNESS] [COMPLETENESS] [BC] [SECURITY]`
   Output: `▶ Critic review — APPROVED` or findings line.
   **BLOCKED if:** Critical/High finding on migration completeness.

9. **Handoff** — update `CURRENT.md`; log in `adr-log.md` if architectural.

## Common rationalizations

| Rationalization | Reality |
|-----------------|---------|
| "It still works, why remove it?" | Unmaintained code accumulates security debt and complexity — cost grows silently. |
| "Someone might need it later" | Rebuild cost < perpetual maintenance. Keeping unused code "just in case" is expensive. |
| "Migration is too expensive" | Compare 2–3 year maintenance cost vs one-time migration. |
| "Users will migrate on their own" | They won't. Provide tooling, docs, or migrate for them (Churn rule). |
| "We'll deprecate after the new system ships" | Plan deprecation at design time or it never happens. |
| "We can maintain both forever" | Two systems = double tests, docs, security patches, onboarding. |

## Red flags
- Deprecation without replacement
- Compulsory deadline without migration tooling
- Advisory deprecation stale for years with no progress
- New features added to deprecated system
- Removal without verifying zero active consumers

## Done-when
- [ ] Replacement proven in production
- [ ] Migration guide with examples exists
- [ ] All consumers migrated (verified)
- [ ] Old code, tests, and config fully removed
- [ ] No references to deprecated system remain
- [ ] Changelog and contracts updated
<!-- PLATFORM:END -->
