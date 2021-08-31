import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const ScaledIframe = styled.iframe`
  width: 100%;
  height: 50vh;
  border: none;
`

const FileViewerHtml = ({ data }) => {
  const decoder = new TextDecoder()
  return <ScaledIframe srcDoc={decoder.decode(data)} />
}

FileViewerHtml.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerHtml
