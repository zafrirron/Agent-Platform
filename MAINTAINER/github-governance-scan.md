# Mode 4 — GitHub Governance Repo Scan

> **Trigger:** `Read MAINTAINER/github-governance-scan.md and execute it.`
> **Requires:** Maintainer agent loaded — `Read MAINTAINER/platform-maintainer-agent.md`
> **Scope:** GitHub repos with agent governance, coordination, or orchestration patterns
> **Output:** Structured findings report R001-Rxxx → maintainer selects what to investigate or implement
> **Cadence:** Quarterly. Run any time you want fresh inspiration.

---

## What this does

Searches GitHub for repos that govern, coordinate, or orchestrate AI agents. Reads each candidate
repo's README and key files. Extracts capabilities the Agent Platform does not yet have (or does
weaker). Presents a structured report. You pick what to pursue.

**This is the platform's discovery antenna.** Mode 1 improves from failures. Mode 2 improves from
security/best-practice research. Mode 3 improves from users' own deployed intelligence. **Mode 4
discovers what the broader open-source ecosystem is building** — new coordination patterns,
architectural ideas, session management innovations — before they become industry standard.

---

## Before you start

### 1 — Load current platform state

Read these files to build a map of what the platform already does:
- `AGENT-PLATFORM-TEMPLATES/AGENTS.md` — routing, session lifecycle, coordination
- `AGENT-PLATFORM-TEMPLATES/.agent/session-start-shared.md` — session start flow
- `AGENT-PLATFORM-TEMPLATES/.agent/session-end-shared.md` — session end flow
- `AGENT-PLATFORM-TEMPLATES/.agent/context/reputation.json` — reputation schema
- `AGENT-PLATFORM-TEMPLATES/.agent/agents/schemas/agent.manifest.schema.json` — manifest schema

You need this map to classify findings correctly.

### 2 — Load the scan log

Read `MAINTAINER/governance-scan/scan-log.md`.

Extract the list of **already-analyzed repos** — do not re-analyze these unless the log entry is
older than 6 months. The log also tells you which queries were last run so you can vary them.

---

## Phase 1 — Discover candidate repos

Run these searches. For each query, collect GitHub repo links from the first 2 pages of results.
Vary query terms from the previous scan (check scan-log.md for last queries used).

### Search queries (rotate each scan — use ≥6 per run)

**Coordination & orchestration:**
- `"multi-agent coordination" framework GitHub`
- `"agent orchestration" session handoff GitHub`
- `"AI agent governance" framework site:github.com`
- `"agentic workflow" coordination platform site:github.com`

**Session & lifecycle:**
- `"agent session" lifecycle management framework GitHub`
- `"agent handoff" "context" framework site:github.com`
- `"session takeover" agent framework site:github.com`

**Trust & verification:**
- `"agent trust" verification framework GitHub`
- `"agent reputation" scoring framework site:github.com`
- `"AI agent" "quality gate" workflow GitHub`

**Routing & dispatch:**
- `"agent routing" dispatch framework site:github.com`
- `"agent manifest" capabilities routing site:github.com`
- `"multi-agent" routing selector framework GitHub`

**Recovery & resilience:**
- `"agent" "partial" "resume" workflow framework GitHub`
- `"idempotent" agent execution framework site:github.com`

Collect all unique repos. Remove duplicates and any repo already in the scan log.

---

## Phase 2 — Triage candidates

For each discovered repo, fetch the GitHub page or README:
```
https://raw.githubusercontent.com/<owner>/<repo>/main/README.md
```
(try `master` if `main` fails)

**Keep a repo if it has at least two of:**
- Agent lifecycle instructions (session start/end, state management)
- Multi-agent or multi-tool coordination
- Quality gates, review steps, or critic patterns
- Trust, scoring, or reputation mechanisms
- Routing or dispatch logic
- Persistent session memory or handoff mechanism
- Recovery from partial or stuck states

**Discard immediately if:**
- It is a general LLM wrapper with no governance layer
- It is a code library with no agent coordination patterns
- README is under 200 words (likely placeholder or abandoned)
- It is a fork of a repo already in the scan log

Target: 6–15 repos to analyze fully. If triage yields more than 15, rank by GitHub stars descending and take the top 15.

---

## Phase 3 — Deep analysis

For each kept repo, fetch and read:
1. `README.md` (already fetched)
2. Any file whose name contains: `agent`, `session`, `handoff`, `routing`, `manifest`, `governance`, `trust`, `reputation`, `workflow`, `coordination`
3. Any top-level `.md` files (docs, architecture notes)

