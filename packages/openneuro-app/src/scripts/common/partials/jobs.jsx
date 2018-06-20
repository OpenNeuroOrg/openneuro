import React from 'react'
import PropTypes from 'prop-types'
import { Route, NavLink } from 'react-router-dom'

class JobLink extends React.Component {
  render() {
    if (this.props.enabled) {
      return (
        <NavLink to={this.props.prefix + '/jobs'} className="btn-tab">
          {this.props.isPublic ? 'Public' : 'My'} Analyses
        </NavLink>
      )
    } else {
      return null
    }
  }
}

JobLink.propTypes = {
  prefix: PropTypes.string,
  isPublic: PropTypes.bool,
  enabled: PropTypes.bool,
}

class AdminJobLink extends React.Component {
  render() {
    if (this.props.enabled) {
      return (
        <NavLink to="/admin/jobs" className="btn-tab">
          All Jobs
        </NavLink>
      )
    } else {
      return null
    }
  }
}

AdminJobLink.propTypes = {
  enabled: PropTypes.bool,
}

class JobStatsLink extends React.Component {
  render() {
    if (this.props.enabled) {
      return (
        <NavLink to="/admin/job-statistics" className="btn-tab">
          Job Stats
        </NavLink>
      )
    } else {
      return null
    }
  }
}

JobStatsLink.propTypes = {
  enabled: PropTypes.bool,
}

class JobAppDefinitionsLink extends React.Component {
  render() {
    if (this.props.enabled) {
      return (
        <NavLink to="/admin/app-definitions" className="btn-tab">
          App Definitions
        </NavLink>
      )
    } else {
      return null
    }
  }
}

JobAppDefinitionsLink.propTypes = {
  enabled: PropTypes.bool,
}

class JobRoute extends React.Component {
  render() {
    if (this.props.enabled) {
      return (
        <Route component={this.props.jobs} path={this.props.prefix + '/jobs'} />
      )
    } else {
      return null
    }
  }
}

JobRoute.propTypes = {
  prefix: PropTypes.string,
  jobs: PropTypes.func,
  enabled: PropTypes.bool,
}

export { JobLink, JobRoute, AdminJobLink, JobStatsLink, JobAppDefinitionsLink }
