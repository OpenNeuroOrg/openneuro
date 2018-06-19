This provides HTTP interfaces for creating, updating, and exporting DataLad datasets, used by [OpenNeuro](https://openneuro.org). Underlying Git / DataLad APIs do not allow for concurrent operations in many cases, to solve this each repo is assigned to an exclusive-read queue. Multiple clients accessing one repo requires a higher level API, such as the one implemented in OpenNeuro.

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
