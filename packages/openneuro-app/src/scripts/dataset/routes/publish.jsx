import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import PublishDataset from '../mutations/publish.jsx'
import { Button } from '@openneuro/components/button'
const hasExpectedMetadata = metadata =>
  typeof metadata === 'object' && metadata !== null

const Publish = ({ datasetId, metadata }) =>
  hasExpectedMetadata(metadata) ? (
    <div className="dataset-form container">
      <h2>Publish</h2>
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
          <PublishDataset datasetId={datasetId} />
          <Link to={`/datasets/${datasetId}`}>
            <Button nobg={true} label="Return to Dataset" />
          </Link>
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
