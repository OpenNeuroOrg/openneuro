import subprocess

from github import Github
from pygit2 import Repository

from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_TOKEN
from datalad_service.config import DATALAD_GITHUB_EXPORTS_ENABLED


def create_github_repo(dataset_path, dataset_id):
    """Setup a github sibling / remote."""
    try:
        # raise exception if github exports are not enabled
        if not DATALAD_GITHUB_EXPORTS_ENABLED:
            raise Exception(
                'DATALAD_GITHUB_EXPORTS_ENABLED must be defined to create remote repos')

        # this adds github remote to config and also creates repo
        return create_sibling_github(dataset_path, dataset_id)
    except KeyError:
        raise Exception(
            'DATALAD_GITHUB_TOKEN and DATALAD_GITHUB_ORG must be defined to create remote repos')


def github_export(dataset_path, tag):
    """
    Publish GitHub repo and tags.
    """
    subprocess.check_call(
        ['git', 'push', 'github', f'{tag}:refs/heads/main'], cwd=dataset_path)
    subprocess.check_call(
        ['git', 'push', 'github', 'git-annex:refs/heads/git-annex'], cwd=dataset_path)
    # Update tags
    subprocess.check_call(
        ['git', 'push', '--tags', 'github'], cwd=dataset_path)


def create_sibling_github(dataset_path, dataset_id):
    """Create a new repo on GitHub and init the git-annex remote"""
    ses = Github(DATALAD_GITHUB_TOKEN)
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
        'github', f'ssh://git@github.com/OpenNeuroDatasets/{dataset_id}.git')
