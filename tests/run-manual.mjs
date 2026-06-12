#!/usr/bin/env node
/**
 * Guided manual E2E test runner for Agent Platform Bootstrap.
 *
 * Automated phases (0, 1, 8, 9, 10, 12) run without interaction.
 * Automated phase 1lite runs lite profile smoke. Manual phases (2, 2b, 2c, 2d, 3, 4, 5, 6, 7, 11) show instructions and wait for your verdict.
 *
 * Usage:
 *   npm run test:manual
 *   npm run test:manual -- --dir=C:\Temp\my-e2e
 *   node tests/run-manual.mjs --dir=/tmp/my-e2e
 */

import { createInterface } from 'node:readline';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACK_ROOT  = path.resolve(__dirname, '..');
const APPLY      = path.join(PACK_ROOT, 'AGENT-PLATFORM-APPLY.js');
const TODO_APP   = path.join(__dirname, 'todo-app');

/* ── CLI args ─────────────────────────────────────────────────────────────── */
const dirArg = process.argv.find(a => a.startsWith('--dir='));
const TEST_DIR = dirArg
  ? dirArg.split('=')[1]
  : path.join(os.tmpdir(), `platform-e2e-${Date.now()}`);

/* ── ANSI helpers ─────────────────────────────────────────────────────────── */
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  grey:   '\x1b[90m',
  blue:   '\x1b[34m',
  purple: '\x1b[35m',
};
const c = (color, text) => `${C[color]}${text}${C.reset}`;
const LINE  = c('grey', '─'.repeat(62));
const LINE2 = c('cyan', '═'.repeat(62));

/* ── Run tracker ──────────────────────────────────────────────────────────── */
const results = [];
let phaseNum = 0;

function recordResult(phase, title, verdict, notes = '') {
  results.push({ phase, title, verdict, notes });
}

/* ── Readline ─────────────────────────────────────────────────────────────── */
const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function verdict(phase, title) {
  console.log('');
  console.log(LINE);
  process.stdout.write(c('bold', '  Result → ') + 'Type ' +
    c('green', 'p') + '=PASS  ' + c('red', 'f') + '=FAIL  ' +
    c('yellow', 's') + '=SKIP  then Enter: ');
  const raw = (await ask('')).trim().toLowerCase();
  const v = raw === 'p' || raw === 'pass' ? 'PASS'
          : raw === 'f' || raw === 'fail' ? 'FAIL'
          : 'SKIP';
  let notes = '';
  if (v === 'FAIL') {
    process.stdout.write(c('red', '  Notes (optional): '));
    notes = (await ask('')).trim();
  }
  recordResult(phase, title, v, notes);
  const badge = v === 'PASS' ? c('green', '✔ PASS')
              : v === 'FAIL' ? c('red',   '✘ FAIL')
              :                c('yellow', '⊘ SKIP');
  console.log(`  ${badge}  ${c('grey', title)}`);
}

/* ── Phase header ─────────────────────────────────────────────────────────── */
function phaseHeader(num, label, type) {
  phaseNum = num;
  const tag = type === 'auto'   ? c('green',  ' AUTO ')
            : type === 'manual' ? c('purple', ' MANUAL ')
            :                     c('cyan',   ' SETUP ');
  console.log('');
  console.log(LINE2);
  console.log(`  ${tag}  ${c('bold', `Phase ${num} — ${label}`)}`);
  console.log(LINE2);
}

/* ── Auto-phase runner ────────────────────────────────────────────────────── */
function autoCheck(label, pass, failMsg = '') {
  const badge = pass ? c('green', '  ✔') : c('red', '  ✘');
  console.log(`${badge}  ${label}${pass ? '' : c('red', '  ← ' + failMsg)}`);
  return pass;
}

function runApply(extraArgs = [], extraEnv = {}, target = TEST_DIR) {
  return spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, `--target=${target}`, ...extraArgs],
    { encoding: 'utf8', timeout: 60_000, env: { ...process.env, ...extraEnv } }
  );
}

