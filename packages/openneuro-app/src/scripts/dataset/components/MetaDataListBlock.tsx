import React from "react"

export interface MetaDataListBlockProps {
  heading: string
  item: React.ReactNode | string[] | number
  className?: string
  renderEditor?: () => React.ReactNode
}

export const MetaDataListBlock = ({
  heading,
  item,
  className,
  renderEditor,
}: MetaDataListBlockProps) => {
  const fieldContent = renderEditor ? renderEditor() : item
  return (
    <div className={"dataset-meta-block " + className}>
      <h2 className="dmb-heading">{heading}</h2>
      <ul>
        {fieldContent.map((item, index) => (
          <li key={index}>
            <Markdown>{item}</Markdown>
          </li>
        ))}
      </ul>
    </div>
  )
}
