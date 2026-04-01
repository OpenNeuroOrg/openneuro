"""File-based cache for pre-computed snapshot file listings.

Stores recursive file trees in .git/openneuro/tags/{tag}.json.gz so they
can be served without recomputation. Uses gzip to keep disk usage low.
"""

import gzip
import json
import logging
import os

logger = logging.getLogger('datalad_service.' + __name__)


def _cache_path(dataset_path, tag):
    """Return the path to the cache file for a given tag."""
    return os.path.join(dataset_path, '.git', 'openneuro', 'tags', f'{tag}.json.gz')


def read_tag_cache_raw(dataset_path, tag):
    """Read the raw gzip bytes for a tag cache, or return None on miss."""
    path = _cache_path(dataset_path, tag)
    try:
        with open(path, 'rb') as f:
            return f.read()
    except (FileNotFoundError, OSError) as e:
        logger.debug(f'Tag cache miss for {tag}: {e}')
        return None


def write_tag_cache(dataset_path, tag, files):
    """Write a file listing to the tag cache."""
    path = _cache_path(dataset_path, tag)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with gzip.open(path, 'wt', encoding='utf-8') as f:
        json.dump(files, f, separators=(',', ':'))
    logger.info(f'Wrote tag cache for {tag} ({len(files)} files)')


def delete_tag_cache(dataset_path, tag):
    """Remove a cached file listing for a tag."""
    path = _cache_path(dataset_path, tag)
    try:
        os.remove(path)
    except FileNotFoundError:
        pass
