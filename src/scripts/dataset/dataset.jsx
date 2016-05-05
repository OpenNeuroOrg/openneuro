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
import FileTree     from './dataset.file-tree.jsx';
import Jobs         from './dataset.jobs.jsx';
import UpdateWarn   from './dataset.update-warning.jsx';
import userStore    from '../user/user.store.js';


let Dataset = React.createClass({

    mixins: [State, Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

    componentWillReceiveProps() {
        let params = this.getParams();
        if (params.snapshotId) {
            actions.trackView(params.snapshotId);
            actions.loadDataset(params.snapshotId, {snapshot: true});
        } else if (params.datasetId && this.state.dataset && params.datasetId !== this.state.dataset._id) {
            actions.loadDataset(params.datasetId);
        }
    },

    componentDidMount() {
        let params = this.getParams();
        if (params.snapshotId) {
            actions.trackView(params.snapshotId);
            actions.loadDataset(params.snapshotId, {snapshot: true});
        } else if (params.datasetId) {
            actions.loadDataset(params.datasetId);
        }
    },

    componentWillUnmount() {
        actions.setInitialState({apps: this.state.apps});
    },

    render() {
        let dataset = this.state.dataset;
        let showSidebar = this.state.showSidebar;
        let tree    = this.state.datasetTree;
        let canEdit = dataset && (dataset.access === 'rw' || dataset.access == 'admin') && !dataset.original;
        let content;

        if (dataset) {
            let errors = dataset.validation.errors;
            let warnings = dataset.validation.warnings;
            content = (
                <div className="clearfix dataset-wrap">
                    <div className="dataset-annimation">
                        <div className="col-xs-12 dataset-tools-wrap">
                            <Tools dataset={dataset}
                                   selectedSnapshot={this.state.selectedSnapshot}
                                   snapshots={this.state.snapshots}
                                   showSidebar={showSidebar} />
                        </div>
                        <div className="col-xs-12 dataset-inner">
                            <div className="row">
                                <div className="col-xs-7">
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
                                    <div className="status-container">
                                        <Statuses dataset={dataset} />
                                    </div>
                                    <MetaData dataset={dataset} editable={canEdit} issues={this.state.metadataIssues} />
                                </div>
                                <div className="col-xs-5">
                                    <div>
                                        <Validation errors={errors} warnings={warnings} validating={dataset.status.validating} display={!dataset.status.incomplete} />
                                        <div className="fade-in col-xs-12">
                                            <Jobs />
                                        </div>
                                        {this._incompleteMessage(dataset)}
                                        {this._fileTree(dataset, tree, canEdit)}
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
                <div className="fade-in inner-route dataset-route light">
                        {this._leftSidebar(showSidebar)}
                        {this.state.loading ? <Spinner active={true} /> : content}
                    <UpdateWarn show={this.state.modals.update} onHide={actions.toggleModal.bind(null, 'update')} update={this.state.currentUpdate} />
                </div>
            </div>
        );
    },

// template methods ---------------------------------------------------

    _leftSidebar(showSidebar) {
        return (
            <div className="left-sidebar">
                <span className="slide">
                    {this._snapshotSelect(this.state.snapshots)}
                </span>
            </div>
        );
    },

    _snapshotSelect(snapshots) {
        let isSignedIn   = !!userStore.hasToken();
        let snapshotOptions = snapshots.map((snapshot) => {

            return (
                <li key={snapshot._id}>
                    <a onClick={this._selectSnapshot.bind(this, snapshot._id)} className={this.state.selectedSnapshot == snapshot._id ? 'active' : null}>
                        <div className="clearfix">
                            <div className=" col-xs-8">
                                <span className="dataset-type">
                                    {snapshot.isOriginal ? 'Draft' : 'v' + snapshot.snapshot_version}
                                </span>

                                <span className="date-modified">
                                    <span className="update-label">{snapshot.isOriginal ? 'updated: ' : 'created: '}</span>
                                    {moment(snapshot.modified).format('ll')}
                                </span>
                            </div>
                            <div className="icons col-xs-4">
                                {snapshot.public && isSignedIn ? <span className="published"><i className="fa fa-globe"></i></span> : null}
                                <span className="job-count"><i className="fa fa-tasks"></i><span className="count">({this.state.jobs.length})</span></span>
                            </div>
                        </div>
                    </a>
                </li>
            );
        });

        return (
            <div role="presentation" className="snapshot-select" >
                <span>
                    <h3>Versions</h3>
                    <ul>
                        {snapshotOptions}
                    </ul>
                </span>
            </div>
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

    _fileTree(dataset, tree, canEdit) {
        tree = tree ? tree : [dataset];
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
                                    <FileTree tree={tree} editable={canEdit} loading={this.state.loadingTree}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    },

    _incompleteMessage(dataset) {
        if (dataset.status.incomplete) {
            return (
                <div className="col-xs-12">
                    <div className="file-structure fade-in panel-group">
                        <div className="panel panel-default">
                            <div className="panel-heading" >
                                <h4 className="panel-title">Incomplete</h4>
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



// custom methods ---------------------------------------------------

    _selectSnapshot(snapshotId) {
        let snapshot;
        // let snapshotId = e.target.value;
        for (let i = 0; i < this.state.snapshots.length; i++) {
            if (this.state.snapshots[i]._id == snapshotId) {
                snapshot = this.state.snapshots[i];
                break;
            }
        }

        actions.loadSnapshot(snapshot.isOriginal, snapshot._id);
    }


});

export default Dataset;