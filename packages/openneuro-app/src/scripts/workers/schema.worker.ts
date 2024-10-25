/* eslint-env worker */
import { fileListToTree, validate } from "../utils/schema-validator.js"
import type { BIDSValidatorIssues } from "./worker-interface"

const config = {
    error: [
        {code: 'NO_AUTHORS'},
        {code: 'SUBJECT_FOLDERS'},  // bids-standard/bids-specification#1928 downgrades to warning
        {code: 'EMPTY_DATASET_NAME'},
    ]
}

const options = {
    json: true,
    /* Enable after https://github.com/bids-standard/bids-validator/pull/2176 is released */
    // blacklistModalities: ["micr"],
}

export async function runValidator(
  files,
  options,
  cb,
): Promise<BIDSValidatorIssues> {
  let error
  const output = {
    issues: { errors: [], warnings: [] },
    summary: {},
  } as BIDSValidatorIssues
  try {
    const tree = await fileListToTree(files)
    const result = await validate(tree, options, config)
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const issues = Array.from(result.issues, ([key, value]) => value)
    output.issues.warnings = issues.filter(
      (issue) => issue.severity === "warning",
    )
    output.issues.errors = issues.filter((issue) => issue.severity === "error")
    output.summary = result.summary
  } catch (err) {
    error = err
  }
  cb({ error, output })
  return output
}
