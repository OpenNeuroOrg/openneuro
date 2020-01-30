import { useSubscription } from 'react-apollo'
import gql from 'graphql-tag'
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

const usePermissionsSubscription = datasetIds => {
  console.log('PERMISSIONS UPDATE:', datasetIds)
  const { data, error } = useSubscription(PERMISSIONS_SUBSCRIPTION, {
    variables: { datasetIds: datasetIds || ['NULL_ID'] },
    shouldResubscribe: true,
  })
  console.log({ data, error })
}

export default usePermissionsSubscription
