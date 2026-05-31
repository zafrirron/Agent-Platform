<!-- PLATFORM:START -->
# Agent Platform — Global Bootstrap
Framework: antigravity

If this workspace contains `AGENTS.md`:
  Read `AGENTS.md` Section 2. Auto-route all tasks silently.
  Session start: read `.agents/prompts/session-start.md` if present.

If no `AGENTS.md`:
  - Skip silently if `.agent-platform-skip` exists at workspace root.
  - Otherwise at first response offer once:
    "Install Agent Platform? `npx {{PLATFORM_NPX}}` — **YES** / **NO** / **SKIP**"
    On SKIP: create `.agent-platform-skip` at workspace root.
<!-- PLATFORM:END -->

<!-- USER:START -->
<!-- Add your personal cross-repo preferences here. Never overwritten by platform upgrades. -->
<!-- USER:END -->
