/**
 * Pure utility functions for the Agent Platform Bootstrap installer.
 * Exported separately so they can be unit-tested.
 */
import fs   from 'fs';
import path from 'path';

/** Replace {{KEY}} placeholders in content */
export function sub(content, vars) {
  let out = content;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{{${k}}}`).join(v);
  return out;
}

/** Returns true if content looks like an unfilled stub */
export function isStub(t) {
  return !t.trim() || /\(\s*fill\b|\*\(fill|none yet|<fill-in/i.test(t);
}

/**
 * Replace only the <!-- PLATFORM:START --> … <!-- PLATFORM:END --> block
 * in existingContent with the equivalent block from newContent.
 * Returns the patched string, or null if either file lacks the markers.
 */
export function patchPlatformSection(existingContent, newContent) {
  const START = '<!-- PLATFORM:START -->';
  const END   = '<!-- PLATFORM:END -->';

  const eStart = existingContent.indexOf(START);
  const eEnd   = existingContent.indexOf(END);
  const nStart = newContent.indexOf(START);
  const nEnd   = newContent.indexOf(END);

  if (eStart < 0 || eEnd < 0 || nStart < 0 || nEnd < 0) return null;
  if (eEnd < eStart || nEnd < nStart) return null; // malformed markers

  const newBlock = newContent.slice(nStart, nEnd + END.length);
  return existingContent.slice(0, eStart) + newBlock + existingContent.slice(eEnd + END.length);
}

/** Detect test runner from project files */
export function detectTestRunner(root) {
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
        if (pkg.scripts.test.includes('vitest')) return 'npx vitest run';
        if (pkg.scripts.test.includes('mocha'))  return 'npx mocha';
      }
      if (pkg.devDependencies?.jest || pkg.dependencies?.jest)         return 'npx jest';
      if (pkg.devDependencies?.vitest || pkg.dependencies?.vitest)     return 'npx vitest run';
    } catch { /* ignore */ }
    return 'npm test';
  }
  const files = fs.readdirSync(root).catch?.(() => []) ?? fs.readdirSync(root);
  if (files.some?.((f) => f.endsWith('.csproj') || f.endsWith('.sln'))) return 'dotnet test';
  if (fs.existsSync(path.join(root, 'Makefile')))           return 'make test';
  return '<fill-in test runner>';
}

/** Derive coverage command from test runner */
export function detectCoverageCmd(runner) {
  if (runner.startsWith('pytest'))      return 'pytest --cov';
  if (runner.includes('jest'))          return 'npx jest --coverage';
  if (runner.includes('vitest'))        return 'npx vitest run --coverage';
  if (runner.startsWith('go test'))     return 'go test -cover ./...';
  if (runner.startsWith('cargo'))       return 'cargo tarpaulin';
  if (runner.startsWith('dotnet'))      return 'dotnet test /p:CollectCoverage=true';
  if (runner.startsWith('npm test'))    return 'npm test -- --coverage';
  return '<fill-in coverage command>';
}

/**
 * Scan for pre-existing AI artifacts to back up.
 * @param {string} root - consumer repo root
 * @param {string[]} platformRootFiles - root files the platform installs
 * @param {{file:string,label:string}[]} legacyRootFiles - legacy root-level AI configs
 * @param {{folder:string,ext:string,platformFiles:Set<string>,label:string}[]} fwRulePatterns
 */
export function scanPreExistingArtifacts(root, platformRootFiles, legacyRootFiles, fwRulePatterns) {
  const toBackup = [];
  const toNote   = [];

  platformRootFiles.forEach(f => {
    if (fs.existsSync(path.join(root, f))) toBackup.push({ file: f, label: f });
  });

  legacyRootFiles.forEach(({ file, label }) => {
    if (fs.existsSync(path.join(root, file))) {
      toBackup.push({ file, label });
      toNote.push({ file, label });
    }
  });

  fwRulePatterns.forEach(({ folder, ext, platformFiles, label }) => {
    const dir = path.join(root, folder);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter(f => f.endsWith(ext) && !platformFiles.has(f))
      .forEach(f => toBackup.push({ file: folder + '/' + f, label: label + ': ' + f }));
  });

  return { toBackup, toNote };
}
