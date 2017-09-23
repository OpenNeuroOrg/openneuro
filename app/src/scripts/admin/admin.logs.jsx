// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import { Link } from 'react-router'
import Input from '../common/forms/input.jsx'
import adminStore from './admin.store'
import actions from './admin.actions'
import Paginator from '../common/partials/paginator.jsx'
import LogLink from './admin.logs.link.jsx'

let Logs = React.createClass({
  mixins: [Reflux.connect(adminStore)],

  // life cycle events --------------------------------------------------

  render() {
    let logs = []

    let eventLogs = this.state.eventLogs
    let filteredLogs = this.state.filteredLogs
    let results
    if (!eventLogs || eventLogs.length === 0) {
      let noEventLogs = 'There are no event logs.'
      results = <p className="no-datasets">{noEventLogs}</p>
    } else if (eventLogs.length && filteredLogs.length === 0) {
      let noMatchedLogs = 'There are no event logs matching your search.'
      results = <p className="no-datasets">{noMatchedLogs}</p>
    } else {
      var pagesTotal = Math.ceil(
        filteredLogs.length / this.state.resultsPerPage,
      )
      let paginatedResults = this._paginate(
        filteredLogs,
        this.state.resultsPerPage,
        this.state.page,
      )
      paginatedResults.map((log, index) => {
        const link = <LogLink log={log} />
        if (log.visible) {
          logs.push(
            <div className="fade-in user-panel-header clearfix" key={index}>
              <div className="col-xs-3 user-col">
                <label>{log.type}</label>
              </div>
              <div className="col-xs-3 user-col">
                <label>{log.user}</label>
              </div>
              <div className="col-xs-3 user-col">
                <label>{log.date}</label>
              </div>
              <div className="col-xs-3 user-col">
                <label>{link}</label>
              </div>
            </div>,
          )
        }
      })
      // map results
      results = logs
    }

    return (
      <div className="dashboard-dataset-teasers fade-in admin-users clearfix">
        <div className="header-wrap clearfix">
          <div className="col-sm-9">
            <h2>Events Log</h2>
          </div>
          <div className="col-sm-3">
            <Input
              className="pull-right"
              placeholder="Search Type or Email"
              onChange={this._searchLogs}
            />
          </div>
        </div>

        <div>
          <div className="col-xs-12 users-panel-wrap">
            <div className="fade-in user-panel-header clearfix">
              <div className="col-xs-3 user-col">
                <label>Event Type</label>
              </div>
              <div className="col-xs-3 user-col">
                <label>User</label>
              </div>
              <div className="col-xs-3 user-col">
                <label>Date</label>
              </div>
              <div className="col-xs-3 user-col">
                <label>Link</label>
              </div>
            </div>
            {results.length != 0 ? results : null}
          </div>
        </div>
        <div className="pager-wrapper">
          <Paginator
            page={this.state.page}
            pagesTotal={pagesTotal}
            pageRangeDisplayed={5}
            onPageSelect={this._onPageSelect}
          />
        </div>
      </div>
    )
  },

  _searchLogs(e) {
    actions.searchLogs(e.target.value)
  },

  _paginate(data, perPage, page) {
    if (data.length < 1) return null
    page ? page : this.state.page
    let start = page * perPage
    let end = start + perPage
    var retArr = data.slice(start, end)
    return retArr
  },

  _onPageSelect(page) {
    let pageNumber = Number(page)
    this.setState({ page: pageNumber })
  },
})

export default Logs
