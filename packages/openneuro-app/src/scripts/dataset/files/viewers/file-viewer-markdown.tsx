import React from "react"
import { Markdown } from "../../../utils/markdown"

interface FileViewerMarkdownProps {
  data: ArrayBuffer
}

const FileViewerMarkdown = ({ data }: FileViewerMarkdownProps) => {
  const decoder = new TextDecoder()
  return <Markdown>{decoder.decode(data)}</Markdown>
}

export default FileViewerMarkdown
