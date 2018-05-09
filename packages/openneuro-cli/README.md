# OpenNeuro command line interface

This tool allows you to upload to [OpenNeuro.org](https://openneuro.org) without a browser.

# Install

Install globally with [yarn](https://yarnpkg.com/):

`yarn global add openneuro-cli`

Or with [npm](https://www.npmjs.com/):

`npm install -g openneuro-cli`

# Setup

Run `openneuro login` to configure credentials. This prompts you for the required configuration fields and saves this to .openneuro in your home directory or profile.

You can manually configure custom servers by editing this file.

# Usage

To upload a new dataset:

`openneuro upload <dataset directory>`

Your dataset must pass validation to upload but warnings can be skipped with `openneuro upload -i <dataset directory>`. A default label is set using the directory name.

To add files to an existing dataset:

`openneuro upload --dataset <accession number> <dataset directory>` 

This will add or replace any files in the dataset but does not delete any files that are only present in the server copy of the dataset.