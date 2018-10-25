# OpenNeuro command line interface

This tool allows you to upload and download [OpenNeuro.org](https://openneuro.org) datasets without a browser.

# Install

1. Install [Node.js](https://nodejs.org)
2. In a terminal type: `npm install -g openneuro-cli`

If you are using [yarn](https://yarnpkg.com/) you can also perform the installation with `yarn global add openneuro-cli`
(make sure the installation folder is part of your `PATH` by adding `export PATH="$(yarn global bin):$PATH"` to `~/.bashrc`)

# Setup

Run `openneuro login` to configure credentials. This prompts you for the required configuration fields and saves this to .openneuro in your home directory or profile.

You can manually configure custom servers by editing this file.

# Usage

## Uploading datasets

To upload a new dataset:

`openneuro upload <dataset directory>`

Your dataset must pass validation to upload but warnings can be skipped with `openneuro upload -i <dataset directory>`. A default label is set using the directory name.

To resume an interrupted upload or add files to an existing dataset:

`openneuro upload --dataset <accession number> <dataset directory>`

where <accession_number> is a unique dataset identifier that can be found in the URL. For example accession number for `https://openneuro.org/datasets/ds001555` is `ds001555`.

This command will add or replace any files in the dataset but does not delete any files that are only present in the server copy of the dataset.

## Downloading datasets

To download a snapshot:

`openneuro download <accession number> <destination directory>`

To download the current draft files:

`openneuro download --draft <accession number> <destination directory>`

If the destination directory does not exist, it will be created. Any files from the dataset that are already present in the directory will be skipped, allowing you to resume an interrupted download.