function runApplyGlobal(homeDir, extraArgs = []) {
  return spawnSync(
    process.execPath,
    [APPLY, `--pack=${PACK_ROOT}`, '--mode=global', ...extraArgs],
    { encoding: 'utf8', timeout: 30_000, env: { ...process.env, AP_HOME: homeDir } }
  );
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function git(...args) {
  return spawnSync('git', ['-C', TEST_DIR, ...args], { encoding: 'utf8' });
}

/* ══════════════════════════════════════════════════════════════════════════ */
/*  MAIN                                                                      */
/* ══════════════════════════════════════════════════════════════════════════ */

console.log('');
console.log(LINE2);
console.log(c('bold', '  Agent Platform Bootstrap — Manual E2E Test Runner'));
console.log(LINE2);
console.log(`  Test dir : ${c('cyan', TEST_DIR)}`);
console.log(`  Pack     : ${c('grey', PACK_ROOT)}`);
console.log('');
console.log('  Automated phases run without input.');
console.log('  Manual phases show instructions → you interact with your AI IDE → type p/f/s.');
console.log('');
process.stdout.write('  Press Enter to start...');
await ask('');

/* ── Phase 0 — Setup ──────────────────────────────────────────────────────── */

phaseHeader(0, 'Setup — create test repo with todo-app', 'setup');

if (fs.existsSync(TEST_DIR) && fs.existsSync(path.join(TEST_DIR, '.agent'))) {
  console.log(c('yellow', '  ⚠  Test dir already has platform installed — skipping setup.'));
  console.log(c('yellow', `     Delete ${TEST_DIR} and re-run to start fresh.`));
} else {
  fs.mkdirSync(TEST_DIR, { recursive: true });
  copyDir(TODO_APP, TEST_DIR);
  console.log(c('green', `  ✔  Copied todo-app to ${TEST_DIR}`));

  git('init');
  git('add', '-A');
  git('commit', '-m', 'chore: initial todo app (pre-platform)');
  console.log(c('green', '  ✔  git init + initial commit'));

  autoCheck('CLAUDE.md present (pre-existing — will be backed up)',
    fs.existsSync(path.join(TEST_DIR, 'CLAUDE.md')));
  autoCheck('AGENTS.md present (pre-existing — will be backed up)',
    fs.existsSync(path.join(TEST_DIR, 'AGENTS.md')));
  autoCheck('.agent/ absent (platform not yet installed)',
    !fs.existsSync(path.join(TEST_DIR, '.agent')));
}
recordResult(0, 'Setup', 'PASS');

/* ── Phase 1 — Install ────────────────────────────────────────────────────── */

phaseHeader(1, 'Install — fresh install with pre-existing AI configs', 'auto');
console.log('  Running installer...');

const install = runApply();
const ok = install.status === 0;

autoCheck('Installer exits 0', ok, install.stderr || install.stdout);
autoCheck('.agent/ created',       fs.existsSync(path.join(TEST_DIR, '.agent')));
autoCheck('.claude/ created',      fs.existsSync(path.join(TEST_DIR, '.claude')));
autoCheck('AGENTS.md created',     fs.existsSync(path.join(TEST_DIR, 'AGENTS.md')));
autoCheck('CLAUDE.md present',     fs.existsSync(path.join(TEST_DIR, 'CLAUDE.md')));
autoCheck('platform.json created', fs.existsSync(path.join(TEST_DIR, '.agent/platform.json')));
autoCheck('CURRENT.md created',    fs.existsSync(path.join(TEST_DIR, '.agent/handoff/CURRENT.md')));
autoCheck('MIGRATION-NOTES.md created', fs.existsSync(path.join(TEST_DIR, '.agent/MIGRATION-NOTES.md')));

const pj = JSON.parse(fs.readFileSync(path.join(TEST_DIR, '.agent/platform.json'), 'utf8'));
autoCheck('platform.json has platform_repo',  !!pj.platform_repo && !pj.platform_repo.includes('{{'));
autoCheck('platform.json has platform_npx',   !!pj.platform_npx  && !pj.platform_npx.includes('{{'));
autoCheck('platform.json has bootstrap_version', !!pj.bootstrap_version);

const backupRoot = path.join(TEST_DIR, '.agent/backup');
autoCheck('Backup dir created', fs.existsSync(backupRoot) && fs.readdirSync(backupRoot).length > 0);

const quickRef = fs.readFileSync(path.join(TEST_DIR, '.agent/QUICK-REF.md'), 'utf8');
autoCheck('No raw {{PLATFORM_NPX}} in QUICK-REF.md', !quickRef.includes('{{PLATFORM_NPX}}'));

const backend = fs.readFileSync(path.join(TEST_DIR, '.agent/agents/backend-agent.md'), 'utf8');
autoCheck('Two-section markers in backend-agent.md',
  backend.includes('<!-- PLATFORM:START -->') && backend.includes('<!-- PROJECT:START -->'));

autoCheck('No stderr from installer', !install.stderr.trim(),
  install.stderr.slice(0, 100));

const globalSuggestion = install.stdout.includes('Global stubs');
autoCheck('Global stubs status shown in install summary', globalSuggestion);

autoCheck('bootstrap_version is 2.41.0', pj.bootstrap_version === '2.41.0',
  `got ${pj.bootstrap_version}`);
autoCheck('Install banner shows 20 playbooks (dynamic count)',
  install.stdout.includes('20 playbooks'));

const pbDir = path.join(TEST_DIR, '.agent/playbooks');
const pbCount = fs.existsSync(pbDir)
  ? fs.readdirSync(pbDir).filter(f => f.endsWith('.md')).length : 0;
autoCheck('20 playbooks on disk', pbCount === 20, `got ${pbCount}`);

autoCheck('spec-outline.md deployed',
  fs.existsSync(path.join(TEST_DIR, '.agent/context/spec-outline.md')));
autoCheck('references/ checklists deployed',
  fs.existsSync(path.join(TEST_DIR, '.agent/references/orchestration-patterns.md')));
autoCheck('plan-mode-handoff.mdc deployed',
  fs.existsSync(path.join(TEST_DIR, '.cursor/rules/plan-mode-handoff.mdc')));
autoCheck('Cursor /spec command deployed',
  fs.existsSync(path.join(TEST_DIR, '.cursor/commands/spec.md')));
autoCheck('Claude /spec command deployed',
  fs.existsSync(path.join(TEST_DIR, '.claude/commands/spec.md')));
autoCheck('Lifecycle commands deployed (plan/build/test/code-simplify/webperf/context/verify)',
  ['plan', 'build', 'test', 'code-simplify', 'webperf', 'context', 'verify'].every(c =>
    fs.existsSync(path.join(TEST_DIR, `.claude/commands/${c}.md`)) &&
    fs.existsSync(path.join(TEST_DIR, `.cursor/commands/${c}.md`))));
autoCheck('interview-me skill deployed',
  fs.existsSync(path.join(TEST_DIR, '.agent/skills/interview-me/SKILL.md')));

const quickRefV41 = fs.readFileSync(path.join(TEST_DIR, '.agent/QUICK-REF.md'), 'utf8');
autoCheck('QUICK-REF has Key principle column', quickRefV41.includes('Key principle'));
autoCheck('QUICK-REF documents 20 playbooks',
  quickRefV41.includes('20 total') || quickRefV41.includes('(20 total)'));

const platformHelp = fs.readFileSync(path.join(TEST_DIR, '.agent/PLATFORM-HELP.md'), 'utf8');
autoCheck('PLATFORM-HELP has Start here section', platformHelp.includes('Start here'));

console.log('');
console.log(c('grey', '  Install stdout (last 8 lines):'));
install.stdout.trim().split('\n').slice(-8).forEach(l => console.log(c('grey', '  ' + l)));

recordResult(1, 'Install', ok ? 'PASS' : 'FAIL');

/* ── Phase 1lite — Lite profile (skills pack) ─────────────────────────────── */

phaseHeader('1lite', 'Lite profile — skills pack smoke (--profile=lite)', 'auto');
const TEST_DIR_LITE = path.join(path.dirname(TEST_DIR), path.basename(TEST_DIR) + '-lite');
if (fs.existsSync(TEST_DIR_LITE)) {
  fs.rmSync(TEST_DIR_LITE, { recursive: true, force: true });
}
fs.mkdirSync(TEST_DIR_LITE, { recursive: true });
copyDir(TODO_APP, TEST_DIR_LITE);
spawnSync('git', ['-C', TEST_DIR_LITE, 'init'], { encoding: 'utf8' });
spawnSync('git', ['-C', TEST_DIR_LITE, 'add', '-A'], { encoding: 'utf8' });
spawnSync('git', ['-C', TEST_DIR_LITE, 'commit', '-m', 'chore: lite profile e2e'], { encoding: 'utf8' });

console.log('  Running installer --profile=lite --framework=cursor...');
const liteInstall = runApply(['--profile=lite', '--framework=cursor'], {}, TEST_DIR_LITE);
const liteOk = liteInstall.status === 0;

autoCheck('Lite installer exits 0', liteOk, liteInstall.stderr || liteInstall.stdout);
autoCheck('interview-me skill present',
  fs.existsSync(path.join(TEST_DIR_LITE, '.agent/skills/interview-me/SKILL.md')));
autoCheck('planning skill present',
  fs.existsSync(path.join(TEST_DIR_LITE, '.agent/skills/planning-and-task-breakdown/SKILL.md')));
autoCheck('No backend-agent.md (experts skipped)',
  !fs.existsSync(path.join(TEST_DIR_LITE, '.agent/agents/backend-agent.md')));
autoCheck('No registry.yaml (handoff skipped)',
  !fs.existsSync(path.join(TEST_DIR_LITE, '.agent/handoff/sync/registry.yaml')));
autoCheck('Cursor /plan command deployed',
  fs.existsSync(path.join(TEST_DIR_LITE, '.cursor/commands/plan.md')));

const pjLite = JSON.parse(fs.readFileSync(path.join(TEST_DIR_LITE, '.agent/platform.json'), 'utf8'));
autoCheck('platform.json profile=lite', pjLite.profile === 'lite', `got ${pjLite.profile}`);

const agentsLite = fs.readFileSync(path.join(TEST_DIR_LITE, 'AGENTS.md'), 'utf8');
autoCheck('AGENTS.md mentions lite profile', agentsLite.includes('lite'));

recordResult('1lite', 'Lite profile install', liteOk ? 'PASS' : 'FAIL');

/* ── Phase 2 — Session Start ──────────────────────────────────────────────── */

phaseHeader(2, 'Session Start — Claude Code', 'manual');
console.log(`  ${c('cyan', '1.')} Open Claude Code in:  ${c('bold', TEST_DIR)}`);
console.log(`  ${c('cyan', '2.')} Start a new chat and paste:`);
console.log('');
console.log(c('green', '     Read .agent/session-start.md and execute it.'));
console.log('');
console.log('  Verify each item:');
console.log('   [ ] Step 1d: First-session audit offer box appears (no prior completed sessions)');
console.log('   [ ]   Reply NO — proceed without audit (audit tested in Phase 2b separately)');
console.log('   [ ] Step 2: Test runner setup skipped (npx jest already detected)');
console.log('   [ ] Step 5: Compact status block — NOT the full QUICK-REF table');
console.log('   [ ] Step 5: .agent/QUICK-REF.md link is clickable');
console.log('   [ ] Step 8: "Ready. Tell me what you want to do."');
console.log('');
console.log('  Also verify `show quick reference` points to `.agent/QUICK-REF.md` (no full table dump).');
await verdict(2, 'Session Start');

/* ── Phase 2b — Full Project Audit ───────────────────────────────────────── */

phaseHeader('2b', 'Full Project Audit — manual trigger', 'manual');
console.log('  In the same Claude Code session, type:');
console.log('');
console.log(c('green', '     Run project audit'));
console.log('');
console.log('  Verify:');
console.log('   [ ] All 11 audit phases run (incl. Performance, Frontend/a11y, Observability, Governance & maturity)');
console.log('   [ ] Report created at .agent/context/audit-YYYY-MM-DD-HH-MM.md');
console.log('   [ ] Report has executive summary table with domain health (🟢🟡🔴)');
console.log('   [ ] Report has findings by severity and Quick wins section');
console.log('');
console.log(c('grey', '  Tip: Run audit on a NEW scratch folder to also test the YES path of the'));
console.log(c('grey', '  first-session offer (start a new repo, install, open — offer appears, reply YES).'));
await verdict('2b', 'Full Project Audit');

/* ── Phase 2c — Slash commands ───────────────────────────────────────────── */

phaseHeader('2c', 'Slash commands — Claude Code (+ optional Cursor)', 'manual');
console.log('  In Claude Code, type each slash command:');
console.log('');
const slashCmds = [
  ['/quick-ref',      'Points to .agent/QUICK-REF.md — no full table dump'],
  ['/spec',           'interview-me skill → spec-outline.md'],
  ['/plan',           'planning-and-task-breakdown skill'],
  ['/build',          'incremental-implementation skill (try build auto after plan)'],
  ['/test',           'test-driven-development skill'],
  ['/code-simplify',  'code-simplification skill'],
  ['/webperf',        'web-performance-audit skill (Quick/Deep CWV)'],
  ['/context',        'context-engineering skill'],
  ['/verify',         'verification-before-completion skill (evidence before done)'],
  ['/audit',          'All experts + audit playbook (full profile)'],
  ['/review',         'Critic / code review'],
  ['/release',        'DevOps + release'],
  ['/ship',           'Release or PRR (context-dependent)'],
];
slashCmds.forEach(([cmd, exp], i) => {
  console.log(`  ${c('cyan', (i+1) + '.')} ${c('bold', cmd)}`);
  console.log(c('grey', `     → expected: ${exp}`));
});
console.log('');
console.log(c('grey', '  Optional in Cursor: /session-start · /platform-help · /implement (see Phase 2d)'));
await verdict('2c', 'Slash commands');

/* ── Phase 2d — Cursor Plan handoff ──────────────────────────────────────── */

phaseHeader('2d', 'Cursor Plan mode handoff (optional)', 'manual');
console.log('  In Cursor: start add-feature → approve Plan → type `/implement` or "implement the plan".');
console.log('');
console.log('   [ ] Status line: resuming Step 3 — plan approved');
console.log('   [ ] add-feature.md loads; Steps 0–2 skipped; implementation starts at Step 3');
await verdict('2d', 'Cursor Plan handoff');

/* ── Phase 3 — Auto-routing ───────────────────────────────────────────────── */

phaseHeader(3, 'Auto-routing — 13 prompts', 'manual');
console.log('  In Claude Code, type each prompt. Agent must route SILENTLY (no announcement).');
console.log('');
const prompts = [
  ['fix the create todo endpoint — it doesn\'t validate the title',  'Backend + bug-fix'],
  ['add a due date field to todos',                                   'Backend + add-feature'],
  ['check if the API is secure',                                      'Security + security-audit'],
  ['write tests for the todos router',                                'Test expert'],
  ['document the API',                                                'Docs + document-api'],
  ['I\'m ready to cut a release',                                     'DevOps + release'],
  ['define NFRs for this API — p95 under 200ms',                     'Architect + nfr-definition'],
  ['run a production readiness review before go-live',                'DevOps + production-readiness'],
  ['compliance review for SOC 2 SDLC controls',                       'Security + compliance-review'],
  ['accessibility audit on the todo form',                            'Frontend + accessibility-audit'],
  ['DORA maturity assessment for our team',                           'Architect + org-maturity-assessment'],
  ['interview me about adding push notifications',                    'Architect + interview-me skill'],
  ['deprecate the legacy v1 todos endpoint',                          'Architect + deprecation'],
];
prompts.forEach(([p, e], i) => {
  console.log(`  ${c('cyan', (i+1) + '.')} "${p}"`);
  console.log(c('grey', `     → expected: ${e}`));
});
console.log('');
console.log('  Verify: correct expert loads silently each time, no "I am now loading..." text.');
await verdict(3, 'Auto-routing');

/* ── Phase 4 — Security gate ──────────────────────────────────────────────── */

phaseHeader(4, 'Security gate — add-feature Step 5a', 'manual');
console.log('  In Claude Code, type:');
console.log('');
console.log(c('green', '     Add user authentication — each todo should belong to a user.'));
console.log(c('green', '     Users authenticate with a token in the Authorization header.'));
console.log('');
console.log('  Verify:');
console.log('   [ ] Architect: cross-cutting scope noted, ADR before code');
console.log('   [ ] Backend: implements JWT auth (sub claim, owner field, 404 on wrong owner)');
console.log('   [ ] Step 5a fires automatically: Security expert reviews new auth code');
console.log('   [ ] Test expert: tests for auth logic added');
console.log('   [ ] Critic: 10-dimension adversarial review');
console.log('   [ ] Nothing marked done until all gates pass');
await verdict(4, 'Security gate');

/* ── Phase 5 — Session End ────────────────────────────────────────────────── */

phaseHeader(5, 'Session End — Claude Code', 'manual');
console.log('  In Claude Code, type:');
console.log('');
console.log(c('green', '     End session.'));
console.log('');
console.log('  Verify:');
console.log('   [ ] Agent derives goal and file list from context — does NOT ask you to recap');
console.log('   [ ] Agent checks git status and commits uncommitted changes via shell');
console.log('   [ ] CURRENT.md updated: goal · files · Commit hash · Critic reviewed: no');
console.log('   [ ] registry.yaml: claude → idle · meta.updated_by: claude');
console.log('   [ ] Output: "Session ended. Framework: claude → idle."');
await verdict(5, 'Session End');

/* ── Phase 6 — Cross-framework Critic ────────────────────────────────────── */

phaseHeader(6, 'Cross-framework Critic — switch to Antigravity', 'manual');
console.log(`  ${c('cyan', '1.')} Open ${c('bold', TEST_DIR)} in Antigravity (new session).`);
console.log(`  ${c('cyan', '2.')} Paste:`);
console.log('');
console.log(c('green', '     Read .agent/session-start.md and execute it.'));
console.log('');
console.log('  Verify Step 1b fires the Critic offer box:');
console.log(c('grey', '  ┌──────────────────────────────────────────────────────────┐'));
console.log(c('grey', '  │  Cross-framework Critic review available                 │'));
console.log(c('grey', '  │  Last session: claude — [goal]                           │'));
console.log(c('grey', '  │  Reply YES to review, NO to proceed directly.            │'));
console.log(c('grey', '  └──────────────────────────────────────────────────────────┘'));
console.log('');
console.log('   [ ] Offer box appears (if not → previous_framework capture bug has returned)');
console.log('   [ ] Reply YES → Critic runs cold 10-dimension review');
console.log('   [ ] CURRENT.md updated: Critic reviewed: yes — X Critical, Y High, Z Medium');
await verdict(6, 'Cross-framework Critic');

/* ── Phase 7 — Framework takeover ────────────────────────────────────────── */

phaseHeader(7, 'Framework takeover — simulate stuck session', 'manual');
console.log('  Manually set claude to active in registry.yaml:');
console.log(c('grey', `  Edit: ${path.join(TEST_DIR, '.agent/handoff/sync/registry.yaml')}`));
console.log(c('grey', '  Set: frameworks.claude.status = active'));
console.log('');
console.log('  Then start a new Antigravity session in the same folder.');
console.log('');
console.log('  Verify:');
console.log('   [ ] Takeover offer appears with the stuck task');
console.log('   [ ] Reply 1 (Take over) → agent commits uncommitted work, sets claude → idle');
console.log('   [ ] Antigravity session starts cleanly');
console.log('   [ ] Cross-framework Critic offer follows');
await verdict(7, 'Framework takeover');

/* ── Phase 8 — Upgrade ────────────────────────────────────────────────────── */

phaseHeader(8, 'Upgrade — two-section model', 'auto');
console.log('  Simulating project rule + upgrade...');

const agentPath   = path.join(TEST_DIR, '.agent/agents/backend-agent.md');
const beforeUpgrade = fs.readFileSync(agentPath, 'utf8');
const withProject = beforeUpgrade.replace(
  '<!-- PROJECT:START -->',
  '<!-- PROJECT:START -->\n- MANUAL_TEST: all endpoints must respond within 200ms'
);
fs.writeFileSync(agentPath, withProject);

// Patch template temporarily with a sentinel
const templatePath = path.join(PACK_ROOT, 'AGENT-PLATFORM-TEMPLATES/.agent/agents/backend-agent.md');
const origTemplate = fs.readFileSync(templatePath, 'utf8');
const patchedTemplate = origTemplate.replace(
  '<!-- PLATFORM:START -->',
  '<!-- PLATFORM:START -->\n- UPGRADE_TEST_SENTINEL: auto-test rule'
);
fs.writeFileSync(templatePath, patchedTemplate);

const upgrade = runApply(['--mode=upgrade']);
fs.writeFileSync(templatePath, origTemplate); // restore immediately

const afterUpgrade = fs.readFileSync(agentPath, 'utf8');

autoCheck('Upgrade exits 0', upgrade.status === 0, upgrade.stderr);
autoCheck('PROJECT rule preserved', afterUpgrade.includes('200ms'),
  'PROJECT rule was overwritten');
autoCheck('PLATFORM sentinel applied', afterUpgrade.includes('UPGRADE_TEST_SENTINEL'),
  'PLATFORM update did not apply');
autoCheck('No stderr', !upgrade.stderr.trim(), upgrade.stderr);

recordResult(8, 'Upgrade two-section model', upgrade.status === 0 ? 'PASS' : 'FAIL');

/* ── Phase 9 — Uninstall ──────────────────────────────────────────────────── */

phaseHeader(9, 'Project uninstall', 'auto');
console.log('  Running uninstall --confirm...');

const uninstall = runApply(['--mode=uninstall', '--confirm']);

autoCheck('Uninstall exits 0', uninstall.status === 0, uninstall.stderr);
autoCheck('.agent/ removed',   !fs.existsSync(path.join(TEST_DIR, '.agent')));
autoCheck('.claude/ removed',  !fs.existsSync(path.join(TEST_DIR, '.claude')));
autoCheck('.cursor/ removed',  !fs.existsSync(path.join(TEST_DIR, '.cursor')));
autoCheck('src/ intact',        fs.existsSync(path.join(TEST_DIR, 'src/app.js')));
autoCheck('Original CLAUDE.md restored',
  fs.readFileSync(path.join(TEST_DIR, 'CLAUDE.md'), 'utf8').includes('pre-existing'));
autoCheck('gitignore block removed',
  !fs.readFileSync(path.join(TEST_DIR, '.gitignore'), 'utf8').includes('Agent Platform Bootstrap'));
autoCheck('No stderr', !uninstall.stderr.trim(), uninstall.stderr);

recordResult(9, 'Project uninstall', uninstall.status === 0 ? 'PASS' : 'FAIL');

/* ── Phase 10 — Global install ────────────────────────────────────────────── */

phaseHeader(10, 'Global install — stubs to ~/  (using isolated temp home)', 'auto');
const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'ap-e2e-home-'));
console.log(`  Temp home: ${c('grey', fakeHome)}`);

