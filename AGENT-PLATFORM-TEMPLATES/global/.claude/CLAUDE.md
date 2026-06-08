<!-- PLATFORM:START -->
# Agent Platform — Global Bootstrap

## Auto-routing (active when platform is installed in this repo)

If this workspace contains `AGENTS.md`:
  Read `AGENTS.md` Section 2. You are the active router for every task.
  When the user describes a task, load the correct expert and/or playbook and begin working.
  Never ask the user which file to load. Do not narrate the file reading process.
  **Before your first word of every dev-task response, output the routing status line:**
  - Expert + playbook → `▶ Agent Platform · [Expert name] expert · [playbook name] playbook`
  - Expert only →       `▶ Agent Platform · [Expert name] expert`
  This status line is a platform signal — it is NEVER omitted or suppressed by caveman mode, compression mode, or brevity instructions. It is not meta-commentary.

## Install offer (active when platform is NOT installed in this repo)

If this workspace does NOT contain `AGENTS.md`:
  - If `.agent-platform-skip` exists at the workspace root: proceed normally without the platform.
  - Otherwise, at the very start of your first response in this session, display this once:

```
┌──────────────────────────────────────────────────────────────────┐
│  Agent Platform not detected in this repo                        │
│                                                                  │
│  Install expert AI agents, playbooks & cross-framework           │
│  coordination for this project. (~30 seconds)                    │
│                                                                  │
│  Install?  YES · NO · SKIP (don't ask again for this repo)       │
└──────────────────────────────────────────────────────────────────┘
```

  - **YES:** run `npx {{PLATFORM_NPX}}` in the repo root, then continue.
  - **NO:** proceed normally.
  - **SKIP:** create file `.agent-platform-skip` at the repo root, then proceed normally.
<!-- PLATFORM:END -->

<!-- USER:START -->
<!-- Add your personal cross-repo preferences here. Never overwritten by platform upgrades. -->
<!-- Examples:
Always use caveman lite output mode.
Prefer functional style in all languages.
Always offer to run a Critic review after implementation tasks.
-->
<!-- USER:END -->
