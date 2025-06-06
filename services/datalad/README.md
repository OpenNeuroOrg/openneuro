---
name: DataLad Service
---

# DataLad Service

A backend component of OpenNeuro, this service provides HTTP interfaces for creating, updating, and exporting DataLad datasets, used by [OpenNeuro](https://openneuro.org). This allows the OpenNeuro API to queue backend tasks here and asynchronously respond to these signals to update clients.

# Setup

## uv (recommended)

```bash
uv sync --locked
```

## virtualenv

```bash
virtualenv --python python3 .venv
source .venv/bin/activate
pip install .
```

You will also need [npm](https://www.npmjs.com) or [Yarn](https://yarnpkg.com) to install the [bids-validator](https://github.com/INCF/bids-validator).

```bash
yarn
```

or

```bash
npm install
```

# Running

```bash
source .venv/bin/activate
export DATALAD_DATASET_PATH=/path/to/repos
uvicorn --factory "datalad_service.app:create_app"
```

# Tests

```bash
uv sync --dev
uv run pytest -n auto
```
