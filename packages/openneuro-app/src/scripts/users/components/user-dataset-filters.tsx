import React, { useEffect, useRef, useState } from "react"
import styles from "../scss/datasetcard.module.scss"

interface UserDatasetFiltersProps {
  publicFilter: string
  setPublicFilter: React.Dispatch<React.SetStateAction<string>>
  sortOrder: string
  setSortOrder: React.Dispatch<React.SetStateAction<string>>
  onSearch: (query: string, publicFilter: string) => void
  currentSearchTerm: string
  hasEdit: boolean
}

export const UserDatasetFilters: React.FC<UserDatasetFiltersProps> = ({
  publicFilter,
  setPublicFilter,
  sortOrder,
  setSortOrder,
  onSearch,
  currentSearchTerm,
  hasEdit,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(currentSearchTerm)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  const currentSortBy = sortOrder === "name-asc"
    ? "Name (A-Z)"
    : sortOrder === "name-desc"
    ? "Name (Z-A)"
    : sortOrder === "date-newest"
    ? "Added (Newest)"
    : sortOrder === "date-oldest"
    ? "Oldest"
    : "Updated"

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value)
  }

  const triggerSearch = () => {
    onSearch(localSearchQuery, publicFilter)
  }

  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      triggerSearch()
    }
  }

  const handleSearchButtonMouseOver = () => {
    if (document.activeElement === searchButtonRef.current) {
      triggerSearch()
    }
  }

  const handleClearSearch = () => {
    setLocalSearchQuery("")
    onSearch("", publicFilter)
  }

  useEffect(() => {
    setLocalSearchQuery(currentSearchTerm)
  }, [currentSearchTerm])

  return (
    <>
      <div className={styles.searchInputContainer}>
        {/* Search Input */}
        <div className={styles.searchInputWrap}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Keyword Search (Name, Authors, README, or ID)"
            value={localSearchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchInputKeyDown}
            className={styles.searchInput}
          />
          {localSearchQuery && (
            <button
              onClick={handleClearSearch}
              className={styles.clearSearchButton}
            >
              <span aria-label="Clear Search">X</span>
            </button>
          )}
        </div>
        {/* Search Button */}
        <button
          ref={searchButtonRef}
          onClick={triggerSearch}
          onMouseOver={handleSearchButtonMouseOver}
          className={styles.searchSubmitButton}
        >
          Search
        </button>
      </div>

      <div className={styles.userDSfilters}>
        {/* Filter by Visibility */}
        {hasEdit &&
          (
            <div
              data-testid="public-filter"
              className={`${styles.filterDiv} ${
                isFilterOpen ? styles.open : ""
              }`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <span>
                Filter by:{" "}
                <b>
                  {publicFilter === "all"
                    ? "All"
                    : publicFilter.charAt(0).toUpperCase() +
                      publicFilter.slice(1)}
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
                  </ul>
                )}
              </div>
            </div>
          )}

        {/* Sort Options */}
        <div
          data-testid="sort-order"
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
    </>
  )
}
