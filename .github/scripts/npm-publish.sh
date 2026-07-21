#!/usr/bin/env bash
set -euo pipefail

# Normalize release tag to semver for package.json / npm publish.
# Supports v0.0.5 and bugfreedback-v0.0.5 (legacy release-please tags).
tag_to_version() {
  local tag="$1"
  echo "$tag" | sed -E 's/^[a-zA-Z0-9_@/.-]+-v/v/; s/^v//'
}

TAG="${1:-${RELEASE_TAG:-}}"
if [[ -z "$TAG" ]]; then
  echo "Usage: npm-publish.sh <git-tag>" >&2
  exit 1
fi

VERSION="$(tag_to_version "$TAG")"
echo "Publishing @bugfreedback/bugfreedback@${VERSION} (from tag ${TAG})"

npm ci
npm run dev:prepare
npm run prepack
npm version "$VERSION" --no-git-tag-version --allow-same-version
npm publish --access public
