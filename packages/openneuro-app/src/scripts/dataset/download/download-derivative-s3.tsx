import React from "react"
import ShellExample from "./shell-example.jsx"

interface DownloadS3DerivativesProps {
  name: string
  url: string
}

const DownloadS3Derivatives = ({
  name,
  url,
}: DownloadS3DerivativesProps): JSX.Element => (
  <div>
    <h4>
      Download from <a href="https://aws.amazon.com/cli/">S3</a>
    </h4>
    <ShellExample>
      aws s3 sync --no-sign-request {url} {name}
    </ShellExample>
  </div>
)

export default DownloadS3Derivatives
