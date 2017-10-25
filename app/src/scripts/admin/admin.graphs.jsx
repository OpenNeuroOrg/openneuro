// dependencies ----------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import actions from './admin.actions.js'
import adminStore from './admin.store'
import { Link } from 'react-router'
import { Route } from 'react-router'
import Pie from './charts/admin.progression-pie.jsx'
import Scatter from './charts/admin.scatter-chart.jsx'

let Progresssion = React.createClass({
  mixins: [Reflux.connect(adminStore)],

  getInitialState() {
    let initialState = {
      month: 'all',
      year: 'all',
      value: 'failed',
    }

    return initialState
  },

  componentWillMount() {
    actions.filterLogs()
  },

  render() {
    let failures = this.state.failedLogs.length
    let successLogs = this.state.failedLogs
    // **** testing
    let successes = this.state.successLogs.length
    let total = this.state.uploadedLogs.length

    let activity = this.state.activityLogs

    return (
      <div className="dashboard-dataset-teasers fade-in">
        <div className="header-wrap clearfix">
          <div className="col-sm-9 chart">
            <h2>Current job sucession rate:</h2>
            <Pie failed={failures} success={successes} total={total} />
          </div>
          <div>
            <label>Please make a selection: </label>
            <form>
              <div>
                <select
                  value={this.state.month}
                  onChange={this._handleChangeMonth}>
                  <option value="">All</option>
                  {this._options('month')}
                </select>
                <select
                  value={this.state.year}
                  onChange={this._handleChangeYear}>
                  <option value="">All</option>
                  {this._options('year')}
                </select>
              </div>
            </form>
          </div>
          <Scatter
            logs={activity}
            month={this.state.month}
            year={this.state.year}
          />
        </div>
      </div>
    )
  },

  _handleChangeMonth(e) {
    this.setState({
      month: e.target.value,
    })
    console.log(this.state.month)
  },

  _handleChangeYear(e) {
    this.setState({
      year: e.target.value,
    })
    console.log(this.state.year)
  },

  _options(e) {
    let activity = this.state.activityLogs
    let options = []

    Object.entries(activity).map((index, value) => {
      let log = activity[value]
      if (!options.includes(log[e])) {
        options.push(<option value={log[e]}>{log[e]}</option>)
      }
    })

    return options
  },
})

export default Progresssion
