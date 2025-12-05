import React from "react"
import PropTypes from "prop-types"
import parseTabular from "./parse-tabular.js"
import FileViewerTable from "./file-viewer-table"

const FileViewerTsv = ({ data }) => {
  // If no data or empty ArrayBuffer, pass null/empty string
  if (!data || data.byteLength === 0) {
    const tableData = parseTabular(null, "\t")
    return <FileViewerTable tableData={tableData} />
  }

  const decoder = new TextDecoder()
  const tableData = parseTabular(decoder.decode(data), "\t")
  return <FileViewerTable tableData={tableData} />
}

FileViewerTsv.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerTsv
