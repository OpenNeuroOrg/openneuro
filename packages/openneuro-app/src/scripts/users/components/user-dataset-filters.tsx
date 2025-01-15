import React, { useMemo } from "react"
import styles from "../scss/datasetcard.module.scss"

interface Dataset {
  id: string
  name: string
  dateAdded: string
  dateUpdated: string
}

interface UserDatasetFiltersProps {
  publicFilter: string
  setPublicFilter: React.Dispatch<React.SetStateAction<string>>
  sortOrder: string
  setSortOrder: React.Dispatch<React.SetStateAction<string>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  datasets: Dataset[] // List of datasets
}

export const UserDatasetFilters: React.FC<UserDatasetFiltersProps> = ({
  publicFilter,
  setPublicFilter,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
  datasets = [], // Default to empty array to prevent undefined
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [isSortOpen, setIsSortOpen] = React.useState(false)

  const currentSortBy = sortOrder === "name-asc"
    ? "Name (A-Z)"
    : sortOrder === "name-desc"
    ? "Name (Z-A)"
    : sortOrder === "date-newest"
    ? "Date Added (Newest)"
    : "Date Updated (Newest)"

  // Sort datasets based on the selected sort order
  const sortedDatasets = useMemo(() => {
    return datasets.sort((a, b) => {
      switch (sortOrder) {
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "date-newest":
          return new Date(b.dateAdded).getTime() -
            new Date(a.dateAdded).getTime()
        case "date-updated":
          return new Date(b.dateUpdated).getTime() -
            new Date(a.dateUpdated).getTime()
        default:
          return 0
      }
    })
  }, [datasets, sortOrder])

  // Filter datasets based on the search query
  const filteredDatasets = useMemo(() => {
    return sortedDatasets.filter((dataset) => {
      // Filter by search query (name or ID)
      const matchesSearchQuery = !searchQuery ||
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.id.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearchQuery
    })
  }, [sortedDatasets, searchQuery])

  return (
    <div className={styles.userDSfilters}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Keyword Search (Name or ID)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />

      {/* Filter by Visibility */}
      <div
        className={`${styles.filterDiv} ${isFilterOpen ? styles.open : ""}`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <span>
          Filter by Visibility:{" "}
          <b>
            {publicFilter === "all"
              ? "All"
              : publicFilter.charAt(0).toUpperCase() + publicFilter.slice(1)}
          </b>
        </span>
        <div className={styles.filterDropdown}>
          {isFilterOpen && (
            <ul>
              <li
                onClick={() => {
                  setPublicFilter("all")
                  setIsFilterOpen(false)
                }}
                className={publicFilter === "all" ? styles.active : ""}
              >
                All
              </li>
              <li
                onClick={() => {
                  setPublicFilter("public")
                  setIsFilterOpen(false)
                }}
                className={publicFilter === "public" ? styles.active : ""}
              >
                Public
              </li>
              <li
                onClick={() => {
                  setPublicFilter("private")
                  setIsFilterOpen(false)
                }}
                className={publicFilter === "private" ? styles.active : ""}
              >
                Private
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Sort Options */}
      <div
        className={`${styles.sortDiv} ${isSortOpen ? styles.open : ""}`}
        onClick={() => setIsSortOpen(!isSortOpen)}
      >
        <span>
          Sort by: <b>{currentSortBy}</b>
        </span>
        <div className={styles.sortDropdown}>
          {isSortOpen && (
            <ul>
              <li
                onClick={() => {
                  setSortOrder("name-asc")
                  setIsSortOpen(false)
                }}
                className={sortOrder === "name-asc" ? styles.active : ""}
              >
                Name (A-Z)
              </li>
              <li
                onClick={() => {
                  setSortOrder("name-desc")
                  setIsSortOpen(false)
                }}
                className={sortOrder === "name-desc" ? styles.active : ""}
              >
                Name (Z-A)
              </li>
              <li
                onClick={() => {
                  setSortOrder("date-newest")
                  setIsSortOpen(false)
                }}
                className={sortOrder === "date-newest" ? styles.active : ""}
              >
                Date Added (Newest)
              </li>
              <li
                onClick={() => {
                  setSortOrder("date-updated")
                  setIsSortOpen(false)
                }}
                className={sortOrder === "date-updated" ? styles.active : ""}
              >
                Date Updated (Newest)
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
