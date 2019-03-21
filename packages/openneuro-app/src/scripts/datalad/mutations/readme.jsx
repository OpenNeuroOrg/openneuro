import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import SaveButton from '../fragments/save-button.jsx'

const UPDATE_README = gql`
  mutation updateReadme($datasetId: ID!, $value: String!) {
    updateReadme(datasetId: $datasetId, value: $value)
  }
`

const UpdateReadme = ({ datasetId, value, done }) => (
  <Mutation mutation={UPDATE_README}>
    {updateReadme => (
      <SaveButton
        action={async () => {
          await updateReadme({ variables: { datasetId, value } })
          done()
        }}
      />
    )}
  </Mutation>
)

export default UpdateReadme
