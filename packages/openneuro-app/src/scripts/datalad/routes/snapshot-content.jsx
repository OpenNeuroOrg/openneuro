import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Helmet from 'react-helmet'
import { pageTitle } from '../../resources/strings'
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
import DownloadButton from '../fragments/download-button.jsx'
import Validation from '../validation/validation.jsx'
import { SNAPSHOT_ISSUES } from '../dataset/dataset-query-fragments.js'
import schemaGenerator from '../../utils/json-ld.js'

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
  <Query
    query={getSnapshotDetails}
    variables={{
      datasetId: dataset.id,
      tag,
    }}>
    {({ loading, error, data }) => {
      if (loading) {
        return <Spinner text="Loading Snapshot" active />
      } else if (error) {
        throw new Error(error)
      } else {
        return <SnapshotDetails dataset={dataset} snapshot={data.snapshot} />
      }
    }}
  </Query>
)

SnapshotContent.propTypes = {
  dataset: PropTypes.object,
  tag: PropTypes.string,
}

const SnapshotDetails = ({ dataset, snapshot }) => {
  return (
    <span>
      <div className="col-xs-6">
        <Helmet>
          <title>
            {pageTitle} - {snapshot.description.Name}
          </title>
          <meta name="description" content={snapshot.readme} />
          <script type="application/ld+json">
            {schemaGenerator(snapshot)}
          </script>
        </Helmet>
        <DatasetTitle title={snapshot.description.Name} />
        <DatasetUploaded
          uploader={dataset.uploader}
          created={dataset.created}
        />
        <DatasetModified modified={snapshot.created} />
        <DatasetAuthors authors={snapshot.description.Authors} />
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
        <Validation datasetId={dataset.id} issues={snapshot.issues} />
        <DatasetFiles
          datasetId={dataset.id}
          snapshotTag={snapshot.tag}
          datasetName={snapshot.description.Name}
          files={snapshot.files}
        />
      </div>
    </span>
  )
}

SnapshotDetails.propTypes = {
  dataset: PropTypes.object,
  snapshot: PropTypes.object,
}

export default SnapshotContent
