import type { Dataset } from "../types/user-types"
export interface FilterOptions {
  searchQuery: string
  publicFilter: string
  sortOrder: string
}

export function filterAndSortDatasets(
  datasets: Dataset[],
  { searchQuery, publicFilter, sortOrder }: FilterOptions,
): Dataset[] {
  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = searchQuery === "" ||
      (dataset.name &&
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dataset.id &&
        dataset.id.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPublicFilter = publicFilter === "all" ||
      (publicFilter === "public" && dataset.public) ||
      (publicFilter === "private" && !dataset.public)

    return matchesSearch && matchesPublicFilter
  })

  const sortedDatasets = filteredDatasets.sort((a, b) => {
    let comparisonResult = 0

    // Move declarations outside the switch block
    let aUpdated: Date | string
    let bUpdated: Date | string

    switch (sortOrder) {
      case "name-asc":
        comparisonResult = (a.name || "").localeCompare(b.name || "")
        break
      case "name-desc":
        comparisonResult = (b.name || "").localeCompare(a.name || "")
        break
      case "date-newest":
        comparisonResult =
          new Date(b.latestSnapshot?.created || b.created).getTime() -
          new Date(a.latestSnapshot?.created || a.created).getTime()
        break
      case "date-updated":
        aUpdated = a.latestSnapshot?.created || a.created
        bUpdated = b.latestSnapshot?.created || b.created
        comparisonResult = new Date(bUpdated).getTime() -
          new Date(aUpdated).getTime()
        break
      default:
        comparisonResult = 0
        break
    }

    return comparisonResult
  })

  return sortedDatasets
}
