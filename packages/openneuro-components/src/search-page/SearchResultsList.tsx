import React from 'react'

import { SearchResultItem } from './SearchResultItem'

import './search-page.scss'

export interface SearchResultsListProps {
  items
  profile?: Record<string, any>
}
export const SearchResultsList = ({
  items,
  profile,
}: SearchResultsListProps) => {
  return (
    <div className="search-results">
      {items.map(data => {
        if (data)
          return (
            <SearchResultItem
              node={data.node}
              key={data.node.id}
              profile={profile}
            />
          )
      })}
    </div>
  )
}
