# Coding conventions — {{PROJECT_NAME}}

## General

- Smallest correct diff — never change more than the task requires
- Match existing style in each file touched; don't impose a new style
- Comments only for non-obvious logic; let naming do the work
- Prefer editing existing files over creating new ones
- Prefer existing utilities / stdlib over adding a new dependency

## Agent rules

- Claim files in `registry.yaml` before large edits
- Update `CURRENT.md` at every session end
- Commits only when user asks
- No drive-by refactors — note them in `CURRENT.md`, fix separately
- Ask before irreversible actions (delete, rename, schema drop, API break)
- Surface blockers after 2 failed attempts; don't loop silently

## Testing

- Every bug fix must include a regression test
- New critical path → test before marking done
- Tests assert behavior, not implementation details

## Git

- Branch before large changes (if on main/master)
- One logical change per commit
- Commit message: `type(scope): description` ≤72 chars
- Never commit: `.env`, `node_modules`, `bin/`, `obj/`, build artifacts, secrets

## Security

- No credentials, tokens, or keys in source ever
- Grep for secrets before committing: `password|api_key|token|secret`
- Input validated at all trust boundaries

## Project-specific

*(Agent: fill from scan — naming conventions, test runner, lint commands, style guide)*
