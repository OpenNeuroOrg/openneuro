import io
import pathlib
import contextlib
from unittest import mock
from unittest.mock import patch

import aiofiles
import httpx
import pygit2
import pytest

from datalad_service.common.git import (
    OpenNeuroGitError,
    git_show_content,
    git_tag,
    stream_from_reader,
    stream_from_url,
)


@pytest.fixture
def git_repo(tmp_path):
    """Create a minimal pygit2 repository for fast unit testing without git-annex."""
    repo = pygit2.init_repository(str(tmp_path), False)
    author = pygit2.Signature('Git Worker', 'git@openneuro.org')
    # Create an initial commit with a README
    readme_path = tmp_path / 'README'
    readme_path.write_text('Initial repository\n')
    repo.index.add('README')
    repo.index.write()
    tree_id = repo.index.write_tree()
    repo.create_commit('HEAD', author, author, 'Initial commit', tree_id, [])
    return repo


def commit_file(repo, filename, content=None, symlink_target=None, message='Add file'):
    """Helper to commit a file or symlink to a pygit2 repository."""
    dataset_root = pathlib.Path(repo.path).parent
    target_path = dataset_root / filename
    target_path.parent.mkdir(parents=True, exist_ok=True)

    if symlink_target is not None:
        if target_path.is_symlink() or target_path.exists():
            target_path.unlink()
        target_path.symlink_to(symlink_target)
    elif content is not None:
        if isinstance(content, str):
            content = content.encode('utf-8')
        target_path.write_bytes(content)

    repo.index.add(filename)
    repo.index.write()
    tree_id = repo.index.write_tree()
    author = pygit2.Signature('Git Worker', 'git@openneuro.org')
    commit_id = repo.create_commit(
        'HEAD', author, author, message, tree_id, [repo.head.target]
    )
    return commit_id


async def read_stream(stream):
    """Helper to consume an async generator stream into bytes."""
    chunks = []
    async for chunk in stream:
        chunks.append(chunk)
    return b''.join(chunks)


def make_mock_httpx_client(head_resp=None, stream_resp=None):
    """Create a mock httpx.AsyncClient supporting async context manager for client and client.stream."""
    mock_client = mock.MagicMock()
    mock_client.__aenter__ = mock.AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = mock.AsyncMock(return_value=None)
    if head_resp is not None:
        mock_client.head = mock.AsyncMock(return_value=head_resp)
    if stream_resp is not None:

        @contextlib.asynccontextmanager
        async def fake_stream(*args, **kwargs):
            yield stream_resp

        mock_client.stream = fake_stream
    return mock_client


def test_git_tag(git_repo):
    author = pygit2.Signature('Tagger', 'test@example.com')
    commit = git_repo.revparse_single('HEAD')
    git_repo.create_tag(
        '1.0.0', str(commit.id), pygit2.enums.ObjectType.COMMIT, author, 'test tag'
    )
    assert git_tag(git_repo)[0].name == 'refs/tags/1.0.0'


@pytest.mark.asyncio
async def test_git_show_content_git_object_small(git_repo):
    """Test standard git object smaller than 4096 bytes."""
    content = b'Small git content'
    commit_file(git_repo, 'small.txt', content=content)

    stream, size = await git_show_content(git_repo, 'HEAD', 'small.txt')
    assert size == len(content)
    result = await read_stream(stream)
    assert result == content


@pytest.mark.asyncio
async def test_git_show_content_git_object_large(git_repo):
    """Test standard git object larger than 4096 bytes to verify initial_bytes and chunking."""
    content = b'x' * 10000
    commit_file(git_repo, 'large.txt', content=content)

    stream, size = await git_show_content(git_repo, 'HEAD', 'large.txt')
    assert size == len(content)
    result = await read_stream(stream)
    assert result == content


@pytest.mark.asyncio
async def test_git_show_content_annex_path_traversal(git_repo):
    """Verify OpenNeuroGitError is raised when an annex symlink points outside the dataset root."""
    # Target contains '.git/annex' but traverses outside dataset root
    traversal_target = '../../outside/.git/annex/objects/xx/yy/key/key'
    commit_file(git_repo, 'traversal.dat', symlink_target=traversal_target)

    with pytest.raises(
        OpenNeuroGitError, match='Invalid symlinked path in git_show_content'
    ):
        await git_show_content(git_repo, 'HEAD', 'traversal.dat')


