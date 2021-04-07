import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'
import { datasetCacheId } from './cache-id.js'

const STAR_DATASET = gql`
  mutation starDataset($datasetId: ID!) {
    starDataset(datasetId: $datasetId)
  }
`

const USER_STARRED = gql`
  fragment UserStarred on Dataset {
    id
    starred
  }
`

const StarDataset = ({ datasetId, starred }) => (
  <Mutation
    mutation={STAR_DATASET}
    update={(cache, { data: { starDataset } }) => {
      cache.writeFragment({
        id: datasetCacheId(datasetId),
        fragment: USER_STARRED,
        data: {
          __typename: 'Dataset',
          id: datasetId,
          starred: starDataset,
        },
      })
    }}>
    {starDataset => (
      <WarnButton
        tooltip="Save Dataset"
        icon={starred ? 'fa-star icon-minus' : 'fa-star icon-plus'}
        warn={false}
        action={cb => {
          starDataset({ variables: { datasetId } }).then(() => cb())
        }}
      />
    )}
  </Mutation>
)

StarDataset.propTypes = {
  datasetId: PropTypes.string,
  starred: PropTypes.bool,
}

export default StarDataset
