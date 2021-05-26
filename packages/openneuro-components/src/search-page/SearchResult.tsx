import React from 'react'
import './search-result.scss'

export interface SearchResultProps {
  result: {
    id: string
  }
}

export const SearchResult = ({ result }: SearchResultProps) => {
  return <>{result.id}</>
}
