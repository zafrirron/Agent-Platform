# TypeScript overlay — code experts (backend / frontend / data / test)

> Active only when `language-typescript` is in `active_packs`. Read **after** the routed expert file, for **any** TypeScript code task (a `language` pack loads for every code-writing expert, not just one). These refine — never override — the generic expert. Verify against the project's `tsconfig.json` when in doubt.

## Hard rules (TypeScript-specific)

- **`strict` is the floor.** Assume `strict: true`. If `tsconfig.json` disables it, flag it in review — don't silently write loose code.
- **No `any` to escape a type error.** Use `unknown` + narrowing, generics, or a precise type. `any` disables checking transitively. `// @ts-ignore` needs a written reason and a `@ts-expect-error` where possible.
- **Validate external data at the boundary.** `JSON.parse`, `fetch`, env vars, and request bodies are `unknown` — parse with a schema (zod/valibot/io-ts) before treating them as typed. A type assertion (`as T`) is not validation.
- **Prefer `type`/discriminated unions over enums** for domain states; use `as const` for literal inference. Model impossible states out of existence.
- **`unknown` over `any`, `readonly` for inputs, `satisfies` to keep inference** while constraining shape.
- **No non-null `!` on values that can actually be null** — narrow instead. `!` is a lie the compiler can't catch at runtime.

## Review lens (add to the generic checklist)

- Type assertions (`as`) hiding a real mismatch instead of fixing the type.
- `any` / implicit `any` leaking through function boundaries.
- External input consumed without runtime validation.
- Enums where a union + `as const` is simpler and tree-shakeable.
- Promises not awaited / floating (`no-floating-promises`); `async` functions whose rejections are unhandled.

## Version / config awareness

Read `tsconfig.json` (`target`, `module`, `moduleResolution`, `strict`) and `typescript` in `package.json`.
- **5.x:** use `satisfies`, `const` type params, decorators (stage-3) where configured.
- Match `moduleResolution` (`bundler` vs `node16`) — import extensions differ.
