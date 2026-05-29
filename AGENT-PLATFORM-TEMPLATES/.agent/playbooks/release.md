# Playbook: Release

<!-- PLATFORM:START -->
## Pre-conditions — ALL must be true before starting
- [ ] All planned features for this version are merged
- [ ] Full test suite is green — **no exceptions, no bypasses**
- [ ] No critical known issues open (check `.agent/context/known-issues.md`)
- [ ] Changelog updated with all user-visible changes for this version
- [ ] Security agent has reviewed the release if any auth/secret changes are included

## Steps

1. **Gate — Test agent**
   Run `{{TEST_RUNNER}}`. Must be 100% green.
   **If any test fails: STOP. Do not proceed. Fix tests first.**
   Run `{{COVERAGE_CMD}}`. Coverage must be at or above `{{COVERAGE_THRESHOLD}}%`.
   If coverage dropped: add tests before releasing.

2. **Security check**
   Grep for secrets in staged files: `password|api_key|token|secret|private_key`
   Must return 0 hits. If any hits: STOP. Remove secrets before continuing.

3. **Version bump — DevOps agent**
   Bump version following semver:
   - Patch (x.x.N): bug fixes only, no new features, no breaking changes
   - Minor (x.N.0): new features, backward-compatible
   - Major (N.0.0): breaking changes — migration guide required

4. **Changelog — Docs agent**
   Confirm `CHANGELOG.md` has an entry for this version with:
   - All user-visible changes (Added / Changed / Fixed / Removed)
   - Breaking changes clearly marked with migration steps

5. **Build**
   DevOps agent: produce release artifact (binary / package / container image).
   Artifact must be versioned — tag matches changelog version.

6. **Tag** — only when user explicitly says to tag
   `git tag vX.Y.Z` — only after user confirms.

7. **Announce**
   Docs agent: write release notes summary for the changelog or release page.

## Rules
- **Broken tests = blocked release — no exceptions, no `--skip-tests` flags**
- Never tag or publish without explicit user instruction
- Breaking changes require a migration guide before release
- Rollback plan must exist before deploying to production
<!-- PLATFORM:END -->
