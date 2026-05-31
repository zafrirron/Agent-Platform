<!-- PLATFORM:START -->
# Agent Platform — Global Bootstrap

If this project contains `AGENTS.md`:
  Read `AGENTS.md` and follow Section 2 (auto-routing) for all tasks.
  Session start command is in AGENTS.md Section 1.
  Shared hub: `.agent/`

If `AGENTS.md` is absent:
  - Skip silently if `.agent-platform-skip` exists at the project root.
  - Otherwise, at the start of your first response, offer once:
    "Install Agent Platform? (`npx {{PLATFORM_NPX}}`) — **YES** / **NO** / **SKIP** (suppress for this repo)"
    On SKIP: create `.agent-platform-skip` at the project root.
<!-- PLATFORM:END -->

<!-- USER:START -->
<!-- Add your personal cross-repo preferences here. Never overwritten by platform upgrades. -->
<!-- USER:END -->
