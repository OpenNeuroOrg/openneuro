import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import SaveButton from '../fragments/save-button.jsx'

export const UPDATE_DESCRIPTION = gql`
  mutation updateDescription(
    $datasetId: ID!
    $field: String!
    $value: String!
  ) {
    updateDescription(datasetId: $datasetId, field: $field, value: $value) {
      id
    }
  }
`

export const UPDATE_DESCRIPTION_LIST = gql`
  mutation updateDescriptionList(
    $datasetId: ID!
    $field: String!
    $value: [String!]
  ) {
    updateDescriptionList(datasetId: $datasetId, field: $field, value: $value) {
      id
    }
  }
`

export const mergeFieldValue = (
  datasetId,
  draft,
  updateDescription,
  updateDescriptionList,
) => ({
  __typename: 'Dataset',
  id: datasetId,
  draft: {
    ...draft,
    description: {
      ...updateDescription,
      ...updateDescriptionList,
    },
  },
})

/**
 * Update dataset_description.json on the draft
 */
const UpdateDescription = ({ datasetId, field, value, done }) => {
  const mutation = Array.isArray(value)
    ? UPDATE_DESCRIPTION_LIST
    : UPDATE_DESCRIPTION
  return (
    <Mutation mutation={mutation} ignoreResults>
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

UpdateDescription.propTypes = {
  datasetId: PropTypes.string,
  field: PropTypes.oneOf([
    'Name',
    'BIDSVersion',
    'License',
    'Authors',
    'Acknowledgements',
    'HowToAcknowledge',
    'Funding',
    'ReferencesAndLinks',
    'DatasetDOI',
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  done: PropTypes.func,
}

export default UpdateDescription
