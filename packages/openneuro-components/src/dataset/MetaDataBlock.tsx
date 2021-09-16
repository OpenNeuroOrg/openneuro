import Markdown from 'markdown-to-jsx'
import React from 'react'

export interface MetaDataBlockProps {
  heading: string
  item: React.ReactNode | string[] | number
  className?: string
  renderEditor?: () => React.ReactNode
  isMarkdown?: boolean
}

export const MetaDataBlock = ({
  heading,
  item,
  className,
  isMarkdown,
  renderEditor,
}: MetaDataBlockProps) => {
  const fieldContent = renderEditor ? renderEditor() : item
  return (
    <div className={'dataset-meta-block ' + className}>
      <h2 className="dmb-heading">{heading}</h2>
      <>{isMarkdown ? <Markdown>fieldContent</Markdown> : fieldContent}</>
    </div>
  )
}
