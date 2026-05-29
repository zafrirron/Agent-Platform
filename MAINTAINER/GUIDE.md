# Platform Maintainer Guide

> **For the framework author only.** Not deployed to consumer repos.
> User-facing documentation: `AGENT-PLATFORM-FRAMEWORK-README.md`

---

## The meta-philosophy

This platform is developed using itself. The maintainer's AI agent (loaded from this folder) reads and improves the templates that consumer AI agents use. This creates a feedback loop:

```
You observe a failure in a consumer repo
        ↓
Your AI partner (platform-maintainer-agent.md) helps you
diagnose, audit, and write a better rule
        ↓
The rule ships in the next version
        ↓
Every consumer's agents are now smarter
        ↓
You observe the next gap — loop continues
```

**The platform gets smarter by encoding real failures into permanent rules.**

---

## Repository layout — what's yours vs what ships

```
Agent Platform Bootstrap (framework repo)
│
├── MAINTAINER/                    ← YOUR PRIVATE WORKSPACE — never deployed
│   ├── platform-maintainer-agent.md  ← your AI partner
│   ├── GUIDE.md                       ← this file
│   ├── platform-audit.md              ← audit playbook
│   └── platform-improvements.md       ← improvement log
│
├── AGENT-PLATFORM-TEMPLATES/      ← SHIPS TO CONSUMER REPOS on install
│   ├── .agent/agents/             ← 8 expert agents (with PLATFORM/PROJECT sections)
│   ├── .agent/playbooks/          ← 8 playbooks (with PLATFORM section)
│   ├── .agent/CONVENTIONS.md      ← coding conventions (with PLATFORM/PROJECT sections)
│   └── ... (all other installed files)
│
├── AGENT-PLATFORM-MANIFEST.json   ← template registry + bootstrap_version
├── AGENT-PLATFORM-APPLY.js        ← installer entry point
├── bin/agent-platform.js          ← npx entry point
├── AGENT-PLATFORM-FRAMEWORK-README.md  ← USER documentation
├── CHANGELOG.md                   ← version history (user-visible)
└── tools/                         ← build scripts (manifest, readme)
```

---

## Starting a maintainer session

```
Read MAINTAINER/platform-maintainer-agent.md
Task: [your goal — e.g. "audit the security expert for gaps", "add a new rule for X"]
```

The maintainer agent knows the full framework structure, the two-section model, the extension anatomy, and the release process. You do not need to explain these to it.

---

## The two-section model — the core mechanism

Every template file that ships to consumer repos has two clearly marked sections:

```markdown
<!-- PLATFORM:START -->
Rules maintained by the platform author.
Replaced automatically when user runs --mode=upgrade.
<!-- PLATFORM:END -->

<!-- PROJECT:START -->
User's project-specific customisations.
NEVER touched by any upgrade mode.
<!-- PROJECT:END -->
```

**What this enables:** you improve expert rules, and every user gets the improvement on next upgrade — without losing their project customisations.

**What `mode=upgrade` does:**
- Finds `<!-- PLATFORM:START/END -->` markers in the existing file
- Replaces only that block with the new template version
- Leaves everything outside those markers untouched
- Files without markers: skipped (not overwritten)

---

## The improvement loop — step by step

### 1. Observe a failure
A consumer reports (or you discover): "The Backend agent shipped an endpoint without updating api-contracts.md."

### 2. Open a maintainer session
```
Read MAINTAINER/platform-maintainer-agent.md
Task: The Backend agent shipped an endpoint without updating api-contracts.md.
I want to add a done-when gate. First check for duplicates.
```

### 3. Audit for duplicates
The agent searches existing rules and reports what's already there.

### 4. Write the rule
Add to the PLATFORM section of the relevant file:
```markdown
## Done-when
- [ ] api-contracts.md updated with new/changed endpoints
```

### 5. Log it
```
Read MAINTAINER/platform-improvements.md
Add entry: failure, rule added, version, file changed
```

### 6. Test it
Install in a scratch repo:
```bash
mkdir /tmp/test-repo && cd /tmp/test-repo && git init
npx github:zafrirron/Agent-Platform  # or run locally from this repo
```
Start a session, ask the backend expert to do something — verify the new rule appears and the agent follows it.

### 7. Ship it
```bash
# Bump version in: AGENT-PLATFORM-MANIFEST.json, AGENT-PLATFORM-BOOTSTRAP.md,
# AGENT-PLATFORM-FRAMEWORK-README.md, package.json, README.md
git add -A
git commit -m "feat(backend-agent): add done-when gate for api-contracts.md update (v2.X.0)"
git push
```

---

## Adding a new expert — checklist

- [ ] File: `AGENT-PLATFORM-TEMPLATES/.agent/agents/<name>-agent.md`
- [ ] Has `<!-- PLATFORM:START/END -->` markers
- [ ] Has `<!-- PROJECT:START/END -->` placeholder section
- [ ] Domain clearly stated
- [ ] "Before any task" reading list (which context files to read)
- [ ] At minimum 5 specific, verifiable rules
- [ ] Done-when checklist (2-5 items)
- [ ] Added to `AGENT-PLATFORM-MANIFEST.json`
- [ ] Added to `AGENTS.md` template expert table
- [ ] Added to `QUICK-REF.md` template expert table
- [ ] Added to `PLATFORM-HELP.md` template expert section
- [ ] CHANGELOG entry written
- [ ] `MAINTAINER/platform-improvements.md` entry written

---

## Adding a new playbook — checklist

- [ ] File: `AGENT-PLATFORM-TEMPLATES/.agent/playbooks/<name>.md`
- [ ] Has `<!-- PLATFORM:START/END -->` markers
- [ ] Has a Pre-conditions checklist
- [ ] Steps are numbered, specific, expert-assigned where relevant
- [ ] At least one hard quality gate (STOP / blocked if condition not met)
- [ ] Rules section with at least 3 hard rules
- [ ] Added to `AGENT-PLATFORM-MANIFEST.json`
- [ ] Added to `AGENTS.md` template playbooks table
- [ ] Added to `QUICK-REF.md` template playbooks table
- [ ] Added to `PLATFORM-HELP.md` template playbooks table
- [ ] CHANGELOG entry written
- [ ] `MAINTAINER/platform-improvements.md` entry written

---

## Versioning rules

| Change type | Version bump |
|------------|-------------|
| New file added to manifest | Minor (2.x.0) |
| Existing PLATFORM section improved | Patch (2.7.x) |
| New install mode or infrastructure change | Minor (2.x.0) |
| Breaking change to file structure or markers | Major (x.0.0) |

---

## Quality gate before any release

```bash
# 1. Install in a clean scratch repo
mkdir /tmp/ap-test && cd /tmp/ap-test && git init
node /path/to/Agent-Platform/AGENT-PLATFORM-APPLY.js --pack=/path/to/Agent-Platform --target=.

# 2. Verify: correct files created, no unfilled {{placeholders}} in critical files
grep -r "{{" .agent/agents/ .agent/playbooks/ .agent/CONVENTIONS.md

# 3. Start a session — confirm quick reference appears correctly
# 4. Confirm new rules appear in the relevant expert file
# 5. Confirm PROJECT sections are empty (not pre-filled with platform content)
```
