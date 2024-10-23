import React from "react"

import { SearchResultItem } from "./SearchResultItem"

import "./search-page.scss"

// TODO - unify this type with the one in the app package
export interface OpenNeuroTokenProfile {
  sub: string
  email: string
  provider: string
  name: string
  admin: boolean
  iat: number
  exp: number
}

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
  return (
    <div className="search-results">
      {items.map((data) => {
        if (data) {
          return (
            <SearchResultItem
              node={data.node}
              key={data.node.id}
              profile={profile}
              hasEditPermissions={hasEditPermissions}
              datasetTypeSelected={datasetTypeSelected}
            />
          )
        }
      })}
    </div>
  )
}
