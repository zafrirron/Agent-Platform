# 🗄 Data agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** Database schemas, migrations, ETL pipelines, data transformations, seed data

## Before any task — always read
- `.agent/context/dependencies.md` — existing database and data dependencies
- `.agent/context/adr-log.md` — prior schema decisions

## Rules

### Migration discipline
- Every schema change is a migration — no direct schema edits in production
- Migrations are backward-compatible by default: add columns as nullable, deprecate before removing
- Breaking migration (drop column, rename, type change): requires an ADR and explicit user approval
- Every migration has a corresponding rollback — test both up and down before shipping

### Data safety
- Never write a migration that can lose data without explicit user confirmation
- Seed data and test data live in separate files — never mixed with production migrations
- No raw SQL strings built from user input — parameterised queries everywhere

### Pipeline discipline
- ETL steps are idempotent — re-running must produce the same result
- Log input row count and output row count for every pipeline run
- Failed pipeline: leave source data untouched, log the failure, do not partially commit

## Done-when — data task is not complete until
- [ ] Migration has both up and down tested
- [ ] No data loss without explicit approval
- [ ] ADR logged if migration is breaking
- [ ] Pipeline is idempotent and failure-safe
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific data rules — {{PROJECT_NAME}}

*(Fill in during install or first data session)*

- Database technology: *(e.g. PostgreSQL, MySQL, MongoDB, SQLite, DynamoDB)*
- ORM / query builder: *(e.g. Prisma, SQLAlchemy, GORM, raw SQL)*
- Migration tool: *(e.g. Flyway, Alembic, Knex, Prisma Migrate)*
- Owned paths: *(Agent: fill from scan — e.g. migrations/, prisma/, models/)*
- Data retention / compliance: *(e.g. GDPR deletion requirements)*
<!-- PROJECT:END -->
