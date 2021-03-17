import * as Comlink from 'comlink'
import ValidateWorker from './validate.worker'
import { BIDSValidatorIssues } from './worker-interface'

function init(files, options): Promise<BIDSValidatorIssues> {
  // @ts-expect-error
  const worker = new ValidateWorker()
  const workerComms = Comlink.wrap<
    import('./validate.worker').ValidationWorker
  >(worker)
  return new Promise((resolve, reject) => {
    workerComms.runValidator(
      files,
      options,
      Comlink.proxy(({ error, output }) => {
        if (error) reject(error)
        else resolve(output)
      }),
    )
  })
}

export default init
