import { filterAndSortDatasets } from "../user-datasets"
import type { UserAdvancedSearchDatasetsQuery } from "../../../gql/graphql"

type Dataset = NonNullable<
  NonNullable<UserAdvancedSearchDatasetsQuery["datasets"]>["edges"]
>[number]["node"]

describe("filterAndSortDatasets", () => {
  const datasets: Dataset[] = [
    {
      id: "1",
      name: "Dataset Bel",
      created: "2025-01-21T12:00:00Z",
      latestSnapshot: {
        size: 1024,
      },
      public: true,
      analytics: { downloads: 0, views: 10 },
    },
    {
      id: "2",
      name: "Dataset Ael",
      created: "2025-01-22T12:00:00Z",
      latestSnapshot: {
        size: 2048,
      },
      public: false,
      analytics: { downloads: 5, views: 20 },
    },
    {
      id: "3",
      name: "Dataset Cel",
      created: "2025-01-20T12:00:00Z",
      latestSnapshot: {
        size: 4096,
      },
      public: true,
      analytics: { downloads: 15, views: 30 },
    },
  ]

  it("filters and sorts datasets by name ascending", () => {
    const result = filterAndSortDatasets(datasets, {
      searchQuery: "",
      publicFilter: "all",
      sortOrder: "name-asc",
    })
    expect(result.map((d) => d.name)).toEqual([
      "Dataset Ael",
      "Dataset Bel",
      "Dataset Cel",
    ])
  })

  it("filters datasets by public visibility and sorts by name descending", () => {
    const result = filterAndSortDatasets(datasets, {
      searchQuery: "",
      publicFilter: "public",
      sortOrder: "name-desc",
    })
    expect(result.map((d) => d.name)).toEqual(["Dataset Cel", "Dataset Bel"])
  })

  it("filters datasets by search query and sorts by newest date", () => {
    const result = filterAndSortDatasets(datasets, {
      searchQuery: "Ael",
      publicFilter: "all",
      sortOrder: "date-newest",
    })
    expect(result.map((d) => d.name)).toEqual(["Dataset Ael"])
  })

  it("returns datasets unchanged for unknown sort order", () => {
    const result = filterAndSortDatasets(datasets, {
      searchQuery: "",
      publicFilter: "all",
      sortOrder: "unknown-order",
    })
    expect(result).toEqual(datasets)
  })
})
