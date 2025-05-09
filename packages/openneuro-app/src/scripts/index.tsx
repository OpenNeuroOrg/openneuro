import React, { useEffect } from "react"
import Uploader from "./uploader/uploader.jsx"
import AppRoutes from "./routes"
import HeaderContainer from "./common/containers/header"
import FooterContainer from "./common/containers/footer"
import { SearchParamsProvider } from "./search/search-params-ctx"
import { UserModalOpenProvider } from "./utils/user-login-modal-ctx"
import { useAnalytics } from "./utils/analytics"
import { useLocation, useNavigate } from "react-router-dom"
import "../assets/email-header.png"
import { useUser } from "./queries/user.js"

const Index = (): React.ReactElement => {
  useAnalytics()
  // Redirect authenticated Google users to the migration step if they are in any other route
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useUser()
  useEffect(() => {
    if (
      !loading && !error && location.pathname !== "/orcid-link" &&
      user?.provider === "google"
    ) {
      navigate("/orcid-link")
    }
  }, [location.pathname, user])
  return (
    <Uploader>
      <SearchParamsProvider>
        <UserModalOpenProvider>
          <div className="sticky-content">
            <HeaderContainer />
            <AppRoutes />
          </div>
          <div className="sticky-footer">
            <FooterContainer />
          </div>
        </UserModalOpenProvider>
      </SearchParamsProvider>
    </Uploader>
  )
}

export default Index
