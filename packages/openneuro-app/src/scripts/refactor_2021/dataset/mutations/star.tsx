import React, { FC } from 'react'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { datasetCacheId } from '../../../datalad/mutations/cache-id.js'
import { CountToggle } from '@openneuro/components/count-toggle'

const STAR_DATASET = gql`
  mutation starDataset($datasetId: ID!) {
    starDataset(datasetId: $datasetId) {
      starred
      newStar {
        userId
      }
    }
  }
`

const USER_STARRED = gql`
  fragment UserStarred on Dataset {
    id
    starred
  }
`
const DATASET_STARS = gql`
  fragment DatasetStars on Dataset {
    id
    stars {
      userId
    }
  }
`

interface StarDatasetProps {
  datasetId: string
  profile: boolean
  starred: boolean
  stars: number
}
export const StarDataset: FC<StarDatasetProps> = ({
  datasetId,
  starred,
  profile,
  stars,
}) => {
  return (
    <Mutation
      mutation={STAR_DATASET}
      update={(cache, { data }) => {
        const { starred, newStar } = data.starDataset
        // Update whether or not dataset is starred by user
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: USER_STARRED,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            starred,
          },
        })
        // Update dataset's list of followers
        const { stars } = cache.readFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_STARS,
        })
        cache.writeFragment({
          id: datasetCacheId(datasetId),
          fragment: DATASET_STARS,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            stars: starred
              ? [...stars, newStar]
              : stars.filter(star => star.userId !== newStar.userId),
          },
        })
      }}>
      {starDataset => (
        <CountToggle
          label={starred ? 'Bookmarked' : 'Bookmark'}
          icon="fa-bookmark"
          disabled={!profile}
          toggleClick={() => starDataset({ variables: { datasetId } })}
          tooltip="hello Tip"
          clicked={starred}
          count={stars}
        />
      )}
    </Mutation>
  )
}
