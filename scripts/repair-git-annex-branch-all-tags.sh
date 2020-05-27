#!/bin/bash
# Assuming all datasets are present in /datalad
for dataset in /datalad/*/; do
  cd "$dataset"
  # Verify this dataset has a public remote
  if git ls-remote --exit-code github; then
    # Obtain latest tag
    LATEST=$(git describe --abbrev=0 --tags)
    # For each tag, export in chronological order to S3.
    for TAG in $(git for-each-ref --sort=creatordate --format '%(refname:short)' refs/tags); do
      git-annex export $TAG --to s3-PUBLIC
    done
    # Push the most recent tag to master (draft changes not synced)
    git push github $LATEST:master
    # Move git-annex branch forward
    git push github git-annex:git-annex
    # Push tags
    git push github --tags
  fi
done
