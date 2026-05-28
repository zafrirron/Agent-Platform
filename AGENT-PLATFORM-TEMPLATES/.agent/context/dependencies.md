# Dependencies — {{PROJECT_NAME}}

> Key runtime and dev dependencies with purpose and notes.
> Check here before adding a new package — it may already exist.
> Full evaluation guide: `.agent/playbooks/add-dependency.md`

## Runtime dependencies

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| *(Agent: fill from package.json / requirements.txt / .csproj scan)* | | | |

## Dev / build dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| *(Agent: fill from scan)* | | |

## Dependency rules

- Evaluate before adding: see `playbooks/add-dependency.md`
- Pin exact versions for reproducible builds
- Audit after every add: `npm audit` / `pip-audit` / `dotnet list package --vulnerable`
- Remove unused deps before release
