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

  // If no query or only modality is set, ignore "relevance" option
  if (
    Object.keys(variables.query.bool).length === 0 ||
    (Object.keys(variables.query.bool).length === 1 &&
      variables.query.bool?.filter?.every(
        (f) => f?.match?.["latestSnapshot.summary.modalities"],
      ))
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
