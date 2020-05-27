#!/bin/bash
# Assuming all datasets are present in /datalad
for dataset in /datalad/*/; do
  cd "$dataset"
  # Verify this dataset has a public remote
  if git ls-remote --exit-code github; then
    # Obtain latest tag
    TAG=$(git describe --abbrev=0 --tags)
    # Re-export in case anything is missing
    git-annex export $TAG --to s3-PUBLIC
    git push github $TAG:master
    git push github git-annex:git-annex
    git push github --tags
  fi
done
