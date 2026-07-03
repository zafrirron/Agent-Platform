# ADR-001 — Technology-stack & domain "Packs" layer

**Status:** Accepted — Phase 1 shipped; **Phase 3 (maintainer growth loop) shipped**; **Phase 2 language packs shipped** (`stack` split into `language` + `stack`); **4th axis `platform` (execution/deployment target: hardware + OS/RTOS + container runtime) formalized — design only, no curated packs yet** ([Unreleased])
**Date:** 2026-07-03
**Deciders:** Platform maintainer
**Supersedes:** —
**Related:** `platform-governance-roadmap.md` (Backlog — Stack & domain packs), R014 (coordination), `docs/INTELLIGENCE-SOURCES.md`

> First platform-level ADR. Consumer ADRs live in `.agent/context/adr-log.md`; **platform architecture** decisions live here under `MAINTAINER/adr/`.

---

## Context

The platform is, by design and by verification, **technology-stack and domain agnostic**:

- Core skills/playbooks/experts carry no stack lock-in; playbooks use `{{TEST_RUNNER}}` placeholders and multi-ecosystem *examples* only.
- All four maintainer modes (internal audit, web audit, ingest, GitHub scan) actively **filter out** stack/domain specifics: ingest skips `PROJECT-SPECIFIC` / "not tied to your specific stack"; Mode 4 defers "vendor SDK skills … vendor/domain sprawl"; rules are generalized to "language-agnostic" before shipping.

This makes the platform a strong **general-purpose software-engineering governance** layer, but it deliberately cannot give **stack-specific** or **domain-specific** help. Today the only stack awareness is a lightweight per-expert runtime step ("read `package.json`/`pyproject.toml` → fetch official docs"), which yields generic doc-lookup — **not** curated, failure-derived, opinionated knowledge (e.g. "React: don't use `useEffect` for derived state", "Django: N+1 from missing `select_related`", "HIPAA: PHI must never be logged").

Loading *all* stacks and domains into every workspace would bloat unused content. We need a **selectable, composable layer** that loads only what a given repo needs.

### Decisions taken (2026-07-03)

- **Scope:** both **stack** and **domain** packs (not stack-only).
- **Activation:** **detect-and-suggest** — the platform proposes matching packs; the user confirms. Never auto-install, never silent bloat.
- **This deliverable:** ADR + roadmap backlog entry (design before code).

---

## Decision

Introduce a **Packs** layer: optional, selectable capability modules that overlay curated stack/domain knowledge onto the agnostic core **without modifying it**.

### Principle 1 — Four orthogonal axes, never merged

| Axis | `kind` | Examples | Knowledge type |
|------|--------|----------|----------------|
| Programming language | `language` | typescript, java, cpp, python, go, rust | language semantics, memory/type/concurrency footguns, idioms — applies to **any** code-writing expert |
| Framework / library | `stack` | react, django, spring, nextjs, ros2, px4 | framework/library idioms, pitfalls, perf traps, version gotchas |
| Execution / deployment target | `platform` | docker, kubernetes, jetson-orin, stm32h7, freertos, aws-lambda | hardware (SoC/board/MCU) constraints, OS/RTOS + driver model, cross-compile toolchains, container/orchestration runtime, real-time/power/memory budgets |
| Domain / vertical | `domain` | fintech, healthcare, drone-autonomy, gov-defense | compliance (HIPAA/PCI/SOC2), domain invariants, threat models, reference architectures |

