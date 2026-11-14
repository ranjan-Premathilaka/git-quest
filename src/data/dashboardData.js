/**
 * Git Quest - Dashboard Local Data & Mock State
 * 
 * Provides realistic initial data for progress, active missions,
 * learning paths, and daily challenges.
 */

export const dashboardData = {
  user: {
    name: 'Alex Developer',
    username: 'quest-dev',
    avatarInitials: 'AD',
    level: 2,
    levelTitle: 'Git Explorer',
    currentXP: 750,
    nextLevelXP: 1000,
    completedMissions: 3,
    totalMissions: 18,
    streakDays: 4,
  },

  nextActivity: {
    id: 'quest-04',
    milestone: 'Milestone 04',
    title: 'Staging & Undoing Changes',
    track: 'Git Fundamentals',
    description: 'Learn how the staging area acts as a buffer and practice unstaging files using git restore --staged.',
    commandSnippet: 'git restore --staged README.md',
    estimatedTime: '8 min',
    xpReward: 100,
  },

  learningPaths: [
    {
      id: 'path-fundamentals',
      title: 'Git Fundamentals',
      subtitle: 'Init, stage, commit & inspection',
      commands: 'init • add • commit • status • log',
      completedCount: 3,
      totalCount: 6,
      badge: 'Active Track',
      badgeVariant: 'gitRelease',
      status: 'In Progress',
      progressPercent: 50,
    },
    {
      id: 'path-branching',
      title: 'Branching & Merging',
      subtitle: 'Isolated lines of development',
      commands: 'branch • switch • merge • rebase',
      completedCount: 0,
      totalCount: 6,
      badge: 'Workflows',
      badgeVariant: 'gitFeature',
      status: 'Up Next',
      progressPercent: 0,
    },
    {
      id: 'path-collaboration',
      title: 'Remotes & Collaboration',
      subtitle: 'Synchronizing with team repos',
      commands: 'remote • fetch • pull • push • conflicts',
      completedCount: 0,
      totalCount: 6,
      badge: 'Team Ops',
      badgeVariant: 'gitMain',
      status: 'Unlocks Lvl 3',
      progressPercent: 0,
    },
  ],

  dailyChallenge: {
    id: 'daily-fast-forward',
    title: 'Fast-Forward Merge Master',
    description: 'Merge feature/auth into main without creating an unnecessary merge commit. Keep your git history linear and clean.',
    commandSnippet: 'git merge --ff-only feature/auth',
    timeEstimate: '5 min',
    xpReward: 50,
    difficulty: 'Intermediate',
  },
};
