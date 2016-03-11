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
				<Panel className="job" header={job.appId}  key={job.appId} eventKey={job.appId}>
						{this._runs(job)}
				</Panel>
			);
		});

		let header = <h3 className="metaheader">Analyses</h3>;
		return (
			<div className="analyses">
				{jobs.length === 0 ?  null : header }
			<Accordion accordion className="jobs-wrap">
				{this.state.loadingJobs ? <Spinner active={true} /> : jobs}
			</Accordion>
			</div>
    	);
	},

// templates methods --------------------------------------------------

	_runs(job) {
		let runs = job.runs.map((run) => {
			let results, parameters;

			let jobAccordionHeader = (<div className={run.agave.status.toLowerCase()}><span className="badge">{run.agave.status}</span></div>);

			return (
				<Panel className="job" header={jobAccordionHeader}  key={run._id} eventKey={run._id}>
					<p>Run by {run.userId} on {moment(run.agave.created).format('L')}</p>
					{this._parameters(run)}
					{this._results(run)}
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
						<WarnButton
							icon="fa-download"
							tooltip="Download File"
							prepDownload={actions.getResultDownloadTicket.bind(this, run.jobId, result.name)} />
						<span>{result.name}</span>
					</li>
				);
			});

			return (
				<Accordion accordion className="results">
					<Panel className="fadeIn" header="Download Results" key={run._id} eventKey={run._id}>
						<ul>{resultLinks}</ul>
					</Panel>
				</Accordion>
			);
		}
	},

	_parameters(run) {
		if (run.parameters) {
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
					<Panel className="fadeIn" header="Parameters" key={run._id} eventKey={run._id}>
						<ul>{parameters}</ul>
					</Panel>
				</Accordion>
			);
		}
	},

// actions ------------------------------------------------------------

	_downloadResult(jobId, fileName) {
		actions.downloadResult(jobId, fileName);
	},

});

export default Jobs;