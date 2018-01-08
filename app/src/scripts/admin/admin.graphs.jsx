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
          <div>
            <select
              value={this.state.month}
              onChange={this._handleChangeMonth.bind(this)}>
              <option value="">All</option>
              {this._options('month')}
            </select>
          </div>
          <select
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

  _options(e) {
    let activity = this.state.admin.activityLogs
    let options = []

    Object.entries(activity).map((index, value) => {
      let log = activity[value]
      if (!options.includes(log[e])) {
        options.push(
          <option key={e} value={log[e]}>
            {log[e]}
          </option>,
        )
      }
    })

    return options
  }
}

export default Progresssion
