/**
 * Generate a download script for this dataset
 */
import React from "react"
import { gql, useLazyQuery } from "@apollo/client"

function inlineDownload(filename, data): void {
  const element = document.createElement("a")
  element.setAttribute(
    "href",
    "data:text/x-shellscript;charset=utf-8," + encodeURIComponent(data),
  )
  element.setAttribute("download", filename)

  element.style.display = "none"
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

function generateDownloadScript(data): string {
  let script = "#!/bin/sh\n"
  for (const f of data.snapshot.downloadFiles) {
    script += `curl --create-dirs ${f.urls[0]} -o ${f.filename}\n`
  }
  return script
}

interface DownloadS3DerivativesProps {
  datasetId: string
  snapshotTag: string
}

const getSnapshotDownload = gql`
  query snapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      downloadFiles {
        id
        directory
        filename
        urls
        size
      }
    }
  }
`

export const DownloadScript = ({
  datasetId,
  snapshotTag,
}: DownloadS3DerivativesProps): JSX.Element => {
  const [getDownload, { loading, data }] = useLazyQuery(getSnapshotDownload, {
    variables: {
      datasetId: datasetId,
      tag: snapshotTag,
    },
    errorPolicy: "all",
  })
  if (data) {
    const script = generateDownloadScript(data)
    inlineDownload(`${datasetId}-${snapshotTag}.sh`, script)
  }
  // This feature is only implemented for snapshots
  if (snapshotTag) {
    return (
      <div>
        <h4>Download with a shell script</h4>
        <p>
          A script is available to download with only curl. This may be useful
          if your download environment makes it difficult to install DataLad or
          Node.js.
        </p>
        <p>
          {loading
            ? (
              "Loading..."
            )
            : (
              <a
                href="#"
                onClick={(): void => {
                  void getDownload()
                }}
              >
                Download shell script
              </a>
            )}
        </p>
      </div>
    )
  } else {
    return null
  }
}

export default DownloadScript
