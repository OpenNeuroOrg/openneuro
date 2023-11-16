import { XMLHttpRequest } from "https://deno.land/x/xhr@0.3.1/mod.ts"
globalThis.XMLHttpRequest = XMLHttpRequest
import { validateCommand } from "./validate.ts"
import { ClientConfig, getConfig } from "./login.ts"
import { logger } from "../logger.ts"
import { resolve, walk } from "../deps.ts"
import type { CommandOptions } from "../deps.ts"
import {
  Tus,
  Uppy,
} from "https://releases.transloadit.com/uppy/v3.18.1/uppy.min.mjs"

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
  const uppy = new Uppy({ id: "@openneuro/cli", autoProceed: true }).use(Tus, {
    endpoint: "http://localhost:9876/api/tusd",
    chunkSize: 64000000,
    uploadLengthDeferred: true,
    headers: {
      Authorization: `Bearer ${clientConfig.token}`,
    },
  })
  for await (const walkEntry of walk(dataset_directory)) {
    const file = await Deno.open(walkEntry.path)
    const stat = await file.stat()
    const relativePath = resolve(walkEntry.path)
    const uppyFile = {
      name: walkEntry.name,
      data: file,
      meta: {
        relativePath,
      },
      size: stat.size,
      tus: {
        uploadSize: stat.size,
      },
    }
    logger.debug(JSON.stringify({ name: uppyFile.name, meta: uppyFile.meta }))
    uppy.addFile(uppyFile)
  }
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
