from datalad.config import ConfigManager


SERVICE_EMAIL = 'git@openneuro.org'
SERVICE_USER = 'Git Worker'


def filter_git_files(files):
    """Remove any git/datalad files from a list of files."""
    return [f for f in files if not (f.startswith('.datalad/') or f == '.gitattributes')]


def get_repo_files(dataset, branch=None):
    working_files = filter_git_files(dataset.repo.get_files(branch=branch))
    files = []
    for filename in working_files:
        key = dataset.repo.get_file_key(filename)
        size = dataset.repo.get_size_from_key(key)
        files.append({'filename': filename, 'size': size, 'id': key})
    return files


class CommitInfo():
    """Context manager for setting commit info on datalad operations that use it."""

    def __init__(self, dataset, email=None, name=None):
        self.config_manager = ConfigManager(dataset)
        self.email = email if email else SERVICE_EMAIL
        self.name = name if name else SERVICE_USER

    def __enter__(self):
        self.config_manager.set('user.email', self.email, 'local')
        self.config_manager.set('user.name', self.name, 'local')

    def __exit__(self, exception_type, exception_value, traceback):
        self.config_manager.set('user.email', SERVICE_EMAIL, 'local')
        self.config_manager.set('user.name', SERVICE_USER, 'local')
