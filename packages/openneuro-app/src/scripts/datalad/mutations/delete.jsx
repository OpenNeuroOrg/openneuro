import React from 'react'
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

export default withRouter(DeleteDataset)
