import React from "react"
import PropTypes from "prop-types"
import styled from "@emotion/styled"
import { RecursiveProperty } from "@openneuro/components/json-tree"

const WrappedPre = styled.pre`
  white-space: pre-wrap;
`

export const FileViewerJsonRaw = ({ jsonRaw }) => {
  let jsonViewer
  try {
    const jsonPretty = JSON.parse(jsonRaw)
    jsonViewer = (
      <RecursiveProperty
        property={jsonPretty}
        propertyName="Root Property"
        rootProperty={true}
      />
    )
  } catch (e) {
    jsonViewer = (
      <>
        <p>JSON failed to parse</p>
        <pre>{e.message}</pre>
      </>
    )
  }
  return (
    <>
      <h3>Tree</h3>
      <hr />
      {jsonViewer}
      <h3>Raw</h3>
      <hr />
      <WrappedPre>{jsonRaw}</WrappedPre>
    </>
  )
}

FileViewerJsonRaw.propTypes = {
  jsonRaw: PropTypes.string,
}

const FileViewerJson = ({ data }) => {
  const decoder = new TextDecoder()
  return <FileViewerJsonRaw jsonRaw={decoder.decode(data)} />
}

FileViewerJson.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerJson
