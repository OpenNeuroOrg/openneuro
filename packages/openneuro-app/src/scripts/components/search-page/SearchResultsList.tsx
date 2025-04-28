import React from "react"
import { SearchResultItem } from "./SearchResultItem"
import "./search-page.scss"

export interface SearchResultsListProps {
  items
  datasetTypeSelected: string
}

export const SearchResultsList = ({
  items,
  datasetTypeSelected,
}: SearchResultsListProps) => {
  return (
    <div className="search-results">
      {items.map((data) => {
        if (data) {
          return (
            <SearchResultItem
              node={data.node}
              key={data.node.id}
              datasetTypeSelected={datasetTypeSelected}
            />
          )
        }
      })}
    </div>
  )
}
