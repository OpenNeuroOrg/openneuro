import fetch from 'node-fetch'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client/src'
import FormData from 'form-data'
import * as files from './files'
import * as datasets from './datasets'

const cache = new InMemoryCache()

/**
 * Setup a client for working with the OpenNeuro API
 *
 * @param {string} uri
 */
const createClient = (uri, getAuthorization) => {
  const link = createLink(uri, getAuthorization)
  return new ApolloClient({ uri, link, cache })
}

const authLink = getAuthorization =>
  setContext((_, { headers }) => {
    // Passthrough any headers but add in authorization if set
    const token = getAuthorization ? getAuthorization() : false
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

const createLink = (uri, getAuthorization) => {
  // We have to setup authLink to inject credentials here
  const httpUploadLink = createUploadLink({
    uri,
    fetch,
    serverFormData: FormData,
  })
  return authLink(getAuthorization).concat(httpUploadLink)
}

export { files, datasets }
export default createClient
