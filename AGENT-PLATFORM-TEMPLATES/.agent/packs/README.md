# Packs — technology-stack & domain overlays

> Packs add **curated, opinionated, failure-derived** knowledge for a specific technology stack or business domain, **on top of** the agnostic core. Nothing here loads unless a pack is listed in `.agent/platform.json` → `active_packs`.

Design rationale: [`MAINTAINER/adr/ADR-001-stack-domain-packs.md`](../../../MAINTAINER/adr/ADR-001-stack-domain-packs.md) (in the platform source repo).

## Two kinds (orthogonal, composable)

| `kind` | Examples | Knowledge |
|--------|----------|-----------|
| `stack` | react, django, node | framework idioms, pitfalls, perf traps, version gotchas |
| `domain` | fintech, healthcare, ecommerce | compliance, domain invariants, threat models, **reference architectures** |

Packs compose additively. Activate several at once (`stack:react` + `stack:node` + `domain:fintech`). There are **no combo packs**.

## Anatomy

```
.agent/packs/<id>/
  pack.json                   # manifest (see schema below)
  <expert>-agent.overlay.md   # optional: appended to a core expert when active
  routing.md                  # optional: extra keyword→overlay routing rows
  references/*.md             # curated knowledge / reference architectures
```

## `pack.json` schema

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | `stack-<name>` or `domain-<name>` |
| `kind` | yes | `stack` \| `domain` |
| `display_name` | yes | Human label |
| `version` | yes | SemVer, independent of core |
| `requires_core` | yes | core version range, e.g. `">=2.44.0"` |
| `confidence` | yes | `curated` (maintained) \| `community` |
| `last_verified` | yes | ISO date — staleness signal |
| `detect` | stack: yes | `{ files:[], deps:[], globs:[] }` — signals used to *suggest* (never auto-install) |
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

## Activate / list

```bash
npx github:zafrirron/Agent-Platform --mode=list --list=packs
npx github:zafrirron/Agent-Platform --mode=add --add=pack:stack-react
npx github:zafrirron/Agent-Platform --mode=add --add=pack:domain-fintech
```

Activation copies the pack into `.agent/packs/<id>/` and appends `<id>` to `active_packs` in `.agent/platform.json`. Deactivate by removing the folder and the `active_packs` entry.
