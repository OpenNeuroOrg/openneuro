// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions';
import Spinner      from '../common/partials/spinner.jsx';
import { Accordion, Panel } from 'react-bootstrap';
import WarnButton   from '../common/forms/warn-button.jsx';
import moment       from 'moment';
import pluralize    from 'pluralize';

let Jobs = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

    render () {
        if (!this.state.dataset.original) {
            return false;
        }

        let jobs = this.state.jobs.map((job) => {
            return (
                <Panel className="jobs" header={job.appLabel + ' - v' + job.appVersion}  key={job.appId} eventKey={job.appId}>
                        {this._runs(job)}
                </Panel>
            );
        });

        let header = <h3 className="metaheader">Analyses</h3>;
        return (
            <div className="analyses">
                {jobs.length === 0 ?  null : header }
                <Accordion accordion className="jobs-wrap">
                    {this.state.loadingJobs ? <Spinner active={true} text="Loading Analyses" /> : jobs}
                </Accordion>
            </div>
        );
    },

// templates methods --------------------------------------------------

    _runs(job) {
        let runs = job.runs.map((run) => {
            let runBy = run.userId ? <span><label> by </label><strong>{run.userId}</strong></span> : null;

            let jobAccordionHeader = (
                <div className={run.agave.status.toLowerCase()}>
                    <label>Status</label>
                    <span className="badge">
                        {run.agave.status}
                    </span>
                    <span className="meta">
                        <label>Run on </label><strong>{moment(run.agave.created).format('L')}</strong>
                        {runBy}
                    </span>
                    {this._failedMessage(run)}
                </div>
            );

            if ((run.parameters && Object.keys(run.parameters).length > 0) || (run.results && run.results.length > 0)) {
                // header with parameters and/or results
                return (
                    <span key={run._id} eventKey={run._id}>
                        <Panel className="job" header={jobAccordionHeader}>
                            <span className="inner">
                                {this._parameters(run)}
                                {this._results(run)}
                            </span>
                        </Panel>
                    </span>
                );
            } else {
                // header only
                return (
                    <span key={run._id} eventKey={run._id}>
                        <div className="job panel panel-default">
                            <div className="panel-heading" >
                                <div className="panel-title pending">
                                    {jobAccordionHeader}
                                </div>
                            </div>
                        </div>
                    </span>
                );
            }
        });

        return runs;
    },

    _failedMessage(run) {
        if (run.agave.status === 'FAILED') {
            let adminMessage = <span>Please contact the site <a href="mailto:openfmri@gmail.com?subject=Analysis%20Failure" target="_blank">administrator</a> if this analysis continues to fail.</span>;
            let message = run.agave.message ? run.agave.message : 'We were unable to complete this analysis.'
            return (
                <div>
                    <h5 className="text-danger">{message} {adminMessage}</h5>
                    <WarnButton
                        icon="fa fa-repeat"
                        message="re-run"
                        warn={false}
                        action={actions.retryJob.bind(this, run.jobId)} />
                </div>
            );
        }
    },

    _results(run) {
        if (run.results && run.results.length > 0) {
            let resultLinks = run.results.map((result, index) => {
                let displayBtn;
                if (result.name.indexOf('.err') > -1 || result.name.indexOf('.out') > -1) {
                    displayBtn = (
                        <WarnButton
                            icon="fa-eye"
                            warn={false}
                            message=" VIEW"
                            action={actions.displayFile.bind(this, run.jobId, result._links.self.href, result.name)} />
                    );
                }
                return (
                    <li key={index}>
                        <span className="result-name">{result.name}</span>
                        <div className="result-options">
                            <span className="warning-btn-wrap">
                                <WarnButton
                                icon="fa-download"
                                message=" DOWNLOAD"
                                prepDownload={actions.getResultDownloadTicket.bind(this, run.jobId, result._links.self.href)} />
                            </span>
                            {displayBtn}
                        </div>
                    </li>
                );
            });

            return (
                <Accordion accordion className="results">
                    <Panel className="fade-in" header="Download Results" key={run._id} eventKey={run._id}>
                        <WarnButton
                            icon="fa-download"
                            message=" DOWNLOAD All"
                            prepDownload={actions.getResultDownloadTicket.bind(this, run.jobId, 'all')} />
                        <ul>{resultLinks}</ul>
                    </Panel>
                </Accordion>
            );
        }
    },

    _parameters(run) {
        if (run.parameters && Object.keys(run.parameters).length > 0) {
            let parameters = [];
            for (let key in run.parameters) {
                parameters.push(
                    <li key={key}>
                        <span>{key}</span>: <span>{run.parameters[key]}</span>
                    </li>
                );
            }

            return (
                <Accordion accordion className="results">
                    <Panel className="fade-in" header="Parameters" key={run._id} eventKey={run._id}>
                        <ul>{parameters}</ul>
                    </Panel>
                </Accordion>
            );
        }
    }

});

export default Jobs;