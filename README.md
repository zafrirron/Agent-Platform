# Agent Platform Bootstrap

**Start here:** the full guide is **[AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md)** (~800 lines).

It explains what the platform does, how to install and use it, how to extend it, and how to maintain the framework repository.

---

## Quick links

| Document | Purpose |
|----------|---------|
| [AGENT-PLATFORM-FRAMEWORK-README.md](AGENT-PLATFORM-FRAMEWORK-README.md) | **Complete guide** — capabilities, installation, usage, extending, best practices |
| [AGENT-PLATFORM-BOOTSTRAP.md](AGENT-PLATFORM-BOOTSTRAP.md) | Short orchestrator for agents running install |
| [COPYING.md](COPYING.md) | Exact files to copy (framework repo vs consumer deploy) |
| [PACK-DEPLOY.md](PACK-DEPLOY.md) | Deploy pack to a consumer repository |

---

## Framework repository layout

```text
.
├── README.md                              ← rename this file, or use FRAMEWORK-README as README
├── AGENT-PLATFORM-FRAMEWORK-README.md     ← main documentation (keep this name)
├── AGENT-PLATFORM-BOOTSTRAP.md
├── AGENT-PLATFORM-MANIFEST.json
├── AGENT-PLATFORM-TEMPLATES/
├── AGENT-PLATFORM-APPLY.js
├── COPYING.md
├── PACK-DEPLOY.md
├── tools/
│   ├── build-bootstrap-manifest.js
│   └── build-framework-readme.js
├── package.json
└── .gitignore
```

---

## Regenerate the large guide

After editing human-facing sections in git history or the build script:

```bash
node tools/build-framework-readme.js
```

Then hand-edit `AGENT-PLATFORM-FRAMEWORK-README.md` for v2-specific tweaks the script does not cover.

---

*Pointer file — full documentation in AGENT-PLATFORM-FRAMEWORK-README.md*
