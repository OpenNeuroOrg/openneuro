# [OpenNeuro](https://openneuro.org)

[![CodeCov Coverage Status](https://codecov.io/gh/OpenNeuroOrg/openneuro/branch/master/graph/badge.svg)](https://codecov.io/gh/OpenNeuroOrg/openneuro)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## About

OpenNeuro is a free and open platform for analyzing and sharing neuroimaging data. It is based around the [Brain Imaging Data Structure specification](http://bids.neuroimaging.io/).

## Development setup

This project is managed with [Lerna](https://lerna.js.org/) and [Yarn](https://yarnpkg.com/). To get started, install Yarn and bootstrap the repo.

```shell
yarn install
```

You can run tests with `yarn test` at the top level of the project. For each package, `yarn test --watch` will interactively run the tests for changes since the last commit.

Before starting up the services, you will need to copy the example `.env.example` file to `.env` and `config.env.example` to `config.env`. Many of the values are optional, and most that aren't have default values included in their `.example` file. Required values below:

- `JWT_SECRET` in `config.env` must be set to a large random string.
- `PERSISTENT_DIR` in `.env` is an absolute path to a directory that will be used to store datasets. This should be a git-annex compatible filesystem and large enough to store some test datasets.

To setup Google as an authentication provider, [register a new client app](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow) and set the following variables. For development use, you will create a new Google project with oauth credentials for a JavaScript client side app. "Authorized JavaScript Origins" is set to `http://localhost:9876` and "Authorized Redirect URIs" is set to `http://localhost:9876/crn/auth/google/callback` for a site accessible at `http://localhost:9876`.

```
# Ending in .apps.googleusercontent.com
GOOGLE_CLIENT_ID=
# 24 character secret string
GOOGLE_CLIENT_SECRET=
```

[podman-compose](https://github.com/containers/podman-compose) is used to run a local copy of all required services together.

```shell
# This will run podman-compose in the background (-d flag is --detach)
podman-compose up -d
```

For example, you can restart the server container with `podman-compose restart server` or view logs with `podman-compose logs -f --tail=10 server`.

## Major Components

- [OpenNeuro app](https://github.com/OpenNeuroOrg/openneuro/tree/master/packages/openneuro-app) - React frontend
- [OpenNeuro server](https://github.com/OpenNeuroOrg/openneuro/tree/master/packages/openneuro-server) - Node.js GraphQL API
- [OpenNeuro indexer](https://github.com/OpenNeuroOrg/openneuro/tree/master/packages/openneuro-indexer) - ElasticSearch indexer
- [OpenNeuro components](https://github.com/OpenNeuroOrg/openneuro/tree/master/packages/openneuro-components) - ReactJS components library
- [OpenNeuro CLI](packages/openneuro-cli) - Node.js command line tool
- [OpenNeuro client](https://github.com/OpenNeuroOrg/openneuro/tree/master/packages/openneuro-client) - JavaScript client library used in CLI and App
- [DataLad service](https://github.com/OpenNeuroOrg/datalad-service) - [DataLad](http://datalad.org/) compatible dataset worker microservice
- [bids-validator](https://github.com/bids-standard/bids-validator) - BIDS validation library

JavaScript packages are published in the `@openneuro` npm namespace.

## OpenNeuro Command-line utility tool

OpenNeuro supports a [CLI tool](https://docs.openneuro.org/openneuro-packages-openneuro-cli-readme) based on [nodejs](https://nodejs.org/en/) for uploading and downloading OpenNeuro datasets.
