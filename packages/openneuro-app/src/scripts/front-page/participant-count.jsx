import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const PARTICIPANT_COUNT = gql`
  query participantCount {
    participantCount
  }
`

export const participantCountDisplay = ({ loading, data }) => {
  try {
    return loading ? null : data.participantCount
  } catch (e) {
    return null
  }
}

const ParticipantCount = () => (
  <Query query={PARTICIPANT_COUNT} errorPolicy="ignore">
    {participantCountDisplay}
  </Query>
)

export default ParticipantCount
