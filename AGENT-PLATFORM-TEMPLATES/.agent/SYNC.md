# Multi-framework sync protocol

Frameworks: **cursor**, **claude**, **antigravity**, **codex**

## Session start

1. Read `handoff/sync/registry.yaml`
2. If another framework is `active` on overlapping `files` → coordinate via `CURRENT.md`
3. Set your framework: `status: active`, `started_at`, `task`, `files`
4. Log `handoff/CURRENT.md` with `**Framework:** <id>`

## Session end

1. Set `status: idle`, `last_active`, clear `files`
2. Update `CURRENT.md` with outcome and **Next agent**

## Private vs shared

See [ZONES.md](ZONES.md). Never edit another IDE's private folder.
