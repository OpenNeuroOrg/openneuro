// dependencies ----------------------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import actions from './admin.actions.js'
import adminStore from './admin.store'
import { Link } from 'react-router'
import { Route } from 'react-router'
import Pie from './charts/admin.progression-pie.jsx'

import { VictoryPie } from 'victory'
import { VictoryScatter } from 'victory'
import { VictoryLabel } from 'victory'

let Progresssion = React.createClass({
  mixins: [Reflux.connect(adminStore)],

  componentWillMount() {
    actions.filterLogs()
  },

  render() {
    // failedLogs contains all failed jobs
    let failures = this.state.failedLogs.length
    // console.log(failures);
    // successLogs contains all successful jobs
    let successes = this.state.successLogs.length
    //  uploadedLogs contains all logs that have been completed
    let total = this.state.uploadedLogs.length

    return (
      <div className="dashboard-dataset-teasers fade-in">
        <div className="header-wrap clearfix">
          <div className="col-sm-9 chart">
            <h2>Current job sucession rate:</h2>
            <Pie failed={failures} success={successes} total={total} />
          </div>
        </div>
      </div>
    )
  },
})

export default Progresssion
