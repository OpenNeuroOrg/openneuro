/* eslint-env worker */
import { fileListToTree, validate } from "@bids/validator/main"
import type { ValidationResult } from "@bids/validator/main"
import type { Config, ValidatorOptions } from "@bids/validator/options"
import validatorConfig from "./validator-config.json" with { type: "json" }
import "./schema-1.1.1-datacite.json" with { type: "json" }

const config: Config = validatorConfig

const options: ValidatorOptions = {
  datasetPath: "browser",
  json: true,
  blacklistModalities: ["micr"],
  debug: "INFO",
  datasetTypes: ["raw", "derivative"],
  schema: new URL("./schema-1.1.1-datacite.json", import.meta.url).href,
}

export async function runValidator(
  files,
): Promise<ValidationResult> {
  const tree = await fileListToTree(files)
  return await validate(tree, options, config)
}
