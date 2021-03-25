import * as Comlink from 'comlink'
// @ts-expect-error
import ValidateWorker from './validate.worker?worker' // ?worker is a vite hint
import { BIDSValidatorIssues } from './worker-interface'

function init(files, options): Promise<BIDSValidatorIssues> {
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
