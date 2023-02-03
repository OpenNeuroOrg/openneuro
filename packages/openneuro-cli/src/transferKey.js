import { Readable } from 'stream'
import { createWriteStream } from 'fs'
import { open } from 'fs/promises'
import { once } from 'events'
import { setDuplexIfRequired } from './setDuplexIfRequired'
import fetch, { Request } from 'node-fetch'

/**
 * Create a Request object for this url and key
 * @param {object} state
 * @param {string} state.url Base URL
 * @param {string} state.token Basic auth token for repos
 * @param {string} key git-annex key
 * @param {object} options fetch options
 * @returns {Request} Configured fetch Request object
 */
export function keyRequest(state, key, options) {
  const headers = new Headers()
  headers.set(
    'Authorization',
    'Basic ' + Buffer.from(`openneuro-cli:${state.token}`).toString('base64'),
  )
  const requestUrl = `${state.url}/annex/${key}`
  return new Request(requestUrl, { headers, ...options })
}

/**
 * Call POST to upload a key to a remote
 * @param {object} state
 * @param {string} state.url Base URL
 * @param {string} state.token Basic auth token for repos
 * @param {string} key Git-annex key
 * @param {string} file File path
 */
export async function storeKey(state, key, file) {
  const f = await open(file, 'r')
  const body = f.readableWebStream()
  const requestOptions = {
    body,
    method: 'POST',
  }
  setDuplexIfRequired(process.version, requestOptions)
  const request = keyRequest(state, key, requestOptions)
  const response = await fetch(request)
  if (response.status === 200) {
    return true
  } else {
    return false
  }
}

/**
 * Call GET to download a key from a remote
 * @param {object} state
 * @param {string} state.url Base URL
 * @param {string} state.token Basic auth token for repos
 * @param {string} key Git-annex key
 * @param {string} file File path
 */
export async function retrieveKey(state, key, file) {
  try {
    const request = keyRequest(state, key, { method: 'GET' })
    const response = await fetch(request)
    if (response.status === 200) {
      const writable = createWriteStream(file)
      // @ts-ignore-error ReadableStream<any> is more accurate here but response.body returns incompatible ReadableStream<Uint8Array>?
      const readable = Readable.fromWeb(response.body)
      readable.pipe(writable)
      await once(readable, 'close')
      return true
    } else {
      return false
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

/**
 * Call HEAD to check if key exists on remote
 * @param {object} state
 * @param {string} state.url Base URL
 * @param {string} state.token Basic auth token for repos
 * @param {string} key
 * @returns {Promise<boolean>} True or false if key exists
 */
export async function checkKey(state, key) {
  const request = keyRequest(state, key, { method: 'HEAD' })
  const response = await fetch(request)
  if (response.status === 200) {
    return true
  } else {
    return false
  }
}

/**
 * Call DELETE to remove a key from the remote
 * @param {object} state
 * @param {string} state.url Base URL
 * @param {string} state.token Basic auth token for repos
 * @param {string} key
 * @returns {Promise<boolean>} True or false if key exists
 */
export async function removeKey(state, key) {
  const request = keyRequest(state, key, { method: 'DELETE' })
  const response = await fetch(request)
  if (response.status === 204) {
    return true
  } else {
    return false
  }
}
