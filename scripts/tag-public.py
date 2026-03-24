#!/usr/bin/env python
# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "datalad-service",
# ]
#
# [tool.uv.sources]
# datalad-service = { path = "../services/datalad" }
# ///
#
# This script marks S3 objects in datasets as public.
# No validation is done to check if the dataset is actually public.
# Should be run with S3 credentials set as environment variables.
import asyncio
import sys

from datalad_service.tasks.publish import set_remote_public


async def main() -> None:
    async with asyncio.TaskGroup() as tg:
        for dataset in sys.argv[1:]:
            tg.create_task(set_remote_public(dataset))


if __name__ == "__main__":
    asyncio.run(main())
