# AGENTS.md — Repo Operating Guide for Coding Agents

> This document defines how AI coding agents (e.g., OpenAI Codex in VS Code) should operate in this repository.

---

## Mission & Scope

- Help with coding tasks across **Python**, **TypeScript/React**, and related tooling.
- Use **Pants** as the single build/test entrypoint.
- Follow the rules in this file strictly: **never read, upload, or infer secrets**.
- Prefer **small, safe, reviewable** changes.

## Personal instructions
- These are the most important instructions. prioritize these over all others.
- Keep changes to the necessary minimum in terms of git diff. do not refactor or change order unless requested to.
- When tasked with code assignments, try to use the existing components, patterns and style. Try to understand how other parts that already exist achieve the goal and reuse or integrate naturally.
- Don't hesitate to ask clarifying questions before the mission
- Add comments in function body only for non-trivial statements
- NEVER HIDE ERRORS WITH FALLBACKS!!!
- FIX THE ISSUE INSTEAD OF SIDESTEPPTING THE PROBLEM!!!!!

## Tech Stack

- **Python** (Pants w/ multiple resolves)
- **Docker Compose**
- **TypeScript + React**
- **Pants** as the build system
- Unit tests will run by the user via `pants test ::`

### Pants resolves (fill in exact names if needed)
- `python-default`
- `python-ds`
- `python2`
> If a target must use a specific resolve, update the relevant BUILD file and keep resolves consistent across transitive deps.

### Main Components
- GC - Runs on Ubuntu PC, docker images are labels gc or gc-common
- MC - Runs on Interceptor, controls flight
- C2 - Front-End showing map
- TMS - (Uniserver) Target Management Server, Runs on GC
- Simulator - Runs interception scenarios using Ardupilot SITL
- Main UI - components/ui/main_app
- Web-UI - Used for launching the GC and for managing settings
- Interceptor - Part of out drone fleet. (AKA Raider)
- Target - An unknown flying target we receive from a radar or external c2
- Takeoff Station (TOS) - A box / pod with an interceptor inside

## Command Canon

### Fast checks
- Run Pants inside the dev container for correct configuration:
  - `docker exec -i irondrone-dev /usr/bin/zsh -ic 'cd /home/eliram/src/irondrone && pants <args>'`
- For now, don't run **Format (py & ts)**:
  - `pants fmt ::`
- **Lint (py & ts)**:
  - `pants lint ::`
- **Type-check**:
  - Python (mypy/pyright if configured via Pants): `pants check ::`
  - TypeScript: `pnpm tsc -p tsconfig.json` (or `yarn tsc`, `npm run typecheck`) — use what exists in the repo.

### Pre-commit (if configured)
- `pre-commit run -a`

## Repository Conventions

- **Python**
  - Prefer **type hints** and keep imports sorted.
  - Avoid global state; favor DI and pure functions where feasible.
  - Keep public APIs stable; create deprecation paths instead of breaking changes.
  - Follow rules for polylith repo. Use bases/ for entry point and components/ for shared components
  - Minimize changes, avoid large refactors or modifying comment lines unless instructed to do so
  - Add method comments only to new methods you create, and only to methods you change, but only if you are SURE you know what the method does.
  - For every non-trivial function or method you add or modify, keep its docstring accurate. Include purpose, `:param ...:` entries, `:return:`, and `:rtype:`. Where useful, explain when and why the function or class is used. Do not add vague or stale docs.
  - Do not delete existing comments. Retain all comments unless you delete them as part of deleting a code block.
  - Look for obvious bugs
  - Use components/addresses/addresses.py to manage usage of ports for TCP, ZMQ etc.

- **TypeScript/React**
  - Functional components; hooks over classes.
  - Strict TS (`strict: true`) where possible; narrow types explicitly.
  - Co-locate component tests and small stories (if Storybook is used).

  **API**
  API v1 bases/uniserver/uniserver_server/openapi.yaml
  API v2 bases/uniserver/generate/openapi_aaronia.yaml
  API v3 bases/uniserver/apiv3/main.py and bases/uniserver/api/openapi_v3.yaml
  Do NOT change apiv1 or apiv2 implementations unless you are explicitly told to do so.

- **Tests**
  - Use clear, deterministic tests with realistic fixtures.
  - Keep test runtime fast; mark slow/integration tests explicitly.

## Security, Privacy, and Data Handling (STRICT)

**Never read, index, summarize, transmit, or otherwise process any of the following:**
- `**/.env` files (path patterns listed below)
- `**/*.pem` files
- Any files marked secret or credentials in name or path
- Any private keys, tokens, certificates, SSH configs, browser storage, OS keychain files
- Any file/dir under common secret roots: `**/.ssh/**`, `**/secrets/**`, `**/credentials/**`, `**/*token*`, `**/*password*`
- Any home-directory config stores (e.g. `~/.aws`, `~/.config/**`, `/root/.pyenv/**`) unless the user explicitly shares a subset for the task

