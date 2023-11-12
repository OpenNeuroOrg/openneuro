import { gql, useSubscription } from "@apollo/client"

import {
  DATASET_ISSUES,
  DRAFT_FRAGMENT,
} from "../dataset/dataset-query-fragments.js"

const DRAFT_SUBSCRIPTION = gql`
  subscription draftUpdated($datasetId: ID!) {
    draftUpdated(datasetId: $datasetId) {
      id
      ...DatasetDraft
      ...DatasetIssues
    }
  }
  ${DRAFT_FRAGMENT}
  ${DATASET_ISSUES}
`

const useDraftSubscription = (datasetId) =>
  useSubscription(DRAFT_SUBSCRIPTION, {
    variables: { datasetId },
    shouldResubscribe: true,
  })

export default useDraftSubscription