const globalInstall = runApplyGlobal(fakeHome);

autoCheck('Global install exits 0', globalInstall.status === 0, globalInstall.stderr);
autoCheck('~/.claude/CLAUDE.md created',                fs.existsSync(path.join(fakeHome, '.claude/CLAUDE.md')));
autoCheck('~/.cursor/rules/agent-platform-global.mdc',  fs.existsSync(path.join(fakeHome, '.cursor/rules/agent-platform-global.mdc')));
autoCheck('~/.codex/instructions.md',                   fs.existsSync(path.join(fakeHome, '.codex/instructions.md')));
autoCheck('~/.agents/rules/agent-platform-global.md',   fs.existsSync(path.join(fakeHome, '.agents/rules/agent-platform-global.md')));
autoCheck('~/.claude/commands/caveman.md',              fs.existsSync(path.join(fakeHome, '.claude/commands/caveman.md')));
autoCheck('~/.claude/commands/spec.md',                fs.existsSync(path.join(fakeHome, '.claude/commands/spec.md')));
autoCheck('~/.cursor/commands/spec.md',                fs.existsSync(path.join(fakeHome, '.cursor/commands/spec.md')));
autoCheck('~/.cursor/commands/implement.md',            fs.existsSync(path.join(fakeHome, '.cursor/commands/implement.md')));
autoCheck('~/.claude/commands/plan.md',                 fs.existsSync(path.join(fakeHome, '.claude/commands/plan.md')));
autoCheck('~/.cursor/commands/build.md',               fs.existsSync(path.join(fakeHome, '.cursor/commands/build.md')));
autoCheck('~/.agent-platform/global-version',           fs.existsSync(path.join(fakeHome, '.agent-platform/global-version')));

