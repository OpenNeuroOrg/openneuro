import { gql } from "@apollo/client"

export const TRACK_ANALYTICS = gql`
  mutation ($datasetId: ID!, $tag: String, $type: AnalyticTypes!) {
    trackAnalytics(datasetId: $datasetId, tag: $tag, type: $type)
  }
`

export function trackAnalytics(client, datasetId, options) {
  options = options || {}
  return client.mutate({
    mutation: TRACK_ANALYTICS,
    variables: {
      datasetId: datasetId,
      tag: options.tag,
      type: options.type,
    },
  })
}
