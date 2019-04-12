import React from 'react'
import PropTypes from 'prop-types'
import JSONTree from 'react-json-tree'
import styled from '@emotion/styled'

const WrappedPre = styled.pre`
  white-space: pre-wrap;
`

const jsonTheme = {
  scheme: 'bright',
  author: 'chris kempson (http://chriskempson.com)',
  base00: '#000000',
  base01: '#303030',
  base02: '#505050',
  base03: '#b0b0b0',
  base04: '#d0d0d0',
  base05: '#e0e0e0',
  base06: '#f5f5f5',
  base07: '#ffffff',
  base08: '#fb0120',
  base09: '#fc6d24',
  base0A: '#fda331',
  base0B: '#a1c659',
  base0C: '#76c7b7',
  base0D: '#6fb3d2',
  base0E: '#d381c3',
  base0F: '#be643c',
}

export const FileViewerJsonRaw = ({ jsonRaw }) => {
  let jsonViewer
  try {
    jsonViewer = <JSONTree data={JSON.parse(jsonRaw)} theme={jsonTheme} />
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
      <div className="col-xs-6">
        <h3>Tree</h3>
        <hr />
        {jsonViewer}
      </div>
      <div className="col-xs-6">
        <h3>Raw</h3>
        <hr />
        <WrappedPre>{jsonRaw}</WrappedPre>
      </div>
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
