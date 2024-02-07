import {
  consoleFormat,
  readFileTree,
  validate,
  validateCommand,
} from "../bids_validator.ts"
import { ClientConfig, getConfig } from "./login.ts"
import { logger } from "../logger.ts"
import { Confirm, join, ProgressBar, relative, resolve, walk } from "../deps.ts"
import type { CommandOptions } from "../deps.ts"
import { getRepoAccess } from "./git-credential.ts"

export function readConfig(): ClientConfig {
  const config = getConfig()
  logger.info(
    `configured with URL "${config.url}" and token "${
      config.token.slice(
        0,
        4,
      )
    }...${config.token.slice(-4)}"`,
  )
  return config
}

async function getRepoDir(url: URL): Promise<string> {
  const LOCAL_STORAGE_KEY = `openneuro_cli_${url.hostname}_`
  const repoDir = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (repoDir) {
    return repoDir
  } else {
    const tmpDir = await Deno.makeTempDir({ prefix: LOCAL_STORAGE_KEY })
    localStorage.setItem(LOCAL_STORAGE_KEY, tmpDir)
    return tmpDir
  }
}

export async function uploadAction(
  options: CommandOptions,
  dataset_directory: string,
) {
  const clientConfig = readConfig()
  const serverUrl = new URL(clientConfig.url)
  const repoDir = await getRepoDir(serverUrl)
  const dataset_directory_abs = resolve(dataset_directory)
  logger.info(
    `upload ${dataset_directory} resolved to ${dataset_directory_abs}`,
  )

  const schemaResult = await validate(
    await readFileTree(dataset_directory_abs),
    options,
  )
  console.log(consoleFormat(schemaResult))

  for (const issue of schemaResult.issues.values()) {
    if (issue.severity === "error") {
      console.log("Please correct validation errors before uploading.")
      return
    }
  }
  console.log("Validation complete, preparing upload.")

  let datasetId = "ds001130"
  if (options.dataset) {
    datasetId = options.dataset
  } else {
    if (!options.create) {
      const confirmation = await new Confirm(
        "Confirm creation of a new dataset?",
      )
      if (!confirmation) {
        console.log("Specify --dataset to upload to an existing dataset.")
        return
      }
    }
    // TODO Create dataset here
    datasetId = "ds001130"
  }

  // Create the git worker
  const worker = new Worker(new URL("../worker/git.ts", import.meta.url).href, {
    type: "module",
  })

  const repoPath = join(repoDir, datasetId)
  const { token, endpoint } = await getRepoAccess(datasetId)
  await Deno.mkdir(repoPath, { recursive: true })
  // Configure worker
  worker.postMessage({
    "command": "setup",
    "datasetId": datasetId,
    "sourcePath": dataset_directory_abs,
    "repoPath": repoPath,
    "repoEndpoint": `${clientConfig.url}/git/${endpoint}/${datasetId}`,
    "authorization": token,
    "logLevel": logger.levelName,
  })

  /*
  const progressBar = new ProgressBar({
    title: "Upload",
    total: 100,
  })
  progressBar.render(0)*/

  logger.info(`Repo path: ${join(repoDir, datasetId)}`)
  worker.postMessage({
    "command": "clone",
  })

  // Upload all files
  for await (
    const walkEntry of walk(dataset_directory_abs, {
      includeDirs: false,
      includeSymlinks: false,
    })
  ) {
    const relativePath = relative(dataset_directory_abs, walkEntry.path)
    worker.postMessage({
      "command": "add",
      "path": walkEntry.path,
      "relativePath": relativePath,
    })
  }

  // Generate a commit
  worker.postMessage({ command: "commit" })

  // Push git/annexed data
  worker.postMessage({ command: "push" })

  // Close after all tasks are queued
  worker.postMessage({ command: "close" })
}

/**
 * Upload is validate extended with upload features
 */
export const upload = validateCommand
  .name("upload")
  .description("Upload a dataset to OpenNeuro")
  .option("--json", "Hidden for upload usage", { hidden: true, override: true })
  .option("--filenameMode", "Hidden for upload usage", {
    hidden: true,
    override: true,
  })
  .option("-d, --dataset", "Specify an existing dataset to update.", {
    conflicts: ["create"],
  })
  .option("-c, --create", "Skip confirmation to create a new dataset.", {
    conflicts: ["dataset"],
  })
  .action(uploadAction)
