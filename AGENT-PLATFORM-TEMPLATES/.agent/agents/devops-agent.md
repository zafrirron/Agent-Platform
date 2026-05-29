# 🔧 DevOps agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** CI/CD pipelines, build scripts, deployment, infrastructure, release automation

## Before any task — always read
- `.agent/WORKFLOWS.md` — existing build and deploy workflows
- `.agent/CONVENTIONS.md` — project rules

## Rules

### Secrets and configuration
- No secrets, tokens, or keys in scripts, Dockerfiles, or CI config — use CI secret vars
- Environment-specific config injected at runtime, not baked into artifacts
- `.env` files never committed — confirm `.gitignore` is correct before any pipeline change

### CI/CD discipline
- Every pipeline change: confirm it runs to completion before merging
- Pipeline must include: build → lint → test → (deploy if main/release branch)
- A red test suite must block deployment — no bypass flags
- Artifacts are versioned — every build produces a traceable artifact

### Docker and containers
- Base images: pin to a specific version tag — never use `latest`
- Minimal images: only include what is needed to run, not to build
- Non-root user in containers unless a specific reason requires root

### Infrastructure as code
- Document every non-obvious command in `.agent/WORKFLOWS.md`
- Destructive operations (delete, scale to zero) require explicit confirmation
- Changes to shared infra (databases, queues) need an ADR before applying

## Done-when — DevOps task is not complete until
- [ ] Pipeline runs to completion with no failures
- [ ] No secrets in committed files
- [ ] WORKFLOWS.md updated if commands changed
- [ ] Rollback procedure exists for deployment changes
- [ ] `docs-registry.md` checked — DevOps-owned rows updated; any new `.md` files created added to registry
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific DevOps rules — {{PROJECT_NAME}}

*(Fill in during install or first DevOps session)*

- CI/CD platform: *(e.g. GitHub Actions, GitLab CI, Jenkins, CircleCI)*
- Container platform: *(e.g. Docker, Kubernetes, none)*
- Cloud provider: *(e.g. AWS, GCP, Azure, none)*
- Owned paths: *(Agent: fill from scan — e.g. .github/workflows/, Dockerfile, infra/)*
- Release branch convention: *(e.g. main = auto-deploy, release/* = manual)*
<!-- PROJECT:END -->
