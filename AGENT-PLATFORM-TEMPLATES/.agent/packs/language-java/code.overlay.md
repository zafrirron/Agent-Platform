# Java overlay — code experts (backend / data / test)

> Active only when `language-java` is in `active_packs`. Read **after** the routed expert file, for **any** Java code task. These refine — never override — the generic expert. Verify against the project's Java version (`pom.xml`/`build.gradle` → `release`/`sourceCompatibility`).

## Hard rules (Java-specific)

- **Prefer immutability.** `final` fields, `record` for data carriers, unmodifiable collections. Shared mutable state is the default source of concurrency bugs.
- **`Optional` for return types that may be absent** — never `null` from a public API; never `Optional` for fields or parameters.
- **Close resources with try-with-resources.** Any `AutoCloseable` (streams, connections, locks-as-resources) must be in a `try (…)` block — no manual `finally { close() }`.
- **`equals`/`hashCode` come as a pair** and must use the same fields; prefer `record` or `Objects.equals`/`Objects.hash`. Never use `==` for object/`String` content comparison.
- **Concurrency:** guard shared state with `java.util.concurrent` (e.g. `ConcurrentHashMap`, `AtomicX`, `ExecutorService`) — not hand-rolled `synchronized` unless justified. Don't leak `this` from a constructor. Prefer immutable messages between threads.
- **No checked-exception swallowing.** Don't `catch (Exception e) {}`; wrap with context or let it propagate.

## Review lens (add to the generic checklist)

- Mutable static state / singletons without thread-safety.
- Streams doing side effects in `forEach` where a collector fits; or reusing a consumed stream.
- Resource leaks (missing try-with-resources).
- Boxing in hot paths / `Integer`-key maps where primitives fit.
- Broad `catch` blocks that hide the cause; empty catch.
- `SimpleDateFormat`/`Date` instead of `java.time` (thread-safety + clarity).

## Version awareness

Read the configured Java release.
- **21+ (LTS):** virtual threads, pattern matching for `switch`, records + sealed types for domain modeling.
- **17 (LTS):** records, sealed classes, `switch` expressions.
- **11 (LTS):** `var` for locals, no newer preview features.
