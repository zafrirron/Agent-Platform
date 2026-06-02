# Platform Governance Roadmap
**Created:** 2026-06-02  
**Status:** All phases complete (2026-06-02)  
**Tracking:** Pick up any session by reading this file + running `git log --oneline -5`

---

## Source

Derived from analysis of 8 governance repos (2026-06-02):
faramesh-core · edictum · DashClaw · deterministic-agent-control-protocol ·
JSON-Agents/Standard · garda-agent-orchestrator · traccia-py · nobulex

Already implemented (same session): 6 prompt-layer improvements (Critic DEFER + named dimensions + token economy, session budgets, postcondition gate, passive safety signals). See commit `7f8a718`.

---

## Pre-work — MUST complete before Phase 1

### PW1 — Add two-section model to AGENTS.md

**Why:** AGENTS.md has no `PLATFORM:START/END` markers. Upgrade mode fully replaces it, destroying user-added custom routing rows. Every governance phase adds new routing rows — without this fix, upgrades silently destroy user customizations.

**What to do:**
1. Wrap Section 2 routing table in `<!-- PLATFORM:START -->` / `<!-- PLATFORM:END -->`
2. Add `<!-- PROJECT:START -->` / `<!-- PROJECT:END -->` block after for user custom rows
3. Wrap Section 3 (Hard rules) the same way
4. Add automated test: after upgrade, custom routing row in PROJECT section survives
5. Verify existing 130 tests still pass

**Files:** `AGENT-PLATFORM-TEMPLATES/AGENTS.md`, `tests/apply-integration.test.mjs`

**Upgrade safety:** This change adds markers to the template. For existing installs without markers, the upgrade engine currently skips + warns (`noMarkers` path). After this change, first upgrade will replace AGENTS.md (once), thereafter preserves PROJECT sections. Users need to re-add any custom rows once — acceptable; document in CHANGELOG.

---

## Phase 1 — Pure addition, zero runtime risk

### 1A — Agent manifest schema + 9 manifest files

**Source:** JSON-Agents/Standard  
**Value:** Foundation for all subsequent phases. Manifests define capabilities, routing keywords, governance profile, trust ceiling. Currently agents are described only in prose — no machine-readable definition exists.

**What to create:**
- `.agent/agents/schemas/agent.manifest.schema.json` — JSON Schema 2020-12
- `agent.manifest.json` alongside each of 9 agent files
- Update `AGENT-PLATFORM-MANIFEST.json` to include new manifest files
- Add automated tests: each manifest valid against schema after install

**Manifest structure:**
```json
{
  "id": "backend-agent",
  "display_name": "Backend",
  "version": "1.0",
  "capabilities": ["api", "service", "database", "auth", "validation"],
  "governance": {
    "critic_dimensions": ["SECURITY","CORRECTNESS","TEST","COMPLETENESS","DESIGN"],
    "requires_architect_for": ["auth", "data-shape", "middleware", "new-service"]
  },
  "routing_keywords": ["endpoint","API","service","server","route","handler"],
  "trust_ceiling": "standard",
  "cannot_do": ["UI","styling","client-state","CI/CD","migrations"]
}
```

**Upgrade safety:** New files — safe for all existing installs. ✅

**Tests to add:**
- `test('agent manifest files exist after install')` — all 9 present
- `test('each manifest is valid JSON with required fields')` — id, capabilities, governance, routing_keywords
- `test('manifest schema file exists')` — schema deployed

### 1B — Reputation vectors template

**Source:** Nobulex  
**Value:** Persistent trust score per agent per capability. Seeds Phase 5 routing integration.

**What to create:**
- `.agent/context/reputation.json` — template with all 9 agents at default scores
- Update `AGENT-PLATFORM-MANIFEST.json`
- Add automated test: file exists, valid JSON, all agent IDs present

**Template structure:**
```json
{
  "schema_version": 1,
  "updated_at": null,
  "agents": {
    "backend-agent": {
      "overall": 500,
      "by_capability": {
        "api": 500, "security": 500, "database": 500, "auth": 500
      },
      "sessions_completed": 0,
      "gate_passes": 0,
      "gate_blocks": 0,
      "last_updated": null
    }
  }
}
```

**Upgrade safety:** New file — safe. ✅

---

## Phase 2 — Registry schema extension (additive fields only)

### 2A — Five-state finality in registry.yaml

