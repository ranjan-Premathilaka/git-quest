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
const additionalLessons = [
  ['l-04','module-02','Working with Repositories',1,3,'Creating a repository','git init','Initialized empty Git repository in /project/.git/','Create a project folder, initialize Git, then inspect the new repository with git status.'],
  ['l-05','module-02','Working with Repositories',2,3,'git init','git init','Initialized empty Git repository in /project/.git/','git init creates the hidden .git directory that stores configuration, objects and history. It does not add your files to version control yet.'],
  ['l-06','module-02','Working with Repositories',3,3,'git status','git status','On branch main\nUntracked files:\n  README.md\nnothing added to commit','Use git status whenever you need to understand what is staged, modified or untracked before committing.'],
  ['l-07','module-03','Tracking Changes',1,3,'git add','git add README.md','Changes to be committed:\n  new file: README.md','The staging area lets you select exactly which changes belong in the next commit. Stage individual files for precise commits.'],
  ['l-08','module-03','Tracking Changes',2,3,'git commit','git commit -m "Add project readme"','[main a1b2c3d] Add project readme\n 1 file changed','A commit records the staged snapshot with an author, timestamp and message. Keep messages concise and explain the change.'],
  ['l-09','module-03','Tracking Changes',3,3,'git log','git log --oneline','a1b2c3d Add project readme\n9d8e7f6 Initial commit','Git log displays commit history. The --oneline option gives a compact view useful for quickly scanning project milestones.'],
  ['l-10','module-04','Remote Repositories',1,4,'git remote','git remote -v','origin  https://github.com/user/project.git (fetch)\norigin  https://github.com/user/project.git (push)','A remote is a named connection to another copy of your repository. The conventional name origin usually identifies your primary hosted repository.'],
  ['l-11','module-04','Remote Repositories',2,4,'git push','git push -u origin main','Branch main set up to track remote branch main from origin.','Push sends local commits to a remote. The -u option sets an upstream so future pushes can use the shorter git push command.'],
  ['l-12','module-04','Remote Repositories',3,4,'git pull','git pull origin main','Updating 9d8e7f6..a1b2c3d\nFast-forward','Pull fetches remote changes and integrates them into the current branch. Review your working tree before pulling to avoid conflicts.'],
  ['l-13','module-04','Remote Repositories',4,4,'git clone','git clone https://github.com/user/project.git','Cloning into project...\nremote: Enumerating objects: 42, done.','Clone creates a local repository from an existing remote, including its files, branches and commit history.'],
  ['l-14','module-05','Branching Basics',1,4,'Understanding branches','git branch','* main','A branch is a lightweight pointer to a commit. Branches let you develop features independently while keeping the main line stable.'],
  ['l-15','module-05','Branching Basics',2,4,'git branch','git branch feature/profile','* main\n  feature/profile','Create a branch to isolate related work. Creating a branch does not switch to it; use git switch to move your working context.'],
  ['l-16','module-05','Branching Basics',3,4,'git switch','git switch -c feature/profile','Switched to a new branch "feature/profile"','git switch changes the current branch. Add -c to create a branch and switch to it in one step.'],
  ['l-17','module-05','Branching Basics',4,4,'git merge','git merge feature/profile','Updating 9d8e7f6..a1b2c3d\nFast-forward','Merge integrates changes from another branch into the current branch. Check out the destination branch first, then merge the source branch.'],
];

for (const [id, moduleId, moduleName, lessonIndex, totalLessonsInModule, title, command, output, explanation] of additionalLessons) {
  lessonsData[id] = {
    id, moduleId, moduleName, lessonIndex, totalLessonsInModule, title,
    estimatedTime: '6 min read', xpReward: 50,
    introduction: explanation,
    objectives: [`Understand ${title} in the Git workflow.`, `Know when to use ${command.split(' ')[0]} and what it changes.`, 'Interpret the command result and verify repository state.'],
    sections: [{ heading: title, body: explanation }, { heading: 'How it fits the workflow', body: 'Git operations are local and work offline. Inspect your repository state before and after each operation so you can confirm the result and recover confidently if needed.' }],
    commandExample: { title: `Using ${title}`, description: `Run this command in the repository to practice ${title.toLowerCase()}.`, command, output },
    tips: ['Run git status after important operations to confirm the current state.', 'Git stores repository history locally; network access is only needed when synchronizing with a remote.'],
    previousLessonId: lessonIndex > 1 ? `l-${String(Number(id.slice(2)) - 1).padStart(2, '0')}` : null,
    nextLessonId: lessonIndex < totalLessonsInModule ? `l-${String(Number(id.slice(2)) + 1).padStart(2, '0')}` : null,
  };
}
