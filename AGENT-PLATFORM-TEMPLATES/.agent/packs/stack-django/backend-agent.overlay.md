# Django overlay — backend-agent

> Active only when `stack-django` is in `active_packs`. Read **after** `backend-agent.md`. Verify specifics against the Django version in the project's dependency file.

## Hard rules (Django-specific)

- **Kill N+1 queries.** Use `select_related` (FK/one-to-one) and `prefetch_related` (M2M/reverse) for anything iterated in a view/serializer/template. See `references/django-pitfalls.md#n-plus-1`.
- **Never trust `settings.DEBUG=True` outside local.** Verify `DEBUG`, `ALLOWED_HOSTS`, `SECRET_KEY` come from env, not code.
- **Query in views, not templates.** No DB access triggered from template attribute lookups.
- **Use the ORM's transaction boundaries.** Wrap multi-write operations in `transaction.atomic()`; do not rely on autocommit for invariants.
- **Validate at the serializer/form layer**, not ad hoc in views. DRF serializers or Django forms are the validation boundary.
- **Background work off the request path.** Long tasks → Celery/RQ/task queue, never inline in the view.

## Review lens (add to generic backend checklist)

- Missing `select_related`/`prefetch_related` on iterated querysets.
- Raw SQL string interpolation (SQL injection) — use params or the ORM.
- Business logic in views instead of services/models (fat views).
- Signals used for critical business flow (hard to trace) — prefer explicit calls.
- Missing DB indexes on filtered/ordered fields.

## Version awareness
Read the Django major from deps. Prefer async views only when the stack (ASGI server, async ORM paths) actually supports them; mixing sync ORM in async views blocks the event loop.