**Source:** DashClaw  
**Value:** Distinguish `partial` and `lost_confirmation` session outcomes from `failed`. Enables safe resumability and accurate cross-IDE handoff context.

**States:** `clean` | `partial` | `lost_confirmation` | `failed` | `in_progress`

**What to change:**
- Add `finality_state: clean` to each framework in `registry.yaml` template
- Add `step_manifest: []` to each framework (list of completed step IDs)
- Add automated test: new fields present after install

**Upgrade safety:** registry.yaml has no PLATFORM markers → full replace on upgrade. Registry is ephemeral session state — safe to reset between sessions. ✅

### 2B — Idempotency keys in registry.yaml

**Source:** DashClaw  
**Value:** Prevent double-execution of the same action when retried or picked up by a different IDE.

**What to change:**
- Add `completed_actions: {}` map to registry.yaml template
- Key = `sha256(action_type + target + content_hash)[:16]`, value = `{completed_at, framework}`
- Add automated test: field present after install

**Upgrade safety:** Same as 2A — full replace, registry is ephemeral. ✅

---

## Phase 3 — Session instruction layer (additive, new conditions only)

### 3A — Session-end: write finality state + step manifest

**Source:** DashClaw  
**Value:** Session-end now records WHICH steps completed, not just that a session ended. Enables Phase 3B resume.

**What to change:**
- `session-end-shared.md` Step 3: write `finality_state` to registry based on checklist results
  - All steps green → `clean`
  - Some steps incomplete → `partial` + list incomplete steps in `step_manifest`
  - Blocked/error → `failed`
- Step 4: write `step_manifest` to registry alongside `status: idle`

**Upgrade safety:** Pure platform file — full replace on upgrade. No user content at risk. ✅

**Verification:** E2E — end a session with incomplete checklist, verify registry shows `partial`.

### 3B — Session-start: targeted resume on partial session

**Source:** DashClaw  
**Value:** Instead of "session ended unexpectedly" with no context, show exactly which steps remain.

**What to change:**
- `session-start-shared.md` Step 1: add new Case C — framework has `finality_state: partial`
- Offer: "Previous session was partial — steps remaining: [list]. Resume from step X?"
- On YES: skip completed steps, resume from first incomplete
- On NO: start fresh

**Upgrade safety:** Pure platform file — full replace. ✅

**Verification:** E2E — simulate partial session via registry edit, verify resume offer.

### 3C — Session-start takeover: idempotency check

**Source:** DashClaw  
**Value:** When taking over a stuck session, check `completed_actions` before re-executing.

**What to change:**
- `session-start-shared.md` takeover sequence: before committing uncommitted work, check `completed_actions` map
- If action key already in map → skip (already executed)
- Log: "Skipped N already-completed actions"

**Upgrade safety:** Pure platform file — full replace. ✅

---

## Phase 4 — Policy self-evolution (additive Critic behavior)

**Source:** DET-ACP  
**Value:** When Critic issues a DEFER finding, it generates a structured amendment proposal. User approves → amendment written to agent's PROJECT section permanently. Governance that learns from real usage instead of becoming stale.

### 4A — Critic: emit structured amendment proposals

**What to change:**
- `critic-agent.md` PLATFORM section: when issuing DEFER, also emit amendment proposal:
  ```
  ## Amendment Proposal AP-001
  Current rule: [what blocks this]
  Proposed exception: [minimal change that allows this specific case]
  Rationale: [why this case is legitimately different]
  Scope: [which agent file + section]
  To approve: say "approve amendment AP-001"
  ```

**Upgrade safety:** Two-section model — PLATFORM patched, PROJECT preserved. ✅

### 4B — AGENTS.md routing: amendment approval row

**What to change:**
- Add routing row: `"approve amendment AP-NNN"` → answer directly, write the exception to the relevant agent PROJECT section
- This lives in the PLATFORM section of AGENTS.md (after PW1 is complete)

**Upgrade safety:** Depends on PW1 being complete. After PW1: PLATFORM section patched. ✅

---

## Phase 5 — Reputation integration (first behavior-changing phase)

**Source:** Nobulex  
**Value:** High-trust agents (clean track record) get lighter-weight Critic gates. Low-trust agents get stricter review. Gate weight adjusts per capability, not globally.

### 5A — Session-end: write trust score deltas

