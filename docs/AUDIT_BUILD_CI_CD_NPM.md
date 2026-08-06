# Audit — Build, Tests, CI/CD, npm Deployment & Versioning

## Table of Contents

- [Executive Summary](#executive-summary)
- [1. Current State](#1-current-state)
  - [1.1 Build](#11-build)
  - [1.2 Tests](#12-tests)
  - [1.3 CI/CD (GitHub Actions)](#13-cicd-github-actions)
  - [1.4 npm Deployment](#14-npm-deployment)
  - [1.5 Versioning](#15-versioning)
- [2. What's Missing](#2-whats-missing)
  - [2.1 No CI Gate on PRs ✅](#21-no-ci-gate-on-prs)
  - [2.2 Very Low Test Coverage](#22-very-low-test-coverage)
  - [2.3 e2e Runs After Publish, Not Before](#23-e2e-runs-after-publish-not-before)
  - [2.4 package.json / Publishing Hygiene](#24-packagejson--publishing-hygiene)
  - [2.5 Missing Project Files](#25-missing-project-files)
  - [2.6 Dependency Automation](#26-dependency-automation)
  - [2.7 CI Reproducibility](#27-ci-reproducibility)
  - [2.8 Commitlint & semantic-release Misconfigurations](#28-commitlint--semantic-release-misconfigurations)
- [3. Best Practices to Apply](#3-best-practices-to-apply)
- [4. Performance](#4-performance)
- [5. Alternatives](#5-alternatives)
- [6. Other Observations](#6-other-observations)
- [7. Proposal — Unify Triggers on a Single Event (PR Merge → main)](#7-proposal--unify-triggers-on-a-single-event-pr-merge--main)
  - [7.1 Problem with the Current Cascade](#71-problem-with-the-current-cascade)
  - [7.2 Recommended Approach ✅](#72-recommended-approach)
  - [7.3 Job Graph ✅](#73-job-graph)
  - [7.4 Gating Downstream Jobs on an Actual Release ✅](#74-gating-downstream-jobs-on-an-actual-release)
  - [7.5 Alternative Trigger: `pull_request` `closed` + `merged == true`](#75-alternative-trigger-pull_request-closed--merged--true)
  - [7.6 What to Keep Separate](#76-what-to-keep-separate)

## Executive Summary

The current pipeline is **functional and already well-structured** for a single-package npm
library (Yarn 4, Conventional Commits, semantic-release, shared `dist` artifact across jobs). The
two most important blind spots are:

1. **Lint and tests never gate a PR** — they only run on `push` to `main`, i.e. *after* the merge.
   A broken PR can be merged without any CI signal opposing it.
2. **Test coverage is close to zero** (1 unit test file, 1 e2e spec) for 59 source files, and e2e
   only runs **after** the npm publish — after the damage is already done.

Everything else (Rollup build, semantic-release, Storybook/Pages, Netlify demo) is solid and does
not need a rewrite, only targeted adjustments.

## 1. Current State

### 1.1 Build

- **Bundler**: [rollup.config.js](../rollup.config.js) — two passes:
  - JS/TS bundle in ESM (`preserveModules: true`, one file per source module) via
    `rollup-plugin-typescript2` + Babel (JSX + `@emotion/babel-plugin`) + `terser` (minification) +
    `rollup-plugin-preserve-use-client` (RSC/Next.js compat) + `rollup-plugin-import-css` (CSS
    inlined and minified) + `rollup-plugin-url` (assets < 8 KB inlined as base64).
  - `.d.ts` declaration bundle via `rollup-plugin-dts`, based on `tsconfig.build.json`.
  - `getExternalDeps()` dynamically externalizes all `dependencies` + `peerDependencies` to avoid
    bundling React, MUI, Tiptap, etc.
  - `rollup-plugin-visualizer` generates `temp/stats.html` (bundle size analysis), but this report
    is neither archived nor checked in CI (see [§2](#2-whats-missing)).
- **Dev/preview**: `yarn dev` (Vite dev server) and `yarn build:dev` (Vite build, used for
  Storybook/preview, not for publishing).
- **Published output**: only `/dist` (`files` in `package.json`), ESM only (`type: module`,
  `main`/`module`/`exports.import` all point to `dist/index.mjs`).

### 1.2 Tests

- **Unit**: Jest + `ts-jest`, root `__tests__/unit/` — **only 1 file**
  (`__tests__/unit/index.spec.ts`).
- **E2E**: Playwright, root `__tests__/e2e/` — **only 1 spec**
  (`text-editor.stories.spec.ts`), run against Storybook deployed on GitHub Pages (3 browsers:
  Chromium, Firefox, WebKit).
- `yarn test:ci` (`jest --ci --coverage`) generates a coverage report, but no threshold
  (`coverageThreshold`) is set in [jest.config.js](../jest.config.js), and the report is neither
  uploaded (Codecov/artifact) nor displayed anywhere.

### 1.3 CI/CD (GitHub Actions)

Five workflows, chained in a cascade driven by `workflow_run`:

```
PR → commitlint.yml (commit lint + PR title only)
   ↓ merge
push main → release.yml: lint → test → build → release (semantic-release + npm publish)
                                              ↓ (workflow_run, on success)
                          ┌───────────────────┼───────────────────┐
                    e2e.yml              deploy-demo.yml     add-badges.yml
              (Storybook → Pages          (deploys demos/     (updates README
               then Playwright e2e)        to Netlify)          badges)
```

- **`commitlint.yml`**: on PR to `release`/`main`/`feat/*`/`fix/*` — validates commits
  (Conventional Commits) and the PR title. **Runs neither code lint nor tests.**
- **`release.yml`**: on `push` to `main` — sequential jobs `lint → test → build → release`, with
  the `build` job's `dist/` uploaded as an artifact and re-downloaded by `release` (avoids a
  second build). The `release` job runs `npx semantic-release --debug` with permissions
  `contents: write`, `issues: write`, `pull-requests: write`, `id-token: write` (npm OIDC
  provenance).
- **`e2e.yml`**: triggered after a successful `release.yml` run — builds & deploys Storybook to
  GitHub Pages, then runs Playwright e2e **against the already-deployed Storybook**.
- **`deploy-demo.yml`**: triggered after a successful `release.yml` run — in `demos/`, runs
  `yarn upgrade:lib` (= `yarn add mui-tiptap-editor@latest`, i.e. **re-downloads the version that
  was just published**), builds, then deploys to Netlify.
- **`add-badges.yml`**: triggered after a successful `release.yml` run — updates the README
  badges (npm version, downloads, contributors, build, Storybook).

### 1.4 npm Deployment

- Published via `@semantic-release/npm` (`npmPublish: true`), authenticated with
  `secrets.NPM_TOKEN`, registry `https://registry.npmjs.org/`.
- `id-token: write` is set → npm provenance (`--provenance`) is possible, but it is not explicitly
  enabled in the `@semantic-release/npm` config (nor in `.npmrc` — see
  [§6](#6-other-observations)).
- The `release` job contains many steps marked `(DEBUG)` (printing `dist/`, git tags, token
  validation, `npm view ... versions`, etc.) that look like leftover debugging steps rather than
  intentional, permanent ones.
- The demo (`demos/`) and Storybook Pages are republished **after the fact**, once the package is
  already on npm — they act as a post-hoc check, not a safety gate.

### 1.5 Versioning

- **semantic-release** (`.releaserc.json`), triggered only on `main` (a single release channel,
  no `next`/`beta` branch).
- Commit analysis via `conventionalcommits`: `feat` → minor, `fix`/`perf`/`revert` → patch,
  `BREAKING CHANGE` → major, `docs`/`style`/`refactor`/`test`/`chore(release)` → no release.
- `@semantic-release/changelog` generates `CHANGELOG.md`, `@semantic-release/git` commits back
  `package.json` + `yarn.lock` + `CHANGELOG.md` with the message
  `chore(release): x.y.z [skip ci]` — the `[skip ci]` is essential here since `release.yml`
  triggers on every `push` to `main`, including the bot's own push; without it, an infinite loop
  would occur.
- Current history is consistent with this process (`2.0.2`, `2.0.1`, `2.0.0` with a documented
  breaking change for 2.0.0).

## 2. What's Missing

### 2.1 No CI Gate on PRs ✅

This is the most important gap. `commitlint.yml` (the only workflow that runs on `pull_request`)
only checks the format of commits/title — **neither `yarn lint`, `yarn test`, nor `yarn build`
run before merge**. A PR that breaks the build, lint, or tests can be merged with no red signal
on the PR itself; the failure only surfaces afterward in `release.yml`, at a point where the code
is already on `main`.

### 2.2 Very Low Test Coverage

1 unit test + 1 e2e test for 59 source files (toolbar components, menus, mention, table of
contents, image extension, hooks). No coverage threshold is enforced (`coverageThreshold` absent
from `jest.config.js`), so `test:ci` passes even at 0% coverage on new code.

### 2.3 e2e Runs After Publish, Not Before

E2E tests only exercise the editor's real browser behavior **after** `semantic-release` has
already published to npm, tagged, and generated the changelog. If the e2e run fails, the broken
package is already public — `npm unpublish` is restricted (72h window, npm policy) and does not
fix consumers who already installed that version.

### 2.4 package.json / Publishing Hygiene

- **Tiptap/ProseMirror extensions are in `dependencies`**, not `peerDependencies`. For a library
  that exposes Tiptap components to apps that themselves use Tiptap, this can create **two
  instances of ProseMirror/Tiptap** in the consumer app (state sync bugs, duplicated bundle size).
- `exports["."].require` points to `dist/index.mjs` while the package is `"type": "module"` — a
  pure CommonJS `require()` on this path throws `ERR_REQUIRE_ESM` on Node runtimes that don't yet
  support `require(esm)`. As it stands, a fully-CJS consumer cannot use the package despite what
  the `exports` map advertises.
- No `sideEffects` field in `package.json` → consumer bundlers (Webpack, Vite) cannot guarantee
  optimal tree-shaking of embedded CSS/side effects.
- No `engines` field → no minimum Node version is communicated to contributors or consumers, even
  though CI is pinned to Node 20.

### 2.5 Missing Project Files

- **`LICENSE`** is absent from the repo while `package.json` declares `"license": "MIT"` — a
  legal/compliance risk for consumers doing license audits.
- No `SECURITY.md` (disclosure policy), no `CODEOWNERS`, no PR template (only issue templates
  exist under `.github/ISSUE_TEMPLATE/`).
- Duplicate `CHANGELOG.md` at the repo root **and** under `docs/CHANGELOG.md` (the latter looks
  like an older, frozen copy) — a source of confusion about which one is authoritative.

### 2.6 Dependency Automation

No Dependabot/Renovate configured. For a library with broad peer deps (React 16.8–19.x, MUI 7)
and many Tiptap deps pinned at `^3.6.5`, there is no automatic alert on new Tiptap/MUI major
versions, nor on dependency CVEs (no `npm audit`/Dependabot security updates in CI).

### 2.7 CI Reproducibility

`corepack prepare yarn@4 --activate` installs the **latest floating 4.x**, while `packageManager`
in `package.json` pins an exact version (`yarn@4.10.3`). A CI run six months from now could
therefore use a different Yarn version than the one contributors use locally, defeating the
purpose of the `packageManager` field (reproducible builds).

### 2.8 Commitlint & semantic-release Misconfigurations

- **`breaking` commit type never triggers a major release**: [commitlint.config.mjs](../commitlint.config.mjs)
  allows and documents `breaking` as producing `1.0.0 => 2.0.0`, but `semantic-release`'s
  `commit-analyzer` only bumps `major` when `commit.notes.length > 0` (a `BREAKING CHANGE:` footer
  or a `!` after the type, e.g. `feat!:`) or when a custom rule matches `commit.type`. The custom
  rule in [.releaserc.json](../.releaserc.json) is `{ "type": "BREAKING CHANGE", "release": "major" }`
  — `"BREAKING CHANGE"` is never an actual `commit.type` value (types are lowercase, e.g.
  `breaking`), so this rule can never match anything. A `breaking: ...` commit therefore passes
  commitlint but currently produces **no release at all**.
- **`generateNotes.addPrUrl` is a no-op**: not a recognized option of
  `@semantic-release/release-notes-generator` or any installed `conventional-changelog-*` package
  — confirmed by grepping the full dependency tree. It gets merged into the plugin config (a valid
  semantic-release mechanism), but the plugin silently ignores the unknown key.
- **`.husky/pre-commit` is empty**: emptied in commit `6880ea5` ("Update pre-commit"), which
  removed `yarn lint-staged`. `.lintstagedrc.json` and the `"precommit": "lint-staged"` script are
  therefore dead — lint-staged never runs locally on commit.
- **No `commit-msg` hook**: commitlint only runs in CI ([commitlint.yml](../.github/workflows/commitlint.yml),
  on `pull_request`), never at commit time locally.
- **`"prepare": "husky install"` is deprecated**: the installed husky version (9.1.7) prints
  `"install command is DEPRECATED"` at install time — should be `"prepare": "husky"`.
- **Inconsistent allowed commit types between commit messages and PR titles** ✅:
  `commitlint.config.mjs` allows `feat, fix, docs, style, refactor, perf, test, chore, revert,
  breaking`; the PR-title check in `commitlint.yml` allows `feat, fix, docs, style, refactor, perf,
  test, build, ci, chore, revert, BREAKING CHANGE`. `build`/`ci` pass PR-title validation but would
  fail commitlint on an actual commit of that type; `breaking` passes commitlint but has no
  matching valid PR-title type. `build` and `ci` were added to `commitlint.config.mjs`'s
  `type-enum` to match the PR-title list; the `breaking` vs `BREAKING CHANGE` mismatch is still
  open.
- **`CONTRIBUTING.md`'s release section is stale**: it documents a `release.yml` /
  `automerge.yml` / `publish.yml` three-workflow flow that no longer exists — replaced by the
  unified `ci-cd.yml` (see [§7](#7-proposal--unify-triggers-on-a-single-event-pr-merge--main)).

## 3. Best Practices to Apply

1. **Add a `ci.yml` workflow triggered on `pull_request`** (into `main`) that runs `yarn lint`,
   `yarn test:ci` and `yarn build` — the same jobs as in `release.yml`, but as a **required
   check** before merge (via branch protection / required status checks on `main`). `release.yml`
   can then focus on build + publish, trusting that merged code was already validated. ✅
2. **Enable branch protection on `main`**: required status checks (`lint`, `test`, `build`),
   require PR review, dismiss stale reviews — nothing currently indicates this is in place, and
   nothing in the workflows themselves can guarantee it (verify in the GitHub repo settings).
3. **Run e2e before publishing, not after.** Two options: build Storybook from source in the
   `test` job (no need to wait for the Pages deployment) and run Playwright against it; or, at
   minimum, run e2e in `ci.yml` on PRs against an ephemeral local Storybook (`yarn sb` + `wait-on`,
   as `playwright.config.ts` already does locally).
4. **Add a `coverageThreshold` in `jest.config.js`** and grow the unit test suite (at minimum:
   hooks (`useTextEditor`), custom extensions, utils). Upload the coverage report as a CI artifact
   to make it visible on every run.
5. **Add a `LICENSE` file** (MIT, consistent with `package.json`).
6. **Move Tiptap extensions to `peerDependencies`** (with a compatible range) to guarantee a
   single Tiptap/ProseMirror instance in the consumer app.
7. **Add `"sideEffects": false`** (or the precise list of files with side effects, e.g. CSS) in
   `package.json` for correct tree-shaking on the consumer side.
8. **Add `"engines": { "node": ">=20" }`** to align CI, contributors, and consumers.
9. **Clean up the `(DEBUG)` steps** in the `release` job of `release.yml` now that the pipeline is
   stable — they add noise to every run without providing useful signal in steady state. ✅
10. **Add Dependabot** (`.github/dependabot.yml`), at minimum for npm security updates and GitHub
    Actions.
11. **Fix the `breaking` release rule**: either drop the `breaking` commit type from
    `commitlint.config.mjs` and document `feat!:`/`fix!:` or a `BREAKING CHANGE:` footer as the
    only way to trigger a major release, or add a working custom rule
    `{ "type": "breaking", "release": "major" }` to `.releaserc.json` and remove the dead
    `{ "type": "BREAKING CHANGE", ... }` rule.
12. **Remove `generateNotes.addPrUrl`** from `.releaserc.json` (or replace it with a mechanism
    that actually links PRs in release notes), since it currently has no effect.
13. **Restore `.husky/pre-commit`** to run `yarn lint-staged` (or explicitly document why it was
    disabled, if that was a deliberate choice).
14. **Add a `.husky/commit-msg` hook** running `commitlint --edit "$1"` so malformed commit
    messages are caught locally, not only in CI.
15. **Update the `"prepare"` script** to `"husky"` (drop the deprecated `install` subcommand)
    before it hard-fails on a future husky major version.
16. **Align the allowed commit types** between `commitlint.config.mjs` and the PR-title check in
    `commitlint.yml` so both gates accept exactly the same list.
17. **Update `CONTRIBUTING.md`**'s release section to describe the current unified `ci-cd.yml`
    pipeline instead of the removed `release.yml` / `automerge.yml` / `publish.yml` workflows.

## 4. Performance

- **What's already good**: `dist/` is built once (the `build` job) and reused via
  `actions/upload-artifact`/`download-artifact` in the `release` job, avoiding a redundant
  rebuild. The Yarn cache (`actions/cache` on `.yarn/install-state.gz`) speeds up installs.
  `terser` + `preserveModules` + peer-dep externalization produce a correctly tree-shakable
  bundle on the consumer side.
- **CI optimization opportunities**:
  - `lint`, `test`, and `build` currently run **sequentially** (`test` waits on `lint`, `build`
    waits on `test`) even though they are independent of each other — parallelizing them (all
    three with `needs: []`, and `release` with `needs: [lint, test, build]`) would cut the total
    release pipeline duration to roughly the longest single job instead of the sum of the three. ✅
  - The Yarn cache only caches `.yarn/install-state.gz`, not the actual downloaded package
    contents (`nodeLinker: node-modules` in `.yarnrc.yml` means a real `node_modules` on disk) —
    also caching `node_modules` (keyed on `yarn.lock`) would noticeably speed up
    `yarn install --immutable` in every job.
  - `ts-jest` compiles TypeScript on the fly on every run; switching to `@swc/jest` (or Vitest,
    already a devDependency for Storybook) would meaningfully cut unit test run time, especially
    once the suite grows per the recommendation in [§3.4](#3-best-practices-to-apply).
  - The `rollup-plugin-visualizer` report (`temp/stats.html`) is generated on every build but never
    consulted in CI — uploading it as an artifact (or failing CI beyond a bundle-size budget)
    would turn an unused by-product into a real runtime-performance guardrail for consumers.

## 5. Alternatives

| Topic | Current solution | Alternative | Trade-off |
|---|---|---|---|
| Library bundler | Rollup (manual config, ~10 plugins) | `tsup` / `unbuild` (esbuild) | Much simpler to maintain and faster, but less fine-grained control (the current `preserveModules` + CSS handling + `use client` setup is already well-tuned — a migration is only worth it if the Rollup config becomes a maintenance burden) |
| Versioning/release | semantic-release | **Changesets** | Changesets leaves the version-bump decision to PR authors (a `.changeset/*.md` file) rather than deriving everything from the commit message — better suited if the team grows and Conventional Commits discipline becomes hard to enforce on every PR |
| Unit test runner | Jest + ts-jest | **Vitest** (already a devDependency for Storybook) | Avoids maintaining two test runners (Jest for unit, Vitest for Storybook/addon-vitest); faster startup and watch mode |
| Registry | Public npm | GitHub Packages | Not relevant here: the package is public and aimed at a broad ecosystem, npm remains the right choice |
| Visual testing | None | **Chromatic** (`@chromatic-com/storybook` already a devDependency but not wired into CI) | Would automatically catch visual regressions on Storybook stories on every PR — the dependency is already installed, only the workflow is missing |
| Package manager | Yarn 4 (Berry) | pnpm | No clear win here: Yarn 4 works fine, migrating would add churn without real benefit |

## 6. Other Observations

- **Suspicious "Configure npm" step in `release.yml`**: the line
  `echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc` uses **single quotes**, so
  `${NPM_TOKEN}` is **not shell-expanded** — the generated `.npmrc` literally contains the string
  `${NPM_TOKEN}` (no real token), and the environment variable provided to that step is named
  `NODE_AUTH_TOKEN` (not `NPM_TOKEN`). This `.npmrc` is therefore non-functional — the actual
  publish only works because `@semantic-release/npm` reads `process.env.NPM_TOKEN` directly, which
  is correctly set in the following step (`Publish package on NPM`). This is not a secret leak
  (nothing sensitive is written), but it is misleading dead code that should be removed. ✅
- **npm provenance not explicitly enabled**: the `id-token: write` permission is present
  (required for OIDC), but nothing in `.releaserc.json`/`@semantic-release/npm` enables
  `--provenance`. Enabling it would give consumers a cryptographic proof of package provenance
  (the "Provenance" badge on npmjs.com).
- **Third-party actions with broad permissions, not pinned by SHA**: `wow-actions/add-badges@v1`
  and `bitovi/github-actions-storybook-to-github-pages@v1.0.3` are pinned by minor/major tag (not
  by commit SHA) and run with a token that has write access to the repo — pinning these two
  actions by SHA would reduce supply-chain risk if the tag were ever moved upstream.
- **Duplicate `CHANGELOG.md`** (root, generated by semantic-release, + a frozen
  `docs/CHANGELOG.md`) — clarify/remove the duplicate so readers don't consult the stale version.
- **`README.md` auto-updated by a bot** (`add-badges.yml`) after every release — a good way to
  avoid manual badge PRs, but it creates a commit outside the standard Conventional Commits flow
  (worth confirming that, since it pushes directly to `main`, it doesn't re-trigger `release.yml`
  in a loop without a `[skip ci]` marker).

## 7. Proposal — Unify Triggers on a Single Event (PR Merge → main)

### 7.1 Problem with the Current Cascade

Today the pipeline is split across two entry points (`pull_request` for `commitlint.yml`, `push`
to `main` for `release.yml`), then fanned out further via `workflow_run` for `e2e.yml`,
`deploy-demo.yml`, and `add-badges.yml`. `workflow_run` has real downsides:

- Each downstream workflow is a **separate Actions run**, so the pipeline's logs and status are
  scattered across 5 different runs instead of one coherent view.
- `workflow_run` only checks "did the source workflow succeed" — not "did anything actually get
  published". Concretely, **any** push to `main` that produces no release (e.g. a `docs:` or
  `chore:` commit, where semantic-release exits without publishing) still re-deploys Storybook,
  re-runs e2e, redeploys the demo, and updates the badges — wasted CI time and unnecessary
  redeploys.
- There's no shared job context/output between the workflows; each one has to re-derive
  everything it needs (checkout, install, etc.) from scratch.

### 7.2 Recommended Approach ✅

Merge the release-time workflows (`release.yml`, `e2e.yml`, `deploy-demo.yml`, `add-badges.yml`)
into a **single workflow file** (e.g. `.github/workflows/ci-cd.yml`) with one trigger:

```yaml
on:
  push:
    branches: [main]
```

Because `main` is (or should be) protected and only reachable via PR merge (see
[§7.6](#76-what-to-keep-separate)), a push to `main` **is**, in practice, "a PR was merged into
main". This keeps the trigger simple and matches exactly what `release.yml` already reacts to
today — the change is consolidating the four downstream workflows into the same file, replacing
`workflow_run` chaining with `needs:` job dependencies.

### 7.3 Job Graph ✅

Inside that single workflow, sequence/parallelize jobs with `needs:` instead of separate
workflow files:

```yaml
jobs:
  lint:      # no needs — runs immediately
  test:      # no needs — runs immediately, in parallel with lint
  build:     # needs: [] — can also run in parallel with lint/test (see §4)
  release:
    needs: [lint, test, build]
    outputs:
      published: ${{ steps.semantic.outputs.new_release_published }}
    steps:
      - id: semantic
        run: npx semantic-release --debug   # see §7.4 to expose outputs

  deploy-storybook:
    needs: release
    if: needs.release.outputs.published == 'true'

  e2e:
    needs: deploy-storybook
    if: needs.release.outputs.published == 'true'

  deploy-demo:
    needs: release
    if: needs.release.outputs.published == 'true'

  add-badges:
    needs: release
    if: needs.release.outputs.published == 'true'
```

One workflow run, one visible pipeline, and downstream jobs only fire when a release actually
happened.

### 7.4 Gating Downstream Jobs on an Actual Release ✅

The raw `npx semantic-release --debug` call used today doesn't expose whether a release was
published as a step/job output — that has to be parsed from logs, which is fragile. Switch to
[`cycjimmy/semantic-release-action@v4`](https://github.com/cycjimmy/semantic-release-action),
which wraps `semantic-release` and exposes proper outputs (`new_release_published`,
`new_release_version`, `new_release_major_version`, `new_release_minor_version`,
`new_release_patch_version`, `new_release_notes`). Example:

```yaml
release:
  needs: [lint, test, build]
  outputs:
    published: ${{ steps.semantic.outputs.new_release_published }}
  steps:
    - id: semantic
      uses: cycjimmy/semantic-release-action@v4
      env:
        GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
        NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This directly fixes the wasted-CI-minutes issue from [§7.1](#71-problem-with-the-current-cascade):
a `docs:`/`chore:`-only merge to `main` now only runs `lint` + `test` + `build` + `release`
(which correctly does nothing), and skips Storybook/e2e/demo/badges entirely.

### 7.5 Alternative Trigger: `pull_request` `closed` + `merged == true`

A more literal reading of "a PR was merged into main" is:

```yaml
on:
  pull_request:
    types: [closed]
    branches: [main]

jobs:
  release:
    if: github.event.pull_request.merged == true
```

This is semantically exact — it fires only for an actual merge, never for a closed-without-merge
PR or a direct push. However, it comes with a real gotcha: the default checkout for a
`pull_request` event resolves to the PR's head, **not** the post-merge state of `main` — the
workflow must explicitly check out
`${{ github.event.pull_request.merge_commit_sha }}` to build/release the right commit. It also
won't fire at all if `main` is ever updated by something other than a PR merge (e.g. an admin
direct push bypassing protection), whereas `push: branches: [main]` always reflects the true state
of the branch regardless of how it got there.

**Recommendation**: keep `push: branches: [main]` as the single trigger — it's simpler, always
builds the actual `main` HEAD, and is equivalent to "PR merged" as long as branch protection is
enabled (see [§3.2](#3-best-practices-to-apply)). Only reach for the `pull_request: closed` variant
if the pipeline later needs PR-specific metadata (PR number, labels, author) that isn't available
from a plain `push` event.

### 7.6 What to Keep Separate

`commitlint.yml` should **stay** a separate, `pull_request`-triggered workflow — it validates
commit messages and the PR title *before* a merge can even happen, which is a pre-merge gate, not
part of the post-merge release pipeline. Folding it into the single `push`-triggered workflow
would defeat its purpose (it needs to run and block *before* the merge exists). Combined with
[§3.1](#3-best-practices-to-apply) (adding a PR-triggered `ci.yml` for lint/test/build), the end
state is:

- **On PR** (blocking, required checks): `commitlint.yml` (commit/title format) + `ci.yml`
  (code lint, tests, build). ✅
- **On merge to `main`** (single trigger, single workflow): `ci-cd.yml` running
  `lint → test → build → release → [deploy-storybook → e2e, deploy-demo, add-badges]`, with the
  last four jobs skipped automatically when semantic-release published nothing. ✅
