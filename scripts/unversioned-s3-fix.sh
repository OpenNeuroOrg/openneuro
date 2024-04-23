#!/bin/bash
set -e
# Perform basic maintenance
git repack -A -l -d --pack-kept-objects && git gc
# Remove old remote (rename)
git-annex renameremote s3-PUBLIC s3-PUBLIC-unversioned && git remote rename s3-PUBLIC s3-PUBLIC-unversioned && git-annex dead s3-PUBLIC-unversioned && git remote rm s3-PUBLIC-unversioned
# Recreate the s3-public remote
export WORKING_DATASET=$PWD
cd /srv
python -c "import datalad_service; import os; datalad_service.common.s3.setup_s3_sibling(os.environ['WORKING_DATASET'])"
cd $WORKING_DATASET
# Export all tags in order
git-annex enableremote s3-PUBLIC public=no
for tag in $(git tag); do git-annex export $tag --to=s3-PUBLIC; done
# Push all refs to github
git push github $(git describe --tags --abbrev=0):refs/heads/main && git push github $(git describe --tags --abbrev=0):refs/heads/master && git push github --tags && git push github git-annex:git-annex
