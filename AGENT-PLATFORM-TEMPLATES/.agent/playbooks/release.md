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

   **3b. BC check + semver determination**
   Before settling on a semver bump, scan all commits since the last tag for BC breaks:
   ```
   git log $(git describe --tags --abbrev=0)..HEAD --oneline
   ```
   For each commit, check whether it introduced a BC break as defined in `BEST-PRACTICES.md` (API contract change, schema change, config key removal, exported interface change, auth change).

   For each BC break found, output:
   ```
   ⚠️ BC BREAK — [commit / change description]
   Affected: [callers / consumers]
   Severity: Non-migratable | Migratable
   Migration: [steps, or "No migration path"]
   ```
   Then determine the semver bump:
   - **Major** (N.0.0): any BC break — removing endpoint, renaming field, removing config key, breaking schema change, incompatible auth change
   - **Minor** (x.N.0): new feature, new endpoint, new config option — all backward-compatible, no BC breaks
   - **Patch** (x.x.N): bug fixes only, no new features, no BC breaks
   - **When in doubt, ask the user before proceeding**
   - **BLOCKED if:** a BC break was found, the bump is not Major, and the user has not explicitly approved the downgrade

   **3c. Write CHANGELOG.md entry** — DevOps agent writes this, not docs agent
   First: read the existing CHANGELOG.md to detect the format already in use.
   - If the file uses **Keep a Changelog** format (sections like `### Added`, `### Fixed`) — follow it exactly
   - If the file uses a **different format** (plain prose, GitHub releases style, custom headings) — match that format; do not impose Keep a Changelog on a repo that chose something else
   - If the file **does not exist** — create it using the platform starter format below

   **Default format (Keep a Changelog):**
   Insert a new section at the top (below the `# Changelog` header):
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

6. **Release commit + tag** — only when user explicitly says to release
   Run in order — do not skip steps:
   ```
   git add CHANGELOG.md package.json package-lock.json   # + any other version files from 3d
   git commit -m "chore(release): vX.Y.Z"
   git tag vX.Y.Z
   git push origin main --tags
   ```
   - The commit message must be exactly `chore(release): vX.Y.Z`
   - Tag and commit happen together — never tag without a matching release commit
   - Push tags in the same command as the push (`--tags`) so the tag appears atomically

7. **GitHub release page** — only when user explicitly says to publish
   Create the release page using the CHANGELOG entry from Step 3c as the body:
   ```
   gh release create vX.Y.Z \
     --title "vX.Y.Z" \
     --notes "$(sed -n '/^## \[X.Y.Z\]/,/^## \[/p' CHANGELOG.md | head -n -1)"
   ```
   - If no `gh` CLI: create manually on GitHub using the CHANGELOG section as-is
   - Release page title: `vX.Y.Z` (no project name prefix — it's already scoped to the repo)
   - Do NOT rewrite the changelog text — Step 3c is the canonical source; copy it verbatim

8. **Announce**
   Docs agent: share the release page URL in any project comms channels (Slack, email, etc.) per project convention. No writing needed — the release page is the announcement.

9. **STOP — release is complete. Production deploy is a separate step.**
   ```
   ✅ Released: vX.Y.Z — tag pushed, GitHub release page live.
   ⛔ Production deploy NOT done. Say "deploy to production" when ready.
   ```
   - Do NOT proceed to deploy production unless the user explicitly says so in this message or a follow-up
   - "release", "ship", "tag", "publish" do NOT mean deploy to production
   - Only "deploy to production", "push to prod", "go live on prod", or equivalent explicit instruction triggers a production deploy
   - If the user said "deploy" in the same message that triggered this playbook, stop here and ask: *"Release is done. Should I also deploy vX.Y.Z to production now?"* — wait for confirmation before proceeding

## Rules
- **Broken tests = blocked release — no exceptions, no `--skip-tests` flags**
- **Release ≠ deploy** — releasing to GitHub and deploying to production are two separate actions; never combine them without explicit instruction for both
- Never tag or publish without explicit user instruction
- Never deploy to production automatically — always require a separate, explicit "deploy to production" command
- Breaking changes require a migration guide before release
- Rollback plan must exist and be confirmed before any production deploy
<!-- PLATFORM:END -->
