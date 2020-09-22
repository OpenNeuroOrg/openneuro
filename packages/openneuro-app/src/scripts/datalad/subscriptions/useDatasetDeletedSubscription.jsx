import React from 'react'
import { useSubscription } from 'react-apollo'
import gql from 'graphql-tag'
import { toast } from 'react-toastify'
import ToastContent from '../../common/partials/toast-content.jsx'

const DATASET_DELETED_SUBSCRIPTION = gql`
  subscription datasetDeleted($datasetIds: [ID!]) {
    datasetDeleted(datasetIds: $datasetIds)
  }
`

const useDatasetDeletedSubscription = (datasetIds, cb) => {
  const result = useSubscription(DATASET_DELETED_SUBSCRIPTION, {
    variables: { datasetIds },
    shouldResubscribe: true,
  })
  cb(result)
}

export const datasetDeletedToast = (datasetId, name = datasetId) => {
  toast.warn(
    <ToastContent
      title="Deleting Dataset"
      body={`Dataset "${name}" is being removed. Subscribers will recieve an email upon success.`}
    />,
  )
}

export default useDatasetDeletedSubscription
