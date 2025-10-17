import asyncio
import subprocess


async def run_check(command, dataset_path):
    """Helper to run an async command and check for failure"""
    process = await asyncio.create_subprocess_exec(
        *command,
        cwd=dataset_path,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await process.communicate()
    if process.returncode != 0:
        raise subprocess.CalledProcessError(process.returncode, command, stdout, stderr)
