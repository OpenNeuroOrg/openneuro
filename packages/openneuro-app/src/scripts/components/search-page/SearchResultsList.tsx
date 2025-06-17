import React from "react"
import { SearchResultItem } from "./SearchResultItem"
import "./search-page.scss"
import { SearchResultItemProps } from "./SearchResultItem"

export interface SearchResultsListProps {
  items: any[]
  datasetTypeSelected: string
  clickedItemData: SearchResultItemProps["node"] | null
  handleItemClick: (nodeData: SearchResultItemProps["node"]) => void
}

export const SearchResultsList = ({
  items,
  datasetTypeSelected,
  clickedItemData,
  handleItemClick,
}: SearchResultsListProps) => {
  return (
    <>
      <div
        className={`search-results col col-12 ${clickedItemData ? "open" : ""}`}
      >
        {items.map((data) => {
          if (data) {
            const isActive = clickedItemData?.id === data.node.id
            return (
              <SearchResultItem
                node={data.node}
                key={data.node.id}
                datasetTypeSelected={datasetTypeSelected}
                onClick={() => handleItemClick(data.node)}
                isExpanded={isActive}
              />
            )
          }
          return null
        })}
      </div>
    </>
  )
}
