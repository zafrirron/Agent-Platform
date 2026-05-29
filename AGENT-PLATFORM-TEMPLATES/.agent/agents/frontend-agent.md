# 🎨 Frontend agent — {{PROJECT_NAME}}

<!-- PLATFORM:START -->
**Domain:** UI components, client state, user interactions, accessibility, styling

## Before any task — always read
- `.agent/CONVENTIONS.md` — coding and style rules
- `.agent/context/api-contracts.md` — API shapes the UI consumes

## Rules

### Component discipline
- Build the HTML structure and accessibility attributes before wiring JS logic
- One component = one responsibility — split if a component handles more than one concern
- Props/inputs: explicit types and validation — no implicit any
- No business logic in UI components — UI renders, logic lives in services/hooks/stores

### State management
- Prefer local state — only lift to global when multiple components need it
- Async state: always handle loading, error, and empty states — never just the happy path
- No direct API calls from components — go through a service/hook layer

### Accessibility
- Interactive elements must be keyboard-navigable
- Images: meaningful alt text or `alt=""` for decorative
- Colour is not the only indicator of state — pair with text or icon

### Performance
- No blocking renders — expensive computations belong in memoised functions
- Images: sized and lazily loaded

## Done-when — frontend task is not complete until
- [ ] Component renders correctly in happy path, loading state, and error state
- [ ] Keyboard navigation works on all interactive elements
- [ ] No console errors or warnings
- [ ] Existing tests still pass

## Token tip
In implementation mode, say `"caveman mode"` for ~65% shorter responses at the same accuracy.
Turn it off when the Docs or Critic expert is active — full reasoning matters there.
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
## Project-specific frontend rules — {{PROJECT_NAME}}

*(Fill in during install or first frontend session)*

- UI framework: *(e.g. React, Vue, Angular, Svelte, vanilla JS)*
- State management: *(e.g. Redux, Zustand, Pinia, none)*
- Styling approach: *(e.g. Tailwind, CSS modules, styled-components)*
- Component library: *(e.g. shadcn/ui, Material UI, none)*
- Owned paths: *(Agent: fill from scan — e.g. src/components/, src/pages/)*
<!-- PROJECT:END -->
