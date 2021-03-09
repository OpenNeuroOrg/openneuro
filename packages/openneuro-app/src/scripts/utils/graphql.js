// Singleton for apollo-client connection
// currently not in use
import { createClient } from 'openneuro-client'
import config from '../../config'
import { version } from '../../lerna.json'

export default createClient(`${config.url}/crn/graphql`, {
  clientVersion: version,
})
