import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const hooksConfigPath = path.join(repoRoot, 'hooks', 'hooks.json');

function readHooksConfig() {
  return JSON.parse(fs.readFileSync(hooksConfigPath, 'utf8'));
}

test('hooks.json exposes shell-specific SessionStart commands', () => {
  const config = readHooksConfig();
  const sessionStartHook = config.hooks?.SessionStart?.[0]?.hooks?.[0];

  assert.ok(sessionStartHook, 'expected SessionStart command hook');
  assert.equal(sessionStartHook.type, 'command');
  assert.equal(sessionStartHook.async, false);
  assert.equal(
    sessionStartHook.command,
    '"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd" session-start',
  );
  assert.equal(
    sessionStartHook.bash,
    'COPILOT_CLI=1 "${CLAUDE_PLUGIN_ROOT}/hooks/session-start"',
  );
  assert.equal(
    sessionStartHook.powershell,
    '& "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.ps1"',
  );
});

test('PowerShell SessionStart hook runs without a parse error on Windows', { skip: process.platform !== 'win32' }, () => {
  const config = readHooksConfig();
  const commandTemplate = config.hooks?.SessionStart?.[0]?.hooks?.[0]?.powershell;

  assert.ok(commandTemplate, 'expected PowerShell SessionStart hook command');

  const command = commandTemplate.replaceAll(
    '${CLAUDE_PLUGIN_ROOT}',
    repoRoot.replaceAll('\\', '\\\\'),
  );

  const result = spawnSync(
    'powershell',
    ['-NoProfile', '-Command', command],
    {
      cwd: repoRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        CLAUDE_PLUGIN_ROOT: repoRoot,
      },
    },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const output = JSON.parse(result.stdout);
  assert.match(output.additionalContext, /You have superpowers\./);
});
