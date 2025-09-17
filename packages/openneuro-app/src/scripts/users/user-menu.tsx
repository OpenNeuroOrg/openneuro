import React from "react"
import { Link } from "react-router-dom"
import { Dropdown } from "../components/dropdown/Dropdown"
import { useUser } from "../queries/user"
import "./scss/user-menu.scss"

export interface UserMenuProps {
  signOutAndRedirect: () => void
}

export const UserMenu = ({ signOutAndRedirect }: UserMenuProps) => {
  const { user } = useUser()

  // Calculate inboxCount from the fetched notifications
  // TODO NEEDS FILTER ON 'status' field
  const inboxCount = user?.notifications?.filter(
    (notification) => notification,
  ).length || 0
  return (
    <span className="user-menu-wrap">
      {user?.orcid && (
        <span className="notifications-link">
          <Link to={`/user/${user?.orcid}/notifications/unread`}>
            <i className="fa fa-inbox">
              {inboxCount > 0 && (
                <span className="count">
                  {inboxCount > 99
                    ? (
                      <span>
                        99<span>+</span>
                      </span>
                    )
                    : inboxCount}
                </span>
              )}
            </i>
            <span className="sr-only">Account Info</span>
          </Link>
        </span>
      )}
      <Dropdown
        className={"user-menu-dropdown"}
        label={user?.avatar
          ? (
            <img
              className="user-menu-label avatar"
              src={user?.avatar}
              alt="User Avatar"
            />
          )
          : <div className="user-menu-label">My Account</div>}
        children={
          <div className="user-menu-dropdown-list">
            <ul>
              <li className="dropdown-header">
                <p>
                  <span>Hello</span> <br />
                  {user?.name} <br />
                  {user?.email}
                </p>
                <p>
                  <span>signed in via {user?.provider}</span>
                </p>
              </li>
              <li>
                {user?.orcid
                  ? <Link to={`/user/${user?.orcid}`}>My Datasets</Link>
                  : <Link to="/search?mydatasets">My Datasets</Link>}
              </li>

              {user?.orcid && (
                <li>
                  <Link to={`/user/${user?.orcid}/account`}>Account Info</Link>
                </li>
              )}

              <li className="user-menu-link">
                <Link to="/keygen">Obtain an API Key</Link>
              </li>
              {user?.provider !== "orcid" && (
                <li className="user-menu-link">
                  <a href="/crn/auth/orcid?link=true">
                    Link ORCID to my account
                  </a>
                </li>
              )}
              {user?.admin && (
                <li className="user-menu-link">
                  <Link to="/admin">Admin</Link>
                </li>
              )}
              <li className="user-menu-link">
                <a
                  onClick={() => signOutAndRedirect()}
                  className="btn-submit-other"
                >
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        }
      />
    </span>
  )
}
