import { useSubscription } from 'react-apollo'
import gql from 'graphql-tag'
import {
  DRAFT_FRAGMENT,
  DATASET_ISSUES,
} from '../dataset/dataset-query-fragments.js'

const DRAFT_SUBSCRIPTION = gql`
  subscription draftUpdated($datasetIds: [ID!]) {
    draftUpdated(datasetIds: $datasetIds) {
      id
      ...DatasetDraft
      ...DatasetIssues
    }
  }
  ${DRAFT_FRAGMENT}
  ${DATASET_ISSUES}
`

const useDraftSubscription = (client, datasetId) => {
  useSubscription(DRAFT_SUBSCRIPTION, {
    variables: { datasetIds: [datasetId] },
    shouldResubscribe: true,
  })
  console.log('GET subscription update')
}

export default useDraftSubscription
