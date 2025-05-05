import { gql, useQuery } from "@apollo/client"
import { useCookies } from "react-cookie"
import { getProfile } from "../authentication/profile"
import * as Sentry from "@sentry/react"

// GraphQL query to fetch user data
export const GET_USER = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      id
      name
      orcid
      email
      avatar
      location
      institution
      links
      provider
      admin
      created
      lastSeen
      blocked
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: ID!
    $location: String
    $links: [String]
    $institution: String
  ) {
    updateUser(
      id: $id
      location: $location
      links: $links
      institution: $institution
    ) {
      id
      location
      links
      institution
    }
  }
`

// Reusable hook to fetch user data
export const useUser = () => {
  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  const profileSub = profile?.sub

  const { data: userData, loading: userLoading, error: userError } = useQuery(
    GET_USER,
    {
      variables: { userId: profileSub },
      skip: !profileSub,
    },
  )

  if (userError) {
    Sentry.captureException(userError)
  }

  return {
    user: userData?.user,
    loading: userLoading,
    error: userError,
  }
}
