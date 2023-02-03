import { createClient } from '@openneuro/client'
import { getToken, getUrl } from './config.js'
import { version } from './lerna.json'
import { fetch } from 'fetch-h2'

export const configuredClient = () =>
  createClient(`${getUrl()}crn/graphql`, {
    getAuthorization: getToken,
    clientVersion: version,
    fetch: fetch,
  })
