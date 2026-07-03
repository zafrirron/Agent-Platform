# C++ overlay — code experts (backend / test)

> Active only when `language-cpp` is in `active_packs`. Read **after** the routed expert file, for **any** C++ code task. These refine — never override — the generic expert. Verify against the project's standard (`CMakeLists.txt` → `CMAKE_CXX_STANDARD`).

## Hard rules (C++-specific)

- **RAII for every resource.** Ownership is expressed with types (`unique_ptr`/`shared_ptr`, containers, lock guards) — never a raw `new`/`delete` pair in application code. No manual `free`/`delete` in the happy path.
- **Rule of 0 / Rule of 5.** Prefer classes that need no custom destructor/copy/move (Rule of 0). If you write one of {destructor, copy ctor, copy assign, move ctor, move assign}, address all five.
- **No owning raw pointers.** Raw pointers/references are non-owning views only. Ownership = smart pointers or containers.
- **Undefined behavior is a bug, not a style choice.** No out-of-bounds access, use-after-move, signed overflow, uninitialized reads, or data races. Prefer `.at()`/`gsl::span`/bounds-checked access in non-hot paths.
- **`const`-correctness and references.** Pass read-only params by `const&` (or value for cheap types); mark member functions `const`; prefer `constexpr` where evaluable at compile time.
- **Concurrency:** protect shared data with `std::mutex`/`std::atomic`; a data race is UB. Prefer message passing / immutable snapshots over shared mutable state.

## Review lens (add to the generic checklist)

- Raw `new`/`delete`, or `delete` reachable only on the non-exception path (leak on throw).
- Dangling references/iterators (returning a ref to a local; invalidation after container resize).
- Use-after-move; missing `std::move` where a copy is expensive.
- Missing/incorrect special members after adding a destructor.
- Narrowing conversions, uninitialized members, implicit copies of large objects.
- Locks held across blocking calls; inconsistent lock ordering (deadlock risk).

## Version awareness

Read `CMAKE_CXX_STANDARD` / compiler flags.
- **C++20/23:** concepts, ranges, `std::span`, `std::expected` (23) for error paths, `constexpr` more broadly.
- **C++17:** `std::optional`/`variant`/`string_view`, structured bindings, `if constexpr`.
- **C++14/11:** smart pointers, `auto`, move semantics, `nullptr` — avoid raw owning pointers even here.
