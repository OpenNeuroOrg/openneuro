import React from 'react'
import config from '../../../../config'

const tryOpenS3 = url => event => {
  event.preventDefault()
  window.open(url, 'S3')
}

const DownloadS3 = ({ datasetHash, analysisId }) => {
  const bucket = config.aws.s3.analysisBucket
  const url = 's3://' + bucket + '/' + datasetHash + '/' + analysisId
  return (
    <span>
      <a className="btn-warn-component" href={url} onClick={tryOpenS3(url)}>
        <i className="fa fa-link" aria-hidden="true" /> S3 URL
      </a>
    </span>
  )
}

export default DownloadS3
