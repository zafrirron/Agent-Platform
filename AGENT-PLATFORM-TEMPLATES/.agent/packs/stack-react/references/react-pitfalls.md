# React pitfalls — curated reference

> Load on demand (linked from the overlay). Thin by design: the highest-frequency, failure-derived traps. For the long tail, read the official React docs for the project's version.

## derived-state
**Symptom:** state that mirrors a prop/other state, synced via `useEffect`.
**Fix:** compute during render; memoize if expensive.
```jsx
// bad
const [full, setFull] = useState('');
useEffect(() => setFull(`${first} ${last}`), [first, last]);
// good
const full = `${first} ${last}`;
```

## stale-closure
**Symptom:** handler/effect reads an old value of state/props.
**Fix:** complete dependency arrays; use functional updates `setX(x => x + 1)`; or `useRef` for values you must read without re-subscribing.

## key-index
**Symptom:** wrong row keeps focus/checkbox state after insert/reorder.
**Fix:** stable id key (`item.id`), never the array index for dynamic lists.

## context-rerender
**Symptom:** every consumer re-renders on unrelated changes.
**Fix:** `useMemo` the provider value; split contexts by change frequency.
```jsx
const value = useMemo(() => ({ user, setUser }), [user]);
```

## effect-as-handler
**Symptom:** logic in `useEffect` that should run on a user action.
**Fix:** move it into the event handler. Effects are for synchronizing with external systems, not reacting to clicks.

## fetch-in-effect
**Symptom:** hand-rolled fetch-in-`useEffect` with no cache/dedupe/cancellation → waterfalls, races.
**Fix:** React Query / SWR / RSC. If unavailable, at minimum abort on unmount and dedupe.
