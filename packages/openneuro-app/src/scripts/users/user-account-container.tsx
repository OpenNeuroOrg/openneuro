import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export interface AccountContainerProps {
  user: any;
  hasEdit: boolean;
}

export const UserAccountContainer: React.FC<AccountContainerProps> = ({ user, hasEdit }) => {
  return (
    <>
      <div className="user-info">
        <div className="user-account-card">
          <h3>User ID: {user.id}</h3>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>ORCID: {user.orcid}</p>
          <img src={user.avatar} alt={user.name} />
        </div>
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
      <div className="user-views">
        <Outlet />
      </div>
    </>
  );
};
