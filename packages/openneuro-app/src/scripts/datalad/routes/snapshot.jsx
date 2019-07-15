import React, { useState } from 'react'
import PropTypes from 'prop-types'
import semver from 'semver'
import { Link } from 'react-router-dom'
import SnapshotDataset from '../mutations/snapshot.jsx'
import ValidationStatus from '../validation/validation-status.jsx'
import EditList from '../fragments/edit-list.jsx'

export const NoErrors = ({ issues, children }) => {
  const noErrors =
    issues && issues.filter(issue => issue.severity === 'error').length === 0
  // zero authors will cause DOI minting to fail
  const hasAuthor =
    issues && issues.filter(issue => issue.code === 113).length === 0
  if (noErrors && hasAuthor) {
    return children
  } else {
    const correctErrorsMessage =
      'BIDS validation must be complete and all errors corrected'
    const noAuthorMessage =
      '"Authors" must include at least one entry in dataset_description.json'
    const includedMessages = []
    if (!noErrors) includedMessages.push(correctErrorsMessage)
    if (!hasAuthor) includedMessages.push(noAuthorMessage)
    return (
      <span className="text-danger">
        {`${includedMessages.join(' and ')} to create a snapshot`}
      </span>
    )
  }
}

const SnapshotRoute = ({ datasetId, snapshots, issues }) => {
  const [changes, setChanges] = useState([])
  const [semanticLevel, setSemanticLevel] = useState('patch')

  const latestSnapshot = snapshots.length && snapshots[snapshots.length - 1]
  const newVersion =
    snapshots.length && semver.valid(latestSnapshot.tag)
      ? semver.inc(latestSnapshot.tag, semanticLevel)
      : '1.0.0'

  const majorActive = semanticLevel === 'major' && 'active'
  const minorActive = semanticLevel === 'minor' && 'active'
  const patchActive = semanticLevel === 'patch' && 'active'

  return (
    <div className="dataset-form">
      <div className="col-xs-12 dataset-form-header">
        <div className="form-group">
          <label>Create Snapshot</label>
        </div>
        <hr />
      </div>
      <div className="col-xs-12 dataset-form-body">
        <h4>BIDS Validation</h4>
        <ValidationStatus datasetId={datasetId} issues={issues} />
        <h4>Version</h4>
        <div className="input-group">
          <span className="input-group-addon" style={{ width: '100%' }}>
            {newVersion}
          </span>
          <div className="input-group-btn">
            <button
              className={`btn btn-default ${majorActive}`}
              onClick={() => setSemanticLevel('major')}>
              Major
            </button>
            <button
              className={`btn btn-default ${minorActive}`}
              onClick={() => setSemanticLevel('minor')}>
              Minor
            </button>
            <button
              className={`btn btn-default ${patchActive}`}
              onClick={() => setSemanticLevel('patch')}>
              Patch
            </button>
          </div>
        </div>
        <h4>Changelog</h4>
        <EditList
          placeholder="Enter new changes here..."
          elements={changes}
          setElements={setChanges}
        />
      </div>
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <Link to={`/datasets/${datasetId}`}>
            <button className="btn-admin-blue">Return to Dataset</button>
          </Link>
          <NoErrors issues={issues}>
            {changes.length ? (
              <SnapshotDataset
                datasetId={datasetId}
                tag={newVersion}
                changes={changes}
              />
            ) : (
              <span className="text-danger">
                You must add at least one change message to create a new
                snapshot
              </span>
            )}
          </NoErrors>
        </div>
      </div>
    </div>
  )
}

SnapshotRoute.propTypes = {
  datasetId: PropTypes.string,
  snapshots: PropTypes.array,
  issues: PropTypes.array,
}

export default SnapshotRoute
