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
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(PACK_ROOT, 'AGENT-PLATFORM-MANIFEST.json'), 'utf8')
);
const MANIFEST_VERSION = MANIFEST.bootstrap_version;
const FRAMEWORK_COUNT = (MANIFEST.frameworks || []).length;

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

  // Phase 2A + 2B: registry schema v2
  test('registry.yaml schema_version is 2', () => {
    const reg = fs.readFileSync(path.join(dir, '.agent/handoff/sync/registry.yaml'), 'utf8');
    assert.ok(reg.includes('schema_version: 2'), 'registry must be schema_version 2 after Phase 2');
  });

  test('registry.yaml has finality_state: clean for all frameworks (Phase 2A)', () => {
    const reg = fs.readFileSync(path.join(dir, '.agent/handoff/sync/registry.yaml'), 'utf8');
    const matches = (reg.match(/finality_state: clean/g) || []).length;
    assert.equal(matches, FRAMEWORK_COUNT, `expected ${FRAMEWORK_COUNT} finality_state: clean entries (one per framework), got ${matches}`);
  });

  test('registry.yaml has step_manifest: [] for all frameworks (Phase 2A)', () => {
    const reg = fs.readFileSync(path.join(dir, '.agent/handoff/sync/registry.yaml'), 'utf8');
    const matches = (reg.match(/step_manifest: \[\]/g) || []).length;
    assert.equal(matches, FRAMEWORK_COUNT, `expected ${FRAMEWORK_COUNT} step_manifest: [] entries (one per framework), got ${matches}`);
  });

  test('registry.yaml has completed_actions: {} at top level (Phase 2B)', () => {
    const reg = fs.readFileSync(path.join(dir, '.agent/handoff/sync/registry.yaml'), 'utf8');
    assert.ok(reg.includes('completed_actions: {}'), 'registry missing completed_actions map (Phase 2B idempotency)');
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
    assert.ok(content.includes('/.agent/'), '.agent/ not gitignored (whole folder)');
  });

  test('gitignore is file-scoped in shared folders (not whole-folder)', () => {
    const content = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
    const lines = content.split('\n').map((l) => l.trim());
    // Platform's own files are ignored individually...
    assert.ok(content.includes('/.cursor/rules/platform-core.mdc'), 'platform Cursor rule not gitignored');
    assert.ok(content.includes('/.claude/commands/plan.md'), 'platform Claude command not gitignored');
    // ...but the shared framework folders are NEVER whole-folder ignored.
    for (const folder of ['.cursor/', '.claude/', '.codex/', '.agents/', '.opencode/', '/.cursor/', '/.claude/', '/.codex/', '/.agents/', '/.opencode/']) {
      assert.ok(!lines.includes(folder), `shared folder ${folder} must not be whole-folder ignored`);
    }
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

  test('user-owned CLAUDE.md is NOT gitignored', () => {
    const gi = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
    const lines = gi.split('\n').map((l) => l.trim());
    assert.ok(!lines.includes('/CLAUDE.md') && !lines.includes('CLAUDE.md'),
      'a pre-existing user CLAUDE.md must stay tracked, not gitignored');
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

// ── Shared-folder ownership: user files preserved & tracked ───────────────

describe('install — user rules in shared folders preserved and tracked', () => {
  const dir = tmpDir();
  // A user with their own Cursor rule but NO Claude usage.
  fs.mkdirSync(path.join(dir, '.cursor/rules'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.cursor/rules/my-custom.mdc'), '---\ndescription: mine\n---\nMy rule\n');
  const result = runApply(dir);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('user rule file still present on disk', () => {
    const content = fs.readFileSync(path.join(dir, '.cursor/rules/my-custom.mdc'), 'utf8');
    assert.ok(content.includes('My rule'), 'user rule was modified or deleted');
  });

  test('user rule is NOT gitignored', () => {
    const gi = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
    assert.ok(!gi.includes('my-custom.mdc'), 'user rule must not be gitignored');
    const lines = gi.split('\n').map((l) => l.trim());
    assert.ok(!lines.includes('.cursor/') && !lines.includes('/.cursor/'),
      '.cursor/ must not be whole-folder ignored (would hide user rules)');
  });

  test('platform-created CLAUDE.md IS gitignored for non-Claude user', () => {
    // User had no CLAUDE.md; platform creates one for cross-framework activation.
    assert.ok(fs.existsSync(path.join(dir, 'CLAUDE.md')), 'platform CLAUDE.md should be created');
    const gi = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
    const lines = gi.split('\n').map((l) => l.trim());
    assert.ok(lines.includes('/CLAUDE.md'),
      'a platform-created CLAUDE.md must be gitignored so it never pollutes the user git tree');
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

// ── Uninstall preserves user rules created AFTER install ──────────────────

describe('uninstall --confirm — user rules in shared folders survive', () => {
  const dir = tmpDir();
  runApply(dir); // install (creates .cursor/rules/platform-core.mdc etc.)
  // User adds their OWN rule AFTER install — was never in the pre-install backup.
  fs.writeFileSync(path.join(dir, '.cursor/rules/added-later.mdc'), '---\ndescription: mine\n---\nKeep me\n');
  const result = runApply(dir, ['--mode=uninstall', '--confirm']);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('user rule added after install survives uninstall', () => {
    const p = path.join(dir, '.cursor/rules/added-later.mdc');
    assert.ok(fs.existsSync(p), 'user rule was deleted by uninstall');
    assert.ok(fs.readFileSync(p, 'utf8').includes('Keep me'), 'user rule content lost');
  });

  test('.cursor/ folder retained because it holds a user file', () => {
    assert.ok(fs.existsSync(path.join(dir, '.cursor/rules')), '.cursor/rules should survive (user file present)');
  });

  test('platform Cursor rule was removed', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.cursor/rules/platform-core.mdc')), 'platform rule not removed');
  });

  test('.agent/ removed', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.agent')), '.agent/ still exists after uninstall');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Uninstall prunes empty platform folders ───────────────────────────────

describe('uninstall --confirm — empty platform folders pruned', () => {
  const dir = tmpDir();
  runApply(dir); // install
  const result = runApply(dir, ['--mode=uninstall', '--confirm']);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('.cursor/ removed when it held only platform files', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.cursor')), '.cursor/ should be pruned when empty');
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

// ── PW1: AGENTS.md two-section model ─────────────────────────────────────────

describe('AGENTS.md — two-section model after fresh install', () => {
  const dir = tmpDir();
  runApply(dir);
  const agentsPath = path.join(dir, 'AGENTS.md');

  test('AGENTS.md has PLATFORM:START marker', () => {
    const content = fs.readFileSync(agentsPath, 'utf8');
    assert.ok(content.includes('<!-- PLATFORM:START -->'), 'AGENTS.md missing PLATFORM:START');
  });

  test('AGENTS.md has PROJECT:START marker', () => {
    const content = fs.readFileSync(agentsPath, 'utf8');
    assert.ok(content.includes('<!-- PROJECT:START -->'), 'AGENTS.md missing PROJECT:START');
  });

  test('AGENTS.md PROJECT section has custom routing rows placeholder', () => {
    const content = fs.readFileSync(agentsPath, 'utf8');
    assert.ok(content.includes('Custom routing rows'), 'AGENTS.md PROJECT section missing custom routing rows placeholder');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('AGENTS.md — custom PROJECT routing row survives upgrade', () => {
  const dir = tmpDir();
  runApply(dir);
  const agentsPath = path.join(dir, 'AGENTS.md');

  // User adds a custom routing row in the PROJECT section
  const installed = fs.readFileSync(agentsPath, 'utf8');
  const withCustom = installed.replace(
    '| *(add custom rows here)* | | |',
    '| "my custom trigger" | `.agent/agents/backend-agent.md` | *(none)* |'
  );
  fs.writeFileSync(agentsPath, withCustom);

  runApply(dir, ['--mode=upgrade']);

  test('custom routing row preserved after upgrade', () => {
    const content = fs.readFileSync(agentsPath, 'utf8');
    assert.ok(content.includes('my custom trigger'), 'custom PROJECT routing row was destroyed by upgrade');
  });

  test('PLATFORM section still present after upgrade', () => {
    const content = fs.readFileSync(agentsPath, 'utf8');
    assert.ok(content.includes('<!-- PLATFORM:START -->'), 'PLATFORM markers missing after upgrade');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('AGENTS.md — migration from pre-two-section install', () => {
  const dir = tmpDir();
  runApply(dir);
  const agentsPath = path.join(dir, 'AGENTS.md');

  // Simulate old install: strip PLATFORM/PROJECT markers (pre-PW1 state)
  const installed = fs.readFileSync(agentsPath, 'utf8');
  const oldFormat = installed
    .replace(/<!-- PLATFORM:START -->\n/, '')
    .replace(/<!-- PLATFORM:END -->\n/, '')
    .replace(/<!-- PROJECT:START -->[\s\S]*<!-- PROJECT:END -->\n?/, '');
  fs.writeFileSync(agentsPath, oldFormat);

  // Upgrade should migrate it (full replace since no PROJECT content)
  const result = runApply(dir, ['--mode=upgrade']);

  test('upgrade exits 0 during migration', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}`);
  });

  test('migrated AGENTS.md has PLATFORM markers', () => {
    const content = fs.readFileSync(agentsPath, 'utf8');
    assert.ok(content.includes('<!-- PLATFORM:START -->'), 'migration did not add PLATFORM markers');
  });

  test('migrated AGENTS.md has PROJECT section', () => {
    const content = fs.readFileSync(agentsPath, 'utf8');
    assert.ok(content.includes('<!-- PROJECT:START -->'), 'migration did not add PROJECT section');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Phase 1A: Agent manifests ──────────────────────────────────────────────

describe('Phase 1A — agent manifest files deployed after install', () => {
  const dir = tmpDir();
  runApply(dir);

  const agents = ['architect','backend','frontend','devops','test','docs','security','data','critic'];

  for (const agent of agents) {
    test(`${agent}-agent.manifest.json exists`, () => {
      assert.ok(
        fs.existsSync(path.join(dir, `.agent/agents/${agent}-agent.manifest.json`)),
        `${agent}-agent.manifest.json not deployed`
      );
    });

    test(`${agent}-agent.manifest.json is valid JSON with required fields`, () => {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(dir, `.agent/agents/${agent}-agent.manifest.json`), 'utf8')
      );
      assert.ok(manifest.id,               `${agent} manifest missing id`);
      assert.ok(manifest.display_name,     `${agent} manifest missing display_name`);
      assert.ok(manifest.version,          `${agent} manifest missing version`);
      assert.ok(Array.isArray(manifest.capabilities) && manifest.capabilities.length > 0, `${agent} manifest missing capabilities`);
      assert.ok(manifest.governance,       `${agent} manifest missing governance`);
      assert.ok(Array.isArray(manifest.governance.critic_dimensions), `${agent} manifest missing critic_dimensions`);
      assert.ok(Array.isArray(manifest.routing_keywords) && manifest.routing_keywords.length > 0, `${agent} manifest missing routing_keywords`);
      assert.ok(manifest.trust_ceiling,    `${agent} manifest missing trust_ceiling`);
    });
  }

  test('schema file deployed', () => {
    assert.ok(
      fs.existsSync(path.join(dir, '.agent/agents/schemas/agent.manifest.schema.json')),
      'schema file not deployed'
    );
  });

  test('schema file is valid JSON', () => {
    const schema = JSON.parse(
      fs.readFileSync(path.join(dir, '.agent/agents/schemas/agent.manifest.schema.json'), 'utf8')
    );
    assert.ok(schema.$schema, 'schema missing $schema field');
    assert.ok(schema.required, 'schema missing required fields list');
  });

  test('manifest ids match agent filenames', () => {
    for (const agent of agents) {
      const manifest = JSON.parse(
        fs.readFileSync(path.join(dir, `.agent/agents/${agent}-agent.manifest.json`), 'utf8')
      );
      assert.equal(manifest.id, `${agent}-agent`, `${agent} manifest id does not match filename`);
    }
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── v2.40.0 enterprise capabilities ────────────────────────────────────────

describe('install — v2.43.0 lifecycle skills + profiles', () => {
  const dir = tmpDir();
  const result = runApply(dir);

  const PLAYBOOKS_20 = [
    'audit.md', 'add-dependency.md', 'add-feature.md', 'api-integration.md',
    'bug-fix.md', 'debug-pipeline.md', 'refactor.md', 'release.md',
    'security-audit.md', 'document-api.md',
    'nfr-definition.md', 'production-readiness.md', 'performance-budget.md',
    'observability-setup.md', 'accessibility-audit.md', 'compliance-review.md',
    'org-maturity-assessment.md', 'incident-postmortem.md', 'deprecation.md',
    'requirements-clarification.md',
  ];

  const ENTERPRISE_PLAYBOOKS = [
    'nfr-definition.md', 'production-readiness.md', 'performance-budget.md',
    'observability-setup.md', 'accessibility-audit.md', 'compliance-review.md',
    'org-maturity-assessment.md', 'incident-postmortem.md',
  ];

  const CONTEXT_FILES = [
    'nfr-log.md', 'compliance-evidence-log.md', 'incident-log.md',
  ];

  test('bootstrap_version matches manifest in platform.json', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.equal(pj.bootstrap_version, MANIFEST_VERSION, `expected bootstrap_version ${MANIFEST_VERSION}`);
  });

  test('all 20 playbooks deployed', () => {
    const pbDir = path.join(dir, '.agent/playbooks');
    for (const file of PLAYBOOKS_20) {
      assert.ok(fs.existsSync(path.join(pbDir, file)), `missing playbook: ${file}`);
    }
    const onDisk = fs.readdirSync(pbDir).filter(f => f.endsWith('.md'));
    assert.equal(onDisk.length, 20, `expected 20 playbooks, got ${onDisk.length}`);
  });

  test('v2.40 enterprise playbooks are non-empty', () => {
    for (const file of ENTERPRISE_PLAYBOOKS) {
      const content = fs.readFileSync(path.join(dir, '.agent/playbooks', file), 'utf8');
      assert.ok(content.length > 200, `${file} looks too short`);
      assert.ok(content.includes('PLATFORM:START') || content.includes('##'), `${file} missing content markers`);
    }
  });

  test('enterprise context log templates deployed', () => {
    for (const file of CONTEXT_FILES) {
      const p = path.join(dir, '.agent/context', file);
      assert.ok(fs.existsSync(p), `missing context file: ${file}`);
      const content = fs.readFileSync(p, 'utf8');
      assert.ok(content.length > 50, `${file} looks empty`);
    }
  });

  test('AGENTS.md routes NFR, PRR, compliance, maturity, and deprecation playbooks', () => {
    const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
    assert.ok(agents.includes('production-readiness.md'), 'PRR routing missing');
    assert.ok(agents.includes('nfr-definition.md'), 'NFR routing missing');
    assert.ok(agents.includes('compliance-review.md'), 'compliance routing missing');
    assert.ok(agents.includes('org-maturity-assessment.md'), 'maturity routing missing');
    assert.ok(agents.includes('incident-postmortem.md'), 'postmortem routing missing');
    assert.ok(agents.includes('deprecation.md'), 'deprecation routing missing');
    assert.ok(agents.includes('requirements-clarification.md'), 'requirements clarification routing missing');
  });

  test('audit.md includes Phase 10 governance and Phase 11 report', () => {
    const audit = fs.readFileSync(path.join(dir, '.agent/playbooks/audit.md'), 'utf8');
    assert.ok(audit.includes('Phase 10'), 'audit Phase 10 missing');
    assert.ok(audit.includes('Governance, compliance & maturity'), 'audit governance phase missing');
    assert.ok(audit.includes('Phase 11'), 'audit Phase 11 missing');
    assert.ok(audit.includes('compliance-evidence-log.md'), 'audit compliance context ref missing');
  });

  test('QUICK-REF.md documents 20 playbooks and reference checklists', () => {
    const qr = fs.readFileSync(path.join(dir, '.agent/QUICK-REF.md'), 'utf8');
    assert.ok(qr.includes('20 total') || qr.includes('(20 total)'), 'QUICK-REF playbook count missing');
    assert.ok(qr.includes('11-phase'), 'QUICK-REF 11-phase audit missing');
    assert.ok(qr.includes('references/testing-patterns'), 'QUICK-REF testing reference missing');
    assert.ok(qr.includes('Deprecation'), 'QUICK-REF deprecation row missing');
  });

  test('reference checklists deployed under .agent/references/', () => {
    for (const file of ['testing-patterns.md', 'security-checklist.md', 'performance-checklist.md', 'accessibility-checklist.md', 'orchestration-patterns.md']) {
      const p = path.join(dir, '.agent/references', file);
      assert.ok(fs.existsSync(p), `missing reference: ${file}`);
    }
  });

  test('add-feature playbook has spec step, doubt review, and rationalization table', () => {
    const af = fs.readFileSync(path.join(dir, '.agent/playbooks/add-feature.md'), 'utf8');
    assert.ok(af.includes('Spec clarity'), 'add-feature spec step missing');
    assert.ok(af.includes('Doubt review'), 'add-feature doubt gate missing');
    assert.ok(af.includes('Common rationalizations'), 'add-feature rationalization table missing');
  });

  test('spec-outline.md context template deployed', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/context/spec-outline.md')), 'spec-outline.md missing');
  });

  test('backend-agent.md includes Hyrum\'s Law', () => {
    const be = fs.readFileSync(path.join(dir, '.agent/agents/backend-agent.md'), 'utf8');
    assert.ok(be.includes('Hyrum'), 'Hyrum\'s Law missing from backend-agent');
  });

  test('test-agent has Beyoncé rule and test pyramid', () => {
    const ta = fs.readFileSync(path.join(dir, '.agent/agents/test-agent.md'), 'utf8');
    assert.ok(ta.includes('Beyoncé') || ta.includes('Beyonce'), 'Beyoncé rule missing');
    assert.ok(ta.includes('Test pyramid'), 'test pyramid missing');
    assert.ok(ta.includes('DAMP'), 'DAMP rule missing');
  });

  test('critic-agent.md has 10 review dimensions including ACCESSIBILITY and BC', () => {
    const critic = fs.readFileSync(path.join(dir, '.agent/agents/critic-agent.md'), 'utf8');
    for (const tag of ['[ACCESSIBILITY]', '[OPERABILITY]', '[BC]']) {
      assert.ok(critic.includes(tag), `critic missing dimension ${tag}`);
    }
  });

  test('frontend-agent.md includes UX interaction principles', () => {
    const fe = fs.readFileSync(path.join(dir, '.agent/agents/frontend-agent.md'), 'utf8');
    assert.ok(fe.includes('UX interaction principles'), 'frontend UX principles missing');
    assert.ok(fe.includes('aria-live'), 'frontend a11y guidance missing');
  });

  test('Cursor plan-mode-handoff rule deployed', () => {
    const rule = path.join(dir, '.cursor/rules/plan-mode-handoff.mdc');
    assert.ok(fs.existsSync(rule), 'plan-mode-handoff.mdc missing');
    const body = fs.readFileSync(rule, 'utf8');
    assert.ok(body.includes('resuming Step 3'), 'plan handoff resume step missing');
    assert.ok(body.includes('add-feature.md'), 'plan handoff add-feature ref missing');
  });

  test('add-feature playbook documents Cursor Plan mode handoff', () => {
    const af = fs.readFileSync(path.join(dir, '.agent/playbooks/add-feature.md'), 'utf8');
    assert.ok(af.includes('Cursor Plan mode handoff'), 'add-feature plan handoff section missing');
    assert.ok(af.includes('Resume at Step 3'), 'add-feature Step 3 resume missing');
  });

  test('AGENTS.md routes implement-the-plan to add-feature resume', () => {
    const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
    assert.ok(agents.includes('implement the plan'), 'AGENTS.md plan implement trigger missing');
    assert.ok(agents.includes('resume from Step 3'), 'AGENTS.md Step 3 resume hint missing');
  });

  test('Cursor slash commands deployed under .cursor/commands/', () => {
    for (const cmd of ['quick-ref', 'spec', 'plan', 'build', 'test', 'code-simplify', 'webperf', 'context', 'verify', 'ship', 'audit', 'review', 'release', 'implement', 'session-start', 'session-end', 'platform-help', 'caveman']) {
      const p = path.join(dir, '.cursor/commands', `${cmd}.md`);
      assert.ok(fs.existsSync(p), `missing Cursor command: ${cmd}.md`);
    }
    const spec = fs.readFileSync(path.join(dir, '.cursor/commands/spec.md'), 'utf8');
    assert.ok(spec.includes('interview-me'), 'Cursor /spec command body wrong');
  });

  test('Claude lifecycle slash commands deployed under .claude/commands/', () => {
    for (const cmd of ['quick-ref', 'spec', 'plan', 'build', 'test', 'code-simplify', 'webperf', 'context', 'verify', 'ship', 'audit', 'review', 'release', 'caveman']) {
      const p = path.join(dir, '.claude/commands', `${cmd}.md`);
      assert.ok(fs.existsSync(p), `missing Claude command: ${cmd}.md`);
    }
    const spec = fs.readFileSync(path.join(dir, '.claude/commands/spec.md'), 'utf8');
    assert.ok(spec.includes('interview-me'), 'Claude /spec command body wrong');
  });

  test('lifecycle skills deployed under .agent/skills/', () => {
    for (const id of ['interview-me', 'idea-refine', 'planning-and-task-breakdown', 'incremental-implementation', 'test-driven-development', 'code-simplification', 'web-performance-audit', 'context-engineering', 'verification-before-completion', 'using-platform']) {
      assert.ok(fs.existsSync(path.join(dir, '.agent/skills', id, 'SKILL.md')), `missing skill: ${id}`);
    }
  });

  test('optional ux-research skill deployed and in manifest catalog', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/skills/ux-research/SKILL.md')), 'ux-research skill missing');
    const manifest = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'AGENT-PLATFORM-MANIFEST.json'), 'utf8'));
    assert.ok(manifest.skills_catalog.some((s) => s.id === 'ux-research'), 'ux-research missing from skills_catalog');
  });

  test('install stdout shows dynamic playbook count (20 playbooks)', () => {
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes('20 playbooks'), 'install banner missing dynamic playbook count');
    assert.ok(result.stdout.includes('references'), 'install banner missing references hint');
  });

  test('install stdout prints enforcement note once', () => {
    const matches = result.stdout.match(/Rules are guidance/g) || [];
    assert.equal(matches.length, 1, `expected 1 enforcement note, got ${matches.length}`);
  });

  test('PLATFORM-HELP.md has Start here and slash command guidance', () => {
    const help = fs.readFileSync(path.join(dir, '.agent/PLATFORM-HELP.md'), 'utf8');
    assert.ok(help.includes('Start here'), 'PLATFORM-HELP Start here section missing');
    assert.ok(help.includes('.cursor/commands/'), 'PLATFORM-HELP Cursor commands missing');
    assert.ok(help.includes('.claude/commands/'), 'PLATFORM-HELP Claude commands missing');
    assert.ok(help.includes('interview me'), 'PLATFORM-HELP requirements clarification missing');
  });

  test('QUICK-REF.md has Key principle column and Plan handoff', () => {
    const qr = fs.readFileSync(path.join(dir, '.agent/QUICK-REF.md'), 'utf8');
    assert.ok(qr.includes('Key principle'), 'QUICK-REF Key principle column missing');
    assert.ok(qr.includes('plan-mode-handoff'), 'QUICK-REF Plan handoff missing');
    assert.ok(qr.includes('/implement'), 'QUICK-REF /implement missing');
    assert.ok(qr.includes('When to use what'), 'QUICK-REF lifecycle when/how section missing');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── Profiles: lite + add + list ───────────────────────────────────────────

describe('install — profile=lite (skills pack)', () => {
  const dir = tmpDir();
  const result = runApply(dir, ['--profile=lite', '--framework=cursor']);

  test('exits 0', () => {
    assert.equal(result.status, 0, result.stderr);
  });

  test('uses AGENTS-lite router', () => {
    const agents = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
    assert.ok(agents.includes('profile') && agents.includes('lite'), 'AGENTS-lite not deployed');
  });

  test('deploys skills not expert agents', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/skills/interview-me/SKILL.md')));
    assert.ok(!fs.existsSync(path.join(dir, '.agent/agents/backend-agent.md')));
  });

  test('skips enterprise and handoff layer', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.agent/context/reputation.json')));
    assert.ok(!fs.existsSync(path.join(dir, '.agent/handoff/sync/registry.yaml')));
    assert.ok(!fs.existsSync(path.join(dir, '.agent/playbooks/compliance-review.md')));
  });

  test('platform.json records profile lite', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.equal(pj.profile, 'lite');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('install — mode=add cherry-pick skill', () => {
  const dir = tmpDir();
  const result = runApply(dir, ['--mode=add', '--add=skill:interview-me', '--framework=claude']);

  test('exits 0', () => {
    assert.equal(result.status, 0, result.stderr);
  });

  test('installs skill and /spec command dep', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/skills/interview-me/SKILL.md')));
    assert.ok(fs.existsSync(path.join(dir, '.claude/commands/spec.md')));
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('install — mode=list skills', () => {
  const result = spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, `--target=${tmpDir()}`, '--mode=list', '--list=skills'],
    { encoding: 'utf8', timeout: 10_000 }
  );

  test('exits 0 and lists interview-me', () => {
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes('skill:interview-me'), result.stdout);
  });
});

// ── Packs: technology-stack / domain overlays (opt-in) ─────────────────────

describe('packs — not installed by default (full profile)', () => {
  const dir = tmpDir();
  runApply(dir);

  test('no .agent/packs directory after full install', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.agent/packs')), 'packs must not install by profile');
  });

  test('platform.json has empty active_packs', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.deepEqual(pj.active_packs, [], 'active_packs should be [] on a clean install');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('packs — registered in manifest catalog', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'AGENT-PLATFORM-MANIFEST.json'), 'utf8'));

  test('packs_catalog lists the v1 packs', () => {
    const ids = (manifest.packs_catalog || []).map((p) => p.id);
    for (const id of ['stack-react', 'stack-django', 'domain-fintech',
                      'language-typescript', 'language-java', 'language-cpp']) {
      assert.ok(ids.includes(id), `packs_catalog missing ${id}`);
    }
  });

  test('language packs use kind "language"', () => {
    const langs = (manifest.packs_catalog || []).filter((p) => p.id.startsWith('language-'));
    assert.ok(langs.length >= 3, 'expected at least 3 language packs');
    assert.ok(langs.every((p) => p.kind === 'language'), 'language pack with wrong kind');
  });

  test('every catalog pack has a pack.json registered in files[]', () => {
    for (const p of manifest.packs_catalog || []) {
      const has = manifest.files.some((f) => f.kind === 'pack' && f.path === `.agent/packs/${p.id}/pack.json`);
      assert.ok(has, `pack.json not registered for ${p.id}`);
    }
  });

  test('domain-fintech pack.json declares reference_sources', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'AGENT-PLATFORM-TEMPLATES/.agent/packs/domain-fintech/pack.json'), 'utf8'));
    assert.ok(Array.isArray(pj.reference_sources) && pj.reference_sources.length > 0, 'reference_sources missing');
    assert.ok(pj.reference_sources.every((s) => s.repo && s.url && s.license), 'reference_sources entries incomplete');
  });
});

describe('packs — mode=add activates a pack', () => {
  const dir = tmpDir();
  runApply(dir); // full install first
  const result = runApply(dir, ['--mode=add', '--add=pack:stack-react', '--framework=cursor']);

  test('exits 0', () => {
    assert.equal(result.status, 0, result.stderr);
  });

  test('installs the pack files (overlay + reference + pack.json)', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/packs/stack-react/pack.json')));
    assert.ok(fs.existsSync(path.join(dir, '.agent/packs/stack-react/frontend-agent.overlay.md')));
    assert.ok(fs.existsSync(path.join(dir, '.agent/packs/stack-react/references/react-pitfalls.md')));
    assert.ok(fs.existsSync(path.join(dir, '.agent/packs/README.md')), 'shared packs README should ship with a pack');
  });

  test('does NOT install other packs', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.agent/packs/stack-django')), 'unselected pack leaked');
  });

  test('records the pack in active_packs', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.ok(pj.active_packs.includes('stack-react'), 'active_packs missing stack-react');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('packs — user content survives upgrade and force', () => {
  const dir = tmpDir();
  runApply(dir); // full install
  runApply(dir, ['--mode=add', '--add=pack:stack-react', '--framework=cursor']);

  const userOverlay = path.join(dir, '.agent/packs/stack-react/user.overlay.md');
  const shippedOverlay = path.join(dir, '.agent/packs/stack-react/frontend-agent.overlay.md');
  const USER_MARK = '## project rule\n- tactical panel must support split-screen layout';
  fs.writeFileSync(userOverlay, `# my rules\n\n${USER_MARK}\n`);
  const shippedBefore = fs.readFileSync(shippedOverlay, 'utf8');

  test('mode=upgrade leaves user.overlay.md untouched', () => {
    const r = runApply(dir, ['--mode=upgrade']);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(fs.existsSync(userOverlay), 'user.overlay.md deleted by upgrade');
    assert.ok(fs.readFileSync(userOverlay, 'utf8').includes(USER_MARK), 'user rule lost on upgrade');
  });

  test('mode=upgrade does not touch shipped pack overlays', () => {
    assert.equal(fs.readFileSync(shippedOverlay, 'utf8'), shippedBefore, 'shipped overlay changed on upgrade');
  });

  test('mode=upgrade preserves active_packs', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.ok(pj.active_packs.includes('stack-react'), 'active_packs dropped on upgrade');
  });

  test('mode=force leaves user.overlay.md and pack files untouched', () => {
    const r = runApply(dir, ['--mode=force']);
    assert.equal(r.status, 0, r.stderr);
    assert.ok(fs.existsSync(userOverlay), 'user.overlay.md deleted by force');
    assert.ok(fs.readFileSync(userOverlay, 'utf8').includes(USER_MARK), 'user rule lost on force');
    assert.equal(fs.readFileSync(shippedOverlay, 'utf8'), shippedBefore, 'shipped overlay changed on force');
  });

  test('user.overlay.md is not registered in the manifest', () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(PACK_ROOT, 'AGENT-PLATFORM-MANIFEST.json'), 'utf8'));
    assert.ok(!manifest.files.some((f) => f.path.endsWith('user.overlay.md')), 'user.overlay.md must stay user-owned (out of manifest)');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('packs — mode=list packs', () => {
  const result = spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, `--target=${tmpDir()}`, '--mode=list', '--list=packs'],
    { encoding: 'utf8', timeout: 10_000 }
  );

  test('exits 0 and lists pack ids with kind', () => {
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes('pack:stack-react'), result.stdout);
    assert.ok(result.stdout.includes('domain-fintech'), result.stdout);
  });
});

describe('packs — detect-and-suggest at install (proposal, not auto-install)', () => {
  const dir = tmpDir();
  // Simulate a React project so the detector fires
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
    name: 'sample', version: '1.0.0',
    dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' },
  }, null, 2));
  const result = runApply(dir);

  test('stdout proposes the detected pack', () => {
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes('Suggested packs'), `no suggestion block:\n${result.stdout}`);
    assert.ok(result.stdout.includes('--add=pack:stack-react'), 'stack-react not suggested');
  });

  test('detection does NOT auto-install the pack', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.agent/packs/stack-react')), 'pack must not auto-install');
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.deepEqual(pj.active_packs, [], 'active_packs must stay empty until user opts in');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('packs — language pack activates with a shared overlay', () => {
  const dir = tmpDir();
  runApply(dir); // full install first
  const result = runApply(dir, ['--mode=add', '--add=pack:language-typescript', '--framework=cursor']);

  test('exits 0', () => {
    assert.equal(result.status, 0, result.stderr);
  });

  test('installs the language pack files (shared code overlay + reference)', () => {
    assert.ok(fs.existsSync(path.join(dir, '.agent/packs/language-typescript/pack.json')));
    assert.ok(fs.existsSync(path.join(dir, '.agent/packs/language-typescript/code.overlay.md')));
    assert.ok(fs.existsSync(path.join(dir, '.agent/packs/language-typescript/references/typescript-pitfalls.md')));
  });

  test('agent_overlays maps several experts to one shared file', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/packs/language-typescript/pack.json'), 'utf8'));
    const overlays = pj.provides.agent_overlays;
    const experts = Object.keys(overlays);
    assert.ok(experts.length >= 2, 'language pack should overlay multiple code experts');
    const files = new Set(Object.values(overlays));
    assert.equal(files.size, 1, 'language pack should reuse a single shared overlay file');
    assert.ok(files.has('code.overlay.md'), 'shared overlay filename mismatch');
  });

  test('records the language pack in active_packs', () => {
    const pj = JSON.parse(fs.readFileSync(path.join(dir, '.agent/platform.json'), 'utf8'));
    assert.ok(pj.active_packs.includes('language-typescript'), 'active_packs missing language-typescript');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('packs — language detection (marker file + source extension)', () => {
  test('tsconfig.json marker suggests language-typescript', () => {
    const dir = tmpDir();
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true } }));
    const result = runApply(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes('--add=pack:language-typescript'), `TS not suggested:\n${result.stdout}`);
    assert.ok(!fs.existsSync(path.join(dir, '.agent/packs/language-typescript')), 'must not auto-install');
    fs.rmSync(dir, { recursive: true });
  });

  test('source extension alone (.cpp, no manifest) suggests language-cpp', () => {
    const dir = tmpDir();
    fs.mkdirSync(path.join(dir, 'src'));
    fs.writeFileSync(path.join(dir, 'src/main.cpp'), 'int main() { return 0; }\n');
    const result = runApply(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes('--add=pack:language-cpp'), `C++ not suggested via extension:\n${result.stdout}`);
    fs.rmSync(dir, { recursive: true });
  });
});

describe('packs — stack detection is precise (no package.json false positive)', () => {
  test('a Node/Express project (no react) does NOT suggest stack-react', () => {
    const dir = tmpDir();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
      name: 'todo-api', version: '1.0.0',
      dependencies: { express: '^4.18.0' },
      devDependencies: { jest: '^29.0.0' },
    }, null, 2));
    const result = runApply(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(!result.stdout.includes('--add=pack:stack-react'),
      `stack-react must NOT be suggested for a non-React Node project:\n${result.stdout}`);
    fs.rmSync(dir, { recursive: true });
  });

  test('a .jsx file (no react dep) suggests stack-react via glob', () => {
    const dir = tmpDir();
    fs.mkdirSync(path.join(dir, 'src'));
    fs.writeFileSync(path.join(dir, 'src/App.jsx'), 'export default function App(){return null;}\n');
    const result = runApply(dir);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.includes('--add=pack:stack-react'),
      `stack-react not suggested via **/*.jsx glob:\n${result.stdout}`);
    fs.rmSync(dir, { recursive: true });
  });
});

// ── Phase 1B: Reputation vectors ───────────────────────────────────────────

describe('Phase 1B — reputation.json deployed after install', () => {
  const dir = tmpDir();
  runApply(dir);
  const repPath = path.join(dir, '.agent/context/reputation.json');

  test('reputation.json exists', () => {
    assert.ok(fs.existsSync(repPath), 'reputation.json not deployed');
  });

  test('reputation.json is valid JSON', () => {
    assert.doesNotThrow(() => JSON.parse(fs.readFileSync(repPath, 'utf8')));
  });

  test('reputation.json contains all 9 agents', () => {
    const rep = JSON.parse(fs.readFileSync(repPath, 'utf8'));
    const agents = ['architect-agent','backend-agent','frontend-agent','devops-agent',
                    'test-agent','docs-agent','security-agent','data-agent','critic-agent'];
    for (const agent of agents) {
      assert.ok(rep.agents[agent], `reputation.json missing agent: ${agent}`);
      assert.equal(rep.agents[agent].overall, 500, `${agent} should start at 500 trust`);
    }
  });

  test('reputation.json has required schema_version field', () => {
    const rep = JSON.parse(fs.readFileSync(repPath, 'utf8'));
    assert.ok(rep.schema_version, 'reputation.json missing schema_version');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

// ── OpenCode framework (R037/R038/R039) ─────────────────────────────────────

describe('OpenCode framework — default install', () => {
  const dir = tmpDir();
  const result = runApply(dir);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}\nstdout: ${result.stdout}`);
  });

  test('manifest registers opencode as a framework', () => {
    assert.ok((MANIFEST.frameworks || []).includes('opencode'), 'opencode missing from manifest.frameworks');
  });

  test('creates .opencode/ private folder', () => {
    assert.ok(fs.existsSync(path.join(dir, '.opencode')), '.opencode/ missing');
  });

  test('emits lifecycle slash commands to .opencode/commands/', () => {
    for (const c of ['spec.md', 'plan.md', 'build.md', 'test.md', 'review.md', 'ship.md']) {
      assert.ok(fs.existsSync(path.join(dir, '.opencode/commands', c)), `.opencode/commands/${c} missing`);
    }
  });

  test('emits Critic subagent to .opencode/agents/critic.md', () => {
    assert.ok(fs.existsSync(path.join(dir, '.opencode/agents/critic.md')), 'critic subagent missing');
  });

  test('emits opencode.json with instructions', () => {
    const p = path.join(dir, 'opencode.json');
    assert.ok(fs.existsSync(p), 'opencode.json missing');
    const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
    assert.ok(Array.isArray(cfg.instructions) && cfg.instructions.includes('AGENTS.md'), 'opencode.json instructions must include AGENTS.md');
  });

  test('opencode.json is not clobbered when it already exists', () => {
    const dir2 = tmpDir();
    const custom = '{\n  "$schema": "https://opencode.ai/config.json",\n  "provider": { "anthropic": {} }\n}\n';
    fs.writeFileSync(path.join(dir2, 'opencode.json'), custom);
    runApply(dir2);
    assert.equal(fs.readFileSync(path.join(dir2, 'opencode.json'), 'utf8'), custom, 'existing opencode.json must be preserved');
    fs.rmSync(dir2, { recursive: true });
  });

  test('gitignore block lists .opencode/ and opencode.json', () => {
    const gi = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
    assert.ok(gi.includes('.opencode/'), '.opencode/ missing from gitignore block');
    assert.ok(gi.includes('opencode.json'), 'opencode.json missing from gitignore block');
  });

  test('cleanup', () => { fs.rmSync(dir, { recursive: true }); assert.ok(true); });
});

describe('OpenCode framework — scoped install (--framework=opencode)', () => {
  const dir = tmpDir();
  const result = runApply(dir, ['--framework=opencode']);

  test('exits 0', () => {
    assert.equal(result.status, 0, `stderr: ${result.stderr}\nstdout: ${result.stdout}`);
  });

  test('installs .opencode/ and opencode.json', () => {
    assert.ok(fs.existsSync(path.join(dir, '.opencode/commands/spec.md')), '.opencode command missing under scoped install');
    assert.ok(fs.existsSync(path.join(dir, 'opencode.json')), 'opencode.json missing under scoped install');
  });

  test('does NOT install other frameworks private folders', () => {
    assert.ok(!fs.existsSync(path.join(dir, '.cursor')), '.cursor/ should not install for --framework=opencode');
    assert.ok(!fs.existsSync(path.join(dir, '.codex')), '.codex/ should not install for --framework=opencode');
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
