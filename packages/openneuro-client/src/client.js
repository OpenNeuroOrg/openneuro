import fetch from 'node-fetch'
import ApolloClient from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
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
      headers: Object.assign(
        {
          authorization: token ? `Bearer ${token}` : '',
        },
        headers,
      ),
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
