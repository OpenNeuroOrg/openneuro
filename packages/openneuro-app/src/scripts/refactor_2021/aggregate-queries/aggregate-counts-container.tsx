import React from 'react'
import useParticipantCount from './use-participant-count'
import usePublicDatasetsCount from './use-publicDatasets-count'
import { AggregateCount } from '@openneuro/components'

export interface AggregateCountsContainerProps {
  modality?: string
}

const AggregateCountsContainer: React.FC<AggregateCountsContainerProps> = ({
  modality,
}) => {
  const {
    loading: participantLoading,
    data: participantData,
    error: participantError,
  } = useParticipantCount(modality)
  const {
    loading: publicDatasetsLoading,
    data: publicDatasetsData,
    error: publicDatasetsError,
  } = usePublicDatasetsCount(modality)

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
