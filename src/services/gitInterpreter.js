/**
 * Git Quest - Simulated Git Command Interpreter (Milestone 11)
 *
 * Parses user-entered command strings and delegates to the in-memory
 * repository state manager.  No real OS commands are executed.
 *
 * Supported commands:
 *   Shell utilities : pwd, ls, clear, help
 *   Repository      : git init
 *   Status          : git status
 *   Staging         : git add <file|.>
 *   Commits         : git commit -m "message"
 *   History         : git log [--oneline]
 *   Config          : git config [--global] <key> [<value>] | --list
 *   Remotes         : git remote add <name> <url> | -v
 *   Branches (M11)  : git branch [<name>] [-d <name>]
 *   Switch (M11)    : git switch <name> | git switch -c <name>
 *   Checkout (M11)  : git checkout <name> | git checkout -b <name>
 *   Merge (M11)     : git merge <name>
 */

import {
  getGitState,
  initRepository,
  stageFiles,
  createCommit,
  setGitConfig,
  getGitConfig,
  addRemote,
  getRemotes,
  listBranches,
  createBranch,
  deleteBranch,
  switchBranch,
  createAndSwitchBranch,
  mergeBranch,
} from './gitState';

// ---------------------------------------------------------------------------
// Tokeniser — splits on spaces but respects "quoted strings"
// ---------------------------------------------------------------------------

