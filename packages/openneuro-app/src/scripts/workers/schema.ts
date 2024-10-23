import { runValidator } from "./schema.worker"
import type { BIDSValidatorIssues } from "./worker-interface"

function init(files, options): Promise<BIDSValidatorIssues> {
  return new Promise((resolve, reject) => {
    void runValidator(files, options, ({ error, output }) => {
      if (error) reject(error)
      else resolve(output)
    })
  })
}

export default init
