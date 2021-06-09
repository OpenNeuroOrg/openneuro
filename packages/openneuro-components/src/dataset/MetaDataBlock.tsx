import React from 'react'
import Markdown from 'markdown-to-jsx'

export interface MetaDataBlockProps {
  heading: string
  isMarkdown?: boolean
  item: React.ReactNode | string[] | number
  className?: string
}

export const MetaDataBlock = ({
  heading,
  isMarkdown,
  item,
  className,
}: MetaDataBlockProps) => {
  const arrayToMarkdown = arr => {
    return arr ? arr.map(element => ` * ${element}\n`).join('') : ''
  }
  return (
    <div className={'dataset-meta-block ' + className}>
      <h2 className="dmb-heading">{heading}</h2>
      {isMarkdown ? (
        <Markdown>{arrayToMarkdown(item) || 'N/A'}</Markdown>
      ) : (
        item || 'N/A'
      )}
    </div>
  )
}
