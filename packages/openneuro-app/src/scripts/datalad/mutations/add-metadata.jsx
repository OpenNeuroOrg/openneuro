import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import MetadataForm from './metadata-form.jsx'
import SubmitMetadata from './submit-metadata.jsx'
import { getDatasetUrl } from '../../utils/dataset-url'

const initializeFormData = dataset => {
  const getFromMetadata = key => dataset.metadata && dataset.metadata[key]
  return {
    // get from form
    associatedPaperDOI: getFromMetadata('associatedPaperDOI') || '',
    species: getFromMetadata('species') || '',
    studyLongitudinal: getFromMetadata('studyLongitudinal') || '',
    studyDomain: getFromMetadata('studyDomain') || '',
    trialCount: getFromMetadata('trialCount') || null,

    studyDesign: getFromMetadata('studyDesign') || '',
    openneuroPaperDOI: getFromMetadata('openneuroPaperDOI') || '',
    dxStatus: getFromMetadata('dxStatus') || '',

    // gettable from openneuro
    datasetId: getFromMetadata('datasetId') || dataset.id,
    datasetUrl: getFromMetadata('datasetUrl') || getDatasetUrl(dataset),
    firstSnapshotCreatedAt:
      getFromMetadata('firstSnapshotCreatedAt') ||
      (Array.isArray(dataset.snapshots) &&
        dataset.snapshots.length &&
        dataset.snapshots[0].created) ||
      null,
    latestSnapshotCreatedAt:
      getFromMetadata('latestSnapshotCreatedAt') ||
      (Array.isArray(dataset.snapshots) &&
        dataset.snapshots.length &&
        dataset.snapshots[dataset.snapshots.length - 1].created) ||
      null,
    adminUsers: getFromMetadata('adminUsers') ||
      (Array.isArray(dataset.permissions) &&
        dataset.permissions
          .filter(permission => permission.level === 'admin')
          .map(({ user }) => user && user.email)) || ['dataset has no admins'],

    // got from validator MOCK DATA
    datasetName:
      getFromMetadata('datasetName') || 'dataset unnamed in description.json',
    seniorAuthor:
      getFromMetadata('seniorAuthor') ||
      'authors not listed in description.json',
    dataProcessed: getFromMetadata('dataProcessed') || false,
    tasksCompleted: getFromMetadata('tasksCompleted') || 'n/a - no tasks found',
  }
}
const AddMetadata = ({ dataset, history, location }) => {
  const [values, setValues] = useState(initializeFormData(dataset))
  const handleInputChange = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    }
    setValues(newValues)
  }
  const handleFormSubmit = e => {
    e.preventDefault()
  }
  const submitPath = location.state && location.state.submitPath

  return (
    <>
      <header className="col-xs-12">
        <h1>Add Metadata</h1>
        <hr />
      </header>
      <MetadataForm
        values={values}
        onChange={handleInputChange}
        onSubmit={handleFormSubmit}
      />
      <div className="col-xs-12 dataset-form-controls">
        <div className="col-xs-12 modal-actions">
          <Link to={`/datasets/${dataset.id}`}>
            <button className="btn-admin-blue">Return to Dataset</button>
          </Link>
          <SubmitMetadata
            datasetId={dataset.id}
            metadata={values}
            done={() => submitPath && history.push(submitPath)}
          />
        </div>
      </div>
    </>
  )
}

AddMetadata.propTypes = {
  dataset: PropTypes.object,
}

export default withRouter(AddMetadata)
