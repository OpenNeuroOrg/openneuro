/* eslint-env worker */
import { fileListToTree, validate } from "@bids/validator/main"
import type { ValidationResult } from "@bids/validator/main"
import type { Config, ValidatorOptions } from "@bids/validator/options"

const config: Config = {
  error: [
    { code: "NO_AUTHORS" },
    { code: "SUBJECT_FOLDERS" }, // bids-standard/bids-specification#1928 downgrades to warning
    { code: "EMPTY_DATASET_NAME" },
  ],
}

const options: ValidatorOptions = {
  datasetPath: "browser",
  json: true,
  blacklistModalities: ["micr"],
  debug: "INFO",
}

export async function runValidator(
  files,
): Promise<ValidationResult> {
  const tree = await fileListToTree(files)
  return await validate(tree, options, config)
}
