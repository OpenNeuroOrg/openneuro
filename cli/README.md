# OpenNeuro CLI for Deno

Command line tools for OpenNeuro. Upload and download support for working with OpenNeuro datasets from the command line.

## Install

Download deno via [any supported installation method](https://docs.deno.com/runtime/manual/getting_started/installation).

## Usage

OpenNeuro CLI will validate your dataset with the [bids-validator](https://github.com/bids-standard/bids-validator/) and then allow you to upload to OpenNeuro. If you wish to make changes to a dataset, the CLI can download, allow you to make local changes, and reupload only the changes to OpenNeuro.

```shell
# Interactive help
deno run -A jsr:@openneuro/cli --help
# Available for each subcommand
deno run -A jsr:@openneuro/cli upload --help
```

### Login

To upload or download data from OpenNeuro, login with your account.

```shell
# Run login and follow the prompts
deno run -A jsr:@openneuro/cli login
```

You can also create an API key on [OpenNeuro](https://openneuro.org/keygen) and specify this as an option or environment variable.

```shell
# For scripts
export OPENNEURO_API_KEY=<api_key>
deno run -A jsr:@openneuro/cli login --error-reporting true
```

### Uploading

```shell
# Path to the dataset root (directory containing dataset_description.json)
deno run -A jsr:@openneuro/cli upload --affirmDefaced path/to/dataset
```

```shell
# Add files to an existing dataset
deno run -A jsr:@openneuro/cli upload --dataset ds000001 path/to/dataset
```

```shell
# To debug issues - enable logging and provide this log to support or open a GitHub issue
export OPENNEURO_LOG=INFO
deno run -A jsr:@openneuro/cli upload --affirmDefaced path/to/dataset
```

## Implementation Notes

This tool uses isomorphic git to download, modify, and push datasets using OpenNeuro's [git interface](https://docs.openneuro.org/git.html). Other tools that support git and git-annex repositories such as [DataLad](https://www.datalad.org/) can also be used with the local copy.
