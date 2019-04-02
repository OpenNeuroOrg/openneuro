import React, { useState } from 'react'
import PropTypes from 'prop-types'
import semver from 'semver'
import { Link } from 'react-router-dom'
import SnapshotDataset from '../mutations/snapshot.jsx'
import EditList from '../fragments/edit-list.jsx'

const Snapshot = ({ datasetId, snapshots }) => {
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
        <h2>Create Snapshot</h2>
        <hr />
      </div>
      <div className="col-xs-4 dataset-form-body">
        <h4>Version</h4>
        <div className="input-group">
          <span className="input-group-addon" id="sizing-addon1">
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
          {changes.length ? (
            <SnapshotDataset
              datasetId={datasetId}
              tag={newVersion}
              changes={changes}
            />
          ) : (
            <span className="text-danger">
              You must add at least one change message to create a new snapshot
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

Snapshot.propTypes = {
  datasetId: PropTypes.string,
  snapshots: PropTypes.array,
}

export default Snapshot
