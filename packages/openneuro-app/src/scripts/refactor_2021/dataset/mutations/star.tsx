import React, { FC } from 'react'
import { gql } from '@apollo/client'
import { Mutation } from '@apollo/client/react/components'
import { datasetCacheId } from '../../../datalad/mutations/cache-id.js'
import { CountToggle } from '@openneuro/components/count-toggle'

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
