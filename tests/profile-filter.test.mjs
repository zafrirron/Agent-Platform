/**
 * Unit tests for install profile filtering.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  shouldInstallEntry,
  resolveTemplate,
  parseAddTokens,
  expandAddTokens,
} from '../AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/profile-filter.mjs';

const pb = (name) => ({ path: `.agent/playbooks/${name}.md`, template: `.agent/playbooks/${name}.md`, kind: 'playbook' });
const skill = (id) => ({ path: `.agent/skills/${id}/SKILL.md`, template: `.agent/skills/${id}/SKILL.md`, kind: 'skill' });
const cmd = (fw, name) => ({ path: `.${fw}/commands/${name}.md`, template: `.${fw}/commands/${name}.md`, kind: 'command' });

describe('shouldInstallEntry — lite profile', () => {
  test('includes core playbooks', () => {
    assert.ok(shouldInstallEntry(pb('add-feature'), { profile: 'lite' }));
    assert.ok(shouldInstallEntry(pb('bug-fix'), { profile: 'lite' }));
  });

  test('excludes enterprise playbooks', () => {
    assert.ok(!shouldInstallEntry(pb('compliance-review'), { profile: 'lite' }));
    assert.ok(!shouldInstallEntry(pb('nfr-definition'), { profile: 'lite' }));
  });

  test('excludes expert agents', () => {
    assert.ok(!shouldInstallEntry({
      path: '.agent/agents/backend-agent.md',
      template: '.agent/agents/backend-agent.md',
      kind: 'template',
    }, { profile: 'lite' }));
  });

  test('includes skills and commands', () => {
    assert.ok(shouldInstallEntry(skill('interview-me'), { profile: 'lite' }));
    assert.ok(shouldInstallEntry(cmd('claude', 'plan'), { profile: 'lite' }));
  });

  test('framework filter limits IDE folders', () => {
    assert.ok(shouldInstallEntry(cmd('cursor', 'build'), { profile: 'lite', framework: 'cursor' }));
    assert.ok(!shouldInstallEntry(cmd('claude', 'build'), { profile: 'lite', framework: 'cursor' }));
    assert.ok(shouldInstallEntry(skill('interview-me'), { profile: 'lite', framework: 'cursor' }));
  });
});

describe('shouldInstallEntry — core profile', () => {
  test('excludes enterprise only', () => {
    assert.ok(shouldInstallEntry(pb('audit'), { profile: 'core' }));
    assert.ok(!shouldInstallEntry(pb('org-maturity-assessment'), { profile: 'core' }));
  });
});

describe('resolveTemplate — lite aliases', () => {
  test('maps AGENTS and session-start to lite templates', () => {
    assert.equal(resolveTemplate({ path: 'AGENTS.md', template: 'AGENTS.md' }, 'lite'), 'AGENTS-lite.md');
    assert.equal(resolveTemplate({ path: '.agent/session-start.md', template: '.agent/session-start.md' }, 'lite'), '.agent/session-start-lite.md');
  });

  test('full profile keeps original templates', () => {
    assert.equal(resolveTemplate({ path: 'AGENTS.md', template: 'AGENTS.md' }, 'full'), 'AGENTS.md');
  });
});

describe('parseAddTokens and expandAddTokens', () => {
  test('aliases tdd to test-driven-development', () => {
    const t = parseAddTokens(['skill:tdd']);
    assert.ok(t.has('skill:test-driven-development'));
  });

  test('expandAddTokens adds command deps', () => {
    const t = expandAddTokens(['skill:interview-me']);
    assert.ok(t.has('skill:interview-me'));
    assert.ok(t.has('command:spec'));
  });
});
