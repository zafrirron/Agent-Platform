/**
 * Install profile filtering — lite / core / full and à la carte --add.
 * Used by apply.js; exported for unit tests.
 */

export const ENTERPRISE_PLAYBOOKS = new Set([
  'nfr-definition.md',
  'production-readiness.md',
  'performance-budget.md',
  'observability-setup.md',
  'accessibility-audit.md',
  'compliance-review.md',
  'org-maturity-assessment.md',
  'incident-postmortem.md',
]);

export const CORE_PLAYBOOKS = new Set([
  'audit.md',
  'add-dependency.md',
  'add-feature.md',
  'api-integration.md',
  'bug-fix.md',
  'debug-pipeline.md',
  'refactor.md',
  'release.md',
  'security-audit.md',
  'document-api.md',
  'deprecation.md',
  'requirements-clarification.md',
]);

export const LITE_PLAYBOOKS = new Set([
  'add-feature.md',
  'bug-fix.md',
  'refactor.md',
  'release.md',
  'debug-pipeline.md',
  'security-audit.md',
  'document-api.md',
  'deprecation.md',
  'requirements-clarification.md',
]);

/** Paths omitted from lite profile (coordination / enterprise layer). */
export const LITE_SKIP_PATHS = new Set([
  '.agent/context/reputation.json',
  '.agent/context/nfr-log.md',
  '.agent/context/compliance-evidence-log.md',
  '.agent/context/incident-log.md',
  '.agent/handoff/CURRENT.md',
  '.agent/handoff/sync/registry.yaml',
  '.agent/handoff/sync/README.md',
  '.agent/handoff/task-template.md',
  '.agent/session-end.md',
  '.agent/session-end-shared.md',
  '.agent/PLATFORM-HELP.md',
  '.agent/tools/check-updates.mjs',
  '.agent/tools/upgrade.md',
  '.agent/MIGRATION-NOTES.md',
  'SYNC-POINTS.md',
  '.cursor/rules/plan-mode-handoff.mdc',
  '.cursor/rules/agent-sync.mdc',
  '.cursor/rules/platform-core.mdc',
]);

/** All expert agents + manifests — lite uses skills router instead. */
const AGENT_PATH_RE = /^\.agent\/agents\//;

const FRAMEWORK_PREFIX = {
  claude:      ['.claude/'],
  cursor:      ['.cursor/'],
  antigravity: ['.agents/'],
  codex:       ['.codex/'],
};

export function playbookBasename(entry) {
  const p = entry.path || '';
  const base = p.split('/').pop();
  return base.endsWith('.md') ? base : '';
}

export function isSkillPath(entry) {
  return entry.kind === 'skill'
    || ((entry.path || '').includes('.agent/skills/') && (entry.path || '').endsWith('SKILL.md'));
}

export function isCommandPath(entry) {
  return entry.kind === 'command'
    || ((entry.path || '').includes('/commands/') && (entry.path || '').endsWith('.md'));
}

const SKILL_ALIASES = {
  tdd: 'test-driven-development',
  interview: 'interview-me',
  plan: 'planning-and-task-breakdown',
  build: 'incremental-implementation',
  simplify: 'code-simplification',
  context: 'context-engineering',
  verify: 'verification-before-completion',
};

export function matchesFramework(entry, framework) {
  if (!framework) return true;
  const prefixes = FRAMEWORK_PREFIX[framework];
  if (!prefixes) return true;
  const p = entry.path || '';
  if (p.startsWith('.agent/') || p === 'AGENTS.md' || p === 'CHANGELOG.md') return true;
  return prefixes.some((pre) => p.startsWith(pre));
}

export function resolveTemplate(entry, profile) {
  if (profile !== 'lite') return entry.template;
  if (entry.path === 'AGENTS.md') return 'AGENTS-lite.md';
  if (entry.path === '.agent/session-start.md') return '.agent/session-start-lite.md';
  if (entry.path === '.agent/QUICK-REF.md') return '.agent/QUICK-REF-lite.md';
  return entry.template;
}

/**
 * @param {object} entry — manifest.files item
 * @param {{ profile?: string, framework?: string|null, addOnly?: Set<string>|null }} opts
 */
