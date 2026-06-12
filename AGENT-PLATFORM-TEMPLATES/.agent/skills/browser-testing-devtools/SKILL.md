---
name: browser-testing-devtools
description: Browser testing via Chrome DevTools MCP when available — DOM, console, network, performance. Optional; requires MCP setup.
attribution: Inspired by addyosmani/agent-skills (MIT)
---

## Overview

Use **live runtime evidence** for UI bugs — not guesses from source alone.

## Prerequisites

- Chrome DevTools MCP server configured in your IDE (Cursor: MCP settings; Claude: plugin/MCP).
- If MCP unavailable: fall back to Playwright/Cypress tests per `test-driven-development` skill.

## Process

1. Reproduce issue in browser.
2. Inspect DOM, console errors, network failures, performance trace.
3. Form hypothesis; fix; re-verify in browser.
4. Add regression test so MCP is not required next time.

## Verification

- [ ] Runtime evidence cited (screenshot, log line, or network status)
- [ ] Regression test added when fixing a bug
