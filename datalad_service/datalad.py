from datalad.api import Dataset, create_sibling_github
from datalad.config import ConfigManager

import os

class DataladStore(object):

    """Store for Datalad state accessed by resource handlers."""

    def __init__(self, annex_path):
        self.annex_path = annex_path

    def get_dataset(self, name):
        """Return raw Datalad API dataset based on the name param."""
        return Dataset(self.get_dataset_path(name))

    def get_dataset_path(self, name):
        return '{}/{}'.format(self.annex_path, name)

    def set_config(self, dataset, name, email):
        ConfigManager(dataset).set('user.email', email, 'local')
        ConfigManager(dataset).set('user.name', name, 'local')
        return None

    def create_github_repo(self, dataset):
        dataset_number = dataset.path.split('/')[2]
        login = os.environ['DATALAD_GITHUB_ORG']
        password = os.environ['DATALAD_GITHUB_PASS']
        # this adds github remote to config and also creates repo
        create_sibling_github(dataset_number, github_login=login, github_passwd=password, dataset=dataset, access_protocol='ssh')
        return None
