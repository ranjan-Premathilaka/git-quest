/**
 * Git Quest - Simulated Repository State Manager (Milestone 11)
 *
 * Manages an in-memory Git repository state:
 *  - Initialization flag (.git existence)
 *  - Working directory files (untracked)
 *  - Staging area (index)
 *  - Commits log per branch
 *  - Branch registry
 *  - Current branch HEAD
 *  - Git configuration (user.name, user.email)
 *  - Remotes registry
 *
 * All operations are purely in-memory JavaScript — no real OS calls.
 */

// ---------------------------------------------------------------------------
// SHA helpers
// ---------------------------------------------------------------------------

function generateSha() {
  const hex = () => Math.random().toString(16).substring(2, 10);
  const full = hex() + hex() + hex() + hex() + hex().substring(0, 4);
  return { shortSha: full.substring(0, 7), fullSha: full };
}

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

const createInitialState = () => ({
  isInitialized: false,

  /** Name of the currently checked-out branch. */
  currentBranch: 'main',

  /**
   * Branch registry.
   * Each key is a branch name; value is an array of commit objects in
   * reverse-chronological order (newest first), just like `git log`.
   *
   * Shape:  { [branchName]: CommitObject[] }
   */
  branches: {},

  /**
   * Working directory — untracked / modified files visible to `git status`.
   * Starts with a few sample files so the sandbox has something to stage.
   */
  workingDirectory: ['README.md', 'index.js', 'package.json'],

  /** Files in the staging area (index), ready for the next commit. */
  stagedFiles: [],

  /** Files reported as "modified" (shown by git status but not staged). */
  modifiedFiles: [],

  /** Global git configuration key/value store. */
  config: {
    'user.name': 'Alex Developer',
    'user.email': 'alex@gitquest.local',
    'init.defaultbranch': 'main',
  },

  /** Remote tracking entries: { name: url } */
  remotes: {},
});

// ---------------------------------------------------------------------------
// Singleton mutable state
// ---------------------------------------------------------------------------

let repoState = createInitialState();

// ---------------------------------------------------------------------------
// Public getters
// ---------------------------------------------------------------------------

export function getGitState() {
  return { ...repoState };
}

export function resetGitState() {
  repoState = createInitialState();
  return { ...repoState };
}

// ---------------------------------------------------------------------------
// 1. Repository initialization
// ---------------------------------------------------------------------------

export function initRepository() {
  const wasInitialized = repoState.isInitialized;
  const defaultBranch = repoState.config['init.defaultbranch'] || 'main';

  repoState.isInitialized = true;
  repoState.currentBranch = defaultBranch;

  // Create the default branch entry in the registry if it doesn't exist yet.
  if (!repoState.branches[defaultBranch]) {
    repoState.branches[defaultBranch] = [];
  }

  return { wasInitialized, branch: defaultBranch };
}

// ---------------------------------------------------------------------------
// 2. Staging area
// ---------------------------------------------------------------------------

export function stageFiles(target) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!target) return { error: 'no_pathspec' };

  if (target === '.' || target === '-A' || target === '--all') {
    const newlyStaged = [...repoState.workingDirectory];
    repoState.stagedFiles = Array.from(
      new Set([...repoState.stagedFiles, ...repoState.workingDirectory])
    );
    repoState.workingDirectory = [];
    return { success: true, filesAdded: newlyStaged };
  }

  // Stage specific file
  if (repoState.workingDirectory.includes(target)) {
    repoState.workingDirectory = repoState.workingDirectory.filter(
      (f) => f !== target
    );
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

// ---------------------------------------------------------------------------
// 3. Commits
// ---------------------------------------------------------------------------

export function createCommit(message) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!message || message.trim() === '') return { error: 'empty_message' };
  if (repoState.stagedFiles.length === 0) return { error: 'nothing_staged' };

  const { shortSha, fullSha } = generateSha();
  const author = `${repoState.config['user.name']} <${repoState.config['user.email']}>`;
  const branch = repoState.currentBranch;
  const branchCommits = repoState.branches[branch] || [];
  const isRootCommit = branchCommits.length === 0 &&
    Object.values(repoState.branches).every((c) => c.length === 0);

  // Determine parent SHA
  const parentSha = branchCommits.length > 0 ? branchCommits[0].shortSha : null;

  const newCommit = {
    shortSha,
    fullSha,
    message: message.trim(),
    author,
    date: new Date().toUTCString(),
    files: [...repoState.stagedFiles],
    branch,
    isRoot: isRootCommit,
    parentSha,
  };

  // Prepend to branch commit list (newest first).
  repoState.branches[branch] = [newCommit, ...branchCommits];

  const committedCount = repoState.stagedFiles.length;
  repoState.stagedFiles = [];

  // After a commit, simulate some modified files appearing for realism.
  if (repoState.workingDirectory.length === 0 && Math.random() > 0.5) {
    repoState.workingDirectory = ['app.js'];
  }

  return { success: true, commit: newCommit, committedCount };
}

