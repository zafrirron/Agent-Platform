# Fintech compliance & pitfalls — curated reference

> Load on demand. Domain invariants and compliance traps for payments/banking. Not legal advice — confirm scope with a compliance owner.

## money-as-float
**Never** represent money as floating point. Use integer minor units (cents) + currency code, or a decimal type with fixed scale. Floats lose pennies and fail audits.

## pan-storage
Never store the full card number (PAN) or CVV. Tokenize via the PSP. Storing PAN pulls you into full PCI-DSS scope (SAQ D) — avoid it. Log **tokens**, never card data.

## idempotency
Every money-moving endpoint accepts an idempotency key; the same key returns the same result without re-executing. Webhooks from PSPs must be processed idempotently (they retry).

## webhook-verification
Verify PSP webhook signatures before acting. Unverified webhooks = forged payments. Reject on signature mismatch; process async after verification.

## ledger-integrity
Balances are derived from a balanced double-entry journal, not a mutable column. Sum of debits == sum of credits for every transaction. Provide a rebuild-from-journal path.

## audit-log
Immutable audit trail for every state change (who/what/when/amount/before/after). Required for disputes, chargebacks, and regulators. Append-only; never editable.

## pci-logging
Never log card data, full PAN, CVV, or full track data. Mask/redact PII in logs. This overlaps the core security expert — treat as a hard gate.

## reconciliation
Automate daily reconciliation: internal ledger vs PSP settlement reports. Alert on mismatch. Silent drift is how money is lost.