**Language vs stack — why they are separate kinds.** A language pack is the *language itself* (TypeScript's type system, Java concurrency, C++ ownership/UB); a stack pack is a *framework/library built in* a language (React, Django, Spring, ROS 2). They are separate because a language pack is **reusable across every framework in that language** — `language:typescript` applies whether the stack is React, Angular, Node, or plain scripts. Folding language rules into each framework pack would duplicate them N times.

**`platform` — why hardware, OS, and deployment target are their own axis (not `stack`).** `stack` = an *application framework built in a language*; `platform` = *where the code runs*: the hardware target (Jetson Orin, STM32H7, an Airvolute carrier board), the OS/RTOS (Linux/L4T, FreeRTOS, bare-metal), and the container/orchestration runtime (Docker, k8s). This knowledge — CUDA/GPU memory, DMA, hard real-time deadlines, peripheral buses (I2C/SPI/CAN), cross-compilation toolchains, power budgets, container packaging — is **reusable across languages, frameworks, and domains** (a Jetson pack is true for C++ *or* Rust, drones *or* robotics). Folding it into `stack` would duplicate it in every framework pack — the same failure that split `language` out of `stack`. Note: a **language runtime** (Node, JVM) stays with `language`/`stack`; a **container/OS runtime** (Docker, Linux) is `platform`.

> **Kinds do not constrain composition.** A `kind` is a category label (for detection heuristics, overlay attachment, and how we talk about packs) — it is **not** a mutual-exclusion group. You can activate several packs of the *same* kind at once. A heterogeneous system like a drone (a Linux SoC + an MCU) simply activates multiple `platform` packs (`platform-jetson-orin` + `platform-stm32h7` + `platform-docker`). Because of this, hardware and OS do **not** need to be separate kinds — OS knowledge rides inside a hardware pack when coupled, and is extracted into its own `platform` pack (`platform-freertos`) only when reused across many boards (same "extract on duplication" rule as language↔stack).

Packs compose **additively and independently** — a repo may activate `language:cpp` + `stack:ros2` + `platform:jetson-orin` + `platform:stm32h7` + `domain:drone-autonomy`. **No combo packs** (`react-fintech`, `ts-react`, `jetson-cpp`) — that path is an N×M maintenance explosion and is prohibited.

> **Overlay attachment differs by kind.** A `stack`/`domain` pack overlays the one or two experts it concerns (React → `frontend-agent`). A `language` pack overlays **every code-writing expert** (backend/frontend/data/test) via one shared overlay. A `platform` pack overlays the experts that own *where code runs* — typically `devops-agent` + `architect-agent` (deployment/hardware topology) and `backend-agent` (embedded/real-time code) — via `provides.agent_overlays`. Once active, the overlay loads automatically for the routed expert (no keyword needed).

### Principle 2 — Overlays, not duplicated experts

A pack does **not** ship a `react-frontend-agent.md`. It ships an **overlay** that the generic expert reads **only when the pack is active**. Core experts/skills/playbooks stay untouched and remain fully functional with zero packs installed.

```
.agent/packs/stack-react/
  pack.json                     # manifest (detect, provides, version)
  frontend-agent.overlay.md     # React pitfalls, appended to frontend expert on active
  references/react-pitfalls.md  # curated failure-derived knowledge (thin: ~top 10)
  routing.md                    # extra keyword rows (useEffect, hydration, suspense…)
```

Overlays compose: two active stack packs both contribute overlays to the same expert.

### Principle 3 — Nothing loads unless activated

`.agent/platform.json` gains `active_packs: []`. The core cost of the feature when no pack is active is **zero** (no extra files read, no routing changes).

### `pack.json` schema (draft)

```json
{
  "id": "stack-react",
  "kind": "stack",              // one of: language | stack | platform | domain
  "display_name": "React",
  "version": "1.0.0",
  "requires_core": ">=2.44.0",
  "confidence": "curated",
  "last_verified": "2026-07-03",
  "detect": { "files": ["package.json"], "deps": ["react"], "globs": ["**/*.tsx"] },
  "// language packs detect by marker file + source extension": "e.g. { \"files\": [\"tsconfig.json\"], \"deps\": [\"typescript\"], \"extensions\": [\".ts\", \".tsx\"] }",
  "// platform packs detect by target markers": "e.g. Dockerfile → platform-docker; *.cu / CMake CUDA toolchain → platform-jetson; *.ioc / linker script / device-tree → MCU targets; weak signals → user-selected like domain packs",
  "provides": {
    "agent_overlays": { "frontend-agent": "frontend-agent.overlay.md" },
    "references": ["references/react-pitfalls.md"],
    "routing_rows": "routing.md",
    "skills": [],
    "playbooks": []
  },
  "attribution": "…"
}
```

### Activation flow

1. **Detect (opt-in):** at install and via a session-start step, scan dependency/config files → *match* pack `detect` signals → **suggest**. Example: `Detected React + Django. Add packs stack-react, stack-django? [y/N]`. For domain packs (harder to auto-detect), suggest from README/keywords and let the user pick.
2. **Activate:** `--mode=add --add=pack:stack-react` copies the pack into `.agent/packs/` and appends to `active_packs` in `platform.json`. Reuses the existing `--mode=add` / `SKILL_ADD_DEPS` machinery.
3. **Load:** `session-start` reads `active_packs`; routing + experts read the relevant overlay when a matching task/keyword appears.
4. **Deactivate / upgrade:** packs are versioned independently; `--mode=upgrade` refreshes active packs; removal drops the folder + `active_packs` entry.

### Maintainer growth — pack-scoped brains

Directly extends existing modes so maintainers can *grow* stack/domain knowledge without polluting core:

- **Scoped scans:** Mode 2 (`web-audit`) and Mode 4 (`github-governance-scan`) accept a `pack=<id>` scope. Findings land in that pack's overlay/references under a **non-universal** quality bar (instead of being rejected as PROJECT-SPECIFIC / vendor sprawl).
- **Authoring command:** Mode 1 gains "add pack" / "add rule to pack <id>". Pack rules still trace to a failure/source, logged per-pack.
- **Provenance:** each pack records sources in `docs/INTELLIGENCE-SOURCES.md` (or a per-pack ledger), consistent with the brain-source discipline.

### PSG integration — a separate lane

Packs are versioned and tested **independently of core**:

- Packs ship in a **pack catalog** (either a `packs[]` section in the manifest or a separate `PACKS-MANIFEST.json`) — TBD in the build phase.
- Core **count invariants** (11 lifecycle skills, N playbooks, slash commands) **exclude** packs, exactly as `ux-research` is excluded today as an optional domain add-on.
- A stale/immature pack (e.g. `stack-svelte`) must **never block a core release**. Each pack carries its own test slice and `last_verified` date.

---

## Alternatives considered

| Alternative | Why rejected |
|-------------|--------------|
| **Do nothing — rely on runtime doc-fetch** | Generic doc lookup ≠ curated failure-derived knowledge; misses domain compliance entirely. |
| **Duplicate experts per stack** (`react-frontend-agent.md`) | Agent-count explosion; overlays give the same value composably without touching core. |
| **Combo packs** (stack × domain) | N×M maintenance explosion; kills the model. Orthogonal composition instead. |
| **Runtime plugin engine / dynamic loader** | Over-engineered vs the platform's copied-files + markdown-routing grain; reuse `--mode=add`. |
| **Auto-activate on detection** | Bloat + surprise; violates "nothing loads unless the user confirms". Detect-and-suggest chosen. |

---

## Phased plan

**Phase 1 — Foundation + stack MVP (overlay-only)**
- Define `pack.json` schema + pack catalog location; `active_packs` in `platform.json`.
- Overlay-loading contract in session-start + expert read step + routing merge.
- 2–3 curated stack packs (e.g. react, django, node), overlay + references + routing only (no new skills/playbooks/agents).
- `--mode=add --add=pack:<id>` + `--mode=list --list=packs`.
- Detect-and-suggest at install + session-start (stack detection via dependency files).
- Tests: pack install/activate, zero-pack core unchanged, overlay compose.

**Phase 2 — Domain packs + language packs** (language layer ✅ shipped, [Unreleased])
- 1–2 domain packs (e.g. fintech/PCI, healthcare/HIPAA): compliance references + security-agent/critic overlays. *(fintech shipped Phase 1)*
- **Language packs** (new `language` kind): `language-typescript`, `language-java`, `language-cpp` — shared code overlay across code-writing experts + curated pitfalls + routing. Detection extended with a bounded **source-extension scan** (`detect.extensions`) so language-only repos (e.g. C++ with no dependency manifest) are still suggested.
- Domain suggestion heuristics (README/keywords; user-driven, not auto).

**Phase 3 — Maintainer growth loop** ✅ shipped ([Unreleased])
- `pack=<id>` scope for Mode 4 (`github-governance-scan.md`) + Mode 2 (`web-audit.md`); "add pack" / "add rule to pack" authoring commands in `platform-maintainer-agent.md`.
- Pack-health check in the internal audit (`platform-audit.md` Step 6b); PSG **pack lane** (independent versioning/tests); registry/report-schema `Scope: pack`.
- Per-pack provenance + `last_verified` refresh cadence.

**Phase 2p — Platform (execution/deployment target) axis** — *design formalized ([Unreleased]); packs not yet built*
- New `kind: "platform"` covering hardware (SoC/board/MCU), OS/RTOS, and container/orchestration runtime. Formalized in this ADR, the roadmap, the pack spec (`.agent/packs/README.md`), and the `add pack` command (accepts `platform-<name>`).
- **When built:** starter packs `platform-docker`, `platform-jetson-orin`, `platform-stm32h7`; overlays attach to `devops-agent`/`architect-agent` (topology/deploy) + `backend-agent` (embedded/real-time). Detection via target markers (`Dockerfile`, `*.cu`/CMake CUDA toolchain, `*.ioc`/linker scripts/device-tree); weak signals stay user-selected.
- Motivating case: a drone mission brain decomposes as `language:cpp` + `stack:ros2` + `platform:jetson-orin` + `platform:stm32h7` + `platform:docker` + `domain:drone-autonomy`; the heterogeneous compute split (Linux SoC ↔ MCU) is captured in the domain pack's `reference-architecture.md`.

**Phase 4 — Distribution & quality**
- Pack registry/catalog surface in DISTRIBUTION docs; community vs curated `confidence` tiers; optional pack-eval certification (ties to deferred R012).

---

## Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| **Staleness** (frameworks move fast) | `confidence` + `last_verified` per pack; Mode 2 refresh cadence; keep packs **thin** (top ~10 failure-derived items, lean on runtime docs for the long tail). |
| **Combinatorial sprawl** | Orthogonal composition; no combo packs; cap officially-maintained set (~top 5 stacks); rest community/cherry-pick. |
| **Core contamination** | Hard rule: packs only write overlays/references — never edit core files. Core ships with zero packs. |
| **Maintenance burden strangles core** | Independent versioning + test slices; a broken pack never blocks a core release. |
| **Bloat / surprise** | Detect-and-suggest only; explicit `active_packs`; zero cost when none active. |

---

## Consequences

**Positive:** genuine stack/domain help without abandoning the agnostic core; users get curated pitfalls + compliance; maintainers gain a sanctioned path to grow specialized brains; provenance discipline extends naturally.

**Negative / cost:** new catalog + install path + detection + PSG lane to build and maintain; ongoing per-pack curation effort; more surface area in docs/tests.

**Neutral:** establishes `MAINTAINER/adr/` as the home for platform architecture decisions.

---

## Open questions (resolve in Phase 1)

1. Pack catalog: `packs[]` in `AGENT-PLATFORM-MANIFEST.json` vs separate `PACKS-MANIFEST.json`?
2. Overlay merge mechanics: does the expert read overlays inline at routing time, or does session-start assemble a merged view?
3. Domain detection: heuristic from README/deps, or always user-selected?
4. Do packs ever contribute full skills/playbooks, or is overlay+references the hard boundary for v1?
5. Versioning: independent SemVer per pack vs pinned to a core range via `requires_core` only?
