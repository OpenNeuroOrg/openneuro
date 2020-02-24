import * as Comlink from 'comlink'

function init(files, options) {
  const worker = new Worker('./validate.worker.js', { type: 'module' })
  const validate = Comlink.wrap(worker)
  return new Promise((resolve, reject) => {
    validate(
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
