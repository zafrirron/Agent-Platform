/**
 * Unit tests for Agent Platform Bootstrap — apply-utils.mjs
 * Run: node --test tests/apply-utils.test.mjs
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  sub,
  isStub,
  patchPlatformSection,
  detectTestRunner,
  detectCoverageCmd,
  scanPreExistingArtifacts,
} from '../AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/apply-utils.mjs';

// ── Helpers ────────────────────────────────────────────────────────────────

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ap-test-'));
}

function write(dir, relPath, content) {
  const full = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

// ── sub() ──────────────────────────────────────────────────────────────────

describe('sub()', () => {
  test('replaces a single placeholder', () => {
    assert.equal(sub('Hello {{NAME}}', { NAME: 'World' }), 'Hello World');
  });

  test('replaces multiple placeholders', () => {
    assert.equal(
      sub('{{A}} and {{B}}', { A: 'foo', B: 'bar' }),
      'foo and bar'
    );
  });

  test('replaces all occurrences of the same placeholder', () => {
    assert.equal(sub('{{X}}-{{X}}', { X: 'z' }), 'z-z');
  });

  test('leaves unmatched placeholders intact', () => {
    assert.equal(sub('{{MISSING}}', { OTHER: 'x' }), '{{MISSING}}');
  });
});

// ── isStub() ───────────────────────────────────────────────────────────────

describe('isStub()', () => {
  test('empty string is a stub', () => assert.ok(isStub('')));
  test('whitespace-only is a stub', () => assert.ok(isStub('   ')));
  test('<fill-in test runner> is a stub', () => assert.ok(isStub('<fill-in test runner>')));
  test('none yet is a stub', () => assert.ok(isStub('none yet')));
  test('*(fill from scan)* is a stub', () => assert.ok(isStub('*(fill from scan)*')));
  test('real content is not a stub', () => assert.ok(!isStub('pytest')));
  test('markdown content is not a stub', () => assert.ok(!isStub('# My project')));
});

// ── patchPlatformSection() ────────────────────────────────────────────────

describe('patchPlatformSection()', () => {
  const S = '<!-- PLATFORM:START -->';
  const E = '<!-- PLATFORM:END -->';

  test('replaces PLATFORM block, preserves surrounding content', () => {
    const existing = `before\n${S}\nold rules\n${E}\nafter`;
    const newFile  = `preamble\n${S}\nnew rules\n${E}\npostamble`;
    const result   = patchPlatformSection(existing, newFile);
    assert.ok(result.startsWith('before\n'));
    assert.ok(result.includes('new rules'));
    assert.ok(!result.includes('old rules'));
    assert.ok(result.endsWith('\nafter'));
  });

  test('preserves PROJECT:START/END section', () => {
    const existing = `${S}\nold\n${E}\n<!-- PROJECT:START -->\nmy custom rules\n<!-- PROJECT:END -->`;
    const newFile  = `${S}\nnew\n${E}`;
    const result   = patchPlatformSection(existing, newFile);
    assert.ok(result.includes('my custom rules'));
    assert.ok(result.includes('new'));
    assert.ok(!result.includes('old'));
  });

  test('returns null when existing file has no START marker', () => {
    const existing = `no markers here\n${E}\nafter`;
    const newFile  = `${S}\nnew\n${E}`;
    assert.equal(patchPlatformSection(existing, newFile), null);
  });

  test('returns null when existing file has no END marker', () => {
    const existing = `${S}\nno end marker`;
    const newFile  = `${S}\nnew\n${E}`;
    assert.equal(patchPlatformSection(existing, newFile), null);
  });

  test('returns null when new content has no markers', () => {
    const existing = `${S}\nold\n${E}`;
    const newFile  = 'no markers at all';
    assert.equal(patchPlatformSection(existing, newFile), null);
  });

  test('returns null for malformed markers (END before START)', () => {
    const existing = `${E}\n${S}`;
    const newFile  = `${S}\nok\n${E}`;
    assert.equal(patchPlatformSection(existing, newFile), null);
  });

  test('handles empty PLATFORM block', () => {
    const existing = `${S}${E}after`;
    const newFile  = `${S}\nnew content\n${E}`;
    const result   = patchPlatformSection(existing, newFile);
    assert.ok(result.includes('new content'));
    assert.ok(result.endsWith('after'));
  });
});

// ── detectTestRunner() ────────────────────────────────────────────────────

describe('detectTestRunner()', () => {
  test('detects pytest from pyproject.toml', () => {
    const dir = tmpDir();
    write(dir, 'pyproject.toml', '[tool.pytest.ini_options]');
    assert.equal(detectTestRunner(dir), 'pytest');
    fs.rmSync(dir, { recursive: true });
  });

  test('detects pytest from pytest.ini', () => {
    const dir = tmpDir();
    write(dir, 'pytest.ini', '[pytest]');
    assert.equal(detectTestRunner(dir), 'pytest');
    fs.rmSync(dir, { recursive: true });
  });

  test('detects go from go.mod', () => {
    const dir = tmpDir();
    write(dir, 'go.mod', 'module example.com/mymod\ngo 1.21');
    assert.equal(detectTestRunner(dir), 'go test ./...');
    fs.rmSync(dir, { recursive: true });
  });

  test('detects cargo from Cargo.toml', () => {
    const dir = tmpDir();
    write(dir, 'Cargo.toml', '[package]\nname = "test"');
    assert.equal(detectTestRunner(dir), 'cargo test');
    fs.rmSync(dir, { recursive: true });
  });

  test('detects jest from package.json scripts', () => {
    const dir = tmpDir();
    write(dir, 'package.json', JSON.stringify({ scripts: { test: 'jest --coverage' } }));
    assert.equal(detectTestRunner(dir), 'npx jest');
    fs.rmSync(dir, { recursive: true });
  });

  test('detects vitest from package.json scripts', () => {
    const dir = tmpDir();
    write(dir, 'package.json', JSON.stringify({ scripts: { test: 'vitest run' } }));
    assert.equal(detectTestRunner(dir), 'npx vitest run');
    fs.rmSync(dir, { recursive: true });
  });

  test('returns npm test for bare package.json', () => {
    const dir = tmpDir();
    write(dir, 'package.json', JSON.stringify({ name: 'my-app' }));
    assert.equal(detectTestRunner(dir), 'npm test');
    fs.rmSync(dir, { recursive: true });
  });

  test('returns fill-in placeholder for empty dir', () => {
    const dir = tmpDir();
    assert.equal(detectTestRunner(dir), '<fill-in test runner>');
    fs.rmSync(dir, { recursive: true });
  });
});

// ── detectCoverageCmd() ───────────────────────────────────────────────────

describe('detectCoverageCmd()', () => {
  test('pytest → pytest --cov', () => assert.equal(detectCoverageCmd('pytest'), 'pytest --cov'));
  test('npx jest → npx jest --coverage', () => assert.equal(detectCoverageCmd('npx jest'), 'npx jest --coverage'));
  test('npx vitest run → coverage', () => assert.equal(detectCoverageCmd('npx vitest run'), 'npx vitest run --coverage'));
  test('go test ./... → cover flag', () => assert.equal(detectCoverageCmd('go test ./...'), 'go test -cover ./...'));
  test('cargo test → tarpaulin', () => assert.equal(detectCoverageCmd('cargo test'), 'cargo tarpaulin'));
  test('dotnet test → CollectCoverage', () => assert.ok(detectCoverageCmd('dotnet test').includes('CollectCoverage')));
  test('npm test → -- --coverage', () => assert.equal(detectCoverageCmd('npm test'), 'npm test -- --coverage'));
  test('unknown → fill-in placeholder', () => assert.equal(detectCoverageCmd('make test'), '<fill-in coverage command>'));
});

// ── scanPreExistingArtifacts() ────────────────────────────────────────────

const PLATFORM_ROOT = ['CLAUDE.md', 'AGENTS.md', 'SYNC-POINTS.md'];
const LEGACY_ROOT   = [{ file: '.cursorrules', label: 'Cursor rules (legacy)' }];
const FW_PATTERNS   = [{
  folder: '.cursor/rules',
  ext: '.mdc',
  platformFiles: new Set(['platform-core.mdc', 'caveman.mdc', 'agent-sync.mdc']),
  label: 'Cursor rule',
}];

describe('scanPreExistingArtifacts()', () => {
  test('returns empty arrays for clean repo', () => {
    const dir = tmpDir();
    const result = scanPreExistingArtifacts(dir, PLATFORM_ROOT, LEGACY_ROOT, FW_PATTERNS);
    assert.deepEqual(result.toBackup, []);
    assert.deepEqual(result.toNote, []);
    fs.rmSync(dir, { recursive: true });
  });

  test('detects CLAUDE.md in toBackup', () => {
    const dir = tmpDir();
    write(dir, 'CLAUDE.md', '# My instructions');
    const result = scanPreExistingArtifacts(dir, PLATFORM_ROOT, LEGACY_ROOT, FW_PATTERNS);
    assert.ok(result.toBackup.some(b => b.file === 'CLAUDE.md'));
    fs.rmSync(dir, { recursive: true });
  });

  test('detects AGENTS.md in toBackup', () => {
    const dir = tmpDir();
    write(dir, 'AGENTS.md', '# My agents');
    const result = scanPreExistingArtifacts(dir, PLATFORM_ROOT, LEGACY_ROOT, FW_PATTERNS);
    assert.ok(result.toBackup.some(b => b.file === 'AGENTS.md'));
    fs.rmSync(dir, { recursive: true });
  });

  test('detects .cursorrules in toBackup AND toNote', () => {
    const dir = tmpDir();
    write(dir, '.cursorrules', 'old rules');
    const result = scanPreExistingArtifacts(dir, PLATFORM_ROOT, LEGACY_ROOT, FW_PATTERNS);
    assert.ok(result.toBackup.some(b => b.file === '.cursorrules'));
    assert.ok(result.toNote.some(b => b.file === '.cursorrules'));
    fs.rmSync(dir, { recursive: true });
  });

  test('detects user .mdc files but NOT platform files', () => {
    const dir = tmpDir();
    write(dir, '.cursor/rules/my-rules.mdc', 'my rules');
    write(dir, '.cursor/rules/platform-core.mdc', 'platform rules');
    write(dir, '.cursor/rules/caveman.mdc', 'caveman');
    const result = scanPreExistingArtifacts(dir, PLATFORM_ROOT, LEGACY_ROOT, FW_PATTERNS);
    assert.ok(result.toBackup.some(b => b.file === '.cursor/rules/my-rules.mdc'));
    assert.ok(!result.toBackup.some(b => b.file === '.cursor/rules/platform-core.mdc'));
    assert.ok(!result.toBackup.some(b => b.file === '.cursor/rules/caveman.mdc'));
    fs.rmSync(dir, { recursive: true });
  });

  test('detects multiple artifacts simultaneously', () => {
    const dir = tmpDir();
    write(dir, 'CLAUDE.md', 'claude');
    write(dir, '.cursorrules', 'rules');
    write(dir, '.cursor/rules/mine.mdc', 'mine');
    const result = scanPreExistingArtifacts(dir, PLATFORM_ROOT, LEGACY_ROOT, FW_PATTERNS);
    assert.equal(result.toBackup.length, 3);
    fs.rmSync(dir, { recursive: true });
  });
});
