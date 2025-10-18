export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforces allowed commit types (e.g., feat, fix, docs, etc.)
    'type-enum': [
      2, // Error level: 2 = error, 1 = warning, 0 = off
      'always',
      // Always apply this rule
      [
        'feat', // New feature (major or minor changes, e.g., adding a new component): 1.0.0 => 1.1.0
        'fix', // Bug fix (patch changes, e.g., fixing a bug in an existing component): 1.0.0 => 1.0.1
        'docs', // Documentation changes (readme, comments, etc.): no version bump
        'style', // Code style changes (formatting, missing semi colons, etc.): no version bump
        'refactor', // Code refactoring (no feature or bug changes): no version bump
        'perf', // Performance improvements : no version bump
        'test', // Adding or updating tests : no version bump
        'chore', // Maintenance tasks (build, tooling, etc.): no version bump
        'revert', // Reverting previous commits
        'breaking', // BREAKING CHANGE (major changes that break backward compatibility): 1.0.0 => 2.0.0
      ],
    ],
    // Enforces that the commit subject uses sentence case
    'subject-case': [0],
    // Disables max line length for the commit body
    'body-max-line-length': [0],
    // Disables max line length for the commit footer
    'footer-max-line-length': [0],
    // Enforces a maximum header length of 100 characters
    'header-max-length': [2, 'always', 100],
  },
};
