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

  test('CURRENT.md bootstrap entry uses Status: installed not Status: done', () => {
    const current = fs.readFileSync(path.join(dir, '.agent/handoff/CURRENT.md'), 'utf8');
    assert.ok(!current.includes('**Status:** done'), 'bootstrap entry must not use Status: done — breaks first-session audit offer');
    assert.ok(current.includes('**Status:** installed'), 'bootstrap entry must use Status: installed');
  });

  test('.audit-offered flag file absent after fresh install', () => {
    assert.ok(
      !fs.existsSync(path.join(dir, '.agent/context/.audit-offered')),
      '.audit-offered must not exist after install — first-session offer must fire on first session-start'
    );
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

  test('platform.json has platform_repo field', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.ok(pj.platform_repo, 'platform_repo missing from platform.json');
    assert.ok(!pj.platform_repo.includes('{{'), 'platform_repo is still a raw placeholder');
  });

  test('platform.json has platform_npx field', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.ok(pj.platform_npx, 'platform_npx missing from platform.json');
    assert.ok(!pj.platform_npx.includes('{{'), 'platform_npx is still a raw placeholder');
  });

  test('backend-agent.md has both PLATFORM and PROJECT section markers', () => {
    const content = fs.readFileSync(path.join(dir, '.agent/agents/backend-agent.md'), 'utf8');
    assert.ok(content.includes('<!-- PLATFORM:START -->'), 'PLATFORM:START missing');
    assert.ok(content.includes('<!-- PLATFORM:END -->'), 'PLATFORM:END missing');
    assert.ok(content.includes('<!-- PROJECT:START -->'), 'PROJECT:START missing');
    assert.ok(content.includes('<!-- PROJECT:END -->'), 'PROJECT:END missing');
  });

  test('QUICK-REF.md has no raw {{PLATFORM_NPX}} placeholder after install', () => {
    const content = fs.readFileSync(path.join(dir, '.agent/QUICK-REF.md'), 'utf8');
    assert.ok(!content.includes('{{PLATFORM_NPX}}'), 'PLATFORM_NPX placeholder not substituted in QUICK-REF.md');
  });

  test('stdout mentions global stubs not installed', () => {
    assert.ok(result.stdout.includes('Global stubs'), 'global stubs status line missing from stdout');
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

// ── Upgrade — two-section model ───────────────────────────────────────────

describe('upgrade — PROJECT section preserved, PLATFORM section updated', () => {
  const dir = tmpDir();
  runApply(dir); // install

  // Simulate user adding a PROJECT rule
  const agentPath = path.join(dir, '.agent/agents/backend-agent.md');
  const installed  = fs.readFileSync(agentPath, 'utf8');
  const withProject = installed.replace(
    '<!-- PROJECT:START -->',
    '<!-- PROJECT:START -->\n- All endpoints must respond within 200ms'
  );
  fs.writeFileSync(agentPath, withProject);

  // Simulate a platform improvement in the PLATFORM section
  const templatePath = path.join(
    path.resolve(import.meta.dirname, '..'),
    'AGENT-PLATFORM-TEMPLATES/.agent/agents/backend-agent.md'
  );
  const origTemplate = fs.readFileSync(templatePath, 'utf8');
  const patchedTemplate = origTemplate.replace(
    '<!-- PLATFORM:START -->',
    '<!-- PLATFORM:START -->\n- TEST_UPGRADE_MARKER: auto-test sentinel rule'
  );
  fs.writeFileSync(templatePath, patchedTemplate);

  const result = runApply(dir, ['--mode=upgrade']);

  // Restore template immediately
  fs.writeFileSync(templatePath, origTemplate);

  test('upgrade exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('PROJECT rule preserved after upgrade', () => {
    const content = fs.readFileSync(agentPath, 'utf8');
    assert.ok(content.includes('200ms'), 'PROJECT rule was overwritten by upgrade');
  });

  test('PLATFORM sentinel added by upgrade', () => {
    const content = fs.readFileSync(agentPath, 'utf8');
    assert.ok(content.includes('TEST_UPGRADE_MARKER'), 'PLATFORM update was not applied');
  });

  test('PROJECT section is still after PLATFORM section', () => {
    const content = fs.readFileSync(agentPath, 'utf8');
    const platformEnd = content.indexOf('<!-- PLATFORM:END -->');
    const projectStart = content.indexOf('<!-- PROJECT:START -->');
    assert.ok(projectStart > platformEnd, 'section order is wrong after upgrade');
  });

  test('no crash — no stderr', () => {
    assert.equal(result.stderr.trim(), '', `unexpected stderr: ${result.stderr}`);
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Self-install guard ─────────────────────────────────────────────────────

describe('self-install guard — platform repo protects itself', () => {
  const result = spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, `--target=${PACK_ROOT}`],
    { encoding: 'utf8', timeout: 10_000 }
  );

  test('exits non-zero when target is the platform repo', () => {
    assert.notEqual(result.status, 0, 'should have been blocked by self-install guard');
  });

  test('guard error message present', () => {
    const combined = result.stdout + result.stderr;
    assert.ok(
      combined.includes('platform repo') || combined.includes('Agent Platform repo'),
      `expected guard error, got: ${combined.slice(0, 200)}`
    );
  });

  test('blocked install does not write a platform block to the source repo .gitignore', () => {
    const gi = fs.readFileSync(path.join(PACK_ROOT, '.gitignore'), 'utf8');
    const count = (gi.match(/Agent Platform Bootstrap — START/g) || []).length;
    assert.equal(count, 0, `expected 0 platform blocks in source repo .gitignore, got ${count} — guard failed to prevent gitignore modification`);
  });
});
