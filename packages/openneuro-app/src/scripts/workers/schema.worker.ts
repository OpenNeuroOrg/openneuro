/* eslint-env worker */
import { fileListToTree, validate } from "../utils/schema-validator.js"
import { BIDSValidatorIssues } from "./worker-interface"

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
    const result = await validate(tree, { json: true })
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
