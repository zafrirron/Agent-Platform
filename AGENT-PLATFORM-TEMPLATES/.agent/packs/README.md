# Packs — language, stack, platform & domain overlays

> Packs add **curated, opinionated, failure-derived** knowledge for a specific programming language, technology stack, execution/deployment target (hardware/OS/runtime), or business domain, **on top of** the agnostic core. Nothing here loads unless a pack is listed in `.agent/platform.json` → `active_packs`.

Design rationale: [`MAINTAINER/adr/ADR-001-stack-domain-packs.md`](../../../MAINTAINER/adr/ADR-001-stack-domain-packs.md) (in the platform source repo).

## Four kinds (orthogonal, composable)

| `kind` | Examples | Knowledge |
|--------|----------|-----------|
| `language` | typescript, java, cpp | language semantics, type/memory/concurrency footguns, idioms — **loads for any code-writing expert** |
| `stack` | react, django, ros2 | framework/library idioms, pitfalls, perf traps, version gotchas |
| `platform` | docker, jetson-orin, stm32h7 | *where the code runs* — hardware (SoC/board/MCU), OS/RTOS + drivers, cross-compile toolchains, container/orchestration runtime, real-time/power/memory budgets |
| `domain` | fintech, healthcare, drone-autonomy | compliance, domain invariants, threat models, **reference architectures** |

- **Language vs stack:** a `language` pack is the language itself (reusable across every framework in it — `language:typescript` applies to React, Angular, Node…); a `stack` pack is a framework/library *built in* a language. Separate kinds so language rules aren't duplicated into every framework pack.
- **Stack vs platform:** `stack` = an application framework built in a language; `platform` = the execution/deployment target (hardware, OS/RTOS, container runtime). A container/OS runtime (Docker, Linux) is `platform`; a *language* runtime (Node, JVM) stays with `language`/`stack`.
- **Kinds don't limit composition.** A `kind` is just a category label — you can activate several packs of the *same* kind. A drone (Linux SoC + MCU) activates multiple `platform` packs at once. So hardware and OS don't need separate kinds; keep OS knowledge inside a hardware pack when coupled, extract a standalone `platform-freertos` only when reused across boards.

Packs compose additively. Activate several at once (e.g. `language:cpp` + `stack:ros2` + `platform:jetson-orin` + `platform:stm32h7` + `domain:drone-autonomy`). There are **no combo packs**.

> **Availability:** `language`, `stack`, and `domain` packs ship curated today. The `platform` kind is **defined but has no curated packs yet** — author one with the maintainer `add pack platform-<name>` command (see the platform source repo).

## Anatomy

```
.agent/packs/<id>/
  pack.json                   # manifest (see schema below)          — platform-owned
  <expert>-agent.overlay.md   # stack/domain: appended to ONE core expert when active — platform-owned
  code.overlay.md             # language: one shared overlay mapped to several code experts — platform-owned
  routing.md                  # optional: extra keyword→overlay routing rows            — platform-owned
  references/*.md             # curated knowledge / reference architectures             — platform-owned
  user.overlay.md             # YOUR project rules for this pack — user-owned, survives all updates
```

> **Platform-owned vs user-owned.** Every file the platform ships for a pack is *platform-owned*: it can be replaced when you update the pack. `user.overlay.md` (and any extra file **you** add) is *user-owned*: it is not in the platform manifest, so no install/upgrade/force ever touches it.

The loader resolves which overlay to read from `pack.json` → `provides.agent_overlays[<routed expert>]` — so a `language` pack can map `backend-agent`, `frontend-agent`, `data-agent`, `test-agent` all to the same `code.overlay.md` (no duplication), while a `stack` pack maps one expert to `<expert>-agent.overlay.md`.

## `pack.json` schema

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | `language-<name>`, `stack-<name>`, `platform-<name>`, or `domain-<name>` |
| `kind` | yes | `language` \| `stack` \| `platform` \| `domain` |
| `display_name` | yes | Human label |
| `version` | yes | SemVer, independent of core |
| `requires_core` | yes | core version range, e.g. `">=2.44.0"` |
| `confidence` | yes | `curated` (maintained) \| `community` |
| `last_verified` | yes | ISO date — staleness signal |
| `detect` | language/stack: yes | `{ files:[], deps:[], globs:[], extensions:[] }` — signals used to *suggest* (never auto-install). `extensions` (e.g. `[".cpp", ".hpp"]`) is scanned shallowly so language-only repos with no dependency manifest are still detected. **Platform packs** detect by target markers (`Dockerfile`, `*.cu`/CMake CUDA toolchain, `*.ioc`/linker script/device-tree); weak signals stay user-selected, like domain packs. |
| `provides.agent_overlays` | no | `{ "<agent-id>": "<file>" }` — read after the core expert when active |
| `provides.references` | no | reference files (pitfalls, reference architectures) |
| `provides.routing_rows` | no | file with extra routing rows |
| `provides.skills` / `provides.playbooks` | no | reserved (overlay+references is the v1 boundary) |
| `reference_sources` | domain: recommended | `[{ repo, url, kind, license, note }]` — real source repos/apps a domain reference architecture is distilled from (see below) |
| `attribution` | yes | provenance string |

