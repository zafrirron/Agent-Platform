# Django pitfalls — curated reference

> Load on demand. Thin by design — highest-frequency, failure-derived traps. For the long tail, read the official Django docs for the project's version.

## n-plus-1
**Symptom:** one query per row while iterating a queryset (e.g. `for o in orders: o.customer.name`).
**Fix:**
```python
# bad: 1 + N queries
for o in Order.objects.all():
    print(o.customer.name)
# good: 1 query
for o in Order.objects.select_related('customer'):
    print(o.customer.name)
# M2M / reverse FK
Order.objects.prefetch_related('items')
```
Detect with Django Debug Toolbar or `CaptureQueriesContext` in tests.

## settings-secrets
**Symptom:** `SECRET_KEY`, DB creds, or `DEBUG=True` hardcoded.
**Fix:** read from env (`os.environ` / `django-environ`); `DEBUG=False` and explicit `ALLOWED_HOSTS` in prod.

## fat-view
**Symptom:** business logic + validation + queries all in the view.
**Fix:** validation → serializer/form; business logic → service/model methods; view orchestrates only.

## migration-backfill
**Symptom:** adding a non-null column with a default to a huge table locks it.
**Fix:** add nullable → data-migrate in batches → set non-null in a later migration.

## atomic-invariant
**Symptom:** partial writes leave inconsistent state on error.
**Fix:**
```python
from django.db import transaction
with transaction.atomic():
    debit(a); credit(b)
```
