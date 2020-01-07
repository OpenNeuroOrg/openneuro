import React, { useState } from 'react'
import MetadataForm from '../datalad/mutations/metadata-form.jsx'
import UploaderContext from './uploader-context.js'
import styled from '@emotion/styled'

const Container = styled.div`
  &.message.fade-in {
    padding: 20px 0;
  }
`

const UploadMetadata = () => {
  const [values, setValues] = useState({
    associatedPaperDOI: '',
    species: '',
    studyLongitudinal: '',
    studyDomain: '',
    trialCount: undefined,
    studyDesign: '',
    openneuroPaperDOI: '',
    dxStatus: '',
    tasksCompleted: '',
    grantFunderName: '',
    grantIdentifier: '',
  })
  const handleInputChange = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    }
    setValues(newValues)
  }

  return (
    <UploaderContext.Consumer>
      {uploader => (
        <Container className="message fade-in">
          <MetadataForm
            values={values}
            onChange={handleInputChange}
            hideDisabled={true}
            hasEdit={true}
          />
          <br />
          <button
            className="fileupload-btn btn-blue"
            disabled={false}
            onClick={() => {
              uploader.captureMetadata(values)
              uploader.setLocation('/upload/disclaimer')
            }}>
            Continue
          </button>
        </Container>
      )}
    </UploaderContext.Consumer>
  )
}
export default UploadMetadata
