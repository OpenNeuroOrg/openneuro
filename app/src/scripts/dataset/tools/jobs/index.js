/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import actions from '../../dataset.actions.js'
import datasetStore from '../../dataset.store.js'
import Spinner from '../../../common/partials/spinner.jsx'
import moment from 'moment'
import Results from '../../../upload/upload.validation-results.jsx'
import Description from './description.jsx'
import Parameters from './parameters.jsx'
import Timeout from '../../../common/partials/timeout.jsx'
import ErrorBoundary from '../../../errors/errorBoundary.jsx'
import batch from '../../../utils/batch'
import { refluxConnect } from '../../../utils/reflux'

class JobMenu extends Reflux.Component {
  // life cycle events --------------------------------------------------

  constructor() {
    super()
    refluxConnect(this, datasetStore, 'datasets')
    this.state = {
      loading: false,
      parameters: {},
      parametersMetadata: {},
      inputFileParameters: {},
      disabledApps: {},
      jobId: null,
      selectedApp: [],
      selectedVersion: {},
      selectedVersionID: '',
      selectedAppKey: '',
      selectedSnapshot: '',
      message: null,
      error: false,
      subjects: [],
      appGroup: {},
      submitActive: false,
      requiredParameters: {},
    }
  }

  componentWillReceiveProps() {
    let datasets = this.state.datasets
    let dataset = datasets ? datasets.dataset : null
    let summary = dataset ? dataset.summary : null
    let snapshots = datasets ? datasets.snapshots : null

    if (dataset) {
      // initialize subjects into state
      if (this.state.subjects.length === 0 && summary) {
        let subjects = []
        for (let subject of summary.subjects) {
          subjects.push({ label: 'sub-' + subject, value: subject })
        }
        subjects.reverse()
        this.setState({ subjects })
      }

      // pre-select snapshots
      if (!this.state.selectedSnapshot) {
        for (const snapshotIndex in snapshots) {
          const snapshot = snapshots[snapshotIndex]
          if (snapshot._id === dataset._id) {
            if (snapshot.original) {
              this._selectSnapshot({ target: { value: snapshot._id } })
            } else if (snapshots.length > 1) {
              this._selectSnapshot({
                target: { value: snapshots[1]._id },
              })
            }
          }
        }
      }
    }
  }

  render() {
    let datasets = this.state.datasets
    let apps = datasets.apps
    let selectedAppKey = this.state.selectedAppKey
    let selectedVersionID = this.state.selectedVersionID
    let loading = datasets && datasets.loading
    let loadingText = datasets.loadingApps
      ? 'Loading pipelines'
      : 'Starting ' + selectedVersionID

    let returnLink = null
    if (this.state.datasets.datasetUrl) {
      returnLink = (
        <Link to={this.state.datasets.datasetUrl}>
          <button className="btn-reset">Back</button>
        </Link>
      )
    }

    let form = (
      <div className=" analysis-modal dataset-form-body col-xs-12">
        <div className="dataset-form-content col-xs-12">
          {this._snapshots()}
          {this._apps()}
          {selectedAppKey && selectedVersionID ? (
            <div>
              <Description
                jobDefinition={apps[selectedAppKey][selectedVersionID]}
              />
              <Parameters
                parameters={this.state.parameters}
                parametersMetadata={this.state.parametersMetadata}
                subjects={this.state.subjects}
                onChange={this._updateParameter.bind(this)}
                onRestoreDefaults={this._restoreDefaultParameters.bind(this)}
              />
              <span className="submit-warning">{this.state.submitWarning}</span>
            </div>
          ) : (
            ''
          )}
          {this._submit()}
        </div>
      </div>
    )

    let message = (
      <div>
        <div className={this.state.error ? 'alert alert-danger' : null}>
          {this.state.error ? <h4 className="danger">Error</h4> : null}
          <h5>{this.state.message}</h5>
        </div>
        {returnLink}
      </div>
    )

    let body
    if (this.state.loading || datasets.loadingApps) {
      body = <Spinner active={true} text={loadingText} />
    } else if (this.state.message) {
      body = message
    } else {
      body = form
    }

    let content = (
      <div className="dataset-form">
        <div className="col-xs-12 dataset-form-header">
          <div className="form-group">
            <label>Run Analysis</label>
          </div>
          <hr className="modal-inner" />
          {body}
        </div>
      </div>
    )

    return (
      <ErrorBoundary
        message="The dataset has failed to load in time. Please check your network connection."
        className="col-xs-12 dataset-inner dataset-route dataset-wrap inner-route light text-center">
        {loading ? (
          <Timeout timeout={20000}>
            <Spinner active={true} text={loadingText} />
          </Timeout>
        ) : (
          content
        )}
      </ErrorBoundary>
    )
  }

  // template methods ---------------------------------------------------

