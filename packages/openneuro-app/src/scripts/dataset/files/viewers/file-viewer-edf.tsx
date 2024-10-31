import React from "react"
import styled from "@emotion/styled"

const ScaledIframe = styled.iframe`
  width: 100%;
  height: 50vh;
  border: none;
`

interface FileViewerEdfProps {
  url: string
}

/**
 * Viewer embedding Neurosift for EDF and NWB data
 */
export const FileViewerEdf = ({ url }: FileViewerEdfProps) => {
  const viewerUrl = `https://neurosift.app/?p=/edf&embedded=1&url=${url}`
  return <ScaledIframe src={viewerUrl} title="Neurosift viewer" />
}

export default FileViewerEdf
