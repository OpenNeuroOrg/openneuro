import * as Comlink from 'comlink'
// @ts-expect-error ?worker is a vite hint
import ValidateWorker from './validate.worker?worker&type=classic' // eslint-disable-line import/no-unresolved
import { BIDSValidatorIssues } from './worker-interface'

function init(files, options): Promise<BIDSValidatorIssues> {
  const worker = new ValidateWorker()
  const workerComms = Comlink.wrap<
    import('./validate.worker').ValidationWorker
  >(worker)
  return new Promise((resolve, reject) => {
    void workerComms.runValidator(
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
