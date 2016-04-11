// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './dataset.actions.js';
import Spinner from '../common/partials/spinner.jsx';
import {Modal} from 'react-bootstrap';
import moment  from 'moment';

export default class JobMenu extends React.Component {

// life cycle events --------------------------------------------------

    constructor() {
        super();
        this.state = {
            loading:          false,
            parameters:       [],
            selectedApp:      {},
            selectedAppID:    '',
            selectedSnapshot: '',
            message:          null,
            error:            false
        };
    }

    componentWillReceiveProps() {
        this.props.snapshots.map((snapshot) => {
            if (snapshot._id == this.props.dataset._id) {
                if (snapshot.original) {
                    this.setState({selectedSnapshot: snapshot._id});
                } else if (this.props.snapshots.length > 1) {
                    this.setState({selectedSnapshot: this.props.snapshots[1]._id});
                }
                return;
            }
        });
    }

    render() {

        let loadingText = this.props.loadingApps ? 'Loading pipelines' : 'Starting ' + this.state.selectedAppID;

        let form = (
            <div className="anaylsis-modal clearfix">
                {this._snapshots()}
                {this._apps()}
                {this._parameters()}
                {this._submit()}
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
                    <div className="dataset">
                        {body}
                    </div>
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
        let options = this.props.apps ? this.props.apps.map((app) => {
            return <option key={app.id} value={app.id}>{app.label + ' - v' + app.version}</option>;
        }) : [];

        if (this.state.selectedSnapshot) {
            return (
                <div>
                    <h5>Choose an analysis pipeline to run on dataset {this.props.dataset.name}</h5>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="col-xs-6 task-select">
                                <select value={this.state.selectedAppID} onChange={this._selectApp.bind(this)}>
                                    <option value="" disabled>Select a Task</option>
                                    {options}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    /**
     * Snapshots
     *
     * Returns a labeled select box for selecting a snapshot
     * to run analysis on.
     */
    _snapshots() {
        let options = this.props.snapshots ? this.props.snapshots.map((snapshot) => {
            if (!snapshot.isOriginal) {
                return (
                    <option key={snapshot._id} value={snapshot._id}>
                        {'v' + snapshot.snapshot_version + ' (' + moment(snapshot.modified).format('lll') + ')'}
                    </option>
                );
            }
        }) : [];
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
                        <div className="col-xs-6 default-reset">
                            <button className="btn-reset" onClick={this._createSnapshot.bind(this)}>Create New Snapshot</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Parameters
     *
     * Returns an array of input markup
     * for the parameters of the selected
     * app.
     */
    _parameters() {
        let parameters = this.state.parameters.map((parameter) => {
            let input;
            if (parameter.type) {
                input = (
                    <span>
                        <input className="form-control checkbox"
                               type="checkbox"
                               id={'check-' + parameter.id}
                               checked={parameter.value}
                               onChange={this._updateParameter.bind(this, parameter.id)}/>
                        <label htmlFor={'check-' + parameter.id} className="checkmark"><span></span></label>
                    </span>
                );
            } else {
                input = <input className="form-control" value={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
            }
            return (
                <div key={parameter.id}>
                    <div className="parameters form-horizontal">
                        <div className="form-group" key={parameter.id}>
                            <label className="sr-only">{parameter.label}</label>
                            <div className="input-group">
                                  <div className="input-group-addon">{parameter.label}</div>
                                <div className="clearfix">
                                    {input}
                                    <span className="help-text">{parameter.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        let reset;
        if (parameters.length > 0) {
            reset = (
                <div className="default-reset">
                    <button className="btn-reset" onClick={this._restoreDefaultParameters.bind(this)}>Restore Default Parameters</button>
                </div>
            );
        }

        return (
            <div>
                {reset}
                {parameters}
            </div>
        );
    }

    _submit() {
        if (this.state.selectedAppID) {
            return (
                <div className="col-xs-12 modal-actions">
                    <button className="btn-modal-submit" onClick={this._startJob.bind(this)}>Start</button>
                    <button className="btn-reset" onClick={this._hide.bind(this)}>close</button>
                </div>
            );
        }
    }

// actions ------------------------------------------------------------

    /**
     * Hide
     */
    _hide() {
        let success = !!this.state.message && !this.state.error;
        this.props.onHide(success, this.state.selectedSnapshot);
        this.setState({
            loading: false,
            parameters: [],
            selectedAppID: '',
            selectedSnapshot: '',
            message: null,
            error: false
        });
    }

    /**
     * Update Parameter
     *
     * Takes a parameter id and the
     * onChange event and updates the
     * parameter to the new value.
     */
    _updateParameter(id, e) {
        let value = e.target.value;
        let parameters = this.state.parameters;
        for (let parameter of parameters) {
            if (parameter.id === id) {
                if (parameter.type === 'bool') {
                    parameter.value = !parameter.value;
                } else {
                    parameter.value = value;
                }
            }
        }
        this.setState({parameters});
    }

    /**
     * Restore Default Parameters
     */
    _restoreDefaultParameters() {
        let parameters = this.state.parameters;
        for (let parameter of parameters) {
            parameter.value = parameter.default;
        }
        this.setState({parameters});
    }

    /**
     * Select App
     */
    _selectApp(e) {
        let selectedApp;
        let selectedAppID = e.target.value;
        let parameters = [], parametersSpec = [];
        for (let app of this.props.apps) {
            if (app.id === selectedAppID) {
                selectedApp = app;
                parametersSpec = app.parameters;
                break;
            }
        }
        for (let parameter of parametersSpec) {
            parameters.push({
                id:          parameter.id,
                label:       parameter.details.label,
                description: parameter.details.description,
                type:        parameter.value.type,
                default:     parameter.value.default,
                value:       parameter.value.default
            });
        }
        this.setState({selectedApp, selectedAppID, parameters});
    }

    /**
     * Select Snapshot
     */
    _selectSnapshot(e) {
        let snapshotId = e.target.value;
        this.setState({selectedSnapshot: snapshotId});
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
        let parameters = {};
        for (let parameter of this.state.parameters) {
            if (parameter.type === 'number') {parameter.value = Number(parameter.value);}
            parameters[parameter.id] = parameter.value;
        }
        this.setState({loading: true});

        actions.startJob(this.state.selectedSnapshot, this.state.selectedApp, parameters, (err, res) => {
            let message, error;
            if (err) {
                error   = true;
                if (res.status === 409) {
                    message = 'This analysis has already been run on this dataset with the same parameters. You can view the results in the Analyses section of the dataset page.';
                } else {
                    message = 'There was an issue submitting your analysis. Double check your inputs and try again. If the issue persists, please contact the site administrator.';
                }
            } else {
                message = 'Your analysis has been submitted. Periodically check the Analyses section of this dataset to view the status and results.';
            }
            this.setState({loading: false, message: message, error: error});
        });
    }
}

JobMenu.propTypes = {
    apps:        React.PropTypes.array,
    dataset:     React.PropTypes.object,
    loadingApps: React.PropTypes.bool,
    onHide:      React.PropTypes.func.isRequired,
    show:        React.PropTypes.bool,
    snapshots:   React.PropTypes.array
};

JobMenu.defaultProps = {
    app:         [],
    dataset:     {},
    loadingApps: false,
    show:        false,
    snapshots:   []
};