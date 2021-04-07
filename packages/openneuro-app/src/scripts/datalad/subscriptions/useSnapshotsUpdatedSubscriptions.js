import { useSubscription, gql } from '@apollo/client'

import { DATASET_SNAPSHOTS } from '../dataset/dataset-query-fragments.js'

const SNAPSHOTS_UPDATED_SUBSCRIPTION = gql`
  subscription snapshotsUpdated($datasetId: ID!) {
    snapshotsUpdated(datasetId: $datasetId) {
      id
      ...DatasetSnapshots
    }
  }
  ${DATASET_SNAPSHOTS}
`

const useSnapshotsUpdatedSubscription = datasetId =>
  useSubscription(SNAPSHOTS_UPDATED_SUBSCRIPTION, {
    variables: { datasetId },
    shouldResubscribe: true,
  })

export default useSnapshotsUpdatedSubscription
