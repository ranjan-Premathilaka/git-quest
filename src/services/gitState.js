/**
 * Git Quest - Simulated Repository State Manager
 * 
 * Manages an in-memory Git repository state:
 * - Initialization flag (.git existence)
 * - Working directory files (untracked)
 * - Staging area (index)
 * - Commits log
 * - Git configuration (user.name, user.email)
 * - Remotes registry
 */

const createInitialState = () => ({
  isInitialized: false,
  currentBranch: 'main',
  workingDirectory: ['README.md', 'index.js', 'package.json'],
  stagedFiles: [],
  modifiedFiles: [],
  commits: [],
  config: {
    'user.name': 'Alex Developer',
    'user.email': 'alex@gitquest.local',
    'init.defaultbranch': 'main',
  },
  remotes: {},
});

let repoState = createInitialState();

export function getGitState() {
  return { ...repoState };
}

export function resetGitState() {
  repoState = createInitialState();
  return { ...repoState };
}

export function initRepository() {
  const wasInitialized = repoState.isInitialized;
  repoState.isInitialized = true;
  repoState.currentBranch = repoState.config['init.defaultbranch'] || 'main';
  return {
    wasInitialized,
    branch: repoState.currentBranch,
  };
}

export function stageFiles(target) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };

  if (!target) return { error: 'no_pathspec' };

  if (target === '.' || target === '-A' || target === '--all') {
    const newlyStaged = [...repoState.workingDirectory];
    repoState.stagedFiles = Array.from(new Set([...repoState.stagedFiles, ...repoState.workingDirectory]));
    repoState.workingDirectory = [];
    return { success: true, filesAdded: newlyStaged };
  }

  // Stage specific file
  if (repoState.workingDirectory.includes(target)) {
    repoState.workingDirectory = repoState.workingDirectory.filter((f) => f !== target);
    if (!repoState.stagedFiles.includes(target)) {
      repoState.stagedFiles.push(target);
    }
    return { success: true, filesAdded: [target] };
  }

  if (repoState.stagedFiles.includes(target)) {
    return { success: true, filesAdded: [] };
  }

  return { error: 'pathspec_not_found', target };
}

export function createCommit(message) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!message || message.trim() === '') return { error: 'empty_message' };
  if (repoState.stagedFiles.length === 0) return { error: 'nothing_staged' };

  // Generate short and full SHA-1 hashes
  const shortSha = Math.random().toString(16).substring(2, 9);
  const fullSha = shortSha + Math.random().toString(16).substring(2, 10) +
    Math.random().toString(16).substring(2, 10) +
    Math.random().toString(16).substring(2, 10) +
    Math.random().toString(16).substring(2, 9);

  const author = `${repoState.config['user.name']} <${repoState.config['user.email']}>`;
  const isRootCommit = repoState.commits.length === 0;

  const newCommit = {
    shortSha,
    fullSha,
    message: message.trim(),
    author,
    date: new Date().toUTCString(),
    files: [...repoState.stagedFiles],
    branch: repoState.currentBranch,
    isRoot: isRootCommit,
  };

  repoState.commits.unshift(newCommit);
  const committedCount = repoState.stagedFiles.length;
  repoState.stagedFiles = [];

  return {
    success: true,
    commit: newCommit,
    committedCount,
  };
}

export function setGitConfig(key, value) {
  repoState.config[key.toLowerCase()] = value;
  return { key: key.toLowerCase(), value };
}

export function getGitConfig(key) {
  if (key) {
    return repoState.config[key.toLowerCase()] || null;
  }
  return { ...repoState.config };
}

export function addRemote(name, url) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!name || !url) return { error: 'invalid_arguments' };

  if (repoState.remotes[name]) {
    return { error: 'remote_exists', name };
  }

  repoState.remotes[name] = url;
  return { success: true, name, url };
}

export function getRemotes() {
  return { ...repoState.remotes };
}
