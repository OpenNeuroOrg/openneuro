import React, { useState } from 'react'
import PropTypes from 'prop-types'
import semver from 'semver'
import { Link } from 'react-router-dom'

const Snapshot = ({ datasetId, snapshots }) => {
  const [changes, setChanges] = useState([])
  const [semanticLevel, setSemanticLevel] = useState('patch')
  const [newChange, updateNewChange] = useState('')

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
        <div className="row">
          <h3>Snapshot Version {newVersion}</h3>
        </div>
        <div className="row btn-group">
          <button
            className={`btn btn-default btn-lg ${majorActive}`}
            onClick={() => setSemanticLevel('major')}>
            Major
          </button>
          <button
            className={`btn btn-default btn-lg ${minorActive}`}
            onClick={() => setSemanticLevel('minor')}>
            Minor
          </button>
          <button
            className={`btn btn-default btn-lg ${patchActive}`}
            onClick={() => setSemanticLevel('patch')}>
            Patch
          </button>
        </div>
        <div className="row">
          <ul>
            {changes.map((change, index) => (
              <li key={index}>{change}</li>
            ))}
          </ul>
        </div>
        <div className="row">
          <div className="col-xs-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter new changes here..."
                value={newChange}
                onInput={e => updateNewChange(e.target.value)}
              />
              <span className="input-group-btn">
                <button
                  className="btn btn-default"
                  type="button"
                  onClick={() => {
                    changes.push(newChange)
                    updateNewChange('')
                  }}>
                  Add
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <Link to={`/datasets/${datasetId}`}>
            <button className="btn-admin-blue">Return to Dataset</button>
          </Link>
          {changes.length ? (
            <button className="btn-modal-action">Create Snapshot</button>
          ) : (
            <span className="text-danger">
              You must add at least one change to create a new snapshot
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Snapshot
