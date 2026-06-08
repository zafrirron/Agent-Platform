# Changelog — {{PROJECT_NAME}}

All notable changes are documented here. Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) · Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Guiding principle:** A changelog is written for humans — your users and teammates — not for machines.  
> Document *what changed and why it matters*, not what files you touched.

---

## [Unreleased]

> Work merged but not yet shipped. Move entries to a versioned section on release.

### Added
-

### Changed
-

### Fixed
-

---

<!-- ─── VERSION HISTORY ─────────────────────────────────────────────────────────

Copy this block for each release (newest version always at the top):

## [X.Y.Z] — YYYY-MM-DD

### Added
- New capability that users can now do, didn't exist before

### Changed
- Existing behavior that works differently now (describe the delta, not the implementation)

### Deprecated
- Feature still works but will be removed in a future version — include migration path

### Removed
- Feature or endpoint removed; describe the replacement if one exists

### Fixed
- Bug that was affecting users: what broke, under what condition, now resolved

### Security
- Vulnerability patched (include CVE identifier if applicable)

─── AUTHORING RULES ──────────────────────────────────────────────────────────

✓  One line per change — if a change needs a paragraph, it belongs in the release notes
✓  User-visible only — skip internal refactors, test updates, CI tweaks unless they affect behavior
✓  Omit empty sections — if nothing was removed, drop the Removed section entirely
✓  Breaking changes → put in Removed or Changed AND mark clearly: "⚠ Breaking:"
✓  Link to issues/PRs inline where relevant: "Fixed crash on empty input (#123)"
✓  Use past tense: "Added", "Fixed", "Removed" — not "Adds", "Fixes", "Removes"
✓  Semver bump guide: Added/Changed new behavior = minor · Fixed only = patch · Breaking = major

─── EXAMPLE ENTRY ────────────────────────────────────────────────────────────

## [2.1.0] — 2026-03-15

### Added
- Export to PDF now supports password protection
- New `/api/v2/reports` endpoint with pagination and filtering

### Changed
- Dashboard load time reduced from ~4s to <400ms by switching to server-side pagination
- ⚠ Breaking: `/api/v1/reports` removed — migrate to `/api/v2/reports` (see docs/migration.md)

### Fixed
- Fixed crash when uploading files larger than 50 MB on slow connections (#412)
- Corrected timezone handling for users in UTC-offset regions (#389)

### Security
- Patched stored XSS vulnerability in comment field (CVE-2026-10234)

──────────────────────────────────────────────────────────────────────────────
-->

<!-- Version comparison links — update after each release (replace YOUR_ORG/YOUR_REPO) -->
<!-- [Unreleased]: https://github.com/YOUR_ORG/YOUR_REPO/compare/vLAST...HEAD -->
<!-- [X.Y.Z]:      https://github.com/YOUR_ORG/YOUR_REPO/compare/vPREV...vX.Y.Z -->