@pytest.mark.asyncio
async def test_git_show_content_annex_local_present(git_repo):
    """Test annexed file present locally in .git/annex/objects."""
    dataset_root = pathlib.Path(git_repo.path).parent
    key = 'MD5E-s12345--0123456789abcdef0123456789abcdef'
    annex_rel_target = f'.git/annex/objects/xx/yy/{key}/{key}'
    annex_file = dataset_root / annex_rel_target
    annex_file.parent.mkdir(parents=True, exist_ok=True)
    annex_content = b'Local annexed file content'
    annex_file.write_bytes(annex_content)

    commit_file(git_repo, 'annexed.dat', symlink_target=annex_rel_target)

    stream, size = await git_show_content(git_repo, 'HEAD', 'annexed.dat')
    assert size == len(annex_content)
    result = await read_stream(stream)
    assert result == annex_content


@pytest.mark.asyncio
async def test_git_show_content_annex_nested_directory(git_repo):
    """Test annexed file located in a subdirectory resolving relative symlink correctly."""
    dataset_root = pathlib.Path(git_repo.path).parent
    key = 'MD5E-s100--nestedkey123'
    # 3 levels down: sub-01/ses-01/anat -> need 3 '..' to get back to dataset_root
    annex_rel_target = f'../../../.git/annex/objects/11/22/{key}/{key}'
    annex_file = dataset_root / '.git' / 'annex' / 'objects' / '11' / '22' / key / key
    annex_file.parent.mkdir(parents=True, exist_ok=True)
    annex_content = b'Nested directory annexed file'
    annex_file.write_bytes(annex_content)

    filename = 'sub-01/ses-01/anat/sub-01_T1w.nii.gz'
    commit_file(git_repo, filename, symlink_target=annex_rel_target)

    stream, size = await git_show_content(git_repo, 'HEAD', filename)
    assert size == len(annex_content)
    result = await read_stream(stream)
    assert result == annex_content


@pytest.mark.asyncio
async def test_git_show_content_annex_missing_locally_no_remote(git_repo):
    """Test annexed file missing locally raises FileNotFoundError when stream_remote=False."""
    key = 'MD5E-s12345--notpresentlocally'
    annex_rel_target = f'.git/annex/objects/xx/yy/{key}/{key}'
    commit_file(git_repo, 'missing.dat', symlink_target=annex_rel_target)

    with pytest.raises(FileNotFoundError, match='is not present locally'):
        await git_show_content(git_repo, 'HEAD', 'missing.dat', stream_remote=False)


@pytest.mark.asyncio
async def test_git_show_content_annex_remote_not_found(git_repo):
    """Test annexed file missing locally and not found in remote raises FileNotFoundError."""
    key = 'MD5E-s12345--notfoundremote'
    annex_rel_target = f'.git/annex/objects/xx/yy/{key}/{key}'
    commit_file(git_repo, 'missing_remote.dat', symlink_target=annex_rel_target)

    with (
        patch('datalad_service.common.git.test_key_remote', return_value=None),
        pytest.raises(FileNotFoundError, match='not found locally or in remote'),
    ):
        await git_show_content(
            git_repo, 'HEAD', 'missing_remote.dat', stream_remote=True
        )


@pytest.mark.asyncio
async def test_git_show_content_annex_remote_size_in_key(git_repo):
    """Test annexed file streamed from remote when size is parsed directly from annex key."""
    key = 'MD5E-s54321--0123456789abcdef0123456789abcdef'
    annex_rel_target = f'.git/annex/objects/xx/yy/{key}/{key}'
    commit_file(git_repo, 'remote_file.dat', symlink_target=annex_rel_target)

    remote_url = 'https://s3.amazonaws.com/bucket/remote_file'

    async def fake_stream_from_url(url):
        yield b'remote chunk 1'
        yield b'remote chunk 2'

    with (
        patch('datalad_service.common.git.test_key_remote', return_value=remote_url),
        patch(
            'datalad_service.common.git.stream_from_url',
            side_effect=fake_stream_from_url,
        ) as mock_stream,
    ):
        stream, size = await git_show_content(
            git_repo, 'HEAD', 'remote_file.dat', stream_remote=True
        )
        assert size == 54321
        mock_stream.assert_called_once_with(remote_url)
        content = await read_stream(stream)
        assert content == b'remote chunk 1remote chunk 2'


