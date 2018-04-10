import fetch from 'node-fetch'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

const cache = new InMemoryCache()

/**
 * Setup a client for working with the OpenNeuro API
 *
 * @param {string} uri
 */
const createClient = uri => {
  const link = createLink(uri)
  return new ApolloClient({ uri, link, cache })
}

const createLink = uri => {
  return createUploadLink({ uri, fetch })
}

export default createClient
