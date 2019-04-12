import React from 'react'
import PropTypes from 'prop-types'
import parseTabular from './parse-tabular.js'
import FileViewerTable from './file-viewer-table.jsx'

const FileViewerCsv = ({ data }) => {
  const decoder = new TextDecoder()
  const tableData = parseTabular(decoder.decode(data), ',')
  return <FileViewerTable tableData={tableData} />
}

FileViewerCsv.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerCsv
