import React, { useState } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import styled from '@emotion/styled'

const Button = styled.button({
  // marginBottom: '10px',
  // padding: '10px',
  // minWidth: '200px',
  // lineHeight: '16px',
  // fontSize: '16px',
  // backgroundColor: 'rgb(0, 124, 146)',
  // border: 'none',
  // fontFamily: [
  //   '"Cabin", sans-serif',
  //   'var(--font-family-cabin)'
  // ],
  // color: 'white',
})
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
          <>{'warnin'}</>
        ) : (
          <Button 
            className="btn-blue"
            onClick={toggleWarn}
          >
            <i className="fa fa-trash" />{' DELETE'}
          </Button>
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
