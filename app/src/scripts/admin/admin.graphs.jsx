// dependencies ----------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import adminStore from './admin.store'
import actions from './admin.actions.js'
import Pie from './charts/admin.progression-pie.jsx'
import Scatter from './charts/admin.scatter-chart.jsx'
import Bar from './charts/admin.bar.jsx'

import { refluxConnect } from '../utils/reflux'

class Progresssion extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, adminStore, 'admin')
    const initialState = {
      year: '2018',
      entries: {
        failed: [],
        succeeded: [],
      },
      key: '',
      index: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
    }

    this.initialState = initialState
    this.state = initialState
  }

  render() {
    if (!this.state.admin.eventLogs.length) {
      actions.getEventLogs()
      actions.filterLogs()
      return null
    } else {
      this._filterData(this.state.year)
      return (
        <div className="dashboard-dataset-teasers fade-in">
          <div className="header-wrap clearfix chart-header">
            <div className="col-sm-9 chart">
              <div className="col-1">{this._returnPie()}</div>
              <div className="col-2">
                <div className="filtering">
                  <label>Choose another year: </label>
                  {this._handleFiltering()}
                </div>
                <div>
                  {this._returnScatter()}
                  {this._returnBar()}
                </div>
                <div>
                  <span className="key">
                    <i className="fa fa-circle success" /> - Successful Jobs
                  </span>
                  <span className="key">
                    <i className="fa fa-circle failed" /> - Failed Jobs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  // template methods --------------------------------------------------------------------------------

  _returnPie() {
    let activity = this.state.admin.activityLogs
    let year = this.state.year
    let failures
    let successes

    activity.failed[year]
      ? (failures = activity.failed[year].length)
      : (failures = 0)
    activity.succeeded[year]
      ? (successes = activity.succeeded[year].length)
      : (successes = 0)
    let total = successes + failures
    return (
      <Pie
        failed={failures}
        success={successes}
        total={total}
        year={this.state.year}
      />
    )
  }

  _returnScatter() {
    return (
      <Scatter
        logs={this.state.admin.activityLogs}
        year={this.state.year}
        months={this.state.months}
        index={this.state.index}
        entries={this.state.entries}
      />
    )
  }

  _returnBar() {
    return (
      <Bar
        logs={this.state.admin.activityLogs}
        year={this.state.year}
        months={this.state.months}
        index={this.state.index}
        entries={this.state.entries}
      />
    )
  }

  _handleFiltering() {
    return (
      <select
        className="year-dropdown"
        value={this.state.year}
        onChange={this._handleSelect.bind(this)}
        placeholder={'Select year...'}>
        {this._options()}
      </select>
    )
  }

  _options() {
    let years = this.state.admin.yearOptions
    let options = []
    for (let year of years) {
      let opt = (
        <option key={year} value={year}>
          {year}
        </option>
      )
      options.push(opt)
    }
    return options
  }

  // custom methods --------------------------------------------------------------------------------

  _handleSelect(e) {
    this._filterData(e.target.value)
    this.setState({
      year: e.target.value,
    })
  }

  _filterData(year) {
    let entries = this.state.entries
    let logs = this.state.admin.activityLogs
    let date

    // empty arrays before loop
    entries.failed = []
    entries.succeeded = []

    Object.keys(logs).map(type => {
      if (logs[type][year]) {
        Object.values(logs[type][year]).map(job => {
          let dateArr = job.dateTime.split(' ')
          let status = job.log.data.job.status.toLowerCase()
          date = dateArr[1]
          if (!entries[status][date]) {
            entries[status] = []
            entries[status][date] = []
            entries[status][date].push({ date: job.dateTime, status: status })
          } else {
            entries[status][date].push({ date: job.dateTime, status: status })
          }
        })
      }
    })
  }
}
export default Progresssion
