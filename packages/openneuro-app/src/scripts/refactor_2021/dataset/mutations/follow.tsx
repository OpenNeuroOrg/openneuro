import React, { FC, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { datasetCacheId } from '../../../datalad/mutations/cache-id.js'
import { CountToggle } from '@openneuro/components/count-toggle'
import { UserModalOpenCtx } from '../../user-login-modal-ctx'

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
  const { setUserModalOpen, setLoginOptions } = useContext(UserModalOpenCtx)
  const location = useLocation()
  const handleToggle = followDataset => () => {
    if (!profile) {
      // if user is not logged in, give them the option to do so
      // then redirect back to this page
      setLoginOptions(prevState => ({
        ...prevState,
        redirect: `${location.pathname}`,
      }))
      setUserModalOpen(true)
    } else {
      followDataset({ variables: { datasetId } })
    }
  }
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
          icon="fa-star"
          disabled={!profile}
          toggleClick={handleToggle(followDataset)}
          tooltip="Get notified on new versions/comments"
          clicked={following}
          count={followers}
        />
      )}
    </Mutation>
  )
}
