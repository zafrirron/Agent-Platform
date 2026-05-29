#!/usr/bin/env node
/**
 * Apply AGENT-PLATFORM-MANIFEST.json templates (Node.js — Windows, Linux, macOS).
 *
 * Supports two separate roots:
 *   PACK_ROOT    — where AGENT-PLATFORM-MANIFEST.json + templates live
 *                  (the framework package directory, or wherever the pack was extracted)
 *   INSTALL_ROOT — where files are written (the consumer repo)
 *
 * Resolution order for each root:
 *   1. CLI flag:  --pack=<path>   / --target=<path>
 *   2. Env var:   AP_PACK=<path>  / AP_TARGET=<path>
 *   3. Auto-detect (search for AGENT-PLATFORM-MANIFEST.json upward from CWD)
 *   4. process.cwd()
 */
const fs   = require('fs');
const path = require('path');

/* ── CLI args ─────────────────────────────────────────────────────────────── */
const modeArg   = process.argv.find((a) => a.startsWith('--mode='));
const packArg   = process.argv.find((a) => a.startsWith('--pack='));
const targetArg = process.argv.find((a) => a.startsWith('--target='));

const MODE = modeArg ? modeArg.split('=')[1] : 'install';

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

/* ── Install summary ──────────────────────────────────────────────────────── */
const LINE = '═'.repeat(62);
const line = '─'.repeat(62);
const fw = ['claude', 'cursor', 'agents', 'codex'];
const fwLabel = { claude: 'Claude Code', cursor: 'Cursor', agents: 'Antigravity', codex: 'Codex (VS Code)' };

console.log('');
console.log(LINE);
console.log(`  Agent Platform Bootstrap v${manifest.bootstrap_version} — ${MODE === 'install' ? 'Installed' : MODE.charAt(0).toUpperCase() + MODE.slice(1) + 'd'} on ${vars.PROJECT_NAME}`);
console.log(LINE);
console.log('');
console.log('  What was installed');
console.log('  ' + line.slice(0, 20));
console.log(`  .agent/          shared hub — conventions, playbooks, agents, context`);
fw.forEach((f) => {
  const dir = path.join(INSTALL_ROOT, `.${f}`);
  if (fs.existsSync(dir)) {
    console.log(`  .${f}/`.padEnd(18) + fwLabel[f]);
  }
});
console.log(`  AGENTS.md        framework router`);
console.log(`  SYNC-POINTS.md   cross-IDE switch cheat sheet`);
console.log('');
console.log(`  Files created: ${created.length}   Updated: ${updated.length}   Skipped: ${skipped.length}`);
console.log('');
console.log('  ' + line.slice(0, 20));
console.log(`  Full guide  →  AGENT-PLATFORM-FRAMEWORK-README.md`);
console.log(`  Repository  →  https://github.com/zafrirron/Agent-Platform`);
console.log(`  Changelog   →  CHANGELOG.md`);
console.log('');
console.log('  Start your first session — paste one line into your agent:');
console.log('');
fw.forEach((f) => {
  const dir = path.join(INSTALL_ROOT, `.${f}`);
  if (fs.existsSync(dir)) {
    console.log(`  ${fwLabel[f].padEnd(18)} →  Read .${f}/prompts/session-start.md and execute it.`);
  }
});
console.log('');
console.log('  The agent will display a full quick reference guide.');
console.log(LINE);
console.log('');
