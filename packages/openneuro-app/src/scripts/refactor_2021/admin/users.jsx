// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Input from '../../common/forms/input.jsx'
import Spinner from '../../common/partials/spinner.jsx'
import { formatDate } from '../../utils/date.js'
import Helmet from 'react-helmet'
import { pageTitle } from '../../resources/strings.js'
import { UserTools } from './user-tools'
import { USER_FRAGMENT } from './user-fragment'

export const GET_USERS = gql`
  query {
    users {
      ...userFields
    }
  }
  ${USER_FRAGMENT}
`

export const UsersQueryResult = ({ loading, data, refetch }) => {
  if (loading) {
    return <Spinner active message="Loading users" />
  } else {
    return (
      <Users loading={loading} users={data.users || []} refetch={refetch} />
    )
  }
}

export const UsersQuery = () => (
  <Query query={GET_USERS}>{UsersQueryResult}</Query>
)

UsersQueryResult.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.object,
  refetch: PropTypes.func,
}

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stringFilter: null,
      adminFilter: false,
      blacklistFilter: false,
    }
  }

  // life cycle events --------------------------------------------------
  render() {
    const users = this.props.users.map((user, index) => {
      const adminBadge = user.admin ? 'Admin' : null
      const userEmail = user.hasOwnProperty('email') ? user.email : user.id
      if (this.state.adminFilter && !user.admin) {
        return null
      }
      if (this.state.stringFilter) {
        const stringFilter = this.state.stringFilter.toLowerCase()
        if (
          !(
            user.email.toLowerCase().includes(stringFilter) ||
            user.name.toLowerCase().includes(stringFilter)
          )
        ) {
          return null
        }
      }
      return (
        <div className="fade-in user-panel  panel panel-default" key={index}>
          <div className="user-col uc-name">
            <div>
              {user.name}{' '}
              {adminBadge && <span className="badge">{adminBadge}</span>}
              <UserTools user={user} refetch={this.props.refetch} />
            </div>
          </div>
          <div className="user-col user-panel-inner">
            <div className=" user-col uc-email">
              {userEmail}
              <div className=" uc-provider">
                <b>Provider:</b> {user.provider}
              </div>
            </div>

            <div className=" user-col uc-summary">
              {this._userSummary(user)}
            </div>
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
              className="pull-right"
              placeholder="Search Name or Email"
              onChange={e => this.setState({ stringFilter: e.target.value })}
            />
          </div>

          <div className="filters-sort-wrap ">
            <span>
              <div className="filters">
                <label>Filter By:</label>
                <button
                  className={this.state.adminFilter ? 'active' : null}
                  onClick={() =>
                    this.setState({ adminFilter: !this.state.adminFilter })
                  }>
                  <span className="filter-admin">
                    <i
                      className={
                        this.state.adminFilter
                          ? 'fa fa-check-square-o'
                          : 'fa fa-square-o'
                      }
                    />{' '}
                    Admin
                  </span>
                </button>
                <button
                  className={this.state.blacklistFilter ? 'active' : null}
                  onClick={() =>
                    this.setState({
                      blacklistFilter: !this.state.blacklistFilter,
                    })
                  }>
                  <span className="filter-admin">
                    <i
                      className={
                        this.state.blacklistFilter
                          ? 'fa fa-check-square-o'
                          : 'fa fa-square-o'
                      }
                    />{' '}
                    Blocked
                  </span>
                </button>
              </div>
            </span>
          </div>

          <div>
            <div className="users-panel-wrap">
              {users.filter(u => u !== null).length ? users : this._noResults()}
            </div>
          </div>
        </div>
      </>
    )
  }

  // custom methods -----------------------------------------------------

  _noResults() {
    return this.state.loading ? (
      <Spinner active message="Loading users" />
    ) : (
      <h4>No Results Found</h4>
    )
  }

  _userSummary(user) {
    const lastLogin = user.lastlogin ? user.lastlogin : user.created
    const created = user.created
    return (
      <>
        <div className="summary-data">
          <b>Signed Up:</b>{' '}
          <div>
            {formatDate(created)} - {formatDistanceToNow(parseISO(created))} ago
          </div>
        </div>
        <div className="summary-data">
          <b>Last Signed In:</b>{' '}
          <div>
            {formatDate(lastLogin)} - {formatDistanceToNow(parseISO(lastLogin))}{' '}
            ago
          </div>
        </div>
      </>
    )
  }
}

Users.propTypes = {
  users: PropTypes.array,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
}

export default UsersQuery
