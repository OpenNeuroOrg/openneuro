import React, { useContext } from "react"
import type { FC } from "react"
import { SearchParamsCtx } from "../search-params-ctx"
import { SearchSort } from "../components/SearchSort"

interface SortBySelectProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  variables: any
}

const SortBySelect: FC<SortBySelectProps> = ({
  variables,
}: SortBySelectProps) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { sortBy_available, sortBy_selected } = searchParams
  const setSortBy = (sortBy_selected) =>
    setSearchParams((prevState) => ({
      ...prevState,
      sortBy_selected,
    }))

  // If no query or only modality/sortBy is set, ignore "relevance" option
  const queryKeys = Object.keys(variables.query).filter(
    (k) => k !== "sortBy",
  )
  if (
    queryKeys.length === 0 ||
    (queryKeys.length === 1 && queryKeys[0] === "modality")
  ) {
    const available = sortBy_available.filter(
      (item) => item.value !== "relevance",
    )
    const selected = sortBy_selected.value === "relevance"
      ? { label: "Newest", value: "newest" }
      : sortBy_selected
    return (
      <SearchSort
        items={available}
        selected={selected}
        setSelected={setSortBy}
      />
    )
  } else {
    return (
      <SearchSort
        items={sortBy_available}
        selected={sortBy_selected}
        setSelected={setSortBy}
      />
    )
  }
}

export default SortBySelect
