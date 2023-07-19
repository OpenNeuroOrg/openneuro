import React from 'react'
import styled from '@emotion/styled'
import { DataTable } from '../../components/data-table'
import { gql, useQuery } from '@apollo/client'
import { Loading } from '@openneuro/components/loading'

const MetadataPageStyle = styled.div`
  background: white;
  min-height: calc(100vh - 130px);
  overflow-x: scroll;
`

const METADATA_QUERY = gql`
  query {
    publicMetadata {
      datasetId
      datasetUrl
      datasetName
      firstSnapshotCreatedAt
      latestSnapshotCreatedAt
      dxStatus
      tasksCompleted
      trialCount
      grantFunderName
      grantIdentifier
      studyDesign
      studyDomain
      studyLongitudinal
      dataProcessed
      species
      associatedPaperDOI
      openneuroPaperDOI
      seniorAuthor
      adminUsers
      ages
      modalities
      affirmedDefaced
      affirmedConsent
    }
  }
`

export function DatasetMetadata(): React.ReactElement {
  const { loading, error, data } = useQuery(METADATA_QUERY, {
    errorPolicy: 'all',
  })
  if (loading || error) {
    return <Loading />
  } else {
    return (
      <MetadataPageStyle>
        <DataTable
          data={data?.publicMetadata}
          hideColumns={'__typename'}></DataTable>
      </MetadataPageStyle>
    )
  }
}