## Domain packs — reference architectures & source linkage

Domain packs are often distilled from **real applications** (not just agent-brain repos). We keep links back to those sources so:

1. **Provenance** — every distilled pattern traces to a real app/repo (license-checked).
2. **User reference-architecture requests** — when a user asks *"give me a reference architecture for a <domain> app"*, the agent reads `references/reference-architecture.md`, which cites the linked `reference_sources` so the user can study the real implementations.
3. **Iterative maintainer growth** — a maintainer runs `pack=<id>` scoped scans (Modes 2/4) to append new sources and enrich the reference architecture over time.

`reference_sources[]` entry:

```json
{ "repo": "owner/name", "url": "https://github.com/owner/name", "kind": "app|library|spec", "license": "MIT", "note": "what we distilled from it" }
```

## Language packs — one overlay, every code expert

A `language` pack (e.g. `language-typescript`, `language-java`, `language-cpp`) ships a single `code.overlay.md` and maps it in `provides.agent_overlays` to each code-writing expert:

```json
"agent_overlays": {
  "backend-agent": "code.overlay.md",
  "frontend-agent": "code.overlay.md",
  "data-agent": "code.overlay.md",
  "test-agent": "code.overlay.md"
}
```

Because the pack is in `active_packs`, the loader reads that overlay for whichever code expert a task routes to — so the language's rules apply to *all* code written in the session, not just when the user names the language. Detection uses a marker file (`tsconfig.json`, `pom.xml`, `CMakeLists.txt`) and/or a source-extension scan (`.ts`, `.java`, `.cpp`).

## Platform packs — where the code runs (defined; not yet curated)

A `platform` pack captures the execution/deployment target. Overlays attach to the experts that own *where code runs*: typically `devops-agent` + `architect-agent` (deploy topology, hardware integration) and `backend-agent` (embedded / real-time code). Compose freely — a heterogeneous system activates several at once:

```
language:cpp + stack:ros2 + platform:jetson-orin + platform:stm32h7 + platform:docker + domain:drone-autonomy
```

The cross-component split (e.g. hard real-time on an MCU, perception/planning on a Linux SoC) belongs in the **domain** pack's `reference-architecture.md`, which cites the real source apps it was distilled from. No curated `platform-*` packs ship yet — see the maintainer `add pack platform-<name>` command.

## Customizing a pack — your rules, kept across updates

Packs follow the same preservation contract as the rest of the platform: **anything the platform ships is replaceable; anything you author is untouchable.** There are three ways to add your own knowledge, all update-safe:

1. **Add a rule to an active pack (most common).** Just tell the agent in plain language while the pack is active — e.g. *"add this to my `domain-c2` pack: the tactical panel must be supported on the split-screen layout."* The agent appends it to `.agent/packs/<id>/user.overlay.md` under a `## <expert-or-topic>` heading (creating the file if needed). It is read **last** on every routed task where the pack is active, so it takes precedence over both the shipped overlay and the generic expert.
2. **Add your own reference files.** Drop `.md` files anywhere under `.agent/packs/<id>/` (e.g. `references/our-conventions.md`). They are not in the manifest, so they persist.
3. **Author your own pack.** Create `.agent/packs/<company>-<x>/` with a `pack.json` and overlays. A fully user-authored pack is never in the platform manifest → it survives everything.

**Why this matters:** shipped overlays (`*.overlay.md`, `references/*`) have no PLATFORM/PROJECT split — so never edit them inline. If you do, your edits are lost the moment you update that pack. Put your additions in `user.overlay.md` instead; that is the pack equivalent of the core two-section (PROJECT) model.

### Update / preservation behavior

| Action | Shipped pack files (`*.overlay.md`, `references/*`, `pack.json`) | Your `user.overlay.md` / own files |
|--------|------------------------------------------------------------------|-------------------------------------|
| `--mode=upgrade` (core update) | **Skipped** — packs are not touched by a core upgrade | Untouched |
| `--mode=force` | **Skipped** — force resets core templates, not packs | Untouched |
| Re-run `--mode=add --add=pack:<id>` | Existing files skipped (write-once); only missing files added | Untouched |
| **Update a pack to a new version** | Remove `.agent/packs/<id>/` then re-`add` → shipped files refreshed | **Preserved** — copy `user.overlay.md` back if you removed it, or move it aside first |

> To pull a newer shipped pack, delete the pack folder and re-add it. `user.overlay.md` is the only file you must keep — back it up (or keep it out of the deleted set) and it carries all your customizations onto the new version.

## Activate / list

```bash
npx github:zafrirron/Agent-Platform --mode=list --list=packs
npx github:zafrirron/Agent-Platform --mode=add --add=pack:language-typescript
npx github:zafrirron/Agent-Platform --mode=add --add=pack:stack-react
npx github:zafrirron/Agent-Platform --mode=add --add=pack:domain-fintech
```

Activation copies the pack into `.agent/packs/<id>/` and appends `<id>` to `active_packs` in `.agent/platform.json`. Deactivate by removing the folder and the `active_packs` entry.
