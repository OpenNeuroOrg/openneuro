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
            for commit in repo.walk(head.id, pygit2.GIT_SORT_TIME):
                references = []
                for tag in tags:
                    if str(tag.target) == str(commit.id):
                        references.append(tag.name)
                file_changes = []
                if commit.parents:
                    diff = commit.tree.diff_to_tree(commit.parents[0].tree)
                else:
                    diff = commit.tree.diff_to_tree()
                for delta in diff.deltas:
                    changes = {
                        'old': delta.old_file.path,
                        'new': delta.new_file.path,
                        'mode': delta.new_file.mode,
                        'binary': delta.is_binary,
                        'status': delta.status_char(),
                    }
                    file_changes.append(changes)
                new_log = {
                    'id': str(commit.id),
                    'date': commit.commit_time,
                    'authorName': commit.author.name,
                    'authorEmail': commit.author.email,
                    'message': commit.message,
                    'references': ','.join(references),
                    'files': file_changes,
                    'filesChanged': diff.stats.files_changed,
                    'insertions': diff.stats.insertions,
                    'deletions': diff.stats.deletions,
                }
                log.append(new_log)
            resp.media = {'log': log}
            resp.status = falcon.HTTP_OK
        else:
            resp.status = falcon.HTTP_NOT_FOUND
