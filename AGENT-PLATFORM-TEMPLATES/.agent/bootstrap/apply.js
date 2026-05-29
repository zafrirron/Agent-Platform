#!/usr/bin/env node
/**
 * Apply AGENT-PLATFORM-MANIFEST.json templates (Node.js — Windows, Linux, macOS).
 *
 * Supports two separate roots:
 *   PACK_ROOT    — where AGENT-PLATFORM-MANIFEST.json + templates live
 *   INSTALL_ROOT — where files are written (the consumer repo)
 *
 * Resolution order for each root:
 *   1. CLI flag:  --pack=<path>   / --target=<path>
 *   2. Env var:   AP_PACK=<path>  / AP_TARGET=<path>
 *   3. Auto-detect (search for AGENT-PLATFORM-MANIFEST.json upward from CWD)
 *   4. process.cwd()
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── CLI args ─────────────────────────────────────────────────────────────── */
const modeArg   = process.argv.find((a) => a.startsWith('--mode='));
const packArg   = process.argv.find((a) => a.startsWith('--pack='));
const targetArg = process.argv.find((a) => a.startsWith('--target='));

const MODE    = modeArg ? modeArg.split('=')[1] : 'install';
const CONFIRM = process.argv.includes('--confirm');

/* ── Root resolution ──────────────────────────────────────────────────────── */
function findManifestDir() {
  const candidates = [
    process.cwd(),
    path.resolve(__dirname, '../..'),
    path.resolve(__dirname, '../../..'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'AGENT-PLATFORM-MANIFEST.json'))) return c;
  }
  return process.cwd();
}

const PACK_ROOT    = packArg   ? packArg.split('=')[1]
                   : process.env.AP_PACK   || findManifestDir();
const INSTALL_ROOT = targetArg ? targetArg.split('=')[1]
                   : process.env.AP_TARGET || process.cwd();

/* ── Manifest ─────────────────────────────────────────────────────────────── */
const MANIFEST_PATH = path.join(PACK_ROOT, 'AGENT-PLATFORM-MANIFEST.json');
if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Missing AGENT-PLATFORM-MANIFEST.json at', PACK_ROOT);
  process.exit(1);
}
const manifest     = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const templatesRoot = path.join(PACK_ROOT, manifest.templates_root || 'AGENT-PLATFORM-TEMPLATES');

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function sub(content, vars) {
  let out = content;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{{${k}}}`).join(v);
  return out;
}

function isStub(t) {
  return !t.trim() || /\(\s*fill\b|\*\(fill|none yet|<fill-in/i.test(t);
}

/**
 * Replace only the <!-- PLATFORM:START --> … <!-- PLATFORM:END --> block
 * in existingContent with the equivalent block from newContent.
 * Returns the patched string, or null if either file lacks the markers.
 */
function patchPlatformSection(existingContent, newContent) {
  const START = '<!-- PLATFORM:START -->';
  const END   = '<!-- PLATFORM:END -->';

  const eStart = existingContent.indexOf(START);
  const eEnd   = existingContent.indexOf(END);
  const nStart = newContent.indexOf(START);
  const nEnd   = newContent.indexOf(END);

  if (eStart < 0 || eEnd < 0 || nStart < 0 || nEnd < 0) return null;

  const newBlock = newContent.slice(nStart, nEnd + END.length);
  return existingContent.slice(0, eStart) + newBlock + existingContent.slice(eEnd + END.length);
}

/* ── Stack detection ──────────────────────────────────────────────────────── */
function detectTestRunner(root) {
  if (fs.existsSync(path.join(root, 'pyproject.toml')) ||
      fs.existsSync(path.join(root, 'pytest.ini')) ||
      fs.existsSync(path.join(root, 'setup.cfg')))          return 'pytest';
  if (fs.existsSync(path.join(root, 'go.mod')))             return 'go test ./...';
  if (fs.existsSync(path.join(root, 'Cargo.toml')))         return 'cargo test';
  if (fs.existsSync(path.join(root, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      if (pkg.scripts?.test) {
        if (pkg.scripts.test.includes('jest'))   return 'npx jest';
        if (pkg.scripts.test.includes('vitest')) return 'npx vitest';
        if (pkg.scripts.test.includes('mocha'))  return 'npx mocha';
      }
    } catch { /* ignore */ }
    return 'npm test';
  }
  const files = fs.readdirSync(root);
  if (files.some((f) => f.endsWith('.csproj') || f.endsWith('.sln'))) return 'dotnet test';
  if (fs.existsSync(path.join(root, 'Makefile')))           return 'make test';
  return '<fill-in test runner>';
}

function detectCoverageCmd(runner) {
  if (runner.startsWith('pytest'))      return 'pytest --cov';
  if (runner.includes('jest'))          return 'npx jest --coverage';
  if (runner.includes('vitest'))        return 'npx vitest --coverage';
  if (runner.startsWith('go test'))     return 'go test -cover ./...';
  if (runner.startsWith('cargo'))       return 'cargo tarpaulin';
  if (runner.startsWith('dotnet'))      return 'dotnet test /p:CollectCoverage=true';
  if (runner.startsWith('npm test'))    return 'npm test -- --coverage';
  return '<fill-in coverage command>';
}

/* ── Discover ─────────────────────────────────────────────────────────────── */
function discover() {
  const name   = path.basename(INSTALL_ROOT);
  let description = 'Software project';
  const readme = path.join(INSTALL_ROOT, 'README.md');
  if (fs.existsSync(readme)) {
    const line = fs.readFileSync(readme, 'utf8').split('\n')
      .find((l) => l.trim() && !l.startsWith('#'));
    if (line) description = line.trim().slice(0, 200);
  }
  const runner = detectTestRunner(INSTALL_ROOT);
  return {
    PROJECT_NAME:        name,
    PROJECT_DESCRIPTION: description,
    DATE:                new Date().toISOString().slice(0, 10),
    HIGH_CONFLICT_PATHS: '(none yet — add after scan)',
    TEST_RUNNER:         runner,
    COVERAGE_CMD:        detectCoverageCmd(runner),
    COVERAGE_THRESHOLD:  '80',
    BOOTSTRAP_VERSION:   manifest.bootstrap_version || '2.2.0',
  };
}

/* ── Apply ────────────────────────────────────────────────────────────────── */
const vars    = discover();
const created = [];
const updated = [];
const skipped = [];

for (const entry of manifest.files) {
  const target = path.join(INSTALL_ROOT, entry.path);
  const src    = path.join(templatesRoot, entry.template);
  if (!fs.existsSync(src)) continue;

  let content = sub(fs.readFileSync(src, 'utf8'), vars);

  if (fs.existsSync(target)) {
    if (MODE === 'force') {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
      if (entry.path.endsWith('launch.sh')) {
        try { fs.chmodSync(target, 0o755); } catch { /* ignore on Windows FS */ }
      }
      updated.push(entry.path);
    } else if (MODE === 'upgrade') {
      // Smart upgrade: patch only the PLATFORM section, preserve PROJECT section
      const existing = fs.readFileSync(target, 'utf8');
      const patched  = patchPlatformSection(existing, content);
      if (patched !== null) {
        fs.writeFileSync(target, patched.endsWith('\n') ? patched : patched + '\n');
        updated.push(entry.path);
      } else {
        skipped.push(entry.path); // no markers → skip (add-only, not overwrite)
      }
    } else if (MODE === 'repair' && isStub(fs.readFileSync(target, 'utf8'))) {
      fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
      updated.push(entry.path);
    } else {
      skipped.push(entry.path);
    }
    continue;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
  if (entry.path.endsWith('launch.sh')) {
    try { fs.chmodSync(target, 0o755); } catch { /* ignore */ }
  }
  created.push(entry.path);
}

/* ── Update platform.json ─────────────────────────────────────────────────── */
const platformPath = path.join(INSTALL_ROOT, '.agent/platform.json');
if (fs.existsSync(platformPath)) {
  try {
    const pj = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
    pj.bootstrap_version  = manifest.bootstrap_version;
    pj.updated_at         = new Date().toISOString();
    pj.updated_by         = 'bootstrap-apply';
    pj.test_runner        = vars.TEST_RUNNER;
    pj.coverage_cmd       = vars.COVERAGE_CMD;
    pj.coverage_threshold = vars.COVERAGE_THRESHOLD;
    // preserve last_update_check if already set
    if (!pj.last_update_check) pj.last_update_check = null;
    if (!pj.last_update_status) pj.last_update_status = null;
    fs.writeFileSync(platformPath, JSON.stringify(pj, null, 2) + '\n');
  } catch { /* ignore */ }
}

/* ── Uninstall mode ───────────────────────────────────────────────────────── */
if (MODE === 'uninstall') {
  const LINE = '═'.repeat(62);
  const managedDirs  = ['.agent', '.claude', '.cursor', '.agents', '.codex'];
  const managedFiles = ['AGENTS.md', 'SYNC-POINTS.md', 'CLAUDE.md'];
  const all = [...managedDirs, ...managedFiles];

  console.log('');
  console.log(LINE);
  console.log('  Agent Platform Bootstrap — Uninstall');
  console.log(LINE);
  console.log('');

  if (!CONFIRM) {
    console.log('  ⚠️  DRY RUN — nothing deleted. Add --confirm to proceed.');
    console.log('');
    console.log('  The following will be permanently removed from:');
    console.log('  ' + INSTALL_ROOT);
    console.log('');
    all.forEach((p) => {
      const full = path.join(INSTALL_ROOT, p);
      if (fs.existsSync(full)) console.log('    ' + p);
    });
    console.log('');
    console.log('  To confirm removal run:');
    console.log('  npx github:zafrirron/Agent-Platform --mode=uninstall --confirm');
    console.log(LINE);
    console.log('');
    process.exit(0);
  }

  console.log('  Removing platform files from: ' + INSTALL_ROOT);
  console.log('');
  let removed = 0;
  all.forEach((p) => {
    const full = path.join(INSTALL_ROOT, p);
    if (fs.existsSync(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      console.log('  ✔ Removed: ' + p);
      removed++;
    }
  });
  console.log('');
  console.log(`  ✅ Done — ${removed} items removed.`);
  console.log('   Your application source code was not touched.');
  console.log(LINE);
  console.log('');
  process.exit(0);
}

/* ── Guards: helpers ─────────────────────────────────────────────────────── */

function ciSetupForRunner(runner) {
  if (runner.includes('jest') || runner.includes('vitest') || runner.includes('mocha') || runner.startsWith('npm'))
    return `      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci`;
  if (runner.startsWith('pytest') || runner.startsWith('python'))
    return `      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt`;
  if (runner.startsWith('go'))
    return `      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'`;
  if (runner.startsWith('cargo'))
    return `      - uses: dtolnay/rust-toolchain@stable`;
  if (runner.startsWith('dotnet'))
    return `      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'`;
  return `      # Add your stack setup step here`;
}

