import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
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
import DatasetCitation from '../fragments/dataset-citation.jsx'
import Validation from '../validation/validation.jsx'
import { SNAPSHOT_FIELDS } from '../dataset/dataset-query-fragments.js'
import schemaGenerator from '../../utils/json-ld.js'
import { Media } from '../../styles/media'
import { MobileClass } from './mobile-class'

const getSnapshotDetails = gql`
  query snapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      ...SnapshotFields
    }
  }
  ${SNAPSHOT_FIELDS}
`

const SnapshotContent = ({ dataset, tag }) => {
  const { loading, error, data, fetchMore } = useQuery(getSnapshotDetails, {
    variables: {
      datasetId: dataset.id,
      tag,
    },
  })
  if (loading) {
    return <Spinner text="Loading Snapshot" active />
  } else if (error) {
    throw new Error(error.toString())
  } else {
    return (
      <DatasetQueryContext.Provider
        value={{
          datasetId: dataset.id,
          fetchMore,
          error: null,
        }}>
        <SnapshotDetails dataset={dataset} snapshot={data.snapshot} />
      </DatasetQueryContext.Provider>
    )
  }
}

SnapshotContent.propTypes = {
  dataset: PropTypes.object,
  tag: PropTypes.string,
}

const SnapshotDetails = ({ dataset, snapshot }) => {
  return (
    <span>
      <MobileClass>
        <Helmet>
          <title>
            {snapshot.description.Name} - Snapshot {snapshot.tag} - {pageTitle}
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
        <Media greaterThanOrEqual="medium">
          <DownloadButton dataset={dataset} />
        </Media>
        <Media at="small">
          <Validation datasetId={dataset.id} issues={snapshot.issues} />
        </Media>
        <DatasetSummary datasetId={dataset.id} summary={snapshot.summary} />
        <h2>README</h2>
        <DatasetReadme content={snapshot.readme} />
        <DatasetDescription
          datasetId={dataset.id}
          description={snapshot.description}
          editMode={false}
        />
        <h2>How To Cite</h2>
        <DatasetCitation snapshot={snapshot} />
        <h5>
          <Link to="/cite">More citation info</Link>
        </h5>
      </MobileClass>
      <MobileClass>
        <Media greaterThanOrEqual="medium">
          <Validation datasetId={dataset.id} issues={snapshot.issues} />
        </Media>
        <DatasetFiles
          datasetId={dataset.id}
          snapshotTag={snapshot.tag}
          datasetName={snapshot.description.Name}
          files={snapshot.files}
        />
        <DatasetGitHash gitHash={snapshot.hexsha} />
      </MobileClass>
    </span>
  )
}

SnapshotDetails.propTypes = {
  dataset: PropTypes.object,
  snapshot: PropTypes.object,
}

export default SnapshotContent
