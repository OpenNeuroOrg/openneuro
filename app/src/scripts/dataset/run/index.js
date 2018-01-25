/* eslint-disable react/no-danger */
// dependencies ------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import actions from '../dataset.actions'
import WarnButton from '../../common/forms/warn-button.jsx'
import moment from 'moment'
import Results from './results.jsx'
import { Accordion, Panel } from 'react-bootstrap'
import markdown from '../../utils/markdown'

class JobAccordion extends React.Component {
  // life cycle methods ------------------------------------------------------------
  constructor(props) {
    super(props)
    this.state = { cancelingJob: false }
  }

  render() {
    let run = this.props.run
    return (
      <Panel
        eventKey={run._id}
        className={run.active ? 'job border-flash' : 'job'}
        header={this._header(run)}>
        <span className="inner">
          {this._support(run)}
          {this._parameters(run)}
          <Results
            run={run}
            acknowledgements={this.props.acknowledgements}
            displayFile={this.props.displayFile}
            toggleFolder={this.props.toggleFolder}
          />
          {this._logs(run)}
          {this._batchStatus(run)}
        </span>
      </Panel>
    )
  }

  // template methods --------------------------------------------------------------

  _header(run) {
    let runBy = run.userId ? (
      <span>
        <br />
        <label>By </label>
        <strong>
          {run.hasOwnProperty('userMetadata') &&
          run.userMetadata.hasOwnProperty('email')
            ? run.userMetadata.email
            : run.userId}
        </strong>
      </span>
    ) : null
    let userCanCancel =
      this.props.currentUser && this.props.currentUser.scitran
        ? this.props.currentUser.scitran.root ||
          this.props.currentUser.scitran._id === run.userId
        : false
    return (
      <div
        className={
          run && run.analysis ? run.analysis.status.toLowerCase() : 'pending'
        }>
        <label>Status</label>
        <span className="badge">{this._status(run.analysis.status)}</span>
        {userCanCancel &&
        ((run.analysis.status === 'PENDING' ||
          run.analysis.status === 'RUNNING') &&
          !this.state.cancelingJob) ? (
          <button
            className="cancel-job"
            onClick={this._cancelJob.bind(this, run)}>
            CANCEL
          </button>
        ) : null}
        <br />
        <span className="meta">
          <label>Run on </label>
          <strong>{moment(run.analysis.created).format('L')}</strong> at{' '}
          <strong>{moment(run.analysis.created).format('LT')}</strong>
          {runBy}
        </span>
        <br />
        <span className="meta">
          <label>Job ID</label>
          <strong>{run.analysis.analysisId}</strong>
        </span>
        {this._failedMessage(run)}
        {this._canceledMesssage(run)}
      </div>
    )
  }

  _parameters(run) {
    if (run.parameters && Object.keys(run.parameters).length > 0) {
      let parameters = []
      for (let key in run.parameters) {
        if (key === 'participant_label') {
          run.parameters[key] = run.parameters[key].sort((a, b) => {
            return a - b
          })
        }
        // Values can be strings or arrays
        let value

        if (run.parameters[key].constructor === Array) {
          value = run.parameters[key].join(' ')
        } else if (run.parameters[key] === '') {
          value =
            run.parameters[key].constructor === Boolean ? 'false' : 'unset'
        } else {
          value = run.parameters[key].toString()
        }

        parameters.push(
          <li key={key}>
            <span className="key">{key}</span>:{' '}
            <span className="value">{value}</span>
          </li>,
        )
      }

      return (
        <Accordion accordion className="results">
          <Panel
            className="fade-in"
            header="Parameters"
            key={run._id}
            eventKey={run._id}>
            <ul>{parameters}</ul>
          </Panel>
        </Accordion>
      )
    }
  }

  _status(status) {
    if (
      status === 'SUCCEEDED' ||
      status === 'FAILED' ||
      status === 'REJECTED' ||
      status == 'CANCELED'
    ) {
      return status
    } else {
      return (
        <div className="ellipsis-animation">
          {this.state.cancelingJob ? 'CANCELING' : status}
          <span className="one">.</span>
          <span className="two">.</span>
          <span className="three">.</span>
        </div>
      )
    }
  }

  _failedMessage(run) {
    let userCanChange =
      this.props.currentUser && this.props.currentUser.scitran
        ? this.props.currentUser.scitran.root ||
          this.props.currentUser.scitran._id === run.userId
        : false

    if (
      run.analysis.status === 'FAILED' ||
      run.analysis.status === 'REJECTED'
    ) {
      let adminMessage = (
        <span>
          Support information for this app is available below. Please contact
          the site{' '}
          <a
            href="mailto:openfmri@gmail.com?subject=Analysis%20Failure"
            target="_blank"
            rel="noopener noreferrer">
            administrator
          </a>{' '}
          if this analysis continues to fail.
        </span>
      )
      let message = run.analysis.message
        ? run.analysis.message
        : 'We were unable to complete this analysis.'
      return (
        <div>
          <h5 className="text-danger">
            {message} {adminMessage}
          </h5>
          {userCanChange ? (
            <WarnButton
              icon="fa fa-repeat"
              message="re-run"
              warn={false}
              action={actions.retryJob.bind(this, run._id)}
            />
          ) : null}
          {userCanChange ? (
            <span className="btn-small">
              <WarnButton
                icon="fa fa-trash-o"
                message="Delete"
                warn={true}
                action={actions.deleteJob.bind(this, run._id)}
              />
            </span>
          ) : null}
        </div>
      )
    }
  }

