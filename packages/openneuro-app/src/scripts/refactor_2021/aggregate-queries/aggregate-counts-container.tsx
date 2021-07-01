import React from 'react'
import useParticipantCount from './use-participant-count'
import usePublicDatasetsCount from './use-publicDatasets-count'
import { AggregateCount } from '@openneuro/components'

export interface AggregateCountsContainerProps {
  label?: string
}

const AggregateCountsContainer: React.FC<AggregateCountsContainerProps> = ({
  label,
}) => {
  const {
    loading: participantLoading,
    data: participantData,
    error: participantError,
  } = useParticipantCount(label)
  const {
    loading: publicDatasetsLoading,
    data: publicDatasetsData,
    error: publicDatasetsError,
  } = usePublicDatasetsCount(label)

  const loading = participantLoading || publicDatasetsLoading
  const error = participantError || publicDatasetsError

  if (loading) return <>...</>
  else if (error) return null
  else
    return (
      <>
        <AggregateCount
          type="participants"
          count={participantData.participantCount}
        />
        <AggregateCount
          type="publicDataset"
          count={publicDatasetsData.datasets.pageInfo.count}
        />
      </>
    )
}

export default AggregateCountsContainer
