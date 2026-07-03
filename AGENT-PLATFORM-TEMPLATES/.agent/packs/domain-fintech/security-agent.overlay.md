# Fintech overlay — security-agent

> Active only when `domain-fintech` is in `active_packs`. Read **after** `security-agent.md`.

## Hard gates (fintech domain)

- **No card data at rest or in logs.** Never store/log PAN, CVV, or full track data. Tokenize via the PSP; stay out of PCI-DSS SAQ D scope where possible. See `references/fintech-compliance.md`.
- **PII redaction in logs** is mandatory, not optional.
- **Webhook signature verification** before any state change.
- **Idempotency + replay protection** on money endpoints.
- **Immutable audit trail** for money movements (dispute/regulator requirement).
- **Least privilege** on payment credentials; rotate PSP keys; secrets from a vault, never code.

## Review lens
- Grep for card-number patterns in logs/DB models.
- Unverified webhook handlers.
- Money endpoints missing authz/rate-limit/audit.
- Secrets or PSP keys in source.
