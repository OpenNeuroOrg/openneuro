# OpenNeuro CLI for Deno

Command line tools for OpenNeuro implemented in Deno. Deno eliminates the need to install the CLI and allows for more code reuse with OpenNeuro's web frontend.

## Install

Download deno via [any supported installation method](https://docs.deno.com/runtime/manual/getting_started/installation).

## Usage

OpenNeuro CLI will validate your dataset with the [bids-validator](https://github.com/bids-standard/bids-validator/) and then allow you to upload to OpenNeuro. If you wish to make changes to a dataset, the CLI can download, allow you to make local changes, and reupload only the changes to OpenNeuro.

### Login

To upload or download data from OpenNeuro, login with your account.

```shell
# Run login and follow the prompts
deno run -A cli/openneuto.ts login
```

You can also create an API key on [OpenNeuro](https://openneuro.org/keygen) and specify this as an option or environment variable.

```shell
# For scripts
export OPENNEURO_API_KEY=<api_key>
deno run -A cli/openneuro.ts login --error-reporting true
```

### Uploading

```shell
# Path to the dataset root (directory containing dataset_description.json)
deno run -A cli/openneuro.ts upload --affirmDefaced path/to/dataset
```

```shell
# To debug issues - enable logging and provide this log to support or open a GitHub issue
export OPENNEURO_LOG=INFO
deno run -A cli/openneuro.ts upload --affirmDefaced path/to/dataset
```

## Implementation Notes

This tool uses isomorphic git to download, modify, and push datasets using OpenNeuro's [git interface](https://docs.openneuro.org/git.html). Other tools that support git and git-annex repositories such as [DataLad](https://www.datalad.org/) can also be used with the local copy.
