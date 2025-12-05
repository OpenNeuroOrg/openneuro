import React from "react"
import PropTypes from "prop-types"
import parseTabular from "./parse-tabular.js"
import FileViewerTable from "./file-viewer-table"
import * as Sentry from "@sentry/react"

const FileViewerTsv = ({ data }) => {
  const decoder = new TextDecoder()
  let tableData = [] // Initialize as an empty array

  try {
    // Attempt to parse the data
    const parsed = parseTabular(decoder.decode(data), "\t")

    if (Array.isArray(parsed) && parsed.length > 0) {
      tableData = parsed
    } else {
      Sentry.captureMessage(
        "parseTabular returned invalid or empty data.",
        "warning",
      )
    }
  } catch (error) {
    Sentry.captureException(error)
  }

  return <FileViewerTable tableData={tableData} />
}

FileViewerTsv.propTypes = {
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerTsv
