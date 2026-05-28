# Playbook: Add dependency

## Evaluation checklist (complete BEFORE installing)

- [ ] **Necessity** — can stdlib or an existing dep do this? (check first; the answer is often yes)
- [ ] **Scope** — dev-only or runtime? (prefer `devDependency` / build-time when possible)
- [ ] **Size** — check bundlephobia.com / pkg-size.dev; is the impact acceptable?
- [ ] **License** — compatible with this project? (MIT / Apache / BSD = generally safe; GPL = check with user)
- [ ] **Maintenance** — last release < 12 months; issues actively triaged?
- [ ] **Alternatives** — evaluated at least 2 alternatives?
- [ ] **Security** — run `npm audit` / `pip-audit` / `dotnet list package --vulnerable` after install

## Install steps

1. Complete evaluation checklist above
2. Install with exact version pin:
   - npm: `npm install --save-exact <pkg>`
   - pip: `pip install <pkg>==x.y.z`
   - NuGet: lock `<PackageReference Version="x.y.z">`
3. Run audit — fix any new vulnerabilities before proceeding
4. Add entry to `.agent/context/dependencies.md`
5. Update `.agent/WORKFLOWS.md` if a new build / run step is required

## Rules
- One dependency per task — don't bundle multiple dep adds
- Never install as a workaround for a missing test or missing feature in an existing dep
- Transitive vulnerability → update the parent dep, not just `audit-ignore`
- Remove unused deps before release
