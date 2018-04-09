import { createUploadLink } from 'apollo-upload-client'

/**
 * Setup a client for working with the OpenNeuro API
 *
 * @param {string} uri
 */
const createClient = uri => {
  return createUploadLink({ uri })
}

export default createClient
