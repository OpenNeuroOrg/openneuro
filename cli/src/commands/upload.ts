import { validateCommand } from "./validate.ts"
import { ClientConfig, getConfig } from "./login.ts"
import { logger } from "../logger.ts"
import { resolve, walk } from "../deps.ts"
import type { CommandOptions } from "../deps.ts"

export function readConfig(): ClientConfig {
  const config = getConfig()
  logger.info(
    `configured with URL "${config.url}" and token "${
      config.token.slice(
        0,
        3,
      )
    }...${config.token.slice(-3)}`,
  )
  return config
}

export async function uploadAction(
  options: CommandOptions,
  dataset_directory: string,
) {
  const clientConfig = readConfig()
  const dataset_directory_abs = resolve(dataset_directory)
  logger.info(
    `upload ${dataset_directory} resolved to ${dataset_directory_abs}`,
  )
  // TODO - call the validator here

  for await (const walkEntry of walk(dataset_directory)) {
    logger.debug(JSON.stringify(walkEntry))
  }
}

/**
 * Given a path and context for the upload, add this file to an upload
 */
export async function uploadFile(path) {
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
  .option("-d, --dataset", "Specify an existing dataset to update.")
  .action(uploadAction)
