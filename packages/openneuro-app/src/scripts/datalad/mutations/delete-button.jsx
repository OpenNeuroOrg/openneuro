import React, { useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import styled from '@emotion/styled'

const WarnButton = styled.button({
  flexBasis: '1px',
  flexGrow: '1',
  fontSize: '16px',
  padding: '8px',
})
const WarnButtonContainer = styled.div`
  display: flex;

  button:last-child {
    margin-left: 10px;
  }
`

const DELETE_DATASET = gql`
  mutation deleteDataset($id: ID!) {
    deleteDataset(id: $id)
  }
`

const DeleteDataset = ({ history, datasetId }) => {
  const [ warn, setWarn ] = useState(false)

  const toggleWarn = () => setWarn(!warn)

  return (
    <Mutation mutation={DELETE_DATASET}>
      {deleteDataset => (
        warn ? (
          <WarnButtonContainer>
            <WarnButton
              className="btn-success"
              onClick={() => {
                deleteDataset({ variables: { id: datasetId } })
                  .then(() => history.push('/dashboard/datasets'))
              }}
            >
              {'CONFIRM  '}<i className="fa fa-trash" />
            </WarnButton>
            <WarnButton
              className="btn-danger"
              onClick={toggleWarn}
            >
              {'CANCEL'}
            </WarnButton>
          </WarnButtonContainer>
        ) : (
          <button 
            className="btn-blue"
            onClick={toggleWarn}
          >
            <i className="fa fa-trash" />{' DELETE'}
          </button>
        )
      )}
    </Mutation>
  )
}

DeleteDataset.propTypes = {
  history: PropTypes.object,
  datasetId: PropTypes.string,
}

export default withRouter(DeleteDataset)
