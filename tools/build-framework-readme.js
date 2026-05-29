/**
 * Regenerate AGENT-PLATFORM-FRAMEWORK-README.md from git v1.3 human sections + v2 pack updates.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const raw = execSync('git show 1f23646:AGENT-PLATFORM-BOOTSTRAP.md', { encoding: 'utf8', cwd: ROOT });
const lines = raw.split(/\r?\n/);
const endIdx = lines.findIndex((l) => l === '## What this installs');
let body = lines.slice(0, endIdx).join('\n');

const subs = [
  ['One file. One command.', 'One pack. One command.'],
  ['Copy this file to any repo root', 'Copy the platform pack to any consumer repository root'],
  ['| This file | `AGENT-PLATFORM-BOOTSTRAP.md` in the repo root |', '| Platform pack | See [COPYING.md](COPYING.md) |'],
  ['2.  Copy AGENT-PLATFORM-BOOTSTRAP.md into the repo root', '2.  Copy the pack files from COPYING.md into the repo root'],
  ['You only need **one file**. Copy `AGENT-PLATFORM-BOOTSTRAP.md`', 'Copy the **platform pack** (see [COPYING.md](COPYING.md))'],
  ['Copy-Item AGENT-PLATFORM-BOOTSTRAP.md', '# Copy pack per COPYING.md'],
  ['Writes every template from Appendix B — skips files that already exist', 'Runs `node AGENT-PLATFORM-APPLY.js` — writes from `AGENT-PLATFORM-TEMPLATES/`; skips existing'],
  ['1. Replace `AGENT-PLATFORM-BOOTSTRAP.md` with the new version', '1. Copy the new pack release (orchestrator + manifest + templates)'],
  ['`mode=force` resets templates', '`--mode=force` resets templates'],
  ['REPAIR PLATFORM       Read AGENT-PLATFORM-BOOTSTRAP.md and execute it. mode=repair', 'REPAIR PLATFORM       node AGENT-PLATFORM-APPLY.js --mode=repair'],
  [
    'EXTEND PLATFORM       Read AGENT-PLATFORM-BOOTSTRAP.md → see Extending guide for prompt templates',
    'EXTEND PLATFORM       See Extending guide in AGENT-PLATFORM-FRAMEWORK-README.md',
  ],
  [
    'Every extension touches these locations in `AGENT-PLATFORM-BOOTSTRAP.md` in order. Give this list to any agent when asking it to extend the bootstrap:',
    'Every extension touches the **templates pack** in this order. Give this list when extending the platform:',
  ],
  [
    'Miss any step and the next repo bootstrapped from this file won\'t get the new capability.',
    'Miss any step and the next consumer repo upgraded from the pack will not get the new capability.',
  ],
];
for (const [from, to] of subs) body = body.split(from).join(to);

body = body.replace(
  /\| \*\*1 · Directories\*\* \| Creates all platform folders that are missing \|\n\| \*\*2 · Write files\*\* \|[^\n]+\n/,
  '| **1 · Verify pack** | Confirms manifest + `AGENT-PLATFORM-TEMPLATES/` at repo root |\n| **2 · Apply** | `node AGENT-PLATFORM-APPLY.js` — writes templates; skips existing files |\n'
);

body = body.replace(
  /```\n1\. Usage Guide         → add human-readable section or command to quick-ref card\n2\. "What this installs"→ add row to the table\n3\. Appendix A          → add any new directories needed\n4\. Appendix B          → add FILE: <path> template\(s\) — the content written to disk\n5\. Phase 3 stubs       → if the file is project-specific, add it to the stub-fill table\n6\. Appendix C          → add compliance check line\(s\)\n7\. AGENTS\.md template  → update §2 agents table or §5 hard rules if relevant\n```/,
  `\`\`\`
1. This README — Usage / Extending sections + quick-ref card
2. Install tables — update counts/lists if needed
3. AGENT-PLATFORM-TEMPLATES/ — add or edit template file(s)
4. node tools/build-bootstrap-manifest.js — regenerate manifest
5. Stub templates / apply.js Phase 3 — if project-specific
6. Bump bootstrap_version in manifest + AGENT-PLATFORM-BOOTSTRAP.md footer
7. AGENTS.md template — update expert table or hard rules if relevant
\`\`\``
);

body = body.replace(/^Read AGENT-PLATFORM-BOOTSTRAP\.md\n\nTask:/gm, 'Edit AGENT-PLATFORM-TEMPLATES/ then rebuild manifest.\n\nTask:');

const header = `# Agent Platform Bootstrap — complete guide

> **Human documentation** for the framework pack and for day-to-day use after install.
> **Agent install:** [AGENT-PLATFORM-BOOTSTRAP.md](AGENT-PLATFORM-BOOTSTRAP.md) · **Copy list:** [COPYING.md](COPYING.md) · **Deploy:** [PACK-DEPLOY.md](PACK-DEPLOY.md)

---

## Two kinds of repositories

| Repository | Purpose | What lives here |
|------------|---------|-----------------|
| **Framework repository** | Develop and version the pack | \`AGENT-PLATFORM-TEMPLATES/\`, manifest, apply script, maintainer docs |
| **Consumer repository** | Your application + installed platform | Product code + \`.agent/\`, IDE private folders, \`AGENTS.md\` |

**Do not mix:** application source does not belong in the framework repository.

---

## v2 pack model

| Piece | Path | Role |
|-------|------|------|
| Orchestrator | \`AGENT-PLATFORM-BOOTSTRAP.md\` | Short instructions for the executing agent |
| Manifest | \`AGENT-PLATFORM-MANIFEST.json\` | Template paths + \`bootstrap_version\` |
| Templates | \`AGENT-PLATFORM-TEMPLATES/\` | All installable file bodies |
| Installer | \`AGENT-PLATFORM-APPLY.js\` | \`--mode=install|repair|upgrade|force\` |

---

`;

const footer = `

---

## Framework repository — maintain and release

1. Edit \`AGENT-PLATFORM-TEMPLATES/\`
2. \`node tools/build-bootstrap-manifest.js\`
3. Bump \`bootstrap_version\` in manifest + orchestrator footer
4. Tag release; consumer repos upgrade via \`npx github:zafrirron/Agent-Platform --mode=upgrade\`

---

*Agent Platform Bootstrap v2.5 — complete human guide · templates in AGENT-PLATFORM-TEMPLATES/*
`;

body = body.replace(
  /^# Agent Platform Bootstrap\n\n> \*\*One pack\. One command\./m,
  '## Platform capabilities\n\n> **One pack. One command.'
);

const out = header + body + footer;
fs.writeFileSync(path.join(ROOT, 'AGENT-PLATFORM-FRAMEWORK-README.md'), out);
console.log('Wrote', out.split('\n').length, 'lines to AGENT-PLATFORM-FRAMEWORK-README.md');
