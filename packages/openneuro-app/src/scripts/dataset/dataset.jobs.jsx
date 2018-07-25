// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import datasetStore from './dataset.store'
import actions from './dataset.actions'
import Spinner from '../common/partials/spinner.jsx'
import Timeout from '../common/partials/timeout.jsx'
import Run from './run'
import { Accordion, Panel } from 'react-bootstrap'
import { refluxConnect } from '../utils/reflux'

class Jobs extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
    this.state = {
      acknowledgements: '',
      support: '',
      summary: '',
      label: '',
    }
  }

  // life cycle events --------------------------------------------------

  render() {
    let version

    if (!this.state.datasets.dataset.snapshot_version) {
      return false
    }

    let appTree = []
    if (!this.state.datasets.loadingApps) {
      appTree = this.state.datasets.jobs.map(app => {
        version = app.versions.map(version => {
          let appDef = this.state.datasets.apps[app.label][version.label]
          let bidsAppVersion = appDef.containerProperties.environment.filter(
            tuple => {
              return tuple.name === 'BIDS_CONTAINER'
            },
          )[0].value
          let compositeVersion = bidsAppVersion + ' - #' + version.label
          return (
            <Panel
              className="jobs"
              header={compositeVersion}
              key={version.label}
              eventKey={version.label}>
              {this._runs(version, appDef.descriptions)}
            </Panel>
          )
        })

        return (
          <Panel
            className="jobs"
            header={app.label}
            key={app.label}
            eventKey={app.label}>
            <Accordion
              accordion
              className="jobs-wrap"
              activeKey={this.state.datasets.activeJob.version}
              onSelect={actions.selectJob.bind(null, 'version')}>
              {version}
            </Accordion>
          </Panel>
        )
      })
    }

    let header = <h3 className="metaheader">Analyses</h3>
    return (
      <div className="analyses">
        {appTree.length === 0 ? null : header}
        <Accordion
          accordion
          className="jobs-wrap"
          activeKey={this.state.datasets.activeJob.app}
          onSelect={actions.selectJob.bind(null, 'app')}>
          {this.state.datasets.loadingJobs ||
          this.state.datasets.loadingApps ? (
            <Timeout timeout={20000}>
              <Spinner active={true} text="Loading Analyses" />
            </Timeout>
          ) : (
            appTree
          )}
        </Accordion>
      </div>
    )
  }

  // templates methods --------------------------------------------------

  _runs(job, descriptions) {
    const { acknowledgements, support } = descriptions
    const runs = job.runs.map(run => {
      return (
        <Run
          run={run}
          key={run._id}
          toggleFolder={actions.toggleResultFolder}
          displayFile={actions.displayFile}
          currentUser={this.state.datasets.currentUser}
          acknowledgements={acknowledgements}
          support={support}
        />
      )
    })

    return runs
  }
}

export default Jobs
