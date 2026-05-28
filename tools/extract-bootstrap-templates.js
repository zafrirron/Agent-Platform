/**
 * One-time / maintenance: split AGENT-PLATFORM-BOOTSTRAP.md Appendix B into
 * AGENT-PLATFORM-TEMPLATES/ + AGENT-PLATFORM-MANIFEST.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'AGENT-PLATFORM-BOOTSTRAP.md');
const TEMPLATES_DIR = path.join(ROOT, 'AGENT-PLATFORM-TEMPLATES');
const MANIFEST_PATH = path.join(ROOT, 'AGENT-PLATFORM-MANIFEST.json');

const raw = fs.readFileSync(SOURCE, 'utf8');
const appendixStart = raw.indexOf('## Appendix B — File templates');
if (appendixStart < 0) throw new Error('Appendix B not found');

const appendix = raw.slice(appendixStart);
const fileRegex = /(?:^### |^#### )FILE:\s+(.+?)\s*$/gm;
const matches = [...appendix.matchAll(fileRegex)];

const files = [];
for (let i = 0; i < matches.length; i++) {
  const targetPath = matches[i][1].trim();
  const headerEnd = matches[i].index + matches[i][0].length;
  const nextStart = i + 1 < matches.length ? matches[i + 1].index : appendix.length;
  let chunk = appendix.slice(headerEnd, nextStart);

  const fenceStart = chunk.indexOf('```');
  if (fenceStart < 0) continue;
  const afterFence = chunk.indexOf('\n', fenceStart) + 1;
  const fenceEnd = chunk.indexOf('\n```', afterFence);
  if (fenceEnd < 0) continue;

  let content = chunk.slice(afterFence, fenceEnd);
  const firstLine = content.split('\n')[0].trim();
  if (/^(markdown|yaml|json|javascript|powershell|text)$/i.test(firstLine)) {
    content = content.slice(content.indexOf('\n') + 1);
  }

  const templateId = targetPath.replace(/\\/g, '/');
  files.push({ path: targetPath.replace(/\\/g, '/'), template: templateId, content });
}

if (!fs.existsSync(TEMPLATES_DIR)) fs.mkdirSync(TEMPLATES_DIR, { recursive: true });

for (const f of files) {
  const out = path.join(TEMPLATES_DIR, f.template);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, contentFor(f), 'utf8');
}

function contentFor(f) {
  return f.content.endsWith('\n') ? f.content : f.content + '\n';
}

const manifest = {
  schema_version: 1,
  bootstrap_version: '2.0.0',
  description: 'Agent platform template manifest — used with AGENT-PLATFORM-BOOTSTRAP.md',
  templates_root: 'AGENT-PLATFORM-TEMPLATES',
  placeholders: ['PROJECT_NAME', 'PROJECT_DESCRIPTION', 'DATE', 'HIGH_CONFLICT_PATHS', 'TEST_RUNNER', 'BOOTSTRAP_VERSION'],
  frameworks: ['cursor', 'claude', 'antigravity', 'codex'],
  files: files.map(({ path: p, template }) => ({
    path: p,
    template,
    kind: p.includes('tools/') ? 'tool' : p.includes('playbooks/') ? 'playbook' : 'template',
  })),
};

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Extracted ${files.length} templates to ${TEMPLATES_DIR}`);
console.log(`Wrote ${MANIFEST_PATH}`);
