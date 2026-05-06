import React from "react"
import { useParams } from "react-router-dom"
import { UserRoutes } from "./user-routes"
import FourOFourPage from "../errors/404page"
import { isValidOrcid } from "../utils/validationUtils"
import { isAdmin } from "../authentication/admin-user"
import { useCookies } from "react-cookie"
import { getProfile } from "../authentication/profile"
import { useUser } from "../queries/user"

export const UserQuery: React.FC = () => {
  const { orcid } = useParams()
  const { user, loading } = useUser(orcid, { errorPolicy: "all" })

  const [cookies] = useCookies()
  const profile = getProfile(cookies)
  const isAdminUser = isAdmin()

  if (!isValidOrcid(orcid)) {
    return <FourOFourPage />
  }

  if (loading) return <div>Loading...</div>

  // is admin or profile matches id from the user data being returned
  const isUser = (user?.id === profile?.sub) ? true : false
  const hasEdit = isAdminUser || (user?.id === profile?.sub) ? true : false
  // Render user data with UserRoutes
  return <UserRoutes orcidUser={user} hasEdit={hasEdit} isUser={isUser} />
}
