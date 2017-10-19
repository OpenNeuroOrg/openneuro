// dependencies ----------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import actions from './admin.actions.js'
import adminStore from './admin.store'
import { Link } from 'react-router'
import { Route } from 'react-router'
import Chart from './charts/admin.progression-chart.jsx'

import { VictoryPie } from 'victory'
import { VictoryScatter } from 'victory'
import { VictoryLabel } from 'victory'

let Progresssion = React.createClass({
  mixins: [Reflux.connect(adminStore)],

  getInitialState() {
    let initialState = {
      value: 'failed',
      failed: 90,
      success: 60,
    }

    return initialState
  },

  // Life Cycle ----------------------------------------------------------------------

  componentWillMount() {
    // filterLogs() takes all of the logs from the eventLogs[] and filters the logs into their own arrays depending on the status of the job. failedLogs, successLogs, uploadingLogs. I was hoping to gather successes, failures, and currently uploading jobs. "Pop!" signifies the function has run.
    actions.filterLogs()

    // At this state the failedLogs[] is empty are veiwable within the console
    console.log('the failedLogs[] length: ' + this.state.failedLogs.length)

    // Was attempting to set the state equal to the lenght of those logs
    console.log(
      'The filtered logs length is: ' + this.state.filteredLogs.length,
    )
  },

  componentDidMount() {
    console.log(
      'this is the length of failedLogs[] AFTER the render method: ' +
        this.state.failedLogs.length,
    )
  },

  render() {
    // Ignore the select menu.
    return (
      <div className="dashboard-dataset-teasers fade-in">
        <div className="header-wrap clearfix">
          <div className="col-sm-9">
            <div>
              <label>Please make a selection: </label>
              <form>
                <div>
                  <select value={this.state.value} onChange={this.handleChange}>
                    <option value="failed">Failed</option>
                    <option value="success">Successful</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
          <Chart failed={this.state.failed} success={this.state.success} />
        </div>
      </div>
    )
  },

  handleChange(e) {
    this.setState({
      value: e.target.value,
    })
  },
})

export default Progresssion
