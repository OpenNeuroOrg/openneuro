import React from "react"
import { useParams } from "react-router-dom"
import { UserRoutes } from "./user-routes"
import FourOFourPage from "../errors/404page"
import { isValidOrcid } from "../utils/validationUtils"
import { gql, useQuery } from "@apollo/client"

// GraphQL query to fetch user by ORCID
export const GET_USER_BY_ORCID = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      id
      name
      orcid
      email
      avatar
    }
  }
`

export interface User {
  id: string
  name: string
  location: string
  github?: string
  institution: string
  email: string
  avatar: string
  orcid: string
  links: string[]
}

export const UserQuery: React.FC = () => {
  const { orcid } = useParams()
  const isOrcidValid = orcid && isValidOrcid(orcid)
  const { data, loading, error } = useQuery(GET_USER_BY_ORCID, {
    variables: { userId: orcid },
    skip: !isOrcidValid,
  })

  if (!isOrcidValid) {
    return <FourOFourPage />
  }

  if (loading) return <div>Loading...</div>

  if (error || !data?.user || data.user.orcid !== orcid) {
    return <FourOFourPage />
  }

  // Assuming 'hasEdit' is true for now (you can modify this based on your logic)
  const hasEdit = true

  // Render user data with UserRoutes
  return <UserRoutes user={data.user} hasEdit={hasEdit} />
}
