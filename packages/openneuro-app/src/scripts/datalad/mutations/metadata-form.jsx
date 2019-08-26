import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
import TextInput from '../fragments/text-input.jsx'
import styled from '@emotion/styled'

const Form = styled.form({})

const defaultMetadata = dataset => ({
  // get from form
  associatedPaperDOI: 'mock doi sdlfjsdlkfjlsdkf',
  species: '1',
  studyLongitudinal: '1',
  studyDomain: '',
  trialCount: '',
  notes: 'testing',

  studyDesign: '',
  openneuroPaperDOI: '',
  dxStatus: [],

  // gettable from validator
  datasetId: dataset.id,
  datasetUrl: '',
  firstSnapshotCreatedAt: '',
  latestSnapshotCreatedAt: '',
  adminUsers: '',
  subjectCount: '',
  modalities: [],
  datasetName: '',
  seniorAuthor: '',
  dataProcessed: '',
  ages: '',
  tasksCompleted: '',
})

const MetadataForm = ({ dataset }) => {
  const [values, setValues] = useState(
    dataset.metadata || defaultMetadata(dataset),
  )
  console.log({ values })
  const handleChange = e => {
    const newValues = {
      ...values,
      [e.target.name]: e.target.value,
    }
    setValues(newValues)
  }
  const handleSubmit = e => {
    e.preventDefault()
  }

  const newMetadata = dataset.metadata === null
  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        name="associatedPaperDOI"
        label="Associated Paper DOI"
        value={values.associatedPaperDOI}
        onChange={handleChange}
      />
      {/* <label htmlFor="datasetName">Dataset Name</label>
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
      <button type="submit">{newMetadata ? 'Submit Metadata' : 'Update Metadata'}</button> */}
    </Form>
  )
}

MetadataForm.propTypes = {
  dataset: PropTypes.object,
}

export default MetadataForm
