import React from "react"
import styles from "../scss/datasetcard.module.scss"

interface UserDatasetFiltersProps {
  publicFilter: string
  setPublicFilter: React.Dispatch<React.SetStateAction<string>>
  sortOrder: string
  setSortOrder: React.Dispatch<React.SetStateAction<string>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
}

export const UserDatasetFilters: React.FC<UserDatasetFiltersProps> = ({
  publicFilter,
  setPublicFilter,
  sortOrder,
  setSortOrder,
  searchQuery,
  setSearchQuery,
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [isSortOpen, setIsSortOpen] = React.useState(false)

  const currentSortBy = sortOrder === "name-asc"
    ? "Name (A-Z)"
    : sortOrder === "name-desc"
    ? "Name (Z-A)"
    : sortOrder === "date-newest"
    ? "Added (Newest)"
    : sortOrder === "date-oldest"
    ? "Oldest"
    : "Updated"

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
          Filter by:{" "}
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
                Added
              </li>
              <li
                onClick={() => {
                  setSortOrder("date-oldest")
                  setIsSortOpen(false)
                }}
                className={sortOrder === "date-oldest" ? styles.active : ""}
              >
                Oldest
              </li>
              <li
                onClick={() => {
                  setSortOrder("date-updated")
                  setIsSortOpen(false)
                }}
                className={sortOrder === "date-updated" ? styles.active : ""}
              >
                Updated
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
