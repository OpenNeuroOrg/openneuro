import pytest
from falcon import testing
from datalad.api import Dataset
from datalad_server.app import create_app

# Test dataset to create
DATASET_ID = 'ds000001'


@pytest.fixture(scope='session')
def annex_path(tmpdir_factory):
    path = tmpdir_factory.mktemp('annexes')
    ds_path = path.join(DATASET_ID)
    # Create an empty dataset for testing
    ds = Dataset(str(ds_path))
    ds.create()
    return path


@pytest.fixture
def client(annex_path):
    return testing.TestClient(create_app(annex_path))
