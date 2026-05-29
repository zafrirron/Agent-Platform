/**
 * Integration smoke tests for AGENT-PLATFORM-APPLY.js
 * Runs the real installer against temp directories — catches crashes that
 * unit tests on pure functions cannot (e.g. wrong property names in callers).
 *
 * Run: node --test tests/apply-integration.test.mjs
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACK_ROOT  = path.resolve(__dirname, '..');
const APPLY      = path.join(PACK_ROOT, 'AGENT-PLATFORM-APPLY.js');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ap-int-'));
}

function runApply(targetDir, extraArgs = []) {
  return spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, `--target=${targetDir}`, ...extraArgs],
    { encoding: 'utf8', timeout: 30_000 }
  );
}

// ── Install ────────────────────────────────────────────────────────────────

describe('install — clean empty directory', () => {
  const dir = tmpDir();
  const result = runApply(dir);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}\nstdout: ${result.stdout}`);
  });

  test('creates .agent/ hub', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent')), '.agent/ missing');
  });

  test('creates CLAUDE.md', () => {
    assert.ok(fs.existsSync(path.join(dir, 'CLAUDE.md')), 'CLAUDE.md missing');
  });

  test('creates AGENTS.md', () => {
    assert.ok(fs.existsSync(path.join(dir, 'AGENTS.md')), 'AGENTS.md missing');
  });

  test('creates .agent/platform.json', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/platform.json')), 'platform.json missing');
  });

  test('creates .agent/handoff/CURRENT.md', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/handoff/CURRENT.md')), 'CURRENT.md missing');
  });

  test('creates .agent/QUICK-REF.md', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/QUICK-REF.md')), 'QUICK-REF.md missing');
  });

  test('creates .agent/session-start.md', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/session-start.md')), 'session-start.md missing');
  });

  test('writes gitignore block', () => {
    const gi = path.join(dir, '.gitignore');
    assert.ok(fs.existsSync(gi), '.gitignore missing');
    const content = fs.readFileSync(gi, 'utf8');
    assert.ok(content.includes('Agent Platform Bootstrap'), 'gitignore block missing');
    assert.ok(content.includes('.agent/'), '.agent/ not gitignored');
  });

  test('install summary mentions v2', () => {
    assert.ok(result.stdout.includes('Agent Platform Bootstrap v2'), 'version line missing from stdout');
  });

  test('no crash — no stderr', () => {
    assert.equal(result.stderr.trim(), '', `unexpected stderr: ${result.stderr}`);
  });

  // cleanup
  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Install with pre-existing CLAUDE.md ───────────────────────────────────

describe('install — pre-existing CLAUDE.md backed up', () => {
  const dir = tmpDir();
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), '# My existing instructions\n');
  const result = runApply(dir);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('original CLAUDE.md preserved (not overwritten)', () => {
    const content = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
    assert.ok(content.includes('My existing instructions'), 'original content was overwritten');
  });

  test('backup directory created', () => {
    const backupRoot = path.join(dir, '.agent/backup');
    assert.ok(fs.existsSync(backupRoot), '.agent/backup/ missing');
    const entries = fs.readdirSync(backupRoot);
    assert.ok(entries.length > 0, 'no backup subdirectory created');
  });

  test('manifest.json written in backup dir', () => {
    const backupRoot = path.join(dir, '.agent/backup');
    const subdir = fs.readdirSync(backupRoot)[0];
    const manifest = path.join(backupRoot, subdir, 'manifest.json');
    assert.ok(fs.existsSync(manifest), 'manifest.json missing from backup');
  });

  test('MIGRATION-NOTES.md created', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/MIGRATION-NOTES.md')), 'MIGRATION-NOTES.md missing');
  });

  test('no crash — no stderr', () => {
    assert.equal(result.stderr.trim(), '', `unexpected stderr: ${result.stderr}`);
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Upgrade ───────────────────────────────────────────────────────────────

describe('upgrade — after fresh install', () => {
  const dir = tmpDir();
  runApply(dir); // install first
  const result = runApply(dir, ['--mode=upgrade']);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('no crash — no stderr', () => {
    assert.equal(result.stderr.trim(), '', `unexpected stderr: ${result.stderr}`);
  });

  test('.agent/ still present after upgrade', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent')));
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Uninstall dry run ─────────────────────────────────────────────────────

describe('uninstall dry run — no files removed', () => {
  const dir = tmpDir();
  runApply(dir); // install first
  const result = runApply(dir, ['--mode=uninstall']);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('.agent/ still present (dry run makes no changes)', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent')), '.agent/ was removed in dry run');
  });

  test('stdout mentions dry run or what would be removed', () => {
    const out = result.stdout.toLowerCase();
    assert.ok(out.includes('dry') || out.includes('would') || out.includes('uninstall'), 'no dry-run output');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Uninstall confirm ─────────────────────────────────────────────────────

describe('uninstall --confirm — platform removed, user files intact', () => {
  const dir = tmpDir();
  // Put a user source file in before install
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src/app.js'), 'console.log("hello");\n');
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'test-app' }));

  runApply(dir); // install
  const result = runApply(dir, ['--mode=uninstall', '--confirm']);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('.agent/ removed', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.agent')), '.agent/ still exists after uninstall');
  });

  test('CLAUDE.md removed', () => {
    assert.ok(!fs.existsSync(path.join(dir, 'CLAUDE.md')), 'CLAUDE.md still exists after uninstall');
  });

  test('user src/app.js untouched', () => {
    const content = fs.readFileSync(path.join(dir, 'src/app.js'), 'utf8');
    assert.ok(content.includes('hello'), 'user source file was modified or deleted');
  });

  test('user package.json untouched', () => {
    assert.ok(fs.existsSync(path.join(dir, 'package.json')), 'package.json deleted');
  });

  test('no crash — no stderr', () => {
    assert.equal(result.stderr.trim(), '', `unexpected stderr: ${result.stderr}`);
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Uninstall restores pre-existing CLAUDE.md ─────────────────────────────

describe('uninstall --confirm — restores backed-up CLAUDE.md', () => {
  const dir = tmpDir();
  const original = '# My original instructions\n';
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), original);

  runApply(dir); // install (backs up CLAUDE.md, installs platform version)
  runApply(dir, ['--mode=uninstall', '--confirm']); // uninstall (should restore)

  test('original CLAUDE.md restored', () => {
    assert.ok(fs.existsSync(path.join(dir, 'CLAUDE.md')), 'CLAUDE.md not restored');
    const content = fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8');
    assert.ok(content.includes('My original instructions'), 'restored content does not match original');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});
