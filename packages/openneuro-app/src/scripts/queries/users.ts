import { useCallback, useEffect, useRef, useState } from "react"
import { gql, useQuery } from "@apollo/client"
import * as Sentry from "@sentry/react"
import type { User } from "../types/user-types"

// --- Fragments ---
export const USER_FRAGMENT = gql`
  fragment userFields on User {
    id
    name
    admin
    blocked
    email
    provider
    lastSeen
    created
    avatar
    github
    institution
    location
    modified
    orcid
  }
`

// --- GET_USERS QUERY ---
export const GET_USERS = gql`
  query GetUsers(
    $orderBy: [UserSortInput!]
    $isAdmin: Boolean
    $isBlocked: Boolean
    $search: String
    $limit: Int
    $offset: Int
  ) {
    users(
      orderBy: $orderBy
      isAdmin: $isAdmin
      isBlocked: $isBlocked
      search: $search
      limit: $limit
      offset: $offset
    ) {
      users {
        ...userFields
      }
      totalCount
    }
  }
  ${USER_FRAGMENT}
`

export const SET_ADMIN_MUTATION = gql`
  mutation SetAdmin($id: ID!, $admin: Boolean!) {
    setAdmin(id: $id, admin: $admin) {
      ...userFields
    }
  }
  ${USER_FRAGMENT}
`

export const SET_BLOCKED_MUTATION = gql`
  mutation SetBlocked($id: ID!, $blocked: Boolean!) {
    setBlocked(id: $id, blocked: $blocked) {
      ...userFields
    }
  }
  ${USER_FRAGMENT}
`

// --- INTERFACES ---
export interface GetUsersQueryResult {
  users?: {
    users: User[]
    totalCount: number
  }
}

export interface GetUsersQueryVariables {
  orderBy?: { field: string; order: "ascending" | "descending" }[]
  isAdmin?: boolean
  isBlocked?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface UseUsersOptions {
  orderBy?: { field: string | null; order: "ascending" | "descending" }
  isAdmin?: boolean | null
  isBlocked?: boolean | null
  search?: string | undefined
  initialLimit?: number
}

// --- useUsers HOOK ---
export const useUsers = (options: UseUsersOptions = {}) => {
  const [currentLimit] = useState(options.initialLimit || 100)
  const [offset, setOffset] = useState(0)

  const filterSortSearchVariables = useRef({
    orderBy: options.orderBy?.field
      ? [{ field: options.orderBy.field, order: options.orderBy.order }]
      : undefined,
    search: options.search,
    isAdmin: typeof options.isAdmin === "boolean" ? options.isAdmin : undefined,
    isBlocked: typeof options.isBlocked === "boolean"
      ? options.isBlocked
      : undefined,
  })

  // Effect to update the ref when options change and reset offset
  useEffect(() => {
    filterSortSearchVariables.current = {
      orderBy: options.orderBy?.field
        ? [{ field: options.orderBy.field, order: options.orderBy.order }]
        : undefined,
      search: options.search,
      isAdmin: typeof options.isAdmin === "boolean"
        ? options.isAdmin
        : undefined,
      isBlocked: typeof options.isBlocked === "boolean"
        ? options.isBlocked
        : undefined,
    }
    // When filters/sort/search change, reset the offset to 0 to start a new list
    setOffset(0)
  }, [options.orderBy, options.search, options.isAdmin, options.isBlocked])

  const { data, loading, error, fetchMore, refetch } = useQuery<
    GetUsersQueryResult
  >(GET_USERS, {
    variables: {
      ...filterSortSearchVariables.current,
      limit: currentLimit,
      offset: offset,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  })

  const [allUsers, setAllUsers] = useState<User[]>([])

  useEffect(() => {
    if (data?.users?.users) {
      if (offset === 0) {
        setAllUsers(data.users.users)
      } else {
        setAllUsers((prevUsers) => {
          const newUsers = data.users!.users
          const uniqueNewUsers = newUsers.filter(
            (newUser) =>
              !prevUsers.some((existingUser) => existingUser.id === newUser.id),
          )
          return [...prevUsers, ...uniqueNewUsers]
        })
      }
    }
  }, [data?.users?.users, offset])

  const totalCount = data?.users?.totalCount || 0
  const hasMore = totalCount > allUsers.length || loading

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      const newOffset = allUsers.length
      fetchMore({
        variables: {
          ...filterSortSearchVariables.current,
          offset: newOffset,
          limit: currentLimit,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          const incomingUsers = fetchMoreResult.users.users
          const currentUsers = prev.users?.users || []

          const combinedUsers = currentUsers.concat(
            incomingUsers.filter(
              (newUser) =>
                !currentUsers.some(
                  (existingUser) => existingUser.id === newUser.id,
                ),
            ),
          )

          return {
            users: {
              ...prev.users,
              users: combinedUsers,
              totalCount: fetchMoreResult.users.totalCount,
            },
          }
        },
      })
    }
  }, [
    allUsers.length,
    hasMore,
    loading,
    fetchMore,
    currentLimit,
    filterSortSearchVariables,
  ])

  const refetchFullList = useCallback(
    async (variablesToRefetch?: GetUsersQueryVariables) => {
      setOffset(0)
      await refetch({
        ...filterSortSearchVariables.current,
        ...variablesToRefetch,
        offset: 0,
        limit: currentLimit,
      })
    },
    [refetch, filterSortSearchVariables, currentLimit],
  )

  const refetchCurrentPage = useCallback(async () => {
    await refetch({
      ...filterSortSearchVariables.current,
      offset: 0,
      limit: allUsers.length > 0 ? allUsers.length : currentLimit,
    })
  }, [refetch, filterSortSearchVariables, allUsers.length, currentLimit])

  useEffect(() => {
    if (error) {
      Sentry.captureException(error)
    }
  }, [error])

  return {
    users: allUsers,
    loading,
    error,
    refetchFullList,
    refetchCurrentPage,
    loadMore,
    hasMore,
    totalCount,
    currentLimit,
    currentOffset: allUsers.length,
    filterSortSearchVariables: filterSortSearchVariables.current,
  }
}
