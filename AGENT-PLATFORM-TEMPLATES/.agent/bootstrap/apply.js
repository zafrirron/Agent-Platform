#!/usr/bin/env node
/**
 * Apply AGENT-PLATFORM-MANIFEST.json templates (Node.js — Windows, Linux, macOS).
 */
const fs = require('fs');
const path = require('path');

function findRoot() {
  const candidates = [process.cwd(), path.resolve(__dirname, '../..'), path.resolve(__dirname, '../../..')];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'AGENT-PLATFORM-MANIFEST.json'))) return c;
  }
  return process.cwd();
}

const ROOT = findRoot();
const MANIFEST_PATH = path.join(ROOT, 'AGENT-PLATFORM-MANIFEST.json');
const modeArg = process.argv.find((a) => a.startsWith('--mode='));
const MODE = modeArg ? modeArg.split('=')[1] : 'install';

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Missing AGENT-PLATFORM-MANIFEST.json at', ROOT);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const templatesRoot = path.join(ROOT, manifest.templates_root || 'AGENT-PLATFORM-TEMPLATES');

function sub(content, vars) {
  let out = content;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{{${k}}}`).join(v);
  return out;
}

function isStub(t) {
  return !t.trim() || /\(\s*fill\b|\*\(fill|none yet/i.test(t);
}

function detectTestRunner(root) {
  if (fs.existsSync(path.join(root, 'package.json'))) return 'npm test';
  if (fs.existsSync(path.join(root, 'pyproject.toml')) || fs.existsSync(path.join(root, 'pytest.ini'))) return 'pytest';
  if (fs.existsSync(path.join(root, 'go.mod'))) return 'go test ./...';
  if (fs.existsSync(path.join(root, 'Cargo.toml'))) return 'cargo test';
  const files = fs.readdirSync(root);
  if (files.some((f) => f.endsWith('.csproj')) || files.some((f) => f.endsWith('.sln'))) return 'dotnet test';
  if (fs.existsSync(path.join(root, 'Makefile'))) return 'make test';
  return 'npm test';
}

function discover() {
  const name = path.basename(ROOT);
  let description = 'Software project';
  const readme = path.join(ROOT, 'README.md');
  if (fs.existsSync(readme)) {
    const line = fs.readFileSync(readme, 'utf8').split('\n').find((l) => l.trim() && !l.startsWith('#'));
    if (line) description = line.trim().slice(0, 200);
  }
  return {
    PROJECT_NAME: name,
    PROJECT_DESCRIPTION: description,
    DATE: new Date().toISOString().slice(0, 10),
    HIGH_CONFLICT_PATHS: '(none yet — add after scan)',
    TEST_RUNNER: detectTestRunner(ROOT),
    BOOTSTRAP_VERSION: manifest.bootstrap_version || '2.0.0',
  };
}

const vars = discover();
const created = [];
const updated = [];
const skipped = [];

for (const entry of manifest.files) {
  const target = path.join(ROOT, entry.path);
  const src = path.join(templatesRoot, entry.template);
  if (!fs.existsSync(src)) continue;
  let content = sub(fs.readFileSync(src, 'utf8'), vars);

  if (entry.path.endsWith('launch.sh') && process.platform !== 'win32') {
    try {
      fs.chmodSync(target, 0o755);
    } catch {
      /* applied on next write */
    }
  }

  if (fs.existsSync(target)) {
    if (MODE === 'force') {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
      if (entry.path.endsWith('launch.sh')) {
        try {
          fs.chmodSync(target, 0o755);
        } catch { /* ignore on Windows FS */ }
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
    try {
      fs.chmodSync(target, 0o755);
    } catch { /* ignore */ }
  }
  created.push(entry.path);
}

const platformPath = path.join(ROOT, '.agent/platform.json');
if (fs.existsSync(platformPath)) {
  try {
    const pj = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
    pj.bootstrap_version = manifest.bootstrap_version;
    pj.updated_at = new Date().toISOString();
    pj.updated_by = 'bootstrap-apply';
    fs.writeFileSync(platformPath, JSON.stringify(pj, null, 2) + '\n');
  } catch { /* ignore */ }
}

console.log(
  JSON.stringify(
    { mode: MODE, root: ROOT, platform: process.platform, created, updated, skipped_count: skipped.length, version: manifest.bootstrap_version },
    null,
    2
  )
);
