import React from "react"
import styled from "@emotion/styled"

const ScaledIframe = styled.iframe`
  width: 100%;
  height: 50vh;
  border: none;
`

interface FileViewerNeurosiftProps {
  url: string
  filetype: "nwb" | "edf"
}

/**
 * Viewer embedding Neurosift for EDF and NWB data
 */
export const FileViewerNeurosift = (
  { url, filetype }: FileViewerNeurosiftProps,
) => {
  const viewerUrl =
    `https://neurosift.app/?p=/${filetype}&embedded=1&url=${url}`
  return <ScaledIframe src={viewerUrl} title="Neurosift viewer" />
}

export default FileViewerNeurosift
