import {
  getGitState,
  initRepository,
  stageFiles,
  createCommit,
  setGitConfig,
  getGitConfig,
  addRemote,
  getRemotes,
} from './gitState';

/**
 * Tokenize a command line string into words, respecting single and double quotes.
 */
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

/**
 * Execute a simulated command line string and return structured output.
 * 
 * Returns {
 *   type: 'success' | 'error' | 'warning' | 'info' | 'output' | 'clear',
 *   output: string
 * }
 */
export function executeGitCommand(rawCommandLine) {
  const trimmed = (rawCommandLine || '').trim();
  if (!trimmed) {
    return { type: 'output', output: '' };
  }

  const tokens = tokenizeCommandLine(trimmed);
  const primaryCommand = (tokens[0] || '').toLowerCase();

  // Handle shell utility commands
  if (primaryCommand === 'clear') {
    return { type: 'clear', output: '' };
  }

  if (primaryCommand === 'pwd') {
    return {
      type: 'output',
      output: '/home/developer/workspace/git-quest',
    };
  }

  if (primaryCommand === 'ls') {
    const state = getGitState();
    const items = ['assets', 'src', 'node_modules', ...state.workingDirectory, ...state.stagedFiles];
    if (state.isInitialized) items.unshift('.git');
    const unique = Array.from(new Set(items));
    return {
      type: 'output',
      output: unique.join('   '),
    };
  }

  if (primaryCommand === 'help') {
    return {
      type: 'info',
      output: [
        'Git Quest Simulator Commands (Milestone 10):',
        '  git init                      - Initialize a local simulated Git repository',
        '  git status                    - Check status of working tree and staging area',
        '  git add <file> | git add .    - Stage file(s) for the next commit',
        '  git commit -m "<message>"     - Record staged changes to the repository history',
        '  git log [--oneline]           - Display commit history',
        '  git config --global <k> <v>   - Set global developer settings (user.name, user.email)',
        '  git config --list             - List all current configurations',
        '  git remote add <name> <url>   - Add a remote tracking repository URL',
        '  git remote -v                 - Display configured remote URLs',
        '  pwd                           - Print working directory',
        '  ls                            - List directory files',
        '  clear                         - Clear terminal output',
      ].join('\n'),
    };
  }

  // Handle non-git command error
  if (primaryCommand !== 'git') {
    return {
      type: 'error',
      output: `bash: ${tokens[0]}: command not found. Type 'help' for supported Git Quest commands.`,
    };
  }

  // Handle bare `git` or `git --version` / `git --help`
  const subCommand = (tokens[1] || '').toLowerCase();

  if (!subCommand || subCommand === '--help') {
    return {
      type: 'info',
      output: 'usage: git [--version] [--help] <command> [<args>]\nType \'help\' to see the list of simulated commands.',
    };
  }

  if (subCommand === '--version' || subCommand === '-v') {
    return {
      type: 'success',
      output: 'git version 2.44.0.simulation.1',
    };
  }

  // 1. REPOSITORY COMMAND: git init
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
      output: `Initialized empty Git repository in /home/developer/workspace/git-quest/.git/ (default branch: ${result.branch})`,
    };
  }

  // All subsequent Git subcommands require an initialized repository
  const currentState = getGitState();
  if (!currentState.isInitialized) {
    return {
      type: 'error',
      output: 'fatal: not a git repository (or any of the parent directories): .git\nRun \'git init\' to create a new Git repository.',
    };
  }

  // 2. REPOSITORY STATUS: git status
  if (subCommand === 'status') {
    const outputLines = [`On branch ${currentState.currentBranch}`];

    if (currentState.commits.length === 0) {
      outputLines.push('No commits yet\n');
    }

    if (currentState.stagedFiles.length > 0) {
      outputLines.push('Changes to be committed:');
      outputLines.push('  (use "git restore --staged <file>..." to unstage)');
      currentState.stagedFiles.forEach((file) => {
        outputLines.push(`\tnew file:   ${file}`);
      });
      outputLines.push('');
    }

    if (currentState.modifiedFiles.length > 0) {
      outputLines.push('Changes not staged for commit:');
      outputLines.push('  (use "git add <file>..." to update what will be committed)');
      currentState.modifiedFiles.forEach((file) => {
        outputLines.push(`\tmodified:   ${file}`);
      });
      outputLines.push('');
    }

    if (currentState.workingDirectory.length > 0) {
      outputLines.push('Untracked files:');
      outputLines.push('  (use "git add <file>..." to include in what will be committed)');
      currentState.workingDirectory.forEach((file) => {
        outputLines.push(`\t${file}`);
      });
      outputLines.push('');
    }

    if (
      currentState.stagedFiles.length === 0 &&
      currentState.modifiedFiles.length === 0 &&
      currentState.workingDirectory.length === 0
    ) {
      outputLines.push('nothing to commit, working tree clean');
    } else if (
      currentState.stagedFiles.length === 0 &&
      currentState.workingDirectory.length > 0
    ) {
      outputLines.push('nothing added to commit but untracked files present (use "git add" to track)');
    }

    return {
      type: currentState.stagedFiles.length > 0 ? 'success' : 'output',
      output: outputLines.join('\n'),
    };
  }

  // 3. STAGING COMMAND: git add <pathspec>
  if (subCommand === 'add') {
    const pathspec = tokens[2];
    if (!pathspec) {
      return {
        type: 'error',
        output: 'fatal: No pathspec was given. Which files should I add?\nTry: \'git add .\' or \'git add <filename>\'',
      };
    }

    const result = stageFiles(pathspec);
    if (result.error === 'pathspec_not_found') {
      return {
        type: 'error',
        output: `fatal: pathspec '${pathspec}' did not match any files`,
      };
    }

    return {
      type: 'output',
      output: '', // Git is intentionally silent on successful stage
    };
  }

  // 4. COMMIT COMMAND: git commit -m "message"
  if (subCommand === 'commit') {
    const flagIdx = tokens.findIndex((t) => t === '-m' || t === '--message');

    if (flagIdx === -1) {
      return {
        type: 'error',
        output: 'error: no commit message provided. Use: git commit -m "<message>"',
      };
    }

    const message = tokens[flagIdx + 1];
    if (!message || message.trim() === '') {
      return {
        type: 'error',
        output: 'error: switch \'m\' requires a value\nAborting commit due to empty commit message.',
      };
    }

    const result = createCommit(message);
    if (result.error === 'nothing_staged') {
      if (currentState.workingDirectory.length > 0) {
        return {
          type: 'warning',
          output: `On branch ${currentState.currentBranch}\nUntracked files not added to commit (use "git add" to track)\nno changes added to commit`,
        };
      }
      return {
        type: 'output',
        output: `On branch ${currentState.currentBranch}\nnothing to commit, working tree clean`,
      };
    }

    const c = result.commit;
    const rootTag = c.isRoot ? '(root-commit) ' : '';
    return {
      type: 'success',
      output: `[${c.branch} ${rootTag}${c.shortSha}] ${c.message}\n ${result.committedCount} file${result.committedCount > 1 ? 's' : ''} changed, ${result.committedCount * 8} insertions(+)`,
    };
  }

  // 5. COMMIT LOG: git log
  if (subCommand === 'log') {
    if (currentState.commits.length === 0) {
      return {
        type: 'error',
        output: `fatal: your current branch '${currentState.currentBranch}' does not have any commits yet`,
      };
    }

    const isOneLine = tokens.includes('--oneline');

    if (isOneLine) {
      const lines = currentState.commits.map((c, i) => {
        const headTag = i === 0 ? ` (HEAD -> ${c.branch})` : '';
        return `${c.shortSha}${headTag} ${c.message}`;
      });
      return {
        type: 'output',
        output: lines.join('\n'),
      };
    }

    const logBlocks = currentState.commits.map((c, i) => {
      const headTag = i === 0 ? ` (HEAD -> ${c.branch})` : '';
      return [
        `commit ${c.fullSha}${headTag}`,
        `Author: ${c.author}`,
        `Date:   ${c.date}`,
        '',
        `    ${c.message}`,
      ].join('\n');
    });

    return {
      type: 'output',
      output: logBlocks.join('\n\n'),
    };
  }

  // 6. CONFIGURATION COMMAND: git config
  if (subCommand === 'config') {
    const isList = tokens.includes('--list') || tokens.includes('-l');
    if (isList) {
      const allConfig = getGitConfig();
      const lines = Object.entries(allConfig).map(([k, v]) => `${k}=${v}`);
      return {
        type: 'output',
        output: lines.join('\n'),
      };
    }

    // git config [--global] <key> [<value>]
    let filteredTokens = tokens.slice(2).filter((t) => t !== '--global' && t !== '--local');

    if (filteredTokens.length === 0) {
      return {
        type: 'info',
        output: 'usage: git config [--global] <name> [<value>]\nOr run \'git config --list\' to view all settings.',
      };
    }

    const key = filteredTokens[0];
    const value = filteredTokens[1];

    if (value !== undefined) {
      setGitConfig(key, value);
      return {
        type: 'success',
        output: `# Configured ${key} = "${value}"`,
      };
    }

    // Read single config value
    const val = getGitConfig(key);
    if (val !== null) {
      return {
        type: 'output',
        output: val,
      };
    }

    return {
      type: 'error',
      output: `error: key does not contain a section: ${key}`,
    };
  }

  // 7. REMOTE COMMAND: git remote
  if (subCommand === 'remote') {
    const action = (tokens[2] || '').toLowerCase();

    if (!action) {
      const remotes = getRemotes();
      const names = Object.keys(remotes);
      return {
        type: 'output',
        output: names.join('\n'),
      };
    }

    if (action === '-v' || action === '--verbose') {
      const remotes = getRemotes();
      const entries = Object.entries(remotes);
      if (entries.length === 0) {
        return { type: 'output', output: '' };
      }
      const lines = [];
      entries.forEach(([name, url]) => {
        lines.push(`${name}\t${url} (fetch)`);
        lines.push(`${name}\t${url} (push)`);
      });
      return {
        type: 'output',
        output: lines.join('\n'),
      };
    }

    if (action === 'add') {
      const remoteName = tokens[3];
      const remoteUrl = tokens[4];

      if (!remoteName || !remoteUrl) {
        return {
          type: 'error',
          output: 'usage: git remote add <name> <url>',
        };
      }

      const result = addRemote(remoteName, remoteUrl);
      if (result.error === 'remote_exists') {
        return {
          type: 'error',
          output: `error: remote ${remoteName} already exists.`,
        };
      }

      return {
        type: 'success',
        output: `Added remote repository origin -> ${remoteUrl}`,
      };
    }

    return {
      type: 'error',
      output: `error: Unknown subcommand: ${action}\nusage: git remote [-v | --verbose] | add <name> <url>`,
    };
  }

  // Fallback for future commands (branch, checkout, merge, push, pull)
  return {
    type: 'warning',
    output: [
      `git: '${subCommand}' is recognized but not active in this simulation milestone.`,
      `Supported in Milestone 10: init, status, add, commit, log, config, remote.`,
      `Branching and merging workflows will be unlocked in Milestone 11!`,
    ].join('\n'),
  };
}
