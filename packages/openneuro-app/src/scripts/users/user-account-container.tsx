import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { UserCard  } from "./user-card";
import styles from "./scss/usercontainer.module.scss";

export interface AccountContainerProps {
  user: any;
  hasEdit: boolean;
}

export const UserAccountContainer: React.FC<AccountContainerProps> = ({ user, hasEdit }) => {
  return (
    <div className={styles.usercontainer}>
      <div className={styles.userInfo}>
      <UserCard user={user} /> 
        {hasEdit && (
          <div className="user-account-tab-links">
            <ul>
              <li>
                <NavLink to="" end className={({ isActive }) => (isActive ? "active" : "")}>
                  User Datasets
                </NavLink>
              </li>
              <li>
                <NavLink to="notifications" className={({ isActive }) => (isActive ? "active" : "")}>
                  User Notifications
                </NavLink>
              </li>
              <li>
                <NavLink to="account" className={({ isActive }) => (isActive ? "active" : "")}>
                  Account Info
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className={styles.userViews}>
        <Outlet />
      </div>
    </div>
  );
};
