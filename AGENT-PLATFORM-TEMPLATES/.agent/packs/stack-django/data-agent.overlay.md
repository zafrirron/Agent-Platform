# Django overlay — data-agent

> Active only when `stack-django` is in `active_packs`. Read **after** `data-agent.md`.

## Migrations (Django-specific)

- **One migration per logical schema change**; review the generated migration before committing — autodetector guesses can be wrong (renames, `default` backfills).
- **Backfills for large tables run separately** from the schema change (data migration + batched updates), never as a column `default` on millions of rows.
- **Never edit an applied migration.** Add a new one.
- **`null=True` vs `blank=True`** are different concerns (DB nullability vs form validation) — set both intentionally.
- Add explicit `db_index=True` / `Meta.indexes` for fields used in filters/ordering; measure with `.explain()`.
- Reversible migrations: provide `reverse_code` for `RunPython`.
