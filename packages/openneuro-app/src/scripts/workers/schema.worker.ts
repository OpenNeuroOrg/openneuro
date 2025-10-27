/* eslint-env worker */
import { fileListToTree, validate } from "@bids/validator/main"
import type { ValidationResult } from "@bids/validator/main"
import type { Config, ValidatorOptions } from "@bids/validator/options"
import validatorConfig from "./validator-config.json"

const config: Config = validatorConfig

const options: ValidatorOptions = {
  datasetPath: "browser",
  json: true,
  blacklistModalities: ["micr"],
  debug: "INFO",
  datasetTypes: ["raw", "derivative"],
}

export async function runValidator(
  files,
): Promise<ValidationResult> {
  const tree = await fileListToTree(files)
  return await validate(tree, options, config)
}
