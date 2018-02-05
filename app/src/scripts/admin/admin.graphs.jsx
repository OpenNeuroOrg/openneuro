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
    this.state = {
      year: '2018',
    }
  }

  componentDidMount() {
    if (!this.state.admin.eventLogs.length) {
      actions.getEventLogs()
      actions.filterLogs()
    }
  }

  render() {
    let months = [
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
    ]
    let year = this.state.year
    let activity = this.state.admin.activityLogs
    let failures = this.state.admin.activityLogs.FAILED[year].length
    let successes = 0

    this.state.admin.activityLogs.SUCCEEDED[year]
      ? (successes = this.state.admin.activityLogs.SUCCEEDED[year].length)
      : null

    let total = successes + failures
    return (
      <div className="dashboard-dataset-teasers fade-in">
        <div className="header-wrap clearfix chart-header">
          <h2>Progress for {this.state.year}:</h2>
          <div className="col-sm-9 chart">
            <div className="col-1">
              <Pie failed={failures} success={successes} total={total} />
            </div>
            <div className="col-2">
              <Scatter logs={activity} year={this.state.year} months={months} />
              <div>
                <Bar logs={activity} year={this.state.year} months={months} />
                <label>Choose another year:</label>
                {this._handleFiltering()}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleFiltering() {
    return (
      <div>
        <select
          className="year-dropdown"
          value={this.state.year}
          onChange={this._handleSelect.bind(this)}
          placeholder={'Select year...'}>
          {this._options()}
        </select>
      </div>
    )
  }

  _handleSelect(e) {
    this.setState({
      year: e.target.value,
    })
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
}
export default Progresssion
