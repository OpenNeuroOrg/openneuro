import React from 'react'
import PropTypes from 'prop-types'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import WarnButton from '../../common/forms/warn-button.jsx'
import { datasetCacheId } from './cache-id.js'

const FOLLOW_DATASET = gql`
  mutation followDataset($datasetId: ID!) {
    followDataset(datasetId: $datasetId)
  }
`

const USER_FOLLOWING = gql`
  fragment UserFollowing on Dataset {
    id
    following
  }
`

const FollowDataset = ({ datasetId, following }) => (
  <Mutation
    mutation={FOLLOW_DATASET}
    update={(cache, { data: { followDataset } }) => {
      cache.writeFragment({
        id: datasetCacheId(datasetId),
        fragment: USER_FOLLOWING,
        data: {
          __typename: 'Dataset',
          id: datasetId,
          following: followDataset,
        },
      })
    }}>
    {followDataset => (
      <WarnButton
        tooltip="Follow Dataset"
        icon={following ? 'fa-tag icon-minus' : 'fa-tag icon-plus'}
        warn={false}
        action={cb => {
          followDataset({ variables: { datasetId } }).then(() => cb())
        }}
      />
    )}
  </Mutation>
)

FollowDataset.propTypes = {
  datasetId: PropTypes.string,
  following: PropTypes.bool,
}

export default FollowDataset