  /**
   * Apps
   *
   * Returns a label and select box for selection an
   * analysis application.
   */
  _apps() {
    const apps = this.state.datasets ? this.state.datasets.apps : null
    const selectedApp = this.state.selectedAppKey

    let validatedApps = batch.filterAppDefinitions(apps).reduce((acc, app) => {
      //filterAppDefinitions returns an array of objects, with each object having a single key which is app name.
      let name = Object.keys(app)[0]
      // need to filter out any apps that have ALL inactive versions from select list
      if (
        app[name].every(version => {
          return version.status === 'INACTIVE'
        })
      ) {
        return acc
      } else {
        acc.push(name)
        return acc
      }
    }, [])

    const appOptions = validatedApps.map((jobDefinitionName, index) => {
      return (
        <option key={index} value={jobDefinitionName}>
          {' '}
          {jobDefinitionName}{' '}
        </option>
      )
    })

    const versionOptions = selectedApp
      ? Object.keys(apps[selectedApp])
          .reverse()
          .map(revision => {
            //Since we are no longer disabling apps on Batch, they will all have an ACTIVE status and therefore we need to check deleted property
            // the deleted property is tracked in crn mongo
            let active =
              apps[selectedApp][revision].status === 'ACTIVE' &&
              !apps[selectedApp][revision].deleted
            let disabled = this.state.disabledApps.hasOwnProperty(
              apps[selectedApp][revision].jobDefinitionArn,
            )
              ? '* '
              : ''
            return active ? (
              <option key={revision} value={revision}>
                {disabled + 'v' + revision}
              </option>
            ) : null
          })
      : []

    const versions = (
      <div className="col-xs-12">
        <div className="row">
          <hr />
          <h5>Please choose a version for {this.state.selectedAppKey}</h5>
          <div className="col-xs-6 task-select">
            <select
              value={this.state.selectedVersionID}
              onChange={this._selectAppVersion.bind(this)}>
              <option value="" disabled>
                Select a Version
              </option>
              {versionOptions}
            </select>
            <span className="Select-arrow-zone m-arrow">
              <span className="Select-arrow" />
            </span>
          </div>
          <h6 className="col-xs-12">
            {' '}
            * - app is incompatible with selected snapshot
          </h6>
        </div>
      </div>
    )

    if (this.state.selectedSnapshot) {
      const datasetName = this.state.datasets.dataset
        ? this.state.datasets.dataset.name
        : null
      return (
        <div>
          <hr />
          <h5>Choose an analysis pipeline to run on dataset {datasetName}</h5>
          <div className="row">
            <div className="col-xs-12">
              <div className="col-xs-12 task-select">
                <select
                  value={this.state.selectedAppKey}
                  onChange={this._selectApp.bind(this)}>
                  <option value="" disabled>
                    Select a Task
                  </option>
                  {appOptions}
                </select>
                <span className="Select-arrow-zone m-arrow">
                  <span className="Select-arrow" />
                </span>
              </div>
              {this.state.selectedAppKey != '' ? versions : null}
            </div>
          </div>
        </div>
      )
    }
  }

  /**
   * Incompatible
   */
  _incompatible(app) {
    let issues = this.state.disabledApps[app.id].issues
    return (
      <div>
        <div>
          <h5>Incompatible</h5>
          <div>
            <p>
              This snapshot has issues that make it incompatible with this
              pipeline. Fix the errors below and try again. Pipelines may have
              validation requirements beyond BIDS compatibility.
            </p>
            <Results errors={issues.errors} warnings={issues.warnings} />
          </div>
        </div>
      </div>
    )
  }

  /**
   * Snapshots
   *
   * Returns a labeled select box for selecting a snapshot
   * to run analysis on.
   */
  _snapshots() {
    let datasets = this.state.datasets
    let dataset = datasets ? datasets.dataset : null
    let snapshots = datasets ? datasets.snapshots : null
    let options = []
    if (snapshots) {
      options = snapshots.map(snapshot => {
        if (!snapshot.isOriginal && !snapshot.orphaned) {
          return (
            <option key={snapshot._id} value={snapshot._id}>
              {'v' +
                snapshot.snapshot_version +
                ' (' +
                moment(snapshot.modified).format('lll') +
                ')'}
            </option>
          )
        }
      })
    }

    let createSnapshot
    if (dataset && dataset.access === 'admin') {
      let dataset = datasetStore.data.dataset
      let snapshots = datasetStore.data.snapshots
      let modified = !(
        snapshots.length > 1 &&
        moment(dataset.modified).diff(moment(snapshots[1].modified)) <= 0
      )
      if (modified && datasets.datasetUrl) {
        let to = {
          pathname: this.state.datasets.datasetUrl + '/create-snapshot',
          state: {
            fromModal: 'jobs',
          },
        }
        createSnapshot = (
          <div className="col-xs-6 default-reset">
            <Link to={to}>
              <button className="btn-reset">Create New Snapshot</button>
            </Link>
          </div>
        )
      }
    }

    return (
      <div>
        <h5>Choose a snapshot to run analysis on</h5>
        <div className="row">
          <div className="col-xs-12">
            <div className="col-xs-6 task-select">
              <select
                value={this.state.selectedSnapshot}
                onChange={this._selectSnapshot.bind(this)}>
                <option value="" disabled>
                  Select a Snapshot
                </option>
                {options}
              </select>
              <span className="Select-arrow-zone m-arrow">
                <span className="Select-arrow" />
              </span>
            </div>
            {createSnapshot}
          </div>
        </div>
      </div>
    )
  }

