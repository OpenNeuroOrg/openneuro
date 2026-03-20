import React from "react"
import Uploader from "./uploader/uploader"
import AppRoutes from "./routes"
import HeaderContainer from "./common/containers/header"
import FooterContainer from "./common/containers/footer"
import { SearchParamsProvider } from "./search/search-params-ctx"
import { UserModalOpenProvider } from "./utils/user-login-modal-ctx"
import { useAnalytics } from "./utils/analytics"
import { NotificationsProvider } from "./users/notifications/user-notifications-context"
import { GoogleOrcidRedirect } from "./authentication/google-redirect"
import "../assets/email-header.png"

const Index: React.FC = () => {
  useAnalytics()

  return (
    <Uploader>
      <SearchParamsProvider>
        <UserModalOpenProvider>
          <NotificationsProvider>
            <div className="sticky-content">
              <HeaderContainer />
              <AppRoutes />
            </div>
            <GoogleOrcidRedirect />
          </NotificationsProvider>
          <div className="sticky-footer">
            <FooterContainer />
          </div>
        </UserModalOpenProvider>
      </SearchParamsProvider>
    </Uploader>
  )
}

export default Index
