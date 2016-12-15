// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import Spinner      from '../common/partials/spinner.jsx';
import {State}      from 'react-router';
import datasetStore from './dataset.store';
import actions      from './dataset.actions.js';
import MetaData     from './dataset.metadata.jsx';
import Tools        from './dataset.tools.jsx';
import Statuses     from './dataset.statuses.jsx';
import Validation   from './dataset.validation.jsx';
import moment       from 'moment';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';
import FileTree     from '../common/partials/file-tree.jsx';
import Jobs         from './dataset.jobs.jsx';
import userStore    from '../user/user.store.js';
import Summary      from './dataset.summary.jsx';
import FileSelect     from '../common/forms/file-select.jsx';
import uploadActions  from '../upload/upload.actions.js';

let Dataset = React.createClass({

    mixins: [State, Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

    componentWillReceiveProps() {this._loadData();},

    componentDidMount() {this._loadData();},

    _loadData() {
        let params = this.getParams();
        let query  = this.getQuery();
        if (params.snapshotId) {
            actions.trackView(params.snapshotId);
            actions.loadDataset(params.snapshotId, {snapshot: true, appId: query.app, jobId: query.job});
        } else if (
            (params.datasetId && !this.state.dataset) ||
            (params.datasetId && params.datasetId !== this.state.dataset._id)
        ) {
            actions.loadDataset(params.datasetId);
        }
    },

    componentWillUnmount() {
        actions.setInitialState({apps: this.state.apps});
    },

    render() {
        let dataset     = this.state.dataset;
        let snapshots   = this.state.snapshots;
        let showSidebar = this.state.showSidebar;
        let canEdit     = dataset && (dataset.access === 'rw' || dataset.access == 'admin') && !dataset.original;
        let loadingText = typeof this.state.loading == 'string' ? this.state.loading : 'loading';
        let content;

        if (dataset) {
            let errors = dataset.validation.errors;
            let warnings = dataset.validation.warnings;
            content = (
                <div className="clearfix dataset-wrap">
                    <div className="dataset-annimation">
                        <div className="col-xs-12 dataset-inner">
                            <div className="row">
                                <div className="col-xs-6">
                                    <h1 className="clearfix">
                                        <ClickToEdit
                                            value={dataset.label}
                                            label= {dataset.label}
                                            editable={canEdit}
                                            onChange={actions.updateName}/>
                                    </h1>
                                    {this._uploaded(dataset)}
                                    {this._modified(dataset.modified)}
                                    {this._authors(dataset.authors)}
                                    {this._views(dataset.views)}
                                    {this._downloads(dataset.downloads)}
                                    <Summary summary={dataset.summary} />
                                    <div className="status-container">
                                        <Statuses dataset={dataset}/>
                                    </div>
                                    <MetaData dataset={dataset} editable={canEdit} issues={this.state.metadataIssues} />
                                </div>
                                <div className="col-xs-6">
                                    <div>
                                        <Validation errors={errors} warnings={warnings} validating={dataset.status.validating} display={!dataset.status.incomplete} />
                                        <div className="fade-in col-xs-12">
                                            <Jobs />
                                        </div>
                                        {this._incompleteMessage(dataset)}
                                        {this._fileTree(dataset, canEdit)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            let message;
            let status = this.state.status;
            if (status === 404) {message = 'Dataset not found';}
            if (status === 403) {message = 'You are not authorized to view this dataset';}
            content = (
                <div>
                    <h2 className="message-4">{message}</h2>
                </div>
            );
        }

        return (
            <div className={showSidebar ? 'open dataset-container' : 'dataset-container'}>
                {this._leftSidebar(snapshots)}
                {this._showSideBarButton()}
                {!this.state.loading ? this._tools(dataset) : null}
                <div className="fade-in inner-route dataset-route light">
                    {this.state.loading ? <Spinner active={true} text={loadingText}/> : content}
                </div>
            </div>
        );
    },

// template methods ---------------------------------------------------

    _tools(dataset) {
        if (dataset) {
            return(
                <div className="col-xs-12 dataset-tools-wrap">
                    <Tools dataset={dataset}
                            selectedSnapshot={this.state.selectedSnapshot}
                            snapshots={this.state.snapshots} />
                </div>
            );
        }
    },

    _leftSidebar(snapshots) {
        let isSignedIn   = !!userStore.hasToken();
        let snapshotOptions = snapshots.map((snapshot) => {

            if (snapshot.orphaned) {
                return (
                    <li key="orphaned">
                        <a disabled>
                            <div className="clearfix">
                                <div className=" col-xs-12">
                                    <span className="dataset-type text-danger">
                                        Draft dataset has been deleted.
                                    </span>
                                    <span className="icons text-danger">
                                        <span className="published"><i className="fa fa-exclamation-circle"></i></span>
                                    </span>
                                </div>
                            </div>
                        </a>
                    </li>
                );
            }

            let analysisCount;
            if (!snapshot.isOriginal && snapshot.analysisCount > 0) {
                analysisCount = (
                    <span className="job-count">
                        <i className="fa fa-area-chart"></i>
                        <span className="count">{snapshot.analysisCount}</span>
                    </span>
                );
            }

            return (
                <li key={snapshot._id}>
                    <a onClick={actions.loadSnapshot.bind(this, snapshot.isOriginal, snapshot._id)} className={this.state.selectedSnapshot == snapshot._id ? 'active' : null}>
                        <div className="clearfix">
                            <div className=" col-xs-12">
                                <span className="dataset-type">
                                    {snapshot.isOriginal ? 'Draft' : 'v' + snapshot.snapshot_version}
                                </span>
                                <span className="date-modified">
                                    {snapshot.modified ? moment(snapshot.modified).format('ll') : null}
                                </span>
                                <span className="icons">
                                    {snapshot.public && isSignedIn ? <span className="published"><i className="fa fa-globe"></i></span> : null}
                                    {analysisCount}
                                </span>
                            </div>
                        </div>
                    </a>
                </li>
            );
        });

        return (
            <div className="left-sidebar">
                <span className="slide">
                    <div role="presentation" className="snapshot-select" >
                        <span>
                            <h3>Versions</h3>
                            <ul>
                                {snapshotOptions}
                            </ul>
                        </span>
                    </div>
                </span>
            </div>
        );
    },

    _showSideBarButton() {
        let showSidebar = this.state.showSidebar;
        return(
            <span className="show-nav-btn" onClick={actions.toggleSidebar}>
                {showSidebar ?  <i className="fa fa-angle-double-left" aria-hidden="true"></i> : <i className="fa fa-angle-double-right" aria-hidden="true"></i>}
            </span>
        );
    },

    _authors(authors) {
        if (authors.length > 0) {
            let authorString = 'authored by ';
            for (let i = 0; i < authors.length; i++) {
                let author = authors[i];
                authorString += author.name;
                if (authors.length > 1) {
                    if (i < authors.length - 2) {
                        authorString += ', ';
                    } else if (i == authors.length -2) {
                        authorString += ' and ';
                    }
                }
            }
            return <h6>{authorString}</h6>;
        }
    },

    _downloads(downloads) {
        if (downloads) {return <h6>downloads: {downloads}</h6>;}
    },

    _fileTree(dataset, canEdit) {
        if (!dataset.status.incomplete) {
            return (
                <div className="col-xs-12">
                    <div className="file-structure fade-in panel-group">
                        <div className="panel panel-default">
                            <div className="panel-heading" >
                                <h3 className="panel-title">Dataset File Tree</h3>
                            </div>
                            <div className="panel-collapse" aria-expanded="false" >
                                <div className="panel-body">
                                    <FileTree
                                        tree={[dataset]}
                                        editable={canEdit}
                                        loading={this.state.loadingTree}
                                        dismissError={actions.dismissError}
                                        deleteFile={actions.deleteFile}
                                        getFileDownloadTicket={actions.getFileDownloadTicket}
                                        displayFile={actions.displayFile.bind(this, null, null)}
                                        toggleFolder={actions.toggleFolder}
                                        addFile={actions.addFile}
                                        updateFile={actions.updateFile}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    },

    _incompleteMessage(dataset) {
        if (dataset.status.incomplete && (this.state.currentUploadId !== dataset._id)) {
            return (
                <div className="col-xs-12 incomplete-dataset">
                    <div className="incomplete-wrap fade-in panel-group">
                        <div className="panel panel-default status">
                            <div className="panel-heading" >
                                <h4 className="panel-title">
                                    <span className="dataset-status ds-warning">
                                        <i className="fa fa-warning"></i> Incomplete
                                    </span>
                                    <FileSelect resume={true} onChange={this._onFileSelect} />
                                </h4>
                            </div>
                            <div className="panel-collapse" aria-expanded="false" >
                                <div className="panel-body">
                                    You will have limited functionality on this dataset until it is completed. Please click resume to finish uploading.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    },

// custom methods -----------------------------------------------------

    _modified(modified) {
        let dateModified = moment(modified).format('L');
        let timeago      = moment(modified).fromNow(true);
        return <h6>{'last modified ' + dateModified + ' - ' + timeago + ' ago'}</h6>;
    },

    _uploaded(dataset) {
        let user        = dataset ? dataset.user : null;
        let dateCreated = dataset.created;
        let dateAdded  = moment(dateCreated).format('L');
        let timeago    = moment(dateCreated).fromNow(true);
        return <h6>{'uploaded ' + (user ? 'by ' + user.firstname + ' ' + user.lastname : '') +  ' on ' + dateAdded + ' - ' + timeago + ' ago'}</h6>;
    },

    _views(views) {
        if (views) {return <h6>views: {views}</h6>;}
    },

    _onFileSelect(files) {
        uploadActions.onResume(files, this.state.dataset.label);
    }

});

export default Dataset;