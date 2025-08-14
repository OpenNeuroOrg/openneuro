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
  const effectiveBlockClass = className || ""
  return (
    <div className={`dataset-meta-block ${effectiveBlockClass}`}>
      <h2 className="dmb-heading">{heading}</h2>
      <>{fieldContent}</>
    </div>
  )
}