  _submit() {
    let selectedAppKey = this.state.selectedAppKey
    let selectedVersionID = this.state.selectedVersionID
    if (this.state.disabledApps.hasOwnProperty(this.state.selectedVersion.id)) {
      return false
    }

    let returnLink = this.state.datasets.datasetUrl ? (
      <Link to={this.state.datasets.datasetUrl}>
        <button className="btn-reset" onClick={this._hide.bind(this)}>
          close
        </button>
      </Link>
    ) : null

    let startLink =
      selectedAppKey && selectedVersionID ? (
        <button
          className="btn-modal-submit"
          onClick={this._checkSubmitStatus.bind(this)}>
          Start
        </button>
      ) : null

    return (
      <div className="col-xs-12 dataset-form-controls modal-actions">
        {startLink}
        {returnLink}
      </div>
    )
  }

  // actions ------------------------------------------------------------

  /**
   * Hide
   */
  _hide() {
    // const success = this.state.message && !this.state.error

    // on modal close arguments
    // const snapshotId = this.state.selectedSnapshot,
    //   appLabel = this.state.selectedAppKey,
    //   appVersion = this.state.selectedVersionID,
    //   jobId = this.state.jobId

    // this.props.onHide(
    //   success,
    //   snapshotId,
    //   appLabel,
    //   appVersion,
    //   jobId,
    //   this.props.history,
    // )
    this.setState({
      loading: false,
      jobId: null,
      parameters: {},
      inputFileParameters: {},
      selectedApp: [],
      selectedAppKey: '',
      selectedVersion: {},
      selectedVersionID: '',
      selectedSnapshot: '',
      message: null,
      error: false,
      options: [],
      value: [],
      appGroup: {},
      submitActive: false,
      submitWarning: null,
      requiredParameters: {},
      parametersMetadata: {},
    })
  }

  /**
   * Update Parameter
   */
  _updateParameter(parameter, event) {
    let parametersMetadata = this.state.parametersMetadata
    const value = event.target.value
    let inputFileParameters = this.state.inputFileParameters
    if (event.target.files && event.target.files.length > 0) {
      inputFileParameters[parameter] = event.target.files[0]
    }
    let requiredParamsUpdate =
      Object.keys(this.state.requiredParameters).indexOf(parameter) != -1
    let parameters = this.state.parameters
    let requiredParameters = this.state.requiredParameters
    parameters[parameter] = value

    if (requiredParamsUpdate) {
      requiredParameters[parameter] = value
    }
    if (parametersMetadata[parameter].type === 'checkbox') {
      parametersMetadata[parameter].defaultValue = parameters[parameter]
    }
    this.setState({ parameters, requiredParameters, inputFileParameters })
  }

  _checkSubmitStatus() {
    let metaData = this.state.parametersMetadata
    let requiredParameters = this.state.requiredParameters
    let submitWarning = null
    let submitActive = Object.keys(requiredParameters).every(param => {
      if (metaData[param].defaultValue != '') {
        requiredParameters[param] = metaData[param].defaultValue
      } else if (!requiredParameters[param]) {
        submitWarning = 'The required parameter "' + param + '" is missing.'
      }
      return !!requiredParameters[param]
    })
    this.setState({ submitActive, submitWarning }, () => {
      this.state.submitActive === true ? this._startJob() : null
    })
  }

  /**
   * Restore Default Parameters
   */
  _restoreDefaultParameters() {
    const apps = this.props.apps
    const key = this.state.selectedAppKey
    const revision = this.state.selectedVersionID
    const app = apps[key][revision]
    const parametersMetadata = JSON.parse(
      JSON.stringify(app.parametersMetadata),
    )
    const parameters = JSON.parse(JSON.stringify(app.parameters))
    this._applyDefaults(parameters, parametersMetadata)
    const inputFileParameters = {}
    this.setState({ parameters, inputFileParameters })
  }

