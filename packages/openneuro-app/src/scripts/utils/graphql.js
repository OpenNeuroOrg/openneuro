// Singleton for apollo-client connection
import createClient from 'openneuro-client'
import config from '../../../config'

export default createClient(`${config.url}/crn/graphql`)
