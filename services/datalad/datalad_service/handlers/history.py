import falcon
import pygit2

from datalad_service.common.git import git_tag


class HistoryResource(object):
    def __init__(self, store):
        self.store = store

    def on_get(self, req, resp, dataset):
        """
        Return dataset history (text format)
        """
        if dataset:
            dataset_path = self.store.get_dataset_path(dataset)
            repo = pygit2.Repository(dataset_path)
            tags = git_tag(repo)
            head = repo[repo.head.target]
            log = []
            for commit in repo.walk(head.id, pygit2.GIT_SORT_TIME):
                references = []
                for tag in tags:
                    if tag.target.hex == commit.hex:
                        references += tag.name
                log.append({
                    "id": commit.hex, "date": commit.commit_time,
                    "authorName": commit.author.name, "authorEmail": commit.author.email,
                    "message": commit.message, "references": ",".join(references)})
            resp.media = {'log': log}
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND
