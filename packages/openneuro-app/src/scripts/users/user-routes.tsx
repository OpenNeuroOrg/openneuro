import React from "react";
import { Route, Routes } from "react-router-dom";
import { UserAccountContainer } from "./user-account-container";
import { UserAccountPage } from "./user-account-info";
import { UserNotificationsPage } from "./user-notifications"
import { UserDatasets } from "./user-datasets";
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
        <Route path="" element={<UserDatasets user={user} />} />
        <Route
          path="account"
          element={hasEdit ? <UserAccountPage user={user} /> : <FourOThreePage />}
        />
        <Route
          path="notifications"
          element={hasEdit ? <UserNotificationsPage user={user} /> : <FourOThreePage />}
        />
        <Route path="*" element={<FourOFourPage />} />
      </Route>
    </Routes>
  );
};
