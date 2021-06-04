import React from 'react'

export interface TermListItemProps {
  item: string[]
  type?: string
}
export const TermListItem = ({ item, type }: TermListItemProps) => {
  if (item.length === 0) {
    return null
  } else {
    return (
      <>
        <li className="search-term-list">
          <strong className="terms-heading">{type}:</strong>
          <ul>
            {item.map((items, index) => (
              <li key={index}>
                <span>
                  {items}
                  <span>&times;</span>
                </span>
              </li>
            ))}
          </ul>
        </li>
      </>
    )
  }
}
