// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { Query } from '@apollo/client/react/components'
import { gql } from '@apollo/client'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import Input from '../common/forms/input.jsx'
import Spinner from '../common/partials/spinner.jsx'
import { formatDate } from '../utils/date.js'
import Helmet from 'react-helmet'
import { pageTitle } from '../resources/strings.js'
import { UserTools } from './user-tools'
import { users } from '@openneuro/client'

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
  <Query query={users.getUsers}>{UsersQueryResult}</Query>
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
        <div
          className="fade-in user-panel clearfix panel panel-default"
          key={index}>
          <div className="col-xs-4 user-col">
            <h3>
              <div className="userName">
                <span>{user.name}</span>
                <div className="badge">{adminBadge}</div>
              </div>
            </h3>
          </div>
          <div className="col-xs-3 user-col middle">
            <h3 className="user-email">{userEmail}</h3>
          </div>
          <div className="col-xs-2 user-col middle">
            <h3 className="user-provider">{user.provider}</h3>
          </div>
          <UserTools user={user} refetch={this.props.refetch} />
          {this._userSummary(user)}
        </div>
      )
    })
    return (
      <>
        <Helmet>
          <title>Admin Dashboard - {pageTitle}</title>
        </Helmet>
        <div className="dashboard-dataset-teasers fade-in admin-users clearfix">
          <div className="header-wrap clearfix">
            <div className="col-sm-9">
              <h2>Current Users</h2>
            </div>
            <div className="col-sm-3">
              <Input
                className="pull-right"
                placeholder="Search Name or Email"
                onChange={e => this.setState({ stringFilter: e.target.value })}
              />
            </div>
          </div>

          <div className="filters-sort-wrap clearfix">
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
            <div className="col-xs-12 users-panel-wrap">
              <div className="fade-in user-panel-header clearfix">
                <div className="col-xs-4 user-col">
                  <label>User</label>
                </div>
                <div className="col-xs-3 user-col">
                  <label>Email</label>
                </div>
                <div className="col-xs-2 user-col">
                  <label>Provider</label>
                </div>
                <div className="col-xs-3 user-col">
                  <label>Actions</label>
                </div>
              </div>

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
      <div className="panel-heading">
        <div className="minimal-summary">
          <div className="summary-data">
            <span>
              <b>Signed Up:</b> {formatDate(created)} -{' '}
              {formatDistanceToNow(parseISO(created))} ago
            </span>
          </div>
          <div className="summary-data">
            <span>
              <b>Last Signed In:</b> {formatDate(lastLogin)} -{' '}
              {formatDistanceToNow(parseISO(lastLogin))} ago
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Users.propTypes = {
  users: PropTypes.array,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
}

export default UsersQuery
