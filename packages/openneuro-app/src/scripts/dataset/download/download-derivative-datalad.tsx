import React from 'react'
import ShellExample from './shell-example.jsx'

interface DownloadDataLadDerivativesProps {
  url: string
}

const DownloadDataLadDerivative = ({
  url,
}: DownloadDataLadDerivativesProps): JSX.Element => (
  <div>
    <h4>
      Download with <a href="https://www.datalad.org">DataLad</a>
    </h4>
    <ShellExample>datalad install {url}</ShellExample>
  </div>
)

export default DownloadDataLadDerivative
