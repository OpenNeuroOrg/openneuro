import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import SaveButton from '../fragments/save-button.jsx'
import { DRAFT_FRAGMENT } from '../dataset/dataset-query-fragments.js'
import { datasetCacheId } from './cache-id.js'

export const UPDATE_DESCRIPTION = gql`
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
      EthicsApprovals
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
      Name
      BIDSVersion
      License
      Authors
      Acknowledgements
      HowToAcknowledge
      Funding
      ReferencesAndLinks
      DatasetDOI
      EthicsApprovals
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
    <Mutation
      mutation={mutation}
      update={(
        cache,
        { data: { updateDescription, updateDescriptionList } },
      ) => {
        const { draft } = cache.readFragment({
          id: datasetCacheId(datasetId),
          fragment: DRAFT_FRAGMENT,
        })
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: DRAFT_FRAGMENT,
          data: mergeFieldValue(
            datasetId,
            draft,
            updateDescription,
            updateDescriptionList,
          ),
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
    'EthicsApprovals',
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  done: PropTypes.func,
}

export default UpdateDescription
