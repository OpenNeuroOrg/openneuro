from github import Github
from pygit2 import Repository

from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_LOGIN
from datalad_service.config import DATALAD_GITHUB_PASS


def create_sibling_github(dataset_path, dataset_id):
    """Create a new repo on GitHub and init the git-annex remote"""
    ses = Github(DATALAD_GITHUB_LOGIN, DATALAD_GITHUB_PASS)
    org = ses.get_organization(DATALAD_GITHUB_ORG)
    org.create_repo(
        dataset_id,
        allow_rebase_merge=True,
        auto_init=False,
        description=f"OpenNeuro dataset available at https://openneuro.org/datasets/{dataset_id}",
        has_issues=False,
        has_projects=False,
        has_wiki=False,
    )
    repo = Repository(dataset_path)
    repo.remotes.create(
        'github', f'ssh://git@github.com:OpenNeuroDatasets/{dataset_id}.git')
