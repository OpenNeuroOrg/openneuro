import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Helmet from 'react-helmet'
import { pageTitle } from '../../resources/strings'
import { Panel, PanelGroup } from 'react-bootstrap'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetTitle from '../fragments/dataset-title.jsx'
import DatasetUploaded from '../fragments/dataset-uploaded.jsx'
import DatasetModified from '../fragments/dataset-modified.jsx'
import DatasetAuthors from '../fragments/dataset-authors.jsx'
import DatasetSummary from '../fragments/dataset-summary.jsx'
import DatasetAnalytics from '../fragments/dataset-analytics.jsx'
import DatasetFiles from '../fragments/dataset-files.jsx'
import DatasetReadme from '../fragments/dataset-readme.jsx'
import DatasetDescription from '../dataset/dataset-description.jsx'
import DownloadButton from '../fragments/dataset-prominent-links.jsx'
import Validation from '../validation/validation.jsx'
import { SNAPSHOT_ISSUES } from '../dataset/dataset-query-fragments.js'
import schemaGenerator from '../../utils/json-ld.js'
import ErrorBoundary from '../../errors/errorBoundary.jsx'
import UploadResume from '../../uploader/upload-resume.jsx'
import DeleteDataset from '../mutations/delete-button.jsx'
import styled from '@emotion/styled'

const getSnapshotDetails = gql`
  query snapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      tag
      created
      readme
      description {
        Name
        Authors
        DatasetDOI
        License
        Acknowledgements
        HowToAcknowledge
        Funding
        ReferencesAndLinks
      }
      files {
        id
        filename
        size
      }
      summary {
        modalities
        sessions
        subjects
        tasks
        size
        totalFiles
      }
      analytics {
        downloads
        views
      }
      ...SnapshotIssues
    }
  }
  ${SNAPSHOT_ISSUES}
`

const SnapshotContent = ({ dataset, tag }) => (
  <ErrorBoundary subject={'snapshot content unavailable'}>
    <Query
      query={getSnapshotDetails}
      variables={{
        datasetId: dataset.id,
        tag,
      }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Spinner text="Loading Snapshot" active />
        } else {
          if(error && error.message !== 'GraphQL error: Internal Server Error')
            throw new Error(error)
          return data && data.snapshot ? (
            <SnapshotDetails dataset={dataset} snapshot={data.snapshot} />
          ) : (
            <PartialUploadOptions datasetId={dataset.id} />
          )
        }
      }}
    </Query>
  </ErrorBoundary>
)

SnapshotContent.propTypes = {
  dataset: PropTypes.object,
  tag: PropTypes.string,
}

const StyleContainer = styled.div({
  '.fileupload-btn': {
    marginTop: '2rem',
    maxWidth: 'none',
    lineHeight: 'normal',
  }
})


const snapshotDescription = (snapshot, property, defaultValue) => ((snapshot && snapshot.description && snapshot.description[property]) || defaultValue)

const SnapshotDetails = ({ dataset, snapshot }) => {
  const snapshotName = snapshotDescription(snapshot, 'Name', 'No Snapshot')
  
  return (
    <span>
      <div className="col-xs-6">
        <Helmet>
          <title>
            {pageTitle} - {snapshotName}
          </title>
          {snapshot ? <>
            <meta name="description" content={snapshot.readme} />
            <script type="application/ld+json">
              {schemaGenerator(snapshot)}
            </script>
          </> : ''}
        </Helmet>
          <DatasetTitle title={snapshotName} />
          <DatasetUploaded
            uploader={dataset.uploader}
            created={dataset.created}
          />
          <DatasetModified modified={snapshot.created} />
          <DatasetAuthors authors={snapshot.Authors} />
          <DatasetAnalytics
            downloads={snapshot.analytics.downloads}
            views={snapshot.analytics.views}
            snapshot
          />
          <DownloadButton dataset={dataset} />
          <DatasetSummary summary={snapshot.summary} />
          <h2>README</h2>
          <DatasetReadme content={snapshot.readme} />
          <DatasetDescription
            datasetId={dataset.id}
            description={snapshot.description}
            editable={false}
          />
      </div>
      <div className="col-xs-6">
        {snapshot && <>
          <Validation datasetId={dataset.id} issues={snapshot.issues} />
          <DatasetFiles
            datasetId={dataset.id}
            snapshotTag={snapshot.tag}
            datasetName={snapshotName}
            files={snapshot.files}
          />
        </>}
      </div>
    </span>
  )
}

SnapshotDetails.propTypes = {
  dataset: PropTypes.object,
  snapshot: PropTypes.object,
}

const PartialUploadOptions = ({ datasetId }) => (
  <div className="col-xs-6">
    <DatasetTitle title="Partially Uploaded Dataset"/>
    <PanelGroup accordion className="validation-wrap">
      <Panel className="status">
        <p>An upload or edit may have been interrupted.</p>
        <StyleContainer><UploadResume datasetId={datasetId} /></StyleContainer>
        <DeleteDataset datasetId={datasetId} />
      </Panel>
    </PanelGroup>
  </div>
)

PartialUploadOptions.propTypes = {
  datasetId: PropTypes.String,
}

export default SnapshotContent
