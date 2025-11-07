import { Command } from "@cliffy/command"
import type { CommandOptions } from "@cliffy/command"
import { readConfig } from "../config.ts"
import { logger } from "../logger.ts"
import { getRepoAccess } from "./git-credential.ts"

export const download = new Command()
  .name("download")
  .description("Download a dataset from OpenNeuro")
  .arguments("<accession_number> <download_directory>")
  .option(
    "-d, --draft",
    "Download a draft instead of the latest version snapshot.",
  )
  .option(
    "-v, --version",
    "Download a specific version.",
  )
  .action(downloadAction)

export async function downloadAction(
  options: CommandOptions,
  accession_number: string,
  download_directory: string,
) {
  const datasetId = accession_number
  const clientConfig = readConfig()
  const { token, endpoint } = await getRepoAccess(datasetId)

  // Create the git worker
  const worker = new Worker(new URL("../worker/git.ts", import.meta.url).href, {
    type: "module",
  })

  // Configure worker
  worker.postMessage({
    "command": "setup",
    "datasetId": datasetId,
    "repoPath": download_directory,
    "repoEndpoint": `${clientConfig.url}/git/${endpoint}/${datasetId}`,
    "authorization": token,
    "logLevel": logger.levelName,
  })

  console.log("Downloading...")

  // Clone main/master and git-annex branches
  worker.postMessage({
    "command": "clone",
  })

  // Setup any git-annex remotes required for downloads
  worker.postMessage({
    "command": "remote-setup",
  })

  // Close after all tasks are queued
  worker.postMessage({ command: "done" })

  await new Promise<void>((resolve) => {
    worker.onmessage = (event) => {
      if (event.data.command === "closed") {
        console.log(
          "Download complete. To download all data files, use `datalad get` or `git-annex get`.",
        )
        resolve()
      }
    }
  })
}
