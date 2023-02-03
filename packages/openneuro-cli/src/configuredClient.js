import { createClient } from '@openneuro/client'
import { getToken, getUrl } from './config.js'
import { version } from './lerna.json'
import { fetch, setup, CookieJar } from 'fetch-h2'

export const setupFetchH2 = () => {
  // fetch-h2 has its own method of setting cookies
  // Skip setting getAuthorization and set a cookie here instead
  const jar = new CookieJar()
  jar.setCookie(`accessToken=${getToken()}`, getUrl())
  setup({ cookieJar: jar })
}

export const configuredClient = () => {
  return createClient(`${getUrl()}crn/graphql`, {
    clientVersion: version,
    fetch,
  })
}
