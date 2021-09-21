import React from 'react'
import PropTypes from 'prop-types'
import parseTabular from './parse-tabular.js'
import FileViewerTable from './file-viewer-table.jsx'

const FileViewerTsv = ({ data }) => {
  const decoder = new TextDecoder()
  const tableData = parseTabular(decoder.decode(data), '\t')
  return <FileViewerTable tableData={tableData} />
}

FileViewerTsv.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerTsv
