# API patterns — {{PROJECT_NAME}}

> Agentic conventions for building or consuming HTTP APIs.

| Pattern | Rule |
|---------|------|
| Schema first | OpenAPI / JSON Schema before handler code |
| Contract discipline | Additive changes only; breaking = version bump |
| Versioning | `/v1/` prefix from day one |
| Errors | `{ "error": "code", "message": "...", "details": {} }` |
| Idempotency | POST in retry loops must be idempotent |
| Auth | Tokens from env; never hardcoded or logged |
| Rate limits | Handle 429 with backoff + jitter |
| Pagination | Cursor-based; handle empty pages |
| Correlation | `X-Request-ID` on requests and logs |
| Mock first | Stub before real upstream |
| Contract tests | One test per documented behavior |

Update `.agent/context/api-contracts.md` when endpoints change.
