import { useSubscription } from 'react-apollo'
import gql from 'graphql-tag'
import {
  PERMISSION_FRAGMENT
} from '../dataset/dataset-query-fragments.js'

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
  console.log('PERMISSION SUB')
  const { data, loading, error } = useSubscription(PERMISSIONS_SUBSCRIPTION, {
    variables: { datasetIds },
    shouldResubscribe: true,
  })
  console.log('------------------------')
  console.log('PERMISSIONS!')
  console.log({ data, loading, error })
  console.log('------------------------')
}

export default usePermissionsSubscription
