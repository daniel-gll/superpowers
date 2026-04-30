# Superpowers Fork Guide

This repository is a fork of https://github.com/obra/superpowers. The fork is meant to be your tailored copy of Superpowers, with `origin` pointing at your fork and `upstream` pointing at the original project.

## What you need to fork

Fork only `obra/superpowers`.

You do not need a separate marketplace fork for normal customisation work. This repository already contains the plugin manifests and the Claude marketplace wrapper it needs.

## Set it up

1. Fork `https://github.com/obra/superpowers` on GitHub.
2. Clone your fork locally.
3. Add the original repo as `upstream`.
4. Check that both remotes are correct.

```powershell
Set-Location C:\dev
git clone https://github.com/daniel-gll/superpowers.git
Set-Location superpowers
git remote add upstream https://github.com/obra/superpowers.git
git remote -v
```

You should see:

```text
origin    https://github.com/daniel-gll/superpowers.git (fetch)
origin    https://github.com/daniel-gll/superpowers.git (push)
upstream  https://github.com/obra/superpowers.git (fetch)
upstream  https://github.com/obra/superpowers.git (push)
```

## How this fork works

- `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, and `.codex-plugin/plugin.json` point at your fork.
- `.claude-plugin/marketplace.json` is a local marketplace wrapper for this repo.
- The actual skills, agents, commands, and hooks live in this repository, so your fork is the source of truth.

If you rename the repo or move it to another account, update the repo URLs in the plugin manifests to match.

## Using the fork

- Claude Code uses the Claude plugin manifest and marketplace wrapper in `.claude-plugin/`.
- OpenAI Codex uses the manifest in `.codex-plugin/plugin.json`.
- Cursor uses the manifest in `.cursor-plugin/plugin.json`.
- If you are unsure which install path to follow for a client, use the matching section in [README.md](README.md).

## Keeping up with upstream

Use `upstream` when you want to pull in changes from the original project.

```powershell
git fetch upstream
git log upstream/main --oneline --not main
git diff main upstream/main -- skills/systematic-debugging/SKILL.md
```

Cherry-pick the commits or file changes you want. Merge `upstream/main` only when you want everything.

## Working on your fork

Make your custom changes in normal branches, commit them to your fork, and keep the upstream remote around for future updates.

For platform-specific installation details, use the main [README.md](README.md).