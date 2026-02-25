# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "boto3>=1.42.45",
#     "pyyaml>=6.0.3",
#     "typer>=0.21.1",
# ]
# ///
import os
import typing as ty
from dataclasses import dataclass
from pathlib import Path

import boto3
import typer
import yaml


@dataclass
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


def nuke_prefix(prefix: str, conf: AWSConfig, dry_run: bool = False) -> None:
    client = boto3.client(
        "s3",
        aws_access_key_id=conf.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=conf.AWS_SECRET_ACCESS_KEY,
        region_name=conf.AWS_REGION,
    )
    paginator = client.get_paginator("list_object_versions")
    object_delete_list = []
    print(
        f"Remove all objects prefixed with s3://{conf.AWS_S3_BUCKET_NAME}/{prefix}"
    )
    for object_response_itr in paginator.paginate(
        Bucket=conf.AWS_S3_BUCKET_NAME, Prefix=prefix
    ):
        if "DeleteMarkers" in object_response_itr:
            for delete_marker in object_response_itr["DeleteMarkers"]:
                object_delete_list.append(
                    {
                        "Key": delete_marker["Key"],
                        "VersionId": delete_marker["VersionId"],
                    }
                )

        if "Versions" in object_response_itr:
            for version in object_response_itr["Versions"]:
                object_delete_list.append(
                    {"Key": version["Key"], "VersionId": version["VersionId"]}
                )

    for i in range(0, len(object_delete_list), 1000):
        if not dry_run:
            response = client.delete_objects(
                Bucket=conf.AWS_S3_BUCKET_NAME,
                Delete={"Objects": object_delete_list[i : i + 1000], "Quiet": True},
            )
            print(response)
        else:
            print(f"Dry run: {len(object_delete_list)} objects to delete.")
            print(f"First object: {object_delete_list[0]}")
            print(f"Last object: {object_delete_list[-1]}")


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


def main(
    folder: ty.Annotated[str, typer.Option(help="Your folder within your S3 Bucket")],
    config: ty.Annotated[
        Path | None, typer.Option(help="Path to OpenNeuro secrets file")
    ] = None,
    env: ty.Annotated[
        bool, typer.Option(help="Read AWS secrets from environment")
    ] = False,
    key: ty.Annotated[str | None, typer.Option(help="Your S3 Access Key")] = None,
    secret: ty.Annotated[str | None, typer.Option(help="Your S3 Access Secret")] = None,
    bucket: ty.Annotated[str, typer.Option(help="Your S3 Bucket")] = "openneuro.org",
    dry_run: ty.Annotated[bool, typer.Option()] = False,
    log_level: ty.Annotated[
        ty.Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"], typer.Option()
    ] = "INFO",
) -> None:
    boto3.set_stream_logger("boto3.resources", log_level)

    if config:
        conf = load_config(config)
    elif env:
        conf = load_env_config()
    else:
        if not all([key, secret, bucket]):
            raise ValueError("AWS credentials and bucket information must be provided.")
        conf = AWSConfig.from_dict(
            {
                "AWS_ACCESS_KEY_ID": key,
                "AWS_SECRET_ACCESS_KEY": secret,
                "AWS_S3_BUCKET_NAME": bucket,
            }
        )

    nuke_prefix(prefix=folder, conf=conf, dry_run=dry_run)


if __name__ == "__main__":
    typer.run(main)
