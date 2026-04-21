import falcon
import pygit2
import os


class RefsResource:
    """
    Resolve a git reference (branch, tag, or short commit hash) to a full commit hash.
    """

    def __init__(self, store):
        self.store = store

    async def on_get(self, req, resp, dataset, treeish):
        dataset_path = self.store.get_dataset_path(dataset)
        if not os.path.exists(dataset_path):
            resp.media = {'error': f'Dataset "{dataset}" not found.'}
            resp.status = falcon.HTTP_NOT_FOUND
            return

        try:
            repo = pygit2.Repository(dataset_path)
            commit = repo.revparse_single(treeish)
            resp.media = {'hash': str(commit.id)}
            resp.status = falcon.HTTP_OK
        except pygit2.GitError:
            resp.media = {
                'error': f'Git reference "{treeish}" not found or is ambiguous in dataset "{dataset}".'
            }
            resp.status = falcon.HTTP_NOT_FOUND
        except Exception as e:
            resp.media = {'error': f'An unexpected error occurred: {e}'}
            resp.status = falcon.HTTP_INTERNAL_SERVER_ERROR
