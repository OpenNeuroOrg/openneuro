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

let Jobs = React.createClass({

    mixins: [State, Reflux.connect(JobsStore)],

// life cycle events --------------------------------------------------

    componentDidMount() {
        let isPublic = this.getPath().indexOf('dashboard') === -1;
        Actions.update({isPublic});
        Actions.getJobs(isPublic);
    },

    render () {
        return (
            <div>
                <div className="dashboard-dataset-teasers datasets datasets-private">
                    <div className="header-filter-sort clearfix">
                        <div className="header-wrap clearfix">
                             <h2>My Analyses</h2>
                        </div>
                        <div className="filters-sort-wrap clearfix">
                            <Sort options={this.state.sortOptions}
                                  sort={this.state.sort}
                                  sortFunc={Actions.sort} />

                            {this._filter()}

                        </div>
                    </div>
                    <PanelGroup>
                        {this.state.loading ? <Spinner active={true} /> : this._jobs(this.state.visiblejobs)}
                    </PanelGroup>
                </div>
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _filter() {
        /**
         * Instead of loading this data from the apps endpoint have the server return a list of every
         * app/version returned in the list of jobs.
         */
        let appNames = [
            {label: 'FREESURFER (cappat @ slurm-sherlock.stanford.edu)', value: 'FREESURFER (cappat @ slurm-sherlock.stanford.edu)'},
            {label: 'MRIQC-SINGULARITY (cappat @ slurm-stampede.tacc.utexas.edu)', value: 'MRIQC-SINGULARITY (cappat @ slurm-stampede.tacc.utexas.edu)'},
            {label: 'STAMPEDE-EXAMPLE (cappat @ slurm-stampede.tacc.utexas.edu)', value: 'STAMPEDE-EXAMPLE (cappat @ slurm-stampede.tacc.utexas.edu)'},
            {label: 'FREESURFER-STAMPEDE (cappat @ slurm-stampede.tacc.utexas.edu)', value: 'FREESURFER-STAMPEDE (cappat @ slurm-stampede.tacc.utexas.edu)'},
            {label: 'MRIQC (bare-metal @ ls5)', value: 'MRIQC (bare-metal @ ls5)'},
            {label:'EXAMPLE (cappat @ slurm-sherlock.stanford.edu)', value:'EXAMPLE (cappat @ slurm-sherlock.stanford.edu)'}
        ];
        if (this.state.appsLoading) {
            return <span>Loading</span>;
        } else {
            return (
                <div className="filters">
                    <label>Filter By:</label>
                    <Select simpleValue value={this.state.pipelineNameFilter} placeholder="Pipeline Name" options={appNames} onChange={Actions.selectPipelineFilter} />
                </div>
            );
        }
    },

    _jobs(paginatedResults) {
        return paginatedResults.map((job) => {
            let user      = job.userId;
            let dateAdded = moment(job.agave.created).format('L');
            let timeago   = moment(job.agave.created).fromNow(true);
            return (
                <div className="fade-in  panel panel-default" key={job._id}>
                    <div className="panel-heading">
                        <div className="header clearfix">
                            <Link to={'snapshot'} params={{datasetId: job.datasetId, snapshotId: job.snapshotId}} query={{app: job.appId, job: job.jobId}}>
                                <h4 className="dataset-name">{job.appLabel} - v{job.appVersion} - {job.datasetLabel}</h4>
                                <div className="meta-container">
                                    <p className="date">uploaded {user ? 'by ' : ''}<span className="name">{user}</span> on <span className="time-ago">{dateAdded} - {timeago} ago</span></p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            );
        });
    }

});

export default Jobs;
