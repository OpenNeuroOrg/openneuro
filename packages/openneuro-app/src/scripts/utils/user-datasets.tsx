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
    const datasetName = dataset.latestSnapshot?.description?.Name ||
      dataset.name
    const datasetAuthors = dataset.latestSnapshot?.description?.Authors || []
    const datasetReadme = dataset.latestSnapshot?.readme || ""

    const matchesSearch = searchQuery === "" ||
      (datasetName &&
        datasetName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      datasetAuthors.some((author: string) =>
        author.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (datasetReadme &&
        datasetReadme.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dataset.id &&
        dataset.id.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesPublicFilter = publicFilter === "all" ||
      (publicFilter === "public" && dataset.public) ||
      (publicFilter === "private" && !dataset.public)

    return matchesSearch && matchesPublicFilter
  })

  const sortedDatasets = filteredDatasets.sort((a, b) => {
    // eslint-disable-next-line no-useless-assignment
    let comparisonResult = 0

    // Move declarations outside the switch block
    let aUpdated: Date | string
    let bUpdated: Date | string
    let aName: string
    let bName: string

    switch (sortOrder) {
      case "name-asc":
        aName = a.latestSnapshot?.description?.Name || a.name || ""
        bName = b.latestSnapshot?.description?.Name || b.name || ""
        comparisonResult = aName.localeCompare(bName)
        break
      case "name-desc":
        aName = a.latestSnapshot?.description?.Name || a.name || ""
        bName = b.latestSnapshot?.description?.Name || b.name || ""
        comparisonResult = bName.localeCompare(aName)
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
