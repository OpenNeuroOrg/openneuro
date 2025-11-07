import { validate } from "@bids/validator/main"
import { validateCommand } from "@bids/validator/options"
import { readFileTree } from "@bids/validator/files"
import { consoleFormat } from "@bids/validator/output"
import { logger } from "../logger.ts"
import { Confirm, prompt } from "@cliffy/prompt"
import { join, relative, resolve } from "@std/path"
import { walk } from "@std/fs/walk"
import type { CommandOptions } from "@cliffy/command"
import { getRepoAccess } from "./git-credential.ts"
import { readConfig } from "../config.ts"
import { createDatasetAffirmed } from "./create-dataset.ts"
import { CreateDatasetAffirmedError } from "../error.ts"
import validatorConfig from "../validator-config.json" with { type: "json" }

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

/**
 * Add all files to a setup git worker
 * @param worker The worker to use for this
 * @param dataset_directory_abs An absolute path on the local system to upload files from (dataset root)
 */
export async function addGitFiles(
  worker: Worker,
  dataset_directory_abs: string,
) {
  // Upload all files
  for await (
    const walkEntry of walk(dataset_directory_abs, {
      includeDirs: false,
      includeSymlinks: true,
    })
  ) {
    const relativePath = relative(dataset_directory_abs, walkEntry.path)
    if (
      relativePath === ".bidsignore" ||
      !relativePath.startsWith(".")
    ) {
      worker.postMessage({
        "command": "add",
        "path": walkEntry.path,
        "relativePath": relativePath,
      })
    } else {
      logger.warn(`Skipped file "${relativePath}"`)
    }
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

  // Match OpenNeuro's server side rules for datasetTypes overriding user settings
  options.datasetTypes = ["raw", "derivative"]

  // Use OpenNeuro's schema until datacite.yml is supported upstream
  const schemaPath = new URL("../schema-1.1.1-datacite.json", import.meta.url)
  options.schema = schemaPath.href

  const schemaResult = await validate(
    await readFileTree(dataset_directory_abs),
    options,
    validatorConfig,
  )
  console.log(consoleFormat(schemaResult))

  for (const issue of schemaResult.issues.issues) {
    if (issue.severity === "error") {
      console.log("Please correct validation errors before uploading.")
      return
    }
  }
  console.log("Validation complete, preparing upload.")

  let datasetId
  if (options.dataset) {
    datasetId = options.dataset
  } else {
    if (!options.new) {
      const confirmation = await prompt([
        {
          name: "create",
          message: "Create a new dataset?",
          type: Confirm,
        },
      ])
      if (!confirmation.create) {
        console.log("Specify --dataset to upload to an existing dataset.")
        return
      }
    }
    try {
      datasetId = await createDatasetAffirmed(options)
    } catch (err) {
      if (err instanceof CreateDatasetAffirmedError) {
        console.log(err.message)
        return
      }
    }
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

  logger.info(`Repo path: ${join(repoDir, datasetId)}`)
  worker.postMessage({
    "command": "clone",
  })

  // Upload all files
  await addGitFiles(worker, dataset_directory_abs)

  // Generate a commit
  worker.postMessage({ command: "commit" })

  // Push git/annexed data
  worker.postMessage({ command: "push" })

  // Close after all tasks are queued
  worker.postMessage({ command: "done" })

  await new Promise<void>((resolve) => {
    worker.onmessage = (event) => {
      if (event.data.command === "closed") {
        resolve()
      }
    }
  })
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
  .option(
    "-d, --dataset [dataset:string]",
    "Specify an existing dataset to update.",
    {
      conflicts: ["new"],
    },
  )
  .option("-n, --new", "Skip confirmation to create a new dataset.", {
    conflicts: ["dataset"],
  })
  .option(
    "--affirmDefaced",
    "All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.",
    { default: false },
  )
  .option(
    "--affirmConsent",
    "I have explicit participant consent and ethical authorization to publish structural scans without defacing.",
    { default: false },
  )
  .action(uploadAction)
