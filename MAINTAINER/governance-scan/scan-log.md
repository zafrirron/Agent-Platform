# Governance Scan Log

Running log of all Mode 4 GitHub governance repo scans.
Full reports at `MAINTAINER/governance-scan/archive/YYYY-MM-DD/scan-report.md`.

---

## [2026-06-02] — Founding scan (8 repos, pre-roadmap)

**Method:** Manual GitHub search (pre-Mode 4 playbook)

**Repos analysed:**
| Repo | Key finding | Implemented as |
|------|-------------|----------------|
| faramesh-core | Session lifecycle coordination | Phase 3A/3B session finality |
| edictum | Policy enforcement patterns | Phase 4A amendment proposals |
| DashClaw | Five-state finality + idempotency keys | Phase 2A + 2B |
| deterministic-agent-control-protocol | Deterministic routing + audit trails | Phase 4B approval routing |
| JSON-Agents/Standard | Machine-readable agent manifests + routing_keywords | Phase 1A manifests |
| garda-agent-orchestrator | Cross-agent orchestration patterns | Phase 3B/3C session coordination |
| traccia-py | Session tracing + step manifests | Phase 2A step_manifest |
| nobulex | Reputation vectors + trust scoring | Phase 1B + 5A/5B reputation |

**Features implemented:** All 14 governance phases (PW1 + 1A–6B) — see MAINTAINER/platform-governance-roadmap.md

**Next scan:** Vary queries toward agent observability, rollback/undo patterns, multi-model consensus gates. Re-check DashClaw and nobulex in 6 months for new features.

---

*(Newer scans prepended above this line)*
