# GitHub Branch Protection & Required Status Checks Setup

## Table of Contents

- [Why This Doc Exists](#why-this-doc-exists)
- [Prerequisite](#prerequisite)
- [Order to Follow](#order-to-follow)
- [Steps](#steps)
- [Checks to Require](#checks-to-require)
- [Notes](#notes)

## Why This Doc Exists

Branch protection rules and required status checks are configured in the GitHub repository
**settings**, not in any file tracked by git — nothing in `.github/workflows/` enforces that a
check actually blocks a merge, it only makes the check run and report a status. If this setting is
ever lost (repo re-created, transferred, forked, or someone needs to redo it), there is no code
diff to look at to know what to re-configure. This doc exists so that setup isn't tribal knowledge.

Context: `ci.yml` (see [AUDIT_BUILD_CI_CD_NPM.md §2.1](AUDIT_BUILD_CI_CD_NPM.md#21-no-ci-gate-on-prs)) runs `yarn lint`, `yarn test:ci`, and `yarn build`
on every PR via the reusable workflow `lint-test-build.yml`, but by default a failing run does
**not** block the "Merge" button — only a required status check does that.

## Prerequisite

GitHub only lists a check in the "required status checks" search field **after it has run at
least once on the repository** (within roughly the last 7 days). Since `ci.yml` only triggers on
`pull_request`, it must have executed on at least one PR before its check names become
selectable. If you don't see the checks below in the search field, open (or re-run) any PR first,
then come back.

## Order to Follow

Because of the [Prerequisite](#prerequisite) above, the checks can only be required *after*
`ci.yml` has run at least once. Concretely, do this in order:

1. Push the branch and open a PR targeting `main` (this triggers `ci.yml` for the first time).
2. Wait for that PR's `ci.yml` run to finish — success or failure doesn't matter, only that it
   ran and reported a status.
3. Go configure branch protection with the checks now selectable (see [Steps](#steps) below).
4. Merge the PR once protection is in place (or merge first and set up protection on the very
   next PR — either order works, but the checks won't be selectable until the first run exists).

## Steps

1. On GitHub, go to the repository → **Settings** → **Branches** (left sidebar, under "Code and
   automation").
2. Under **Branch protection rules**, either:
   - click the existing rule for `main`, or
   - click **Add branch protection rule** and set the branch name pattern to `main` if no rule
     exists yet.
3. Check **Require status checks to pass before merging**.
4. In the search field that appears, search for and add each check listed in
   [Checks to Require](#checks-to-require) below.
5. Click **Save changes**.

## Checks to Require

From `ci.yml` → `lint-test-build.yml` (see [ci.yml](../.github/workflows/ci.yml) and
[lint-test-build.yml](../.github/workflows/lint-test-build.yml)):

- `lint-test-build / lint`
- `lint-test-build / test`
- `lint-test-build / build`

Also worth enabling on the same rule while you're there (not required, but recommended for a
publicly-consumed npm package):

- **Require a pull request before merging** — blocks direct pushes to `main`, which also keeps
  the "push to `main` = PR was merged" assumption in
  [AUDIT_BUILD_CI_CD_NPM.md §7.2](AUDIT_BUILD_CI_CD_NPM.md#72-recommended-approach) actually true.
- **Require branches to be up to date before merging** — forces a rebase/merge of `main` into the
  PR branch before the checks above are trusted.
- **Require approvals** (at least 1) — no reviewer requirement currently exists. **Skip this for a
  solo-maintainer repo**: GitHub does not allow a PR author to approve their own PR, so with a
  single maintainer this setting would block every merge (no second account, no bypass). Only
  enable it once there is more than one maintainer with merge rights.

## Notes

- These settings are per-repository and are **not** exported/imported via any file in this repo —
  if the required checks ever need to be re-added (e.g. after renaming `lint-test-build.yml` or
  its jobs), the check names in [Checks to Require](#checks-to-require) must be updated to match
  the new job names, and re-selected in Settings → Branches.
- Renaming a job in `lint-test-build.yml` (e.g. `lint` → `eslint`) changes the required-check name
  GitHub reports — the old required check will then permanently show as "Expected — Waiting for
  status to be reported" until it's removed from the branch protection rule and replaced with the
  new name.
