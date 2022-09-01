import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import PublishDataset from '../mutations/publish.jsx'
import { DatasetPageBorder } from './styles/dataset-page-border'
import { HeaderRow3 } from './styles/header-row'

const hasExpectedMetadata = metadata =>
  typeof metadata === 'object' && metadata !== null

const Publish = ({ datasetId, metadata }) =>
  hasExpectedMetadata(metadata) ? (
    <DatasetPageBorder className="dataset-form">
      <HeaderRow3>Publish</HeaderRow3>
      <div className="dataset-form-body">
        <p className="text-danger">
          All existing and future snapshots of this dataset will be released
          publicly under a{' '}
          <a href="https://wiki.creativecommons.org/wiki/CC0">CC0 license</a>.
        </p>
      </div>
      <div className="dataset-form-controls">
        <div className="modal-actions">
          <PublishDataset datasetId={datasetId} />
        </div>
      </div>
    </DatasetPageBorder>
  ) : (
    <Navigate
      to={`/datasets/${datasetId}/metadata`}
      state={{ submitPath: `/datasets/${datasetId}/publish` }}
      replace
    />
  )

Publish.propTypes = {
  datasetId: PropTypes.string,
  metadata: PropTypes.object,
}

export default Publish
