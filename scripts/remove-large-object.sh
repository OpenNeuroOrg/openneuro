#!/bin/bash
# Steps
# 1. BACKUP THE DATASET
# 2. find-large-objects.sh to find targets
# 3. Run `remove-large-object.sh {object} {filename}` for each object to remove

set -x

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

# Find object will return two commits, where this object was created and changed
# Reverse topological order should return the initial creation to filter
COMMIT_TO_EDIT=$(git log --find-object=${1} --reverse --pretty=tformat:"%H" --topo-order | head -n1)
SHORT_COMMIT=${COMMIT_TO_EDIT:0:7}
# Automatically edit the right commit during the rebase
export GIT_SEQUENCE_EDITOR="sed -i 's/^pick ${SHORT_COMMIT}/edit ${SHORT_COMMIT}/;'"
# --strategy-option theirs = accept the working tree (original) changes over any files edited in this rebase
git rebase --strategy-option=theirs -i $COMMIT_TO_EDIT~1
# Remove from commit index but keep file
git rm --cached $2
# Add to the annex
git-annex add $2
# Amend to add annexed object
git commit --amend --no-edit
# Resume the rebase
git rebase --continue

# Cleanup our hook
rm .git/hooks/post-rewrite
