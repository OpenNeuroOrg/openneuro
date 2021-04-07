import { useSubscription, gql } from '@apollo/client'

import { PERMISSION_FRAGMENT } from '../dataset/dataset-query-fragments.js'

const PERMISSIONS_SUBSCRIPTION = gql`
  subscription permissionsUpdated($datasetIds: [ID!]) {
    permissionsUpdated(datasetIds: $datasetIds) {
      id
      ...DatasetPermissions
    }
  }
  ${PERMISSION_FRAGMENT}
`

const usePermissionsSubscription = datasetIds =>
  useSubscription(PERMISSIONS_SUBSCRIPTION, {
    variables: { datasetIds: datasetIds || ['NULL_ID'] },
    shouldResubscribe: true,
  })

export default usePermissionsSubscription
