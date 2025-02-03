import { filterAndSortDatasets } from "../user-datasets"
import type { Dataset } from "../../types/user-types"

describe("filterAndSortDatasets", () => {
  const datasets: Dataset[] = [
    {
      id: "1",
      name: "Dataset Bel",
      created: "2025-01-21T12:00:00Z",
      latestSnapshot: {
        id: "1.0.0",
        size: 1024,
        issues: [{ severity: "low" }],
        created: "2025-01-22T12:00:00Z",
      },
      public: true,
      analytics: { downloads: 0, views: 10 },
    },
    {
      id: "2",
      name: "Dataset Ael",
      created: "2025-01-22T12:00:00Z",
      latestSnapshot: {
        id: "2.0.0",
        size: 2048,
        issues: [{ severity: "high" }],
        created: "2025-01-23T12:00:00Z",
      },
      public: false,
      analytics: { downloads: 5, views: 20 },
    },
    {
      id: "3",
      name: "Dataset Cel",
      created: "2025-01-20T12:00:00Z",
      latestSnapshot: {
        id: "3.0.0",
        size: 4096,
        issues: [{ severity: "medium" }],
        created: "2025-01-20T12:00:00Z",
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
