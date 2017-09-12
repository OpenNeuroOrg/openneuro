// dependencies -------------------------------------------------------

import React         from 'react';
import Reflux        from 'reflux';
import Actions       from './dashboard.jobs.actions';
import JobsStore     from './dashboard.jobs.store.js';
import {State, Link} from 'react-router';
import moment        from 'moment';
import {PanelGroup}  from 'react-bootstrap';
import Spinner       from '../common/partials/spinner.jsx';
import Sort          from './dashboard.sort.jsx';
import Select        from 'react-select';

import bids          from '../utils/bids';

let Jobs = React.createClass({

    mixins: [State, Reflux.connect(JobsStore)],

// life cycle events --------------------------------------------------
    componentDidMount() {
        let isPublic = this.getPath().indexOf('dashboard') === -1;
        let query = this.getQuery();
        let selectedPipeline = typeof query.pipeline != 'undefined' && query.pipeline || null;
        Actions.update({isPublic});
        Actions.getJobs(isPublic, {pipeline: selectedPipeline, version: null});
    },

    render () {
        let isPublic = this.state.isPublic;
        let jobs = this.state.visiblejobs.length === 0 ? <div className="col-xs-12"><h3>no results please try again</h3></div> : this._jobs(this.state.visiblejobs) ;
        return (
            <div>
                <div className="dashboard-dataset-teasers datasets datasets-private">
                    <div className="header-filter-sort clearfix">
                        <div className="header-wrap clearfix">
                            <div className="row">
                                <div className="col-md-5"><h2>{!isPublic ? 'My' : 'Public'} Analyses</h2></div>
                                <div className="col-md-7">{this._filter()}</div>
                            </div>
                        </div>
                        <div className="filters-sort-wrap clearfix">
                            <Sort options={this.state.sortOptions}
                                  sort={this.state.sort}
                                  sortFunc={Actions.sort} />
                        </div>
                    </div>
                    <PanelGroup>
                        <div className="clearfix">{this.state.loading ? <Spinner active={true} /> : jobs}</div>
                    </PanelGroup>
                </div>
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _filter() {
        if (!this.state.appsLoading) {
            return (
                <div>
                    <div className={this.state.filter.pipeline === '' || this.state.filter.pipeline === null ? 'apps-filter col-md-8' : 'apps-filter col-md-8 app-selected'}>
                        <Select simpleValue value={this.state.filter.pipeline} placeholder="Filter By App" options={this.state.apps} onChange={Actions.selectPipelineFilter} />
                    </div>
                    {this._selectVersions()}
                </div>
            );
        }
    },

    _selectVersions(){
        return (
            <div className="versions-filter col-md-4 fade-in">
                <Select multi simpleValue value={this.state.filter.version} placeholder={this.state.filter.pipeline === '' || this.state.filter.pipeline === null ? 'Choose App to see Versions' : 'App Versions'} options={this.state.appVersionGroup} onChange={Actions.selectPipelineVersionFilter} />
            </div>
        );
    },

    _jobs(paginatedResults) {
        return paginatedResults.map((job) => {
            let user      = job.userId;
            let dateAdded = moment(job.analysis.created).format('L');
            let timeago   = moment(job.analysis.created).fromNow(true);
            return (
                <div className="fade-in  panel panel-default" key={job._id}>
                    <div className="panel-heading">
                        <div className="header clearfix" id={job.analysis.status}>
                            <Link to={'snapshot'} params={{datasetId: bids.decodeId(job.datasetId), snapshotId: bids.decodeId(job.snapshotId)}} query={{app: job.appLabel, version: job.appVersion, job: job.jobId}}>
                                <h4 className="dataset-name">{job.appLabel} - v{job.appVersion}</h4>
                            </Link>
                            <div className="status-container">
                                <div className="pull-right">Status: {job.analysis.status}</div>
                            </div>
                        </div>
                        <div className="minimal-summary">
                            <div className="summary-data">
                                <span> Job run <strong>{dateAdded} - {timeago} ago</strong></span>
                            </div>
                            <div className="summary-data">
                                <span>on dataset <strong>{job.datasetLabel}</strong></span>
                            </div>
                            <div className="summary-data">
                                <span>{user ? 'by ' : ''}<strong>{user}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

});

export default Jobs;
