import React from "react"
import { SearchResultItem } from "./SearchResultItem"
import "./search-page.scss" // Assuming your CSS is here
import { SearchResultItemProps } from "./SearchResultItem" // Import for type safety

export interface SearchResultsListProps {
  items: any[]
  datasetTypeSelected: string
  clickedItemData: SearchResultItemProps["node"] | null // Receive clicked item data from parent
  handleItemClick: (nodeData: SearchResultItemProps["node"]) => void // Receive handler from parent
}

export const SearchResultsList = ({
  items,
  datasetTypeSelected,
  clickedItemData, // Destructure new prop
  handleItemClick, // Destructure new prop
}: SearchResultsListProps) => {
  return (
    <>
      {/* Add 'open' class to search-results div if clickedItemData exists */}
      <div className={`search-results ${clickedItemData ? "open" : ""}`}>
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
