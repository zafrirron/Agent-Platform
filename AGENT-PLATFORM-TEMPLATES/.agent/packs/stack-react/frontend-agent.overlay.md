# React overlay — frontend-agent

> Active only when `stack-react` is in `active_packs`. Read **after** `frontend-agent.md`. These are opinionated, failure-derived rules — they refine (never override) the generic frontend expert. When in doubt, verify against the version in the project's `package.json`.

## Hard rules (React-specific)

- **No derived state in `useEffect` + `setState`.** Compute during render or with `useMemo`. An effect that only syncs one state to another causes an extra render and tearing. See `references/react-pitfalls.md#derived-state`.
- **Every effect declares complete deps.** No disabling `react-hooks/exhaustive-deps` without a written reason. Missing deps = stale closures.
- **Keys must be stable and data-derived.** Never array index for reorderable/insertable lists — causes state bleed across rows.
- **Never mutate state.** Return new objects/arrays; mutation skips re-render and breaks `memo`/`useMemo` reference checks.
- **Data fetching:** use the project's data layer (React Query/SWR/RSC) — do not hand-roll fetch-in-`useEffect` for anything cacheable. If none exists, flag it in review.

## Review lens (add to the generic frontend checklist)

- Unnecessary `'use client'` on components that could stay server components (Next/RSC).
- `useEffect` doing work that belongs in an event handler or during render.
- Context provider whose value is a new object each render (no `useMemo`) → re-renders all consumers.
- Large lists without virtualization (`react-window`/`react-virtual`).
- `key={index}` on dynamic lists.

## Version awareness

Read `package.json` for the React major.
- **19+:** prefer the `use` hook, Actions, and `ref` as a prop; `forwardRef` is legacy.
- **18:** concurrent features, `useTransition`, automatic batching — don't fight batching with forced flushes.
- **≤17:** no automatic batching outside events; legacy root API.
