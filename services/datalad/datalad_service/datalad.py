from os import path

class DataladStore:
    """Store for Datalad state accessed by resource handlers."""

    def __init__(self, annex_path):
        self.annex_path = annex_path

    def get_dataset_path(self, name):
        return path.join(self.annex_path, name)

    def get_upload_path(self, dataset, upload):
        prefix_a = upload[0:2]
        prefix_b = upload[2:4]
        return path.join(self.annex_path, 'uploads', dataset, prefix_a, prefix_b, upload)
