# Mode 4 Targeted Scan — 2026-07-03 — DietrichGebert/ponytail

## Meta
- **Mode:** mode4
- **Scan scope:** targeted
- **Trigger:** `Read MAINTAINER/github-governance-scan.md and execute it. repo=https://github.com/DietrichGebert/ponytail`
- **Target repo:** DietrichGebert/ponytail
- **Source read:** repo README (162 commits, v4.8.4, main)
- **Queries / sources:** N/A (targeted)
- **Platform version:** 2.42.1
- **Prior registry read:** R001–R030 dispositions honored; `caveman` + intensity modes already COVERED (ponytail benchmarks against our caveman pattern)

## Summary

| Metric | Count |
|--------|------:|
| Findings total | 5 |
| Implemented | 2 |
| Skipped | 0 |
| Deferred | 3 |
| Pending | 0 |
| COVERED (no finding) | 5 |

> Dispositions applied 2026-07-03: R031 + R032 **Implemented**; R033 **Deferred (opt-in)**; R034 **Deferred (roadmap)**; R035 **Deferred**.

### Scan mode: targeted
### Target repo: https://github.com/DietrichGebert/ponytail
### Repo type: **single-purpose skill + plugin** — proactive minimal-code ("laziness ladder"), 16-agent portability, MCP + hooks + benchmark harness
### Stars: ~72k · Forks: ~3.7k · License: MIT

---

## Repo character

A focused, heavily-benchmarked skill: before writing code the agent walks a **decision ladder** (need it? → reuse → stdlib → native → dep → one line → minimum) and stops at the first rung that holds — cutting ~54% LOC (up to 94% on over-build traps) on a real agentic benchmark while keeping **100% safety** (validation, data-loss, security, a11y never cut). Ships as a plugin to 16 hosts with modes `lite/full/ultra/off`, `/ponytail-review|audit|debt|gain|help` commands, lifecycle hooks, an MCP, and a promptfoo benchmark. This is the **proactive** complement to our **reactive** `code-simplification`.

---

## Q1–Q10 summary

| # | Answer (short) |
|---|----------------|
| Q1 | No session lifecycle; always-on ruleset injected each turn via hooks |
| Q2 | No multi-agent coordination — single skill, broad host portability |
| Q3 | No routing; activates on coding tasks (always-on) + explicit `/ponytail*` commands |
| Q4 | No trust/reputation |
| Q5 | `/ponytail-review` (diff over-engineering → delete-list), `/ponytail-audit` (repo-wide); safety floor guard |
| Q6 | N/A |
| Q7 | No agent manifests; `plugin.yaml` / per-host adapters |
| Q8 | **Proactive minimalism decision-ladder + safety floor**; over-engineering review/audit; deferred-shortcut debt ledger; rigorous skill-impact benchmark; 16-host plugin portability |
| Q9 | **Missing/weaker:** our `code-simplification` is reactive only — no *pre-code* minimalism gate; no over-engineering review lens; no deferred-shortcut ledger |
| Q10 | Plugin-marketplace installs across 16 hosts (`/plugin install`, `gemini extensions install`, `swival skills add`, `clawhub install`, …) — broader than our 8-tool matrix |

---

## Recommended adoption — DietrichGebert/ponytail

| Priority | What | Our target | Effort |
|----------|------|------------|--------|
| **P0** | **Proactive minimalism "ladder" + safety floor** (need→reuse→stdlib→native→dep→one-line→minimum; never cut validation/security/a11y) | Strengthen `code-simplification` (add pre-code gate) + `incremental-implementation` Step | Medium |
| **P1** | **Over-engineering review lens** (`/ponytail-review` delete-list; `/ponytail-audit` repo-wide) | Add "unnecessary complexity / over-engineering" as an explicit Critic dimension + `/code-simplify` review mode | Low–Med |
| **P2 (opt-in)** | **Deferred-shortcut debt ledger** (`/ponytail-debt` — record shortcuts so "later" ≠ "never") | Optional `.agent/context/` ledger or add-feature step | Low–Med |
| **Roadmap** | **Skill-impact benchmark methodology** (LOC/tokens/cost/time + adversarial safety tier) | Maintainer measurement approach; pairs R023 (skill-optimizer) / R029 (verify-before-ship) | Medium |
| **Defer** | Extend host portability to plugin-marketplace installs / 16 hosts | Grow the R019 matrix later | Low |

