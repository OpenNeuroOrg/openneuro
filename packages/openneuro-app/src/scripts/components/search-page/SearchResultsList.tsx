import React from "react"
import { SearchResultItem } from "./SearchResultItem"
import { OpenNeuroTokenProfile } from "../../authentication/profile"

import "./search-page.scss"

export interface SearchResultsListProps {
  items
  profile?: OpenNeuroTokenProfile
  datasetTypeSelected: string
  hasEditPermissions: (permissions: object, userId: string) => boolean
}

export const SearchResultsList = ({
  items,
  profile,
  datasetTypeSelected,
  hasEditPermissions,
}: SearchResultsListProps) => {
  console.log("rpofile", profile)
  return (
    <div className="search-results">
      {items.map((data) => {
        if (data) {
          return (
            <SearchResultItem
              node={data.node}
              key={data.node.id}
              hasEditPermissions={hasEditPermissions}
              datasetTypeSelected={datasetTypeSelected}
            />
          )
        }
      })}
    </div>
  )
}
