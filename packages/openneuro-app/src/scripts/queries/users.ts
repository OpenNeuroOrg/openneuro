import { gql, useQuery } from "@apollo/client"
import { useEffect } from "react"
import * as Sentry from "@sentry/react"
import { Loading } from "../components/loading/Loading"
import { User } from "../types/user-types"

export const GET_USERS = gql`
  query GetUsers($orderBy: [UserSortInput!], $isAdmin: Boolean, $isBlocked: Boolean, $search: String) {
    users(orderBy: $orderBy, isAdmin: $isAdmin, isBlocked: $isBlocked, search: $search) {
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
  }
`

interface GetUsersQueryResult {
  users?: User[]
}

interface UserSortInput {
  field: string
  order: "ascending" | "descending"
}

interface UseUsersOptions {
  orderBy?: { field: string | null; order: "ascending" | "descending" }
  isAdmin?: boolean | null
  isBlocked?: boolean | null
  search?: string | undefined
}

export const useUsers = (options: UseUsersOptions = {}) => {
  const orderByInput = options.orderBy?.field
    ? [{ field: options.orderBy.field, order: options.orderBy.order }]
    : undefined

  const variables: {
    orderBy?: UserSortInput[]
    isAdmin?: boolean
    isBlocked?: boolean
    search?: string | undefined
  } = {
    orderBy: orderByInput,
    search: options.search,
  }

  if (typeof options.isAdmin === "boolean") {
    variables.isAdmin = options.isAdmin
  }

  if (typeof options.isBlocked === "boolean") {
    variables.isBlocked = options.isBlocked
  }

  const { data, loading, error, refetch } = useQuery<GetUsersQueryResult>(
    GET_USERS,
    {
      variables,
    },
  )

  useEffect(() => {
    if (error) {
      Sentry.captureException(error)
      console.error("Error fetching users:", error)
    }
  }, [error])

  return {
    users: data?.users || [],
    loading,
    error,
    refetch,
  }
}
