import React from "react";
import { Route, Routes } from "react-router-dom";
import { UserAccountContainer } from "./user-container";
import { UserAccountView } from "./user-account-view";
import { UserNotificationsView } from "./user-notifications-view"
import { UserDatasetsView } from "./user-datasets-view";
import FourOFourPage from "../errors/404page";
import FourOThreePage from "../errors/403page";
interface UserRoutesProps {
  user: any;
  hasEdit: boolean;
}

export const UserRoutes: React.FC<UserRoutesProps> = ({ user, hasEdit }) => {
  return (
    <Routes>
      <Route path="/*" element={<FourOFourPage />} />
      <Route path="*" element={<UserAccountContainer user={user} hasEdit={hasEdit} />}>
        <Route path="" element={<UserDatasetsView user={user} />} />
        <Route
          path="account"
          element={hasEdit ? <UserAccountView user={user} /> : <FourOThreePage />}
        />
        <Route
          path="notifications"
          element={hasEdit ? <UserNotificationsView user={user} /> : <FourOThreePage />}
        />
        <Route path="*" element={<FourOFourPage />} />
      </Route>
    </Routes>
  );
};
