/**
 * Git Quest - Services barrel export
 */
export {
  // State readers
  getGitState,
  resetGitState,
  getBranchGraphData,

  // Repository
  initRepository,

  // Staging & commits
  stageFiles,
  createCommit,

  // Config
  setGitConfig,
  getGitConfig,

  // Remotes
  addRemote,
  getRemotes,

  // Branches (Milestone 11)
  listBranches,
  createBranch,
  deleteBranch,
  switchBranch,
  createAndSwitchBranch,
  mergeBranch,
} from './gitState';

export { executeGitCommand, tokenizeCommandLine } from './gitInterpreter';
