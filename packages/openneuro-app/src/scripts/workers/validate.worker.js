importScripts('https://unpkg.com/comlink/dist/umd/comlink.js')

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
