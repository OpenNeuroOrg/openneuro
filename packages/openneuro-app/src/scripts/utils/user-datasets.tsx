import type { UserAdvancedSearchDatasetsQuery } from "../../gql/graphql"

type Dataset = NonNullable<
  NonNullable<UserAdvancedSearchDatasetsQuery["datasets"]>["edges"]
>[number]["node"]
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

    switch (sortOrder) {
      case "name-asc":
        comparisonResult = (a.name || "").localeCompare(b.name || "")
        break
      case "name-desc":
        comparisonResult = (b.name || "").localeCompare(a.name || "")
        break
      case "date-newest":
        comparisonResult = new Date(b.created).getTime() -
          new Date(a.created).getTime()
        break
      case "date-updated":
        comparisonResult = new Date(b.created).getTime() -
          new Date(a.created).getTime()
        break
      default:
        comparisonResult = 0
        break
    }

    return comparisonResult
  })

  return sortedDatasets
}
