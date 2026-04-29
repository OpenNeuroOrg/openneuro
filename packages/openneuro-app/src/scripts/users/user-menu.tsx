import React from "react"
import { Link } from "react-router-dom"
import { Dropdown } from "../components/dropdown/Dropdown"
import { useUser } from "../queries/user"
import { useNotifications } from "./notifications/user-notifications-context"
import orcidIcon from "../../assets/orcid_24x24.png"
import "./scss/user-menu.scss"

interface UserMenuListProps {
  user: NonNullable<ReturnType<typeof useUser>["user"]>
}

function UserMenuList({ user }: UserMenuListProps) {
  return (
    <>
      <li>
        <Link
          to={user.orcid ? `/user/${user.orcid}` : "/search?mydatasets"}
        >
          My Datasets
        </Link>
      </li>

      {user.orcid && (
        <li>
          <Link to={`/user/${user.orcid}/account`}>Account Info</Link>
        </li>
      )}

      <li className="user-menu-link">
        <Link to="/keygen">Obtain an API Key</Link>
      </li>

      {user.provider !== "orcid" && (
        <li className="user-menu-link">
          <a href="/crn/auth/orcid?link=true">Link ORCID to my account</a>
        </li>
      )}

      {user.admin && (
        <li className="user-menu-link">
          <Link to="/admin">Admin</Link>
        </li>
      )}
    </>
  )
}

export interface UserMenuProps {
  signOutAndRedirect: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({ signOutAndRedirect }) => {
  const { user, loading } = useUser()
  const { notifications } = useNotifications()

  if (loading || !user) return null

  const reviewer = user.id === "reviewer"

  const inboxCount =
    notifications?.filter((n) => n.status === "unread").length || 0

  return (
    <span className="user-menu-wrap">
      {user.orcid && user.id !== "reviewer" && (
        <span className="notifications-link">
          <Link to={`/user/${user.orcid}/notifications/unread`}>
            <i className="fa fa-inbox">
              {inboxCount > 0 && (
                <span className="count">
                  {inboxCount > 99
                    ? (
                      <>
                        99<span>+</span>
                      </>
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
        className="user-menu-dropdown"
        label={user.avatar
          ? (
            <img
              className="user-menu-label avatar"
              src={user.avatar}
              alt="User Avatar"
            />
          )
          : <div className="user-menu-label">My Account</div>}
      >
        <div className="user-menu-dropdown-list">
          <ul>
            <li className="dropdown-header">
              <p>
                <span>Hello</span> <br />
                {user.name} <br />
              </p>
              <p>
                <span>signed in via {user.provider}</span>
                {user?.orcid && (
                      <a
                        href={`https://orcid.org/${user.orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={orcidIcon} alt="ORCID iD" /> {user.orcid}
                      </a>
                    ) || user.email}
              </p>
            </li>

            {!reviewer && <UserMenuList user={user} />}

            <li className="user-menu-link">
              <a onClick={signOutAndRedirect} className="btn-submit-other">
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </Dropdown>
    </span>
  )
}