  _applyDefaults(parameters, metadata) {
    Object.keys(metadata).forEach(param => {
      const type = metadata[param].type
      if (
        (type === 'multi' || type === 'select') &&
        'defaultChecked' in metadata[param]
      ) {
        parameters[param] = metadata[param].defaultChecked
      } else if (type === 'radio') {
        // Sets a default for a radio parameter if none is configured
        if (metadata[param].options) {
          // Current schema
          parameters[param] = metadata[param].options[0]
        } else if (metadata[param].defaultValue) {
          // Deprecated schema
          parameters[param] = metadata[param].defaultValue[0]
        }
      }
    })
  }

  /**
   * Select App
   */
  _selectApp(e) {
    const selectedAppKey = e.target.value
    const selectedApp =
      this.state.datasets && this.state.datasets.apps
        ? this.state.datasets.apps[selectedAppKey]
        : null
    if (this.state.selectedAppKey !== e.target.value) {
      this.setState({
        parameters: [],
        inputFileParameters: {},
        selectedApp: [],
        selectedAppKey: '',
        selectedVersion: {},
        selectedVersionID: '',
      })
    }
    this.setState({ selectedApp, selectedAppKey })
  }

  /**
   * Select App Version
   */
  _selectAppVersion(e) {
    const selectedVersionID = e.target.value
    const selectedDefinition = this.state.datasets.apps[
      this.state.selectedAppKey
    ][selectedVersionID]
    const parametersMetadata = JSON.parse(
      JSON.stringify(selectedDefinition.parametersMetadata),
    )
    const parameters = JSON.parse(JSON.stringify(selectedDefinition.parameters))
    this._applyDefaults(parameters, parametersMetadata)
    //if there are required parameters for the app, disable start button
    let requiredParameters = {}
    let submitActive = this.state.submitActive
    Object.keys(parametersMetadata).forEach(param => {
      if (parametersMetadata[param].required) {
        requiredParameters[param] = null
      }
    })

    if (Object.keys(requiredParameters).length) {
      submitActive = false
    }

    this.setState({
      selectedVersionID,
      parameters,
      parametersMetadata,
      submitActive,
      requiredParameters,
    })
  }

  /**
   * Select Snapshot
   */
  _selectSnapshot(e) {
    let snapshotId = e.target.value
    this.setState({ selectedSnapshot: snapshotId })
  }

  /**
   * Create Snapshot
   */
  _createSnapshot() {
    this.setState({ loading: true })
    actions.createSnapshot.bind(null, this.props.history)(res => {
      if (res.error) {
        this.setState({
          error: true,
          message: res.error,
          loading: false,
        })
      } else {
        this.setState({
          selectedSnapshot: res,
          loading: false,
        })
      }
    }, false)
  }

  /**
   * Start Job
   */
  _startJob() {
    const selectedSnapshot = this.state.selectedSnapshot
    const definitions = this.state.datasets.apps
    const key = this.state.selectedAppKey
    const revision = this.state.selectedVersionID
    const jobDefinition = definitions[key][revision]
    let parameters = this.state.parameters
    const inputFileParameters = this.state.inputFileParameters
    this.setState({ loading: true })

    actions.prepareJobSubmission(
      parameters,
      inputFileParameters,
      (e, updatedParameters) => {
        actions.startJob(
          selectedSnapshot,
          jobDefinition,
          updatedParameters,
          (err, res) => {
            let message, error
            if (err) {
              error = true
              let response = err.response
              if (err.status === 409) {
                message =
                  'This analysis has already been run on this dataset with the same parameters. You can view the results in the Analyses section of the dataset page.'
              } else if (err.status === 503) {
                message =
                  'We are temporarily unable to process this analysis. Please try again later. If this issue persists, please contact the site administrator.'
              } else if (err.status === 403 && response.body.error) {
                // If non admins try to run more than 2 jobs at a time, want to display message letting them know they don't have access
                message = response.body.error
              } else {
                message =
                  'There was an issue submitting your analysis. Double check your inputs and try again. If the issue persists, please contact the site administrator.'
              }
            } else {
              message =
                'Your analysis has been submitted. You will receive a notification by email once the job is complete.'
            }

            if (res && res.body && 'jobId' in res.body && res.body.jobId) {
              this.setState({
                loading: false,
                message: message,
                error: error,
                jobId: res.body.jobId,
              })
            } else {
              this.setState({
                loading: false,
                message: message,
                error: error,
              })
            }
          },
        )
      },
    )
  }
}

JobMenu.propTypes = {
  apps: PropTypes.object,
  dataset: PropTypes.object,
  loadingApps: PropTypes.bool,
  show: PropTypes.bool,
  snapshots: PropTypes.array,
  history: PropTypes.object,
  location: PropTypes.object,
}

JobMenu.defaultProps = {
  apps: {},
  dataset: {},
  loadingApps: false,
  show: false,
  snapshots: [],
}

export default withRouter(JobMenu)
