import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./scss/usercontainer.module.scss";

export interface UserAccountTabsProps {
  hasEdit: boolean;
}

export const UserAccountTabs: React.FC<UserAccountTabsProps> = ({ hasEdit }) => {
  if (!hasEdit) return null;

  return (
    <div className={styles.userAccountTabLinks}>
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
  );
};
