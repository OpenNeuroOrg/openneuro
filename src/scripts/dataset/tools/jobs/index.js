/*eslint react/no-danger: 0 */

// dependencies -------------------------------------------------------

import React       from 'react';
import actions     from '../../dataset.actions.js';
import Spinner     from '../../../common/partials/spinner.jsx';
import {Modal}     from 'react-bootstrap';
import moment      from 'moment';
import validate    from 'bids-validator';
import scitran     from '../../../utils/scitran';
import Results     from '../../../upload/upload.validation-results.jsx';
import Description from './description.jsx';
import Parameters  from './parameters.jsx';

export default class JobMenu extends React.Component {

// life cycle events --------------------------------------------------

    constructor() {
        super();
        this.state = {
            loading:           false,
            parameters:         {},
            disabledApps:       {},
            jobId:              null,
            selectedApp:        [],
            selectedVersion:    {},
            selectedVersionID:  '',
            selectedAppKey:     '',
            selectedSnapshot:   '',
            message:            null,
            error:              false,
            subjects:           [],
            appGroup:           {}
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentWillReceiveProps() {
        // initialize subjects into state
        if (this.state.subjects.length === 0 && this.props.dataset.summary) {
            let subjects = [];
            for (let subject of this.props.dataset.summary.subjects) {
                subjects.push({label: 'sub-' + subject, value: 'sub-' + subject});
            }
            subjects.reverse();
            this.setState({subjects});
        }

        // pre-select snapshots
        if (!this.state.selectedSnapshot) {
            this.props.snapshots.map((snapshot) => {
                if (snapshot._id == this.props.dataset._id) {
                    if (snapshot.original) {
                        this._selectSnapshot({target: {value: snapshot._id}});
                    } else if (this.props.snapshots.length > 1) {
                        this._selectSnapshot({target: {value: this.props.snapshots[1]._id}});
                    }
                    return;
                }
            });
        }
    }

    render() {
        let apps = this.props.apps;
        let selectedAppKey = this.state.selectedAppKey;
        let selectedVersionID = this.state.selectedVersionID;
        let loadingText = this.props.loadingApps ? 'Loading pipelines' : 'Starting ' + selectedVersionID;

        let form = (
            <div className="anaylsis-modal clearfix">
                {this._snapshots()}
                {this._apps()}
                {selectedAppKey && selectedVersionID
                    ? (
                        <div>
                            <Description jobDefinition={apps[selectedAppKey][selectedVersionID]} />
                            <Parameters parameters={this.state.parameters} onChange={this._updateParameter.bind(this)} onRestoreDefaults={this._restoreDefaultParameters.bind(this)} />
                            {this._submit()}
                        </div>)
                    : ''
                }
            </div>
        );

        let message = (
            <div>
                <div className={this.state.error ? 'alert alert-danger' : null}>
                    {this.state.error ? <h4 className="danger">Error</h4> : null}
                    <h5>{this.state.message}</h5>
                </div>
                <button className="btn-admin-blue" onClick={this._hide.bind(this)}>OK</button>
            </div>
        );

        let body;
        if (this.state.loading || this.props.loadingApps) {
            body = <Spinner active={true} text={loadingText}/>;
        } else if (this.state.message) {
            body = message;
        } else {
            body = form;
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
        );
    }

// template methods ---------------------------------------------------

    /**
     * Apps
     *
     * Returns a label and select box for selection an
     * analysis application.
     */
    _apps() {
        const apps = this.props.apps;
        const selectedApp = this.state.selectedAppKey;

        const appOptions = Object.keys(apps).map((jobDefinitionName, index) => {
            return <option key={index} value={jobDefinitionName}> {jobDefinitionName} </option>;
        });

        const versionOptions = selectedApp ? Object.keys(apps[selectedApp]).map((revision) => {
            let disabled = this.state.disabledApps.hasOwnProperty(apps[selectedApp][revision].jobDefinitionArn) ? '* ' : '';
            return <option key={revision} value={revision}>{disabled + 'v' + revision}</option>;
        }) : [];

        const versions = (
            <div className="col-xs-12">
                <div className="row">
                    <hr />
                    <h5>Please choose a version for {this.state.selectedAppKey}</h5>
                    <div className="col-xs-6 task-select">
                        <select value={this.state.selectedVersionID} onChange={this._selectAppVersion.bind(this)}>
                            <option value="" disabled>Select a Version</option>
                            {versionOptions}
                        </select>
                    </div>
                    <h6 className="col-xs-12"> * - app is incompatible with selected snapshot</h6>
                </div>
            </div>
        );

        if (this.state.selectedSnapshot) {
            return (
                <div>
                    <hr/>
                    <h5>Choose an analysis pipeline to run on dataset {this.props.dataset.name}</h5>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="col-xs-12 task-select">
                                <select value={this.state.selectedAppKey} onChange={this._selectApp.bind(this)}>
                                    <option value="" disabled>Select a Task</option>
                                    {appOptions}
                                </select>
                            </div>
                            {this.state.selectedAppKey != '' ? versions : null}
                        </div>
                    </div>
                </div>
            );
        }
    }

    /**
     * Incompatible
     */
    _incompatible(app) {
        let issues = this.state.disabledApps[app.id].issues;
        return (
            <div>
                <div>
                    <h5>Incompatible</h5>
                    <div>
                        <p>This snapshot has issues that make it incompatible with this pipeline. Fix the errors below and try again. Pipelines may have validation requirements beyond BIDS compatibility.</p>
                        <Results errors={issues.errors} warnings={issues.warnings} />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Snapshots
     *
     * Returns a labeled select box for selecting a snapshot
     * to run analysis on.
     */
    _snapshots() {
        let options = this.props.snapshots ? this.props.snapshots.map((snapshot) => {
            if (!snapshot.isOriginal && !snapshot.orphaned) {
                return (
                    <option key={snapshot._id} value={snapshot._id}>
                        {'v' + snapshot.snapshot_version + ' (' + moment(snapshot.modified).format('lll') + ')'}
                    </option>
                );
            }
        }) : [];

        let createSnapshot;
        if (this.props.dataset.access === 'admin') {
            createSnapshot = (
                <div className="col-xs-6 default-reset">
                    <button className="btn-reset" onClick={this._createSnapshot.bind(this)}>Create New Snapshot</button>
                </div>
            );
        }

        return (
            <div>
                <h5>Choose a snapshot to run analysis on</h5>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="col-xs-6 task-select">
                            <select value={this.state.selectedSnapshot} onChange={this._selectSnapshot.bind(this)}>
                                <option value="" disabled>Select a Snapshot</option>
                                {options}
                            </select>
                        </div>
                        {createSnapshot}
                    </div>
                </div>
            </div>
        );
    }

    _submit() {
        if (this.state.disabledApps.hasOwnProperty(this.state.selectedVersion.id)) {
            return false;
        }
        return (
            <div className="col-xs-12 modal-actions">
                <button className="btn-modal-submit" onClick={this._startJob.bind(this)}>Start</button>
                <button className="btn-reset" onClick={this._hide.bind(this)}>close</button>
            </div>
        );
    }

// actions ------------------------------------------------------------

    /**
     * Hide
     */
    _hide() {
        let success = !!this.state.message && !this.state.error;

        // on modal close arguments
        let snapshotId = this.state.selectedSnapshot,
            appLabel   = this.state.selectedVersion.label,
            appVersion = this.state.selectedVersion.version,
            jobId      = this.state.jobId;

        this.props.onHide(success, snapshotId, appLabel, appVersion, jobId);
        this.setState({
            loading:            false,
            jobId:              null,
            parameters:         {},
            selectedApp:        [],
            selectedAppKey:     '',
            selectedVersion:    {},
            selectedVersionID:  '',
            selectedSnapshot:   '',
            message:            null,
            error:              false,
            options:            [],
            value:              [],
            appGroup:           {}
        });
    }

    /**
     * Update Parameter
     */
    _updateParameter(parameter, event) {
        const value = event.target.value;
        let parameters = this.state.parameters;
        parameters[parameter] = value;
        this.setState({parameters});
    }

    /**
     * Restore Default Parameters
     */
    _restoreDefaultParameters() {
        const apps       = this.props.apps;
        const key        = this.state.selectedAppKey;
        const revision   = this.state.selectedVersionID;
        const app        = apps[key][revision];
        const parameters = JSON.parse(JSON.stringify(app.parameters));
        this.setState({parameters});
    }

    /**
     * Select App
     */
    _selectApp(e) {
        let selectedAppKey = e.target.value;
        let selectedApp    = this.props.apps[selectedAppKey];
        if(this.state.selectedAppKey != e.target.value){
            this.setState({
                parameters:         [],
                selectedApp:        [],
                selectedAppKey:     '',
                selectedVersion:    {},
                selectedVersionID:  ''
            });
        }
        this.setState({selectedApp, selectedAppKey});
    }

    /**
     * Select App Version
     */
    _selectAppVersion(e) {
        let selectedVersionID = e.target.value;
        let selectedDefinition = this.props.apps[this.state.selectedAppKey][selectedVersionID];
        let parameters = JSON.parse(JSON.stringify(selectedDefinition.parameters));
        this.setState({selectedVersionID, parameters});
    }

    /**
     * Select Snapshot
     */
    _selectSnapshot(e) {
        let snapshotId = e.target.value;
        let disabledApps = {};

        /**
         * determine app availability
         */
        // load validation data for selected snapshot
        scitran.getProject(snapshotId, (res) => {
            for (let jobDefinitionName in this.props.apps) {
                let app = this.props.apps[jobDefinitionName];
                let validationConfig = app.hasOwnProperty('validationConfig') ? app.validationConfig : {error: []};
                let issues = validate.reformat(res.body.metadata.validation, res.body.metadata.summary, validationConfig);
                if (issues.errors.length > 0) {
                    disabledApps[app.id] = {issues};
                }
            }

            if (this.mounted) {
                this.setState({selectedSnapshot: snapshotId /*, disabledApps*/});
            }
        },{snapshot:true});
    }

    /**
     * Create Snapshot
     */
    _createSnapshot() {
        this.setState({loading: true});
        actions.createSnapshot((res) => {
            if (res.error) {
                this.setState({
                    error: true,
                    message: res.error,
                    loading: false
                });
            } else {
                this.setState({
                    selectedSnapshot: res,
                    loading: false
                });
            }
        }, false);
    }

    /**
     * Start Job
     */
    _startJob() {
        const selectedSnapshot = this.state.selectedSnapshot;
        const definitions      = this.props.apps;
        const key              = this.state.selectedAppKey;
        const revision         = this.state.selectedVersionID;
        const jobDefinition    = definitions[key][revision];
        const parameters       = this.state.parameters;

        this.setState({loading: true});

        actions.startJob(selectedSnapshot, jobDefinition, parameters, (err, res) => {
            let message, error;
            if (err) {
                error   = true;
                if (res.status === 409) {
                    message = 'This analysis has already been run on this dataset with the same parameters. You can view the results in the Analyses section of the dataset page.';
                } else if (res.status === 503) {
                    message = 'We are temporarily unable to process this analysis. Please try again later. If this issue persists, please contact the site administrator.';
                } else {
                    message = 'There was an issue submitting your analysis. Double check your inputs and try again. If the issue persists, please contact the site administrator.';
                }
            } else {
                message = 'Your analysis has been submitted. Periodically check the Analyses section of this dataset to view the status and results.';
            }

            this.setState({loading: false, message: message, error: error /*, jobId: res.body.result.id*/});
        });
    }
}

JobMenu.propTypes = {
    apps:        React.PropTypes.object,
    dataset:     React.PropTypes.object,
    loadingApps: React.PropTypes.bool,
    onHide:      React.PropTypes.func.isRequired,
    show:        React.PropTypes.bool,
    snapshots:   React.PropTypes.array
};

JobMenu.defaultProps = {
    apps:        {},
    dataset:     {},
    loadingApps: false,
    show:        false,
    snapshots:   []
};
