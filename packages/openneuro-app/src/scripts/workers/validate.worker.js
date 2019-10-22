/* eslint-env worker */
import * as Comlink from 'comlink'

let error, output

async function validate(cb) {
  try {
    output = 'success'
  } catch (err) {
    error = err
  } finally {
    cb({ error, output })
  }
}

Comlink.expose(validate)

// satisfies linters
export default null
