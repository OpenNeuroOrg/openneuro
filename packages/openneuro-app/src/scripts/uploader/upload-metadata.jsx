import React, { useContext, useEffect, useState } from "react"
import MetadataForm from "../dataset/mutations/metadata-form.jsx"
import UploaderContext from "./uploader-context.js"
import styled from "@emotion/styled"

const Container = styled.div`
  &.message.fade-in {
    padding: 20px 0;
  }
`

const defaultMetadata = {
  associatedPaperDOI: "",
  species: "",
  studyLongitudinal: "",
  studyDomain: "",
  trialCount: undefined,
  studyDesign: "",
  openneuroPaperDOI: "",
  dxStatus: "",
  grantFunderName: "",
  grantIdentifier: "",
}

const UploadMetadata = () => {
  const uploader = useContext(UploaderContext)
  const [values, setValues] = useState(() => ({
    ...defaultMetadata,
    ...uploader?.metadata,
  }))

  useEffect(() => {
    uploader?.captureMetadata?.(values)
  }, [])

  const handleInputChange = (name, value) => {
    const newValues = {
      ...values,
      [name]: value,
    }
    setValues(newValues)
    uploader?.captureMetadata?.(newValues)
  }

  return (
    <Container className="message fade-in">
      <MetadataForm
        values={values}
        onChange={handleInputChange}
        hideDisabled={true}
        hasEdit={true}
      />
    </Container>
  )
}

export default UploadMetadata
