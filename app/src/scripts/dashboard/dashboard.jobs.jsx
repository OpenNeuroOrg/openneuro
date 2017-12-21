// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import { stringify as querystring } from 'urlite/querystring'
import Actions from './dashboard.jobs.actions'
import JobsStore from './dashboard.jobs.store.js'
import { withRouter, Link } from 'react-router-dom'
import moment from 'moment'
import { PanelGroup } from 'react-bootstrap'
import Spinner from '../common/partials/spinner.jsx'
import ErrorBoundary from '../errors/errorBoundary.jsx'
import Sort from './dashboard.sort.jsx'
import Select from 'react-select'
import bids from '../utils/bids'
import { refluxConnect } from '../utils/reflux'

class Jobs extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, JobsStore, 'jobs')
  }

  // life cycle events --------------------------------------------------
  componentDidMount() {
    let isPublic = this.props.public
    let isAdmin = this.props.admin

    // React Router v4 compatible replacement for this.getQuery()
    const search = this.props.location.search
    const params = new URLSearchParams(search)
    const pipeline = params.get('pipeline')
    const selectedPipeline =
      (typeof pipeline !== 'undefined' && pipeline) || null
    Actions.update({ isPublic, isAdmin })
    // Admin views grab all jobs
    Actions.getJobs(isPublic, isAdmin, {
      pipeline: selectedPipeline,
      version: null,
    })
  }

  render() {
    let isPublic = this.state.jobs.isPublic
    let isAdmin = this.state.jobs.isAdmin
    let title = !isPublic ? 'My' : 'Public'
    title = isAdmin ? 'All' : title
    let jobs =
      this.state.jobs.visiblejobs.length === 0 ? (
        <div className="col-xs-12">
          <h3>no results please try again</h3>
        </div>
      ) : (
        this._jobs(this.state.jobs.visiblejobs)
      )
    return (
      <div>
        <div className="dashboard-dataset-teasers datasets datasets-private">
          <div className="header-filter-sort clearfix">
            <div className="header-wrap clearfix">
              <div className="row">
                <div className="col-md-5">
                  <h2>{title} Analyses</h2>
                </div>
                <div className="col-md-7">{this._filter()}</div>
              </div>
            </div>
            <div className="filters-sort-wrap clearfix">
              <Sort
                options={this.state.jobs.sortOptions}
                sort={this.state.jobs.sort}
                sortFunc={Actions.sort}
              />
            </div>
          </div>
          <ErrorBoundary
            message="The jobs server has failed to respond."
            className="loading-wrap fade-in">
            <PanelGroup>
              <div className="clearfix">
                {this.state.jobs.loading ? (
                  <Spinner active={true} timeout={20000} />
                ) : (
                  jobs
                )}
              </div>
            </PanelGroup>
          </ErrorBoundary>
        </div>
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _filter() {
    if (!this.state.jobs.appsLoading) {
      return (
        <div>
          <div
            className={
              this.state.jobs.filter.pipeline === '' ||
              this.state.jobs.filter.pipeline === null
                ? 'apps-filter col-md-8'
                : 'apps-filter col-md-8 app-selected'
            }>
            <Select
              simpleValue
              value={this.state.jobs.filter.pipeline}
              placeholder="Filter By App"
              options={this.state.jobs.apps}
              onChange={Actions.selectPipelineFilter}
            />
          </div>
          {this._selectVersions()}
        </div>
      )
    }
  }

  _selectVersions() {
    return (
      <div className="versions-filter col-md-4 fade-in">
        <Select
          multi
          simpleValue
          value={this.state.jobs.filter.version}
          placeholder={
            this.state.jobs.filter.pipeline === '' ||
            this.state.jobs.filter.pipeline === null
              ? 'Choose App to see Versions'
              : 'App Versions'
          }
          options={this.state.jobs.appVersionGroup}
          onChange={Actions.selectPipelineVersionFilter}
        />
      </div>
    )
  }

  _jobs(paginatedResults) {
    return paginatedResults.map(job => {
      let user =
        job.hasOwnProperty('userMetadata') &&
        job.userMetadata.hasOwnProperty('email')
          ? job.userMetadata.email
          : job.userId
      let dateAdded = moment(job.analysis.created).format('L')
      let timeago = moment(job.analysis.created).fromNow(true)
      const datasetId = bids.decodeId(job.datasetId)
      const snapshotId = bids.decodeId(job.snapshotId)
      const jobQuery = {
        app: job.appLabel,
        version: job.appVersion,
        job: job._id,
      }
      const queryString = querystring(jobQuery)
      const jobUrl =
        '/datasets/' + datasetId + '/versions/' + snapshotId + queryString
      return (
        <div className="fade-in  panel panel-default" key={job._id}>
          <div className="panel-heading">
            <div className={job.analysis.status}>
              <div className="header clearfix">
                <Link to={jobUrl}>
                  <h4 className="dataset-name">
                    {job.appLabel} - v{job.appVersion}
                  </h4>
                </Link>
                <div className="status-container">
                  <div className="pull-right">
                    Status: {job.analysis.status}
                  </div>
                </div>
              </div>
            </div>
            <div className="minimal-summary">
              <div className="summary-data">
                <span>
                  Job run
                  <strong>
                    {dateAdded} - {timeago} ago
                  </strong>
                </span>
              </div>
              <div className="summary-data">
                <span>
                  on dataset <strong>{job.datasetLabel}</strong>
                </span>
              </div>
              <div className="summary-data">
                <span>
                  {user ? 'by ' : ''}
                  <strong>{user}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }
}

Jobs.propTypes = {
  location: PropTypes.object,
  public: PropTypes.bool,
  admin: PropTypes.bool,
}

export default withRouter(Jobs)
