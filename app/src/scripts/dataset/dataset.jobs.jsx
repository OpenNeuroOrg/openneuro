// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import datasetStore from './dataset.store'
import actions from './dataset.actions'
import Spinner from '../common/partials/spinner.jsx'
import Timeout from '../common/partials/timeout.jsx'
import Wrapper from '../common/partials/wrapper.jsx'
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

    if (!this.state.datasets.dataset.original) {
      return false
    }

    let app = this.state.datasets.jobs.map(app => {
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
            <Wrapper>
              <div className="wrapper">
                {this._runs(version, appDef.descriptions)}
              </div>
            </Wrapper>
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

    let header = <h3 className="metaheader">Analyses</h3>
    return (
      <div className="analyses">
        {app.length === 0 ? null : header}
        <Accordion
          accordion
          className="jobs-wrap"
          activeKey={this.state.datasets.activeJob.app}
          onSelect={actions.selectJob.bind(null, 'app')}>
          {this.state.datasets.loadingJobs ? (
            <Timeout timeout={20000}>
              <Spinner active={true} text="Loading Analyses" />
            </Timeout>
          ) : (
            app
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
