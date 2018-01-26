/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import actions from '../../dataset.actions.js'
import Spinner from '../../../common/partials/spinner.jsx'
import { Modal } from '../../../utils/modal.jsx'
import moment from 'moment'
import validate from 'bids-validator'
import scitran from '../../../utils/scitran'
import Results from '../../../upload/upload.validation-results.jsx'
import Description from './description.jsx'
import Parameters from './parameters.jsx'
import batch from '../../../utils/batch'

class JobMenu extends React.Component {
  // life cycle events --------------------------------------------------

  constructor() {
    super()
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
      arrInput: [],
      appGroup: {},
      submitActive: false,
      requiredParameters: {},
    }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentWillReceiveProps() {
    // initialize subjects into state
    if (this.state.subjects.length === 0 && this.props.dataset.summary) {
      let subjects = []
      for (let subject of this.props.dataset.summary.subjects) {
        subjects.push({ label: 'sub-' + subject, value: subject })
      }
      subjects.reverse()
      this.setState({ subjects })
    }

    // pre-select snapshots
    if (!this.state.selectedSnapshot) {
      this.props.snapshots.map(snapshot => {
        if (snapshot._id == this.props.dataset._id) {
          if (snapshot.original) {
            this._selectSnapshot({ target: { value: snapshot._id } })
          } else if (this.props.snapshots.length > 1) {
            this._selectSnapshot({
              target: { value: this.props.snapshots[1]._id },
            })
          }
          return
        }
      })
    }
  }

