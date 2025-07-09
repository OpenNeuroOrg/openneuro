import json

import pygit2


def get_version():
    """Return the worker version (lerna -> git hash -> unknown)"""
    try:
        with open('lerna.json') as lerna_file:
            return json.load(lerna_file)['version']
    except (FileNotFoundError, json.decoder.JSONDecodeError):
        try:
            return str(pygit2.Repository('.').head.target)
        except pygit2.GitError:
            return 'unknown'