**What to change:**
- `session-end-shared.md`: after Step 2 checklist, update `reputation.json`
  - Critic APPROVED → +10 per capability used
  - Critic BLOCKED (fixed) → +5 (found + fixed = healthy)
  - Critic BLOCKED (unresolved) → -20
  - Security gate triggered → -15 on security capability
  - Session budget exceeded → -10 overall

**Upgrade safety:** Pure platform file — full replace. reputation.json is additive. ✅

### 5B — Routing: read reputation, adjust gate scope

**What to change:**
- `AGENTS.md` (PLATFORM section after PW1): add reputation-aware gate note
  - `overall >= 700` → Critic scope reduced to `[CORRECTNESS] [TEST]` for routine tasks
  - `overall <= 300` → Critic scope expanded, all 7 dimensions mandatory
  - `by_capability.security <= 400` → security gate mandatory regardless of task type

**Upgrade safety:** PLATFORM section replaced on upgrade — users get latest reputation thresholds. reputation.json (user data) preserved as it has no PLATFORM markers. ✅

**Verification:** E2E — build high reputation, verify lighter gate on next task.

---

## Phase 6 — Manifest-driven routing (replaces prose-matched routing)

**Source:** JSON-Agents/Standard  
**Value:** Routing table becomes manifest-queryable instead of text-matched. QUICK-REF auto-generated from manifests. Routing decisions are validated against agent `cannot_do` lists.

**Pre-condition:** Phase 1A manifests must have been deployed and validated across at least one full E2E cycle.

### 6A — Routing validates against manifest `cannot_do`

**What to change:**
- `AGENTS.md` routing instruction: after identifying expert, check manifest `cannot_do`
- If task falls in `cannot_do` for selected expert → either re-route or flag to user
- Example: routing sends UI task to backend-agent, manifest says `cannot_do: ["UI", "styling"]` → re-route to frontend-agent

### 6B — QUICK-REF trigger phrases auto-sourced from manifests

**What to change:**
- `QUICK-REF.md` Expert Agents table: "Your task sounds like…" column sourced from manifest `routing_keywords`
- On session-start, agent reads all manifests and surfaces their routing keywords
- Eliminates QUICK-REF drift from routing table

**Upgrade safety:** QUICK-REF.md is a pure platform file — full replace. ✅

**Verification:** Full E2E cycle after deployment.

---

## Session pickup checklist

When returning to this plan in a new session:
1. `git log --oneline -5` — see where we left off
2. Read this file — find next incomplete phase
3. Run `npm test` — confirm 130 tests still pass
4. Check `AGENT-PLATFORM-MANIFEST.json` — verify new files are registered
5. Run E2E on changed phases only

## Current status

- [x] Pre-analysis complete (2026-06-02)
- [x] PW1 — AGENTS.md two-section model (2026-06-02) — 11 new tests, migration logic added
- [x] Phase 1A — Agent manifest schema + 9 files (2026-06-02) — 22 new tests, all agents covered
- [x] Phase 1B — Reputation vectors template (2026-06-02) — 4 new tests, all 9 agents at 500
- [x] Phase 2A — Five-state finality in registry (2026-06-02) — finality_state + step_manifest per framework
- [x] Phase 2B — Idempotency keys in registry (2026-06-02) — completed_actions map at top level
- [x] Phase 3A — Session-end: finality + step manifest (2026-06-02) — Step 4 writes finality state
- [x] Phase 3B — Session-start: partial resume offer (2026-06-02) — Case C handles partial/failed
- [x] Phase 3C — Session-start: idempotency check on takeover (2026-06-02) — takeover checks completed_actions
- [x] Phase 4A — Critic: amendment proposals (2026-06-02) — DEFER emits structured AP-NNN proposals
- [x] Phase 4B — AGENTS.md: amendment approval routing (2026-06-02) — "approve AP-NNN" row wired
- [x] Phase 5A — Session-end: reputation delta writing (2026-06-02) — Step 4b added, +/-10/20 deltas
- [x] Phase 5B — Routing: reputation-aware gate scope (2026-06-02) — gate scope adjusts on score thresholds
- [x] Phase 6A — Routing validates against manifest cannot_do (2026-06-02) — re-routes on cannot_do match
- [x] Phase 6B — QUICK-REF sourced from manifests (2026-06-02) — manifest routing_keywords as authoritative source