const gv = JSON.parse(fs.readFileSync(path.join(fakeHome, '.agent-platform/global-version'), 'utf8'));
autoCheck('Version JSON has version field', !!gv.version && /\d+\.\d+\.\d+/.test(gv.version));
autoCheck('global-version is 2.41.0', gv.version === '2.41.0', `got ${gv.version}`);

const claudeStub = fs.readFileSync(path.join(fakeHome, '.claude/CLAUDE.md'), 'utf8');
autoCheck('PLATFORM:START/END in ~/.claude/CLAUDE.md',
  claudeStub.includes('<!-- PLATFORM:START -->') && claudeStub.includes('<!-- PLATFORM:END -->'));
autoCheck('USER:START/END in ~/.claude/CLAUDE.md',
  claudeStub.includes('<!-- USER:START -->') && claudeStub.includes('<!-- USER:END -->'));
autoCheck('No raw {{PLATFORM_NPX}} in stubs',
  !claudeStub.includes('{{PLATFORM_NPX}}'));

recordResult(10, 'Global install', globalInstall.status === 0 ? 'PASS' : 'FAIL');

/* ── Phase 11 — Global stub activation ───────────────────────────────────── */

phaseHeader(11, 'Global stub activation — AI detection behavior', 'manual');
console.log('  Requires: global stubs installed in your real ~/.claude/ (npm run test:manual');
console.log('  tests a temp home; this phase tests your ACTUAL global stubs with a live AI).');
console.log('');
console.log(c('cyan', '  Test A') + ' — Repo WITH platform installed:');
console.log(`    Open ${c('bold', TEST_DIR)} in Claude Code.`);
console.log('    Type any task (e.g. "fix a bug").');
console.log('   [ ] Claude routes silently — NO install offer appears');
console.log('');
console.log(c('cyan', '  Test B') + ' — Repo WITHOUT platform:');
console.log('    Create a fresh empty folder, open it in Claude Code, type any message.');
console.log('   [ ] Install offer appears at start of first response');
console.log('   [ ] Reply YES → platform installs cleanly');
console.log('');
console.log(c('cyan', '  Test C') + ' — Repo with .agent-platform-skip:');
console.log('    Create empty folder, add .agent-platform-skip file, open in Claude Code.');
console.log('   [ ] No offer appears — Claude proceeds normally');
await verdict(11, 'Global stub activation');

