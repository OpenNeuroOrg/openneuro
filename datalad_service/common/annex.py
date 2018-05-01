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
