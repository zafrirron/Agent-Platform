# Fintech reference architecture — curated

> Read this when the user asks *"give me a reference architecture for a fintech / payments app"* (or similar). This is a distilled, opinionated starting point. The **linked source apps** below are real, studyable implementations — point the user to them, respecting each license.

## Source apps (study these real implementations)

| Repo | License | What to study |
|------|---------|---------------|
| [apache/fineract](https://github.com/apache/fineract) | Apache-2.0 | Double-entry accounting, chart of accounts, multi-tenancy. **Code reusable** under Apache-2.0. |
| [firefly-iii/firefly-iii](https://github.com/firefly-iii/firefly-iii) | AGPL-3.0 | Transaction/account modelling, double-entry integrity. **Copyleft — study, don't copy.** |
| [frappe/erpnext](https://github.com/frappe/erpnext) | GPL-3.0 | Ledger posting, reconciliation, tax. **Copyleft — study, don't copy.** |

> Licenses matter: AGPL/GPL are copyleft — safe to *learn from*, risky to *copy into* a closed product. Prefer Apache-2.0 (Fineract) when you need reusable code.

## Core building blocks

1. **Double-entry ledger (source of truth).** Money state is an append-only journal of balanced debits/credits — never a mutable `balance` column. Balances are derived (or materialized as a cache you can rebuild from the journal).
2. **Idempotent money operations.** Every write carries an idempotency key; retries must never double-charge. (The platform's registry already models idempotency keys — reuse that discipline.)
3. **Strong consistency at the transaction boundary.** Transfers are atomic (`transaction.atomic` / DB tx / saga with compensation). No partial postings.
4. **Provider abstraction (PSP-agnostic).** Wrap Stripe/Adyen/Plaid behind an interface; never leak provider types into the domain. Handle provider webhooks idempotently with signature verification.
5. **Async settlement & reconciliation.** Authorize synchronously; capture/settle/reconcile asynchronously. A daily reconciliation job compares internal ledger vs provider statements.
6. **Auditability.** Immutable audit log for every state change (who/what/when/amount/before/after). Required for disputes and compliance.

## Reference shape

```
[client] → [API gateway/auth] → [payments service] → [ledger service (double-entry)]
                                        │                     │
                                        ▼                     ▼
                                 [PSP adapter]          [event bus]
                                        │                     │
                                        ▼                     ▼
                               [provider webhooks]   [reconciliation worker]
```

## Non-negotiables (see also `fintech-compliance.md`)

- Never store PAN/CVV — tokenize via the PSP; stay out of PCI scope where possible.
- Money as integer minor units (cents) + explicit currency; never floats.
- Every amount has a currency; no cross-currency arithmetic without an explicit FX step.
- All money endpoints authenticated, authorized, rate-limited, and audit-logged.

## How this grows

A maintainer enriches this file (and `reference_sources`) via pack-scoped scans:
`Read MAINTAINER/github-governance-scan.md and execute it. repo=<fintech-app> pack=domain-fintech`
