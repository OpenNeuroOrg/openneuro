import { createClient } from 'openneuro-client'
import { getToken, getUrl } from './config.js'
import { version } from '../package.json'

export const configuredClient = () =>
  createClient(`${getUrl()}crn/graphql`, {
    getAuthorization: getToken,
    clientVersion: version,
  })
