import { validateCommand } from "./validate.ts"
import { getConfig, LoginError } from "./login.ts"
import { logger } from "../logger.ts"
import { resolve, walk } from "../deps.ts"

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
  .action(async ({ json }, dataset_directory) => {
    let config
    try {
      config = getConfig()
    } catch (err) {
      if (err instanceof LoginError) {
        console.error("Run `openneuro login` before upload.")
      }
    }
    logger.info(
      `configured with URL "${config.url}" and token "${
        config.token.slice(
          0,
          3,
        )
      }...${config.token.slice(-3)}`,
    )
    const dataset_directory_abs = resolve(dataset_directory)
    logger.info(
      `upload ${dataset_directory} resolved to ${dataset_directory_abs}`,
    )
    for await (const walkEntry of walk(dataset_directory)) {
      logger.debug(JSON.stringify(walkEntry))
    }
  })
