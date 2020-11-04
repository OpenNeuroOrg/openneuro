import falcon


class HistoryResource(object):
    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset):
        """
        Return dataset history (text format)
        """
        if dataset:
            ds = self.store.get_dataset(dataset)
            # Rare sequence used for delimiter
            utf_delimiter = '!5$H%E^P&'
            git_format = '%H{}%aI{}%cn{}%ce{}%d{}%s'.format(
                *[utf_delimiter for x in range(5)])
            log = ds.repo.get_revisions(fmt=git_format)
            parsed_lines = []
            for line in log:
                values = line.split(utf_delimiter)
                commit = {"id": values[0], "date": values[1],
                          "authorName": values[2], "authorEmail": values[3],
                          "references": values[4], "message": values[5]}
                parsed_lines.append(commit)
            resp.media = {'log': parsed_lines}
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND
