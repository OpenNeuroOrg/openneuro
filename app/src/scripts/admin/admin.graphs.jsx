// dependencies ----------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import adminStore from './admin.store'
import actions from './admin.actions.js'
import Spinner from '../common/partials/spinner.jsx'
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
    if (this.state.admin.loadingFilters) {
      return <Spinner active={true} />
    } else {
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
                {this._returnStats()}
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

  _returnStats() {
    let failed = []
    let succeeded = []
    let entries = this.state.admin.monthLogs
    let year = this.state.year

    Object.keys(entries).map(status => {
      let counter = 0
      for (let month of this.state.months) {
        counter++
        if (entries[status][year]) {
          if (entries[status][year][month]) {
            if (status === 'failed') {
              failed.push({
                x: counter,
                y: entries[status][year][month].length,
              })
            } else if (status === 'succeeded') {
              succeeded.push({
                x: counter,
                y: entries[status][year][month].length,
              })
            }
          }
        }
      }
    })

    return (
      <div>
        <Scatter
          months={this.state.months}
          index={this.state.index}
          failed={failed}
          succeeded={succeeded}
        />
        <Bar
          months={this.state.months}
          index={this.state.index}
          failed={failed}
          succeeded={succeeded}
        />
      </div>
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
    this.setState({
      year: e.target.value,
    })
  }
}
export default Progresssion
