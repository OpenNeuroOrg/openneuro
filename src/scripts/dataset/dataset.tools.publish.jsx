// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './dataset.actions.js';
import Spinner from '../common/partials/spinner.jsx';
import {Modal} from 'react-bootstrap';
import moment  from 'moment';

export default class Publish extends React.Component {

// life cycle events --------------------------------------------------

    constructor() {
        super();
        this.state = {
            loading: false,
            selectedSnapshot: '',
            message: null,
            error: false
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

        let loadingText = this.props.loadingApps ? 'Loading pipelines' : 'Starting ' + this.state.selectedApp;

        let form = (
            <div className="anaylsis-modal clearfix">
                {this._snapshots()}
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
                    <Modal.Title>Publish</Modal.Title>
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
     * Snapshots
     *
     * Returns a labeled select box for selecting a snapshot
     * to run analysis on.
     */
    _snapshots() {
        let options = this.props.snapshots ? this.props.snapshots.map((snapshot) => {
            if (!snapshot.isOriginal) {
                return (
                    <option key={snapshot._id} value={snapshot._id} disabled={snapshot.public}>
                        {'v' + snapshot.snapshot_version + ' (' + moment(snapshot.modified).format('lll') + ')'} {snapshot.public ? '- published' : null}
                    </option>
                );
            }
        }) : [];
        return (
            <div>
                <h5>Choose a snapshot to publish</h5>
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

    _submit() {
        if (this.state.selectedSnapshot) {
            return (
                <div className="col-xs-12 modal-actions">
                    <button className="btn-modal-submit" onClick={this._publish.bind(this)}>Publish</button>
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
        this.setState({
            loading: false,
            selectedSnapshot: '',
            message: null,
            error: false
        });
        this.props.onHide();
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
     * Publish
     */
    _publish() {
        actions.publish(this.state.selectedSnapshot, true, this._hide.bind(this));
    }

}

Publish.propTypes = {
    snapshots: React.PropTypes.array,
    dataset: React.PropTypes.object,
    loadingApps: React.PropTypes.bool,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func
};