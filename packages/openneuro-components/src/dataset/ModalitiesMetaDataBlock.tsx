import React from 'react'
import Markdown from 'markdown-to-jsx'

export interface ModalitiesMetaDataBlockProps {
  heading: string
  isMarkdown?: boolean
  item: React.ReactNode | string[] | number
  className?: string
}

export const ModalitiesMetaDataBlock = ({
  heading,
  isMarkdown,
  item,
  className,
}: ModalitiesMetaDataBlockProps) => {
  const arrayToMarkdown = arr => {
    console.log(arr)
    return arr
      ? arr
          .map(
            element =>
              ` * <a href="/search/${element.toLowerCase()}">${element}</a>\n`,
          )
          .join('')
      : ''
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
