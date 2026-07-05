# Mode 5 — Solution Blueprint (multi-axis pack decomposition & build orchestration)

> **Trigger:** `Read MAINTAINER/solution-blueprint.md and execute it. blueprint="<mission / system brief>"`
> **Requires:** Maintainer agent loaded — `Read MAINTAINER/platform-maintainer-agent.md`
> **This file is for the framework author only.** Never deployed to consumer repos.

---

## What this mode is (and is NOT)

Modes 1–4 grow **one pack at a time** from a known id or source. Mode 5 is **top-down**: the maintainer states a *system / mission goal* in plain language, and this mode **decomposes it into the four pack axes** (`domain` / `stack` / `platform` / `language`), proposes candidate packs per axis (often several), and — **after per-candidate approval gates** — **orchestrates** the existing build engine to author/enrich each approved pack.

**It is a planner + orchestrator, not a new scanner.** It does not fetch the web or write pack brains itself. The actual brain-building is delegated to:
- **Mode 2 `build-pack=<id>`** — greenfield web-wide build of a NEW pack
- **Mode 2 `pack=<id>`** — freshen an EXISTING pack
- (a maintainer may also point a build at a repo/site via `repo=…pack=<id>` / `url=…pack=<id>`)

So Mode 5 = **decompose → dedup → present → approve/reject per axis → delegate builds → record how the packs compose for this system.**

**Non-negotiable:** it **never** auto-creates or auto-builds a pack. Every pack is built only after an explicit approval gate (S5). Rejected axes are recorded as **out-of-scope exclusions** so later cross-axis discovery cannot resurrect them.

---

## Accepted trigger forms

```
blueprint="drone mission platform on NVIDIA edge module; visual AI on gimbaled camera;
           flight path guided by external radar; guidance hands off radar→visual as range closes"
```

Optional modifiers:
- `blueprint="…" name=<slug>` — name the solution bundle (default: derived from the brief).
- `blueprint="…" build=no` — plan + present only (dry-run); never delegate builds (recommended first pass).

---

## Phase S1 — Parse the brief

1. Read `MAINTAINER/scan-results/registry.md` + `REPORT-SCHEMA.md` + `AGENT-PLATFORM-MANIFEST.json → packs_catalog` (know what already exists).
2. Extract **signals** from the brief — each concrete capability, technology, execution target, or language mention. Keep them atomic (one idea per signal) and quote the phrase they came from.
3. Record: **blueprint name/slug**, the brief verbatim, and the signal list.

## Phase S2 — Axis decomposition (the heart of this mode)

Assign **every signal to exactly one axis** using this decision rule. Misclassification is the top risk — apply it strictly (same discipline that keeps video-UX in a `domain` pack but codecs in a `stack` pack).

| Axis | Owns | Litmus test | Drone-brief examples |
|------|------|-------------|----------------------|
| **domain** | what the system *does* + operator UX + information semantics | "Is this a capability/workflow/UX a user of the app experiences?" | mission planning, **radar→visual guidance handoff**, target-tracking capability, geofence/RoE, mission operator UX |
| **stack** | the framework/library that *implements* a capability, built in a language | "Is this a reusable framework/SDK you code against?" | ROS2, TensorRT/OpenCV inference pipeline, GStreamer video pipeline, MAVLink/PX4 flight API |
| **platform** | where it *runs* — hardware + OS/RTOS + drivers/toolchain + container runtime | "Is this an execution/deployment target?" | NVIDIA Jetson (Orin/JetPack/CUDA), a flight-controller MCU/RTOS, edge container runtime |
| **language** | the programming language's own idioms/footguns | "Is this a language?" | C++ (perf perception/guidance), Python (ROS/ML glue) |

Cluster the signals of each axis into **candidate packs** (`domain-…`, `stack-…`, `platform-…`, `language-…`). A single mission typically yields **1–2 domain + 2–4 stack + 1–2 platform + 1–2 language** candidates. Note the system's **glue logic** (e.g. the radar→visual handoff) — it is almost always a **domain** capability and is the thread that ties the packs together.

