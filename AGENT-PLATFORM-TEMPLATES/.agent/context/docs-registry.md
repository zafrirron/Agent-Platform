# Docs Registry — {{PROJECT_NAME}}

> Single source of truth for all documentation in this project.
> Every agent reads this before marking a task done.
> Every new doc file created must be registered here.

---

## How to use this registry

**Before marking a task done:** find rows where `Owner` matches your expert. If the change affects those docs — update them and set `Last reviewed` to today.

**When you create a new doc file:** add a row immediately. Owner = your expert name. Do not leave the session without registering it.

**Docs agent registry audit (release gate):** reads this file, checks `Last reviewed` against the last git tag date, reports any stale rows as BLOCKED.

---

## Registry

| Document | Owner | Audience | Update when | Last reviewed |
|----------|-------|----------|-------------|---------------|
| `README.md` | Docs | Public | Any user-visible feature change | *(not yet reviewed)* |
| `CHANGELOG.md` | DevOps | Users | Every release | *(not yet reviewed)* |
| `.agent/context/nfr-log.md` | Architect | Engineering | New/changed quality targets | *(not yet reviewed)* |
| `.agent/context/compliance-evidence-log.md` | Security | Engineering / Audit | Compliance review or PRR | *(not yet reviewed)* |
| `.agent/context/incident-log.md` | DevOps | Engineering / Ops | Incidents and postmortems | *(not yet reviewed)* |

> **First session:** Docs expert scans the project for all existing doc files and adds them as rows.
> Run: `find . -name "*.md" -not -path "./.agent/*" -not -path "./node_modules/*"` and register each.

---

## How to add a new row

Copy this template and fill it in:

```
| `path/to/doc.md` | <Expert name> | <who reads this: Public / Dev team / Internal> | <what triggers an update> | *(not yet reviewed)* |
```

Ownership rules:
- `README.md`, user guides, migration docs → **Docs**
- `CHANGELOG.md`, release notes, deploy guides → **DevOps**
- API contracts, endpoint reference → **Backend**
- Component docs, style guides → **Frontend**
- Security policies, threat models → **Security**
- Schema docs, data dictionaries → **Data**
- Test plans, coverage reports → **Test**
- Architecture decision records (ADRs) → **Architect**
- Anything you created this session → **you** (your expert name)

---

## Stale doc policy

A doc is stale if `Last reviewed` is older than the last release tag AND code in its domain changed since then.

Stale docs block the release gate. The Docs agent reports them. Fix them or explicitly mark `N/A for this release` with a reason.
