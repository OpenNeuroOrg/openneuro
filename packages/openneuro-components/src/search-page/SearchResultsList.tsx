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
      {items.map(({ node }, index) => (
        <SearchResultItem node={node} key={index} profile={profile} />
      ))}
    </div>
  )
}
