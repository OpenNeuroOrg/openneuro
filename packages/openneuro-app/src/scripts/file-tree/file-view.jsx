import React, { useState, useEffect } from 'react'
import Spinner from '../common/partials/spinner.jsx'
import { apiPath } from './file.jsx'
import FileViewerType from './file-viewer-type.jsx'

const FileView = ({ datasetId, snapshotTag, path }) => {
  const url = apiPath(datasetId, snapshotTag, path)
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

  const fetchUrl = async () => {
    const response = await fetch(url)
    const data = await response.arrayBuffer()
    setData(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUrl()
  })

  if (loading) {
    return <Spinner active text="Loading File" />
  } else {
    return <FileViewerType path={path} url={url} data={data} />
  }
}

export default FileView
