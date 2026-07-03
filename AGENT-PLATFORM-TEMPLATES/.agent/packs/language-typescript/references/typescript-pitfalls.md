# TypeScript pitfalls — curated, failure-derived

> Thin reference for `language-typescript`. Each entry is a real footgun with the fix.

## <a id="assertion-vs-validation"></a>Type assertion ≠ runtime validation
`data as User` tells the compiler to trust you; it does nothing at runtime. If `data` came from `fetch`/`JSON.parse`/a form, a bad shape crashes later, far from the cause. **Fix:** parse with a schema (`User.parse(data)`) at the boundary; the parsed value is both validated and typed.

## <a id="any-leak"></a>`any` leaks transitively
One `any` (or an untyped 3rd-party import) silently disables checking for everything it touches. **Fix:** `unknown` + narrowing; type external modules; enable `noImplicitAny`.

## <a id="floating-promises"></a>Floating promises
An un-awaited async call swallows rejections and races. **Fix:** `await`, `void` it deliberately, or `.catch()`; enable `@typescript-eslint/no-floating-promises`.

## <a id="enum-traps"></a>`enum` traps
Numeric enums allow reverse-mapping and accept any number; `const enum` breaks under isolatedModules/bundlers. **Fix:** union of string literals + `as const`.

## <a id="index-signature"></a>Index-signature access is not safe by default
Without `noUncheckedIndexedAccess`, `arr[i]` / `record[key]` is typed as present even when it isn't. **Fix:** enable `noUncheckedIndexedAccess`; handle `undefined`.

## <a id="structural"></a>Structural typing surprises
Excess-property checks only fire on object literals; a variable with extra props passes. Don't rely on nominal behavior. **Fix:** use `satisfies` and branded types where identity matters.