/* ── Phase 12 — Global uninstall ─────────────────────────────────────────── */

phaseHeader(12, 'Global uninstall — USER content preserved (isolated temp home)', 'auto');

// Add user content to the stub before uninstalling
const claudePath = path.join(fakeHome, '.claude/CLAUDE.md');
const stubContent = fs.readFileSync(claudePath, 'utf8');
fs.writeFileSync(claudePath, stubContent.replace('<!-- USER:END -->', 'Always use caveman lite.\n<!-- USER:END -->'));

const dryRun = spawnSync(process.execPath,
  [APPLY, `--pack=${PACK_ROOT}`, '--mode=uninstall-global'],
  { encoding: 'utf8', timeout: 30_000, env: { ...process.env, AP_HOME: fakeHome } }
);
autoCheck('Dry run exits 0', dryRun.status === 0);
autoCheck('Dry run: CLAUDE.md still exists', fs.existsSync(claudePath));
autoCheck('Dry run stdout mentions DRY RUN', dryRun.stdout.toUpperCase().includes('DRY RUN'));

const confirm = spawnSync(process.execPath,
  [APPLY, `--pack=${PACK_ROOT}`, '--mode=uninstall-global', '--confirm'],
  { encoding: 'utf8', timeout: 30_000, env: { ...process.env, AP_HOME: fakeHome } }
);
autoCheck('Confirm exits 0', confirm.status === 0, confirm.stderr);
autoCheck('CLAUDE.md kept (has user content)', fs.existsSync(claudePath));
autoCheck('PLATFORM block removed from CLAUDE.md',
  !fs.readFileSync(claudePath, 'utf8').includes('<!-- PLATFORM:START -->'));
