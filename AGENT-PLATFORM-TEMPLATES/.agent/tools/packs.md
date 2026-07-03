# Packs — agent instructions

> You (the agent) run these on the user's behalf. **The user never types a terminal command** — they prompt in natural language and you execute the right action below, then report the result. This mirrors how `upgrade.md` works.

Packs are opt-in language / stack / platform / domain overlays layered on the agnostic core. See `.agent/packs/README.md` for the model.

---

## Intent → action

### "What packs are available?" (list / show / what can I add)

Run and present the output:

```
npx {{PLATFORM_NPX}} --mode=list --list=packs
```

Show the user each `pack:<id> [kind] — description`. Then offer: *"Say 'activate the <name> pack' and I'll add it."*

### "What packs are active?" (which am I using / my packs)

Read `.agent/platform.json` → `active_packs` (no terminal command needed). Report the list; if empty, say *"No packs active — the core rules are running. Ask me to scan your repo for suggestions."*

### "Which packs should I use?" / "Scan my repo for packs" / "recommend packs"

Detect against the project (read-only reasoning — do **not** mutate anything):
1. Read the available catalog (from `--mode=list --list=packs` above, or `.agent/packs/README.md`).
2. Inspect the repo for each pack's signals:
   - **language** — `tsconfig.json` / `pom.xml` / `CMakeLists.txt`, or source extensions (`.ts`, `.java`, `.cpp`).
   - **stack** — framework deps in `package.json` / `requirements.txt` / `pyproject.toml` (e.g. `react`, `django`), or framework file patterns (`**/*.tsx`).
   - **domain** — weak signal; suggest only if the repo clearly matches (payments deps, domain vocabulary). Otherwise let the user pick.
3. Present matches as recommendations with a one-line reason each. Never auto-activate — end with *"Want me to activate any of these?"*

> The installer also prints a "Suggested packs" block during `--mode=install` / `--mode=upgrade`; you may run `npx {{PLATFORM_NPX}} --mode=upgrade` to refresh from the canonical detector (safe — it preserves `active_packs` and your `user.overlay.md`), but prefer read-only reasoning for a pure "scan".

### "Activate / add the <name> pack" (use / enable / install <name>)

1. Resolve the pack id (`react` → `stack-react`, `typescript` → `language-typescript`, `fintech` → `domain-fintech`; list packs if ambiguous).
2. Run:

```
npx {{PLATFORM_NPX}} --mode=add --add=pack:<id>
```

3. Confirm by reading `.agent/platform.json` → `active_packs` includes `<id>`, and tell the user the pack is now active and its rules will load automatically for the relevant experts.

Add several at once: `--add=pack:language-typescript,pack:stack-react`.

### "Deactivate / remove / turn off the <name> pack"

1. Delete the folder `.agent/packs/<id>/`.
2. Remove `<id>` from `.agent/platform.json` → `active_packs`.
3. Confirm. (Preserve `.agent/packs/<id>/user.overlay.md` elsewhere first if the user wants to keep their custom rules.)

### "Add this rule to my <name> pack"

Append the rule to `.agent/packs/<id>/user.overlay.md` (create if missing) under a `## <topic>` heading — see `AGENTS.md` step 3c. This file is user-owned and survives every update. Never edit a shipped `*.overlay.md` inline.

---

## Notes

- Adding/removing packs needs the platform source, so those actions run `npx {{PLATFORM_NPX}} …` — **you** run it, not the user.
- Listing active packs and adding rules are local file operations (no network).
- Packs never auto-install; activation is always explicit.
