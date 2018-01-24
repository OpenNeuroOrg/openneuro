// dependencies ----------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import adminStore from './admin.store'
import actions from './admin.actions.js'
import { Link } from 'react-router'
import { Route } from 'react-router'
import Pie from './charts/admin.progression-pie.jsx'
import Scatter from './charts/admin.scatter-chart.jsx'
import { refluxConnect } from '../utils/reflux'

class Progresssion extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, adminStore, 'admin')
    this.state = {
      month: 'all',
      year: 'all',
      value: 'failed',
    }
  }

  componentDidMount() {
    if (!this.state.admin.eventLogs.length) {
      actions.getEventLogs()
      actions.filterLogs()
    }
  }

  render() {
    let failures = this.state.admin.failedLogs.length
    let successes = this.state.admin.successLogs.length
    let total = this.state.admin.uploadedLogs.length
    let activity = this.state.admin.activityLogs
    return (
      <div className="dashboard-dataset-teasers fade-in">
        <div className="header-wrap clearfix chart-header">
          {this._handleFiltering()}
          <h2>Job Sucess Rate:</h2>
          <div className="col-sm-9 chart">
            <div className="col-1">
              <Pie failed={failures} success={successes} total={total} />
            </div>
            <div className="col-2">
              <Scatter
                logs={activity}
                month={this.state.month}
                year={this.state.year}
                jobs={this._showJobs.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleFiltering() {
    return (
      <div>
        <label>Please make a selection: </label>
        <form>
          {/* <div>
            <select
              value={this.state.month}
              onChange={this._handleChangeMonth.bind(this)}>
              <option value="">All</option>
              {this._options('month')}
            </select>
          </div> */}
          <select
            className="year-dropdown"
            value={this.state.year}
            onChange={this._handleChangeYear.bind(this)}>
            <option value="">All</option>
            {this._options('year')}
          </select>
        </form>
      </div>
    )
  }

  _handleChangeMonth(e) {
    this.setState({
      month: e.target.value,
    })
  }

  _handleChangeYear(e) {
    this.setState({
      year: e.target.value,
    })
  }

  _options(key) {
    let activity = this.state.admin.activityLogs
    let options = []

    Object.keys(activity).map(x => {
      let date = x.split('_')
      let month = date[0]
      let year = date[1]
      if (key === 'year' && !options.includes(year)) {
        options.push(
          <option key={year[year]} value={year}>
            {year}
          </option>,
        )
      } else {
        options.push(
          <option key={month[month]} value={month}>
            {month}
          </option>,
        )
      }
    })
    return options
  }

  _showJobs(e) {
    console.log(e)
    console.log('POP')
    // this.setState({month: month})
    // and then render activity log from that month
    // also needs to change progression pie
  }
}

export default Progresssion
