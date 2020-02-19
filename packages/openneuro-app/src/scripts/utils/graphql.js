// Singleton for apollo-client connection
// currently not in use
import { createClient } from 'openneuro-client'
import config from '../../../config'
import packageJson from '../../../package.json'

export default createClient(`${config.url}/crn/graphql`, {
  clientVersion: packageJson.version,
})
