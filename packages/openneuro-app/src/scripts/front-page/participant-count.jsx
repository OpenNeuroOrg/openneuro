import React from 'react'
import { Query } from '@apollo/client/react/components'
import gql from 'graphql-tag'

const PARTICIPANT_COUNT = gql`
  query participantCount {
    participantCount
  }
`

export const participantCount = ({ loading, data }) => {
  try {
    return loading ? null : data.participantCount
  } catch (e) {
    return null
  }
}

const ParticipantCount = () => (
  <Query query={PARTICIPANT_COUNT} errorPolicy="ignore">
    {participantCount}
  </Query>
)

export default ParticipantCount
