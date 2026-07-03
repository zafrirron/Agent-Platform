# Fintech overlay — backend-agent

> Active only when `domain-fintech` is in `active_packs`. Read **after** `backend-agent.md`.

## Hard rules (fintech domain)

- **Money = integer minor units + currency.** No floats for money, ever. No cross-currency arithmetic without an explicit FX conversion step.
- **Double-entry ledger is the source of truth.** No mutable `balance` column as the authority; balances derive from a balanced journal. See `references/reference-architecture.md`.
- **Idempotency on every money operation.** Require an idempotency key; retries must not double-charge.
- **Atomic transfers.** Debit+credit in one transaction (or saga with compensation). No partial postings.
- **PSP behind an interface.** Never leak Stripe/Adyen/Plaid types into the domain; verify + idempotently handle webhooks.
- **Immutable audit log** for every money state change.

## Reference-architecture requests
When the user asks for a reference architecture / "how should I structure a payments app", read `references/reference-architecture.md` and present the building blocks **plus the linked source apps** (respecting each license) so they can study real implementations.

## Review lens (add to generic backend checklist)
- Float money types; missing currency; mutable-balance authority.
- Missing idempotency keys on charge/transfer/refund endpoints.
- Unverified PSP webhooks; non-atomic transfers; missing audit log.
