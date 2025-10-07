#!/bin/bash
# 
# Replay the commit history since a tag, and reannex any large objects
#
# Steps
# 1. BACKUP THE DATASET
# 2. Run `reannex-to-tag.sh {tag}` to replay the commit history

TAG=$1

set -ex

# This hook rewrites the tags after the rebase - from https://ownyourbits.com/2017/08/14/rebasing-in-git-without-losing-tags/#comment-42731
cat <<EOF > .git/hooks/post-rewrite
#!/bin/bash
[ "\$1" = "rebase" ] || exit 0

set -e

once=false
shopt -s lastpipe

while read o n
do
git tag --points-at \$o | while read t
do
\$once || { echo >&2; once=true; }
echo "Rewrite tag: \$t" >&2
git tag -f "\$t" \$n >/dev/null
done
done
EOF
chmod +x .git/hooks/post-rewrite

FIND_ADD="echo NOMATCH*NOMATCH; git diff-tree --no-commit-id --name-only -r --diff-filter=AMT HEAD"
REMOVE_FROM_STDIN="git rm --cached --ignore-unmatch --pathspec-from-file=-"
COMMIT_IF_NEEDED="git diff --cached --quiet || git commit --allow-empty --amend --no-edit"
EXEC="(${FIND_ADD}) | ${REMOVE_FROM_STDIN} && git annex add -J4 . && (${COMMIT_IF_NEEDED})"

# --strategy-option theirs = accept the working tree (original) changes over any files edited in this rebase
# Find any added or changed files in the commit, remove and add with git-annex
git rebase --committer-date-is-author-date --strategy-option=theirs --exec "$EXEC" $TAG

# The above rebase can pause, which ends this script.
# If that happens, then everything after this should be run manually.
#
# The main reason for pauses is that we fix a file in an earlier commit
# and a later commit deletes it. To preserve author intent, we need to
# delete these files:
#
#   git rm $(git diff --name-only --diff-filter=U) && git commit --no-edit && git rebase --continue
#
# I haven't figured out how to automate this, but that line does the job for now.


# Clean up any newly empty commits
git rebase --committer-date-is-author-date --no-keep-empty $TAG

# Cleanup our hook
rm .git/hooks/post-rewrite