export function shouldInstallEntry(entry, opts = {}) {
  const profile = opts.profile || 'full';
  const framework = opts.framework || null;
  const addOnly = opts.addOnly || null;

  if (entry.scope === 'global') return false;
  if (!matchesFramework(entry, framework)) return false;

  if (addOnly && addOnly.size > 0) {
    return matchesAddSelection(entry, addOnly);
  }

  if (profile === 'full') return true;

  const path = entry.path || '';
  const kind = entry.kind || '';
  const pb = playbookBasename(entry);

  if (profile === 'core') {
    if (kind === 'playbook' && ENTERPRISE_PLAYBOOKS.has(pb)) return false;
    if (LITE_SKIP_PATHS.has(path) && path.includes('reputation')) return false;
    if (path === '.agent/context/nfr-log.md') return false;
    if (path === '.agent/context/compliance-evidence-log.md') return false;
    if (path === '.agent/context/incident-log.md') return false;
    return true;
  }

  if (profile === 'lite') {
    if (LITE_SKIP_PATHS.has(path)) return false;
    if (AGENT_PATH_RE.test(path)) return false;
    if (kind === 'playbook') return LITE_PLAYBOOKS.has(pb);
    if (isSkillPath(entry)) return true;
    if (isCommandPath(entry)) return true;
    if (path.startsWith('.agent/references/')) return true;
    if (path === '.agent/context/spec-outline.md') return true;
    if (path === '.agent/platform.json') return true;
    if (path === '.agent/QUICK-REF.md') return true;
    if (path === '.agent/session-start.md') return true;
    if (path === 'AGENTS.md') return true;
    if (path === '.agent/bootstrap/apply.js') return false;
    if (path.startsWith('.agent/tools/')) return false;
    if (path.startsWith('.agent/context/') && path !== '.agent/context/spec-outline.md') return false;
    if (path.startsWith('.agent/handoff/')) return false;
    if (kind === 'tool') return false;
    // Framework README + FRAMEWORK.json + prompts + caveman wiring
    if (path.endsWith('/README.md') || path.endsWith('FRAMEWORK.json')) return true;
    if (path.includes('/prompts/session-start.md')) return true;
    if (path.includes('caveman')) return true;
    if (path === '.cursor/rules/caveman.mdc') return true;
    return false;
  }

  return true;
}

/** Map add token → manifest path prefixes or skill ids */
export function parseAddTokens(tokens) {
  const set = new Set();
  for (const raw of tokens) {
    const t = raw.trim().toLowerCase();
    if (!t) continue;
    const [type, rawName] = t.includes(':') ? t.split(':') : ['skill', t];
    const name = (type === 'skill' && SKILL_ALIASES[rawName]) ? SKILL_ALIASES[rawName] : rawName;
    if (type === 'skill' || type === 'playbook' || type === 'command') {
      set.add(`${type}:${name}`);
    }
  }
  return set;
}

function matchesAddSelection(entry, addOnly) {
  const path = entry.path || '';
  const pb = playbookBasename(entry);

  for (const token of addOnly) {
    const [type, name] = token.split(':');
    if (type === 'playbook' && entry.kind === 'playbook') {
      if (pb === `${name}.md` || pb === name) return true;
    }
    if (type === 'skill' && path.includes(`.agent/skills/${name}/`)) return true;
    if (type === 'command' && isCommandPath(entry) && path.endsWith(`/commands/${name}.md`)) return true;
  }

  // Minimal router + shared deps for à la carte install
  if (path === 'AGENTS.md' || path === '.agent/platform.json') return true;
  if (path === '.agent/QUICK-REF.md' || path === '.agent/session-start.md') return true;
  if (path.startsWith('.agent/references/')) return true;
  if (path === '.agent/context/spec-outline.md') return true;

  return false;
}

/** Default command + reference deps when adding a skill by id */
export const SKILL_ADD_DEPS = {
  'interview-me':              ['spec'],
  'idea-refine':               ['spec'],
  'test-driven-development':   ['test'],
  'planning-and-task-breakdown': ['plan'],
  'incremental-implementation':  ['build'],
  'code-simplification':       ['code-simplify'],
  'using-platform':            [],
  'browser-testing-devtools':  [],
  'web-performance-audit':     ['webperf'],
  'context-engineering':       ['context'],
  'verification-before-completion': ['verify'],
  'caveman':                   ['caveman'],
};

export function expandAddTokens(tokens) {
  const base = parseAddTokens(tokens);
  const expanded = new Set(base);
  for (const token of base) {
    if (!token.startsWith('skill:')) continue;
    const id = token.slice('skill:'.length);
    for (const cmd of SKILL_ADD_DEPS[id] || []) {
      expanded.add(`command:${cmd}`);
    }
  }
  return expanded;
}