**Adopt the principle, not the persona:** take the ladder + safety-floor discipline into `code-simplification`; skip the "ponytail" branding, MCP server, and benchmark harness.

**Already COVERED:** reactive simplification (`code-simplification` `/code-simplify`); intensity modes lite/full/ultra (`caveman` — ponytail explicitly benchmarks against it); always-on ruleset (AGENTS.md always-loaded); safety gates (security-agent, accessibility-audit, verification-before-completion); cross-IDE paths (R019).

**Do not adopt wholesale:** the persona/branding, `ponytail-mcp`, and the full benchmark harness — out of scope; the value is the decision ladder.

---

## Findings

## R031 — ponytail: Proactive minimalism decision-ladder + safety floor

Source: https://github.com/DietrichGebert/ponytail — "How it works"

Observation: Before writing code, the agent stops at the first rung that holds — (1) does it need to exist (YAGNI)? (2) already in codebase → reuse (3) stdlib? (4) native platform feature? (5) installed dependency? (6) one line? (7) only then the minimum that works. Runs *after* understanding the problem (reads the real flow first). Paired with a hard rule: never cut trust-boundary validation, data-loss handling, security, or accessibility. Benchmarked at −54% LOC mean (up to 94%) with 100% safety on a real agentic task suite.

Platform gap: `code-simplification` is **reactive** (simplify existing code without behavior change). We have no **pre-code** gate that stops the agent from over-building in the first place; `incremental-implementation` / `add-feature` don't encode a minimalism ladder.

Classification: STRENGTHEN

Suggested path: Add a "minimalism ladder (check before writing)" section to `code-simplification/SKILL.md` and a one-line pre-build gate in `incremental-implementation` — always paired with the safety-floor rule so minimizing never removes validation/security/a11y.

Effort: Medium | Impact: High

Disposition: **Implemented** (2026-07-03) — "Minimalism ladder — before writing new code" (7 rungs) + safety floor added to `code-simplification/SKILL.md` (now proactive + reactive); minimalism gate added as Step 2 of `incremental-implementation` slice process. Attribution to ponytail (MIT) recorded.

---

## R032 — ponytail: Over-engineering review lens

Source: https://github.com/DietrichGebert/ponytail — Commands (`/ponytail-review`, `/ponytail-audit`)

Observation: A review that scans a diff (or the whole repo) specifically for over-engineering and hands back a **delete-list** — the inverse of "what to add" review.

Platform gap: Our `/review` (Critic) covers correctness/security/BC/a11y etc., but "unnecessary complexity / over-engineering" is not an explicit review dimension, and `/code-simplify` has no diff-scoped "delete-list" mode.

Classification: STRENGTHEN

Suggested path: Add an "over-engineering / unnecessary complexity" dimension to `critic-agent.md`; add a diff-scoped delete-list mode to `code-simplification`.

Disposition: **Implemented** (2026-07-03) — folded over-engineering into the existing `[DESIGN]` Critic dimension (native/stdlib/one-liner replacements, premature abstraction, **delete-list**, safety-floor caveat) rather than adding an 11th dimension; added a "Review mode — over-engineering delete-list" to `code-simplification`. (Also corrected stale "all nine" → "all ten" in critic-agent prose to match the 10-dimension table + tests.)

---

## R033 — ponytail: Deferred-shortcut debt ledger