autoCheck('USER content preserved',
  fs.readFileSync(claudePath, 'utf8').includes('Always use caveman lite.'));
autoCheck('Cursor stub deleted',
  !fs.existsSync(path.join(fakeHome, '.cursor/rules/agent-platform-global.mdc')));
autoCheck('Cursor commands deleted',
  !fs.existsSync(path.join(fakeHome, '.cursor/commands/spec.md')));
autoCheck('Claude commands deleted',
  !fs.existsSync(path.join(fakeHome, '.claude/commands/spec.md')));
autoCheck('Version file deleted',
  !fs.existsSync(path.join(fakeHome, '.agent-platform/global-version')));

fs.rmSync(fakeHome, { recursive: true });
recordResult(12, 'Global uninstall', confirm.status === 0 ? 'PASS' : 'FAIL');

/* ── Summary ──────────────────────────────────────────────────────────────── */

rl.close();

console.log('');
console.log(LINE2);
console.log(c('bold', '  E2E Test Run — Summary'));
console.log(LINE2);

let pass = 0, fail = 0, skip = 0;
for (const r of results) {
  const badge = r.verdict === 'PASS' ? c('green',  '✔ PASS')
              : r.verdict === 'FAIL' ? c('red',    '✘ FAIL')
              :                        c('yellow',  '⊘ SKIP');
  const notes = r.notes ? c('red', `  ← ${r.notes}`) : '';
  console.log(`  ${badge}  Phase ${r.phase} — ${r.title}${notes}`);
  if (r.verdict === 'PASS') pass++;
  else if (r.verdict === 'FAIL') fail++;
  else skip++;
}

console.log('');
console.log(`  ${c('green', pass + ' passed')}  ${fail ? c('red', fail + ' failed') : c('grey', '0 failed')}  ${c('yellow', skip + ' skipped')}`);

// Save report
const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
const reportLines = [
  `# Manual E2E Run — ${date}`,
  '',
  `Test dir: ${TEST_DIR}`,
  '',
  '| Phase | Title | Result | Notes |',
  '|-------|-------|--------|-------|',
  ...results.map(r => `| ${r.phase} | ${r.title} | ${r.verdict} | ${r.notes || ''} |`),
  '',
  `Totals: ${pass} passed · ${fail} failed · ${skip} skipped`,
];
const stamp  = new Date().toISOString().slice(0, 10);
const report = path.join(__dirname, `manual-run-${stamp}.md`);
fs.writeFileSync(report, reportLines.join('\n') + '\n');
console.log('');
console.log(`  Report saved: ${c('cyan', report)}`);
console.log(LINE2);
console.log('');

process.exit(fail > 0 ? 1 : 0);
