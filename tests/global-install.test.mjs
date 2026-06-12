/**
 * Automated tests for --mode=global and --mode=uninstall-global
 * Uses AP_HOME env var to redirect home directory to a temp folder.
 *
 * Run: node --test tests/global-install.test.mjs
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
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ap-global-'));
}

function runGlobal(homeDir, extraArgs = []) {
  return spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, '--mode=global', ...extraArgs],
    { encoding: 'utf8', timeout: 30_000, env: { ...process.env, AP_HOME: homeDir } }
  );
}

function runUninstallGlobal(homeDir, extraArgs = []) {
  return spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, '--mode=uninstall-global', ...extraArgs],
    { encoding: 'utf8', timeout: 30_000, env: { ...process.env, AP_HOME: homeDir } }
  );
}

// ── Global install — fresh ────────────────────────────────────────────────

describe('global install — fresh home directory', () => {
  const home   = tmpDir();
  const result = runGlobal(home);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}\nstdout: ${result.stdout}`);
  });

  test('creates ~/.claude/CLAUDE.md', () => {
    assert.ok(fs.existsSync(path.join(home, '.claude/CLAUDE.md')), '~/.claude/CLAUDE.md missing');
  });

  test('creates ~/.cursor/rules/agent-platform-global.mdc', () => {
    assert.ok(fs.existsSync(path.join(home, '.cursor/rules/agent-platform-global.mdc')), 'cursor stub missing');
  });

  test('creates ~/.codex/instructions.md', () => {
    assert.ok(fs.existsSync(path.join(home, '.codex/instructions.md')), 'codex stub missing');
  });

  test('creates ~/.agents/rules/agent-platform-global.md', () => {
    assert.ok(fs.existsSync(path.join(home, '.agents/rules/agent-platform-global.md')), 'agents stub missing');
  });

  test('creates ~/.claude/commands/caveman.md', () => {
    assert.ok(fs.existsSync(path.join(home, '.claude/commands/caveman.md')), 'caveman command missing');
  });

  test('creates Claude lifecycle command files', () => {
    for (const cmd of ['quick-ref', 'spec', 'plan', 'build', 'test', 'code-simplify', 'webperf', 'context', 'verify', 'ship', 'audit', 'review', 'release', 'caveman']) {
      assert.ok(
        fs.existsSync(path.join(home, '.claude/commands', `${cmd}.md`)),
        `claude /${cmd} missing`
      );
    }
  });

  test('creates Cursor lifecycle command files', () => {
    for (const cmd of ['quick-ref', 'spec', 'plan', 'build', 'test', 'code-simplify', 'webperf', 'context', 'verify', 'ship', 'audit', 'review', 'release', 'implement', 'session-start', 'session-end', 'platform-help', 'caveman']) {
      assert.ok(
        fs.existsSync(path.join(home, '.cursor/commands', `${cmd}.md`)),
        `cursor /${cmd} missing`
      );
    }
  });

  test('creates ~/.agent-platform/global-version', () => {
    assert.ok(fs.existsSync(path.join(home, '.agent-platform/global-version')), 'version file missing');
  });

  test('global-version contains valid JSON with version field', () => {
    const vf = JSON.parse(fs.readFileSync(path.join(home, '.agent-platform/global-version'), 'utf8'));
    assert.ok(vf.version, 'version field missing');
    assert.match(vf.version, /^\d+\.\d+\.\d+$/, 'version is not semver');
    assert.equal(vf.version, '2.41.0', 'expected global-version 2.41.0');
  });

  test('~/.claude/CLAUDE.md has PLATFORM:START/END markers', () => {
    const content = fs.readFileSync(path.join(home, '.claude/CLAUDE.md'), 'utf8');
    assert.ok(content.includes('<!-- PLATFORM:START -->'), 'PLATFORM:START missing');
    assert.ok(content.includes('<!-- PLATFORM:END -->'), 'PLATFORM:END missing');
  });

  test('~/.claude/CLAUDE.md has USER:START/END section', () => {
    const content = fs.readFileSync(path.join(home, '.claude/CLAUDE.md'), 'utf8');
    assert.ok(content.includes('<!-- USER:START -->'), 'USER:START missing');
    assert.ok(content.includes('<!-- USER:END -->'), 'USER:END missing');
  });

  test('no raw {{PLATFORM_NPX}} placeholder in ~/.claude/CLAUDE.md', () => {
    const content = fs.readFileSync(path.join(home, '.claude/CLAUDE.md'), 'utf8');
    assert.ok(!content.includes('{{PLATFORM_NPX}}'), '{{PLATFORM_NPX}} not substituted');
  });

  test('no raw {{PLATFORM_NPX}} placeholder in cursor stub', () => {
    const content = fs.readFileSync(path.join(home, '.cursor/rules/agent-platform-global.mdc'), 'utf8');
    assert.ok(!content.includes('{{PLATFORM_NPX}}'), '{{PLATFORM_NPX}} not substituted in cursor stub');
  });

  test('no crash — no stderr', () => {
    assert.equal(result.stderr.trim(), '', `unexpected stderr: ${result.stderr}`);
  });

  test('cleanup', () => { fs.rmSync(home, { recursive: true }); assert.ok(true); });
});

// ── Global install — idempotent (re-run upgrades, no duplication) ─────────

describe('global install — idempotent upgrade', () => {
  const home = tmpDir();
  runGlobal(home);                        // first install
  const result = runGlobal(home);         // second run = upgrade

  test('re-run exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('no duplicate PLATFORM:START blocks after re-run', () => {
    const content = fs.readFileSync(path.join(home, '.claude/CLAUDE.md'), 'utf8');
    const count = (content.match(/<!-- PLATFORM:START -->/g) || []).length;
    assert.equal(count, 1, `Expected 1 PLATFORM:START block, found ${count}`);
  });

  test('cleanup', () => { fs.rmSync(home, { recursive: true }); assert.ok(true); });
});

// ── Global install — preserves existing USER content ─────────────────────

describe('global install — USER section content preserved on upgrade', () => {
  const home = tmpDir();
  runGlobal(home); // install

  // User adds personal content to USER section
  const claudePath = path.join(home, '.claude/CLAUDE.md');
  const installed  = fs.readFileSync(claudePath, 'utf8');
  const withUser   = installed.replace('<!-- USER:END -->', 'Always use caveman lite.\n<!-- USER:END -->');
  fs.writeFileSync(claudePath, withUser);

  runGlobal(home); // upgrade

  test('user preference preserved after upgrade', () => {
    const content = fs.readFileSync(claudePath, 'utf8');
    assert.ok(content.includes('Always use caveman lite.'), 'USER content was overwritten');
  });

  test('still only one PLATFORM block after upgrade with user content', () => {
    const content = fs.readFileSync(claudePath, 'utf8');
    const count = (content.match(/<!-- PLATFORM:START -->/g) || []).length;
    assert.equal(count, 1, `Expected 1 PLATFORM:START, found ${count}`);
  });

  test('cleanup', () => { fs.rmSync(home, { recursive: true }); assert.ok(true); });
});

// ── Global uninstall dry run ──────────────────────────────────────────────

describe('global uninstall — dry run makes no changes', () => {
  const home = tmpDir();
  runGlobal(home);
  const result = runUninstallGlobal(home); // no --confirm

  test('dry run exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('stubs still present after dry run', () => {
    assert.ok(fs.existsSync(path.join(home, '.claude/CLAUDE.md')), 'stub removed in dry run');
  });

  test('stdout mentions DRY RUN', () => {
    assert.ok(result.stdout.toUpperCase().includes('DRY RUN'), 'no dry run message in stdout');
  });

  test('cleanup', () => { fs.rmSync(home, { recursive: true }); assert.ok(true); });
});

// ── Global uninstall --confirm — no user content ──────────────────────────

describe('global uninstall --confirm — pure platform files deleted', () => {
  const home = tmpDir();
  runGlobal(home);
  const result = runUninstallGlobal(home, ['--confirm']);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('~/.claude/CLAUDE.md deleted (no user content was added)', () => {
    assert.ok(!fs.existsSync(path.join(home, '.claude/CLAUDE.md')), 'CLAUDE.md still exists');
  });

  test('cursor stub deleted', () => {
    assert.ok(!fs.existsSync(path.join(home, '.cursor/rules/agent-platform-global.mdc')), 'cursor stub still exists');
  });

  test('command files deleted', () => {
    assert.ok(!fs.existsSync(path.join(home, '.claude/commands/caveman.md')), 'caveman.md still exists');
    assert.ok(!fs.existsSync(path.join(home, '.cursor/commands/spec.md')), 'cursor spec.md still exists');
  });

  test('version file deleted', () => {
    assert.ok(!fs.existsSync(path.join(home, '.agent-platform/global-version')), 'version file still exists');
  });

  test('no crash — no stderr', () => {
    assert.equal(result.stderr.trim(), '', `unexpected stderr: ${result.stderr}`);
  });

  test('cleanup', () => { fs.rmSync(home, { recursive: true }); assert.ok(true); });
});

// ── Global uninstall --confirm — USER content preserved ──────────────────

describe('global uninstall --confirm — USER section content preserved', () => {
  const home = tmpDir();
  runGlobal(home);

  // User adds personal content
  const claudePath = path.join(home, '.claude/CLAUDE.md');
  const installed  = fs.readFileSync(claudePath, 'utf8');
  const withUser   = installed.replace('<!-- USER:END -->', 'Always use caveman lite.\n<!-- USER:END -->');
  fs.writeFileSync(claudePath, withUser);

  runUninstallGlobal(home, ['--confirm']);

  test('~/.claude/CLAUDE.md still exists (has user content)', () => {
    assert.ok(fs.existsSync(claudePath), 'CLAUDE.md deleted despite having user content');
  });

  test('PLATFORM block removed', () => {
    const content = fs.readFileSync(claudePath, 'utf8');
    assert.ok(!content.includes('<!-- PLATFORM:START -->'), 'PLATFORM:START still present');
  });

  test('user preference still present', () => {
    const content = fs.readFileSync(claudePath, 'utf8');
    assert.ok(content.includes('Always use caveman lite.'), 'user content was removed');
  });

  test('cleanup', () => { fs.rmSync(home, { recursive: true }); assert.ok(true); });
});

// ── Global uninstall does not affect project install ─────────────────────

describe('global uninstall --confirm — project install untouched', () => {
  const home    = tmpDir();
  const project = tmpDir();

  // Install platform into project
  spawnSync(process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, `--target=${project}`],
    { encoding: 'utf8', timeout: 30_000 }
  );

  // Install + uninstall global stubs
  runGlobal(home);
  runUninstallGlobal(home, ['--confirm']);

  test('.agent/ in project untouched after global uninstall', () => {
    assert.ok(fs.existsSync(path.join(project, '.agent')), '.agent/ removed from project');
  });

  test('AGENTS.md in project untouched', () => {
    assert.ok(fs.existsSync(path.join(project, 'AGENTS.md')), 'AGENTS.md removed from project');
  });

  test('cleanup', () => {
    fs.rmSync(home, { recursive: true });
    fs.rmSync(project, { recursive: true });
    assert.ok(true);
  });
});
