import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Spinner from '../../common/partials/spinner.jsx'
import DatasetUploaded from '../fragments/dataset-uploaded.jsx'
import DatasetModified from '../fragments/dataset-modified.jsx'
import DatasetAuthors from '../fragments/dataset-authors.jsx'
import DatasetSummary from '../fragments/dataset-summary.jsx'
import DatasetFiles from '../fragments/dataset-files.jsx'

const getSnapshotDetails = gql`
  query snapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      tag
      files {
        id
        filename
        size
      }
    }
  }
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
        <DatasetUploaded
          uploader={dataset.uploader}
          created={dataset.created}
        />
        <DatasetModified modified={snapshot.modified} />
        <DatasetAuthors authors={['J. Doe', 'J. Doe']} />
        <DatasetSummary summary={snapshot.summary} />
        <h6>{`snapshot tag: ${snapshot.tag}`}</h6>
      </div>
      <div className="col-xs-6">
        <DatasetFiles files={snapshot.files} />
      </div>
    </span>
  )
}

SnapshotDetails.propTypes = {
  dataset: PropTypes.object,
  snapshot: PropTypes.object,
}

export default SnapshotContent
