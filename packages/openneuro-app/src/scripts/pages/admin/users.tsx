import React, { useState } from "react"
import { Query } from "@apollo/client/react/components"
import { gql } from "@apollo/client"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Input } from "@openneuro/components/input"
import { Loading } from "@openneuro/components/loading"
import { formatDate } from "../../utils/date.js"
import Helmet from "react-helmet"
import { pageTitle } from "../../resources/strings.js"
import { UserTools } from "./user-tools.js"
import { USER_FRAGMENT } from "./user-fragment.js"

export const GET_USERS = gql`
  query {
    users {
      ...userFields
    }
  }
  ${USER_FRAGMENT}
`

// TODO - Use the GraphQL type
export interface User {
  id: string
  name: string
  admin: boolean
  blocked: boolean
  email?: string
  provider: string
  lastSeen?: string
  created: string
}

interface UsersQueryResultProps {
  loading: boolean
  data: { users: User[] }
  refetch: () => void
}

export const UsersQueryResult = (
  { loading, data, refetch }: UsersQueryResultProps,
) => {
  if (loading) {
    return <Loading />
  } else {
    return (
      <Users loading={loading} users={data.users || []} refetch={refetch} />
    )
  }
}

export const UsersQuery = () => (
  <Query query={GET_USERS}>{UsersQueryResult}</Query>
)

const userSummary = (user) => {
  const lastLogin = user.lastlogin ? user.lastlogin : user.created
  const created = user.created
  return (
    <>
      <div className="summary-data">
        <b>Signed Up:</b>{" "}
        <div>
          {formatDate(created)} - {formatDistanceToNow(parseISO(created))} ago
        </div>
      </div>
      <div className="summary-data">
        <b>Last Signed In:</b>{" "}
        <div>
          {formatDate(lastLogin)} - {formatDistanceToNow(parseISO(lastLogin))}
          {" "}
          ago
        </div>
      </div>
    </>
  )
}

const noResults = (loading) => {
  return loading ? <Loading /> : <h4>No Results Found</h4>
}

const Users = ({ users, refetch, loading }) => {
  const [stringFilter, setStringFilter] = useState(null)
  const [adminFilter, setAdminFilter] = useState(false)
  const [blacklistFilter, setBlacklistFilter] = useState(false)

  const filteredUsers = users
    .filter((user) => !adminFilter || user.admin)
    .filter(
      (user) =>
        !stringFilter ||
        user.email?.toLowerCase().includes(stringFilter.toLowerCase()) ||
        user.name?.toLowerCase().includes(stringFilter.toLowerCase()),
    )
    .map((user, index) => {
      const adminBadge = user.admin ? "Admin" : null
      const userEmail = user.hasOwnProperty("email") ? user.email : user.id
      return (
        <div className="fade-in user-panel  panel panel-default" key={index}>
          <div className="user-col uc-name">
            <div>
              {user.name}{" "}
              {adminBadge && <span className="badge">{adminBadge}</span>}
              <UserTools user={user} refetch={refetch} />
            </div>
          </div>
          <div className="user-col user-panel-inner">
            <div className=" user-col uc-email">
              {userEmail}
              <div className=" uc-provider">
                <b>Provider:</b> {user.provider}
              </div>
            </div>

            <div className=" user-col uc-summary">{userSummary(user)}</div>
          </div>
        </div>
      )
    })

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - {pageTitle}</title>
      </Helmet>
      <div className="admin-users">
        <div className="header-wrap ">
          <h2>Current Users</h2>

          <Input
            name="Search Name Or Email"
            type="text"
            placeholder="Search Name or Email"
            onKeyDown={(e) => setStringFilter(e.target.value)}
            setValue={(_) => {}}
          />
        </div>

        <div className="filters-sort-wrap ">
          <span>
            <div className="filters">
              <label>Filter By:</label>
              <button
                className={adminFilter ? "active" : null}
                onClick={() => setAdminFilter(!adminFilter)}
              >
                <span className="filter-admin">
                  <i
                    className={adminFilter
                      ? "fa fa-check-square-o"
                      : "fa fa-square-o"}
                  />{" "}
                  Admin
                </span>
              </button>
              <button
                className={blacklistFilter ? "active" : null}
                onClick={() => setBlacklistFilter(!blacklistFilter)}
              >
                <span className="filter-admin">
                  <i
                    className={blacklistFilter
                      ? "fa fa-check-square-o"
                      : "fa fa-square-o"}
                  />{" "}
                  Blocked
                </span>
              </button>
            </div>
          </span>
        </div>

        <div>
          <div className="users-panel-wrap">
            {filteredUsers.length ? filteredUsers : noResults(loading)}
          </div>
        </div>
      </div>
    </>
  )
}

export default UsersQuery
