import 'cross-fetch/polyfill'
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
    let tokenString = ''
    if (token) {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        window.localStorage.token
      ) {
        tokenString = `${token}`
      } else {
        tokenString = `Bearer ${token}`
      }
    }

    return {
      headers: Object.assign(
        {
          authorization: tokenString,
        },
        headers,
      ),
    }
  })

const createLink = (uri, getAuthorization) => {
  // We have to setup authLink to inject credentials here
  const httpUploadLink = createUploadLink({
    uri,
    serverFormData: FormData,
  })
  return authLink(getAuthorization).concat(httpUploadLink)
}

export { files, datasets }
export default createClient
