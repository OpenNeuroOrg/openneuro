import config from '../../../config'
import createClient, { datasets } from 'openneuro-client'
import packageJson from '../../../package.json'

const client = createClient(`${config.url}/crn/graphql`, {
  clientVersion: packageJson.version,
})
export default {
  //Analytics
  /**
   * Track Analytics
   *
   * Adds a 'view' or 'download' type entry to the analytics for a specific dataset
   */
  trackAnalytics(datasetId, options) {
    options = options || {}
    return client.mutate({
      mutation: datasets.trackAnalytics,
      variables: {
        datasetId: datasetId,
        tag: options.tag,
        type: options.type,
      },
    })
  },
}
