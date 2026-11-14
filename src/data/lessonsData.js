/**
 * Git Quest - Detailed Lessons Content Data
 * 
 * Contains rich educational content, explanations, objectives,
 * terminology, realistic command examples, and terminal output.
 */

export const lessonsData = {
  'l-01': {
    id: 'l-01',
    moduleId: 'module-01',
    moduleName: 'Git Fundamentals',
    lessonIndex: 1,
    totalLessonsInModule: 3,
    title: 'What is Git?',
    estimatedTime: '5 min read',
    xpReward: 50,
    introduction:
      'Git is the global standard for distributed version control. Created by Linus Torvalds in 2005, it allows software developers to track every change made to their code, collaborate across distributed teams, and experiment safely without fear of losing previous work.',
    objectives: [
      'Understand what a Distributed Version Control System (DVCS) is and how it differs from centralized systems.',
      'Learn how Git models your project history as snapshots rather than file difference streams.',
      'Familiarize yourself with core Git mental models: Repository, Commit, Working Tree, and Staging Area.',
    ],
    sections: [
      {
        heading: 'A Simple Explanation of Git',
        body: 'At its core, Git acts as an intelligent time machine for your codebase. Instead of saving multiple copies of a folder (like project_final_v2), Git takes a lightweight snapshot of your entire project every time you make a commit. If a bug is introduced or you want to experiment, you can instantly inspect, compare, or restore any previous state.',
      },
      {
        heading: 'Why is Git Indispensable?',
        body: 'In modern software engineering, code changes constantly across thousands of commits and dozens of developers. Git solves this coordination challenge by recording who made a change, when it occurred, and the commit message explaining why. Because Git is distributed, every developer holds a complete copy of the repository and its history locally on their machine.',
      },
      {
        heading: 'Core Git Terminology',
        terms: [
          {
            term: 'Repository (Repo)',
            definition:
              'The central directory where your project files, commit history, branches, and configuration are tracked inside a hidden .git folder.',
          },
          {
            term: 'Commit',
            definition:
              'A recorded snapshot of your files at a specific moment in time, identified by a cryptographic SHA-1 hash (e.g., 8f3a912).',
          },
          {
            term: 'Working Directory',
            definition:
              'The local sandbox on your filesystem where you actively write code and modify files before staging them.',
          },
          {
            term: 'Staging Area (Index)',
            definition:
              'A preparation buffer where you select which specific file modifications will be included in the next commit snapshot.',
          },
          {
            term: 'Branch',
            definition:
              'A lightweight, movable pointer to a commit, allowing developers to build features in parallel without affecting main production code.',
          },
        ],
      },
    ],
    commandExample: {
      title: 'Verifying Git on Your System',
      description: 'Before running any Git operations, verify that the CLI binary is installed and discover its version.',
      command: 'git --version',
      output: 'git version 2.44.0.windows.1',
    },
    workflowExample: {
      title: 'Inspecting Repository Status',
      description: 'The git status command inspects your current working tree and compares it against the latest commit.',
      command: 'git status',
      output:
        'On branch main\nNo commits yet\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tREADME.md\n\nnothing added to commit but untracked files present',
    },
    tips: [
      'Git is local-first: committing, diffing, and switching branches require no internet connection.',
      'Commits in Git are immutable — once created, their SHA fingerprint permanently seals their contents.',
      'Always write concise, imperative commit messages (e.g., "Add user authentication" instead of "Added user auth").',
    ],
    nextLessonId: 'l-02',
    previousLessonId: null,
  },

  'l-02': {
    id: 'l-02',
    moduleId: 'module-01',
    moduleName: 'Git Fundamentals',
    lessonIndex: 2,
    totalLessonsInModule: 3,
    title: 'Why Use Version Control?',
    estimatedTime: '6 min read',
    xpReward: 50,
    introduction:
      'Version control is the foundation of modern collaborative software engineering. It protects projects from data loss, enables fearless refactoring, and documents the entire historical reasoning behind software architecture.',
    objectives: [
      'Identify the dangers of manual file versioning.',
      'Understand how version control enables parallel feature development.',
      'Explore accountability, code reviews, and change provenance in teams.',
    ],
    sections: [
      {
        heading: 'The Problem with Manual Versioning',
        body: 'Without version control, developers rely on naming files with dates or suffixes like "app_v2_final.js". This approach makes it impossible to know what changed between versions, who made each modification, or how to merge changes from two developers working simultaneously.',
      },
      {
        heading: 'Audit Trails & Blame History',
        body: 'Every single line of code in a Git repository is tied to a commit metadata record. Using tools like git log and git blame, you can discover not just when a line changed, but the exact commit message describing why the decision was made.',
      },
    ],
    commandExample: {
      title: 'Viewing Commit History',
      description: 'Inspect the commit history to see chronological project milestones.',
      command: 'git log --oneline',
      output:
        'c41b892 (HEAD -> main) docs: add architectural overview\n7a28e01 feat: initialize project scaffolding\n19f03d5 chore: initial commit',
    },
    tips: [
      'Version control gives you the psychological safety to delete old commented-out code — Git remembers it forever.',
    ],
    nextLessonId: 'l-03',
    previousLessonId: 'l-01',
  },

  'l-03': {
    id: 'l-03',
    moduleId: 'module-01',
    moduleName: 'Git Fundamentals',
    lessonIndex: 3,
    totalLessonsInModule: 3,
    title: 'Git Installation and Setup',
    estimatedTime: '7 min read',
    xpReward: 50,
    introduction:
      'Before creating your first commit, Git requires your author name and email. These credentials tag every commit you author so your teammates know who wrote each change.',
    objectives: [
      'Configure global author identity using git config.',
      'Set your default branch name to main.',
      'Configure line-ending settings for cross-platform compatibility.',
    ],
    sections: [
      {
        heading: 'Configuring Your Identity',
        body: 'Git uses your name and email to sign each commit. These are configured globally using the git config command with the --global flag, which persists across all repositories on your computer.',
      },
    ],
    commandExample: {
      title: 'Setting Your Global Author Name & Email',
      description: 'Run these commands once when configuring a new developer environment.',
      command: 'git config --global user.name "Alex Developer"\ngit config --global user.email "alex@gitquest.local"',
      output: '# Configurations saved to ~/.gitconfig',
    },
    workflowExample: {
      title: 'Inspecting Your Git Settings',
      description: 'List all configured global properties to verify your identity.',
      command: 'git config --list',
      output:
        'user.name=Alex Developer\nuser.email=alex@gitquest.local\ninit.defaultbranch=main\ncore.autocrlf=true',
    },
    tips: [
      'Use the same email address as your GitHub/GitLab account so your commits link correctly to your profile.',
    ],
    nextLessonId: null,
    previousLessonId: 'l-02',
  },
};
