import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../../config.js'
import downloadjs from 'downloadjs'

const downloadHandler = datasetHash => () => {
  const bucket = config.aws.s3.datasetBucket
  const url = `http://${bucket}.s3.amazonaws.com/${datasetHash}`
  fetch(url)
    .then(res => res.blob())
    .then(zipFile => {
      downloadjs(zipFile, 'archive.zip', 'application', 'application/zip')
    })
}

const Archive = ({ run }) => {
  return <button onClick={downloadHandler(run.datasetHash)}>Download</button>
}

Archive.propTypes = {
  run: PropTypes.object,
}

export default Archive
