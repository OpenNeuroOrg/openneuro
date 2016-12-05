// dependencies -------------------------------------------------------

import React          from 'react';
import Reflux         from 'reflux';
import moment         from 'moment';
import actions        from './dataset.actions.js';
import WarnButton     from '../common/forms/warn-button.jsx';
import uploadStore    from '../upload/upload.store';
import userStore      from '../user/user.store.js';
import datasetActions from './dataset.actions.js';
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
            snapshots   = this.props.snapshots;

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
                icon: 'fa-globe icon-plus',
                action: datasetActions.toggleModal.bind(null, 'publish'),
                display: isAdmin && !isPublic && !isIncomplete,
                warn: false
            },
            {
                tooltip: 'Unpublish Dataset',
                icon: 'fa-globe icon-ban',
                action: datasetActions.publish.bind(this, dataset._id, false),
                display: isPublic && isSuperuser,
                warn: true
            },
            {
                tooltip: isSnapshot ? 'Delete Snapshot' : 'Delete Dataset',
                icon: 'fa-trash',
                action: datasetActions.deleteDataset.bind(this, dataset._id),
                display: (isAdmin && !isPublic) || isSuperuser,
                warn: isSnapshot
            },
            {
                tooltip: 'Share Dataset',
                icon: 'fa-user icon-plus',
                action: datasetActions.toggleModal.bind(null, 'share'),
                display: isAdmin && !isSnapshot && !isIncomplete,
                warn: false
            },
            {
                tooltip: 'Create Snapshot',
                icon: 'fa-camera-retro icon-plus',
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
            },
            {
                tooltip: 'Run Anaylsis',
                icon: 'fa-area-chart icon-plus',
                action: datasetActions.toggleModal.bind(null, 'jobs'),
                display: isSignedIn && !isIncomplete,
                warn: false
            }
        ];

        return (
            <div className="tools clearfix">
                {this._snapshotLabel(dataset)}
                {this._tools(tools)}
                <ToolModals />
            </div>
        );
    },

// template methods ---------------------------------------------------

    _snapshotLabel(dataset) {
        return(
            <div className="snapshot-select-label" >
                <div className={!dataset.original ? 'draft' : 'snapshot'} onClick={actions.toggleSidebar}>
                    {!dataset.original ? 'Draft' : 'Snapshot v' + dataset.snapshot_version}
                </div>
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
    }

});

export default Tools;