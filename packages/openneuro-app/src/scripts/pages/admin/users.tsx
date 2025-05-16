// packages/openneuro-app/src/scripts/pages/admin/users.tsx

import React, { useCallback, useEffect, useState } from "react"
import { Loading } from "../../components/loading/Loading"
import Helmet from "react-helmet"
import { pageTitle } from "../../resources/strings.js"
import type { User } from "../../types/user-types"
import styles from "./users.module.scss"
import { useUsers } from "../../queries/users"
import UserSummary from "./user-summary"
import * as Sentry from "@sentry/react"

// --- ADD THESE VARIABLES ---
const SORT_ASC_ICON = "fa fa-sort-asc" // Font Awesome class for ascending
const SORT_DESC_ICON = "fa fa-sort-desc" // Font Awesome class for descending
// --- END ADDITION ---

const noResults = (loading: boolean) =>
  loading ? <Loading /> : <h3>No Results Found</h3>

interface SortConfig {
  field: string | null
  order: "ascending" | "descending"
}

interface UsersProps {
  users: User[]
  refetchCurrentPage: () => void
  loading: boolean
  onSortChange: (
    field: string | null,
    order: "ascending" | "descending",
  ) => void
  sortConfig: SortConfig
  onFilterChange: (
    filterType: "admin" | "blocked" | null,
    value: boolean | null,
  ) => void
  filters: { admin: boolean | null; blocked: boolean | null }
  onSearchChange: (searchValue: string | undefined) => void
  currentSearchTerm: string | undefined
  loadMore: () => void
  hasMore: boolean
  totalCount: number
}

