import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import SaveButton from '../fragments/save-button.jsx'
import { DRAFT_FRAGMENT } from '../dataset/dataset-query-fragments.js'

const UPDATE_README = gql`
  mutation updateReadme($datasetId: ID!, $value: String!) {
    updateReadme(datasetId: $datasetId, value: $value)
  }
`

const UpdateReadme = ({ datasetId, value, done }) => (
  <Mutation
    mutation={UPDATE_README}
    update={cache => {
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
            readme: value,
          },
        },
      })
    }}>
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

UpdateReadme.propTypes = {
  datasetId: PropTypes.string,
  value: PropTypes.string,
  done: PropTypes.func,
}

export default UpdateReadme
