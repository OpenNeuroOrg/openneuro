import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Pre = styled.pre`
  margin: 0 15px;
  white-space: pre-wrap;
`

const FileViewerText = ({ data }) => {
  const decoder = new TextDecoder()
  return <Pre>{decoder.decode(data)}</Pre>
}

FileViewerText.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerText
