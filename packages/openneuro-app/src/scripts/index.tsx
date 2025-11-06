import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Uploader from "./uploader/uploader"
import AppRoutes from "./routes"
import HeaderContainer from "./common/containers/header"
import FooterContainer from "./common/containers/footer"
import { SearchParamsProvider } from "./search/search-params-ctx"
import { UserModalOpenProvider } from "./utils/user-login-modal-ctx"
import { useAnalytics } from "./utils/analytics"
import { useUser } from "./queries/user"
import { NotificationsProvider } from "./users/notifications/user-notifications-context"
import "../assets/email-header.png"

const Index: React.FC = () => {
  useAnalytics()

  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useUser()

  useEffect(() => {
    if (
      !loading &&
      !error &&
      location.pathname !== "/orcid-link" &&
      user?.provider === "google"
    ) {
      navigate("/orcid-link")
    }
  }, [location.pathname, user, loading, error, navigate])

  if (loading || error) return null

  const initialNotifications = user?.notifications?.map((n) => ({
    id: n.id,
    status: Array.isArray(n.notificationStatus)
      ? n.notificationStatus.map((ns) => ns.status.toLowerCase())[0] || "unread"
      : n.notificationStatus?.status?.toLowerCase() || "unread",
    ...n,
  })) || []

  return (
    <Uploader>
      <SearchParamsProvider>
        <UserModalOpenProvider>
          <NotificationsProvider initialNotifications={initialNotifications}>
            <div className="sticky-content">
              <HeaderContainer />
              <div className="maintenance-notice">
                <h4>
                  Maintenance Notice: OpenNeuro will be undergoing scheduled
                  maintenance from November 12th to November 26th and new
                  uploads may be temporarily unavailable during this period.
                </h4>
              </div>
              <AppRoutes />
            </div>
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
