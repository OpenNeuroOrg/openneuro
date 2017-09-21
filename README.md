# [OpenNeuro](https://openneuro.org)

![CircleCI Build Status](https://circleci.com/gh/OpenNeuroOrg/openneuro.png?circle-token=d1fa3abe9dd6db187f656da7e7063663a67a2b69&style=shield)
[![CodeCov Coverage Status](https://codecov.io/gh/OpenNeuroOrg/openneuro/branch/master/graph/badge.svg)](https://codecov.io/gh/OpenNeuroOrg/openneuro)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## About

OpenNeuro is a free and open platform for analyzing and sharing neuroimaging data. It is based around the [Brain Imaging Data Structure specification](http://bids.neuroimaging.io/).

## Components

* [OpenNeuro app](app) - React frontend.
* [OpenNeuro server](server) - Node.js web backend.
* [OpenNeuro deployment scripts](https://github.com/poldracklab/crn_deploy) - Docker-compose scripts and configuration to deploy the system.
* [SciTran](https://github.com/poldracklab/bids-core) - Dataset management backend.
* [bids-app-host](https://github.com/OpenNeuroOrg/bids-app-host) - Docker wrapper for cloud hosted job execution.
* [bids-validator](https://github.com/INCF/bids-validator) - BIDS validation library.