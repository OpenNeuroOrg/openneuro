// dependencies -------------------------------------------------------

import React          from 'react';
import Reflux         from 'reflux';
import moment         from 'moment';
import WarnButton     from '../common/forms/warn-button.jsx';
import FileSelect     from '../common/forms/file-select.jsx';
import uploadStore    from '../upload/upload.store';
import userStore      from '../user/user.store.js';
import datasetActions from './dataset.actions.js';
import uploadActions  from '../upload/upload.actions.js';
import ToolModals     from './dataset.tools.modals.jsx';

let Tools = React.createClass({

    mixins: [Reflux.connect(uploadStore)],

    propTypes: {
        dataset:   React.PropTypes.object.isRequired,
        snapshots: React.PropTypes.array.isRequired,
        selectedSnapshot: React.PropTypes.string.isRequired
    },

// life cycle events --------------------------------------------------

    componentDidMount() {
        let dataset = this.props.dataset;
        if (dataset && (dataset.access === 'rw' || dataset.access == 'admin')) {
            datasetActions.loadUsers();
        }
    },

    render() {
        let dataset     = this.props.dataset,
            snapshots   = this.props.snapshots,
            isUploading = dataset._id === this.state.projectId;

        // permission check shorthands
        let isAdmin      = dataset.access === 'admin',
            // isEditor     = dataset.access === 'rw',
            // isViewer     = dataset.access === 'ro',
            isSignedIn   = !!userStore.hasToken(),
            isPublic     = !!dataset.status.public,
            isIncomplete = !!dataset.status.incomplete,
            isInvalid    = !!dataset.status.invalid,
            isSnapshot   = !!dataset.original,
            isSuperuser  = window.localStorage.scitranUser ? JSON.parse(window.localStorage.scitranUser).root : null;

        let tools = [
            {
                tooltip: 'Download Dataset',
                icon: 'fa-download',
                prepDownload: datasetActions.getDatasetDownloadTicket,
                action: datasetActions.trackDownload,
                display: !isIncomplete
            },
            {
                tooltip: 'Publish Dataset',
                icon: 'fa-globe',
                action: datasetActions.toggleModal.bind(null, 'publish'),
                display: isAdmin && !isPublic && !isIncomplete,
                warn: false
            },
            {
                tooltip: 'Unpublish Dataset',
                icon: 'fa-eye-slash',
                action: datasetActions.publish.bind(this, dataset._id, false),
                display: isPublic && isSuperuser,
                warn: true
            },
            {
                tooltip: 'Delete Dataset',
                icon: 'fa-trash',
                action: datasetActions.deleteDataset.bind(this, dataset._id),
                display: (isAdmin && !isPublic) || isSuperuser,
                warn: true
            },
            {
                tooltip: 'Share Dataset',
                icon: 'fa-user-plus',
                action: datasetActions.toggleModal.bind(null, 'share'),
                display: isAdmin && !isSnapshot && !isIncomplete,
                warn: false
            },
            {
                tooltip: 'Create Snapshot',
                icon: 'fa-camera-retro',
                action: datasetActions.createSnapshot,
                display: isAdmin && !isSnapshot && !isIncomplete,
                warn: true,
                validations: [
                    {
                        check: isInvalid,
                        message: 'You cannot snapshot an invalid dataset. Please fix the errors and try again.',
                        timeout: 5000,
                        type: 'Error'
                    },
                    {
                        check: snapshots.length > 1 && (moment(dataset.modified).diff(moment(snapshots[1].modified)) <= 0),
                        message: 'No modifications have been made since the last snapshot was created. Please use the most recent snapshot.',
                        timeout: 6000,
                        type: 'Error'
                    }
                ]
            }
        ];

        return (
            <div className="tools clearfix">
                {this._snapshotSelect(snapshots)}
                {this._tools(tools)}
                {this._runAnalysis(isSignedIn && !isIncomplete)}
                {this._resume(isIncomplete, isUploading)}
                <ToolModals />
            </div>
        );
    },

// template methods ---------------------------------------------------

    _resume(incomplete, isUploading) {
        if (incomplete && !isUploading) {
            return (
                <div className="resume-upload-tool">
                    <FileSelect resume={true} onChange={this._onFileSelect} />
                </div>
            );
        }
    },

    _runAnalysis(display) {
        if (display) {
            return (
                <div className="run-analysis">
                    <button className="btn-blue" onClick={datasetActions.toggleModal.bind(null, 'jobs')}>
                        <i className="fa fa-tasks"></i> Run Analysis
                    </button>
                </div>
            );
        }
    },

    _snapshotSelect(snapshots) {
        let snapshotOptions = snapshots.map((snapshot) => {
            return (
                <option key={snapshot._id} value={snapshot._id}>
                    {snapshot.isOriginal ? 'Draft' : 'v' + snapshot.snapshot_version + ' (' + moment(snapshot.modified).format('lll') + ')'}
                </option>
            );
        });

        return (
            <div role="presentation" className="snapshot-select" >
                <span>
                    <select value={this.props.selectedSnapshot} onChange={this._selectSnapshot}>
                        <option value="" disabled>Select a snapshot</option>
                        {snapshotOptions}
                    </select>
                </span>
            </div>
        );
    },

    _tools(toolConfig) {
        let tools = toolConfig.map((tool, index) => {
            if (tool.display) {
                return (
                    <div role="presentation" className="tool" key={index}>
                        <WarnButton
                            tooltip={tool.tooltip}
                            icon={tool.icon}
                            prepDownload={tool.prepDownload}
                            action={tool.action}
                            warn={tool.warn}
                            link={tool.link}
                            validations={tool.validations} />
                    </div>
                );
            }
        });
        return tools;
    },

// custom methods -----------------------------------------------------

    _onFileSelect(files) {
        uploadActions.onResume(files, this.props.dataset.label);
    },

    _selectSnapshot(e) {
        let snapshot;
        let snapshotId = e.target.value;
        for (let i = 0; i < this.props.snapshots.length; i++) {
            if (this.props.snapshots[i]._id == snapshotId) {
                snapshot = this.props.snapshots[i];
                break;
            }
        }
        datasetActions.loadSnapshot(snapshot.isOriginal, snapshot._id);
    }

});

export default Tools;