  _support(run) {
    if (
      run.analysis.status === 'FAILED' ||
      run.analysis.status === 'REJECTED'
    ) {
      return (
        <Accordion accordion className="results">
          <Panel
            className="fade-in"
            header="Support"
            key={run._id}
            eventKey={run._id}>
            <div className="app-support">
              <div
                className="markdown"
                dangerouslySetInnerHTML={markdown.format(this.props.support)}
              />
            </div>
          </Panel>
        </Accordion>
      )
    }
  }

  _canceledMesssage(run) {
    if (run.analysis.status === 'CANCELED') {
      let message =
        'This job has been canceled and will be deleted from jobs dashboard.'
      return (
        <div>
          <h5 className="text-danger">{message}</h5>
        </div>
      )
    }
  }

  _cancelJob(run) {
    if (confirm('Canceling this job will delete the job. Cancel Job?')) {
      this.setState({
        cancelingJob: true,
      })
      actions.cancelJob(run)
    }
  }

  _logs(run) {
    let logstreams = []
    if (
      run.analysis.hasOwnProperty('logstreams') &&
      run.analysis.logstreams.length > 0
    ) {
      // Group streams by analysis level. If no analysis levels exist (legacy logs) group as "logs"
      let groupedStreams = run.analysis.logstreams.reduce((acc, logstream) => {
        let analysisLevel
        if (logstream.environment) {
          analysisLevel = logstream.environment.filter(env => {
            return env.name === 'BIDS_ANALYSIS_LEVEL'
          })[0].value
        } else {
          analysisLevel = 'logs'
        }

        if (!acc[analysisLevel]) {
          acc[analysisLevel] = []
        }
        acc[analysisLevel].push(logstream)
        return acc
      }, {})
      //Generate logstreams jsx grouped by analysis level. How do we want to use exit code?
      Object.keys(groupedStreams).forEach(level => {
        let streams = groupedStreams[level].map((logstream, index) => {
          let label, exitCode
          if (logstream.environment) {
            let bidsArgs = logstream.environment.filter(env => {
              return env.name === 'BIDS_ARGUMENTS'
            })[0].value
            label = bidsArgs
          } else {
            label = 'Log #' + (index + 1)
          }

          if (typeof logstream.exitCode === 'number') {
            exitCode = logstream.exitCode
          }
          let exitCodeClass = 'exit-code ' + (exitCode ? 'fail' : '') // 0 is passing
          let exitCodeStatus

          if (exitCode === 0) {
            exitCodeStatus = (
              <span className="label label-success">SUCCESS</span>
            )
          } else {
            exitCodeStatus = (
              <span>
                <span className="label label-danger">FAIL</span> Exit code
                {exitCode}
              </span>
            )
          }

          return (
            <span className="job-log" key={label}>
              <WarnButton
                icon="fa-eye"
                message={label}
                warn={false}
                action={actions.getLogstream.bind(this, logstream.name)}
              />
              {exitCode != undefined ? (
                <span className={exitCodeClass}>{exitCodeStatus}</span>
              ) : null}
            </span>
          )
        })
        logstreams.push(
          <span key={level}>
            {level.toUpperCase()}
            {streams}
          </span>,
        )
      })
      return (
        <Accordion accordion className="results">
          <Panel
            className="fade-in"
            header="Logs"
            key={run._id}
            eventKey={run._id}>
            <span className="download-all">
              <WarnButton
                icon="fa-download"
                message=" DOWNLOAD All LOGS"
                prepDownload={actions.downloadLogs.bind(this, run._id)}
              />
            </span>
            <div className="file-structure fade-in panel-group">
              <div className="panel panel-default">
                <div className="panel-collapse" aria-expanded="false">
                  {logstreams}
                </div>
              </div>
            </div>
          </Panel>
        </Accordion>
      )
    }
  }

  _batchStatus(run) {
    let batchStatus = run.analysis.batchStatus
    if (batchStatus && batchStatus.length) {
      const failed = run.analysis.batchStatus.filter(
        status => status.status !== 'SUCCEEDED',
      )
      if (failed.length === 0) {
        return null
      }
      batchStatus = batchStatus.map(status => {
        return (
          <div className="job-status col-xs-12" key={status.job}>
            <div>
              <div className="col-xs-8">{status.job}</div>
              <div className="col-xs-4">{status.status}</div>
            </div>
            <div key={status.statusReason}>
              <strong className="col-xs-12">
                {'statusReason' in status ? status.statusReason : ''}
              </strong>
            </div>
          </div>
        )
      })

      return (
        <Accordion accordion className="results">
          <Panel
            className="fade-in"
            header="Jobs Status"
            key={run._id}
            eventKey={run._id}>
            <ul>
              <div className=" job-status col-xs-12" key={run._id}>
                <div className="col-xs-8">Job Id</div>
                <div className="col-xs-4">Status</div>
              </div>
              {batchStatus}
            </ul>
          </Panel>
        </Accordion>
      )
    }

    return null
  }
}

JobAccordion.propTypes = {
  run: PropTypes.object,
  displayFile: PropTypes.func,
  toggleFolder: PropTypes.func,
  acknowledgements: PropTypes.string,
  support: PropTypes.string,
  currentUser: PropTypes.object,
}

export default JobAccordion
