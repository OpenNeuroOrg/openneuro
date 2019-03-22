import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import SaveButton from '../fragments/save-button.jsx'
import { DRAFT_FRAGMENT } from '../dataset/dataset-query-fragments.js'

const UPDATE_DESCRIPTION = gql`
  mutation updateDescription(
    $datasetId: ID!
    $field: String!
    $value: String!
  ) {
    updateDescription(datasetId: $datasetId, field: $field, value: $value) {
      id
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
      id
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

/**
 * Update dataset_description.json on the draft
 */
const UpdateDescription = ({ datasetId, field, value, done }) => {
  const mutation = Array.isArray(value)
    ? UPDATE_DESCRIPTION_LIST
    : UPDATE_DESCRIPTION
  return (
    <Mutation
      mutation={mutation}
      update={(
        cache,
        { data: { updateDescription, updateDescriptionList } },
      ) => {
        const datasetCacheId = `Dataset:${datasetId}`
        const { draft } = cache.readFragment({
          id: datasetCacheId,
          fragment: DRAFT_FRAGMENT,
        })
        cache.writeFragment({
          id: datasetCacheId,
          fragment: DRAFT_FRAGMENT,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            draft: {
              ...draft,
              description: {
                ...updateDescription,
                ...updateDescriptionList,
              },
            },
          },
        })
      }}>
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
