# Contributing Guidelines

_Pull requests, bug reports, and all other forms of contribution are welcomed and highly encouraged!_ :octocat:

## How can I contribute?

### GitHub issues

If you encounter a problem with this library or if you have a new feature you'd like to see in this project, please create [a new issue](https://github.com/tiavina-mika/mui-tiptap-editor/issues/new/choose).

### GitHub pull requests

Please leverage the repository's own tools to make sure the code is aligned with our standards. If you're using VSCode, it's easiest to use the recommended extensions (`.vscode/extensions.json`) to get integrated linting and autoformatting.

It's recommended to run all check commands before submitting the PR (`type:check`, `format:check`, `lint:check`, `spell:check`, `yarn lint` and  `yarn test:coverage`).

## Development setup

1. Set up [yarn](https://yarnpkg.com/getting-started/install)
2. Run `yarn`
3. Run `yarn dev` and view the demo site at the printed localhost URL

This package uses Vite with Hot Module Replacement (HMR), so file edits should reflect immediately in your browser during local development.

To instead test a "built" version of this package which is installed into an "external" module, you can run `yarn example`, which runs a server with the separate application in the `example/` directory.

## Releasing a new version (for maintainers)

When a new version should be cut since some new changes have landed on the `main` branch, do the following to publish it:

1. Go to the `main` branch and pull in the latest changes.
2. Commit change using (commit convention)[https://www.conventionalcommits.org/en/v1.0.0-beta.4/]
3. Push the commit (ex: `git push origin main`)
4. The `release.yml` GitHub Actions workflow will auto-generate a tag, change log, release note and a PR branch
5. The `automerge.yml` GitHub Actions workflow will merge and delete the PR branch
6. The `publish.yml` GitHub Actions workflow will publish the package to the npm registry

## Issue possibly encountered during installation
- [with yarn](https://stackoverflow.com/questions/67062308/getting-yn0028-the-lockfile-would-have-been-modified-by-this-install-which-is-e)
- solution:
   . Remove `yarn.lock`
   . `yarn cache clean --all`
   . Create an empty `yarn.lock`
   . run `yarn`

## TODO:
#### upgrade eslint to v9
- For now, linting is not working because the actual version of eslint does not support the latest Typescript
  So the solution is to upgrade eslint. But many eslint plugins does not support the v9 yet.
- upgrade [eslint-plugin-prefer-arrow-functions](https://github.com/JamieMason/eslint-plugin-prefer-arrow-functions/issues/33) using eslint v9
- upgrade [eslint-config-airbnb-typescript](https://github.com/iamturns/eslint-config-airbnb-typescript/issues/331) using eslint v9
