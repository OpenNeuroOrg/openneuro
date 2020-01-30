import { useSubscription } from 'react-apollo'
import gql from 'graphql-tag'
import { DATASET_SNAPSHOTS } from '../dataset/dataset-query-fragments.js'

const SNAPSHOT_ADDED_SUBSCRIPTION = gql`
  subscription snapshotsUpdated($datasetId: ID!) {
    snapshotsUpdated(datasetId: $datasetId) {
      id
      ...DatasetSnapshots
    }
  }
  ${DATASET_SNAPSHOTS}
`

export const useSnapshotAddedSubscription = datasetId =>
  useSubscription(SNAPSHOT_ADDED_SUBSCRIPTION, {
    variables: { datasetId },
    shouldResubscribe: true,
  })
