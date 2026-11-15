/** Core Git knowledge quiz used by the Quiz screen. */
export const gitBasicsQuiz = {
  id: 'git-basics-quiz',
  title: 'Git Knowledge Check',
  description: 'Test your understanding of repositories, commits, staging and branches.',
  xpReward: 30,
  questions: [
    { id: 'q1', question: 'What is Git primarily used for?', options: ['Editing images', 'Version control', 'Hosting websites', 'Managing databases'], answer: 1, explanation: 'Git tracks changes to files and helps developers manage project history.' },
    { id: 'q2', question: 'Which command creates a new Git repository in the current folder?', options: ['git start', 'git create', 'git init', 'git new'], answer: 2, explanation: 'git init creates the .git directory and initializes a repository.' },
    { id: 'q3', question: 'Which command shows the state of your working tree?', options: ['git status', 'git show-all', 'git check', 'git state'], answer: 0, explanation: 'git status reports staged, unstaged and untracked changes.' },
    { id: 'q4', question: 'What does the staging area do?', options: ['Uploads files to GitHub', 'Prepares selected changes for a commit', 'Deletes old commits', 'Creates a branch'], answer: 1, explanation: 'The staging area lets you choose which changes go into the next commit.' },
    { id: 'q5', question: 'Which command stages a file named app.js?', options: ['git commit app.js', 'git push app.js', 'git add app.js', 'git stage --remove app.js'], answer: 2, explanation: 'git add app.js stages that file for the next commit.' },
    { id: 'q6', question: 'What is a Git commit?', options: ['A saved snapshot of project changes', 'A remote server', 'A programming language', 'A deleted branch'], answer: 0, explanation: 'A commit records a snapshot of the staged project state.' },
    { id: 'q7', question: 'Which command creates a commit with a message?', options: ['git save -m', 'git commit -m', 'git message', 'git add -m'], answer: 1, explanation: 'git commit -m "message" creates a commit with the supplied message.' },
    { id: 'q8', question: 'What is a branch in Git?', options: ['A copy of GitHub', 'A pointer to a line of development', 'A folder for images', 'A type of commit message'], answer: 1, explanation: 'A branch is a lightweight pointer that lets work progress independently.' },
    { id: 'q9', question: 'Which command lists local branches?', options: ['git branch', 'git list files', 'git log --all-files', 'git status -b'], answer: 0, explanation: 'git branch lists local branches and marks the current branch.' },
    { id: 'q10', question: 'Which command sends local commits to a remote repository?', options: ['git fetch', 'git clone', 'git push', 'git init'], answer: 2, explanation: 'git push publishes local commits to a configured remote repository.' },
  ],
};
