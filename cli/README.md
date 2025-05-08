---
name: Command Line Interface
route: /cli
---

# OpenNeuro command line interface

This tool allows you to upload and download [OpenNeuro.org](https://openneuro.org) datasets without a browser.

## Install

1. Install [Deno](https://deno.land/) via [any supported installation method](https://docs.deno.com/runtime/manual/getting_started/installation).
2. Install with `deno install -A --global jsr:@openneuro/cli -n openneuro`

To download annexed files, you will need the git-annex special remote for OpenNeuro.

```shell
# A script is provided to wrap the CLI as a special remote
curl https://raw.githubusercontent.com/OpenNeuroOrg/openneuro/refs/heads/master/bin/git-annex-remote-openneuro -o git-annex-remote-openneuro
# Make this executable and move this script to your path
chmod +x git-annex-remote-openneuro
```

## Setup

The setup step is needed for both uploading _and_ downloading data from OpenNeuro.

Run `deno run -A jsr:@openneuro/cli login` to configure credentials.
This prompts you for the required configuration fields and these are saved in Deno's local storage.

`deno run -A jsr:@openneuro/cli login` will require you to enter an API key.

You can obtain an API key via a browser on [OpenNeuro](https://openneuro.org/keygen) after logging to the OpenNeuro platform via one of the provided authentication services (for example ORCID).

You can also specify this as an option or environment variable.

```shell
# For scripts
export OPENNEURO_API_KEY=<api_key>
openneuro login --error-reporting true
```

## Usage

### Uploading datasets

To upload a new dataset:

```shell
# Path to the dataset root (directory containing dataset_description.json)
openneuro upload --affirmDefaced path/to/dataset
```

Your dataset must pass validation to upload but warnings can be skipped with `deno run -A jsr:@openneuro/cli upload --ignoreWarnings path/to/dataset`.

To resume an interrupted upload or add files to an existing dataset:

```shell
# Add files to an existing dataset
openneuro upload --dataset ds000001 path/to/dataset
```

where <accession_number> is a unique dataset identifier that can be found in the URL. For example accession number for `https://openneuro.org/datasets/ds001555` is `ds001555`.

This command will add or replace any files in the dataset but does not delete any files that are only present in the server copy of the dataset.

### Downloading datasets

Downloads using the CLI will create a DataLad dataset and configure a special remote to retrieve the larger annexed files from OpenNeuro.

To download a snapshot:

```shell
openneuro download <accession number> <destination directory>
```

To download the current draft files:

```shell
openneuro download --draft <accession number> <destination directory>
```

If the destination directory does not exist, it will be created.

To download the annexed objects, use [DataLad](https://datalad.org/) or [git-annex](https://git-annex.branchable.com).

```shell
cd ds000001
# Make sure you have the `git-annex-remote-openneuro` script available in your path
git-annex get <path or paths to download>
# DataLad is supported as well
datalad get <path or paths to download>
```

### Debugging issues

To debug issues - enable logging and provide this log to support or open a GitHub issue.

```bash
# Linux or macOS
export OPENNEURO_LOG=DEBUG
deno run --reload -A jsr:@openneuro/cli upload --affirmDefaced path/to/dataset
```

```powershell
# Windows with PowerShell
$env:OPENNEURO_LOG="DEBUG"
deno run --reload -A jsr:@openneuro/cli upload --affirmDefaced path\to\dataset
```

### Implementation Notes

This tool uses isomorphic git to download, modify, and push datasets using OpenNeuro's [git interface](https://docs.openneuro.org/git.html). Other tools that support git and git-annex repositories such as [DataLad](https://www.datalad.org/) can also be used with the local copy.