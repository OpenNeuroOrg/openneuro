import React from "react"
import { Route, Routes } from "react-router-dom"
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

import type { UserRoutesProps } from "../types/user-types"

export const UserRoutes: React.FC<UserRoutesProps> = (
  { orcidUser, hasEdit, isUser },
) => {
  return (
    <Routes>
      <Route path="/*" element={<FourOFourPage />} />
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
        <Route
          path=""
          element={<UserDatasetsView orcidUser={orcidUser} hasEdit={hasEdit} />}
        />
        <Route
          path="account"
          element={hasEdit
            ? <UserAccountView orcidUser={orcidUser} />
            : <FourOThreePage />}
        />
        <Route
          path="notifications/*"
          element={hasEdit
            ? <UserNotificationsView orcidUser={orcidUser} />
            : <FourOThreePage />}
        >
          <Route index element={<UnreadNotifications />} />
          <Route path="unread" element={<UnreadNotifications />} />
          <Route path="saved" element={<SavedNotifications />} />
          <Route path="archived" element={<ArchivedNotifications />} />
          <Route path="*" element={<FourOFourPage />} />
        </Route>
        <Route path="*" element={<FourOFourPage />} />
      </Route>
    </Routes>
  )
}
