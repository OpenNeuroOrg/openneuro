# Setup

```bash
virtualenv --python python3.6 .venv
source .venv/bin/activate
```

# Running

```bash
gunicorn --reload datalad_server.app
```

# Tests

```bash
pytest
```
