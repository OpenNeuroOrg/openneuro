import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import SaveButton from '../fragments/save-button.jsx'

const UPDATE_DESCRIPTION = gql`
  mutation updateDescription(
    $datasetId: ID!
    $field: String!
    $value: String!
  ) {
    updateDescription(datasetId: $datasetId, field: $field, value: $value) {
      Name
      BIDSVersion
      License
      Authors
      Acknowledgements
      HowToAcknowledge
      Funding
      ReferencesAndLinks
      DatasetDOI
    }
  }
`

const UPDATE_DESCRIPTION_LIST = gql`
  mutation updateDescriptionList(
    $datasetId: ID!
    $field: String!
    $value: [String!]
  ) {
    updateDescriptionList(datasetId: $datasetId, field: $field, value: $value) {
      Name
      BIDSVersion
      License
      Authors
      Acknowledgements
      HowToAcknowledge
      Funding
      ReferencesAndLinks
      DatasetDOI
    }
  }
`

const UpdateDescription = ({ datasetId, field, value, done }) => {
  let mutation
  if (Array.isArray(value)) {
    mutation = UPDATE_DESCRIPTION_LIST
  } else {
    mutation = UPDATE_DESCRIPTION
  }
  return (
    <Mutation mutation={mutation}>
      {updateDescription => (
        <SaveButton
          action={async () => {
            await updateDescription({ variables: { datasetId, field, value } })
            done()
          }}
        />
      )}
    </Mutation>
  )
}

export default UpdateDescription
