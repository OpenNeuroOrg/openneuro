import React, { FC } from 'react'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { datasetCacheId } from '../../../datalad/mutations/cache-id.js'
import { CountToggle } from '@openneuro/components/count-toggle'

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

interface FollowDatasetProps {
  datasetId: string
  profile: boolean
  following: boolean
  followers: number
}

export const FollowDataset: FC<FollowDatasetProps> = ({
  datasetId,
  following,
  profile,
  followers,
}) => {
  return (
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
        <CountToggle
          label={following ? 'Following' : 'Follow'}
          icon="fa-bookmark"
          disabled={!profile}
          toggleClick={() => followDataset({ variables: { datasetId } })}
          tooltip="hello Tip"
          clicked={following}
          count={followers}
        />
      )}
    </Mutation>
  )
}
