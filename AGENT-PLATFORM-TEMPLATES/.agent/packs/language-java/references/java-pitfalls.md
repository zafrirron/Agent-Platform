# Java pitfalls — curated, failure-derived

> Thin reference for `language-java`. Each entry is a real footgun with the fix.

## <a id="equals-string"></a>`==` on objects/Strings
`==` compares references, not content; it "works" for interned small values and fails in production. **Fix:** `Objects.equals(a, b)` / `a.equals(b)`.

## <a id="resource-leak"></a>Resource leaks
Manual `close()` in `finally` is easy to get wrong (exception in `close`, early return). **Fix:** try-with-resources for every `AutoCloseable`.

## <a id="mutable-shared"></a>Mutable shared state across threads
Unsynchronized reads/writes cause visibility and race bugs that pass locally and fail under load. **Fix:** immutability, `java.util.concurrent` types, or documented locking.

## <a id="date-format"></a>`SimpleDateFormat` is not thread-safe
Sharing one instance across threads corrupts output silently. **Fix:** `java.time` (`DateTimeFormatter` is immutable/thread-safe).

## <a id="npe-optional"></a>Returning `null` collections/values
Callers forget the null check → NPE far from the source. **Fix:** return empty collections; `Optional<T>` for scalar absence.

## <a id="stream-side-effects"></a>Side effects in streams
Mutating external state inside `map`/`forEach` breaks under parallel streams and hurts readability. **Fix:** collect to a result; keep stream operations pure.
