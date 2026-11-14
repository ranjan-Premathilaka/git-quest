/**
 * Git Quest - Learning Modules Data
 * 
 * Defines structured learning tracks in logical educational progression:
 * 1. Git Fundamentals
 * 2. Working with Repositories
 * 3. Tracking Changes
 * 4. Remote Repositories
 * 5. Branching Basics
 */

export const modulesData = [
  {
    id: 'module-01',
    moduleNumber: '01',
    title: 'Git Fundamentals',
    category: 'Foundations',
    description: 'Understand core version control principles, why Git is indispensable, and configure your developer identity.',
    status: 'completed', // 'completed' | 'in-progress' | 'available' | 'locked'
    level: 'Beginner',
    estimatedTime: '15 min',
    xpReward: 150,
    badgeVariant: 'gitRelease',
    lessons: [
      { id: 'l-01', title: 'What is Git?', completed: true },
      { id: 'l-02', title: 'Why use version control?', completed: true },
      { id: 'l-03', title: 'Git installation and setup', completed: true },
    ],
    completedLessons: 3,
    totalLessons: 3,
  },
  {
    id: 'module-02',
    moduleNumber: '02',
    title: 'Working with Repositories',
    category: 'Foundations',
    description: 'Create your first local repository, explore repository metadata, and inspect live working directory status.',
    status: 'in-progress',
    level: 'Beginner',
    estimatedTime: '20 min',
    xpReward: 200,
    badgeVariant: 'gitMain',
    lessons: [
      { id: 'l-04', title: 'Creating a repository', completed: true },
      { id: 'l-05', title: 'git init', completed: true },
      { id: 'l-06', title: 'git status', completed: false },
    ],
    completedLessons: 2,
    totalLessons: 3,
  },
  {
    id: 'module-03',
    moduleNumber: '03',
    title: 'Tracking Changes',
    category: 'Core Workflow',
    description: 'Stage modified files with precision, commit snapshots with descriptive messages, and inspect history using git log.',
    status: 'available',
    level: 'Intermediate',
    estimatedTime: '25 min',
    xpReward: 250,
    badgeVariant: 'gitFeature',
    lessons: [
      { id: 'l-07', title: 'git add', completed: false },
      { id: 'l-08', title: 'git commit', completed: false },
      { id: 'l-09', title: 'git log', completed: false },
    ],
    completedLessons: 0,
    totalLessons: 3,
  },
  {
    id: 'module-04',
    moduleNumber: '04',
    title: 'Remote Repositories',
    category: 'Collaboration',
    description: 'Connect local workspaces to remote remotes, clone codebases, and synchronize team changes using push and pull.',
    status: 'locked',
    unlockRequirement: 'Complete Tracking Changes',
    level: 'Intermediate',
    estimatedTime: '30 min',
    xpReward: 300,
    badgeVariant: 'gitDevelop',
    lessons: [
      { id: 'l-10', title: 'git remote', completed: false },
      { id: 'l-11', title: 'git push', completed: false },
      { id: 'l-12', title: 'git pull', completed: false },
      { id: 'l-13', title: 'git clone', completed: false },
    ],
    completedLessons: 0,
    totalLessons: 4,
  },
  {
    id: 'module-05',
    moduleNumber: '05',
    title: 'Branching Basics',
    category: 'Advanced Workflows',
    description: 'Isolate feature work into parallel branches, switch contexts safely, and merge changes back to the main branch.',
    status: 'locked',
    unlockRequirement: 'Complete Remote Repositories',
    level: 'Advanced',
    estimatedTime: '35 min',
    xpReward: 350,
    badgeVariant: 'gitHotfix',
    lessons: [
      { id: 'l-14', title: 'Understanding branches', completed: false },
      { id: 'l-15', title: 'git branch', completed: false },
      { id: 'l-16', title: 'git switch', completed: false },
      { id: 'l-17', title: 'git merge', completed: false },
    ],
    completedLessons: 0,
    totalLessons: 4,
  },
];
