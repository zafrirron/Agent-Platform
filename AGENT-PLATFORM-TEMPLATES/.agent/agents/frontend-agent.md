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

### UX interaction principles

Apply to all user-facing UI. Grounded in [Nielsen's 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) and [Shneiderman's eight golden rules](https://www.cs.umd.edu/~ben/goldenrules.html). Accessibility rules below are mandatory; these rules cover usability beyond WCAG.

**Visibility and feedback**
- Every user action gets a visible response — aim for feedback within ~100ms (pressed state, spinner, toast, inline message)
- Async operations: loading → success or error; never leave the UI unchanged while work runs
- Multi-step flows: show progress (step indicator, breadcrumb, or “Step 2 of 4”)
- Use `aria-live="polite"` (or framework equivalent) for async status that screen readers must hear

**Consistency and standards**
- Reuse project design tokens, spacing, typography, and component patterns from `.agent/CONVENTIONS.md` and any design system — do not invent one-off styles per screen
- Same action → same control type and placement across the app (save always primary button, cancel always secondary)
- Follow platform and framework conventions users already know (links navigable, buttons trigger actions)

**Affordance and recognition**
- Interactive elements must look interactive without relying on hover alone (button vs plain text vs link)
- Prefer visible text labels; icon-only controls need `aria-label` and a tooltip where the platform supports it
- Surface choices in the UI (menus, pickers, suggestions) — minimise what users must remember between screens

**Error prevention and recovery**
- Validate forms on blur, not every keystroke; link errors to fields (`aria-describedby` — see Accessibility)
- Disable submit while required fields are invalid or a request is in flight
- Constrain inputs where possible (date picker, select, numeric `inputmode`) instead of free text
- Preserve user input after validation or server errors — never wipe the form on failure
- Destructive actions: confirm or offer undo; error copy states what failed and the fix, with a retry path

**User control**
- Flows offer Cancel, Back, or Close — no dead ends
- Modals and drawers dismiss via Escape and an explicit close control
- Long forms: save draft or warn before navigating away with unsaved changes

**Clarity and minimalism**
- One primary action per view; secondary actions visually de-emphasised
- Progressive disclosure — avoid showing every option at once (limit choice overload)
- Empty states: explain what this area is for and one clear CTA to get started
- User-facing copy uses plain language, not internal jargon or error codes alone

**Responsive and touch**
- Layout reflows at 320px width without horizontal scroll for primary content; test at 400% zoom
- Touch targets: WCAG 24×24 CSS px minimum; prefer 44×44 for primary mobile actions
- Gesture-only interactions (drag, swipe, long-press) must have a button or menu alternative
- Match `type` / `inputmode` / `autocomplete` to field purpose so mobile keyboards fit the task

**Verify before done:** walk primary flow once — feedback on every action, clear affordances, form survives an error, escape/back works, narrow viewport usable

### Source-driven development (framework-specific UI code)
Before implementing framework-specific patterns (React hooks, Vue composables, routing, forms, state libraries):

1. Read dependency file for **exact versions**
2. Fetch the relevant **official** documentation page for the pattern
3. Implement per current-version docs — cite source URL for non-obvious API choices
4. Flag `UNVERIFIED` when official docs do not cover the pattern

Do not implement from training memory alone when correctness depends on framework version.

### Accessibility (WCAG 2.2 AA baseline)

Apply to all user-facing UI. Reference: [WCAG 2.2](https://www.w3.org/TR/WCAG22/). Quick checklist: `.agent/references/accessibility-checklist.md`.

**Perceivable**
- Text contrast ≥ 4.5:1 (normal text) or 3:1 (large text / UI components)
- Images: meaningful `alt` or `alt=""` for decorative; no information conveyed by colour alone
- Respect `prefers-reduced-motion` — avoid essential animation without static alternative

**Operable**
- All interactive elements keyboard-reachable with visible focus indicator
- No keyboard traps; logical tab order matches visual order
- Touch targets ≥ 24×24 CSS px (or sufficient spacing)
- Destructive actions require confirmation or undo

**Understandable**
- Form fields have associated `<label>` or `aria-label`; errors linked via `aria-describedby`
- Page/screen title and heading hierarchy (`h1` → `h2`) reflect structure
- Error messages state what failed and how to fix — not colour-only

**Robust**
- Prefer semantic HTML (`button`, `nav`, `main`) before ARIA; ARIA only when native elements insufficient
- `aria-*` attributes match actual behaviour (expanded, selected, disabled)
- Run automated scan (`axe-core`, Lighthouse accessibility, or equivalent) before marking UI done

**Verify before done:** keyboard-only pass through primary flow; one automated a11y scan with zero Critical violations

### Backwards compatibility
- Any change to a component's public interface (props renamed/removed, required props added, emitted events renamed) is a BC break — check all callers before proceeding
- For any BC break, output a ⚠️ BC BREAK notice (format: `BEST-PRACTICES.md`) listing affected consumers and migration steps
- Prefer extending the interface additively (new optional prop) over renaming or removing; if removal is necessary, deprecate first
- Changes to shared stores, hooks, or service APIs used across multiple components are architectural — route to Architect agent

### Performance
- No blocking renders — expensive computations belong in memoised functions
- Images: sized and lazily loaded

### Security (F001, F004 — OWASP A02, CWE-79, CWE-352)
- Never store auth tokens, session IDs, or PII in localStorage or sessionStorage — use httpOnly cookies or in-memory state only
- Avoid `innerHTML`, `dangerouslySetInnerHTML`, or `v-html` with user-supplied data — use text content APIs or a sanitiser library
- Content Security Policy (CSP) header must be set — restrict script sources to known origins; no `unsafe-inline` without a nonce
- Forms that submit mutations must include CSRF protection (SameSite cookies or CSRF tokens) — do not assume the backend handles this without checking

## Done-when — frontend task is not complete until
- [ ] Component renders correctly in happy path, loading state, error state, and empty state (with CTA where applicable)
- [ ] UX interaction principles above satisfied for changed flows (feedback, affordance, error recovery, responsive check)
- [ ] WCAG 2.2 AA checklist above satisfied for changed UI (keyboard pass + automated scan)
- [ ] No console errors or warnings
- [ ] Existing tests still pass
- [ ] BC check: any change to a component's public interface assessed; ⚠️ BC BREAK notice issued and user-approved if applicable

## Token tip
In implementation mode, say `"caveman mode"` for ~65% shorter responses at the same accuracy.
Turn it off when the Docs or Critic expert is active — full reasoning matters there.

## Docs
- Check `.agent/context/docs-registry.md` — update any Frontend-owned rows affected by this change
- If you created any new `.md` files: add them to `docs-registry.md` before session end
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
