/* eslint-env worker */
importScripts('https://unpkg.com/comlink/dist/umd/comlink.js')
/* global Comlink */

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
