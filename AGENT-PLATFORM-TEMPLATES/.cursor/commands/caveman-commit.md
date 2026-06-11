Generate a conventional commit message under 50 characters in caveman style.

Rules:
- Format: `type(scope): description` — total ≤50 chars
- Types: feat/fix/docs/chore/refactor/test/style/perf
- No filler, no period at end
- Scope optional; only add if it clarifies
- Output commit message only — no explanation

If no staged changes visible, ask user to describe the change in one clause.
