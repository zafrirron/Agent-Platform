# {{PROJECT_NAME}} — Agent Platform Skills (lite)

| | |
|---|---|
| **Profile** | lite |
| **Version** | {{BOOTSTRAP_VERSION}} |
| **Upgrade** | `npx {{PLATFORM_NPX}} --profile=full` |
| **Full guide** | Say `"platform help"` (full profile) or read `.agent/PLATFORM-HELP.md` after upgrade |

> **Auto-routing:** describe your task in plain language — or use `/` commands below for predictable workflows.
> **Stuck?** Say `"show quick reference"` or load `using-platform` skill.

---

## Lifecycle commands — when & how

| Command | When to use | What it does |
|---------|-------------|--------------|
| `/spec` | Idea vague; need clarity first | Interview / refine → `spec-outline.md` |
| `/plan` | Spec exists; need tasks | Ordered slices — no code yet |
| `/build` | Ready to implement | One slice at a time · `/build auto` after plan OK |
| `/test` | TDD, coverage, failing tests | Red-green-refactor |
| `/review` | Code review, sanity check | Critic-style feedback |
| `/code-simplify` | Clean up; behavior unchanged | Chesterton's Fence |
| `/webperf` | Slow page, CWV, Lighthouse, API timing | **Measure first** — Quick or Deep audit |
| `/context` | Agent invents APIs, ignores rules, **switched tasks** | Reload right rules/files; ask if unclear |
| `/verify` | "Is it really done?" before moving on | Show test/repro output — not "looks fixed" |
| `/ship` | Ready to release | Release playbook gates |

### Quick picks

| If you… | Use |
|---------|-----|
| Don't know what to build | `/spec` |
| Know what but not how to slice work | `/plan` |
| Plan approved | `/build` |
| Need tests | `/test` |
| Agent went off the rails | `/context` |
| Agent says fixed but you're unsure | `/verify` |
| Page/API feels slow | `/webperf` |

**`/test` vs `/verify`:** `/test` writes/runs tests. `/verify` proves the work is actually complete.

---

## Skills (cherry-pick more)

```bash
npx {{PLATFORM_NPX}} --mode=add --add=skill:interview-me
npx {{PLATFORM_NPX}} --mode=list --list=skills
```

| Skill | Use when |
|-------|----------|
| `interview-me` | Underspecified ask — `/spec` |
| `idea-refine` | Explore concepts before committing |
| `planning-and-task-breakdown` | Spec → tasks — `/plan` |
| `incremental-implementation` | Build slices — `/build` |
| `test-driven-development` | TDD / regression — `/test` |
| `code-simplification` | Simplify without behavior change — `/code-simplify` |
| `web-performance-audit` | CWV / API perf — `/webperf` |
| `context-engineering` | Stale chat, hallucinations, task switch — `/context` |
| `verification-before-completion` | Evidence before "done" — `/verify` |
| `browser-testing-devtools` | Browser MCP UI debug (optional add-on) |
| `ux-research` | User research / usability / journey maps (optional add-on) |
| `using-platform` | "Which skill should I run?" |

---

## Packs — language, stack, platform & domain overlays (opt-in)

Just ask your agent — no terminal commands to remember:

```text
"what packs are available"   "scan my repo for packs"   "activate the React pack"
"what packs are active"      "add this rule to my <pack> pack"  → user.overlay.md (survives updates)
```

Curated **language / stack / platform / domain** knowledge on top of the agnostic core (four composable kinds: `language:*`, `stack:*`, `platform:*` *(roadmap)*, `domain:*`). A language pack = the language itself and overlays every code expert; a stack pack = a framework built in a language. Active packs live in `.agent/platform.json` → `active_packs`; the agent reads the overlay each pack maps in `pack.json` → `provides.agent_overlays`, then your `user.overlay.md` last. Available: `language-typescript`, `language-java`, `language-cpp`, `stack-react`, `stack-django`, `domain-fintech`. The agent runs installs under the hood (`npx {{PLATFORM_NPX}} --mode=add --add=pack:<id>`).

---

## Session & help

| Action | Say or type |
|--------|-------------|
| Start | `Read .agent/session-start.md and execute it.` |
| Show this card | `"show quick reference"` |
| Pick a workflow | Load `using-platform` skill |

**Upgrade to full platform** (experts, handoff, enterprise playbooks):  
`npx {{PLATFORM_NPX}} --profile=full`