Source: https://github.com/DietrichGebert/ponytail — Commands (`/ponytail-debt`)

Observation: "Harvest the ponytail" — records shortcuts deliberately deferred into a ledger so "later" doesn't become "never".

Platform gap: We defer scope during specs/plans but have no lightweight, persistent ledger of intentionally-deferred shortcuts/debt tied to the code.

Classification: FEATURE

Suggested path: Optional `.agent/context/debt-ledger.md` (or a step in `add-feature`/`refactor`) capturing deferred shortcuts with a revisit trigger.

Effort: Low–Medium | Impact: Low

Disposition: **Deferred (opt-in)** (2026-07-03) — useful small feature; ship on request as an optional context file.

---

## R034 — ponytail: Skill-impact benchmark methodology

Source: https://github.com/DietrichGebert/ponytail — "Numbers" / benchmarks

Observation: Measures a skill's real effect against a fair agentic baseline — LOC, tokens, cost, time, plus a separate adversarial **safety** tier — via promptfoo, with per-task tables and honest correction of earlier inflated single-shot numbers.

Platform gap: Our PSG validates correctness (tests) but we have no methodology to *measure the impact* of a skill (does it actually help? does it stay safe?). Relates to R023 (skill-optimizer) and R029 (verify-before-ship).

Classification: STRENGTHEN

Suggested path: Roadmap a lightweight "skill impact + safety" measurement note in the maintainer skill-authoring guidance; optional promptfoo-style harness.

Effort: Medium | Impact: Medium

Disposition: **Deferred (roadmap)** (2026-07-03) — pairs with R023 (skill-optimizer) + R029 (verify-before-ship); revisit as one measurement effort.

---

## R035 — ponytail: Plugin-marketplace portability across 16 hosts

Source: https://github.com/DietrichGebert/ponytail — Install

Observation: Ships to 16 hosts via native plugin marketplaces / installers (`/plugin install`, `codex plugin`, `copilot plugin`, `gemini extensions install`, `agy plugin install`, `swival skills add`, `clawhub install`, `pi install`, `devin plugins install`, `hermes plugins install`) plus instruction-only fallbacks (Cursor/Windsurf/Cline/Kiro rules).

Platform gap: Our R019 matrix documents 8 hosts' *skill paths* but not plugin-marketplace install commands or the newer hosts (Devin/Hermes/OpenClaw/pi/Swival/Kiro).

Classification: STRENGTHEN

Suggested path: Extend the R019 DISTRIBUTION matrix with marketplace install commands / additional hosts when next editing distribution docs.

Effort: Low | Impact: Low

Disposition: **Deferred** (2026-07-03) — low value; fold into R019 matrix on next distribution-docs edit.

---

## COVERED

| Capability | Our equivalent |
|------------|----------------|
| Reactive code simplification | `code-simplification` `/code-simplify` |
| Intensity modes lite/full/ultra | `caveman` skill (ponytail benchmarks vs it) |
| Always-on ruleset injection | AGENTS.md always-loaded + rules |
| Safety gates (validation/security/a11y) | security-agent, accessibility-audit, verification-before-completion |
| Cross-IDE skill paths | R019 DISTRIBUTION matrix |

---

## Quick-pick by effort + impact

| Finding | Title | Effort | Impact |
|---------|-------|--------|--------|
| R031 | Proactive minimalism ladder + safety floor | Med | **High** |
| R032 | Over-engineering review lens | Low–Med | Medium |
| R035 | 16-host plugin-marketplace portability | Low | Low |
| R033 | Deferred-shortcut debt ledger | Low–Med | Low |
| R034 | Skill-impact benchmark methodology | Med | Medium |

---

## Next scan

- Very active (v4.8.4, 162 commits) — re-check for new commands or a stabilized measurement harness
- **Do not re-propose:** R001, R005, R013, R016, R019, R020, R021, R025, R028, R029 (Implemented) · caveman/intensity modes (COVERED)
