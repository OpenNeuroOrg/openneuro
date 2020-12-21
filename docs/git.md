---
name: Git Access
route: git
---

# Git access to OpenNeuro datasets

The underlying format for dataset is a git-annex repo created with datalad. Every dataset tracks changes as commits and snapshots are stored as git tags.

Datasets support clones, pushes, and other git operations. All datasets require authentication for access but public datasets will be available via anonymous clones in a future release.

## Credential Helper

Using openneuro-cli, git can be configured to automatically use your OpenNeuro credentials to allow access to datasets. This is the preferred method for authenticating regular git access. An advanced method of issuing a key is documented below if you cannot use the [git credential helper](https://git-scm.com/docs/gitcredentials) for your use case.

### Setup

Once you have openneuro-cli installed and you've logged in with `openneuro login`, you can configure git to automatically use your login.

```shell
# This allows the helper to identify which dataset you are accessing automatically and issue a key for that dataset
git config credential.useHttpPath true
# Point git at the openneuro-cli tool (this must be an absolute path)
git config credential.helper "/path/to/openneuro git-credential"
```

Alternatively openneuro-cli can be given the name `git-credential-openneuro` and this shorter command will work.

```shell
git config credential.helper "openneuro"
```

This will configure these options for one repository.

### Usage

Most datalad or git operations will work as expected but there are a few limitations. Force pushes or unrelated history will be rejected. Annexed data is accepted but only via the git transport, using other annexes will result in unreachable files or failed validation due to missing data.

To download a new dataset using the credential helper you can start with an empty repo and then configure that repo.

```shell
mkdir ds000001
cd ds0000001
git init
git remote add origin https://openneuro.org/git/0/ds0000001
# Follow the above steps to setup the credential helper
git pull origin master
git pull origin git-annex:git-annex
# From here you can treat this like a datalad dataset and export back to OpenNeuro to deploy changes
```

When you are ready to push changes, make sure to validate them before attempting to push. OpenNeuro will reject some invalid pushes but cannot run the full bids-validator until after your changes have been pushed.

## Snapshots

Snapshots are represented as git tags. To use all OpenNeuro features, you must have at least one tag with a valid semantic versioning name. This is typically `1.0.0` but can be any valid semantic version.

Other tags are allowed but will not be published to S3. This can be useful but the only way to retrieve the full copy of these snapshots at the moment is via direct git access. They will appear on the web.
