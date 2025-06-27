import React from "react"
import type { FC, ReactNode } from "react"

interface MetaListItemListProps {
  typeLabel: ReactNode
  items: (string | ReactNode)[]
}

/**
 * A reusable component for rendering a list of meta items in the search results details.
 */
export const MetaListItemList: FC<MetaListItemListProps> = (
  { typeLabel, items },
) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="result-summary-meta">
      <label>{typeLabel}:</label>
      <div>
        {items.map((item, index) => (
          <span className="list-item" key={index}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
