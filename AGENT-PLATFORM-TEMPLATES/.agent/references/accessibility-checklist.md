# Reference: Accessibility checklist

> Condensed from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) `references/accessibility-checklist.md` (MIT). Platform standard: **WCAG 2.2 AA**. Use with `accessibility-audit.md` and Frontend expert.

## Keyboard
- [ ] All interactive elements reachable and operable via keyboard alone
- [ ] Focus order logical; focus visible (not removed with `outline: none` without replacement)
- [ ] No keyboard traps in modals — Esc closes, focus returns

## Screen readers
- [ ] Form inputs have associated `<label>` or `aria-label`
- [ ] Errors linked via `aria-describedby`
- [ ] Async status uses `aria-live="polite"` (or equivalent)
- [ ] Icon-only controls have accessible name

## Visual
- [ ] Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large text/UI components)
- [ ] Information not conveyed by colour alone
- [ ] Touch targets ≥ 44×44px where applicable

## ARIA
- [ ] Prefer native HTML elements over custom widgets
- [ ] ARIA roles/states match actual behaviour — no redundant or incorrect ARIA

## Testing
- [ ] Keyboard-only pass on changed flows
- [ ] Automated scan (axe, Lighthouse) on changed pages — Critical/High issues fixed

## Evidence
- `accessibility-audit` report or Critic `[ACCESSIBILITY]` gate: zero Critical/High before handoff
