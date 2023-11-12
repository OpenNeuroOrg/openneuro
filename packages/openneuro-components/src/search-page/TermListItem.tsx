import React from "react"

type Item = {
  param: string
  values: string[]
}

export interface TermListItemProps {
  item: Item
  type?: string
  removeFilterItem?(param, value): void
}
export const TermListItem = ({
  item,
  type,
  removeFilterItem = () => {},
}: TermListItemProps) => {
  if (item.values.length === 0) {
    return null
  } else {
    return (
      <>
        <li className="search-term-list">
          <strong className="terms-heading">{type}:</strong>
          <ul>
            {item.values.map((term, index) => (
              <li key={index}>
                <span>
                  {term}
                  <span onClick={() => removeFilterItem(item.param, term)}>
                    &times;
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </li>
      </>
    )
  }
}
