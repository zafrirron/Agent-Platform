# Reference: Orchestration patterns

> Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) `references/orchestration-patterns.md` (MIT). Governs expert chaining in Agent Platform.

## Core rules

1. **One orchestrator per session** — the main agent reads `AGENTS.md`, routes to experts/playbooks, and runs gates. Experts do not spawn other experts autonomously.

2. **Playbooks chain experts explicitly** — e.g. add-feature Step 5a loads Security, Step 5b loads Critic. Steps are numbered; do not skip or summarise.

3. **Critic is a gate, not a parallel implementor** — Critic reviews artifacts; it does not write production code unless user asks for fixes after findings.

4. **Doubt review is in-flight design review** — Architect doubt cycle (add-feature Step 2a) reviews design before code; Critic Step 5b reviews implementation after code.

5. **No nested persona spawn** — if a subagent context cannot spawn reviewers, surface to user; degraded self-review must be flagged as degraded.

## Anti-patterns

| Pattern | Problem |
|---------|---------|
| Expert silently skips playbook step | Gates exist for a reason — follow numbered steps |
| Critic approves its own implementation | Cold review — Critic gets implementation + tests, not its own prior reasoning |
| Security audit fixes code without ask | security-audit is findings-first unless user requests fixes |
| Multiple playbooks in one diff | One playbook per task scope — split work |

## Evidence

- Status line when routing: `▶ Expert · playbook`
- Gate lines: `▶ Security gate — …`, `▶ Critic review — APPROVED` or findings
