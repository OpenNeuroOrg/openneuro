import React from "react"
import { useParams } from "react-router-dom"
import { UserRoutes } from "./user-routes"
import FourOFourPage from "../errors/404page"
import { isValidOrcid } from "../utils/validationUtils"
import { gql, useQuery } from "@apollo/client"
import { isAdmin } from "../authentication/admin-user"
import { useCookies } from "react-cookie"
import { getProfile } from "../authentication/profile"

// GraphQL query to fetch user by ORCID
export const GET_USER_BY_ORCID = gql`
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
    }
  }
`

export const UPDATE_USER = gql`
mutation updateUser($id: ID!, $location: String, $links: [String], $institution: String) {
  updateUser(id: $id, location: $location, links: $links, institution: $institution) {
    id
    location
    links
    institution
  }
}
`

export const UserQuery: React.FC = () => {
  const { orcid } = useParams()
  const isOrcidValid = orcid && isValidOrcid(orcid)
  const { data, loading, error } = useQuery(GET_USER_BY_ORCID, {
    variables: { userId: orcid },
    skip: !isOrcidValid,
  })

  const [cookies] = useCookies()
  const profile = getProfile(cookies)

  if (!isOrcidValid) {
    return <FourOFourPage />
  }

  if (loading) return <div>Loading...</div>

  if (error || !data?.user || data.user.orcid !== orcid) {
    return <FourOFourPage />
  }

  // is admin or profile matches id from the user data being returned
  const hasEdit = isAdmin || data.user.id !== profile.sub ? true : false

  // Render user data with UserRoutes
  return <UserRoutes user={data.user} hasEdit={hasEdit} />
}
