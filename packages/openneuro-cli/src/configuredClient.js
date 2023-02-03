import { createClient } from '@openneuro/client'
import { getToken, getUrl } from './config.js'
import { version } from './lerna.json'
import { fetch } from 'node-fetch'

export const configuredClient = () =>
  createClient(`${getUrl()}crn/graphql`, {
    getAuthorization: getToken,
    clientVersion: version,
    fetch: fetch,
  })
