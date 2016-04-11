// dependencies -------------------------------------------------------

import React          from 'react';
import Reflux         from 'reflux';
import moment         from 'moment';
import WarnButton     from '../common/forms/warn-button.jsx';
import Share          from './dataset.tools.share.jsx';
import Jobs           from './dataset.tools.jobs.jsx';
import Publish        from './dataset.tools.publish.jsx';
import FileSelect     from '../common/forms/file-select.jsx';
import datasetStore   from './dataset.store';
import userStore      from '../user/user.store.js';
import datasetActions from './dataset.actions.js';
import uploadActions  from '../upload/upload.actions.js';

let Tools = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

    componentDidMount() {
        let dataset = this.state.dataset;
        if (dataset && (dataset.access === 'rw' || dataset.access == 'admin')) {
            datasetActions.loadUsers();
        }
    },

    render() {
        let dataset   = this.state.dataset,
            users     = this.state.users,
            snapshots = this.state.snapshots;

        // permission check shorthands
        let isAdmin      = dataset.access === 'admin',
            // isEditor     = dataset.access === 'rw',
            // isViewer     = dataset.access === 'ro',
            isSignedIn   = !!userStore.hasToken(),
            isPublic     = !!dataset.public,
            isIncomplete = !!dataset.status.incomplete,
            isInvalid    = !!dataset.status.invalid,
            isSnapshot   = !!dataset.original,
            isSuperuser  = window.localStorage.scitranUser ? JSON.parse(window.localStorage.scitranUser).root : null;

        let tools = [
            {
                tooltip: 'Download Dataset',
                icon: 'fa-download',
                prepDownload: datasetActions.getDatasetDownloadTicket.bind(this, this.state.snapshot),
                action: datasetActions.trackDownload,
                display: !isIncomplete
            },
            {
                tooltip: 'Publish Dataset',
                icon: 'fa-globe',
                action: datasetActions.toggleModal.bind(null, 'Publish'),
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
                action: datasetActions.toggleModal.bind(null, 'Share'),
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
                        messageTimeout: 5000
                    }
                ]
            }
        ];

        return (
            <div className="tools clearfix">
                {this._snapshotSelect(snapshots)}
                {this._tools(tools)}
                {this._runAnalysis(isSignedIn && !isIncomplete)}
                {this._resume(isIncomplete)}
                <Share dataset={dataset} users={users} show={this.state.showShareModal} onHide={datasetActions.toggleModal.bind(null, 'Share')}/>
                <Jobs
                    dataset={dataset}
                    apps={this.state.apps}
                    loadingApps={this.state.loadingApps}
                    snapshots={snapshots}
                    show={this.state.showJobsModal}
                    onHide={datasetActions.dismissJobsModal} />
                <Publish
                    dataset={dataset}
                    apps={this.state.apps}
                    loadingApps={this.state.loadingApps}
                    snapshots={snapshots}
                    show={this.state.showPublishModal}
                    onHide={datasetActions.toggleModal.bind(null, 'Publish')} />
            </div>
        );
    },

// template methods ---------------------------------------------------

    _resume(incomplete) {
        if (incomplete) {
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
                    <button className="btn-blue" onClick={datasetActions.toggleModal.bind(null, 'Jobs')}>
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
            <div role="presentation" className="snapshotSelect" >
                <span>
                    <select value={this.state.selectedSnapshot} onChange={this._selectSnapshot}>
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
        uploadActions.onResume(files, this.state.dataset.label);
    },

    _selectSnapshot(e) {
        let snapshot;
        let snapshotId = e.target.value;
        for (let i = 0; i < this.state.snapshots.length; i++) {
            if (this.state.snapshots[i]._id == snapshotId) {
                snapshot = this.state.snapshots[i];
                break;
            }
        }
        datasetActions.loadSnapshot(snapshot.isOriginal, snapshot._id);
    }

});

export default Tools;