import React from 'react'
import PropTypes from 'prop-types'
import ShellExample from './shell-example.jsx'

export const DownloadSampleCommand = ({ datasetId, snapshotTag }) => (
  <ShellExample>
    openneuro download {snapshotTag ? `--snapshot ${snapshotTag}` : '--draft'}{' '}
    {datasetId} {datasetId}
    -download/
  </ShellExample>
)

DownloadSampleCommand.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
}

const DownloadCommandLine = ({ datasetId, snapshotTag }) => (
  <div>
    <h4>Download with Node.js</h4>
    <p>
      Using{' '}
      <a href="https://www.npmjs.com/package/@openneuro/cli">@openneuro/cli</a>{' '}
      you can download this dataset from the command line using{' '}
      <a href="https://nodejs.org/en/download/">Node.js</a>. This method is good
      for larger datasets or unstable connections, but has known issues on
      Windows.
    </p>
    <DownloadSampleCommand datasetId={datasetId} snapshotTag={snapshotTag} />
    <p>
      This will download to {datasetId}
      -download/ in the current directory. If your download is interrupted and
      you need to retry, rerun the command to resume the download.
    </p>
  </div>
)

DownloadCommandLine.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default DownloadCommandLine
