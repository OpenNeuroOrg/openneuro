import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { useNavigate } from 'react-router-dom'
import { datasetCacheId } from './cache-id.js'

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
  const navigate = useNavigate()
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
        <button
          className="btn-modal-action"
          onClick={() =>
            publishDataset({ variables: { datasetId } }).then(() => {
              navigate(`/datasets/${datasetId}`)
            })
          }>
          Publish
        </button>
      )}
    </Mutation>
  )
}

PublishDataset.propTypes = {
  datasetId: PropTypes.string,
  history: PropTypes.object,
}

export default PublishDataset