## Phase S3 — Dedup vs catalog + ledgers

For each candidate, classify against `packs_catalog` and the per-pack ledgers (`MAINTAINER/scan-results/packs/<id>.md`):

| Class | Meaning | Default action if approved |
|-------|---------|-----------------------------|
| **NEW** | no such pack exists | `build-pack=<id>` (greenfield) |
| **ENHANCE** | pack exists but this mission needs more | `pack=<id>` / `repo=…pack=<id>` |
| **REUSE-AS-IS** | pack exists and already covers the need | activate only — no build |
| **COVERED-BY-CORE** | the base platform already handles it | no pack |

Never propose a duplicate of an existing pack — reuse or enhance it (e.g. `language-cpp` already ships → ENHANCE/REUSE, never rebuild).

## Phase S4 — Present the blueprint matrix

Output the decomposition for maintainer review — grouped by axis, ranked within each axis by centrality to the mission:

```markdown
# Solution Blueprint — <name> — YYYY-MM-DD
Brief: "<verbatim>"

## Proposed pack set
| Axis | Candidate id | Class | Rank | Rationale (signal → capability) | Build via |
|------|--------------|-------|-----:|---------------------------------|-----------|
| domain   | domain-drone-mission | NEW      | ★1 | mission plan + radar→visual handoff + operator UX | build-pack= |
| domain   | domain-track-mgmt    | REUSE    |  2 | track/COP semantics already built                 | activate    |
| stack    | stack-ros2           | NEW      | ★1 | robotics middleware                                | build-pack= |
| stack    | stack-cv-inference   | NEW      |  2 | TensorRT/OpenCV perception                         | build-pack= |
| stack    | stack-gstreamer      | NEW      |  3 | gimbal video pipeline                             | build-pack= |
| stack    | stack-mavlink-px4    | NEW      |  4 | flight-path control API                           | build-pack= |
| platform | platform-nvidia-jetson | NEW    | ★1 | Orin edge module: JetPack/CUDA/thermal/power       | build-pack= |
| language | language-cpp         | ENHANCE  | ★1 | perf perception/guidance                          | pack=       |
| language | language-python      | NEW      |  2 | ROS/ML glue                                        | build-pack= |

## Composition note
How these packs compose for <name> (system-of-systems view) → will be written into the
primary domain pack's reference-architecture.md on build.
```

## Phase S5 — Approval gates (per candidate — the maintainer's veto)

**This is the required control.** Present the matrix and accept these commands. Nothing is built until the maintainer approves; **any candidate can be rejected**, and whole axes can be excluded so out-of-scope tech is never built.

| You say | Effect |
|---------|--------|
| `Approve all ★` | Build/enhance only the top-ranked (★) candidate in each axis |
| `Approve domain-drone-mission, stack-ros2, platform-nvidia-jetson` | Build/enhance exactly those |
| `Approve axis:domain, axis:platform` | Approve every candidate in those axes |
| **`Reject stack-gstreamer, stack-mavlink-px4`** | **Exclude those — never built; recorded as out-of-scope for this blueprint** |
| **`Reject axis:language`** | **Exclude the entire language axis (maintainer already owns it / out of scope)** |
| `Defer platform-px4-mcu` | Backlog — not built now, not excluded |
| `Reuse language-cpp` | Mark activate-only (no build) |
| `Modify stack-cv-inference → stack-tensorrt` | Rename/re-scope a candidate before building |
| `Skip all` | Plan archived, nothing built |