For each repo, answer these 8 questions. Answer only from what you read — do not infer or guess.

| # | Question |
|---|---------|
| Q1 | How does it manage session lifecycle (start, end, takeover, resume)? |
| Q2 | How does it coordinate multiple agents or IDEs? |
| Q3 | How does it route tasks to the right agent or handler? |
| Q4 | Does it have any trust, scoring, or reputation mechanism? |
| Q5 | Does it have quality gates, review steps, or critic patterns? |
| Q6 | How does it recover from partial, stuck, or failed states? |
| Q7 | Does it have agent manifests, capability declarations, or `cannot_do` lists? |
| Q8 | What does it do that the Agent Platform does NOT do at all? |

---

## Phase 4 — Extract findings

For every answer to Q8, and for any partial capability (where we have something but theirs is
stronger), create a finding.

**Finding format:**
```
## R[NNN] — [RepoName]: [Short feature title]
Source: https://github.com/[owner]/[repo]
Observation: [What this repo does — 1-3 sentences, factual]
Platform gap: [What we don't do / do weaker — 1-2 sentences]
Classification: FEATURE | STRENGTHEN | ARCHITECTURE
Suggested path: [New capability / Which file / New phase / New playbook]
Effort: Low (1 file, <1 day) | Medium (2-4 files, 1-3 days) | High (new phase, >3 days)
Impact: High | Medium | Low
```

**Classifications:**
- **FEATURE** — capability the platform has no equivalent of
- **STRENGTHEN** — we have something comparable but theirs is more robust or complete
- **ARCHITECTURE** — a structural pattern that could improve how the platform is organised

Do NOT create findings for:
- Things the platform already does equivalently (log them in the repo summary as COVERED)
- Repo-specific domain features that would not generalise (e.g. "only works with GPT-4")
- Features that conflict with the platform's privacy principles (no data leaving the machine)

---

## Phase 5 — Present report

Output the full findings report in this structure:

```
## Mode 4 Scan Report — [YYYY-MM-DD]

### Repos analysed: N
[list repo names + star counts]

### Repos discarded at triage: N
[list with one-line reason]

### Repos already in scan log (skipped): N

### Findings: N total
  FEATURE       : N
  STRENGTHEN    : N
  ARCHITECTURE  : N

---
[all R001-Rxxx entries in full]

---

## Quick-pick by effort + impact

| Finding | Title | Effort | Impact |
|---------|-------|--------|--------|
| R001 | ... | Low | High |
...
```

---

## Phase 6 — Maintainer selection

After presenting the report, accept these commands:

| You say | Agent does |
|---------|-----------|
| `"Add R001, R003"` | Implements findings as new capabilities or rules via Mode 1 workflow |
| `"Add all Low-effort High-impact"` | Filters and implements that set |
| `"Investigate R004"` | Fetches more files from that repo for deeper analysis |
| `"Roadmap R005"` | Adds R005 to a new governance roadmap document (like the previous one) |
| `"Roadmap R002, R007, R009"` | Creates a phased roadmap doc for those findings together |
| `"Skip R002"` | Logs R002 as reviewed+skipped in scan log |
| `"Defer R006"` | Adds to backlog section of scan log |
| `"Skip all"` | Logs all findings, archives report, no implementation |

---

## Phase 7 — Archive and log

Regardless of what was selected:

1. **Create the archive entry:**
   Create `MAINTAINER/governance-scan/archive/[YYYY-MM-DD]/scan-report.md` with the full report.

2. **Update the scan log** (`MAINTAINER/governance-scan/scan-log.md`):

   Prepend a new entry:
   ```
   ## [YYYY-MM-DD] — [N repos analysed, N findings]

   **Queries used:** [list the 6+ queries from Phase 1]

   **Repos analysed:**
   | Repo | Stars | Key finding | Status |
   |------|-------|-------------|--------|
   | owner/repo | NNN | [one-line summary] | Implemented R001 / Roadmapped / Skipped |

   **Findings summary:**
   - R001: [title] — [Implemented / Roadmapped / Skipped / Deferred]
   - R002: [title] — [...]

   **Next scan:** vary queries around [theme] — [repos to re-check after 6 months if still active]
   ```

3. **Version bump** (only if any finding was implemented): bump `bootstrap_version` in manifest.

4. Report:
   ```
   Mode 4 scan complete.
   Analysed: N repos | Findings: N | Implemented: N | Roadmapped: N | Skipped: N
   Archive: MAINTAINER/governance-scan/archive/[date]/scan-report.md
   Log: MAINTAINER/governance-scan/scan-log.md updated.
   ```