// ---------------------------------------------------------------------------
// 4. Git config
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 5. Remotes
// ---------------------------------------------------------------------------

export function addRemote(name, url) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!name || !url) return { error: 'invalid_arguments' };
  if (repoState.remotes[name]) return { error: 'remote_exists', name };

  repoState.remotes[name] = url;
  return { success: true, name, url };
}

export function getRemotes() {
  return { ...repoState.remotes };
}

// ---------------------------------------------------------------------------
// 6. Branch management (Milestone 11)
// ---------------------------------------------------------------------------

/**
 * List all branches.
 * Returns { branches: string[], current: string }
 */
export function listBranches() {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  return {
    branches: Object.keys(repoState.branches),
    current: repoState.currentBranch,
  };
}

/**
 * Create a new branch from the current HEAD.
 * Does NOT switch to it.
 */
export function createBranch(name) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!name || name.trim() === '') return { error: 'invalid_name' };
  if (repoState.branches[name]) return { error: 'already_exists', name };

  // New branch starts with the same commits as the current branch (fork point).
  const currentCommits = repoState.branches[repoState.currentBranch] || [];
  repoState.branches[name] = [...currentCommits];

  return { success: true, name, fromBranch: repoState.currentBranch };
}

/**
 * Delete a branch.
 * Cannot delete the current branch.
 */
export function deleteBranch(name) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!repoState.branches[name]) return { error: 'not_found', name };
  if (name === repoState.currentBranch) return { error: 'delete_current' };

  delete repoState.branches[name];
  return { success: true, name };
}

/**
 * Switch to an existing branch.
 * Staged files carry over (simulating a clean working tree switch).
 */
export function switchBranch(name) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!repoState.branches[name]) return { error: 'not_found', name };
  if (name === repoState.currentBranch) return { error: 'already_on', name };

  repoState.currentBranch = name;
  return { success: true, name };
}

/**
 * Create a new branch and immediately switch to it.
 */
export function createAndSwitchBranch(name) {
  const created = createBranch(name);
  if (created.error) return created;
  return switchBranch(name);
}

// ---------------------------------------------------------------------------
// 7. Merge simulation (Milestone 11)
// ---------------------------------------------------------------------------

/**
 * Merge sourceBranch INTO the current branch.
 *
 * Strategy (simplified simulation):
 *  - If the current branch has no commits of its own beyond the fork point
 *    → fast-forward: current branch pointer moves to source tip.
 *  - If both branches have diverged
 *    → three-way merge: create a merge commit on the current branch.
 *  - Conflict detection: if any filename appears in both branch-only commit
 *    lists, we simulate a conflict.
 */
