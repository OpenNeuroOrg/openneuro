import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import WarnButton from '../../common/forms/warn-button.jsx'

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
        id: `Dataset:${datasetId}`,
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
        tooltip="Star Dataset"
        icon={starred ? 'fa-star icon-minus' : 'fa-star icon-plus'}
        warn={false}
        action={cb => {
          starDataset({ variables: { datasetId } }).then(() => cb())
        }}
      />
    )}
  </Mutation>
)

export default StarDataset
