# Releasing `@bugfreedback/bugfreedback`

This repo uses **release-please** for version bumps and publishes to npm from CI. Do **not** use hand-named `release/0.0.X` branches as the release mechanism.

## How it works

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push / PR to `main` | lint + test |
| `pages.yml` | push to `main` | deploy docs site |
| `release-please.yml` | push to `main` | open Release PR; **publish to npm** when a release is created |
| `publish.yml` | human Release published, or **workflow_dispatch** | manual / recovery npm publish |

```text
feat/fix PR ──merge──► main
                          │
                          ▼
              release-please opens
              "chore(main): release …" PR
                          │
                          merge ──► release-please creates GitHub Release
                                      │
                                      ▼
                              publish job (same workflow) ──► npm
```

### Why npm publish lives in `release-please.yml`

release-please creates GitHub Releases using `GITHUB_TOKEN`. **Events from `GITHUB_TOKEN` do not trigger other workflows** ([GitHub docs](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow)). So a separate `publish.yml` triggered by `release: published` **never runs** for release-please bot releases.

Human-created releases (`gh release create vX.Y.Z`) still trigger `publish.yml`.

## Day-to-day release process

### 1. Land changes on `main`

Use [Conventional Commits](https://www.conventionalcommits.org/) on PRs:

| Prefix | Effect (pre-1.0) |
|--------|------------------|
| `feat:` | minor bump → patch under pre-1.0 rules |
| `fix:` | patch bump |
| `docs:`, `chore:`, `ci:` | **no release** (release-please skips) |

### 2. Merge the Release PR

release-please opens a PR titled like:

```text
chore(main): release bugfreedback 0.0.6
```

Merge **that** PR (not a hand-named `release/0.0.X` branch).

### 3. Confirm publish

1. [Actions → release-please](https://github.com/bugfreedback/bugfreedback/actions/workflows/release-please.yml) — **`publish` job** should succeed
2. [GitHub Releases](https://github.com/bugfreedback/bugfreedback/releases) — tag `vX.Y.Z`
3. `npm view @bugfreedback/bugfreedback version`

## Recovery: publish an existing release to npm

If GitHub has a release but npm does not (e.g. before the publish chain fix):

1. Open [Actions → publish → Run workflow](https://github.com/bugfreedback/bugfreedback/actions/workflows/publish.yml)
2. Enter the tag (`v0.0.5` or legacy `bugfreedback-v0.0.5`)
3. Run workflow

Or via CLI:

```bash
gh workflow run publish.yml --ref main -f tag=bugfreedback-v0.0.5
```

## Version numbers in git vs npm

- **`package.json` on `main`** may lag behind npm — CI sets version from the release tag at publish time only (not committed back).
- **`.release-please-manifest.json`** is the release-please baseline on `main`.
- **npm** reflects the latest successful publish job.

## Org prerequisites

GitHub Actions for the `bugfreedback` org must allow:

- **Workflow permissions:** Read and write
- **Allow GitHub Actions to create and approve pull requests**

npm [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) for `publish.yml` (no `NPM_TOKEN` secret).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| GitHub Release exists, npm unchanged | bot release did not trigger `publish.yml` (pre-fix) or publish job failed | run `publish.yml` workflow_dispatch with tag |
| release-please succeeds but no Release PR | last commits were `docs:` / `chore:` | use `fix:` / `feat:` |
| release-please fails on PR permission | org Actions policy | enable write + PR creation |
| Wrong npm version from tag | legacy `bugfreedback-v*` tag | use `npm-publish.sh` tag normalization (fixed in CI) |
