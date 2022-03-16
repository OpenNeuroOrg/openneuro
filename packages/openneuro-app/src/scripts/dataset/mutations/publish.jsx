import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { useHistory } from 'react-router-dom'
import { datasetCacheId } from './cache-id.js'
import { Button } from '@openneuro/components/button'

const PUBLISH_DATASET = gql`
  mutation publishDataset($datasetId: ID!) {
    publishDataset(datasetId: $datasetId)
  }
`

const DATASET_PUBLISHED = gql`
  fragment DatasetPublished on Dataset {
    id
    public
  }
`

const PublishDataset = ({ datasetId }) => {
  const history = useHistory()
  return (
    <Mutation
      mutation={PUBLISH_DATASET}
      update={cache => {
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_PUBLISHED,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            public: true,
          },
        })
      }}>
      {publishDataset => (
        <Button
          primary={true}
          size="small"
          label="Publish"
          onClick={() =>
            publishDataset({ variables: { datasetId } }).then(() => {
              history.push(`/datasets/${datasetId}`)
            })
          }
        />
      )}
    </Mutation>
  )
}

PublishDataset.propTypes = {
  datasetId: PropTypes.string,
  history: PropTypes.object,
}

export default PublishDataset