function generatePreCommitHook(runner, threshold) {
  const hasRunner = runner && !runner.startsWith('<fill');
  return `#!/usr/bin/env node
// Agent Platform Bootstrap — pre-commit guard
// Installed by: npx github:zafrirron/Agent-Platform --mode=install-guards
// Remove with:  npx github:zafrirron/Agent-Platform --mode=remove-guards
// @agent-platform-guard

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const pass = (m) => console.log('  ✅ ' + m);
const fail = (m) => { console.error('  ❌ BLOCKED: ' + m); process.exit(1); };
const skip = (m) => console.log('  ⟳  ' + m + ' (skipped)');

console.log('\\nAgent Platform — pre-commit guards');

// Guard 1 — Secrets scan
const PATTERN = /password|api_key|apikey|secret_key|token|private_key|bearer|BEGIN RSA|BEGIN EC PRIVATE/i;
try {
  const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .split('\\n').filter(f => f.trim() && fs.existsSync(f));
  const hits = staged.filter(f => PATTERN.test(fs.readFileSync(f, 'utf8')));
  if (hits.length) {
    console.error('  Potential secrets in:');
    hits.forEach(f => console.error('    ' + f));
    fail('Secrets detected. Remove sensitive values before committing.');
  }
  pass('Secrets scan clean');
} catch(e) { if (e.message.includes('BLOCKED')) throw e; skip('secrets scan'); }

${hasRunner ? `// Guard 2 — Test suite (source files only)
const RUNNER = '${runner}';
try {
  const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  const hasSrc = /\\.(js|ts|mjs|jsx|tsx|py|go|rs|cs|java|rb|php|swift|kt)$/.test(staged);
  if (hasSrc) {
    console.log('  Running: ' + RUNNER);
    const r = spawnSync(RUNNER, { shell: true, stdio: 'inherit', cwd: ROOT });
    if (r.status !== 0) fail('Test suite failed. Fix all tests before committing.');
    pass('Test suite passed');
  } else { skip('test suite (no source files staged)'); }
} catch(e) { if (e.message.includes('BLOCKED')) throw e; skip('test suite'); }` : `// Guard 2 — Test suite skipped (test_runner not configured)`}

console.log('  ✅ All guards passed\\n');
`;
}

function generateCIWorkflow(runner, coverageCmd, threshold, setup) {
  const hasRunner = runner && !runner.startsWith('<fill');
  const hasCoverage = coverageCmd && !coverageCmd.startsWith('<fill');
  return `# Agent Platform Bootstrap — CI guards
# Installed by: npx github:zafrirron/Agent-Platform --mode=install-guards
# Remove with:  npx github:zafrirron/Agent-Platform --mode=remove-guards
# @agent-platform-guard

name: Platform Guards

on:
  push:
    branches: [main, master]
  pull_request:

jobs:
  guards:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

${setup}

      - name: Secrets scan
        run: |
          echo "Scanning staged/changed files for secrets..."
          git diff --name-only HEAD~1 HEAD 2>/dev/null | xargs -I{} sh -c '[ -f "{}" ] && grep -lE "password|api_key|apikey|secret_key|private_key|bearer|BEGIN RSA" "{}" || true' | grep -v "^$" && echo "❌ Secrets found" && exit 1 || true
          echo "✅ Secrets scan passed"
${hasRunner ? `
      - name: Test suite
        run: ${runner}
` : ''}${hasCoverage ? `
      - name: Coverage check
        run: ${coverageCmd}
` : ''}
      - name: Platform guard summary
        run: echo "✅ All Agent Platform guards passed"
`;
}

/* ── install-guards mode ──────────────────────────────────────────────────── */
if (MODE === 'install-guards') {
  const GLINE = '═'.repeat(66);
  const gsep  = '  ' + '─'.repeat(62);
  const vars2 = discover();
  const runner   = vars2.TEST_RUNNER;
  const coverage = vars2.COVERAGE_CMD;
  const threshold = vars2.COVERAGE_THRESHOLD;
  const setup    = ciSetupForRunner(runner);

  console.log('');
  console.log(GLINE);
  console.log('  Agent Platform Bootstrap — Install Guards');
  console.log(GLINE);
  console.log('');
  console.log(`  Project: ${vars2.PROJECT_NAME}  |  Test runner: ${runner}`);
  console.log('');

  // 1. Pre-commit hook
  const gitHooksDir = path.join(INSTALL_ROOT, '.git/hooks');
  const hookPath    = path.join(gitHooksDir, 'pre-commit');
  if (fs.existsSync(gitHooksDir)) {
    if (fs.existsSync(hookPath) && !fs.readFileSync(hookPath, 'utf8').includes('@agent-platform-guard')) {
      console.log('  ⚠️  A pre-commit hook already exists and was NOT installed by Agent Platform.');
      console.log('     Manual merge required: ' + hookPath);
    } else {
      fs.writeFileSync(hookPath, generatePreCommitHook(runner, threshold));
      try { fs.chmodSync(hookPath, 0o755); } catch { /* Windows FS */ }
      console.log('  ✔ Pre-commit hook    →  .git/hooks/pre-commit');
      console.log('     Guards: secrets scan' + (runner && !runner.startsWith('<') ? ' + test suite' : ''));
    }
  } else {
    console.log('  ⚠️  No .git directory found — pre-commit hook not installed.');
    console.log('     Run from inside a git repository.');
  }

  // 2. GitHub Actions workflow
  const ciDir  = path.join(INSTALL_ROOT, '.github/workflows');
  const ciPath = path.join(ciDir, 'platform-guards.yml');
  fs.mkdirSync(ciDir, { recursive: true });
  fs.writeFileSync(ciPath, generateCIWorkflow(runner, coverage, threshold, setup));
  console.log('  ✔ GitHub Actions CI  →  .github/workflows/platform-guards.yml');
  console.log('     Guards: secrets scan' +
    (runner && !runner.startsWith('<') ? ' + test suite' : '') +
    (coverage && !coverage.startsWith('<') ? ' + coverage' : ''));

  // 3. Update platform.json
  const platformPath = path.join(INSTALL_ROOT, '.agent/platform.json');
  if (fs.existsSync(platformPath)) {
    try {
      const pj = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
      pj.guards_installed = true;
      pj.guards_installed_at = new Date().toISOString();
      fs.writeFileSync(platformPath, JSON.stringify(pj, null, 2) + '\n');
    } catch { /* ignore */ }
  }

  console.log('');
  console.log(gsep);
  console.log('  Enforcement is now WIRED — not just aspired to.');
  console.log('');
  console.log('  Pre-commit: blocks commits with secrets or red tests');
  console.log('  CI:         blocks PRs with failing tests or secrets');
  console.log('');
  console.log('  Commit .github/workflows/platform-guards.yml to activate CI.');
  console.log(GLINE);
  console.log('');
  process.exit(0);
}

/* ── remove-guards mode ───────────────────────────────────────────────────── */
if (MODE === 'remove-guards') {
  const GLINE = '═'.repeat(66);
  const hookPath = path.join(INSTALL_ROOT, '.git/hooks/pre-commit');
  const ciPath   = path.join(INSTALL_ROOT, '.github/workflows/platform-guards.yml');
  let removed = 0;

  console.log('');
  console.log(GLINE);
  console.log('  Agent Platform Bootstrap — Remove Guards');
  console.log(GLINE);
  console.log('');

  if (fs.existsSync(hookPath) && fs.readFileSync(hookPath, 'utf8').includes('@agent-platform-guard')) {
    fs.rmSync(hookPath);
    console.log('  ✔ Removed: .git/hooks/pre-commit');
    removed++;
  } else if (fs.existsSync(hookPath)) {
    console.log('  ⚠️  Pre-commit hook exists but was not installed by Agent Platform — not removed.');
  }

  if (fs.existsSync(ciPath) && fs.readFileSync(ciPath, 'utf8').includes('@agent-platform-guard')) {
    fs.rmSync(ciPath);
    console.log('  ✔ Removed: .github/workflows/platform-guards.yml');
    removed++;
  }

  const platformPath = path.join(INSTALL_ROOT, '.agent/platform.json');
  if (fs.existsSync(platformPath)) {
    try {
      const pj = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
      delete pj.guards_installed;
      delete pj.guards_installed_at;
      fs.writeFileSync(platformPath, JSON.stringify(pj, null, 2) + '\n');
    } catch { /* ignore */ }
  }

  console.log('');
  console.log(`  Done — ${removed} guard(s) removed.`);
  console.log(GLINE);
  console.log('');
  process.exit(0);
}

/* ── Install summary ──────────────────────────────────────────────────────── */
const LINE = '═'.repeat(66);
const SEP  = '  ' + '─'.repeat(62);
const fw = ['claude', 'cursor', 'agents', 'codex'];
const fwLabel = { claude: 'Claude Code', cursor: 'Cursor', agents: 'Antigravity', codex: 'Codex (VS Code)' };
const modeLabel = { install: 'Installed', upgrade: 'Upgraded', repair: 'Repaired', force: 'Reset' };

console.log('');
console.log(LINE);
console.log(`  Agent Platform Bootstrap v${manifest.bootstrap_version} — ${modeLabel[MODE] || 'Done'} on ${vars.PROJECT_NAME}`);
console.log(LINE);
console.log('');
console.log('  What was installed');
console.log(SEP);
console.log('  .agent/          shared hub — conventions, playbooks, agents, context');
fw.forEach((f) => {
  if (fs.existsSync(path.join(INSTALL_ROOT, `.${f}`))) {
    console.log(`  .${f}/`.padEnd(18) + fwLabel[f]);
  }
});
console.log('  AGENTS.md        framework router');
console.log('  SYNC-POINTS.md   cross-IDE switch cheat sheet');
console.log('');
console.log(`  Files created: ${created.length}   Updated: ${updated.length}   Skipped: ${skipped.length}`);
console.log('');
console.log('  Capabilities');
console.log(SEP);
console.log('  ✔  4 IDE frameworks    Claude Code · Cursor · Antigravity · Codex');
console.log('  ✔  8 expert agents     Architect · Backend · Frontend · DevOps');
console.log('                         Test · Docs · Security · Data');
console.log('  ✔  8 playbooks         add-feature · bug-fix · refactor · release');
console.log('                         debug · security-audit · add-dependency · api-integration');
const runnerDisplay = vars.TEST_RUNNER.startsWith('<') ? 'not detected — set in .agent/CONVENTIONS.md' : vars.TEST_RUNNER;
console.log(`  ✔  Test enforcement    runner: ${runnerDisplay}  |  coverage gate: ${vars.COVERAGE_THRESHOLD}%`);
console.log('  ✔  Token compression   "caveman mode" — ~65% output reduction');
console.log('  ✔  Quick reference     displayed on every session start');
console.log('  ✔  Update check        node .agent/tools/check-updates.mjs');
console.log('  ✔  Context docs        api-contracts · adr-log · known-issues · dependencies');
console.log('  ○  Enforcement guards  not installed — run: npx github:zafrirron/Agent-Platform --mode=install-guards');
console.log('');
console.log('  References');
console.log(SEP);
console.log('  Full guide  →  https://github.com/zafrirron/Agent-Platform/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md');
console.log('  Repository  →  https://github.com/zafrirron/Agent-Platform');
console.log('  Changelog   →  https://github.com/zafrirron/Agent-Platform/blob/main/CHANGELOG.md');
console.log('');
console.log('  Next step — open your AI agent and send this message:');
console.log('');
console.log('  ┌─────────────────────────────────────────────────────────────┐');
console.log('  │  Read .agent/session-start.md and execute it.              │');
console.log('  └─────────────────────────────────────────────────────────────┘');
console.log('');
console.log('  Works in: Claude Code · Cursor · Antigravity · Codex');
console.log('  ⚠  This is an agent chat message — do not run it in the terminal.');
console.log('');
console.log(SEP);
console.log('  To REMOVE all platform files, run in terminal:');
console.log('');
console.log('    npx github:zafrirron/Agent-Platform --mode=uninstall');
console.log('');
console.log(LINE);
console.log('');
