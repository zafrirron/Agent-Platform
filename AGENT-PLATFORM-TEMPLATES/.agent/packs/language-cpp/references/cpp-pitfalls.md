# C++ pitfalls — curated, failure-derived

> Thin reference for `language-cpp`. Each entry is a real footgun with the fix.

## <a id="leak-on-throw"></a>Leak / double-free on the exception path
`new` followed by work that can throw before `delete` leaks; manual `delete` on two paths double-frees. **Fix:** RAII — `unique_ptr`/containers own the resource; destruction is automatic and exception-safe.

## <a id="dangling"></a>Dangling references & invalidated iterators
Returning a reference/pointer to a local, or holding an iterator across a `push_back` that reallocates, is use-after-free. **Fix:** return by value/owning type; re-acquire iterators after mutation; prefer indices or stable containers.

## <a id="use-after-move"></a>Use-after-move
A moved-from object is valid-but-unspecified; reading its value is a bug. **Fix:** don't use after `std::move` except to reassign/destroy.

## <a id="rule-of-5"></a>Rule of 3/5/0 violations
Adding a destructor but relying on the implicitly-defaulted copy gives shallow copies → double-free. **Fix:** Rule of 0 (own via members that manage themselves) or define all five.

## <a id="data-race"></a>Data races are UB
Concurrent unsynchronized access to the same object (one being a write) is undefined — not "usually fine". **Fix:** `std::mutex`/`std::atomic`, or don't share mutable state.

## <a id="narrowing"></a>Narrowing & uninitialized reads
Implicit narrowing (`int`→`char`) and reading uninitialized members are UB/data loss. **Fix:** brace-init (`{}`) to catch narrowing; initialize every member; use `-Wall -Wextra`.
