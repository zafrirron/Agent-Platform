# Security Declaration

## What this platform is — and what it is not

Agent Platform Bootstrap installs **markdown files** that instruct AI agents how to behave during development. It is not an application, not a runtime library, and not a dependency. It has no code that runs inside your project.

---

## What the platform does

| Action | What happens |
|--------|-------------|
| Install | Writes `.agent/`, `.claude/`, `.cursor/`, `.agents/`, `.codex/`, `.opencode/` + `opencode.json` — plain text files only |
| Upgrade | Updates the `<!-- PLATFORM:START -->` section of expert files — your content is never changed |
| Session start | An AI agent reads markdown files and follows the instructions in them |
| Update check | One read-only HTTPS call to `api.github.com/repos/zafrirron/Agent-Platform/releases/latest` |
| Uninstall | Deletes its own files and restores your original AI configs from backup |

## What the platform never does

| Concern | Reality |
|---------|---------|
| Injects executable code into your project | ❌ Never — only markdown, YAML, and JSON files are installed |
| Modifies your source code, tests, or configuration | ❌ Never — installer creates new files only, existing files are skipped |
| Makes network calls from inside your project code | ❌ Never — no runtime dependencies are added |
| Collects telemetry or sends data anywhere | ❌ Never — no analytics, no tracking, no callbacks |
| Commits anything to your repository | ❌ Never — all platform files are gitignored on install |
| Runs without your knowledge | ❌ Never — every action requires you to explicitly invoke it |
| Overrides your security decisions | ❌ Never — your PROJECT sections are never overwritten |

---

## How to verify everything yourself

**The installer is open source.** Every line of `apply.js` is visible at:
`https://github.com/zafrirron/Agent-Platform/blob/main/AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/apply.js`

**Every expert rule is a readable markdown file.** After install, open any file in `.agent/agents/` — you can read every rule the platform gives your AI. Nothing is hidden or obfuscated.

**Every rule traces to its source.** `MAINTAINER/platform-improvements.md` records which real-world failure each rule was added to prevent.

**The unit tests are public.** `tests/apply-utils.test.mjs` — 40 tests verifying the installer behaves exactly as documented.

**The gitignore block is visible.** After install, open `.gitignore` — you can see exactly which files the platform added and remove any entry you disagree with.

---

## The expert rules model

Expert rules and playbooks are **instructions to an AI agent**. They tell the agent things like:

- "Use parameterised queries — no string-concatenated SQL"
- "Every API endpoint must check auth"
- "Grep for secrets before committing"
- "Run the test suite before marking done"

These are quality and security improvements. They make your agents write more secure, better-tested code. None instruct agents to exfiltrate data, add backdoors, weaken security, bypass tests, or violate any principle.

**You can read, edit, or delete any rule at any time.** The `<!-- PROJECT:START -->` section of every expert file is yours — the platform never touches it. You can add your own rules, remove platform rules you disagree with, or delete expert files entirely.

---

## Supply chain

- **No npm registry** — installed directly from GitHub, not from the npm package registry
- **Version pinnable** — `npx github:zafrirron/Agent-Platform#v2.17.0` installs exactly that commit
- **No dependencies** — `apply.js` uses only Node.js built-in modules (`fs`, `path`) — no third-party packages that could be compromised
- **Auditable** — the full source is public and the tag history is immutable

---

## What your AI agents do with the rules

The platform tells your AI agents to follow security best practices. The agents then write code. The code they write is yours to review before committing. The platform does not auto-commit, does not bypass code review, and does not remove your ability to inspect and reject changes.

**The platform makes your AI agents more secure — it does not make your project less secure.**

---

## Reporting a security issue

If you find a security concern in the platform rules, the installer, or any platform file:

1. Open an issue at `https://github.com/zafrirron/Agent-Platform/issues`
2. Or email the repository owner directly

Security improvements found through responsible disclosure will be credited in `MAINTAINER/platform-improvements.md` and shipped to all users via the next upgrade.