const Users = ({
  users,
  refetchCurrentPage,
  loading,
  onSortChange,
  sortConfig,
  onFilterChange,
  filters,
  onSearchChange,
  currentSearchTerm,
  loadMore,
  hasMore,
  totalCount,
}: UsersProps) => {
  const hasUsers = users && users.length > 0
  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    currentSearchTerm,
  )

  useEffect(() => {
    setSearchTerm(currentSearchTerm)
  }, [currentSearchTerm])

  const handleAdminFilterCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange("admin", e.target.checked)
    },
    [onFilterChange],
  )

  const handleBlockedFilterCheckboxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange("blocked", e.target.checked)
    },
    [onFilterChange],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value || undefined)
    },
    [setSearchTerm],
  )

  const handleSearchSubmit = useCallback(() => {
    onSearchChange(searchTerm)
  }, [onSearchChange, searchTerm])

  const handleClearSearch = useCallback(() => {
    setSearchTerm(undefined)
    onSearchChange(undefined)
  }, [onSearchChange, setSearchTerm])

  const handleSortButtonClick = useCallback(
    (field: string) => {
      let newOrder: "ascending" | "descending" = "ascending"

      if (sortConfig.field === field) {
        newOrder = sortConfig.order === "ascending" ? "descending" : "ascending"
      } else {
        if (field === "name" || field === "email" || field === "orcid") {
          newOrder = "ascending"
        } else if (
          field === "created" ||
          field === "lastSeen" ||
          field === "modified"
        ) {
          newOrder = "descending"
        }
      }
      onSortChange(field, newOrder)
    },
    [onSortChange, sortConfig],
  )

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - {pageTitle}</title>
      </Helmet>
      <div className="admin-users">
        <div className="header-wrap ">
          <h2>Current Users</h2>
          <div className={styles.filterControls}>
            <div>Filter:</div>
            <label>
              Admin:
              <input
                type="checkbox"
                checked={filters.admin === true}
                onChange={handleAdminFilterCheckboxChange}
              />
              {filters.admin === true
                ? <i className="fa fa-check-square-o"></i>
                : <i className="fa fa-square-o"></i>}
            </label>
            <label>
              Blocked:
              <input
                type="checkbox"
                checked={filters.blocked === true}
                onChange={handleBlockedFilterCheckboxChange}
              />
              {filters.blocked === true
                ? <i className="fa fa-check-square-o"></i>
                : <i className="fa fa-square-o"></i>}
            </label>
          </div>
          <div className={styles.searchControl}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Search name or email"
                value={searchTerm || ""}
                onChange={handleInputChange}
              />
              {searchTerm && (
                <button
                  className={styles.clearSearchButton}
                  onClick={handleClearSearch}
                >
                  &#x2715;
                </button>
              )}
            </div>
            <button
              className={styles.searchSubmitButton}
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.gridHead}>
            <button
              className={`${styles.sortButton} ${styles.colLarge} ${
                sortConfig.field === "name" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("name")}
            >
              Name {sortConfig.field === "name" && (
                // --- USE FONT AWESOME ICONS HERE ---
                <i
                  className={sortConfig.order === "ascending"
                    ? SORT_ASC_ICON
                    : SORT_DESC_ICON}
                >
                </i>
                // --- END CHANGE ---
              )}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "email" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("email")}
            >
              Email {sortConfig.field === "email" && (
                // --- USE FONT AWESOME ICONS HERE ---
                <i
                  className={sortConfig.order === "ascending"
                    ? SORT_ASC_ICON
                    : SORT_DESC_ICON}
                >
                </i>
                // --- END CHANGE ---
              )}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "orcid" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("orcid")}
            >
              ORCID {sortConfig.field === "orcid" && (
                // --- USE FONT AWESOME ICONS HERE ---
                <i
                  className={sortConfig.order === "ascending"
                    ? SORT_ASC_ICON
                    : SORT_DESC_ICON}
                >
                </i>
                // --- END CHANGE ---
              )}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "created" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("created")}
            >
              Created {sortConfig.field === "created" && (
                // --- USE FONT AWESOME ICONS HERE ---
                <i
                  className={sortConfig.order === "ascending"
                    ? SORT_ASC_ICON
                    : SORT_DESC_ICON}
                >
                </i>
                // --- END CHANGE ---
              )}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "lastSeen" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("lastSeen")}
            >
              Login {sortConfig.field === "lastSeen" && (
                // --- USE FONT AWESOME ICONS HERE ---
                <i
                  className={sortConfig.order === "ascending"
                    ? SORT_ASC_ICON
                    : SORT_DESC_ICON}
                >
                </i>
                // --- END CHANGE ---
              )}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "modified" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("modified")}
            >
              Modified {sortConfig.field === "modified" && (
                // --- USE FONT AWESOME ICONS HERE ---
                <i
                  className={sortConfig.order === "ascending"
                    ? SORT_ASC_ICON
                    : SORT_DESC_ICON}
                >
                </i>
                // --- END CHANGE ---
              )}
            </button>
            <span className={`${styles.headingCol}  ${styles.colFlex}`}>
              Actions
            </span>
          </div>
          <ul className={styles.usersWrap}>
            {hasUsers
              ? users.map((user, index) => (
                <li
                  className={styles.userPanel + " panel panel-default fade-in"}
                  key={user.id || index}
                >
                  <UserSummary
                    user={user}
                    refetchCurrentPage={refetchCurrentPage}
                  />
                </li>
              ))
              : noResults(loading)}
          </ul>
        </div>

        <div className={styles.loadMoreContainer}>
          {loading && users.length > 0 && <p>Loading more users...</p>}
          {!loading && hasMore && (
            <button onClick={loadMore} className={styles.loadMoreButton}>
              Load More ({users.length} of {totalCount})
            </button>
          )}
          {!hasMore && users.length > 0 && !loading && (
            <p>All {totalCount} users loaded.</p>
          )}
        </div>
      </div>
    </>
  )
}

export const UsersPage = () => {
  const [sortConfig, setSortConfig] = useState<{
    field: string | null
    order: "ascending" | "descending"
  }>({ field: "name", order: "ascending" })
  const [filters, setFilters] = useState<{
    admin: boolean | null
    blocked: boolean | null
  }>({ admin: null, blocked: null })
  const [search, setSearch] = useState<string | undefined>(undefined)

  const {
    users,
    loading,
    error,
    refetchCurrentPage,
    loadMore,
    hasMore,
    totalCount,
  } = useUsers({
    orderBy: sortConfig,
    isAdmin: filters.admin,
    isBlocked: filters.blocked,
    search: search,
    initialLimit: 100,
  })

  const handleSortChange = useCallback(
    (field: string | null, order: "ascending" | "descending") => {
      setSortConfig({ field, order })
    },
    [setSortConfig],
  )

  const handleFilterChange = useCallback(
    (filterType: "admin" | "blocked" | null, value: boolean) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: value ? true : null,
      }))
    },
    [setFilters],
  )

  const handleSearchChange = useCallback(
    (searchValue: string | undefined) => {
      setSearch(searchValue)
    },
    [setSearch],
  )

  if (loading && users.length === 0) {
    return <Loading />
  }

  if (error) {
    Sentry.captureException(error)
    return <p>Error loading users...</p>
  }

  return (
    <Users
      users={users || []}
      refetchCurrentPage={refetchCurrentPage}
      loading={loading}
      onSortChange={handleSortChange}
      sortConfig={sortConfig}
      onFilterChange={handleFilterChange}
      filters={filters}
      onSearchChange={handleSearchChange}
      currentSearchTerm={search}
      loadMore={loadMore}
      hasMore={hasMore}
      totalCount={totalCount}
    />
  )
}
