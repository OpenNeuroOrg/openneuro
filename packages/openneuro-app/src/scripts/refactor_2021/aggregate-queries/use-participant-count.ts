import { gql, useQuery } from '@apollo/client'

const PARTICIPANT_COUNT = gql`
  query participantCount {
    participantCount
  }
`

const useParticipantCount = (label?: string) => {
  return useQuery(PARTICIPANT_COUNT, {
    variables: { label },
  })
}

export default useParticipantCount
