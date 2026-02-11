# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "attrs>=25.4.0",
#     "boto3>=1.42.45",
#     "pygit2>=1.19.1",
#     "pyyaml>=6.0.3",
#     "structlog>=25.5.0",
#     "typer>=0.21.1",
# ]
# ///
from __future__ import annotations

import os
import typing as ty
from pathlib import Path

import attrs
import boto3
import pygit2
import structlog
import typer
import yaml


@attrs.define
class AWSConfig:
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_S3_BUCKET_NAME: str
    AWS_REGION: str

    @classmethod
    def from_dict(cls, data: dict) -> ty.Self:
        return cls(
            AWS_ACCESS_KEY_ID=data["AWS_ACCESS_KEY_ID"],
            AWS_SECRET_ACCESS_KEY=data["AWS_SECRET_ACCESS_KEY"],
            AWS_S3_BUCKET_NAME=data.get("AWS_S3_PUBLIC_BUCKET", "openneuro.org"),
            AWS_REGION=data.get("AWS_REGION", "us-east-1"),
        )


def load_config(config_path: Path) -> AWSConfig:
    config_data = yaml.safe_load(Path(config_path).read_text())
    try:
        return AWSConfig.from_dict(config_data["secrets"]["aws"])
    except KeyError:
        raise ValueError("AWS credentials are missing in the config file.")


def load_env_config() -> AWSConfig:
    try:
        return AWSConfig.from_dict(dict(os.environ))
    except KeyError:
        raise ValueError("AWS credentials are missing from environment variables.")


def get_latest_tag(repo: pygit2.Repository) -> pygit2.Reference:
    for ref_name in sorted(
        (r for r in repo.references if r.startswith("refs/tags/")),
        key=lambda x, repo=repo: repo.references[x].peel().commit_time,
        reverse=True,
    ):
        return repo.references[ref_name]
    else:
        raise ValueError("No tags found in the repository.")


def main(
    dataset: ty.Annotated[Path, typer.Argument()] = Path(),
    config: ty.Annotated[Path | None, typer.Option()] = None,
    dry_run: ty.Annotated[bool, typer.Option()] = False,
    log_level: ty.Annotated[
        ty.Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], typer.Option()
    ] = "INFO",
) -> None:
    structlog.configure(wrapper_class=structlog.make_filtering_bound_logger(log_level))
    logger = structlog.get_logger()

    dataset = dataset.resolve()
    if not dataset.is_dir() or not dataset.name.startswith("ds"):
        raise ValueError(
            "Provided dataset path must be a directory starting with 'ds'."
        )
    repo = pygit2.Repository(dataset)
    tag = get_latest_tag(repo)
    tree = tag.peel().tree
    logger.info("Loaded repository", dataset=dataset.name, tag=tag.shorthand)

    conf = load_config(config) if config else load_env_config()
    s3 = boto3.resource(
        "s3",
        region_name=conf.AWS_REGION,
        aws_access_key_id=conf.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=conf.AWS_SECRET_ACCESS_KEY,
    )
    bucket = next(b for b in s3.buckets.all() if b.name == conf.AWS_S3_BUCKET_NAME)
    prefix = f"{dataset.name}/"

    logger.info("S3 bucket loaded", bucket=bucket.name, prefix=prefix)
    for obj in bucket.objects.filter(Prefix=prefix):
        fname = obj.key[len(prefix) :]
        if fname not in tree:
            logger.info("HIDE", filename=fname)
            if not dry_run:
                obj.delete()
        else:
            logger.debug("KEEP", filename=fname)


if __name__ == "__main__":
    typer.run(main)
