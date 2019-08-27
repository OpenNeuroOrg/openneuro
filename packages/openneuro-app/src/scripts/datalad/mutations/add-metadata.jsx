import React, { useState } from 'react'
import MetadataForm from './metadata-form.jsx'
import { PropTypes } from 'prop-types'
import { getDatasetUrl } from '../../utils/dataset-url'

const initializeFormData = dataset => ({
  // get from form
  associatedPaperDOI: '',
  species: '',
  studyLongitudinal: '',
  studyDomain: '',
  trialCount: '',

  studyDesign: '',
  openneuroPaperDOI: '',
  dxStatus: '',

  // gettable from openneuro
  datasetId: dataset.id,
  datasetUrl: getDatasetUrl(dataset),
  firstSnapshotCreatedAt:
    (Array.isArray(dataset.snapshots) &&
      dataset.snapshots.length &&
      dataset.snapshots[0].created) ||
    'dataset has no snapshots',
  latestSnapshotCreatedAt:
    (Array.isArray(dataset.snapshots) &&
      dataset.snapshots.length &&
      dataset.snapshots[dataset.snapshots.length - 1].created) ||
    'dataset has no snapshots',
  adminUsers: (Array.isArray(dataset.permissions) &&
    dataset.permissions
      .filter(permission => permission.level === 'admin')
      .map(({ user }) => user && user.email)) || ['dataset has no admins'],

  // got from validator MOCK DATA
  subjectCount: -1,
  modalities: ['none'],
  datasetName: 'dataset unnamed in description.json',
  seniorAuthor: 'authors not listed in description.json',
  dataProcessed: false,
  ages: 'ages not found in participants.tsv',
  tasksCompleted: 'n/a - no tasks found',
})

const AddMetadata = ({ dataset }) => {
  const [values, setValues] = useState(
    dataset.metadata || initializeFormData(dataset),
  )
  const handleInputChange = e => {
    const newValues = {
      ...values,
      [e.target.name]: e.target.value,
    }
    setValues(newValues)
  }
  const handleFormSubmit = e => {
    e.preventDefault()
  }

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
    </>
  )
}

AddMetadata.propTypes = {
  dataset: PropTypes.object,
}

export default AddMetadata
