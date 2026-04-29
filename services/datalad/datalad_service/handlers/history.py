import falcon
import pygit2

from datalad_service.common.git import git_tag


class HistoryResource:
    def __init__(self, store):
        self.store = store

    async def on_get(self, req, resp, dataset):
        """
        Return dataset history (text format)
        """
        if dataset:
            dataset_path = self.store.get_dataset_path(dataset)
            repo = pygit2.Repository(dataset_path)
            tags = git_tag(repo)
            head = repo[repo.head.target]
            log = []

            # Pre-compute a mapping of commit IDs to their tag names
            tag_map = {}
            for tag in tags:
                tag_map.setdefault(str(tag.target), []).append(tag.name)

            for commit in repo.walk(head.id, pygit2.GIT_SORT_TIME):
                commit_id_str = str(commit.id)
                references = tag_map.get(commit_id_str, [])

                new_log = {
                    'id': commit_id_str,
                    'date': commit.commit_time,
                    'authorName': commit.author.name,
                    'authorEmail': commit.author.email,
                    'message': commit.message,
                    'references': ','.join(references),
                }
                log.append(new_log)
            resp.media = {'log': log}
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND
