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

1b. **Critic pre-release review** ← adversarial gate
   Load `critic-agent.md`. Give it the full diff since the last release (`git diff vLAST..HEAD`).
   The critic must check:
   - Any breaking change not documented in the changelog?
   - Any security regression introduced since the last release?
   - Any changed code path that has no test coverage?
   - Any new dependency that was not reviewed and documented?
   - Any TODO/FIXME left in shipped code?
   **BLOCKED if: any Critical or High finding is reported.**
   Address all findings before continuing to Step 2.

2. **Security check**
   Grep for secrets in staged files: `password|api_key|token|secret|private_key`
   Must return 0 hits. If any hits: STOP. Remove secrets before continuing.

3. **Changelog + version — DevOps agent**

   **3a. Collect what changed**
   - Run `git log $(git describe --tags --abbrev=0)..HEAD --oneline` to list all commits since the last tag
   - Read `.agent/handoff/CURRENT.md` for session notes and any flagged changes
   - Read `.agent/context/known-issues.md` for resolved items

   **3b. Determine semver bump level**
   - **Major** (N.0.0): any breaking API/contract change, removed endpoint, renamed field, DB migration requiring data migration
   - **Minor** (x.N.0): new feature, new endpoint, new config option — all backward-compatible
   - **Patch** (x.x.N): bug fixes only, no new features, no breaking changes
   - When in doubt, ask the user before proceeding

   **3c. Write CHANGELOG.md entry** — DevOps agent writes this, not docs agent
   Insert a new section at the top of CHANGELOG.md (below the `# Changelog` header):
   ```
   ## [X.Y.Z] — YYYY-MM-DD
   ### Added
   - (new features, endpoints, options)
   ### Changed
   - (modified behavior, updated deps)
   ### Fixed
   - (bug fixes)
   ### Removed
   - (deprecated items removed, breaking changes)
   ```
   Leave out empty sections. Every line must be user-visible — no "internal refactor" entries unless they affect behavior.

   **3d. Bump version in files**
   Update the version string in ALL of the following that exist in this project:
   - `package.json` → `"version"` field
   - `package-lock.json` → `"version"` field (top-level)
   - `.agent/platform.json` → `bootstrap_version` field (if this is the platform repo)
   - Any other version file declared in `.agent/WORKFLOWS.md`
   New version must match the CHANGELOG entry exactly.

4. **Docs approval gate — Docs agent**
   Load `docs-agent.md`. Run registry audit mode:
   - Read `.agent/context/docs-registry.md`
   - Check every row: is `Last reviewed` current relative to code changes since last tag?
   - Check for any new `.md` files in the repo not yet in the registry
   **BLOCKED if:** any row is stale OR any new doc file is unregistered.
   Update stale docs or explicitly mark `N/A for this release` with a reason.

5. **Build**
   DevOps agent: produce release artifact (binary / package / container image).
   Artifact must be versioned — tag matches changelog version.

6. **Tag** — only when user explicitly says to tag
   `git tag vX.Y.Z` — only after user confirms.

7. **Announce**
   Docs agent: post the CHANGELOG section written in Step 3c as the release notes (GitHub release, Slack, etc. — per project convention). No rewriting needed — Step 3c is the canonical source.

## Rules
- **Broken tests = blocked release — no exceptions, no `--skip-tests` flags**
- Never tag or publish without explicit user instruction
- Breaking changes require a migration guide before release
- Rollback plan must exist before deploying to production
<!-- PLATFORM:END -->
