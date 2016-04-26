// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions';
import Spinner      from '../common/partials/spinner.jsx';
import { Accordion, Panel } from 'react-bootstrap';
import WarnButton   from '../common/forms/warn-button.jsx';
import moment        from 'moment';

let Jobs = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

    render () {

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
                    <span className="badge">{run.agave.status}</span>
                    <span className="meta">
                        <label>Run on </label><strong>{moment(run.agave.created).format('L')}</strong>
                        {runBy}
                    </span>
                </div>
            );

            return (
                <Panel className="job" header={jobAccordionHeader}  key={run._id} eventKey={run._id}>
                    <span className="inner">
                        {this._parameters(run)}
                        {this._results(run)}
                    </span>
                </Panel>
            );
        });
        return runs;
    },

    _results(run) {
        if (run.results) {
            let resultLinks = run.results.map((result, index) => {
                return (
                    <li key={index}>
                        <span className="warning-btn-wrap">
                        <WarnButton
                            icon="fa-download"
                            prepDownload={actions.getResultDownloadTicket.bind(this, run.jobId, result._links.self.href)} />
                        </span>
                        <span>{result.name}</span>
                    </li>
                );
            });

            return (
                <Accordion accordion className="results">
                    <Panel className="fade-in" header="Download Results" key={run._id} eventKey={run._id}>
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
    },

// actions ------------------------------------------------------------

    _downloadResult(jobId, fileName) {
        actions.downloadResult(jobId, fileName);
    }

});

export default Jobs;