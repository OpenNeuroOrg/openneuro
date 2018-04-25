from datalad.api import Dataset, create_sibling_github
from datalad.config import ConfigManager

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
        ConfigManager(dataset).add('user.email', email, 'local')
        ConfigManager(dataset).add('user.name', name, 'local')
        # this adds github remote to config and also creates repo
        create_sibling_github('datalad', github_organization='', github_passwd='', dataset=dataset)