# Releasing `@bugfreedback/bugfreedback`

This repo uses **release-please** for version bumps and **GitHub Releases** to trigger npm publish. Do **not** use hand-named `release/0.0.X` branches as the release mechanism.

## How it works

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | push / PR to `main` | lint + test |
| `pages.yml` | push to `main` | deploy docs site |
| `release-please.yml` | push to `main` | open Release PR when releasable commits land |
| `publish.yml` | **GitHub Release published** | build + publish to npm (Trusted Publishing / OIDC) |

**Merging a feature PR to `main` does not publish to npm.**

```text
feat/fix PR ──merge──► main
                          │
                          ▼
              release-please opens
              "chore(main): release bugfreedback X.Y.Z" PR
                          │
                          merge ──► GitHub Release created
                                      │
                                      ▼
                              publish.yml ──► npm
```

## Day-to-day release process

### 1. Land changes on `main`

Use [Conventional Commits](https://www.conventionalcommits.org/) on PRs:

| Prefix | Effect (pre-1.0) |
|--------|------------------|
| `feat:` | minor bump → patch under pre-1.0 rules |
| `fix:` | patch bump |
| `docs:`, `chore:`, `ci:` | **no release** (release-please skips) |

Examples:

```text
fix(annotator): restore 50/50 toolbar layout
feat(host): add modal backdrop blur option
```

### 2. Merge the Release PR

After releasable commits merge to `main`, **release-please** opens a PR titled like:

```text
chore(main): release bugfreedback 0.0.5
```

That PR updates:

- `.release-please-manifest.json`
- `CHANGELOG.md`

**Merge that PR** — do not create a manual `release/0.0.X` branch for this step.

### 3. Confirm publish

1. Check [GitHub Releases](https://github.com/bugfreedback/bugfreedback/releases) for the new tag (`vX.Y.Z`).
2. Check [Actions → publish](https://github.com/bugfreedback/bugfreedback/actions/workflows/publish.yml) for a green run.
3. Verify npm: `npm view @bugfreedback/bugfreedback version`

## Version numbers in git vs npm

- **`package.json` on `main`** may lag behind npm — the publish job sets the version from the release tag at publish time only (not committed back).
- **`.release-please-manifest.json`** is the source of truth for the last release-please-managed version on `main`.
- **npm** reflects the latest published GitHub Release.

## Docs-only changes

`docs:` commits do not trigger release-please. Options:

1. **No npm release** — README on GitHub updates when merged; npm README updates on the next code release.
2. **Use `fix(readme):`** if you intentionally want a patch release.
3. **Manual release** (exceptional):

   ```bash
   gh release create v0.0.X --title "v0.0.X" --notes "..." --target main
   ```

   Then sync `.release-please-manifest.json` to match in a follow-up PR.

## Manual release (break glass)

Only when release-please is out of sync or you need an emergency publish:

```bash
gh release create v0.0.X --title "v0.0.X" --notes-file CHANGELOG.md --target main
```

After a manual release, open a PR to set `.release-please-manifest.json` to the same version so the next automated release starts from the correct baseline.

## Org prerequisites

GitHub Actions for the `bugfreedback` org must allow:

- **Workflow permissions:** Read and write
- **Allow GitHub Actions to create and approve pull requests**

Settings: https://github.com/organizations/bugfreedback/settings/actions

npm [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) must be configured for `publish.yml` (see workflow comments — no `NPM_TOKEN` secret).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| release-please fails with PR permission error | org Actions policy | enable write + PR creation (above) |
| release-please succeeds but no Release PR | last commits were `docs:` / `chore:` | use `fix:` / `feat:` or manual release |
| merge to `main` but no npm publish | no GitHub Release yet | merge release-please Release PR or create release manually |
| manifest behind npm | manual release without sync PR | bump `.release-please-manifest.json` on `main` |
