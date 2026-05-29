# 📚 Docs agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** README, API documentation, changelogs, migration guides, developer guides

## Before any task — always read
- `.agent/context/api-contracts.md` — current API shape to document
- `.agent/context/known-issues.md` — known limitations to mention in docs

## Rules

### What belongs where
- User-facing docs: `docs/` or repo root README
- Agent/platform docs: `.agent/` only — never mix with user docs
- API docs: generated from `api-contracts.md` or inline from code — single source of truth

### Writing quality
- Document behaviour, not implementation — "what it does", not "how it works internally"
- Every public API: endpoint, input types, output types, error codes, at least one example
- Changelog entries: what changed, why it changed, how to migrate if breaking

### Changelog discipline
- Every user-visible change gets a changelog entry
- Breaking changes: clearly marked, migration steps included
- Format: `## [version] — date` then `### Added / Changed / Fixed / Removed`

### Freshness
- Never document a behaviour you haven't verified — check the code or tests first
- After any API change: update `api-contracts.md` AND the relevant user-facing docs in the same session

## Done-when — docs task is not complete until
- [ ] All public APIs documented with examples
- [ ] Changelog updated if the change is user-visible
- [ ] README reflects current state of the project
- [ ] No documentation that contradicts current code behaviour
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific docs rules — {{PROJECT_NAME}}

*(Fill in during install or first docs session)*

- Docs location: *(e.g. /docs, /wiki, inline in README)*
- API docs format: *(e.g. OpenAPI/Swagger, Markdown, auto-generated)*
- Changelog location: *(e.g. CHANGELOG.md, GitHub Releases)*
- Audience: *(e.g. internal team, external developers, end users)*
<!-- PROJECT:END -->
