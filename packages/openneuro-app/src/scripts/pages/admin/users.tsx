import React, { useCallback, useEffect, useState } from "react"
import { gql, useQuery } from "@apollo/client"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Loading } from "../../components/loading/Loading"
import { formatDate } from "../../utils/date.js"
import Helmet from "react-helmet"
import { pageTitle } from "../../resources/strings.js"
import { UserTools } from "./user-tools.js"
import { User } from "../../types/user-types"
import styles from "./users.module.scss"
import { useUsers } from "../../queries/users"
import UserSummary from "./user-summary"
import * as Sentry from "@sentry/react"

const noResults = (loading: boolean) => (
  loading ? <Loading /> : <h3>No Results Found</h3>
)

interface SortConfig {
  field: string | null
  order: "ascending" | "descending"
}

interface UsersProps {
  users: User[]
  refetch: (variables?: Record<string, any>) => void
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
}

const Users = ({
  users,
  refetch,
  loading,
  onSortChange,
  sortConfig,
  onFilterChange, // This prop handles all filters
  filters,
  onSearchChange,
  currentSearchTerm,
}: UsersProps) => {
  const hasUsers = users && users.length > 0
  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    currentSearchTerm,
  )

  useEffect(() => {
    setSearchTerm(currentSearchTerm)
  }, [currentSearchTerm])

  // Handler for sorting by field (from select dropdown, if you still have it)
  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(e.target.value, sortConfig.order)
    },
    [onSortChange, sortConfig.order],
  )

  // Handler for sorting order (from select dropdown, if you still have it)
  const handleOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onSortChange(
        sortConfig.field,
        e.target.value as "ascending" | "descending",
      )
    },
    [onSortChange, sortConfig.field],
  )

  // IMPORTANT: Use the onFilterChange prop directly for the checkboxes
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
        // Determine default sort direction
        if (field === "name" || field === "email" || field === "orcid") {
          newOrder = "ascending"
        } else if (
          field === "created" || field === "lastSeen" || field === "modified"
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
            </label>
            <label>
              Blocked:
              <input
                type="checkbox"
                checked={filters.blocked === true}
                onChange={handleBlockedFilterCheckboxChange}
              />
            </label>
          </div>
          {
            /* <div className={styles.sortControls}>
            <span>Sort By:</span>
            <select value={sortConfig.field || ""} onChange={handleFieldChange}>
              <option value="">-- Select Field --</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="orcid">ORCID</option>
              <option value="created">Created</option>
              <option value="lastSeen">Last Seen</option>
              <option value="modified">Modified</option>
            </select>

            <select
              id="sortOrder"
              value={sortConfig.order}
              onChange={handleOrderChange}
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div> */
          }
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
              Name {sortConfig.field === "name" &&
                (sortConfig.order === "ascending" ? "▲" : "▼")}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colLarge} ${
                sortConfig.field === "email" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("email")}
            >
              Email {sortConfig.field === "email" &&
                (sortConfig.order === "ascending" ? "▲" : "▼")}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colLarge} ${
                sortConfig.field === "orcid" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("orcid")}
            >
              ORCID {sortConfig.field === "orcid" &&
                (sortConfig.order === "ascending" ? "▲" : "▼")}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "created" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("created")}
            >
              Joined {sortConfig.field === "created" &&
                (sortConfig.order === "ascending" ? "▲" : "▼")}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "lastSeen" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("lastSeen")}
            >
              Login {sortConfig.field === "lastSeen" &&
                (sortConfig.order === "ascending" ? "▲" : "▼")}
            </button>
            <button
              className={`${styles.sortButton} ${styles.colSmall} ${
                sortConfig.field === "modified" ? styles.active : ""
              }`}
              onClick={() => handleSortButtonClick("modified")}
            >
              Modified {sortConfig.field === "modified" &&
                (sortConfig.order === "ascending" ? "▲" : "▼")}
            </button>
            <span className={`${styles.headingCol}  ${styles.colFlex}`}>
              Actions
            </span>
          </div>
          <ul className={styles.usersWrap}>
            {hasUsers
              ? (
                users.map((user, index) => (
                  <li
                    className={styles.userPanel +
                      " panel panel-default fade-in"}
                    key={index}
                  >
                    <UserSummary user={user} refetch={refetch} />
                  </li>
                ))
              )
              : (
                noResults(loading)
              )}
          </ul>
        </div>
      </div>
    </>
  )
}

export const UsersPage = () => {
  const [sortConfig, setSortConfig] = useState<
    { field: string | null; order: "ascending" | "descending" }
  >({ field: "name", order: "ascending" })
  const [filters, setFilters] = useState<
    { admin: boolean | null; blocked: boolean | null }
  >({ admin: null, blocked: null })
  const [search, setSearch] = useState<string | undefined>(undefined)
  const { users, loading, error, refetch } = useUsers({
    orderBy: sortConfig,
    isAdmin: filters.admin,
    isBlocked: filters.blocked,
    search: search,
  })

  const handleSortChange = useCallback(
    (field: string | null, order: "ascending" | "descending") => {
      setSortConfig({ field, order })
    },
    [setSortConfig],
  )

  const handleFilterChange = useCallback(
    (filterType: "admin" | "blocked" | null, value: boolean) => {
      console.log("handleFilterChange called:", filterType, value)
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterType]: value ? true : null,
      }))
    },
    [setFilters],
  )

  const handleSearchChange = useCallback((searchValue: string | undefined) => {
    setSearch(searchValue)
  }, [setSearch])

  console.log("Current filters in UsersPage:", filters)
  console.log("Current search in UsersPage:", search)
  console.log("Current sortConfig in UsersPage:", sortConfig)

  if (loading) {
    return <Loading />
  }

  if (error) {
    Sentry.captureException(error)
    return <p>Error loading users...</p>
  }

  return (
    <Users
      users={users || []}
      refetch={refetch}
      loading={loading}
      onSortChange={handleSortChange}
      sortConfig={sortConfig}
      onFilterChange={handleFilterChange}
      filters={filters}
      onSearchChange={handleSearchChange}
      currentSearchTerm={search}
    />
  )
}

export default UsersPage
