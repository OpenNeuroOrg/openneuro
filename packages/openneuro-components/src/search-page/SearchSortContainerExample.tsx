import React from "react"
import { SearchSort } from "./SearchSort"

export const SearchSortContainerExample = ({ items }) => {
  const [selected, setSelected] = React.useState(items[0])
  return (
    <SearchSort items={items} selected={selected} setSelected={setSelected} />
  )
}