  render() {
    let apps = this.props.apps
    let selectedAppKey = this.state.selectedAppKey
    let selectedVersionID = this.state.selectedVersionID
    let loadingText = this.props.loadingApps
      ? 'Loading pipelines'
      : 'Starting ' + selectedVersionID
    let form = (
      <div className="analysis-modal clearfix">
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
              arrInput={this.state.arrInput}
              onChange={this._updateParameter.bind(this)}
              onRestoreDefaults={this._restoreDefaultParameters.bind(this)}
            />
            <span className="submit-warning">{this.state.submitWarning}</span>
            {this._submit()}
          </div>
        ) : (
          ''
        )}
      </div>
    )

    let message = (
      <div>
        <div className={this.state.error ? 'alert alert-danger' : null}>
          {this.state.error ? <h4 className="danger">Error</h4> : null}
          <h5>{this.state.message}</h5>
        </div>
        <button className="btn-admin-blue" onClick={this._hide.bind(this)}>
          OK
        </button>
      </div>
    )

    let body
    if (this.state.loading || this.props.loadingApps) {
      body = <Spinner active={true} text={loadingText} />
    } else if (this.state.message) {
      body = message
    } else {
      body = form
    }

    return (
      <Modal show={this.props.show} onHide={this._hide.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Run Analysis</Modal.Title>
        </Modal.Header>
        <hr className="modal-inner" />
        <Modal.Body>
          <div className="dataset">{body}</div>
        </Modal.Body>
      </Modal>
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
    const apps = this.props.apps
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
      return (
        <div>
          <hr />
          <h5>
            Choose an analysis pipeline to run on dataset{' '}
            {this.props.dataset.name}
          </h5>
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
    let options = []
    if (this.props.snapshots) {
      options = this.props.snapshots.map(snapshot => {
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
    if (this.props.dataset.access === 'admin') {
      createSnapshot = (
        <div className="col-xs-6 default-reset">
          <button
            className="btn-reset"
            onClick={this._createSnapshot.bind(this)}>
            Create New Snapshot
          </button>
        </div>
      )
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
    if (this.state.disabledApps.hasOwnProperty(this.state.selectedVersion.id)) {
      return false
    }
    return (
      <div className="col-xs-12 modal-actions">
        <button
          className="btn-modal-submit"
          onClick={this._startJob.bind(this)}
          disabled={!this.state.submitActive}>
          Start
        </button>
        <button className="btn-reset" onClick={this._hide.bind(this)}>
          close
        </button>
      </div>
    )
  }

  // actions ------------------------------------------------------------

  /**
   * Hide
   */
  _hide() {
    const success = this.state.message && !this.state.error

    // on modal close arguments
    const snapshotId = this.state.selectedSnapshot,
      appLabel = this.state.selectedAppKey,
      appVersion = this.state.selectedVersionID,
      jobId = this.state.jobId

    this.props.onHide(
      success,
      snapshotId,
      appLabel,
      appVersion,
      jobId,
      this.props.history,
    )
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
    this.setState(
      { parameters, requiredParameters, inputFileParameters },
      () => {
        this._checkSubmitStatus()
      },
    )
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
    this.setState({ submitActive, submitWarning })
  }

  /**
   * Restore Default Parameters
   */
  _restoreDefaultParameters() {
    const apps = this.props.apps
    const key = this.state.selectedAppKey
    const revision = this.state.selectedVersionID
    const app = apps[key][revision]
    const parameters = JSON.parse(JSON.stringify(app.parameters))
    const inputFileParameters = {}
    this.setState({ parameters, inputFileParameters })
  }

  /**
   * Select App
   */
  _selectApp(e) {
    let selectedAppKey = e.target.value
    let selectedApp = this.props.apps[selectedAppKey]
    if (this.state.selectedAppKey != e.target.value) {
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
    let selectedVersionID = e.target.value
    let selectedDefinition = this.props.apps[this.state.selectedAppKey][
      selectedVersionID
    ]
    let parameters = JSON.parse(JSON.stringify(selectedDefinition.parameters))
    let parametersMetadata = JSON.parse(
      JSON.stringify(selectedDefinition.parametersMetadata),
    )
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

    this.setState(
      {
        selectedVersionID,
        parameters,
        parametersMetadata,
        submitActive,
        requiredParameters,
      },
      () => {
        this._checkSubmitStatus()
      },
    )
  }

  /**
   * Select Snapshot
   */
  _selectSnapshot(e) {
    let snapshotId = e.target.value
    let disabledApps = {}

    /**
     * determine app availability
     */
    // load validation data for selected snapshot
    scitran.getProject(snapshotId, { snapshot: true }).then(res => {
      for (let jobDefinitionName in this.props.apps) {
        let app = this.props.apps[jobDefinitionName]
        let validationConfig = app.hasOwnProperty('validationConfig')
          ? app.validationConfig
          : { error: [] }
        let issues = validate.reformat(
          res.body.metadata.validation || {},
          res.body.metadata.summary || {},
          validationConfig,
        )
        if (issues.errors.length > 0) {
          disabledApps[app.id] = { issues }
        }
      }

      if (this.mounted) {
        this.setState({ selectedSnapshot: snapshotId /*, disabledApps*/ })
      }
    })
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
    const definitions = this.props.apps
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
              if (res.status === 409) {
                message =
                  'This analysis has already been run on this dataset with the same parameters. You can view the results in the Analyses section of the dataset page.'
              } else if (res.status === 503) {
                message =
                  'We are temporarily unable to process this analysis. Please try again later. If this issue persists, please contact the site administrator.'
              } else if (res.status === 403 && res.body.error) {
                // If non admins try to run more than 2 jobs at a time, want to display message letting them know they don't have access
                message = res.body.error
              } else {
                message =
                  'There was an issue submitting your analysis. Double check your inputs and try again. If the issue persists, please contact the site administrator.'
              }
            } else {
              message =
                'Your analysis has been submitted. You will receive a notification by email once the job is complete.'
            }

            if ('jobId' in res.body && res.body.jobId) {
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
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool,
  snapshots: PropTypes.array,
  history: PropTypes.object,
  arrInput: PropTypes.array,
}

JobMenu.defaultProps = {
  apps: {},
  dataset: {},
  loadingApps: false,
  show: false,
  snapshots: [],
}

export default withRouter(JobMenu)
