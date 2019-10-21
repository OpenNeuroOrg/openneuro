import * as Comlink from 'comlink'
import ValidateWorker from './validate.worker.js'

async function init() {
  const worker = new ValidateWorker()
  const validate = Comlink.wrap(worker)
  const output = await new Promise((resolve, reject) => {
    validate(
      Comlink.proxy(({ error, output }) => {
        if (error) reject(error)
        else resolve(output)
      }),
    )
  })
  return output
}

export default {
  init,
}
