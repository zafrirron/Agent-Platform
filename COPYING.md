# Pack copy list

Use this list to create a **clean framework repository** or to **ship a release** to a consumer project.

Copy **only** these paths (relative to repository root):

```text
AGENT-PLATFORM-BOOTSTRAP.md
AGENT-PLATFORM-MANIFEST.json
AGENT-PLATFORM-TEMPLATES/
AGENT-PLATFORM-APPLY.js
```

Optional maintainer files (framework repository only — do **not** copy to consumer projects):

```text
AGENT-PLATFORM-FRAMEWORK-README.md   ← complete human guide (installation, usage, extending)
README-FOR-FRAMEWORK-REPO.md         ← short pointer (rename to README.md if desired)
COPYING.md
PACK-DEPLOY.md
tools/build-bootstrap-manifest.js
tools/build-framework-readme.js
package.json
.gitignore.framework-pack            ← rename to .gitignore
```

---

## Do not copy

Anything not listed above — especially application source code, installed `.agent/` output from another repo, or product-specific documentation.

---

## Consumer project layout after install

The apply step **creates** on the consumer repo (not shipped in the pack):

```text
.agent/
.cursor/
.claude/
.agents/
.codex/
AGENTS.md
SYNC-POINTS.md
CLAUDE.md
```

The pack files may remain on the consumer repo for `mode=upgrade` or be deleted after install.
