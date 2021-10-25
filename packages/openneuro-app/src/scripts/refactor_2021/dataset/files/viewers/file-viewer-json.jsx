import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { RecursiveProperty } from '@openneuro/components/json-tree'

const WrappedPre = styled.pre`
  white-space: pre-wrap;
`

export const FileViewerJsonRaw = ({ jsonRaw }) => {
  const jsonPretty = JSON.parse(jsonRaw)
  let jsonViewer

  try {
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
    <div className="container">
      <div className="grid">
        <div className="col col-lg">
          <h3>Tree</h3>
          <hr />
          {jsonViewer}
        </div>
        <div className="col">
          <h3>Raw</h3>
          <hr />
          <WrappedPre>{jsonRaw}</WrappedPre>
        </div>
      </div>
    </div>
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
