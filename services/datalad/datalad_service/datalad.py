from os import path

import pygit2


class DataladStore:
    """Store for Datalad state accessed by resource handlers."""

    def __init__(self, annex_path):
        self.annex_path = annex_path
        self.repos = {}

    def get_dataset_path(self, name):
        return path.join(self.annex_path, name)

    def get_upload_path(self, dataset, upload):
        prefix_a = upload[0:2]
        prefix_b = upload[2:4]
        return path.join(
            self.annex_path, 'uploads', dataset, prefix_a, prefix_b, upload
        )

    def get_dataset_repo(self, dataset):
        if dataset not in self.repos:
            self.repos[dataset] = pygit2.Repository(self.get_dataset_path(dataset))
        return self.repos[dataset]
