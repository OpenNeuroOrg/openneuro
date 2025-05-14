import React, { useCallback, useEffect, useState } from "react" // Import useEffect
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
  currentSearchTerm: string | undefined // Prop to receive the current search term
}

const Users = ({
  users,
  refetch,
  loading,
  onSortChange,
  sortConfig,
  onFilterChange,
  filters,
  onSearchChange,
  currentSearchTerm, // Receive the prop
}: UsersProps) => {
  const hasUsers = users && users.length > 0
  const [searchTerm, setSearchTerm] = useState<string | undefined>(
    currentSearchTerm,
  )

  useEffect(() => {
    setSearchTerm(currentSearchTerm) // Update local state when prop changes
  }, [currentSearchTerm])

  const handleFieldChange = useCallback((e) => {
    onSortChange(e.target.value, sortConfig.order)
  }, [onSortChange, sortConfig.order])

  const handleOrderChange = useCallback((e) => {
    onSortChange(sortConfig.field, e.target.value as "ascending" | "descending")
  }, [onSortChange, sortConfig.field])

  const handleAdminFilterChange = useCallback((e) => {
    onFilterChange("admin", e.target.checked)
  }, [onFilterChange])

  const handleBlockedFilterChange = useCallback((e) => {
    onFilterChange("blocked", e.target.checked)
  }, [onFilterChange])

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
    onSearchChange(undefined) // Trigger search with empty term
  }, [onSearchChange, setSearchTerm])

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - {pageTitle}</title>
      </Helmet>
      <div className="admin-users">
        <div className="header-wrap ">
          <h2>Current Users</h2>
          <div className={styles.filterControls}>
            <span>Filter:</span>
            <label>
              Admin:
              <input
                type="checkbox"
                checked={filters.admin === true}
                onChange={handleAdminFilterChange}
              />
            </label>
            <label>
              Blocked:
              <input
                type="checkbox"
                checked={filters.blocked === true}
                onChange={handleBlockedFilterChange}
              />
            </label>
          </div>
          <div className={styles.sortControls}>
            <span>Sort By:</span>
            <select value={sortConfig.field || ""} onChange={handleFieldChange}>
              <option value="">-- Select Field --</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
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
          </div>
          <div className={styles.searchControl}>
            {/* New search input */}
            <span>Search:</span>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Search name or email"
                value={searchTerm || ""} // Bind value to state
                onChange={handleInputChange}
              />
              {searchTerm && (
                <button
                  className={styles.clearSearchButton}
                  onClick={handleClearSearch}
                >
                  &#x2715;{" "}
                  {/* Unicode for multiplication sign (looks like an X) */}
                </button>
              )}
            </div>
            <button onClick={handleSearchSubmit}>Search</button>
          </div>
        </div>

        <div>
          <ul className={styles.usersWrap}>
            {hasUsers
              ? (
                users.map((user, index) => (
                  <li
                    className={styles.userPanel +
                      " panel panel-default fade-in"}
                    key={index}
                  >
                    <UserTools user={user} refetch={refetch} />
                    <UserSummary user={user} />
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
  >({ field: "created", order: "descending" })
  const [filters, setFilters] = useState<
    { admin: boolean | null; blocked: boolean | null }
  >({ admin: null, blocked: null })
  const [search, setSearch] = useState<string | undefined>(undefined) // New search state
  const { users, loading, error, refetch } = useUsers({
    orderBy: sortConfig,
    isAdmin: filters.admin,
    isBlocked: filters.blocked,
    search: search,
  }) // Pass search to useUsers

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
    setSearch(searchValue) // Update search state directly
  }, [setSearch])

  console.log("Current filters in UsersPage:", filters)
  console.log("Current search in UsersPage:", search)

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
      currentSearchTerm={search} // Pass the search state as a prop
    />
  )
}

export default UsersPage
