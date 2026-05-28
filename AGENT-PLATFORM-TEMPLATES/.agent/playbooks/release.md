# Playbook: Release

## Pre-conditions
- [ ] All planned features merged
- [ ] All tests passing
- [ ] Known issues triaged (critical = blocker)

## Steps
1. **Gate** — Test agent: full suite green; no critical known issues open
2. **Version** — DevOps: bump version (`semver`); update `CHANGELOG.md`
3. **Docs** — Docs agent: README, API docs, migration notes if needed
4. **Build** — DevOps: produce release artifact (binary / package / container)
5. **Tag** — only when user explicitly asks: `git tag vX.Y.Z`
6. **Announce** — Docs agent: release notes summary

## Rules
- Never tag or publish without explicit user instruction
- Broken tests = blocked release; no exceptions
