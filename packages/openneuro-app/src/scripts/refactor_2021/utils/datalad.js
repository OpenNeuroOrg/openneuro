import { datasets } from '@openneuro/client'

export function trackAnalytics(client, datasetId, options) {
  options = options || {}
  return client.mutate({
    mutation: datasets.trackAnalytics,
    variables: {
      datasetId: datasetId,
      tag: options.tag,
      type: options.type,
    },
  })
}
