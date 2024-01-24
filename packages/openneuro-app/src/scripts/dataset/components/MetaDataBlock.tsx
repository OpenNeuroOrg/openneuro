import { Markdown } from "../../utils/markdown"
import React from "react"

export interface MetaDataBlockProps {
  heading: string
  item: React.ReactNode | string[] | number
  className?: string
  renderEditor?: () => React.ReactNode
}

export const MetaDataBlock = ({
  heading,
  item,
  className,
  renderEditor,
}: MetaDataBlockProps) => {
  const fieldContent = renderEditor ? renderEditor() : item
  return (
    <div className={"dataset-meta-block " + className}>
      <h2 className="dmb-heading">{heading}</h2>
      <>{fieldContent}</>
    </div>
  )
}