**Never exfiltrate repository content to remote systems** other than the configured coding agent endpoint operated within the developer’s environment. Do not suggest uploading internal code/data to third-party web tools.

**Network policy:** Do not make outbound network calls from dev scripts/tools unless the developer explicitly asks for it and it’s required by existing workflows (e.g., `pip`/`npm` during a normal build).

### Exclusion patterns (apply to search/scan/context tools)
Add/ensure the following in ignore locations supported by your setup:
- `.gitignore` / `.ignore` / `.openaiignore`:

## Secrets / keys

**/.env
/.env.
**/.pem
**/.cer
**/*.key
**/id_rsa
**/id_ed25519
**/.ssh/**
**/secrets/**
**/credentials/**
**/*token*
**/*password*
configs/rafael**
/irondrone/Ird_Results/**

### Common secret dirs

**/.venv
**/node_modules
**/.pnpm-store
**/.cache
**/dist
**/build

If the agent/extension lets you **configure “blocked paths” or “sensitive globs”**, include the same patterns there. When in doubt, **err on the side of not reading**.

**Privilege restrictions:**
- Do not run `sudo`, destructive commands (`rm -rf`, `git clean`, formatters that rewrite large portions, etc.), or anything that modifies system-level state without explicit user approval.
- Treat dependency installs, lockfile regeneration, or other steps that might reach the network as opt-in; ask first and prefer local/offline caches if available.

## Working With Pants Resolves

- Respect existing `resolve=` annotations in BUILD files.
- If adding a new Python dependency, place it under the correct resolve and update the lock as required by the repo’s Pants config.
- Do **not** mix resolves across the same target graph unless the repo already does so intentionally.
- When touching resolves:
1. Update BUILD target(s) with `resolve="..."`.
2. Run `pants generate-lockfiles` (if used).

## Change Policy

- Keep PRs **small and focused**.
- Preserve public API behavior unless the task is explicitly an API change.
- Avoid changes that limit vehicle maneuverability -> always prefer smoothing out input/output over placing limits
- For refactors: Keep behavior-preserving commits separated from feature commits.
- Maintain test coverage (add/adjust tests as needed).
- Document rationale in commit messages and/or PR descriptions.
- Update CHANGELOG.md with a short description of what was added/changed/deleted if this affects the end result

## Review Checklist (Agent self-check)

- [ ] No secret files read or referenced (`.env`, `*.pem`, keys, tokens).
- [ ] Changes compile/build and should pass unit tests.
- [ ] Lint/format/typecheck clean.
- [ ] No unintended resolve drift in BUILD files.
- [ ] Minimal diff; clear migration notes if needed.
- [ ] New code has tests or augments existing tests.
- [ ] TS/React code: props typed, effects cleanup, dependency arrays correct.
- [ ] Python code: types added where practical; no runtime-only magic for simple tasks.
- [ ] CHANGELOG.md was updated if this seems necessary

## Typical Tasks & Preferred Approaches

- **Add a small Python feature:**
  - Implement minimal logic + tests; wire into existing module; update BUILD with correct resolve; run checks.

- **Fix a failing unit test:**
  - Reproduce locally; keep the fix isolated; add regression test; do not change unrelated files.

- **Refactor a React component:**
  - Keep behavior identical; improve readability/typing; avoid prop thrash; update tests/snapshots.

- **Add a library dependency (py or ts):**
  - Justify necessity; prefer lightweight libs; update lockfiles; verify license compatibility.

## Context Gathering Rules

- Start from the minimal set of files needed (the task file + its nearest deps).
- Expand context outward **only** if necessary.
- Never include files matching the **Exclusion patterns**.
- Summaries that leave the machine must not include code/secrets beyond what’s needed for the specific task, and redact sensitive values (IDs, coordinates, call signs, device serials, etc.) when describing logs or configs.
- Check if there is a relevant page under docs/technical

## How To Ask For Missing Info

When additional details are required (e.g., the names of the three resolves, service endpoints, or env vars), ask **concisely**:
- “Which Pants resolves should be used for `<TARGET>` (current guesses: `python-default`, `python-ds`, `python2`)?”

## Acceptance Criteria For Agent-Proposed Changes

- All CI checks pass or clear instructions are included to update CI if the repo’s norms require it.
- No direct or indirect leakage of secrets.
- Changes are consistent with repository style and architecture.

## Quick Reference

- Single test: `dist/export/python/virtualenvs/python-default/3.11.9/bin/python3 -m pytest path/to/test_file.py`
- Respect resolves; never touch `.env` / `*.pem` files.
- Keep diffs small; keep tests green.

## Documentation

