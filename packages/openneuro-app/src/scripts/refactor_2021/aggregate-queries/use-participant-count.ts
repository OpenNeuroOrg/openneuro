import { gql, useQuery } from '@apollo/client'

const PARTICIPANT_COUNT = gql`
  query participantCount($modality: String) {
    participantCount(modality: $modality)
  }
`

const useParticipantCount = (modality?: string) => {
  return useQuery(PARTICIPANT_COUNT, {
    variables: { modality },
  })
}

export default useParticipantCount
