import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'

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

const PublishDataset = ({ history, datasetId }) => (
  <Mutation
    mutation={PUBLISH_DATASET}
    update={cache => {
      cache.writeFragment({
        id: `Dataset:${datasetId}`,
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
            history.push(`/datasets/${datasetId}`)
          })
        }>
        Publish
      </button>
    )}
  </Mutation>
)

PublishDataset.propTypes = {
  datasetId: PropTypes.string,
  history: PropTypes.object,
}

export default withRouter(PublishDataset)
