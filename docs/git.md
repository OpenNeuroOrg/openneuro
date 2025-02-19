---
name: Git Access
route: /git
---

# Git access to OpenNeuro datasets

The underlying format for dataset is a git-annex repo created with datalad. Every dataset tracks changes as commits and snapshots are stored as git tags.

Datasets support clones, pushes, and other git operations. All datasets require authentication for access but public datasets will be available via anonymous clones in a future release.

## Repository conventions

A dataset must always be present in the root level of the repository.

OpenNeuro validates the size of regular git (non-annexed) files and a subset of bids-validation before accepting a git push. It is important to annex any large files in any commits before pushing. `.bidsignore` must always be a regular file. Some features are only available for regular files (such as diffing) and textual data is generally best kept as regular git objects.

A recommended `.gitattributes` configuration for git-annex to automate annexing the correct files when using `git add` or `datalad save`

```
* annex.backend=SHA256E
**/.git* annex.largefiles=nothing
*.bval annex.largefiles=nothing
*.bvec annex.largefiles=nothing
*.json annex.largefiles=largerthan=1mb
phenotype/*.tsv annex.largefiles=anything
*.tsv annex.largefiles=largerthan=1mb
dataset_description.json annex.largefiles=nothing
.bidsignore annex.largefiles=nothing
CHANGES annex.largefiles=nothing
README* annex.largefiles=nothing
LICENSE annex.largefiles=nothing
```

## Credential Helper

Using [@openneuro/cli](https://jsr.io/@openneuro/cli), git can be configured to automatically use your OpenNeuro credentials to allow access to datasets. This is the preferred method for authenticating regular git access. An advanced method of issuing a key is documented below if you cannot use the [git credential helper](https://git-scm.com/docs/gitcredentials) for your use case.

### Setup

Once you have logged in with `deno run -A jsr:@openneuro/cli`, you can configure git to automatically use your login.

```shell
# This allows the helper to identify which dataset you are accessing automatically and issue a key for that dataset
git config --global credential.https://openneuro.org.useHttpPath true
# Point git at the @openneuro/cli tool (this must be an absolute path)
git config --global credential.https://openneuro.org.helper "/path/to/deno -A jsr:@openneuro/cli git-credential"
```

If you are using [Git Credential Manager](https://github.com/git-ecosystem/git-credential-manager) add the provider entry to avoid duplicating entries.

```shell
git config credential.https://openneuro.org.provider generic
```

Or by modifying your .gitconfig:

```cfg
[credential "https://openneuro.org"]
  useHttpPath = true
  provider = generic
  helper = "/path/to/openneuro git-credential"
```

### Usage

Most datalad or git operations will work as expected but there are a few limitations. Force pushes or unrelated history will be rejected. Annexed data is accepted but only via the git transport, using other annexes will result in unreachable files or failed validation due to missing data.

Once the helper has been configured clone a repo:

```shell
# You can use git clone...
git clone https://openneuro.org/git/0/ds0000001
# Or datalad install
datalad install https://openneuro.org/git/0/ds0000001
cd ds0000001
# From here you can treat this like a datalad dataset and export back to OpenNeuro to deploy changes
```

When you are ready to push changes, make sure to validate them before attempting to push. OpenNeuro runs a limited version of BIDS validation on pushes and will reject datasets that cannot pass validation of the file tree. File contents are validated only after upload.

To push annexed files, see `Configuring OpenNeuro special remote` below.

### Advanced authentication

If you cannot use the credential helper you can manually generate a short lived key and pass this as the password for git operations. Substitute path= with the repository path for the dataset being accessed.

```bash
openneuro git-credential fill <<EOF
protocol=https
host=openneuro.org
path=/git/0/ds000001
EOF
```

## Snapshots

Snapshots are represented as git tags. To use all OpenNeuro features, you must have at least one tag with a valid semantic versioning name. This is typically `1.0.0` but can be any valid numeric semantic version.

## git-annex special remote

Direct access can clone, push, and pull dataset contents but it does not transfer annexed objects on its own. For public datasets, the annexed objects are available with a preconfigured remote on S3 shortly after the dataset is made public or a new snapshot is created if the dataset is already public.

For private datasets or to add new data with DataLad or git-annex, a special remote is available to push data directly to OpenNeuro.

### Configuring OpenNeuro special remote

```shell
# A script is provided to wrap the CLI as a special remote
curl https://raw.githubusercontent.com/OpenNeuroOrg/openneuro/refs/heads/master/bin/git-annex-remote-openneuro -o git-annex-remote-openneuro
# Make this executable and move this script to your path
chmod +x git-annex-remote-openneuro
```

Deno compile can be used if a single binary without network access is needed:

```shell
# This will create a `git-annex-remote-openneuro` executable you add to your path
deno compile -A --output git-annex-remote-openneuro jsr:@openneuro/cli
```

Obtain the URL from the dataset page and run initremote (or enableremote if you need to update it).

```shell
# You should see 'VERSION 1' 'EXTENSIONS' if this is working
echo "EXTENSIONS" | deno run -A jsr:@openneuro/cli special-remote
# Configure the remote with the URL for your dataset
git annex initremote openneuro type=external externaltype=openneuro encryption=none url=https://openneuro.org/git/0/ds0000001
```

To download annexed objects from the remote, you may need to manually ask git-annex update the local state of the OpenNeuro remote. You can force this update for all files:

```shell
git annex fsck --fast --from openneuro
```

After this you can use regular git-annex or datalad commands to upload or download any annexed files by using the openneuro remote.

```shell
# Download any annexed objects
datalad get .
```

```shell
# To upload any annexed objects to the remote
git annex copy --to openneuro
```
