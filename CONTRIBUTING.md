# Contributing to Agent Platform

Thank you for helping improve the coordination layer that makes AI agents more disciplined. This guide is for **users and contributors** who want to suggest rules, playbooks, or docs — not only framework maintainers.

---

## What we welcome

| Contribution | Examples |
|--------------|----------|
| **Playbook or expert rule** | A step that prevented a real failure (security gate, test discipline, handoff check) |
| **Reference checklist** | Testing, security, performance, accessibility patterns worth encoding |
| **Routing trigger** | A phrase that should map to an existing playbook but does not today |
| **Documentation** | Clearer onboarding, comparison with skill packs, IDE-specific quick starts |
| **Bug reports** | Install/upgrade failures, routing misses, stale docs, test gaps |

We do **not** accept wholesale copies of third-party skill packs. We **selectively ingest** proven patterns with attribution (see [MAINTAINER/ingest/](MAINTAINER/ingest/)).

---

## Before you open an issue

1. **Search existing issues** — duplicates slow review.
2. **Describe the failure** — what went wrong in a real session or repo? Vague "make agents better" is hard to act on.
3. **Point to the file** — if you know it: `.agent/playbooks/…`, `.agent/agents/…`, `AGENT-PLATFORM-TEMPLATES/…`
4. **Say which IDE** — Claude Code, Cursor, Antigravity, Codex, or OpenCode (routing differs slightly).

---

## How to submit a rule or playbook idea

Open a GitHub issue with this template:

```markdown
## Failure observed
<What the agent did wrong, or what was skipped>

## Proposed change
- File: `.agent/playbooks/…` or expert agent
- Rule: <exact wording or step>

## Why not optional
<What breaks if this stays guidance-only>

## Validation
<How you verified the rule would have helped>
```

Maintainers route serious proposals through **Mode 3 ingest** (see `MAINTAINER/platform-maintainer-agent.md`): gap analysis → template edit → **Platform Sync Gate (PSG)** → `npm test` → CHANGELOG. PSG syncs manifests, user docs, tests, and presentation automatically — no separate reminder step.

---

## Contributing code or template changes

1. Fork and clone `https://github.com/zafrirron/Agent-Platform`
2. Edit under `AGENT-PLATFORM-TEMPLATES/` (installed files are gitignored in consumer repos)
3. Run `npm test` — integration tests must pass (currently 293)
4. Run **PSG** — see `MAINTAINER/platform-maintainer-agent.md` § Platform Sync Gate (manifests, all user docs, presentation, E2E, CHANGELOG)
5. Run `npm test` — must pass
6. Log the improvement in `MAINTAINER/platform-improvements.md`
7. Open a PR with: failure observed, files changed, PSG Report summary, test result

**Framework-only repo?** See [COPYING.md](COPYING.md) and [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md).

---

## Maintainer path

If you maintain a fork or internal distribution:

- [MAINTAINER/GUIDE.md](MAINTAINER/GUIDE.md) — release workflow
- [MAINTAINER/platform-maintainer-agent.md](MAINTAINER/platform-maintainer-agent.md) — agent-driven upgrades + **PSG** (auto-sync gate)
- `"Sync user-facing docs for vX.Y.Z"` — full PSG before release tag

---

## License

Contributions are accepted under the same [Elastic License 2.0](LICENSE) as the project. By submitting a PR, you confirm you have the right to contribute the material and that it does not violate third-party licenses.
