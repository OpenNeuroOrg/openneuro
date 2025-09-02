import React, { createContext, useContext } from "react"
import { Outlet, Route, Routes } from "react-router-dom"
import { UserAccountContainer } from "./user-container"
import { UserAccountView } from "./user-account-view"
import { UserNotificationsView } from "./user-notifications-view"
import { UserDatasetsView } from "./user-datasets-view"
import FourOFourPage from "../errors/404page"
import FourOThreePage from "../errors/403page"
import {
  ArchivedNotifications,
  SavedNotifications,
  UnreadNotifications,
} from "./user-notifications-tab-content"
import type { OutletContextType, UserRoutesProps } from "../types/user-types"
import { OrcidConsentModal } from "./user-orcid-consent-modal"

// This context is for managing notifications state
export const NotificationsContext = createContext<OutletContextType | null>(
  null,
)

// This hook provides a way to consume the notifications context
export const useNotificationsContext = (): OutletContextType => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error(
      "useNotificationsContext must be used within NotificationsContextProvider",
    )
  }
  return context
}

export const UserRoutes: React.FC<UserRoutesProps> = (
  { orcidUser, hasEdit, isUser },
) => {
  return (
    <>
      <OrcidConsentModal />

      <Routes>
        <Route path="/*" element={<FourOFourPage />} />
        {/* The main route that contains all other user routes within a container */}
        <Route
          path="*"
          element={
            <UserAccountContainer
              orcidUser={orcidUser}
              hasEdit={hasEdit}
              isUser={isUser}
            />
          }
        >
          {/* This is the default route for the user's datasets */}
          <Route
            path=""
            element={
              <UserDatasetsView orcidUser={orcidUser} hasEdit={hasEdit} />
            }
          />
          {/* This route handles the user account page */}
          <Route
            path="account"
            element={hasEdit
              ? <UserAccountView orcidUser={orcidUser} />
              : <FourOThreePage />}
          />
          {/* This route handles the user notifications and its sub-routes */}
          <Route
            path="notifications/*"
            element={hasEdit
              ? <UserNotificationsView orcidUser={orcidUser} />
              : <FourOThreePage />}
          >
            <Route
              element={
                <NotificationsContext.Provider
                  value={{
                    notifications: [],
                    handleUpdateNotification: async () => {},
                  }}
                >
                  <Outlet />
                </NotificationsContext.Provider>
              }
            >
              <Route index element={<UnreadNotifications />} />
              <Route path="unread" element={<UnreadNotifications />} />
              <Route path="saved" element={<SavedNotifications />} />
              <Route path="archived" element={<ArchivedNotifications />} />
              <Route path="*" element={<FourOFourPage />} />
            </Route>
          </Route>
          {/* Fallback route for any other path within the user account */}
          <Route path="*" element={<FourOFourPage />} />
        </Route>
      </Routes>
    </>
  )
}
