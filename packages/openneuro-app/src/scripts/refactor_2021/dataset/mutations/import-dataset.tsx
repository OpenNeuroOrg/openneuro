import React, { FC, useState } from 'react'
import { gql, useMutation, useApolloClient } from '@apollo/client'
import { Button } from '@openneuro/components/button'
import { createDataset } from '../../uploader/upload-mutation'

export const IMPORT_DATASET = gql`
  mutation importRemoteDataset($datasetId: ID!, $url: String!) {
    importRemoteDataset(datasetId: $datasetId, url: $url)
  }
`

interface ImportDatasetMutationProps {
  url: string
}

export const ImportDatasetMutation: FC<ImportDatasetMutationProps> = ({
  url,
}) => {
  const [importStarted, setImportStarted] = useState(false)
  const [importFailed, setImportFailed] = useState(false)
  const [ImportDataset] = useMutation(IMPORT_DATASET)
  const apolloClient = useApolloClient()

  let status = (
    <Button
      className="btn-modal-action"
      primary={true}
      label="Start Import"
      size="small"
      onClick={async () => {
        const createDatasetMutation = createDataset(apolloClient)
        const datasetId = await createDatasetMutation({
          affirmedDefaced: true,
          affirmedConsent: false,
        })
        try {
          await ImportDataset({
            variables: { datasetId, url },
          })
          setImportStarted(true)
        } catch (err) {
          setImportFailed(true)
        }
      }}
    />
  )

  // User can start import

  // Import is running successfully
  if (importStarted && !importFailed) {
    status = (
      <p>
        This import has been started and you will receive an email when it is
        complete.
      </p>
    )
  }

  if (importFailed) {
    status = (
      <p>
        An error was encountered importing this URL. This may indicate the URL
        is inaccessible or is not the correct zip format. Please contact support
        if you have verified the bundle is correct and still experience this
        error.
      </p>
    )
  }

  return (
    <>
      <input type="text" disabled value={url} />
      {status}
    </>
  )
}
