import subprocess

from github import Github
from pygit2 import Repository

from datalad_service.common.bids import read_dataset_description
from datalad_service.config import DATALAD_GITHUB_ORG
from datalad_service.config import DATALAD_GITHUB_TOKEN
from datalad_service.config import DATALAD_GITHUB_EXPORTS_ENABLED


def create_github_repo(dataset_path, dataset_id):
    """Setup a github sibling / remote."""
    try:
        if not DATALAD_GITHUB_EXPORTS_ENABLED:
            return create_sibling_github(dataset_path, dataset_id)
    except KeyError:
        raise Exception(
            'DATALAD_GITHUB_TOKEN and DATALAD_GITHUB_ORG must be defined to create remote repos'
        )


def github_export(dataset_id, dataset_path, tag):
    """
    Publish GitHub repo and tags.
    """
    subprocess.check_call(
        ['git', 'push', 'github', f'{tag}:refs/heads/main'], cwd=dataset_path
    )
    subprocess.check_call(
        ['git', 'push', 'github', f'{tag}:refs/heads/master'], cwd=dataset_path
    )
    subprocess.check_call(
        ['git', 'push', 'github', 'git-annex:refs/heads/git-annex'], cwd=dataset_path
    )
    # Update tags
    subprocess.check_call(['git', 'push', '--tags', 'github'], cwd=dataset_path)
    # Make sure the default branch is correct
    description = read_dataset_description(dataset_path, tag)
    if description:
        github_set_repo_config(dataset_id, description['Name'])
    else:
        github_set_repo_config(dataset_id)


def github_format_description(dataset_name=None):
    if dataset_name:
        return f'OpenNeuro dataset - {dataset_name}'
    else:
        return 'OpenNeuro dataset'


def github_set_repo_config(dataset_id, dataset_name=None):
    """Sets the repo default branch to 'main' and resets the description/homepage fields."""
    ses = Github(DATALAD_GITHUB_TOKEN)
    org = ses.get_organization(DATALAD_GITHUB_ORG)
    repo = org.get_repo(dataset_id)
    repo.edit(
        default_branch='main',
        description=github_format_description(dataset_name),
        homepage=f'https://openneuro.org/datasets/{dataset_id}',
    )


def create_sibling_github(dataset_path, dataset_id):
    """Create a new repo on GitHub and init the git-annex remote"""
    ses = Github(DATALAD_GITHUB_TOKEN)
    org = ses.get_organization(DATALAD_GITHUB_ORG)
    org.create_repo(
        dataset_id,
        allow_rebase_merge=True,
        auto_init=False,
        description=github_format_description(),
        homepage=f'https://openneuro.org/datasets/{dataset_id}',
        has_issues=False,
        has_projects=False,
        has_wiki=False,
    )
    repo = Repository(dataset_path)
    repo.remotes.create(
        'github', f'ssh://git@github.com/{DATALAD_GITHUB_ORG}/{dataset_id}.git'
    )
