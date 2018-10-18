import React from 'react'
import PropTypes from 'prop-types'
import ShellExample from './shell-example.jsx'
import { getConfig } from '../../config.js'

export const DownloadSampleS3 = ({ datasetId, s3Bucket }) => (
  <ShellExample>
    # aws s3 sync --no-sign-request s3://
    {s3Bucket}/{datasetId} {datasetId}
    -download/
  </ShellExample>
)

DownloadSampleS3.propTypes = {
  datasetId: PropTypes.string,
  s3Bucket: PropTypes.string,
}

const DownloadS3Instructions = ({ datasetId, s3Bucket }) => (
  <div>
    <h4>Download from S3</h4>
    <p>
      Public snapshots are stored on S3 and the most recent snapshot is
      downloadable with standard S3 tools. This method is best for larger
      datasets or unstable connections. This example uses{' '}
      <a href="https://aws.amazon.com/cli/">AWS CLI.</a>
    </p>
    <DownloadSampleS3 datasetId={datasetId} s3Bucket={s3Bucket} />
  </div>
)

DownloadS3Instructions.propTypes = {
  datasetId: PropTypes.string,
  s3Bucket: PropTypes.string,
}

const DownloadS3 = props =>
  // TODO - don't depend on async config
  getConfig().hasOwnProperty('publicBucket') ? (
    <DownloadS3Instructions {...props} s3Bucket={getConfig().publicBucket} />
  ) : null

export default DownloadS3
