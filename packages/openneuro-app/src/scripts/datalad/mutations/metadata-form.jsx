import React, { useState } from 'react'
import { PropTypes } from 'prop-types'

const defaultMetadata = dataset => ({
  datasetId: dataset.id,
  datasetUrl: '',
  datasetName: '',
  firstSnapshotCreatedAt: '',
  latestSnapshotCreatedAt: '',
  subjectCount: '',
  modalities: [],
  dxStatus: [],
  ages: '',
  tasksCompleted: '',
  trialCount: '',
  studyDesign: '',
  studyDomain: '',
  studyLongitudinal: '1',
  dataProcessed: '',
  species: '1',
  associatedPaperDOI: '',
  openneuroPaperDOI: '',
  seniorAuthor: {
    firstname: '',
    lastname: '',
  },
  adminUsers: '',
  notes: 'testing',
})

const MetadataForm = ({ dataset }) => {
  const [ values, setValues ] = useState(dataset.metadata || defaultMetadata(dataset))
  const handleChange = e => {
    console.log('change')
    console.log(e)
    console.log(e.target)
    console.log(e.target.name)
    console.log(e.target.value)
    console.dir(e.target)
    console.log({values})
    const newValues = {
      ...values,
      [e.target.name]: e.target.value
    }
    console.log({ newValues })
    setValues(newValues)
    console.log({values})
  }
  const handleSubmit = e => {
    e.preventDefault()
    console.log('SUBMIT')
    console.log(e)
    console.log(e.target)
    console.dir(e.target)
  }

  const newMetadata = dataset.metadata === null
  return(
    <form
      onSubmit={handleSubmit}
    >
      <label htmlFor="datasetName">Dataset Name</label>
      <input type="text" name="datasetName" value={values.datasetName} onChange={handleChange} />
      <label htmlFor="trialCount">Number of Trials</label>
      <input type="text" name="trialCount" value={values.trialCount} onChange={handleChange} />
      <label htmlFor="studyDesign">Study Design</label>
      <input type="text" name="studyDesign" value={values.studyDesign} onChange={handleChange} />
      <label htmlFor="studyDomain">Domain Studied</label>
      <input type="text" name="studyDomain" value={values.studyDomain} onChange={handleChange} />
      <label htmlFor="studyLongitudinal">Study Type</label>
      <select name="studyLongitudinal" value={values.studyLongitudinal} onChange={handleChange}>
        <option value="1">option 1</option>
        <option value="2">option 2</option>
        <option value="other">other</option>
      </select>
      <label htmlFor="species">Species</label>
      <select name="species" value={values.species} onChange={handleChange}>
        <option value="1">option 1</option>
        <option value="2">option 2</option>
        <option value="other">other</option>
      </select>
      <label htmlFor="notes">Notes</label>
      <textarea name="notes" value={values.notes} onChange={handleChange} />
      <button type="submit">{newMetadata ? 'Submit Metadata' : 'Update Metadata'}</button>
    </form>
  )
}

MetadataForm.propTypes = {
  dataset: PropTypes.object,
}

export default MetadataForm