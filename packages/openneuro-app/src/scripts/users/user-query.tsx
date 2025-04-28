import React from "react"
import { useParams } from "react-router-dom"
import { UserRoutes } from "./user-routes"
import FourOFourPage from "../errors/404page"
import { isValidOrcid } from "../utils/validationUtils"
import { useQuery } from "@apollo/client"
import { isAdmin } from "../authentication/admin-user"
import { useCookies } from "react-cookie"
import { getProfile } from "../authentication/profile"
import { GET_USER } from "../queries/user"

export const UserQuery: React.FC = () => {
  const { orcid } = useParams()
  const isOrcidValid = orcid && isValidOrcid(orcid)
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: orcid },
    skip: !isOrcidValid,
  })

  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  const isAdminUser = isAdmin()
  if (!isOrcidValid) {
    return <FourOFourPage />
  }

  if (loading) return <div>Loading...</div>

  if (error || !data?.user || data.user.orcid !== orcid) {
    return <FourOFourPage />
  }

  if (!profile || !profile.sub) {
    return <FourOFourPage />
  }
  // is admin or profile matches id from the user data being returned
  const isUser = (data.user.id === profile?.sub) ? true : false
  const hasEdit = isAdminUser || (data.user.id === profile?.sub) ? true : false
  // Render user data with UserRoutes
  return <UserRoutes user={data.user} hasEdit={hasEdit} isUser={isUser} />
}
