import { Command } from "@cliffy/command"
import type { CommandOptions } from "@cliffy/command"
import { readConfig } from "../config.ts"
import { logger } from "../logger.ts"
import { getRepoAccess } from "./git-credential.ts"
import { getLatestSnapshotVersion } from "../graphq.ts"
import { version } from "node:os"

export const download = new Command()
  .name("download")
  .description("Download a dataset from OpenNeuro")
  .arguments("<accession_number> <download_directory>")
  .option(
    "-d, --draft",
    "Download a draft instead of the latest version snapshot.",
    { conflicts: ["version"] },
  )
  .option(
    "-v, --version <version:string>",
    "Download a specific version.",
    { conflicts: ["draft"] },
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

  let version
  if (options.version) {
    version = options.version
  } else if (!options.draft) {
    version = await getLatestSnapshotVersion(datasetId)
    if (
      version.length === 40 /* sha1 */ || version.length === 64 /* sha256 */
    ) {
      // Commit hash -> get the draft instead
      version = undefined
    }
  }

  // Clone the repo
  worker.postMessage({
    "command": "clone",
    "version": version,
  })

  // Setup any git-annex remotes required for downloads
  worker.postMessage({
    "command": "remote-setup",
    "version": version,
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
