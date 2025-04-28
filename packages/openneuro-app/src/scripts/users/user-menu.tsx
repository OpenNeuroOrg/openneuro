import React from "react"
import * as Sentry from "@sentry/react"
import { gql, useQuery } from "@apollo/client"
import { useCookies } from "react-cookie"
import { getProfile } from "../authentication/profile"
import { Link } from "react-router-dom"
import { Dropdown } from "../components/dropdown/Dropdown"
import "./scss/user-menu.scss"
export interface UserMenuProps {
  profile: {
    name: string
    admin: boolean
    email: string
    provider: string
    avatar?: string
    orcid?: string
  }
  signOutAndRedirect: () => void
}

// GraphQL query to fetch user data
const GET_CURRENT_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      admin
      email
      provider
      avatar
      orcid
    }
  }
`

export const UserMenu = (
  { profile: initialProfile, signOutAndRedirect }: UserMenuProps,
) => {
  const [cookies] = useCookies()
  const currentProfile = getProfile(cookies)

  // profile.sub for query
  const userId = currentProfile?.sub

  const { data: userData, loading: userLoading, error: userError } = useQuery(
    GET_CURRENT_USER,
    {
      variables: { id: userId },
      skip: !userId,
    },
  )

  const profile = userData?.user || initialProfile
  const userName = userData?.user?.name || initialProfile.name

  const inboxCount = 99

  if (userLoading) {
    return <span>Loading Account Info...</span>
  }

  if (userError) {
    Sentry.captureException(userError)
    return
  }

  return (
    <span className="user-menu-wrap">
      {profile.orcid && (
        <span className="notifications-link">
          <Link to={`/user/${profile.orcid}/notifications/unread`}>
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
        label={profile?.avatar
          ? (
            <img
              className="user-menu-label avatar"
              src={profile.avatar}
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
                  {userName} <br />
                  {profile?.email}
                </p>
                <p>
                  <span>signed in via {profile?.provider}</span>
                </p>
              </li>
              <li>
                {profile?.orcid
                  ? <Link to={`/user/${profile.orcid}`}>My Datasets</Link>
                  : <Link to="/search?mydatasets">My Datasets</Link>}
              </li>

              {profile?.orcid && (
                <li>
                  <Link to={`/user/${profile.orcid}/account`}>
                    Account Info
                  </Link>
                </li>
              )}

              <li className="user-menu-link">
                <Link to="/keygen">Obtain an API Key</Link>
              </li>
              {profile?.provider !== "orcid" && (
                <li className="user-menu-link">
                  <a href="/crn/auth/orcid?link=true">
                    Link ORCID to my account
                  </a>
                </li>
              )}
              {profile?.admin && (
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
