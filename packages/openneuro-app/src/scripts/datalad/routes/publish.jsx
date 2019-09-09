import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import PublishDataset from '../mutations/publish.jsx'

const expectedMetadata = [
  'associatedPaperDOI',
  'species',
  'studyLongitudinal',
  'studyDomain',
  'trialCount',
  'studyDesign',
  'openneuroPaperDOI',
  'dxStatus',
  'datasetId',
  'datasetUrl',
  'firstSnapshotCreatedAt',
  'latestSnapshotCreatedAt',
  'adminUsers',
  'modalities',
  'datasetName',
  'seniorAuthor',
  'dataProcessed',
  'ages',
  'tasksCompleted',
]

const hasExpectedMetadata = metadata =>
  metadata &&
  Object.entries(metadata).every(item => {
    const exists = item[1] !== undefined && item[1] !== null
    console.log('check: ', { metadata, item })
    if (!exists) console.log(item)
    return exists
  })

const Publish = ({ datasetId, metadata }) =>
  hasExpectedMetadata(metadata) ? (
    <div className="dataset-form">
      <div className="col-xs-12 dataset-form-header">
        <div className="form-group">
          <label>Publish</label>
        </div>
        <hr />
        <div className="col-xs-12 dataset-form-body">
          <p className="text-danger">
            All existing and future snapshots of this dataset will be released
            publicly under a{' '}
            <a href="https://wiki.creativecommons.org/wiki/CC0">CC0 license</a>.
          </p>
        </div>
        <div className="col-xs-12 dataset-form-controls">
          <div className="col-xs-12 modal-actions">
            <Link to={`/datasets/${datasetId}`}>
              <button className="btn-admin-blue">Return to Dataset</button>
            </Link>
            <PublishDataset datasetId={datasetId} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect
      to={{
        pathname: `/datasets/${datasetId}/metadata`,
        state: {
          submitPath: `/datasets/${datasetId}/publish`,
        },
      }}
    />
  )

Publish.propTypes = {
  datasetId: PropTypes.string,
  metadata: PropTypes.object,
}

export default Publish