@pytest.mark.asyncio
async def test_git_show_content_annex_remote_size_from_head(git_repo):
    """Test annexed file streamed from remote when size is obtained from HTTP HEAD content-length."""
    # Key without -s<size>-- format
    key = 'URL--https%3A%2F%2Fexample.com%2Ffile.dat'
    annex_rel_target = f'.git/annex/objects/xx/yy/{key}/{key}'
    commit_file(git_repo, 'remote_head.dat', symlink_target=annex_rel_target)

    remote_url = 'https://s3.amazonaws.com/bucket/file.dat'

    mock_head_resp = mock.MagicMock()
    mock_head_resp.headers = {'content-length': '98765'}
    mock_client = make_mock_httpx_client(head_resp=mock_head_resp)

    async def fake_stream_from_url(url):
        yield b'head content'

    with (
        patch('datalad_service.common.git.test_key_remote', return_value=remote_url),
        patch('httpx.AsyncClient', return_value=mock_client),
        patch(
            'datalad_service.common.git.stream_from_url',
            side_effect=fake_stream_from_url,
        ),
    ):
        stream, size = await git_show_content(
            git_repo, 'HEAD', 'remote_head.dat', stream_remote=True
        )
        assert size == 98765
        mock_client.head.assert_awaited_once_with(remote_url)
        content = await read_stream(stream)
        assert content == b'head content'


@pytest.mark.asyncio
async def test_git_show_content_annex_remote_no_content_length(git_repo):
    """Test annexed file streamed from remote when size is None (no content-length header)."""
    key = 'URL--https%3A%2F%2Fexample.com%2Ffile.dat'
    annex_rel_target = f'.git/annex/objects/xx/yy/{key}/{key}'
    commit_file(git_repo, 'remote_no_len.dat', symlink_target=annex_rel_target)

    remote_url = 'https://s3.amazonaws.com/bucket/file.dat'

    mock_head_resp = mock.MagicMock()
    mock_head_resp.headers = {}
    mock_client = make_mock_httpx_client(head_resp=mock_head_resp)

    async def fake_stream_from_url(url):
        yield b'no len content'

    with (
        patch('datalad_service.common.git.test_key_remote', return_value=remote_url),
        patch('httpx.AsyncClient', return_value=mock_client),
        patch(
            'datalad_service.common.git.stream_from_url',
            side_effect=fake_stream_from_url,
        ),
    ):
        stream, size = await git_show_content(
            git_repo, 'HEAD', 'remote_no_len.dat', stream_remote=True
        )
        assert size is None
        content = await read_stream(stream)
        assert content == b'no len content'


@pytest.mark.asyncio
async def test_stream_from_reader_sync():
    """Test stream_from_reader with synchronous BytesIO reader and start parameter."""
    data = b'Initial chunk followed by remainder of stream'
    reader = io.BytesIO(data[10:])
    stream = stream_from_reader(reader, start=data[:10], chunk_size=8)
    result = await read_stream(stream)
    assert result == data
    assert reader.closed


@pytest.mark.asyncio
async def test_stream_from_reader_async(tmp_path):
    """Test stream_from_reader with an aiofiles async reader."""
    test_file = tmp_path / 'async_test.bin'
    test_file.write_bytes(b'async file content for streaming')

    async with aiofiles.open(test_file, 'rb') as f:
        stream = stream_from_reader(f, chunk_size=5)
        result = await read_stream(stream)
        assert result == b'async file content for streaming'


@pytest.mark.asyncio
async def test_stream_from_url_success():
    """Test stream_from_url yielding chunks on 200 response."""
    mock_response = mock.MagicMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = mock.MagicMock()

    async def fake_aiter_bytes(chunk_size=1024):
        yield b'stream chunk 1'
        yield b'stream chunk 2'

    mock_response.aiter_bytes = fake_aiter_bytes
    mock_client = make_mock_httpx_client(stream_resp=mock_response)

    with patch('httpx.AsyncClient', return_value=mock_client):
        stream = stream_from_url('https://example.com/stream')
        result = await read_stream(stream)
        assert result == b'stream chunk 1stream chunk 2'
        mock_response.raise_for_status.assert_called_once()


@pytest.mark.asyncio
async def test_stream_from_url_404():
    """Test stream_from_url raising FileNotFoundError on 404 response."""
    mock_response = mock.MagicMock()
    mock_response.status_code = 404

    mock_client = make_mock_httpx_client(stream_resp=mock_response)

    with patch('httpx.AsyncClient', return_value=mock_client):
        stream = stream_from_url('https://example.com/notfound')
        with pytest.raises(FileNotFoundError, match='Remote object not found'):
            await read_stream(stream)


@pytest.mark.asyncio
async def test_stream_from_url_error():
    """Test stream_from_url raising HTTPStatusError on 500 response."""
    mock_response = mock.MagicMock()
    mock_response.status_code = 500
    mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
        'Server error', request=mock.MagicMock(), response=mock.MagicMock()
    )

    mock_client = make_mock_httpx_client(stream_resp=mock_response)

    with patch('httpx.AsyncClient', return_value=mock_client):
        stream = stream_from_url('https://example.com/error')
        with pytest.raises(httpx.HTTPStatusError):
            await read_stream(stream)
