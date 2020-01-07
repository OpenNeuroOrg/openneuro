import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Helmet from 'react-helmet'
import { pageTitle } from '../../resources/strings'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetQueryContext from '../dataset/dataset-query-context.js'
import DatasetTitle from '../fragments/dataset-title.jsx'
import DatasetUploaded from '../fragments/dataset-uploaded.jsx'
import DatasetModified from '../fragments/dataset-modified.jsx'
import DatasetAuthors from '../fragments/dataset-authors.jsx'
import DatasetSummary from '../fragments/dataset-summary.jsx'
import DatasetAnalytics from '../fragments/dataset-analytics.jsx'
import DatasetFiles from '../fragments/dataset-files.jsx'
import DatasetGitHash from '../fragments/dataset-git-hash.jsx'
import DatasetReadme from '../fragments/dataset-readme.jsx'
import DatasetDescription from '../dataset/dataset-description.jsx'
import DownloadButton from '../fragments/dataset-prominent-links.jsx'
import Validation from '../validation/validation.jsx'
import { SNAPSHOT_ISSUES } from '../dataset/dataset-query-fragments.js'
import schemaGenerator from '../../utils/json-ld.js'
import useMedia from '../../mobile/media-hook.jsx'

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
        directory
      }
      summary {
        modalities
        sessions
        subjects
        subjectMetadata {
          participantId
          age
          sex
          group
        }
        tasks
        size
        totalFiles
        dataProcessed
      }
      analytics {
        downloads
        views
      }
      ...SnapshotIssues
      hexsha
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
    {({ loading, error, data, fetchMore }) => {
      if (loading) {
        return <Spinner text="Loading Snapshot" active />
      } else if (error) {
        throw new Error(error)
      } else {
        return (
          <DatasetQueryContext.Provider
            value={{
              datasetId: dataset.id,
              fetchMore,
            }}>
            <SnapshotDetails dataset={dataset} snapshot={data.snapshot} />
          </DatasetQueryContext.Provider>
        )
      }
    }}
  </Query>
)

SnapshotContent.propTypes = {
  dataset: PropTypes.object,
  tag: PropTypes.string,
}

const SnapshotDetails = ({ dataset, snapshot }) => {
  const isMobile = useMedia('(max-width: 765px) ')
  const mobileClass = isMobile ? 'mobile-class' : 'col-xs-6'
  return (
    <span>
      <div className={mobileClass}>
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
        {!isMobile && <DownloadButton dataset={dataset} />}
        {isMobile && (
          <Validation
            datasetId={dataset.id}
            issues={snapshot.issues}
            isMobile={isMobile}
          />
        )}
        <DatasetSummary datasetId={dataset.id} summary={snapshot.summary} />
        <h2>README</h2>
        <DatasetReadme content={snapshot.readme} />
        <DatasetDescription
          datasetId={dataset.id}
          description={snapshot.description}
          editable={false}
        />
      </div>
      <div className={mobileClass}>
        {!isMobile && (
          <Validation datasetId={dataset.id} issues={snapshot.issues} />
        )}
        <DatasetFiles
          datasetId={dataset.id}
          snapshotTag={snapshot.tag}
          datasetName={snapshot.description.Name}
          files={snapshot.files}
        />
        <DatasetGitHash gitHash={snapshot.hexsha} />
      </div>
    </span>
  )
}

SnapshotDetails.propTypes = {
  dataset: PropTypes.object,
  snapshot: PropTypes.object,
}

export default SnapshotContent
