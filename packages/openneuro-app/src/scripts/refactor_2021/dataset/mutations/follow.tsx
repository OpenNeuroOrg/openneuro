import React, { FC } from 'react'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { datasetCacheId } from '../../../datalad/mutations/cache-id.js'
import { CountToggle } from '@openneuro/components/count-toggle'

const FOLLOW_DATASET = gql`
  mutation followDataset($datasetId: ID!) {
    followDataset(datasetId: $datasetId) {
      following
      newFollower {
        userId
      }
    }
  }
`

const USER_FOLLOWING = gql`
  fragment UserFollowing on Dataset {
    id
    following
  }
`
const DATASET_FOLLOWERS = gql`
  fragment DatasetFollowers on Dataset {
    id
    followers {
      userId
    }
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
      update={(cache, { data }) => {
        const { following, newFollower } = data.followDataset
        // Update whether or not dataset is followed by user
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: USER_FOLLOWING,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            following: following,
          },
        })
        // Update dataset's list of followers
        const { followers } = cache.readFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_FOLLOWERS,
        })
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_FOLLOWERS,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            followers: following
              ? [...followers, newFollower]
              : followers.filter(
                  follower => follower.userId !== newFollower.userId,
                ),
          },
        })
      }}>
      {followDataset => (
        <CountToggle
          label={following ? 'Following' : 'Follow'}
          icon="fa-bookmark"
          disabled={!profile}
          toggleClick={() => followDataset({ variables: { datasetId } })}
          tooltip="Get notified on new versions/comments"
          clicked={following}
          count={followers}
        />
      )}
    </Mutation>
  )
}
