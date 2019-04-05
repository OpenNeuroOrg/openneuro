import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import WarnButton from '../../common/forms/warn-button.jsx'

const DELETE_DATASET = gql`
  mutation deleteDataset($id: ID!) {
    deleteDataset(id: $id)
  }
`

const DeleteDataset = ({ history, datasetId }) => (
  <Mutation mutation={DELETE_DATASET}>
    {deleteDataset => (
      <WarnButton
        tooltip="Delete Dataset"
        icon="fa-trash"
        warn={true}
        action={cb => {
          deleteDataset({ variables: { id: datasetId } }).then(() => {
            history.push('/dashboard/datasets')
            cb()
          })
        }}
      />
    )}
  </Mutation>
)

DeleteDataset.propTypes = {
  history: PropTypes.object,
  datasetId: PropTypes.string,
}

export default withRouter(DeleteDataset)
