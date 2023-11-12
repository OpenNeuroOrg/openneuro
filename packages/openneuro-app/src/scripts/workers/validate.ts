import { runValidator } from "./validate.worker" // eslint-disable-line import/no-unresolved
import { BIDSValidatorIssues } from "./worker-interface"

function init(files, options): Promise<BIDSValidatorIssues> {
  return new Promise((resolve, reject) => {
    void runValidator(files, options, ({ error, output }) => {
      if (error) reject(error)
      else resolve(output)
    })
  })
}

export default init
