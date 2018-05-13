This provides HTTP interfaces for creating, updating, and exporting DataLad datasets, used by [OpenNeuro](https://openneuro.org).

Higher level APIs are provided as part of [OpenNeuro server](https://github.com/OpenNeuroOrg/openneuro/tree/master/server).

# Setup

```bash
virtualenv --python python3 .venv
source .venv/bin/activate
pip install -r requirements.txt
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
gunicorn --reload "datalad_service.app:create_app('/path-to-repos')"
```

# Tests

```bash
pytest
```