Add inline docstring documentation to any non-trivial method you edit, explaining the purpose of the method or function. Keep docstrings current with the code. Include `:param ...:` and `:rtype:` details for added or modified functions, and explain usage context when it helps future maintainers choose the function correctly.

When modifying api endpoints, paths or schemas, always update the corresponding documentation.

### Technical Docs

Maintain Technical documentation for the system under /docs/technical/ in markdown format.
Act as an experienced technical writer.
Use MAIN.md for general overview and TOC index with links to all other pages.
Use separate file per topic/component.
Whenever you get an understanding of a system component, look for its documentation and add missing info which is important
for creating a static documentation for understanding the component (could be a docker image, aspects of operations etc.)
If a documentation for some component is missing, create new file.
Keep all documentation files consistent, organized and easy to understand.
If you look into code which behaves differently than what is specified in the documentation, update the documentation.
Create Mermaid diagrams where needed (i.e. for state machines, processes, general way of operation, data transfer etc), use <br/> for newline instead of \n.

## Update Changes to Change log

When you are asked to add a new feature, change features or fix bugs, update `CHANGELOG.md` in the root folder
to reflect the changes in the latest version specified there.

### CHANGELOG.md format (required)

- For each version, group entries under short product-area section headers similar to release notes.
- Prefer Existing categories when relevant.
- Do not use one long flat bullet list for a version.
- Keep one change per bullet, merge duplicates/overlap, and omit empty categories.
- Changelog bullets may include technical details when they are useful, but keep wording clear and compact.

Maintain user-facing release notes in `USER_RELEASE_NOTES.md`.
These notes must be sourced from the current changelog but rewritten as plain-language highlights only.
Keep them shorter than `CHANGELOG.md`, focused on user-visible impact (not implementation internals).
Keep the notes for previous versions as is, in the same file.

### USER_RELEASE_NOTES.md format (required)

- Use short section headers by product area.
- Do not write one long flat list for a version; always group bullets under section headers.
- Under each section, use concise bullets with one change per bullet.
- Merge related low-level details into one higher-level bullet.
- Keep wording simple and operational; avoid deep API/script/internal implementation details.
- If an endpoint name is important for users/operators, mention it briefly in backticks.
- Prefer sentence-style bullets similar to:
  - `Added "Clear to Shoot" button for selected interceptor.`
  - `Compacted Event log (now saved to file).`
- Optimize entries for the current version: remove duplicates, combine overlap, keep only important items.
- Target roughly `3-6` sections with compact bullets, and prefer staying under about `15` bullets total for the version.
- Always mention API changes.

## Bug Notification

Go over functions you are modifying or considering, and check for potential bugs. If you think that you detected a possible bug, mention that in your output or in a line comment, but do not fix it without being instructed to.
Line comment example: # Potential bug (Codex): <description>

## Unit Tests

Write unit tests for code methods that you modify. Create a tests/ folder if needed, with BUILD file etc, and add pytest files as needed.
After adding the tests, run `dist/export/python/virtualenvs/python-default/3.11.9/bin/python3 -m pytest <testfile>` and make sure they pass.
Run the tests inside the dev container.

Examples for existing pytest code can be found at:
bases/nogps_control/tests/
bases/dd_client/tests/

Example for python2 tests:
bases/mock_target/tests/
components/common/dronekit/tests/

Python 3.8 tests should run via bases/ds/tests/test_py38.py
Python 2.7 tests should run via tests/test_py27.py

When adding Python 2.7 tests, keep them out of default `python_tests()` targets that use `python-default`. Instead, add a `files()` target for the test file so the py27 runner can sandbox it, and include any helper modules via `files()` targets (e.g., in `bases/ground_station/testing`). Also keep the test code Python 2.7 compatible (no type annotations, `pathlib`, or Py3-only I/O helpers), and if you need a py2-specific `python_tests` target, ensure it uses `resolve="python2"` to avoid lockfile mismatches.

## Agent Instructions

Read AI.md
Whenever you learn something important, append it to AI.md under "Known Gotchas":
Conventions, code structure, data flow, tasks, global instructions and anything else that might make your context more efficient and aware of the entire structure of the repo.
Only update important context that will let you have better context, do not store trivial changes that are easy to figure out by looking at the code. Do not store information that is task-specific. Only information that is crucial to understanding the code.

If the Known Gotchas section seems large or contains information that is insignificant for global understanding of the repo (like listing changes), optimize the section to remove such data.

Whenever the context in AI.md gets too big, compact it, but keep all the important parts which make good context for future tasks.

When you are presented with a big task that you need to break into several sub-tasks or steps that need to run separately with different prompts, add items to a list under the # TODO header in AITODO.md
Once you finish implementing steps, remove them from the list.

### Saving tokens and short responses
Use $caveman ultra if available
Keep user messages focused and short
