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
EXEC="(${FIND_ADD}) | ${REMOVE_FROM_STDIN} && git annex add . && git commit --amend --no-edit"

# Find object will return two commits, where this object was created and changed
# Reverse topological order should return the initial creation to filter
COMMIT_TO_EDIT=$(git log --find-object=${1} --reverse --pretty=tformat:"%H" --topo-order | head -n1)
SHORT_COMMIT=${COMMIT_TO_EDIT:0:7}
# Automatically edit the right commit during the rebase
export GIT_SEQUENCE_EDITOR="sed -i 's/^pick ${SHORT_COMMIT}/edit ${SHORT_COMMIT}/;'"
# --strategy-option theirs = accept the working tree (original) changes over any files edited in this rebase
# Remove empty commits while we're here
# Find any added or changed files in the commit, remove and add with git-annex
git rebase --strategy-option=theirs --no-keep-empty --exec "$EXEC" $TAG

# Cleanup our hook
rm .git/hooks/post-rewrite
