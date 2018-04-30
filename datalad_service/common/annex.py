def filter_git_files(files):
    """Remove any git/datalad files from a list of files."""
    return [f for f in files if not (f.startswith('.datalad/') or f == '.gitattributes')]
