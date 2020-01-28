import config from '../../../config'
import getClient, { datasets } from 'openneuro-client'
import packageJson from '../../../package.json'

const client = getClient(
  `${config.url}/crn/graphql`,
  null,
  null,
  packageJson.version,
)
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