export function tokenizeCommandLine(cmdString) {
  const tokens = [];
  const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
  let match;
  while ((match = regex.exec(cmdString)) !== null) {
    if (match[1] !== undefined) {
      tokens.push(match[1]);
    } else if (match[2] !== undefined) {
      tokens.push(match[2]);
    } else {
      tokens.push(match[0]);
    }
  }
  return tokens;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Execute a simulated command line string and return structured output.
 *
 * Returns { type: 'success'|'error'|'warning'|'info'|'output'|'clear', output: string }
 */
export function executeGitCommand(rawCommandLine) {
  const trimmed = (rawCommandLine || '').trim();
  if (!trimmed) return { type: 'output', output: '' };

  const tokens = tokenizeCommandLine(trimmed);
  const primaryCommand = (tokens[0] || '').toLowerCase();

  // ── Shell utilities ────────────────────────────────────────────────────────

  if (primaryCommand === 'clear') {
    return { type: 'clear', output: '' };
  }

  if (primaryCommand === 'pwd') {
    return { type: 'output', output: '/home/developer/workspace/git-quest' };
  }

  if (primaryCommand === 'ls') {
    const state = getGitState();
    const items = [
      'assets', 'src', 'node_modules',
      ...state.workingDirectory,
      ...state.stagedFiles,
    ];
    if (state.isInitialized) items.unshift('.git');
    return { type: 'output', output: Array.from(new Set(items)).join('   ') };
  }

  if (primaryCommand === 'help') {
    return {
      type: 'info',
      output: [
        'Git Quest Simulator — Supported Commands (v11.0):',
        '',
        '  REPOSITORY',
        '    git init                        Initialize a local simulated repository',
        '    git status                      Show working tree status',
        '',
        '  STAGING & COMMITS',
        '    git add <file> | git add .      Stage files for the next commit',
        '    git commit -m "<message>"       Record staged changes as a commit',
        '    git log [--oneline]             Display commit history',
        '',
        '  BRANCHES',
        '    git branch                      List all branches',
        '    git branch <name>               Create a new branch',
        '    git branch -d <name>            Delete a branch',
        '    git switch <name>               Switch to a branch',
        '    git switch -c <name>            Create and switch to a new branch',
        '    git checkout <name>             Switch to a branch (classic syntax)',
        '    git checkout -b <name>          Create and switch to a new branch',
        '',
        '  MERGING',
        '    git merge <branch>              Merge a branch into the current branch',
        '',
        '  CONFIG & REMOTES',
        '    git config --global <k> <v>     Set a global config value',
        '    git config --list               List all config settings',
        '    git remote add <name> <url>     Add a remote',
        '    git remote -v                   List configured remotes',
        '',
        '  SHELL',
        '    pwd                             Print working directory',
        '    ls                              List directory contents',
        '    clear                           Clear terminal output',
      ].join('\n'),
    };
  }

  // ── Non-git command fallback ───────────────────────────────────────────────

  if (primaryCommand !== 'git') {
    return {
      type: 'error',
      output: `bash: ${tokens[0]}: command not found. Type 'help' for supported Git Quest commands.`,
    };
  }

  // ── Git subcommand dispatch ────────────────────────────────────────────────

  const subCommand = (tokens[1] || '').toLowerCase();

  if (!subCommand || subCommand === '--help') {
    return {
      type: 'info',
      output: "usage: git [--version] [--help] <command> [<args>]\nType 'help' to see simulated commands.",
    };
  }

  if (subCommand === '--version' || subCommand === '-v') {
    return { type: 'success', output: 'git version 2.44.0.simulation.1' };
  }

  // ── 1. git init ────────────────────────────────────────────────────────────

  if (subCommand === 'init') {
    const result = initRepository();
    if (result.wasInitialized) {
      return {
        type: 'output',
        output: 'Reinitialized existing Git repository in /home/developer/workspace/git-quest/.git/',
      };
    }
    return {
      type: 'success',
      output: `Initialized empty Git repository in /home/developer/workspace/git-quest/.git/\nhint: Using '${result.branch}' as the name for the initial branch.`,
    };
  }

  // All subsequent git commands require an initialized repo.
  const currentState = getGitState();
  if (!currentState.isInitialized) {
    return {
      type: 'error',
      output: "fatal: not a git repository (or any of the parent directories): .git\nRun 'git init' to create a new Git repository.",
    };
  }

  // ── 2. git status ──────────────────────────────────────────────────────────

  if (subCommand === 'status') {
    const state = getGitState();
    const lines = [`On branch ${state.currentBranch}`];

    const branchCommits = state.branches[state.currentBranch] || [];
    if (branchCommits.length === 0) {
      lines.push('No commits yet\n');
    }

    if (state.stagedFiles.length > 0) {
      lines.push('Changes to be committed:');
      lines.push('  (use "git restore --staged <file>..." to unstage)');
      state.stagedFiles.forEach((f) => lines.push(`\t\x1b[32mnew file:   ${f}\x1b[0m`));
      lines.push('');
    }

    if (state.modifiedFiles.length > 0) {
      lines.push('Changes not staged for commit:');
      state.modifiedFiles.forEach((f) => lines.push(`\tmodified:   ${f}`));
      lines.push('');
    }

    if (state.workingDirectory.length > 0) {
      lines.push('Untracked files:');
      lines.push('  (use "git add <file>..." to include in what will be committed)');
      state.workingDirectory.forEach((f) => lines.push(`\t\x1b[31m${f}\x1b[0m`));
      lines.push('');
      lines.push('nothing added to commit but untracked files present (use "git add" to track)');
    }

    if (
      state.stagedFiles.length === 0 &&
      state.workingDirectory.length === 0 &&
      state.modifiedFiles.length === 0
    ) {
      lines.push('nothing to commit, working tree clean');
    }

    return { type: 'output', output: lines.join('\n') };
  }

  // ── 3. git add ─────────────────────────────────────────────────────────────

  if (subCommand === 'add') {
    const target = tokens[2];
    if (!target) {
      return { type: 'error', output: "Nothing specified, nothing added.\nHint: Use 'git add <file>' or 'git add .'." };
    }

    const result = stageFiles(target);

    if (result.error === 'pathspec_not_found') {
      return {
        type: 'error',
        output: `error: pathspec '${result.target}' did not match any files.`,
      };
    }

    if (result.filesAdded && result.filesAdded.length === 0) {
      return { type: 'output', output: '' }; // Already staged — silent.
    }

    // git add is intentionally silent on success (like real git).
    return { type: 'output', output: '' };
  }

  // ── 4. git commit ──────────────────────────────────────────────────────────

  if (subCommand === 'commit') {
    const mFlagIdx = tokens.indexOf('-m');
    if (mFlagIdx === -1 || !tokens[mFlagIdx + 1]) {
      return {
        type: 'error',
        output: 'error: switch -m requires a value\nusage: git commit -m "<message>"',
      };
    }

    const message = tokens[mFlagIdx + 1];
    const result = createCommit(message);

    if (result.error === 'nothing_staged') {
      return {
        type: 'error',
        output: `On branch ${currentState.currentBranch}\nnothing to commit, working tree clean`,
      };
    }

    if (result.error === 'empty_message') {
      return { type: 'error', output: 'Aborting commit due to empty commit message.' };
    }

    const c = result.commit;
    const rootTag = c.isRoot ? '(root-commit) ' : '';
    return {
      type: 'success',
      output: `[${c.branch} ${rootTag}${c.shortSha}] ${c.message}\n ${result.committedCount} file${result.committedCount > 1 ? 's' : ''} changed, ${result.committedCount * 8} insertions(+)`,
    };
  }

  // ── 5. git log ─────────────────────────────────────────────────────────────

  if (subCommand === 'log') {
    const state = getGitState();
    const branchCommits = state.branches[state.currentBranch] || [];

    if (branchCommits.length === 0) {
      return {
        type: 'error',
        output: `fatal: your current branch '${state.currentBranch}' does not have any commits yet`,
      };
    }

    const isOneLine = tokens.includes('--oneline');

    if (isOneLine) {
      const lines = branchCommits.map((c, i) => {
        const headTag = i === 0 ? ` (HEAD -> ${c.branch})` : '';
        const mergeTag = c.isMergeCommit ? ' [merge]' : '';
        return `\x1b[33m${c.shortSha}\x1b[0m${headTag}${mergeTag} ${c.message}`;
      });
      return { type: 'output', output: lines.join('\n') };
    }

    const logBlocks = branchCommits.map((c, i) => {
      const headTag = i === 0 ? ` (HEAD -> ${c.branch})` : '';
      const mergeNote = c.isMergeCommit
        ? `\nMerge: ${(c.mergeParents || []).filter(Boolean).join(' ')}`
        : '';
      return [
        `commit ${c.fullSha}${headTag}${mergeNote}`,
        `Author: ${c.author}`,
        `Date:   ${c.date}`,
        '',
        `    ${c.message}`,
      ].join('\n');
    });

    return { type: 'output', output: logBlocks.join('\n\n') };
  }

  // ── 6. git config ──────────────────────────────────────────────────────────

  if (subCommand === 'config') {
    const isList = tokens.includes('--list') || tokens.includes('-l');
    if (isList) {
      const allConfig = getGitConfig();
      const lines = Object.entries(allConfig).map(([k, v]) => `${k}=${v}`);
      return { type: 'output', output: lines.join('\n') };
    }

    let filteredTokens = tokens.slice(2).filter(
      (t) => t !== '--global' && t !== '--local'
    );

    if (filteredTokens.length === 0) {
      return {
        type: 'info',
        output: "usage: git config [--global] <name> [<value>]\nOr: git config --list",
      };
    }

    const key = filteredTokens[0];
    const value = filteredTokens[1];

    if (value !== undefined) {
      setGitConfig(key, value);
      return { type: 'success', output: `# Configured ${key} = "${value}"` };
    }

    const val = getGitConfig(key);
    if (val !== null) return { type: 'output', output: val };

    return {
      type: 'error',
      output: `error: key does not contain a section: ${key}`,
    };
  }

  // ── 7. git remote ──────────────────────────────────────────────────────────

  if (subCommand === 'remote') {
    const action = (tokens[2] || '').toLowerCase();

    if (!action) {
      const remotes = getRemotes();
      return { type: 'output', output: Object.keys(remotes).join('\n') };
    }

    if (action === '-v' || action === '--verbose') {
      const remotes = getRemotes();
      const entries = Object.entries(remotes);
      if (entries.length === 0) return { type: 'output', output: '' };
      const lines = [];
      entries.forEach(([name, url]) => {
        lines.push(`${name}\t${url} (fetch)`);
        lines.push(`${name}\t${url} (push)`);
      });
      return { type: 'output', output: lines.join('\n') };
    }

    if (action === 'add') {
      const remoteName = tokens[3];
      const remoteUrl = tokens[4];
      if (!remoteName || !remoteUrl) {
        return { type: 'error', output: 'usage: git remote add <name> <url>' };
      }
      const result = addRemote(remoteName, remoteUrl);
      if (result.error === 'remote_exists') {
        return { type: 'error', output: `error: remote ${remoteName} already exists.` };
      }
      return { type: 'success', output: `Added remote '${remoteName}' -> ${remoteUrl}` };
    }

    return {
      type: 'error',
      output: `error: Unknown subcommand: ${action}\nusage: git remote [-v | add <name> <url>]`,
    };
  }

  // ── 8. git branch (Milestone 11) ───────────────────────────────────────────

  if (subCommand === 'branch') {
    // git branch -d <name>  — delete
    if (tokens[2] === '-d' || tokens[2] === '-D') {
      const targetName = tokens[3];
      if (!targetName) {
        return { type: 'error', output: 'error: branch name required\nusage: git branch -d <name>' };
      }
      const result = deleteBranch(targetName);
      if (result.error === 'not_found') {
        return { type: 'error', output: `error: branch '${targetName}' not found.` };
      }
      if (result.error === 'delete_current') {
        return {
          type: 'error',
          output: `error: Cannot delete the branch '${targetName}' which you are currently on.`,
        };
      }
      return { type: 'success', output: `Deleted branch ${targetName}.` };
    }

    // git branch <name>  — create
    if (tokens[2] && !tokens[2].startsWith('-')) {
      const newName = tokens[2];
      const result = createBranch(newName);
      if (result.error === 'already_exists') {
        return { type: 'error', output: `fatal: A branch named '${newName}' already exists.` };
      }
      if (result.error === 'invalid_name') {
        return { type: 'error', output: `fatal: Invalid branch name: '${newName}'.` };
      }
      return { type: 'success', output: `Branch '${newName}' created from '${result.fromBranch}'.` };
    }

    // git branch  — list
    const result = listBranches();
    if (result.error) {
      return { type: 'error', output: 'fatal: Not a git repository.' };
    }
    if (result.branches.length === 0) {
      return {
        type: 'output',
        output: '(no branches yet — make at least one commit first)',
      };
    }
    const lines = result.branches.map((b) =>
      b === result.current ? `* \x1b[32m${b}\x1b[0m` : `  ${b}`
    );
    return { type: 'output', output: lines.join('\n') };
  }

  // ── 9. git switch (Milestone 11) ───────────────────────────────────────────

  if (subCommand === 'switch') {
    const flag = tokens[2];

    // git switch -c <name>  — create and switch
    if (flag === '-c' || flag === '-C') {
      const newName = tokens[3];
      if (!newName) {
        return { type: 'error', output: 'error: switch -c requires a branch name\nusage: git switch -c <name>' };
      }
      const result = createAndSwitchBranch(newName);
      if (result.error === 'already_exists') {
        return { type: 'error', output: `fatal: A branch named '${newName}' already exists.` };
      }
      return { type: 'success', output: `Switched to a new branch '${newName}'` };
    }

    // git switch <name>  — switch to existing
    const targetName = tokens[2];
    if (!targetName) {
      return { type: 'error', output: 'error: branch name required\nusage: git switch <name>' };
    }
    const result = switchBranch(targetName);
    if (result.error === 'not_found') {
      return {
        type: 'error',
        output: `error: pathspec '${targetName}' did not match any branch.\nHint: Create it first with 'git branch ${targetName}' or 'git switch -c ${targetName}'.`,
      };
    }
    if (result.error === 'already_on') {
      return { type: 'output', output: `Already on '${targetName}'` };
    }
    return { type: 'success', output: `Switched to branch '${targetName}'` };
  }

  // ── 10. git checkout (Milestone 11) ────────────────────────────────────────

  if (subCommand === 'checkout') {
    const flag = tokens[2];

    // git checkout -b <name>  — create and switch
    if (flag === '-b' || flag === '-B') {
      const newName = tokens[3];
      if (!newName) {
        return { type: 'error', output: 'error: switch -b requires a branch name\nusage: git checkout -b <name>' };
      }
      const result = createAndSwitchBranch(newName);
      if (result.error === 'already_exists') {
        return { type: 'error', output: `fatal: A branch named '${newName}' already exists.` };
      }
      return { type: 'success', output: `Switched to a new branch '${newName}'` };
    }

    // git checkout <name>  — switch
    const targetName = tokens[2];
    if (!targetName) {
      return { type: 'error', output: 'error: branch name required\nusage: git checkout <name>' };
    }
    const result = switchBranch(targetName);
    if (result.error === 'not_found') {
      return {
        type: 'error',
        output: `error: pathspec '${targetName}' did not match any branch.\nHint: Create it with 'git checkout -b ${targetName}'.`,
      };
    }
    if (result.error === 'already_on') {
      return { type: 'output', output: `Already on '${targetName}'` };
    }
    return { type: 'success', output: `Switched to branch '${targetName}'` };
  }

  // ── 11. git merge (Milestone 11) ───────────────────────────────────────────

  if (subCommand === 'merge') {
    const sourceName = tokens[2];
    if (!sourceName) {
      return { type: 'error', output: 'error: branch name required\nusage: git merge <branch>' };
    }

    const state = getGitState();
    const result = mergeBranch(sourceName);

    if (result.error === 'not_found') {
      return { type: 'error', output: `merge: ${sourceName} - not something we can merge\nDid you create that branch first?` };
    }
    if (result.error === 'merge_self') {
      return { type: 'output', output: `Already up to date.` };
    }
    if (result.error === 'nothing_to_merge') {
      return { type: 'output', output: `Already up to date. (source branch '${sourceName}' has no commits)` };
    }

    if (result.type === 'fast_forward') {
      return {
        type: 'success',
        output: [
          `Updating ${result.fromSha || 'initial'} -> ${result.toSha}`,
          'Fast-forward',
          ` ${result.toMessage}`,
        ].join('\n'),
      };
    }

    if (result.type === 'conflict') {
      return {
        type: 'error',
        output: [
          `Auto-merging ${result.conflictFiles.join(', ')}`,
          `CONFLICT (content): Merge conflict in ${result.conflictFiles.join(', ')}`,
          `Automatic merge failed; fix conflicts and then commit the result.`,
          '',
          `NOTE: Conflict resolution is not yet simulated.`,
          `Tip: In a real repo, open the conflicting files and look for <<<<<<<, =======, >>>>>>> markers.`,
        ].join('\n'),
      };
    }

    if (result.type === 'three_way') {
      const c = result.commit;
      return {
        type: 'success',
        output: [
          `Merge made by the 'ort' strategy.`,
          ` ${result.filesChanged} file${result.filesChanged > 1 ? 's' : ''} changed`,
          `[${state.currentBranch} ${c.shortSha}] ${c.message}`,
        ].join('\n'),
      };
    }

    return { type: 'error', output: 'error: Merge failed for an unknown reason.' };
  }

  // ── Unrecognised git subcommand ─────────────────────────────────────────────

  return {
    type: 'warning',
    output: [
      `git: '${subCommand}' is not a supported simulation command.`,
      `Type 'help' to see the complete list of supported commands.`,
    ].join('\n'),
  };
}
