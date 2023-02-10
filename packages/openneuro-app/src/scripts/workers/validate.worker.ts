/* eslint-env worker */
import { validate, fileListToTree } from '../utils/schema-validator.js'
import { BIDSValidatorIssues } from './worker-interface'

export async function runValidator(
  files,
  options,
  cb,
): Promise<BIDSValidatorIssues> {
  let error, output: BIDSValidatorIssues
  output = { issues: { errors: [], warnings: [] }, summary: {} }
  try {
    const tree = await fileListToTree(files)
    const result = await validate(tree, { json: true })
    const issues = Array.from(result.issues, ([key, value]) => value)
    console.log(issues)
    output.issues.warnings = issues.filter(
      issue => issue.severity === 'warning',
    )
    output.issues.errors = issues.filter(issue => issue.severity === 'errors')
    output.summary = result.summary
    console.log(output)
  } catch (err) {
    error = err
  }
  cb({ error, output })
  return output
}
