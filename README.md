---
name: Introduction
---

# [OpenNeuro](https://openneuro.org)

[![CodeCov Coverage Status](https://codecov.io/gh/OpenNeuroOrg/openneuro/branch/master/graph/badge.svg)](https://codecov.io/gh/OpenNeuroOrg/openneuro)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## About

OpenNeuro is a free and open platform for analyzing and sharing neuroimaging data. It is based around the [Brain Imaging Data Structure specification](http://bids.neuroimaging.io/).

## Development setup

This project is managed with [Lerna](https://lernajs.io/) and [Yarn](https://yarnpkg.com/). To get started, install Yarn and bootstrap the repo.

```shell
yarn install && yarn bootstrap
```

You can run tests with `yarn test` at the top level of the project. For each package, `yarn test --watch` will interactively run the tests for changes since the last commit.

Before starting up the services, you will need to copy the example `.env.example` file to `.env` and `config.env.example` to `config.env`. Many of the values are optional, and most that aren't have default values included in their `.example` file. The exception is `JWT_SECRET` in `config.env`, which you will need to set to a large random string.

[docker-compose](https://docs.docker.com/compose/overview/) is used to run a local copy of all required services together.

```shell
# This will run docker-compose in the background (-d flag is --detach)
yarn start -d
```

For example, you can restart the server container with `docker-compose restart server` or view logs with `docker-compose logs -f --tail=10 server`.

## Components

- [OpenNeuro app](packages/openneuro-app) - React frontend.
- [OpenNeuro server](packages/openneuro-server) - Node.js web backend.
- [DataLad service](https://github.com/OpenNeuroOrg/datalad-service) - [DataLad](http://datalad.org/) microservice.
- [bids-app-host](https://github.com/OpenNeuroOrg/bids-app-host) - Docker wrapper for cloud hosted job execution.
- [bids-validator](https://github.com/bids-standard/bids-validator) - BIDS validation library.

## OpenNeuro Command-line utility tool

OpenNeuro supports a [CLI tool](https://docs.openneuro.org/openneuro-packages-openneuro-cli-readme) based on [nodejs](https://nodejs.org/en/) for uploading and downloading OpenNeuro datasets.