export function mergeBranch(sourceName) {
  if (!repoState.isInitialized) return { error: 'not_initialized' };
  if (!sourceName) return { error: 'no_branch_name' };
  if (!repoState.branches[sourceName]) return { error: 'not_found', name: sourceName };
  if (sourceName === repoState.currentBranch) return { error: 'merge_self' };

  const targetName = repoState.currentBranch;
  const targetCommits = repoState.branches[targetName] || [];
  const sourceCommits = repoState.branches[sourceName] || [];

  if (sourceCommits.length === 0) {
    return { error: 'nothing_to_merge', name: sourceName };
  }

  // Find the merge base: oldest SHA shared by both branches.
  const targetShas = new Set(targetCommits.map((c) => c.shortSha));
  const sourceShas = new Set(sourceCommits.map((c) => c.shortSha));

  // Commits exclusive to each branch (after the fork point).
  const targetOnly = targetCommits.filter((c) => !sourceShas.has(c.shortSha));
  const sourceOnly = sourceCommits.filter((c) => !targetShas.has(c.shortSha));

  // ---- Fast-forward ----
  if (targetOnly.length === 0) {
    // Current branch has no diverged commits — just move pointer forward.
    repoState.branches[targetName] = [...sourceCommits];
    const tip = sourceCommits[0];
    return {
      type: 'fast_forward',
      fromSha: targetCommits[0]?.shortSha || null,
      toSha: tip.shortSha,
      toMessage: tip.message,
    };
  }

  // ---- Conflict detection (simple file-overlap heuristic) ----
  const targetFiles = new Set(targetOnly.flatMap((c) => c.files || []));
  const sourceFiles = new Set(sourceOnly.flatMap((c) => c.files || []));
  const conflicts = [...targetFiles].filter((f) => sourceFiles.has(f));

  if (conflicts.length > 0) {
    // Simulate conflict — do NOT modify state; user must resolve.
    return {
      type: 'conflict',
      conflictFiles: conflicts,
      sourceBranch: sourceName,
      targetBranch: targetName,
    };
  }

  // ---- Three-way merge commit ----
  const { shortSha, fullSha } = generateSha();
  const author = `${repoState.config['user.name']} <${repoState.config['user.email']}>`;
  const mergedFiles = [...new Set([...targetFiles, ...sourceFiles])];

  const mergeCommit = {
    shortSha,
    fullSha,
    message: `Merge branch '${sourceName}' into ${targetName}`,
    author,
    date: new Date().toUTCString(),
    files: mergedFiles,
    branch: targetName,
    isRoot: false,
    isMergeCommit: true,
    mergeParents: [
      targetCommits[0]?.shortSha || null,
      sourceCommits[0]?.shortSha || null,
    ],
    parentSha: targetCommits[0]?.shortSha || null,
  };

  repoState.branches[targetName] = [mergeCommit, ...targetCommits, ...sourceOnly];

  return {
    type: 'three_way',
    commit: mergeCommit,
    filesChanged: mergedFiles.length,
  };
}

// ---------------------------------------------------------------------------
// 8. Graph data helper (used by BranchGraph component)
// ---------------------------------------------------------------------------

/**
 * Returns a flat list of commit nodes enriched with display metadata,
 * ordered newest → oldest, deduplicated by SHA.
 *
 * Each node: { shortSha, message, branch, date, isMergeCommit, parentSha, color }
 */
export function getBranchGraphData() {
  const branchColorMap = {
    main: '#8B5CF6',
    master: '#8B5CF6',
    develop: '#06B6D4',
    dev: '#06B6D4',
  };

  const featureColors = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#F97316'];
  let featureColorIdx = 0;

  const assignedColors = {};
  const allNodes = [];
  const seen = new Set();

  const branchNames = Object.keys(repoState.branches);

  // Assign a color to every branch name.
  branchNames.forEach((b) => {
    if (!assignedColors[b]) {
      if (branchColorMap[b]) {
        assignedColors[b] = branchColorMap[b];
      } else {
        assignedColors[b] = featureColors[featureColorIdx % featureColors.length];
        featureColorIdx++;
      }
    }
  });

  // Collect all commits across branches.
  branchNames.forEach((b) => {
    (repoState.branches[b] || []).forEach((commit) => {
      if (!seen.has(commit.shortSha)) {
        seen.add(commit.shortSha);
        allNodes.push({
          ...commit,
          branchColor: assignedColors[commit.branch] || '#94A3B8',
          isCurrent:
            commit.shortSha ===
            (repoState.branches[repoState.currentBranch]?.[0]?.shortSha),
        });
      }
    });
  });

  // Sort newest → oldest by date string (approximate).
  allNodes.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    nodes: allNodes,
    branches: branchNames,
    branchColors: assignedColors,
    currentBranch: repoState.currentBranch,
  };
}