**Rejection semantics (out-of-scope guard):** every rejected candidate is written to the blueprint archive's **Out-of-scope exclusions** list *with the maintainer's reason*, AND pre-seeded into the **Adjacent pack candidates** table of every built pack's ledger as `skipped — out of scope (blueprint <slug>)`. This makes the existing cross-axis discovery (Phase B2) and per-pack dedup ledger **respect the veto**: a later `build-pack`/`pack=` scan that stumbles on GStreamer will see it was deliberately excluded and will **not** re-propose it. Re-raise only if the maintainer reopens the blueprint.

## Phase S6 — Orchestrated build (approved only)

For each **approved** candidate, in dependency order (domain first — it defines the composition — then platform, stack, language):

1. **NEW** → run **Mode 2 `build-pack=<id>`** (`web-audit.md` § Pack ecosystem build scan). **ENHANCE** → run **`pack=<id>`** (or `repo=…pack=<id>` if the maintainer named a source).
2. Each delegated build runs its **own** normal flow: ecosystem scan → **Phase B2 cross-axis capture** (now pre-seeded with this blueprint's approvals *and* exclusions) → license/provenance → synthesize → **its own approval of findings** → scaffold → **PSG pack lane** → per-pack ledger.
3. Carry the **blueprint slug** into each pack's ledger (`Sources consumed` note: `via blueprint <slug>`) so provenance links the pack set together.
4. If `build=no`, **stop after S5** — present the plan and the (would-be) build order; write nothing.

**Axis discipline during delegated builds is unchanged:** a signal discovered while building `stack-cv-inference` that is really a Jetson concern routes to `platform-nvidia-jetson` (if approved) or becomes an adjacent candidate (if not) — never merged across axes.

## Phase S7 — Record composition, archive, log

1. **Composition into the domain pack.** Write/refresh the **system-of-systems view** in the primary domain pack's `references/reference-architecture.md`: the mission overview + a table of the companion packs (which axis each covers) so a *platform user* asking *"reference architecture for a <mission> app"* gets the whole coordinated set, not one pack.
2. **Solution bundle (optional).** If `name=` given, record the approved pack ids as a named bundle in the blueprint archive so the installer's detect-and-suggest can later recommend them **together** on a matching repo ("this looks like a Jetson + ROS2 drone-mission project — activate these packs?").
3. **Archive** the blueprint → `MAINTAINER/scan-results/blueprint/YYYY-MM-DD-<slug>-blueprint.md` (matrix + approvals + **out-of-scope exclusions with reasons** + build order + resulting pack versions).
4. **Registry** → prepend a Mode 5 entry to `registry.md` (`Scope: blueprint` · bundle name · approved/rejected/deferred counts).
5. **Improvements log** → `platform-improvements.md` entry. **CHANGELOG `[Unreleased]`** if any pack shipped.
6. Each built pack already ran its **PSG pack lane** in S6; Mode 5 itself is maintainer-only (no consumer template change) beyond the pack files the delegated builds produced.

---

## Guardrails (must hold)

1. **Approval-gated, always.** No pack is built without an explicit S5 approval. Whole axes can be rejected.
2. **Rejections are sticky.** Out-of-scope exclusions propagate into built packs' ledgers so cross-axis discovery cannot resurrect vetoed tech.
3. **Reuse over rebuild.** S3 dedup against `packs_catalog` + ledgers; enhance existing packs, never duplicate.
4. **Axis discipline.** Every signal → exactly one axis via the S2 table; delegated builds keep it.
5. **Scope cap.** Big missions can spawn many packs — rank, and let the maintainer approve incrementally (`Approve all ★` first pass, add more later).
6. **Provenance intact.** Every delegated build keeps its per-pack ledger + PSG pack lane; the blueprint slug links them.
7. **Dry-run first.** Recommend `build=no` for the first pass to validate the decomposition before any brain is built.

---

## Selection command summary (S5 — quick reference)

`Approve all ★` · `Approve <id>[, <id>…]` · `Approve axis:<axis>` · `Reject <id>[, <id>…]` · `Reject axis:<axis>` · `Defer <id>` · `Reuse <id>` · `Modify <id> → <new-id>` · `Skip all`
