import React from 'react'
import styled from '@emotion/styled'
import { DataTable } from '../../components/data-table'
import { gql, useQuery } from '@apollo/client'
import { Loading } from '@openneuro/components/loading'
import { makeCsv } from '../../utils/csv'

const MetadataPageStyle = styled.div`
  background: white;
  overflow-x: scroll;
  padding: 1em;
  height: calc(100vh - 125px);
  white-space: nowrap;
`

const MetadataPageButton = styled.button`
  display: inline-block;
  margin-right: 1em;
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
        <p>
          <MetadataPageButton
            role="button"
            type="button"
            className="on-button on-button--small on-button--primary icon-text"
            aria-label="Download"
            onClick={() =>
              makeCsv(data?.publicMetadata, 'openneuro-metadata.csv')
            }>
            <i className="fa fa-download css-0" aria-hidden="true"></i>Download
            CSV
          </MetadataPageButton>
          Metadata collected for all public datasets on OpenNeuro.
        </p>
        <DataTable
          data={data?.publicMetadata}
          downloadFilename="openneuro-metadata.csv"
          hideColumns={[
            '__typename',
            'datasetUrl',
            'affirmedDefaced',
            'affirmedConsent',
          ]}></DataTable>
      </MetadataPageStyle>
    )
  }
}
