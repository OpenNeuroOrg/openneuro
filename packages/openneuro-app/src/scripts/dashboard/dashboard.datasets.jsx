// dependencies ------------------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Reflux from 'reflux'
import Actions from './dashboard.datasets.actions.js'
import DatasetsStore from './dashboard.datasets.store.js'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { PanelGroup, Panel } from 'react-bootstrap'
import Helmet from 'react-helmet'
import Paginator from '../common/partials/paginator.jsx'
import Spinner from '../common/partials/spinner.jsx'
import Timeout from '../common/partials/timeout.jsx'
import ErrorBoundary from '../errors/errorBoundary.jsx'
import Statuses from '../dataset/dataset.statuses.jsx'
import Metrics from '../dataset/dataset.metrics.jsx'
import Filters from './dashboard.filters.jsx'
import Sort from './dashboard.sort.jsx'
import Summary from '../dataset/dataset.summary.jsx'
import Search from '../common/partials/search.jsx'

import { refluxConnect } from '../utils/reflux'
import { pageTitle } from '../resources/strings'

// component setup ---------------------------------------------------------------------------

class Datasets extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, DatasetsStore, 'datasets')
  }

  // life cycle events -------------------------------------------------------------------------

  componentWillUnmount() {
    super.componentWillUnmount()
    Actions.update({ datasets: [], page: 0 })
  }

  componentDidMount() {
    const isPublic = this.props.public
    const isAdmin = this.props.admin
    Actions.update({ isPublic, isAdmin })
    Actions.getDatasets(isPublic, isAdmin)
  }

  componentWillReceiveProps() {
    const isPublic = this.props.public
    const isAdmin = this.props.admin
    Actions.update({ isPublic, isAdmin })
    Actions.getDatasets(isPublic, isAdmin)
  }

  render() {
    let datasets = this.state.datasets.datasets
    let visibleDatasets = this.state.datasets.visibleDatasets
    let isPublic = this.state.datasets.isPublic
    let isAdmin = this.state.datasets.isAdmin
    let results
    if (datasets.length === 0 && isPublic) {
      let noDatasets = 'There are no public datasets.'
      results = <p className="no-datasets">{noDatasets}</p>
    } else if (datasets.length === 0) {
      let noDatasets = "You don't have any datasets."
      results = <p className="no-datasets">{noDatasets}</p>
    } else if (visibleDatasets.length === 0) {
      let noDatasets =
        "You don't have any datasets that match the selected filters."
      results = <p className="no-datasets">{noDatasets}</p>
    } else {
      var pagesTotal = Math.ceil(
        visibleDatasets.length / this.state.datasets.resultsPerPage,
      )
      let paginatedResults = this._paginate(
        visibleDatasets,
        this.state.datasets.resultsPerPage,
        this.state.datasets.page,
      )

      // map results
      results = this._datasets(paginatedResults, isPublic)
    }

    let title
    if (isAdmin) {
      title = 'All Datasets'
    } else if (isPublic) {
      title = 'Public Datasets'
    } else {
      title = 'My Datasets'
    }

    let datasetsDash = (
      <div>
        <div className="dashboard-dataset-teasers datasets datasets-private">
          <div className="header-filter-sort clearfix">
            <Helmet>
              <title>
                {pageTitle} - {title}
              </title>
            </Helmet>
            <div className="admin header-wrap clearfix">
              <div className="row">
                <div className="col-md-5">
                  <h2>{title}</h2>
                </div>
                <div className="col-md-7">
                  <Search />
                </div>
              </div>
            </div>
            <div className="filters-sort-wrap clearfix">
              <Sort
                options={this.state.datasets.sortOptions}
                sort={this.state.datasets.sort}
                sortFunc={Actions.sort}
              />
              {!isPublic ? (
                <Filters filters={this.state.datasets.filters} />
              ) : null}
            </div>
          </div>
          <ErrorBoundary
            message="The dataset server failed to respond."
            className="loading-wrap fade-in">
            <PanelGroup>
              <Panel>
                {this.state.datasets.loading ? (
                  <Timeout timeout={20000}>
                    <Spinner active={true} />
                  </Timeout>
                ) : (
                  results
                )}
              </Panel>
            </PanelGroup>
          </ErrorBoundary>
        </div>
        <div className="pager-wrapper">
          <Paginator
            page={this.state.datasets.page}
            pagesTotal={pagesTotal}
            pageRangeDisplayed={5}
            onPageSelect={this._onPageSelect.bind(this)}
          />
        </div>
      </div>
    )
    let datasetsDashPublic = (
      <div className="fade-in clearfix">{datasetsDash}</div>
    )

    return <span>{!isPublic ? datasetsDash : datasetsDashPublic}</span>
  }

  // template methods --------------------------------------------------------------------------

  _datasets(paginatedResults, isPublic) {
    return paginatedResults.map(dataset => {
      let user = dataset.user
      let fullname = user ? user.firstname + ' ' + user.lastname : ''
      let dateAdded = moment(dataset.created).format('L')
      let timeago = moment(dataset.created).fromNow(true)
      let metricContainer = (
        <div className="metric-container">
          <Metrics dataset={dataset} fromDashboard />
        </div>
      )
      let statusContainer = (
        <div className="status-container">
          <Statuses dataset={dataset} minimal={true} />
        </div>
      )
      let linkProps = this._linkTo(dataset)
      return (
        <div className="fade-in  panel panel-default" key={dataset._id}>
          <div className="panel-heading">
            <div className="header clearfix">
              <Link {...linkProps}>
                <h4 className="dataset-name">{dataset.label}</h4>
                <div className="meta-container">
                  <p className="date">
                    uploaded {user ? 'by ' : ''}
                    <span className="name">{fullname}</span> on{' '}
                    <span className="time-ago">
                      {dateAdded} - {timeago} ago
                    </span>
                  </p>
                </div>
              </Link>
              {metricContainer}
              {!isPublic ? statusContainer : null}
            </div>
            <Summary summary={dataset.summary} minimal={true} />
          </div>
        </div>
      )
    })
  }

  _linkTo(dataset) {
    const isSnapshot = dataset.hasOwnProperty('original')
    if (isSnapshot) {
      return {
        to: '/datasets/' + dataset.linkOriginal + '/versions/' + dataset.linkID,
      }
    } else {
      return {
        to: '/datasets/' + dataset.linkID,
      }
    }
  }

  // custom methods ----------------------------------------------------------------------------

  _paginate(data, perPage, page) {
    if (data.length < 1) return null
    page ? page : this.state.datasets.page
    let start = page * perPage
    let end = start + perPage
    var retArr = data.slice(start, end)
    return retArr
  }

  _onPageSelect(page) {
    const pageNumber = Number(page)
    Actions.update({ page: pageNumber })
  }

  _sort(value, direction) {
    Actions.sort(value, direction)
  }
}

Datasets.propTypes = {
  public: PropTypes.bool,
  admin: PropTypes.bool,
}

export default Datasets
