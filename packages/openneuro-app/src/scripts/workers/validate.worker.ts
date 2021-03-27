/* eslint-env worker */
import { expose } from 'comlink'
import validate from 'bids-validator'
import { BIDSValidatorIssues } from './worker-interface'

const asyncValidateBIDS = (files, options): Promise<BIDSValidatorIssues> =>
  new Promise(resolve => {
    validate.BIDS(files, options, (issues, summary) =>
      resolve({ issues, summary }),
    )
  })

export async function runValidator(
  files,
  options,
  cb,
): Promise<BIDSValidatorIssues> {
  let error, output: BIDSValidatorIssues
  try {
    output = await asyncValidateBIDS(files, options)
  } catch (err) {
    error = err
  }
  cb({ error, output })
  return output
}

const toExport = {
  runValidator,
}
export type ValidationWorker = typeof toExport

expose(toExport)

export default toExport
